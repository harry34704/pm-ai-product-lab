import { z } from "zod";
import { fail, ok } from "@/lib/http";
import { addTranscriptEvent } from "@/lib/server/practice";

const schema = z.object({
  sessionId: z.string().min(1),
  event: z.object({
    speakerLabel: z.string().min(1),
    role: z.enum(["CANDIDATE", "INTERVIEWER", "SYSTEM"]),
    text: z.string().min(1),
    timestampMs: z.number().int()
  })
});

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const result = await addTranscriptEvent(input);
    return ok(result);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unable to save transcript event.");
  }
}
