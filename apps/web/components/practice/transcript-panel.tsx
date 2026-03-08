import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TranscriptPanel({ transcript }: { transcript: { speakerLabel: string; text: string; timestampMs: number }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live transcript</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[420px] space-y-3 overflow-y-auto">
        {transcript.length ? (
          transcript.map((entry, index) => (
            <div key={`${entry.timestampMs}-${index}`} className="rounded-xl border border-border bg-slate-950/60 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{entry.speakerLabel}</p>
              <p className="mt-2 text-sm text-slate-200">{entry.text}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">Transcript is empty. Use browser speech recognition or add manual notes during the session.</p>
        )}
      </CardContent>
    </Card>
  );
}
