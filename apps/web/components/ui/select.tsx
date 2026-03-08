import { cn } from "@/lib/utils";

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn("flex h-11 w-full rounded-xl border border-border bg-slate-950/60 px-3 py-2 text-sm text-foreground outline-none focus:border-primary", className)}
      {...props}
    >
      {children}
    </select>
  );
}
