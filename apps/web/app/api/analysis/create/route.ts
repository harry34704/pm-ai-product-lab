import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { createAnalysisReport } from "@/lib/server/analysis";

const schema = z.object({
  resumeId: z.string().min(1),
  jobDescriptionId: z.string().min(1)
});

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const input = schema.parse(await request.json());
    const analysis = await createAnalysisReport(user.id, input.resumeId, input.jobDescriptionId);
    return ok({ analysis });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }

    return fail(error instanceof Error ? error.message : "Unable to create analysis report.");
  }
}
