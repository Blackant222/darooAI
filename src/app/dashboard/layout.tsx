"use client";
import React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { UserNav } from "@/components/user-nav";
import { MainNav } from "@/components/main-nav";
import { BottomNav } from "@/components/bottom-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { PanelLeftOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      side="right"
      collapsible="icon"
      className="hidden md:flex"
      variant="sidebar"
    >
      <SidebarHeader className="p-3 justify-center">
        <Logo collapsed={isCollapsed} />
      </SidebarHeader>
      <SidebarContent>
        <MainNav />
      </SidebarContent>
      <SidebarFooter className="p-3">
        <div className={isCollapsed ? "justify-center flex" : ""}>
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function AppHeader() {
  const { toggleSidebar } = useSidebar();
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background/30 backdrop-blur-sm px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hidden md:flex neumorphic-button"
        >
          <PanelLeftOpen />
        </Button>
        <div className="relative hidden md:block">
          <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="جستجو..." className="neumorphic-input w-full rounded-lg bg-background pl-8 pr-3 md:w-[200px] lg:w-[320px]" />
        </div>
      </div>
      <div className="md:hidden">
         <Logo collapsed={true} />
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden neumorphic-button rounded-full">
            <Search />
            <span className="sr-only">جستجو</span>
        </Button>
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
  const [defaultOpen, setDefaultOpen] = React.useState(true);

  React.useEffect(() => {
    const sidebarState = document.cookie
      .split("; ")
      .find((row) => row.startsWith("sidebar_state="));
    if (sidebarState) {
      setDefaultOpen(sidebarState.split("=")[1] === "true");
    }
  }, []);

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div dir="rtl">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 p-4 pb-20 md:p-8">{children}</main>
          <BottomNav />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
