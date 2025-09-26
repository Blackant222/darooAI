'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pill, ArrowRight, ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MultiSelectChip } from '@/components/multi-select-chip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';


const totalSteps = 4;

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
      fullName: '',
      email: '',
      password: '',
      healthConditions: [] as string[],
      allergies: [] as string[],
      healthGoals: [] as string[],
      activityLevel: '',
      smokingStatus: '',
      agreedToTerms: false,
      agreedToPrivacy: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();


  const handleChange = (field: string, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));
  
  const handleSignup = async () => {
    if (!formData.agreedToTerms || !formData.agreedToPrivacy) {
        setError("برای ادامه باید با شرایط و سیاست حفظ حریم خصوصی موافقت کنید.");
        return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: formData.fullName });

        // Temporarily disable saving profile to Firestore to unblock signup.
        // This can be re-enabled after Firestore is fully provisioned in the Firebase console.
        
        // const userDocRef = doc(db, 'users', user.uid);
        // await setDoc(userDocRef, {
        //     fullName: formData.fullName,
        //     email: formData.email,
        //     healthConditions: formData.healthConditions,
        //     allergies: formData.allergies,
        //     healthGoals: formData.healthGoals,
        //     activityLevel: formData.activityLevel,
        //     smokingStatus: formData.smokingStatus,
        //     createdAt: new Date().toISOString(),
        // });

        router.push('/dashboard');

    } catch (err: any) {
        setError(getFirebaseErrorMessage(err));
    } finally {
        setIsLoading(false);
    }
  };


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
             <span className="mr-2 text-xl font-bold font-headline">دارو AI</span>
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
          <div className="space-y-4 text-right">
             {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {step === 1 && <Step1 formData={formData} onChange={handleChange} />}
            {step === 2 && <Step2 formData={formData} onChange={handleChange} />}
            {step === 3 && <Step3 formData={formData} onChange={handleChange} />}
            {step === 4 && <Step4 formData={formData} onChange={handleChange} />}
          </div>

          <div className="mt-6 flex gap-4">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={prevStep}
                className="w-full neumorphic-button"
                disabled={isLoading}
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
                onClick={handleSignup}
                className="w-full neumorphic-button bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading || !formData.agreedToTerms || !formData.agreedToPrivacy}
              >
                {isLoading ? <Loader2 className='animate-spin' /> : 'ایجاد حساب کاربری'}
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

interface StepProps {
    formData: any;
    onChange: (field: string, value: any) => void;
}

function Step1({ formData, onChange }: StepProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="full-name">نام کامل</Label>
        <Input
          id="full-name"
          placeholder="مثال: سارا محمدی"
          required
          className="neumorphic-input"
          value={formData.fullName}
          onChange={(e) => onChange('fullName', e.target.value)}
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
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">رمز عبور</Label>
        <Input id="password" type="password" required className="neumorphic-input" value={formData.password} onChange={(e) => onChange('password', e.target.value)} />
      </div>
    </div>
  );
}

const healthConditionOptions = ["فشار خون بالا", "دیابت نوع ۲", "آسم", "کلسترول بالا", "آرتروز", "میگرن"];
const allergyOptions = ["پنی‌سیلین", "آسپرین", "سولفا", "ایبوپروفن", "کدئین"];

function Step2({ formData, onChange }: StepProps) {
  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <Label htmlFor="health-conditions">شرایط سلامتی</Label>
        <MultiSelectChip
            options={healthConditionOptions}
            selected={formData.healthConditions}
            onChange={(selected) => onChange('healthConditions', selected)}
            placeholder="شرایط دیگر را وارد کنید..."
        />
        <p className="text-xs text-muted-foreground">
          گزینه‌های رایج را انتخاب یا مورد خود را تایپ کنید.
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="allergies">آلرژی‌های دارویی (اختیاری)</Label>
        <MultiSelectChip
            options={allergyOptions}
            selected={formData.allergies}
            onChange={(selected) => onChange('allergies', selected)}
            placeholder="آلرژی دیگر را وارد کنید..."
        />
      </div>
    </div>
  );
}

const healthGoalOptions = ["کاهش وزن", "مدیریت فشار خون", "خواب بهتر", "کاهش استرس", "افزایش انرژی"];

function Step3({ formData, onChange }: StepProps) {
  return (
    <div className="grid gap-6">
       <div className="grid gap-2">
        <Label htmlFor="health-goals">اهداف سلامتی (اختیاری)</Label>
        <MultiSelectChip
            options={healthGoalOptions}
            selected={formData.healthGoals}
            onChange={(selected) => onChange('healthGoals', selected)}
            placeholder="هدف دیگر را وارد کنید..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="activity-level">سطح فعالیت</Label>
          <Select value={formData.activityLevel} onValueChange={(value) => onChange('activityLevel', value)}>
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
          <Select value={formData.smokingStatus} onValueChange={(value) => onChange('smokingStatus', value)}>
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

function Step4({ formData, onChange }: StepProps) {
  return (
    <div className="grid gap-4">
       <div className="items-top flex space-x-2 space-x-reverse">
        <Checkbox id="terms" checked={formData.agreedToTerms} onCheckedChange={(checked) => onChange('agreedToTerms', !!checked)} />
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
        <Checkbox id="privacy" checked={formData.agreedToPrivacy} onCheckedChange={(checked) => onChange('agreedToPrivacy', !!checked)} />
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

function getFirebaseErrorMessage(error: any): string {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'این ایمیل قبلاً ثبت‌نام کرده است.';
    case 'auth/invalid-email':
      return 'فرمت ایمیل نامعتبر است.';
    case 'auth/weak-password':
      return 'رمز عبور باید حداقل ۶ کاراکتر باشد.';
    default:
      return 'خطایی در هنگام ثبت‌نام رخ داد. لطفاً دوباره امتحان کنید.';
  }
}
