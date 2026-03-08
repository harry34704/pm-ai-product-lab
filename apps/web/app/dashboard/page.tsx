import Link from "next/link";
import { db } from "@/lib/db";
import { requirePageUser } from "@/lib/auth";
import { getDashboardSnapshot } from "@/lib/server/dashboard";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const user = await requirePageUser();
  const stats = await getDashboardSnapshot(user.id);
  const [recentAnalyses, recentRooms] = await Promise.all([
    db.analysisReport.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { jobDescription: true, resume: true }
    }),
    db.practiceRoom.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: "desc" },
      take: 3
    })
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        description="Track your preparation pipeline from resume fit analysis to visible mock interview rehearsal."
        badge="Practice Only"
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Resumes uploaded" value={stats.resumes} />
        <StatCard label="Jobs saved" value={stats.jobs} />
        <StatCard label="Analyses completed" value={stats.analyses} />
        <StatCard label="Sessions completed" value={stats.sessions} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Link href="/resumes">
              <Button>Upload resume</Button>
            </Link>
            <Link href="/jobs">
              <Button variant="secondary">Add job description</Button>
            </Link>
            <Link href="/analysis/new">
              <Button variant="secondary">Analyze fit</Button>
            </Link>
            <Link href="/practice/new">
              <Button variant="secondary">Create practice room</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent analysis reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAnalyses.length ? (
              recentAnalyses.map((report) => (
                <Link key={report.id} href={`/analysis/${report.id}`} className="block rounded-xl border border-border bg-slate-950/60 p-4">
                  <p className="font-medium">{report.resume.title} vs {report.jobDescription.title}</p>
                  <p className="mt-1 text-sm text-slate-400">Match score {report.matchScore}/100</p>
                </Link>
              ))
            ) : (
              <p className="text-sm text-slate-400">No analysis reports yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent practice rooms</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {recentRooms.length ? (
            recentRooms.map((room) => (
              <Link key={room.id} href={`/practice/${room.id}`} className="rounded-xl border border-border bg-slate-950/60 p-4">
                <p className="font-medium">{room.title}</p>
                <p className="mt-1 text-sm text-slate-400">{room.durationMinutes} minutes</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{room.status}</p>
              </Link>
            ))
          ) : (
            <p className="text-sm text-slate-400">No practice rooms yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
