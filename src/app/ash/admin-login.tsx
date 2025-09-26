'use client';

import { useState } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAdminAuth } from '@/context/admin-auth-context';
import { IbnSinaLogo } from '@/components/ibn-sina-logo';

export function AdminLogin() {
  const { login } = useAdminAuth();
  const [username, setUsername] = useState('Admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const result = await login(password);
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <Card className="mx-auto max-w-sm w-full bg-secondary neumorphic-light dark:neumorphic-dark border-none">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <IbnSinaLogo className="h-8 w-8 text-primary" />
            <span className="mr-2 text-xl font-bold font-headline">پنل ادمین ابن سینا</span>
          </div>
          <CardTitle className="text-2xl font-headline">ورود</CardTitle>
          <CardDescription>برای دسترسی به پنل ادمین وارد شوید.</CardDescription>
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
              <Label htmlFor="username">نام کاربری</Label>
              <Input id="username" value={username} disabled />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">رمز عبور</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'ورود'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
