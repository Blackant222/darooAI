"use client";
import React from "react";
import { Logo } from "@/components/logo";
import { UserNav } from "@/components/user-nav";
import { BottomNav } from "@/components/bottom-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DrugProvider } from "@/context/drug-context";

function AppHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Logo collapsed={false} />
        <div className="relative hidden md:block">
          <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="جستجو..." className="neumorphic-input w-full rounded-lg bg-background pl-8 pr-3 md:w-[200px] lg:w-[320px]" />
        </div>
      </div>

      <div className="flex items-center gap-2">
         <Button variant="ghost" size="icon" className="md:hidden neumorphic-button rounded-full">
            <Search />
            <span className="sr-only">جستجو</span>
        </Button>
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
  return (
    <DrugProvider>
        <div dir="rtl" className="flex flex-col min-h-dvh">
            <AppHeader />
            <main className="flex-1 p-4 pb-24 md:p-8">{children}</main>
            <BottomNav />
        </div>
    </DrugProvider>
  );
}
