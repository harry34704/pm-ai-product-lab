import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-11 w-full rounded-xl border border-border bg-slate-950/60 px-3 py-2 text-sm text-foreground outline-none ring-offset-background placeholder:text-slate-500 focus:border-primary",
      className
    )}
    {...props}
  />
));

Input.displayName = "Input";
