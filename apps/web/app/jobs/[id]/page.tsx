import { notFound } from "next/navigation";
import { requirePageUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { JDEditor } from "@/components/jobs/jd-editor";

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const user = await requirePageUser();
  const job = await db.jobDescription.findFirst({
    where: {
      id: params.id,
      userId: user.id
    }
  });

  if (!job) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Job Detail" title={job.title} description="Adjust responsibilities, skills, and keywords before running fit analysis." />
      <JDEditor job={job} />
    </div>
  );
}
