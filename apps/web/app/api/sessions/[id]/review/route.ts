import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { fail, ok } from "@/lib/http";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const session = await db.session.findFirst({
      where: {
        id,
        candidateUserId: user.id
      },
      include: {
        feedbackReport: true,
        answers: {
          include: { question: true },
          orderBy: { createdAt: "asc" }
        }
      }
    });

    if (!session) {
      return fail("Session not found.", 404);
    }

    return ok({ session });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }

    return fail(error instanceof Error ? error.message : "Unable to load session review.");
  }
}
