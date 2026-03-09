import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { updateResume } from "@/lib/server/resumes";

const schema = z.object({
  title: z.string().min(1),
  rawText: z.string().min(20),
  parsedJson: z.unknown()
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const input = schema.parse(await request.json());
    const resume = await updateResume(user.id, id, input);
    return ok({ resume });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }

    return fail(error instanceof Error ? error.message : "Unable to update resume.");
  }
}
