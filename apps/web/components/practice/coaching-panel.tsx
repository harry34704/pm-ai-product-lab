import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CoachingPanel({
  micStatus,
  transcriptActive,
  hints
}: {
  micStatus: string;
  transcriptActive: boolean;
  hints: {
    questionIntent: string;
    answerStructure: string[];
    resumeEvidence: string[];
    starReminders: string[];
    followUps: string[];
    nudges: string[];
  } | null;
}) {
  const sections = hints
    ? [
        { title: "Likely intent", items: [hints.questionIntent] },
        { title: "Answer structure", items: hints.answerStructure },
        { title: "Resume evidence", items: hints.resumeEvidence },
        { title: "STAR reminders", items: hints.starReminders },
        { title: "Likely follow-ups", items: hints.followUps },
        { title: "Nudges", items: hints.nudges }
      ]
    : [];

  return (
    <Card className="border-primary/25">
      <CardHeader>
        <CardTitle>Practice Mode Active</CardTitle>
        <p className="text-sm text-slate-400">Visible coaching only. This panel is not for real interview assistance.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-slate-500">
          <span>Mic: {micStatus}</span>
          <span>Coaching: {hints ? "active" : "waiting"}</span>
          <span>Transcript: {transcriptActive ? "active" : "inactive"}</span>
        </div>
        {sections.map((section) => (
          <div key={section.title} className="space-y-2 rounded-xl border border-border bg-slate-950/60 p-4">
            <p className="font-medium">{section.title}</p>
            <ul className="space-y-1 text-sm text-slate-300">
              {section.items.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
