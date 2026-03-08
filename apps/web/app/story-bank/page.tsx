import { requirePageUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { StoryList } from "@/components/story-bank/story-list";
import { ExtractStoriesButton } from "@/components/story-bank/extract-stories-button";

export default async function StoryBankPage() {
  const user = await requirePageUser();
  const [stories, resumes] = await Promise.all([
    db.story.findMany({ where: { userId: user.id }, orderBy: { updatedAt: "desc" } }),
    db.resume.findMany({ where: { userId: user.id }, orderBy: { updatedAt: "desc" } })
  ]);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="STAR Stories" title="Story bank" description="Build reusable stories for leadership, delivery, analytics, and behavioral prompts." />
      <ExtractStoriesButton resumes={resumes} />
      <StoryList stories={stories} />
    </div>
  );
}
