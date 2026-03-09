export const runtime = "nodejs";
export const maxDuration = 30;

import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { createPresignedUpload } from "@/lib/object-storage";
import { validateUploadMetadata } from "@/lib/uploads";

const schema = z.object({
  kind: z.enum(["resume", "job"]),
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
  size: z.number().int().positive()
});

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const input = schema.parse(await request.json());

    validateUploadMetadata(
      {
        mimeType: input.mimeType,
        size: input.size
      },
      input.kind
    );

    const upload = await createPresignedUpload({
      kind: input.kind,
      userId: user.id,
      fileName: input.fileName,
      mimeType: input.mimeType
    });

    return ok({ upload });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }

    return fail(error instanceof Error ? error.message : "Could not prepare file upload.");
  }
}
