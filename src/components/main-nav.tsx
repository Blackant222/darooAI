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
  { href: "/dashboard", icon: Home, label: "داشبورد" },
  { href: "/dashboard/pharmacy", icon: Pill, label: "داروخانه من" },
  { href: "/dashboard/insights", icon: Lightbulb, label: "بینش هوش مصنوعی" },
  { href: "/dashboard/profile", icon: User, label: "پروفایل" },
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
          tooltip="پنل ادمین"
        >
          <Link href="/ash">
            <Shield />
            <span>پنل ادمین</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
