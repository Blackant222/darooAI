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
].reverse();

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-24 z-50 p-3 flex justify-center md:hidden">
      <div className="glass-pane w-full max-w-sm h-full rounded-3xl flex items-center justify-around border border-white/10 shadow-lg">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isProfile = item.label === 'پروفایل';

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-full text-sm font-medium transition-colors duration-300 z-10",
                isActive ? "text-primary" : "text-muted-foreground/60"
              )}
            >
              {isProfile ? (
                 <Avatar className={cn("h-7 w-7 border-2 transition-all", isActive ? "border-primary" : "border-transparent")}>
                    <AvatarImage src={user?.photoURL || "https://picsum.photos/seed/user-profile-avatar/28/28"} />
                    <AvatarFallback>{user?.email?.[0].toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
              ) : (
                <item.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2}/>
              )}
              
              <span className='font-semibold text-xs'>{item.label}</span>
              
              {isActive && (
                <motion.div
                  layoutId="active-nav-indicator"
                  className="absolute inset-0 bg-white/80 dark:bg-white/10 rounded-2xl shadow-md z-[-1]"
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
