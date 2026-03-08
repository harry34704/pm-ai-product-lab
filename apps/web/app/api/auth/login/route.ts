import { z } from "zod";
import { db } from "@/lib/db";
import { fail, ok } from "@/lib/http";
import { setSessionCookie, verifyPassword } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const user = await db.user.findUnique({ where: { email: input.email } });

    if (!user) {
      return fail("Invalid credentials.", 401);
    }

    const valid = await verifyPassword(input.password, user.passwordHash);
    if (!valid) {
      return fail("Invalid credentials.", 401);
    }

    await setSessionCookie(user.id);
    return ok({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Login failed.", 400);
  }
}
