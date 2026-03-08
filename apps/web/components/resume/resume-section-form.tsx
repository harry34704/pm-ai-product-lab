"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ResumeSectionForm({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}
