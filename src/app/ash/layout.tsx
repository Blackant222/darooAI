import Link from "next/link";
import { Pill } from "lucide-react";
import { UserNav } from "@/components/user-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div dir="rtl" className="min-h-dvh flex flex-col">
      <header className="flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
        <Link href="/ash" className="flex items-center gap-2" prefetch={false}>
          <Pill className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold font-headline">
            ادمین Avicenna
          </span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            بازگشت به اپلیکیشن
          </Link>
          <UserNav />
        </nav>
      </header>
      <main className="flex-1 bg-muted/20 dark:bg-background/40">{children}</main>
    </div>
  );
}
