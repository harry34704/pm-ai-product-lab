import { Badge } from "@/components/ui/badge";

export function PageHeader({
  eyebrow,
  title,
  description,
  badge
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  badge?: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        {eyebrow ? <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{eyebrow}</p> : null}
        <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="max-w-3xl text-sm text-slate-400">{description}</p> : null}
      </div>
      {badge ? <Badge className="w-fit">{badge}</Badge> : null}
    </div>
  );
}
