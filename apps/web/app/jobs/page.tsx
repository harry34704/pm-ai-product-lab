import { requirePageUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { JDUploader } from "@/components/jobs/jd-uploader";
import { JobList } from "@/components/jobs/job-list";

export default async function JobsPage() {
  const user = await requirePageUser();
  const jobs = await db.jobDescription.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Job Descriptions" title="Saved job descriptions" description="Paste or upload job descriptions, then edit the parsed structure before analysis." />
      <JDUploader />
      <JobList jobs={jobs} />
    </div>
  );
}
