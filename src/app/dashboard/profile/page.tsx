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
import { Loader2 } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useOnboarding } from '@/context/onboarding-context';
import { useAuth } from '@/context/auth-context';

interface ProfileData {
  fullName: string;
  healthConditions: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { completeOnboarding } = useOnboarding();
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: '',
    healthConditions: '',
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProfileData() {
      if (!user) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setProfileData({
            fullName: data.full_name || user.user_metadata.full_name || '',
            healthConditions: (data.health_conditions || []).join(', '),
          });
        } else {
          setProfileData({
            fullName: user.user_metadata.full_name || '',
            healthConditions: '',
          });
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast({
          variant: "destructive",
          title: "خطا",
          description: "خطا در بارگذاری اطلاعات پروفایل.",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, [user, toast]);

  const handleSaveChanges = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: profileData.fullName,
        health_conditions: profileData.healthConditions.split(',').map(s => s.trim()).filter(Boolean),
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      
      await completeOnboarding();

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
    <Card className="bg-secondary">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">پروفایل من</CardTitle>
        <CardDescription>
          اطلاعات شخصی و وضعیت سلامتی خود را مدیریت کنید
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4 space-x-reverse">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.user_metadata.avatar_url || "https://picsum.photos/seed/user-profile-avatar/80/80"} data-ai-hint="person portrait"/>
            <AvatarFallback className="text-lg">
              {profileData.fullName.charAt(0) || user.email?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{profileData.fullName || 'کاربر'}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="fullName" className="text-sm font-medium">
              نام کامل
            </label>
            <input
              id="fullName"
              type="text"
              value={profileData.fullName}
              onChange={handleInputChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="نام کامل خود را وارد کنید"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="healthConditions" className="text-sm font-medium">
              شرایط سلامتی
            </label>
            <textarea
              id="healthConditions"
              value={profileData.healthConditions}
              onChange={handleInputChange}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="شرایط سلامتی خود را با کاما جدا کنید (مثال: دیابت، فشار خون)"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleSaveChanges} 
            disabled={isSaving}
            className="primary-gradient-bg"
          >
            {isSaving ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                در حال ذخیره...
              </>
            ) : (
              'ذخیره تغییرات'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}