import { fail, ok } from "@/lib/http";
import { getPracticeRoomState } from "@/lib/server/practice";

export async function GET(_request: Request, { params }: { params: Promise<{ roomId: string }> }) {
  try {
    const { roomId } = await params;
    const room = await getPracticeRoomState(roomId);
    return ok({ room });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unable to load room.");
  }
}
