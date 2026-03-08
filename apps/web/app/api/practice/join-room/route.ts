import { z } from "zod";
import { ParticipantRole } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { joinPracticeRoom } from "@/lib/server/practice";

const schema = z.object({
  roomId: z.string().optional(),
  roomCode: z.string().optional(),
  displayName: z.string().min(2),
  role: z.enum(["CANDIDATE", "INTERVIEWER"])
});

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const input = schema.parse(await request.json());
    const room = await joinPracticeRoom({
      ...input,
      role: input.role as ParticipantRole,
      userId: currentUser?.id ?? null
    });
    return ok({ room });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unable to join room.");
  }
}
