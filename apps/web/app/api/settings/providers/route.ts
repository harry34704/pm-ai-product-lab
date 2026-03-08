import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { fail, ok } from "@/lib/http";
import { deleteUserData, getProviderStatus, updateSettings } from "@/lib/server/settings";

const schema = z.object({
  action: z.string().optional(),
  aiProviderPriority: z.array(z.string()).optional(),
  defaultModel: z.string().optional(),
  transcriptionProvider: z.string().optional(),
  coachingLevel: z.string().optional(),
  localOnlyMode: z.boolean().optional(),
  storeAudio: z.boolean().optional(),
  darkMode: z.boolean().optional()
});

export async function GET() {
  try {
    const user = await requireUser();
    const data = await getProviderStatus(user.id);
    return ok(data);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }

    return fail(error instanceof Error ? error.message : "Unable to load settings.");
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const input = schema.parse(await request.json());

    if (input.action === "delete-data") {
      const settings = await deleteUserData(user.id);
      return ok({ settings });
    }

    const settings = await updateSettings(user.id, input);
    return ok({ settings });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }

    return fail(error instanceof Error ? error.message : "Unable to update settings.");
  }
}
