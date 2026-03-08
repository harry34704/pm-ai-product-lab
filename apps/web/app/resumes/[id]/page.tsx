import { notFound } from "next/navigation";
import { requirePageUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { ResumeEditor } from "@/components/resume/resume-editor";

export default async function ResumeDetailPage({ params }: { params: { id: string } }) {
  const user = await requirePageUser();
  const resume = await db.resume.findFirst({
    where: {
      id: params.id,
      userId: user.id
    }
  });

  if (!resume) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Resume Detail" title={resume.title} description="Structured resume data stays editable after parsing." />
      <ResumeEditor resume={resume} />
    </div>
  );
}
