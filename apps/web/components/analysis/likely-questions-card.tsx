import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LikelyQuestionsCard({
  recruiter,
  hiringManager,
  behavioral
}: {
  recruiter: string[];
  hiringManager: string[];
  behavioral: string[];
}) {
  const groups = [
    { label: "Recruiter", items: recruiter },
    { label: "Hiring manager", items: hiringManager },
    { label: "Behavioral", items: behavioral }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Likely interview questions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-3">
        {groups.map((group) => (
          <div key={group.label} className="space-y-3 rounded-xl border border-border bg-slate-950/50 p-4">
            <p className="font-medium">{group.label}</p>
            <ul className="space-y-2 text-sm text-slate-400">
              {group.items.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
