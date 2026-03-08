import { z } from "zod";
import { parseResume } from "@mockroom/shared";
import { requireUser } from "@/lib/auth";
import { fail, ok } from "@/lib/http";

const schema = z.object({
  rawText: z.string().min(20)
});

export async function POST(request: Request) {
  try {
    await requireUser();
    const input = schema.parse(await request.json());
    return ok({ parsed: parseResume(input.rawText) });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }

    return fail(error instanceof Error ? error.message : "Unable to parse resume.");
  }
}
