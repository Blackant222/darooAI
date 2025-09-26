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
  { href: '/dashboard', icon: Home, label: 'داشبورد' },
].reverse(); // Reverse for RTL layout

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-sm h-20 z-50">
      <div className="relative w-full h-full bg-zinc-900/80 dark:bg-black/80 backdrop-blur-lg rounded-full border border-white/10 shadow-2xl shadow-black/40 overflow-hidden bg-grain">
        <div className="absolute inset-0 flex h-full w-full items-center justify-around p-2">
            {navItems.map((item) => {
            const isActive = pathname === item.href;
            const isProfile = item.label === 'پروفایل';

            return (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "relative flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-full text-sm font-medium transition-colors duration-300 z-10",
                        isActive ? "text-white" : "text-accent hover:text-white"
                    )}
                >
                    {isProfile ? (
                        <Avatar className="h-7 w-7 border-2" style={{ borderColor: isActive ? 'hsl(var(--primary-foreground))' : 'hsl(var(--accent))'}}>
                            <AvatarImage src={user?.photoURL || "https://picsum.photos/seed/user-profile-avatar/28/28"} />
                            <AvatarFallback>{user?.email?.[0].toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                    ) : (
                        <item.icon
                            className={cn(
                                "transition-all",
                                isActive ? 'w-6 h-6' : 'w-5 h-5'
                            )}
                            strokeWidth={isActive ? 2.5 : 2}
                        />
                    )}
                    
                    <span className={cn(
                        "text-[10px] font-bold transition-opacity",
                        isActive ? "opacity-100" : "opacity-0"
                    )}>{item.label}</span>
                    
                    {isActive && (
                        <motion.div
                            layoutId="active-nav-glow"
                            className="absolute inset-0 bg-primary/20 rounded-full -z-10"
                            style={{
                                filter: 'blur(16px)',
                                background: 'radial-gradient(circle, hsl(var(--primary)) 0%, hsl(var(--accent)) 80%)'
                            }}
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                    )}
                </Link>
            );
            })}
        </div>
      </div>
    </nav>
  );
}
