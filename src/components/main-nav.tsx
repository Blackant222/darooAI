"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Pill, Lightbulb, User, Shield } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/pharmacy", icon: Pill, label: "My Pharmacy" },
  { href: "/dashboard/insights", icon: Lightbulb, label: "AI Insights" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            tooltip={item.label}
            className="neumorphic-button"
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={pathname.startsWith("/ash")}
          tooltip="Admin Panel"
          className="neumorphic-button"
        >
          <Link href="/ash">
            <Shield />
            <span>Admin Panel</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
