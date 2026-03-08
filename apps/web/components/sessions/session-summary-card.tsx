import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SessionSummaryCard({ report }: { report: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Session summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-slate-300">{report.summary}</p>
        <div>
          <p className="text-sm font-medium">Top strengths</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-400">
            {(report.topStrengths as string[]).map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium">Top improvements</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-400">
            {(report.topImprovements as string[]).map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
