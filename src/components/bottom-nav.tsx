'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Pill, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'خانه' },
  { href: '/dashboard/pharmacy', icon: Pill, label: 'داروخانه' },
  { href: '/dashboard/insights', icon: Bot, label: 'چت‌بات' },
  { href: '/dashboard/profile', icon: 'USER', label: 'پروفایل' },
];

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 h-16 z-50 flex justify-center">
      <div className="relative w-auto h-full flex items-center justify-around gap-2 px-3 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-full shadow-lg">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isProfile = item.href === '/dashboard/profile';
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center w-16 h-16 rounded-full transition-colors duration-300 z-10 text-muted-foreground hover:text-primary",
                isActive && "text-primary"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav-indicator"
                  className="absolute inset-0 bg-white dark:bg-zinc-900 rounded-full shadow-md z-[-1]"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
               {isProfile && user ? (
                <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url || "https://picsum.photos/seed/user-nav-avatar/40/40"} data-ai-hint="person portrait"/>
                    <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
               ) : (
                item.icon !== 'USER' && <item.icon className="w-7 h-7" strokeWidth={isActive ? 2.5 : 2}/>
               )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
