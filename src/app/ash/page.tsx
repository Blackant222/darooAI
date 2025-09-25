'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FlagMedicationForm } from "./flag-medication-form";

export default function AdminPage() {
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">داشبورد ادمین</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">نمای کلی</TabsTrigger>
          <TabsTrigger value="drugs">مدیریت داروها</TabsTrigger>
          <TabsTrigger value="users">مدیریت کاربران</TabsTrigger>
          <TabsTrigger value="feedback">بازخورد هوش مصنوعی</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="neumorphic-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  تعداد کل کاربران
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">۱,۲۵۷</div>
              </CardContent>
            </Card>
            <Card className="neumorphic-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  تعداد کل داروهای مدیریت شده
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">۳۴۲</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="drugs" className="space-y-4">
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle>همه داروها</CardTitle>
              <CardDescription>
                تمام داروهای موجود در سیستم را مدیریت کنید.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                جدول مدیریت داروها اینجا قرار می گیرد...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users" className="space-y-4">
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle>همه کاربران</CardTitle>
              <CardDescription>تمام کاربران سیستم را مدیریت کنید.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                جدول مدیریت کاربران اینجا قرار می گیرد...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="feedback" className="space-y-4">
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle>پرچم های عدم انطباق هوش مصنوعی</CardTitle>
              <CardDescription>
                داروهایی که توسط هوش مصنوعی برای عدم انطباق علامت گذاری شده اند را بررسی کنید. این ابزار به شبیه سازی این فرآیند کمک می کند.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="neumorphic-button">
                    پرچم گذاری عدم انطباق داروها
                  </Button>
                </DialogTrigger>
                <DialogContent className="neumorphic-card">
                  <DialogHeader>
                    <DialogTitle>بررسی عدم انطباق توسط هوش مصنوعی</DialogTitle>
                    <DialogDescription>
                      برای بررسی عدم انطباق های احتمالی، جزئیات دارو را وارد کنید.
                    </DialogDescription>
                  </DialogHeader>
                  <FlagMedicationForm />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
