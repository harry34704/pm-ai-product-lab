"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ProfileForm({ user }: { user: any }) {
  const [name, setName] = useState(user.name ?? "");
  const [targetRole, setTargetRole] = useState(user.profile?.targetRole ?? "");
  const [seniority, setSeniority] = useState(user.profile?.seniority ?? "");
  const [industries, setIndustries] = useState((user.profile?.industries ?? []).join(", "));
  const [answerTone, setAnswerTone] = useState(user.profile?.answerTone ?? "");
  const [introStyle, setIntroStyle] = useState(user.profile?.introStyle ?? "");
  const [pending, setPending] = useState(false);

  async function save() {
    setPending(true);
    const response = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        targetRole,
        seniority,
        industries: industries.split(",").map((item) => item.trim()).filter(Boolean),
        answerTone,
        introStyle
      })
    });
    const payload = await response.json();
    setPending(false);

    if (!response.ok) {
      toast.error(payload.error ?? "Could not update profile.");
      return;
    }

    toast.success("Profile updated.");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile and preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" />
        <Input value={targetRole} onChange={(event) => setTargetRole(event.target.value)} placeholder="Target role" />
        <Input value={seniority} onChange={(event) => setSeniority(event.target.value)} placeholder="Seniority" />
        <Textarea value={industries} onChange={(event) => setIndustries(event.target.value)} placeholder="Industries, comma separated" />
        <Input value={answerTone} onChange={(event) => setAnswerTone(event.target.value)} placeholder="Preferred answer tone" />
        <Input value={introStyle} onChange={(event) => setIntroStyle(event.target.value)} placeholder="Intro style" />
        <Button onClick={save} disabled={pending}>
          {pending ? "Saving..." : "Save profile"}
        </Button>
      </CardContent>
    </Card>
  );
}
