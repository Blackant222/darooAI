import Link from "next/link";
import { Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <div dir="rtl" className="flex items-center justify-center min-h-dvh bg-background">
      <Card className="mx-auto max-w-sm w-full neumorphic-card">
        <CardHeader>
          <Link
            href="/"
            className="flex items-center justify-center mb-4"
            prefetch={false}
          >
            <Pill className="h-8 w-8 text-primary" />
          </Link>
          <CardTitle className="text-2xl text-center font-headline">
            ورود به دارو AI
          </CardTitle>
          <CardDescription className="text-center">
            برای ورود به حساب کاربری، ایمیل خود را وارد کنید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 text-right">
            <div className="grid gap-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="neumorphic-input"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">رمز عبور</Label>
                <Link
                  href="#"
                  className="mr-auto inline-block text-sm underline"
                  prefetch={false}
                >
                  رمز عبور خود را فراموش کرده‌اید؟
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                className="neumorphic-input"
              />
            </div>
            <Button
              type="submit"
              className="w-full neumorphic-button bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/dashboard" className="w-full h-full flex items-center justify-center">ورود</Link>
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            حساب کاربری ندارید؟{" "}
            <Link href="/signup" className="underline" prefetch={false}>
              ثبت نام
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
