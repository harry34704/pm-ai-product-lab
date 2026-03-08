"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ResumeSectionForm } from "@/components/resume/resume-section-form";

export function JDEditor({ job }: { job: any }) {
  const router = useRouter();
  const [title, setTitle] = useState(job.title);
  const [company, setCompany] = useState(job.company ?? "");
  const [rawText, setRawText] = useState(job.rawText);
  const [parsed, setParsed] = useState(job.parsedJson);
  const [pending, setPending] = useState(false);

  async function save() {
    setPending(true);
    const response = await fetch(`/api/jobs/${job.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, company, rawText, parsedJson: parsed })
    });
    const payload = await response.json();
    setPending(false);

    if (!response.ok) {
      toast.error(payload.error ?? "Unable to update job.");
      return;
    }

    toast.success("Job description updated.");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job description editor</CardTitle>
        <CardDescription>Make adjustments before running a fit analysis.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input value={title} onChange={(event) => setTitle(event.target.value)} />
        <Input value={company} onChange={(event) => setCompany(event.target.value)} />
        <ResumeSectionForm label="Role title" value={parsed.roleTitle ?? ""} onChange={(value) => setParsed({ ...parsed, roleTitle: value })} />
        <ResumeSectionForm label="Required skills" value={(parsed.requiredSkills ?? []).join(", ")} onChange={(value) => setParsed({ ...parsed, requiredSkills: value.split(",").map((item: string) => item.trim()).filter(Boolean) })} />
        <ResumeSectionForm label="Preferred skills" value={(parsed.preferredSkills ?? []).join(", ")} onChange={(value) => setParsed({ ...parsed, preferredSkills: value.split(",").map((item: string) => item.trim()).filter(Boolean) })} />
        <ResumeSectionForm label="Responsibilities" value={(parsed.responsibilities ?? []).join("\n")} onChange={(value) => setParsed({ ...parsed, responsibilities: value.split("\n").map((item: string) => item.trim()).filter(Boolean) })} />
        <Textarea value={rawText} onChange={(event) => setRawText(event.target.value)} />
        <Button onClick={save} disabled={pending}>
          {pending ? "Saving..." : "Save job description"}
        </Button>
      </CardContent>
    </Card>
  );
}
