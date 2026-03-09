import { requirePageUser } from "@/lib/auth";
import { getProviderStatus } from "@/lib/server/settings";
import { PageHeader } from "@/components/layout/page-header";
import { ProviderPriorityForm } from "@/components/settings/provider-priority-form";
import { ModelConfigForm } from "@/components/settings/model-config-form";
import { PrivacySettingsForm } from "@/components/settings/privacy-settings-form";

export default async function SettingsPage() {
  const user = await requirePageUser();
  const { settings, health, runtime } = await getProviderStatus(user.id);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Settings" title="AI, transcript, and privacy settings" description="Control provider order, transcription strategy, coaching intensity, and local data handling." />
      <div className="grid gap-6 xl:grid-cols-3">
        <ProviderPriorityForm settings={settings} health={health} runtime={runtime} />
        <ModelConfigForm settings={settings} />
        <PrivacySettingsForm settings={settings} />
      </div>
    </div>
  );
}
