
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
        <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
  }

  if (!user) {
    return <p>لطفا برای دیدن پروفایل خود وارد شوید.</p>;
  }

  return (
    <Card className="neumorphic-card">
      <CardHeader>
        <CardTitle>پروفایل من</CardTitle>
        <CardDescription>
          اطلاعات شخصی و شرایط سلامتی خود را به روز کنید.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4 space-x-reverse">
          <Avatar className="h-20 w-20 neumorphic-card p-1">
            <AvatarImage src={user.photoURL || "https://picsum.photos/seed/user-profile-avatar/80/80"} data-ai-hint="person portrait"/>
            <AvatarFallback>{user.email?.[0].toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <Button variant="outline" className="neumorphic-button">
            تغییر عکس
          </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">نام کامل</Label>
            <Input id="name" placeholder="نام خود را وارد کنید" defaultValue={user.displayName || ""} className="neumorphic-input" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">ایمیل</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              defaultValue={user.email || ""}
              disabled
              className="neumorphic-input"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="health-conditions">شرایط سلامتی</Label>
          <Textarea
            id="health-conditions"
            placeholder="مثال: فشار خون بالا, دیابت نوع ۲"
            className="neumorphic-input"
            defaultValue="فشار خون بالا, دیابت نوع ۲"
          />
           <p className="text-xs text-muted-foreground pt-1">
              این اطلاعات به چت‌بات هوش مصنوعی کمک می‌کند تا توصیه‌های دقیق‌تری به شما ارائه دهد.
            </p>
        </div>
        <div className="flex justify-end">
          <Button className="neumorphic-button">ذخیره تغییرات</Button>
        </div>
      </CardContent>
    </Card>
  );
}
