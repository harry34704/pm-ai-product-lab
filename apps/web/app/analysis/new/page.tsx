import { requirePageUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { AnalysisBuilder } from "@/components/analysis/analysis-builder";

export default async function NewAnalysisPage() {
  const user = await requirePageUser();
  const [resumes, jobs] = await Promise.all([
    db.resume.findMany({ where: { userId: user.id }, orderBy: { updatedAt: "desc" } }),
    db.jobDescription.findMany({ where: { userId: user.id }, orderBy: { updatedAt: "desc" } })
  ]);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Analysis" title="Create CV-to-JD match report" description="Generate an honest fit score, likely interview themes, and practice introductions." />
      <AnalysisBuilder resumes={resumes} jobs={jobs} />
    </div>
  );
}
