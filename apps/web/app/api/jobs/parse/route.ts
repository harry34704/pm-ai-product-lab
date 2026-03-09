export const runtime = "nodejs";
export const maxDuration = 60;

import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { deleteStoredObjects, downloadStoredObject } from "@/lib/object-storage";
import { extractTextFromBuffer, extractTextFromFile, validateUpload, validateUploadMetadata } from "@/lib/uploads";
import { createJobDescription } from "@/lib/server/jobs";

const uploadedObjectSchema = z.object({
  title: z.string().optional(),
  company: z.string().optional(),
  storageKey: z.string().min(1),
  originalFileName: z.string().min(1),
  mimeType: z.string().min(1),
  fileSizeBytes: z.number().int().positive(),
  storageProvider: z.string().optional(),
  storageBucket: z.string().optional(),
  storageUrl: z.string().nullable().optional()
});

export async function POST(request: Request) {
  let uploadedStorageKey: string | null = null;

  try {
    const user = await requireUser();
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const input = uploadedObjectSchema.parse(await request.json());
      uploadedStorageKey = input.storageKey;

      validateUploadMetadata(
        {
          mimeType: input.mimeType,
          size: input.fileSizeBytes
        },
        "job"
      );

      const stored = await downloadStoredObject(input.storageKey);
      const rawText = await extractTextFromBuffer(stored.buffer, input.mimeType);
      const result = await createJobDescription(user.id, {
        title: input.title,
        company: input.company,
        rawText,
        originalFileName: input.originalFileName,
        sourceMimeType: input.mimeType,
        fileSizeBytes: input.fileSizeBytes,
        storageProvider: input.storageProvider ?? stored.storageProvider,
        storageBucket: input.storageBucket ?? stored.storageBucket,
        storageKey: input.storageKey,
        storageUrl: input.storageUrl ?? stored.storageUrl
      });

      return ok(result);
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const title = String(formData.get("title") ?? "");
    const company = String(formData.get("company") ?? "");

    if (!(file instanceof File)) {
      return fail("Job description file is required.");
    }

    validateUpload(file, "job");
    const rawText = await extractTextFromFile(file);
    const result = await createJobDescription(user.id, {
      title,
      company,
      rawText,
      originalFileName: file.name,
      sourceMimeType: file.type,
      fileSizeBytes: file.size
    });

    return ok(result);
  } catch (error) {
    if (uploadedStorageKey) {
      await deleteStoredObjects([uploadedStorageKey]);
    }

    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }

    return fail(error instanceof Error ? error.message : "Unable to parse job description.");
  }
}
