import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { extractStoriesForUser } from "@/lib/server/stories";

const schema = z.object({
  resumeId: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const input = schema.parse(await request.json());
    const stories = await extractStoriesForUser(user.id, input.resumeId);
    return ok({ stories });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }

    return fail(error instanceof Error ? error.message : "Unable to extract stories.");
  }
}
