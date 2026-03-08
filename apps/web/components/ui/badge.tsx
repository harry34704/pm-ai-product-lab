import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full border border-border bg-slate-900 px-2.5 py-1 text-xs font-medium text-slate-300", className)}
      {...props}
    />
  );
}
