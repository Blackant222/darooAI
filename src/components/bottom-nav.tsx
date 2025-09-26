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
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95vw] max-w-sm z-50">
      <div className="relative h-20 w-full rounded-full border border-white/20 bg-background/60 backdrop-blur-lg shadow-xl flex items-center justify-around primary-gradient">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center justify-center text-primary-foreground/70 h-full w-20 rounded-full transition-all duration-300 ease-in-out',
                'hover:text-primary-foreground'
              )}
            >
              {isActive && (
                 <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-white/20 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className={cn(
                "relative text-xs font-medium tracking-wide transition-all",
                { "font-bold": isActive }
              )}>
                {item.label}
              </span>
              <item.icon
                className={cn(
                  'relative w-5 h-5 mt-1 transition-transform',
                   isActive ? 'scale-110' : 'scale-100'
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
