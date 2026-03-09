import { notFound } from "next/navigation";
import { requirePageUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { MatchScoreCard } from "@/components/analysis/match-score-card";
import { KeywordDiffCard } from "@/components/analysis/keyword-diff-card";
import { IntroGeneratorCard } from "@/components/analysis/intro-generator-card";
import { LikelyQuestionsCard } from "@/components/analysis/likely-questions-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AnalysisDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requirePageUser();
  const { id } = await params;
  const report = await db.analysisReport.findFirst({
    where: {
      id,
      userId: user.id
    },
    include: {
      resume: true,
      jobDescription: true
    }
  });

  if (!report) {
    notFound();
  }

  const likelyQuestions = report.likelyQuestions as any;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Match Analysis" title={`${report.resume.title} vs ${report.jobDescription.title}`} description="Evidence-based fit report that keeps strengths and gap framing truthful." />
      <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
        <MatchScoreCard score={report.matchScore} />
        <KeywordDiffCard matchedKeywords={report.matchedKeywords as string[]} missingKeywords={report.missingKeywords as string[]} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Strengths to emphasize</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-300">
            {(report.strengths as string[]).map((item) => (
              <p key={item}>• {item}</p>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Honest gap framing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-300">
            {(report.gapFraming as string[]).map((item) => (
              <p key={item}>• {item}</p>
            ))}
          </CardContent>
        </Card>
      </div>
      <IntroGeneratorCard intro30={report.intro30} intro60={report.intro60} intro90={report.intro90} />
      <LikelyQuestionsCard recruiter={likelyQuestions.recruiter ?? []} hiringManager={likelyQuestions.hiringManager ?? []} behavioral={likelyQuestions.behavioral ?? []} />
    </div>
  );
}
