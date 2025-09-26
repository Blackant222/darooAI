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
    <nav className="fixed bottom-0 left-0 right-0 h-[88px] z-50">
      <div
        className="relative w-full h-full bg-white/90 dark:bg-black/95 backdrop-blur-lg border-t border-black/5 dark:border-white/10 shadow-nav-light dark:shadow-nav-dark"
      >
        <div className="flex justify-around items-center h-full px-1">
            {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
                <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center text-center w-1/4 h-full"
                >
                {isActive && (
                    <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute w-16 h-12 bg-nav-active-gradient rounded-2xl shadow-nav-active-glow"
                    style={{
                        boxShadow: '0px 4px 12px rgba(99, 102, 241, 0.36), inset 0px 1px 2px rgba(255, 255, 255, 0.4)',
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 35 }}
                    />
                )}
                
                <motion.div
                    className="relative z-10"
                    animate={{ scale: isActive ? 1.1 : 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                    <item.icon
                        className={cn(
                            "transition-colors",
                            isActive ? 'w-6 h-6 text-white' : 'w-6 h-6 text-gray-400 dark:text-gray-500'
                        )}
                        strokeWidth={isActive ? 2.5 : 2}
                    />
                </motion.div>

                <span
                    className={cn(
                    'relative z-10 mt-1 text-[11px] transition-colors',
                    isActive
                        ? 'font-semibold text-white'
                        : 'font-medium text-gray-400 dark:text-gray-500'
                    )}
                >
                    {item.label}
                </span>
                </Link>
            );
            })}
        </div>
      </div>
    </nav>
  );
}
