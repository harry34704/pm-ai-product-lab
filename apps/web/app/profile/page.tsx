import { requirePageUser } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { ProfileForm } from "@/components/profile/profile-form";

export default async function ProfilePage() {
  const user = await requirePageUser();

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Profile" title="Candidate profile" description="Set target role, seniority, industries, and personal answer preferences." />
      <ProfileForm user={user} />
    </div>
  );
}
