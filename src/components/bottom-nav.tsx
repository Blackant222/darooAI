'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Pill, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'داشبورد' },
  { href: '/dashboard/pharmacy', icon: Pill, label: 'داروخانه' },
  { href: '/dashboard/insights', icon: Bot, label: 'چت‌بات' },
  { href: '/dashboard/profile', icon: User, label: 'پروفایل' },
].reverse(); // Reverse for RTL layout

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-0 right-0 h-20 z-50 flex justify-center items-center px-4">
      <div className="flex h-16 w-full max-w-sm items-center justify-around rounded-2xl bg-white/50 dark:bg-black/50 p-2 backdrop-blur-lg border border-black/5 dark:border-white/10 shadow-lg">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex h-full flex-1 items-center justify-center rounded-xl text-sm font-medium text-muted-foreground transition-colors duration-300",
              )}
            >
              <div className="relative z-10 flex flex-col items-center gap-1">
                <item.icon
                    className={cn(
                        "transition-colors",
                        isActive ? 'w-6 h-6 text-white' : 'w-5 h-5 text-gray-500 dark:text-gray-400'
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                />
                <motion.span
                  animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 5 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                  className={cn("text-[11px] font-bold text-white", {
                    "hidden": !isActive,
                    "block": isActive,
                  })}
                >
                  {item.label}
                </motion.span>
              </div>

              {isActive && (
                <motion.div
                  layoutId="active-nav-indicator"
                  className="absolute inset-0 z-0 h-full w-full rounded-xl bg-nav-active-gradient"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
