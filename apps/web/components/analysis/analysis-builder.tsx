"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

export function AnalysisBuilder({ resumes, jobs }: { resumes: any[]; jobs: any[] }) {
  const router = useRouter();
  const [resumeId, setResumeId] = useState(resumes[0]?.id ?? "");
  const [jobDescriptionId, setJobDescriptionId] = useState(jobs[0]?.id ?? "");
  const [pending, setPending] = useState(false);

  async function analyze() {
    setPending(true);
    const response = await fetch("/api/analysis/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeId, jobDescriptionId })
    });
    const payload = await response.json();
    setPending(false);

    if (!response.ok) {
      toast.error(payload.error ?? "Analysis failed.");
      return;
    }

    router.push(`/analysis/${payload.analysis.id}`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create match analysis</CardTitle>
        <CardDescription>Select a resume and job description to generate a fit report and likely interview questions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={resumeId} onChange={(event) => setResumeId(event.target.value)}>
          {resumes.map((resume) => (
            <option key={resume.id} value={resume.id}>
              {resume.title}
            </option>
          ))}
        </Select>
        <Select value={jobDescriptionId} onChange={(event) => setJobDescriptionId(event.target.value)}>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </Select>
        <Button onClick={analyze} disabled={!resumeId || !jobDescriptionId || pending}>
          {pending ? "Analyzing..." : "Run analysis"}
        </Button>
      </CardContent>
    </Card>
  );
}
