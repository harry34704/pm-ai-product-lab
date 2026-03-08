"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ResumeSectionForm } from "./resume-section-form";

export function ResumeEditor({ resume }: { resume: any }) {
  const router = useRouter();
  const [title, setTitle] = useState(resume.title);
  const [rawText, setRawText] = useState(resume.rawText);
  const [parsed, setParsed] = useState(resume.parsedJson);
  const [pending, setPending] = useState(false);

  async function save() {
    setPending(true);
    const response = await fetch(`/api/resumes/${resume.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        rawText,
        parsedJson: parsed
      })
    });
    const payload = await response.json();
    setPending(false);

    if (!response.ok) {
      toast.error(payload.error ?? "Unable to save resume.");
      return;
    }

    toast.success("Resume updated.");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resume editor</CardTitle>
          <CardDescription>Review the parsed structure, then save any corrections before using it for analysis or coaching.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Resume title" />
          </div>
          <ResumeSectionForm label="Headline" value={parsed.headline ?? ""} onChange={(value) => setParsed({ ...parsed, headline: value })} />
          <ResumeSectionForm label="Summary" value={parsed.summary ?? ""} onChange={(value) => setParsed({ ...parsed, summary: value })} />
          <ResumeSectionForm label="Skills" value={(parsed.skills ?? []).join(", ")} onChange={(value) => setParsed({ ...parsed, skills: value.split(",").map((item: string) => item.trim()).filter(Boolean) })} />
          <ResumeSectionForm label="Achievements" value={(parsed.achievements ?? []).join("\n")} onChange={(value) => setParsed({ ...parsed, achievements: value.split("\n").map((item: string) => item.trim()).filter(Boolean) })} />
          <ResumeSectionForm label="Raw text" value={rawText} onChange={setRawText} />
          <Button onClick={save} disabled={pending}>
            {pending ? "Saving..." : "Save resume"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
