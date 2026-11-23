import * as React from "react";
import { cn } from "@/lib/utils";
export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) { return <table className={cn("w-full caption-bottom text-sm", className)} {...props} />; }
export function TableHeader(props: React.HTMLAttributes<HTMLTableSectionElement>) { return <thead {...props} />; }
export function TableBody(props: React.HTMLAttributes<HTMLTableSectionElement>) { return <tbody {...props} />; }
export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) { return <tr className={cn("border-b border-zinc-800/70 transition-colors hover:bg-zinc-900/40", className)} {...props} />; }
export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) { return <th className={cn("h-10 px-3 text-left text-xs font-medium text-zinc-500", className)} {...props} />; }
export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) { return <td className={cn("px-3 py-3 align-middle", className)} {...props} />; }
