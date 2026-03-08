export const runtime = "nodejs";

import { requireUser } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { extractTextFromFile, validateUpload } from "@/lib/uploads";
import { createJobDescription } from "@/lib/server/jobs";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
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
      rawText
    });

    return ok(result);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }

    return fail(error instanceof Error ? error.message : "Unable to parse job description.");
  }
}
