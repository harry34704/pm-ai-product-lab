import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex min-h-[128px] w-full rounded-xl border border-border bg-slate-950/60 px-3 py-2 text-sm text-foreground outline-none placeholder:text-slate-500 focus:border-primary",
        className
      )}
      {...props}
    />
  );
}
