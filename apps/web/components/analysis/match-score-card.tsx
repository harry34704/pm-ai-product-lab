import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MatchScoreCard({ score }: { score: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Match score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2">
          <p className="font-display text-5xl font-semibold">{score}</p>
          <p className="pb-2 text-sm text-slate-400">/100</p>
        </div>
        <p className="mt-3 text-sm text-slate-400">Score is based on keyword overlap, role alignment, and visible resume evidence.</p>
      </CardContent>
    </Card>
  );
}
