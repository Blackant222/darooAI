'use client';
import React from 'react';
import { Logo } from '@/components/logo';
import { UserNav } from '@/components/user-nav';
import { BottomNav } from '@/components/bottom-nav';
import { DrugProvider } from '@/context/drug-context';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AuthProvider } from '@/context/auth-context';
import { OnboardingProvider } from '@/context/onboarding-context';
import OnboardingWizard from '@/components/onboarding-wizard';
import { ThemeToggle } from '@/components/theme-toggle';

function AppHeader() {
  return (
    <header className="flex h-20 items-center justify-between px-4 md:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Logo collapsed={false} />
      </div>

      <div className="flex items-center gap-2">
        <UserNav />
      </div>
    </header>
  );
}

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div dir="rtl" className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin primary-gradient-text" />
        <p className="mr-4">در حال بارگذاری اطلاعات کاربری...</p>
      </div>
    );
  }

  return (
    <DrugProvider>
      <OnboardingProvider>
        <div dir="rtl" className="flex flex-col min-h-dvh">
            <AppHeader />
            <main id="main-content" className="flex-1 p-4 pb-40 md:p-8">{children}</main>
            <OnboardingWizard />
        </div>
      </OnboardingProvider>
    </DrugProvider>
  );
}


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <DashboardLayoutContent>{children}</DashboardLayoutContent>
            <BottomNav />
        </AuthProvider>
    )
}
