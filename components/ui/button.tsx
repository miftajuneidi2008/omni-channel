import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { asChild?: boolean; variant?: "default" | "outline" | "ghost" | "secondary" }

export function Button({ className, variant = "default", asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn("inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50", variant === "default" && "bg-zinc-100 text-zinc-950 hover:bg-white", variant === "outline" && "border border-zinc-800 bg-zinc-950/40 text-zinc-200 hover:bg-zinc-900", variant === "secondary" && "bg-zinc-800 text-zinc-100 hover:bg-zinc-700", variant === "ghost" && "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100", className)} {...props} />;
}
