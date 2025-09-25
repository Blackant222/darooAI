'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pill, ArrowRight, ArrowLeft } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const totalSteps = 4;

export default function SignupPage() {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div
      dir="rtl"
      className="flex items-center justify-center min-h-dvh py-12 bg-background"
    >
      <Card className="mx-auto max-w-md w-full neumorphic-card">
        <CardHeader>
          <Link
            href="/"
            className="flex items-center justify-center mb-4"
            prefetch={false}
          >
            <Pill className="h-8 w-8 text-primary" />
          </Link>
          <CardTitle className="text-2xl text-center font-headline">
            {step === totalSteps ? 'تکمیل ثبت‌نام' : 'ایجاد پروفایل سلامتی'}
          </CardTitle>
          <CardDescription className="text-center">
            {step === 1 && 'برای شروع، اطلاعات حساب خود را وارد کنید.'}
            {step === 2 && 'شرایط سلامتی و آلرژی‌های خود را مشخص کنید.'}
            {step === 3 && 'اهداف و سبک زندگی خود را با ما در میان بگذارید.'}
            {step === 4 && 'لطفاً با شرایط استفاده و حریم خصوصی موافقت کنید.'}
          </CardDescription>
          <Progress value={(step / totalSteps) * 100} className="w-full mt-4" />
        </CardHeader>
        <CardContent>
          <form className="space-y-4 text-right">
            {step === 1 && <Step1 />}
            {step === 2 && <Step2 />}
            {step === 3 && <Step3 />}
            {step === 4 && <Step4 />}
          </form>

          <div className="mt-6 flex gap-4">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={prevStep}
                className="w-full neumorphic-button"
              >
                <ArrowRight className="ml-2" />
                قبلی
              </Button>
            )}
            {step < totalSteps ? (
              <Button
                onClick={nextStep}
                className="w-full neumorphic-button bg-primary text-primary-foreground hover:bg-primary/90"
              >
                بعدی
                <ArrowLeft className="mr-2" />
              </Button>
            ) : (
              <Button
                asChild
                className="w-full neumorphic-button bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link
                  href="/dashboard"
                  className="w-full h-full flex items-center justify-center"
                >
                  ایجاد حساب کاربری
                </Link>
              </Button>
            )}
          </div>

          <div className="mt-4 text-center text-sm">
            قبلاً حساب کاربری ساخته‌اید؟{' '}
            <Link href="/login" className="underline" prefetch={false}>
              ورود
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Step1() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="full-name">نام کامل</Label>
        <Input
          id="full-name"
          placeholder="مثال: سارا محمدی"
          required
          className="neumorphic-input"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">ایمیل</Label>
        <Input
          id="email"
          type="email"
          placeholder="sara@example.com"
          required
          className="neumorphic-input"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">رمز عبور</Label>
        <Input id="password" type="password" required className="neumorphic-input" />
      </div>
    </div>
  );
}

function Step2() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="health-conditions">شرایط سلامتی</Label>
        <Textarea
          id="health-conditions"
          placeholder="مثال: فشار خون بالا, دیابت نوع ۲, آسم"
          className="neumorphic-input"
        />
        <p className="text-xs text-muted-foreground">
          شرایط مزمن یا موجود خود را با کاما جدا کنید.
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="allergies">آلرژی‌های دارویی (اختیاری)</Label>
        <Textarea
          id="allergies"
          placeholder="مثال: پنی‌سیلین, آسپرین"
          className="neumorphic-input"
        />
      </div>
    </div>
  );
}

function Step3() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="health-goals">اهداف سلامتی (اختیاری)</Label>
        <Input
          id="health-goals"
          placeholder="مثال: کاهش وزن, مدیریت فشار خون"
          className="neumorphic-input"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="activity-level">سطح فعالیت</Label>
          <Select>
            <SelectTrigger id="activity-level" className="neumorphic-input">
              <SelectValue placeholder="انتخاب کنید" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">کم</SelectItem>
              <SelectItem value="moderate">متوسط</SelectItem>
              <SelectItem value="high">زیاد</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="smoking">مصرف سیگار</Label>
          <Select>
            <SelectTrigger id="smoking" className="neumorphic-input">
              <SelectValue placeholder="انتخاب کنید" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no">خیر</SelectItem>
              <SelectItem value="occasionally">گاهی</SelectItem>
              <SelectItem value="yes">بله</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

function Step4() {
  return (
    <div className="grid gap-4">
       <div className="items-top flex space-x-2 space-x-reverse">
        <Checkbox id="terms" />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
           با <Link href="#" className='underline'>شرایط و قوانین</Link> موافقم.
          </label>
           <p className="text-sm text-muted-foreground">
            شما با شرایط استفاده ما موافقت می کنید.
          </p>
        </div>
      </div>
       <div className="items-top flex space-x-2 space-x-reverse">
        <Checkbox id="privacy" />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="privacy"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
           با <Link href="#" className='underline'>سیاست حفظ حریم خصوصی</Link> موافقم.
          </label>
           <p className="text-sm text-muted-foreground">
            شما با سیاست حفظ حریم خصوصی ما موافقت می کنید.
          </p>
        </div>
      </div>
    </div>
  );
}