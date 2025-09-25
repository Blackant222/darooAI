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
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar side="right">
      <SidebarHeader className="p-3">
        <div className="flex items-center justify-between">
          <Logo collapsed={isCollapsed} />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden"
          >
            <PanelLeftClose />
          </Button>
        </div>
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
        <div className="flex-1"></div>
        <UserNav />
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden md:flex neumorphic-button ml-4"
        >
            <PanelLeftOpen />
        </Button>
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
          <main className="flex-1 p-4 md:p-8">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
