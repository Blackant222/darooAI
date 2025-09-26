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
    <nav className="fixed bottom-6 left-0 right-0 h-16 z-50 flex justify-center md:hidden">
      <div className="relative w-auto h-full flex items-center justify-around gap-2 px-3 glass-pane border rounded-full shadow-lg">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isProfile = item.href === '/dashboard/profile';
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-300 z-10",
                isActive ? "text-white" : "text-muted-foreground/80 hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav-indicator"
                  className="absolute inset-0 bg-white rounded-full shadow-md z-[-1]"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
               {isProfile && user ? (
                <Avatar className="h-8 w-8 border-2" style={{borderColor: isActive ? '#4361EE' : 'transparent'}}>
                    <AvatarImage src={user.photoURL || "https://picsum.photos/seed/user-profile-avatar/32/32"} />
                    <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
               ) : (
                <item.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2}/>
               )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
