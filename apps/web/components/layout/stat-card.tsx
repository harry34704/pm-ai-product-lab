import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatCard({ label, value, helper }: { label: string; value: number | string; helper?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-slate-400">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-display text-3xl font-semibold">{value}</p>
        {helper ? <p className="mt-2 text-xs text-slate-500">{helper}</p> : null}
      </CardContent>
    </Card>
  );
}
