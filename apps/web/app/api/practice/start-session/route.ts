import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { startPracticeSession } from "@/lib/server/practice";

const schema = z.object({
  roomId: z.string().min(1)
});

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const input = schema.parse(await request.json());
    const room = await startPracticeSession(input.roomId, user.id);
    return ok({ room });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }

    return fail(error instanceof Error ? error.message : "Unable to start session.");
  }
}
