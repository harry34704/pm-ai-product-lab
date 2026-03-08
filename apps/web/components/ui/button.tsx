"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary px-4 py-2 text-slate-950 hover:bg-emerald-300",
        secondary: "bg-muted px-4 py-2 text-foreground hover:bg-slate-700",
        outline: "border border-border px-4 py-2 text-foreground hover:bg-slate-900",
        ghost: "px-3 py-2 text-slate-300 hover:bg-slate-900 hover:text-white",
        danger: "bg-danger px-4 py-2 text-white hover:bg-red-500"
      },
      size: {
        sm: "h-9 px-3",
        default: "h-10 px-4",
        lg: "h-11 px-5"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
));

Button.displayName = "Button";

export { Button, buttonVariants };
