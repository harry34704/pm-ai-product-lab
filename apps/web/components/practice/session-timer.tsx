"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function formatDuration(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function SessionTimer({ durationMinutes, startedAt }: { durationMinutes: number; startedAt?: string | Date | null }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const remaining = useMemo(() => {
    if (!startedAt) {
      return durationMinutes * 60 * 1000;
    }

    const start = new Date(startedAt).getTime();
    return start + durationMinutes * 60 * 1000 - now;
  }, [durationMinutes, startedAt, now]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session timer</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-display text-4xl font-semibold">{formatDuration(remaining)}</p>
      </CardContent>
    </Card>
  );
}
