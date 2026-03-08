import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ResumeList({ resumes }: { resumes: any[] }) {
  if (!resumes.length) {
    return (
      <Card>
        <CardContent className="py-10 text-sm text-slate-400">No resumes yet. Upload one to unlock match analysis and story extraction.</CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {resumes.map((resume) => (
        <Link key={resume.id} href={`/resumes/${resume.id}`}>
          <Card className="h-full transition hover:border-primary/40">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{resume.title}</CardTitle>
                <Badge>{resume.sections.length} sections</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3 text-sm text-slate-400">{resume.rawText.slice(0, 200)}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
