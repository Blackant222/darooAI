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
    <nav className="fixed bottom-4 left-0 right-0 h-16 z-50 flex justify-center items-center">
      <div
        className="relative w-auto h-full bg-white/50 dark:bg-black/50 backdrop-blur-lg border border-black/5 dark:border-white/10 shadow-lg rounded-full px-4"
      >
        <div className="flex justify-around items-center h-full">
            {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center text-center w-20 h-full"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="relative flex flex-col items-center justify-center p-2"
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-indicator"
                      className="absolute inset-0 w-10 h-10 mx-auto bg-nav-active-gradient rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  
                  <motion.div
                    className="relative z-10"
                    animate={{ scale: isActive ? 1.1 : 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <item.icon
                      className={cn(
                        "transition-colors mb-0.5",
                        isActive ? 'w-5 h-5 text-white' : 'w-5 h-5 text-gray-500 dark:text-gray-400'
                      )}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  </motion.div>

                  <span
                    className={cn(
                      'relative z-10 text-[10px] transition-colors',
                      isActive
                        ? 'font-bold text-white'
                        : 'font-medium text-gray-500 dark:text-gray-400'
                    )}
                  >
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            );
            })}
        </div>
      </div>
    </nav>
  );
}
