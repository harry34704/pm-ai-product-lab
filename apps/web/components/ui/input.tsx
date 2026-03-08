import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-xl border border-border bg-slate-950/60 px-3 py-2 text-sm text-foreground outline-none ring-offset-background placeholder:text-slate-500 focus:border-primary",
        className
      )}
      {...props}
    />
  );
}
