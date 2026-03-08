"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [email, setEmail] = useState(mode === "login" ? "pm@example.com" : "");
  const [name, setName] = useState(mode === "login" ? "" : "Avery Dlamini");
  const [password, setPassword] = useState("Password123!");
  const [pending, setPending] = useState(false);

  async function submit() {
    setPending(true);
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name,
        password
      })
    });
    const payload = await response.json();
    setPending(false);

    if (!response.ok) {
      toast.error(payload.error ?? `Unable to ${mode}.`);
      return;
    }

    toast.success(mode === "login" ? "Logged in." : "Account created.");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{mode === "login" ? "Welcome back" : "Create account"}</CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Sign in to continue your practice sessions."
            : "Create a local account to save resumes, rooms, and session reviews."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mode === "register" ? <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" /> : null}
        <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
        <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
        <Button className="w-full" onClick={submit} disabled={pending}>
          {pending ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
        </Button>
      </CardContent>
    </Card>
  );
}
