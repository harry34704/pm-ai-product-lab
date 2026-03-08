import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { createJobDescription } from "@/lib/server/jobs";

const schema = z.object({
  title: z.string().optional(),
  company: z.string().optional(),
  rawText: z.string().min(30)
});

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const input = schema.parse(await request.json());
    const result = await createJobDescription(user.id, input);
    return ok(result);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }

    return fail(error instanceof Error ? error.message : "Unable to save job description.");
  }
}
