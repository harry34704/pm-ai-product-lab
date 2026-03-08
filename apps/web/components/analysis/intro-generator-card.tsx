import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function IntroGeneratorCard({ intro30, intro60, intro90 }: { intro30: string; intro60: string; intro90: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview introductions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">30 seconds</p>
          <p className="mt-2 text-sm text-slate-300">{intro30}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">60 seconds</p>
          <p className="mt-2 text-sm text-slate-300">{intro60}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">90 seconds</p>
          <p className="mt-2 text-sm text-slate-300">{intro90}</p>
        </div>
      </CardContent>
    </Card>
  );
}
