import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { updateJobDescription } from "@/lib/server/jobs";

const schema = z.object({
  title: z.string().min(1),
  company: z.string().optional(),
  rawText: z.string().min(30),
  parsedJson: z.unknown()
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser();
    const input = schema.parse(await request.json());
    const job = await updateJobDescription(user.id, params.id, input);
    return ok({ job });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }

    return fail(error instanceof Error ? error.message : "Unable to update job description.");
  }
}
