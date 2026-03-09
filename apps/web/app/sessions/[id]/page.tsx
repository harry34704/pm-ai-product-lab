import { notFound } from "next/navigation";
import { requirePageUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { SessionSummaryCard } from "@/components/sessions/session-summary-card";
import { QuestionReviewAccordion } from "@/components/sessions/question-review-accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requirePageUser();
  const { id } = await params;
  const session = await db.session.findFirst({
    where: {
      id,
      candidateUserId: user.id
    },
    include: {
      room: true,
      feedbackReport: true,
      answers: {
        include: { question: true },
        orderBy: { createdAt: "asc" }
      }
    }
  });

  if (!session) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Session Detail" title={session.room.title} description="Review the transcript, question extraction, and answer rewrites." />
      {session.feedbackReport ? <SessionSummaryCard report={session.feedbackReport} /> : null}
      <Card>
        <CardHeader>
          <CardTitle>Transcript</CardTitle>
        </CardHeader>
        <CardContent className="whitespace-pre-wrap text-sm text-slate-300">{session.transcript || "No transcript captured."}</CardContent>
      </Card>
      <QuestionReviewAccordion answers={session.answers} />
    </div>
  );
}
