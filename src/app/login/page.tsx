'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pill, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '@/context/auth-context';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if user is already logged in
  if (user) {
    router.push('/dashboard');
    return null; // or a loading spinner
  }

  return (
    <div dir="rtl" className="flex items-center justify-center min-h-dvh bg-background">
      <Card className="mx-auto max-w-sm w-full neumorphic-card">
        <CardHeader>
          <Link href="/" className="flex items-center justify-center mb-4" prefetch={false}>
            <Pill className="h-8 w-8 text-primary" />
            <span className="mr-2 text-xl font-bold font-headline">دارو AI</span>
          </Link>
          <CardTitle className="text-2xl text-center font-headline">ورود به حساب کاربری</CardTitle>
          <CardDescription className="text-center">برای ادامه، ایمیل و رمز عبور خود را وارد کنید.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4 text-right">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="neumorphic-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">رمز عبور</Label>
                <Link href="#" className="mr-auto inline-block text-sm underline" prefetch={false}>
                  رمز عبور خود را فراموش کرده‌اید؟
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                className="neumorphic-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full neumorphic-button bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'ورود'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            حساب کاربری ندارید؟{' '}
            <Link href="/signup" className="underline" prefetch={false}>
              ثبت نام
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getFirebaseErrorMessage(error: any): string {
  switch (error.code) {
    case 'auth/invalid-email':
      return 'فرمت ایمیل نامعتبر است.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'ایمیل یا رمز عبور نامعتبر است.';
    case 'auth/too-many-requests':
        return 'دسترسی به این حساب به دلیل تلاش‌های مکرر برای ورود به سیستم به طور موقت غیرفعال شده است. لطفاً بعداً دوباره امتحان کنید.';
    default:
      return 'خطایی در هنگام ورود رخ داد. لطفاً دوباره امتحان کنید.';
  }
}
