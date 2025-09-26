'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Pill, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const navItems = [
  { href: '/dashboard/profile', icon: User, label: 'پروفایل' },
  { href: '/dashboard/insights', icon: Bot, label: 'چت‌بات' },
  { href: '/dashboard/pharmacy', icon: Pill, label: 'داروخانه' },
  { href: '/dashboard', icon: Home, label: 'خانه' },
].reverse();

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-28 z-50 p-4 flex justify-center">
      <div className="relative glass-pane w-full max-w-sm h-full rounded-3xl flex items-center justify-around border border-white/10 shadow-lg">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isProfile = item.label === 'پروفایل';

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-full text-sm font-medium transition-colors duration-300 z-10"
            >
              <div className="relative z-10 flex flex-col items-center gap-1">
                 {isProfile ? (
                    <Avatar className={cn("h-7 w-7 border-2 transition-all", isActive ? "border-white" : "border-transparent")}>
                        <AvatarImage src={user?.photoURL || "https://picsum.photos/seed/user-profile-avatar/28/28"} />
                        <AvatarFallback>{user?.email?.[0].toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                ) : (
                    <item.icon
                        className={cn(
                            "transition-all",
                            isActive ? 'w-6 h-6' : 'w-6 h-6 text-gray-400 dark:text-gray-500'
                        )}
                        strokeWidth={isActive ? 2.5 : 2}
                    />
                )}
                {isActive && <span className="text-[10px] font-bold">{item.label}</span>}
              </div>

              {isActive && (
                <motion.div
                  layoutId="active-nav-indicator"
                  className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-2xl shadow-md z-0"
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
