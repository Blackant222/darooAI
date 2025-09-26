"use client";
import React from "react";
import { Logo } from "@/components/logo";
import { UserNav } from "@/components/user-nav";
import { BottomNav } from "@/components/bottom-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { DrugProvider } from "@/context/drug-context";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

function AppHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Logo collapsed={false} />
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:block">
            <ThemeToggle />
        </div>
        <UserNav />
      </div>
    </header>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div dir="rtl" className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mr-4">در حال بارگذاری اطلاعات کاربری...</p>
      </div>
    );
  }

  return (
    <DrugProvider>
        <div dir="rtl" className="flex flex-col min-h-dvh">
            <AppHeader />
            <main className="flex-1 p-4 pb-24 md:pb-8 md:p-8">{children}</main>
            <BottomNav />
        </div>
    </DrugProvider>
  );
}
