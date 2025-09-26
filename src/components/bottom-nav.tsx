'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Pill, Bot, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const navItems = [
  { href: '/dashboard/profile', icon: UserIcon, label: 'پروفایل' },
  { href: '/dashboard/insights', icon: Bot, label: 'چت‌بات' },
  { href: '/dashboard/pharmacy', icon: Pill, label: 'داروخانه' },
  { href: '/dashboard', icon: Home, label: 'خانه' },
];

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-4 left-4 right-4 h-20 z-50 flex justify-center md:hidden">
      <div className="w-full max-w-sm h-full rounded-2xl flex items-center justify-around glass-pane border border-white/10 shadow-lg px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 w-16 h-16 text-sm font-medium transition-colors duration-300 z-10",
                isActive ? "text-foreground" : "text-muted-foreground/60 hover:text-foreground/80"
              )}
            >
              <item.icon className="w-6 h-6" strokeWidth={isActive ? 2 : 1.5}/>
              <span className='font-semibold text-xs'>{item.label}</span>
              
              {isActive && (
                <motion.div
                  layoutId="active-nav-indicator"
                  className="absolute inset-0 bg-white/90 dark:bg-white/10 rounded-xl shadow-md z-[-1]"
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