"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

export function ExtractStoriesButton({ resumes }: { resumes: any[] }) {
  const router = useRouter();
  const [resumeId, setResumeId] = useState(resumes[0]?.id ?? "");
  const [pending, setPending] = useState(false);

  async function extract() {
    setPending(true);
    const response = await fetch("/api/stories/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeId })
    });
    const payload = await response.json();
    setPending(false);

    if (!response.ok) {
      toast.error(payload.error ?? "Could not extract stories.");
      return;
    }

    toast.success("Stories extracted.");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Select className="min-w-[220px]" value={resumeId} onChange={(event) => setResumeId(event.target.value)}>
        {resumes.map((resume) => (
          <option key={resume.id} value={resume.id}>
            {resume.title}
          </option>
        ))}
      </Select>
      <Button onClick={extract} disabled={!resumeId || pending}>
        {pending ? "Extracting..." : "Extract stories from resume"}
      </Button>
    </div>
  );
}
