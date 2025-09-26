'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Pill, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'داشبورد' },
  { href: '/dashboard/pharmacy', icon: Pill, label: 'داروخانه' },
  { href: '/dashboard/insights', icon: Bot, label: 'چت‌بات' },
  { href: '/dashboard/profile', icon: User, label: 'پروفایل' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[90vw] max-w-md z-50">
      <div className="h-16 w-full rounded-full border bg-background/80 backdrop-blur-sm shadow-lg flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center text-muted-foreground w-16 h-16 rounded-full transition-all duration-300',
                'hover:text-primary',
                { 'text-primary bg-primary/10': isActive }
              )}
            >
              <item.icon
                className={cn(
                  'w-6 h-6 mb-1 transition-transform group-hover:scale-110'
                )}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
