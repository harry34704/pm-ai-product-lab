import { fail, ok } from "@/lib/http";
import { getPracticeRoomState } from "@/lib/server/practice";

export async function GET(_request: Request, { params }: { params: { roomId: string } }) {
  try {
    const room = await getPracticeRoomState(params.roomId);
    return ok({ room });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unable to load room.");
  }
}
