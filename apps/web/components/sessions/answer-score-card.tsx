import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RewriteTabs } from "./rewrite-tabs";

export function AnswerScoreCard({ answer }: { answer: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{answer.score ?? 0}/100</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Answer</p>
          <p className="mt-2 text-sm text-slate-300">{answer.text}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium">Strengths</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-400">
              {((answer.strengths as string[]) ?? []).map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium">Weaknesses</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-400">
              {((answer.weaknesses as string[]) ?? []).map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
        <RewriteTabs answer={answer} />
      </CardContent>
    </Card>
  );
}
