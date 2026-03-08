import Link from "next/link";
import { requirePageUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SessionsPage() {
  const user = await requirePageUser();
  const sessions = await db.session.findMany({
    where: { candidateUserId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      room: true,
      feedbackReport: true
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Session Review" title="Completed sessions" description="Review transcripts, answer scores, and rewrites after each practice run." />
      <div className="grid gap-4 xl:grid-cols-2">
        {sessions.length ? (
          sessions.map((session) => (
            <Link key={session.id} href={`/sessions/${session.id}`}>
              <Card className="h-full transition hover:border-primary/40">
                <CardHeader>
                  <CardTitle>{session.room.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-400">{session.feedbackReport?.summary ?? "Review pending"}</p>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <Card>
            <CardContent className="py-10 text-sm text-slate-400">No completed sessions yet.</CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
