"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ConsentBanner({
  consentGiven,
  onConsent
}: {
  consentGiven: boolean;
  onConsent: () => void;
}) {
  return (
    <Card className="border-primary/30 bg-primary/10">
      <CardContent className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-medium">Transcript consent required</p>
          <p className="text-sm text-slate-300">Transcript and coaching are available only when everyone explicitly agrees that this is a visible practice session.</p>
        </div>
        <Button onClick={onConsent} disabled={consentGiven}>
          {consentGiven ? "Consent recorded" : "I consent to transcript use"}
        </Button>
      </CardContent>
    </Card>
  );
}
