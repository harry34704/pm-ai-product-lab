"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export function JDUploader() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [rawText, setRawText] = useState("");
  const [pending, setPending] = useState(false);

  async function createFromText() {
    setPending(true);
    const response = await fetch("/api/jobs/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, company, rawText })
    });
    const payload = await response.json();
    setPending(false);

    if (!response.ok) {
      toast.error(payload.error ?? "Could not save job description.");
      return;
    }

    toast.success("Job description saved.");
    router.push(`/jobs/${payload.job.id}`);
    router.refresh();
  }

  async function uploadFile(file: File) {
    setPending(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("company", company);
    const response = await fetch("/api/jobs/parse", { method: "POST", body: formData });
    const payload = await response.json();
    setPending(false);

    if (!response.ok) {
      toast.error(payload.error ?? "Could not parse job description.");
      return;
    }

    router.push(`/jobs/${payload.job.id}`);
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add job description</CardTitle>
        <CardDescription>Paste the text directly or upload a PDF, DOCX, or TXT file.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Role title" />
        <Input value={company} onChange={(event) => setCompany(event.target.value)} placeholder="Company" />
        <Textarea value={rawText} onChange={(event) => setRawText(event.target.value)} placeholder="Paste the job description here..." />
        <div className="flex flex-wrap gap-3">
          <Button onClick={createFromText} disabled={!rawText || pending}>
            {pending ? "Saving..." : "Save job description"}
          </Button>
          <Button variant="secondary" onClick={() => fileRef.current?.click()} disabled={pending}>
            Upload file
          </Button>
          <input ref={fileRef} type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={(event) => event.target.files?.[0] && uploadFile(event.target.files[0])} />
        </div>
      </CardContent>
    </Card>
  );
}
