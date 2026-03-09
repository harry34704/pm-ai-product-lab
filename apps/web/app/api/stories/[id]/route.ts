import { requireUser } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { updateStory } from "@/lib/server/stories";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const payload = await request.json();
    const story = await updateStory(user.id, id, payload);
    return ok({ story });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }

    return fail(error instanceof Error ? error.message : "Unable to update story.");
  }
}
