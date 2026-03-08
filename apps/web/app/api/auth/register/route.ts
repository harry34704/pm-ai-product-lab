import { z } from "zod";
import { db } from "@/lib/db";
import { fail, ok } from "@/lib/http";
import { hashPassword, setSessionCookie } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8)
});

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const existing = await db.user.findUnique({ where: { email: input.email } });

    if (existing) {
      return fail("Email already registered.", 409);
    }

    const user = await db.user.create({
      data: {
        email: input.email,
        name: input.name,
        passwordHash: await hashPassword(input.password),
        profile: {
          create: {}
        },
        settings: {
          create: {
            aiProviderPriority: ["mock", "openai", "groq", "openrouter", "ollama"],
            defaultModel: "mock-1",
            transcriptionProvider: "browser",
            coachingLevel: "balanced",
            localOnlyMode: true,
            storeAudio: false,
            darkMode: true
          }
        }
      }
    });

    await setSessionCookie(user.id);
    return ok({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Registration failed.", 400);
  }
}
