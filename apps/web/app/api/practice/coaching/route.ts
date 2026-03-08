import { getCurrentUser } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { getCoachingForSession } from "@/lib/server/practice";

export async function GET(request: Request) {
  try {
    const sessionId = new URL(request.url).searchParams.get("sessionId");
    if (!sessionId) {
      return fail("Session ID is required.");
    }

    const currentUser = await getCurrentUser();
    const hints = await getCoachingForSession(sessionId, currentUser?.id);
    return ok({ hints });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unable to generate coaching.");
  }
}
