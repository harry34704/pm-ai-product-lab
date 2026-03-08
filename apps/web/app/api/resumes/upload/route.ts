export const runtime = "nodejs";

import { requireUser } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { extractTextFromFile, validateUpload } from "@/lib/uploads";
import { createResume } from "@/lib/server/resumes";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return fail("Resume file is required.");
    }

    validateUpload(file, "resume");
    const rawText = await extractTextFromFile(file);
    const result = await createResume(user.id, {
      rawText,
      originalFileName: file.name
    });

    return ok(result);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }

    return fail(error instanceof Error ? error.message : "Resume upload failed.");
  }
}
