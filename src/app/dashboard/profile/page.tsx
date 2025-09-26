
'use client';

import { useState, useEffect } from 'react';
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
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface ProfileData {
    fullName: string;
    healthConditions: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: '',
    healthConditions: '',
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProfileData() {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfileData({
            fullName: data.fullName || user.displayName || '',
            healthConditions: (data.healthConditions || []).join(', '),
        });
      } else {
        // Prefill with auth data if no profile doc exists
         setProfileData({
            fullName: user.displayName || '',
            healthConditions: '',
        });
      }
      setLoading(false);
    }

    fetchProfileData();
  }, [user]);

  const handleSaveChanges = async () => {
    if (!user) return;

    setIsSaving(true);
    const userDocRef = doc(db, 'users', user.uid);
    try {
      // We merge to avoid overwriting other fields like email, createdAt etc.
      await setDoc(userDocRef, {
        fullName: profileData.fullName,
        healthConditions: profileData.healthConditions.split(',').map(s => s.trim()).filter(Boolean),
      }, { merge: true });

      toast({
        title: "پروفایل به‌روزرسانی شد",
        description: "تغییرات شما با موفقیت ذخیره شد.",
      });
    } catch (error) {
      console.error("Error updating profile: ", error);
      toast({
        variant: "destructive",
        title: "خطا",
        description: "ذخیره تغییرات ناموفق بود.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProfileData(prev => ({...prev, [id]: value}));
  }

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
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>پروفایل من</CardTitle>
        <CardDescription>
          اطلاعات شخصی و شرایط سلامتی خود را به روز کنید.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4 space-x-reverse">
          <Avatar className="h-20 w-20 border p-1">
            <AvatarImage src={user.photoURL || "https://picsum.photos/seed/user-profile-avatar/80/80"} data-ai-hint="person portrait"/>
            <AvatarFallback>{user.email?.[0].toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <Button variant="outline">
            تغییر عکس
          </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">نام کامل</Label>
            <Input id="fullName" placeholder="نام خود را وارد کنید" value={profileData.fullName} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">ایمیل</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              defaultValue={user.email || ""}
              disabled
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="healthConditions">شرایط سلامتی</Label>
          <Textarea
            id="healthConditions"
            placeholder="مثال: فشار خون بالا, دیابت نوع ۲"
            value={profileData.healthConditions}
            onChange={handleInputChange}
          />
           <p className="text-xs text-muted-foreground pt-1">
              این اطلاعات به چت‌بات هوش مصنوعی کمک می‌کند تا توصیه‌های دقیق‌تری به شما ارائه دهد. شرایط را با کاما جدا کنید.
            </p>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving ? <Loader2 className='ml-2 animate-spin' /> : null}
            ذخیره تغییرات
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
