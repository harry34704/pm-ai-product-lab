import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function JobList({ jobs }: { jobs: any[] }) {
  if (!jobs.length) {
    return (
      <Card>
        <CardContent className="py-10 text-sm text-slate-400">No saved job descriptions yet. Add one to compare fit and generate likely questions.</CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {jobs.map((job) => (
        <Link key={job.id} href={`/jobs/${job.id}`}>
          <Card className="h-full transition hover:border-primary/40">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{job.title}</CardTitle>
                <Badge>{job.company || "No company"}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3 text-sm text-slate-400">{job.rawText.slice(0, 220)}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
