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
import { Textarea } from "@/components/ui/textarea";

export default function SignupPage() {
  return (
    <div dir="rtl" className="flex items-center justify-center min-h-dvh py-12 bg-background">
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
            ایجاد حساب کاربری
          </CardTitle>
          <CardDescription className="text-center">
            برای شروع اطلاعات خود را وارد کنید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 text-right">
            <div className="grid gap-2">
              <Label htmlFor="full-name">نام کامل</Label>
              <Input
                id="full-name"
                placeholder="جان دو"
                required
                className="neumorphic-input"
              />
            </div>
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
              <Label htmlFor="password">رمز عبور</Label>
              <Input
                id="password"
                type="password"
                required
                className="neumorphic-input"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="health-conditions">
                شرایط سلامتی (اختیاری)
              </Label>
              <Textarea
                id="health-conditions"
                placeholder="مثال: فشار خون بالا, دیابت نوع ۲"
                className="neumorphic-input"
              />
              <p className="text-xs text-muted-foreground">
                این به ما کمک می کند تا بینش های شخصی سازی شده ارائه دهیم.
              </p>
            </div>
            <Button
              type="submit"
              className="w-full neumorphic-button bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/dashboard" className="w-full h-full flex items-center justify-center">ایجاد حساب کاربری</Link>
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            قبلاً حساب کاربری ساخته‌اید؟{" "}
            <Link href="/login" className="underline" prefetch={false}>
              ورود
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
