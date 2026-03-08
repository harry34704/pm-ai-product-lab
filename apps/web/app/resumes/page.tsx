import { requirePageUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { ResumeUploader } from "@/components/resume/resume-uploader";
import { ResumeList } from "@/components/resume/resume-list";

export default async function ResumesPage() {
  const user = await requirePageUser();
  const resumes = await db.resume.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { sections: true }
  });

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Resume Module" title="Resumes" description="Upload, parse, and refine multiple resumes for different target roles." />
      <ResumeUploader />
      <ResumeList resumes={resumes} />
    </div>
  );
}
