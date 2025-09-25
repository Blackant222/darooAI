import { Pill } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  collapsed,
  className,
}: {
  collapsed: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/dashboard"
      className={cn("flex items-center gap-2", className)}
      prefetch={false}
    >
      <Pill className="h-6 w-6 text-primary" />
      {!collapsed && (
        <span className="text-lg font-bold font-headline whitespace-nowrap">
          دارو AI
        </span>
      )}
    </Link>
  );
}
