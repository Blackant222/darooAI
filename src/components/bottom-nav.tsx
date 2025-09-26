'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Pill, Bot, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/dashboard/profile', icon: UserIcon, label: 'پروفایل' },
  { href: '/dashboard/insights', icon: Bot, label: 'چت‌بات' },
  { href: '/dashboard/pharmacy', icon: Pill, label: 'داروخانه' },
  { href: '/dashboard', icon: Home, label: 'خانه' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-24 z-50 flex justify-center">
      <div className="w-full max-w-md h-full flex items-center justify-around glass-pane border-t border-white/10 shadow-lg px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1.5 w-20 h-20 text-sm font-medium transition-colors duration-300 z-10 rounded-2xl",
                isActive ? "text-foreground" : "text-muted-foreground/80 hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav-indicator"
                  className="absolute inset-0 bg-white/90 dark:bg-white/10 rounded-2xl shadow-md z-[-1]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <item.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 1.5}/>
              <span className='font-semibold text-xs'>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
