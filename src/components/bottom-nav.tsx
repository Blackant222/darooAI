'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Pill, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'داشبورد' },
  { href: '/dashboard/pharmacy', icon: Pill, label: 'داروخانه من' },
  { href: '/dashboard/insights', icon: Bot, label: 'چت‌بات AI' },
  { href: '/dashboard/profile', icon: User, label: 'پروفایل' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 w-full h-16 border-t bg-background/95 backdrop-blur-sm">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'inline-flex flex-col items-center justify-center px-5 hover:bg-muted/50 group',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <item.icon
                className={cn(
                  'w-5 h-5 mb-1 transition-transform group-hover:scale-110',
                   isActive ? 'text-primary' : 'text-gray-400'
                )}
              />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
