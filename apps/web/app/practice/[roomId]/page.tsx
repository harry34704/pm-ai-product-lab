import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { PracticeRoomScreen } from "@/components/practice/practice-room-screen";

export default async function PracticeRoomPage({ params }: { params: { roomId: string } }) {
  const room = await db.practiceRoom.findUnique({
    where: { id: params.roomId },
    include: {
      participants: {
        orderBy: { joinedAt: "asc" }
      },
      sessions: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          feedbackReport: true,
          answers: {
            include: { question: true }
          }
        }
      }
    }
  });

  if (!room) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Practice Room" title={room.title} description={`Room code ${room.roomCode}. This room is for visible rehearsal only.`} badge={room.status} />
      <PracticeRoomScreen roomId={params.roomId} initialRoom={room} />
    </div>
  );
}
