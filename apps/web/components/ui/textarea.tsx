import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[128px] w-full rounded-xl border border-border bg-slate-950/60 px-3 py-2 text-sm text-foreground outline-none placeholder:text-slate-500 focus:border-primary",
      className
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";
