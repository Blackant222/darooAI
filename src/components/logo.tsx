import Link from "next/link";
import { cn } from "@/lib/utils";
import { IbnSinaLogo } from "./ibn-sina-logo";

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
      <IbnSinaLogo className="h-6 w-6 text-primary" />
      {!collapsed && (
        <span className="text-lg font-bold font-headline whitespace-nowrap">
          ابن سینا
        </span>
      )}
    </Link>
  );
}
