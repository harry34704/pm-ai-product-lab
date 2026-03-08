import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { fail, ok } from "@/lib/http";

const schema = z.object({
  name: z.string().min(2),
  targetRole: z.string().optional(),
  seniority: z.string().optional(),
  industries: z.array(z.string()).default([]),
  answerTone: z.string().optional(),
  introStyle: z.string().optional()
});

export async function GET() {
  try {
    const user = await requireUser();
    return ok({ user });
  } catch {
    return fail("Unauthorized", 401);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const input = schema.parse(await request.json());

    const updated = await db.user.update({
      where: { id: user.id },
      data: {
        name: input.name,
        profile: {
          upsert: {
            create: {
              targetRole: input.targetRole,
              seniority: input.seniority,
              industries: input.industries,
              answerTone: input.answerTone,
              introStyle: input.introStyle
            },
            update: {
              targetRole: input.targetRole,
              seniority: input.seniority,
              industries: input.industries,
              answerTone: input.answerTone,
              introStyle: input.introStyle
            }
          }
        }
      },
      include: { profile: true }
    });

    return ok({ user: updated });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }

    return fail(error instanceof Error ? error.message : "Unable to update profile.");
  }
}
