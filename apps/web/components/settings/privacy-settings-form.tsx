"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PrivacySettingsForm({ settings }: { settings: any }) {
  const [localOnlyMode, setLocalOnlyMode] = useState(Boolean(settings.localOnlyMode));
  const [storeAudio, setStoreAudio] = useState(Boolean(settings.storeAudio));
  const [darkMode, setDarkMode] = useState(Boolean(settings.darkMode));
  const [pending, setPending] = useState(false);

  async function save() {
    setPending(true);
    const response = await fetch("/api/settings/providers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ localOnlyMode, storeAudio, darkMode })
    });
    const payload = await response.json();
    setPending(false);

    if (!response.ok) {
      toast.error(payload.error ?? "Could not update privacy settings.");
      return;
    }

    toast.success("Privacy settings updated.");
  }

  async function deleteData() {
    setPending(true);
    const response = await fetch("/api/settings/providers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete-data" })
    });
    const payload = await response.json();
    setPending(false);

    if (!response.ok) {
      toast.error(payload.error ?? "Could not delete local data.");
      return;
    }

    toast.success("User data deleted.");
  }

  const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) => (
    <label className="flex items-center justify-between rounded-xl border border-border bg-slate-950/60 px-4 py-3 text-sm">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy and local storage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Toggle label="Local-only mode" checked={localOnlyMode} onChange={setLocalOnlyMode} />
        <Toggle label="Store audio" checked={storeAudio} onChange={setStoreAudio} />
        <Toggle label="Dark mode" checked={darkMode} onChange={setDarkMode} />
        <div className="flex flex-wrap gap-3">
          <Button onClick={save} disabled={pending}>
            {pending ? "Saving..." : "Save privacy settings"}
          </Button>
          <Button variant="danger" onClick={deleteData} disabled={pending}>
            Delete my data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
