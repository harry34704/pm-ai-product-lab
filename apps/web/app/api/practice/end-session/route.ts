import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { endPracticeSession } from "@/lib/server/practice";

const schema = z.object({
  sessionId: z.string().min(1)
});

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const input = schema.parse(await request.json());
    const review = await endPracticeSession(input.sessionId, user.id);
    return ok({ review });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }

    return fail(error instanceof Error ? error.message : "Unable to end session.");
  }
}
