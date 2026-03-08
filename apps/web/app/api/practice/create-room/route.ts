import { z } from "zod";
import { ParticipantRole } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { createPracticeRoom } from "@/lib/server/practice";

const schema = z.object({
  title: z.string().min(3),
  durationMinutes: z.number().int().refine((value) => [15, 30, 45, 60].includes(value)),
  displayName: z.string().min(2),
  role: z.enum(["CANDIDATE", "INTERVIEWER"])
});

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const input = schema.parse(await request.json());
    const room = await createPracticeRoom(user.id, {
      ...input,
      role: input.role as ParticipantRole
    });
    return ok({ room });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }

    return fail(error instanceof Error ? error.message : "Unable to create room.");
  }
}
