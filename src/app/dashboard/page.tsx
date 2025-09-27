'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, Lightbulb, Pill, Activity, Loader2 } from "lucide-react";
import { ScanDrugDialog } from "@/components/scan-drug-dialog";
import { useDrugContext } from "@/context/drug-context";
import { formatDistanceToNow } from 'date-fns-jalali';
import { useAuth } from "@/context/auth-context";

export default function DashboardPage() {
  const { drugs, loading } = useDrugContext();
  const { user } = useAuth();

  const latestDrug = drugs.length > 0 ? drugs[0] : null; // Already sorted in context
  const drugDisplayName = latestDrug?.brandName || latestDrug?.activeIngredients.map(i => i.name).join(', ');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">خوش آمدید، {user?.user_metadata?.full_name || user?.email || 'کاربر'}!</h1>
        <p className="text-muted-foreground text-base">
          در اینجا یک نمای کلی از داروخانه شما آورده شده است.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass-card p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-semibold text-foreground/80">
              تعداد کل داروها
            </h3>
            <Pill className="h-5 w-5 text-foreground/60" />
          </div>
          <div>
            {loading ? <Loader2 className="h-8 w-8 animate-spin primary-gradient-text"/> : <div className="text-4xl font-bold">{drugs.length}</div>}
            <p className="text-xs text-muted-foreground">
              در داروخانه مجازی شما
            </p>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-semibold text-foreground/80">بینش هوش مصنوعی</h3>
            <Lightbulb className="h-5 w-5 text-foreground/60" />
          </div>
          <div>
            <div className="text-4xl font-bold">۰</div>
            <p className="text-xs text-muted-foreground">
              توصیه جدید در دسترس است
            </p>
          </div>
        </div>
      </div>
      
      <ScanDrugDialog>
        <Button size="lg" className="w-full primary-gradient-bg text-lg h-14 rounded-2xl">
            <FileUp className="ml-2 h-6 w-6" /> افزودن داروی جدید
        </Button>
      </ScanDrugDialog>


      <div className="glass-card p-6">
        <h3 className="font-semibold text-lg mb-4">فعالیت اخیر</h3>
        <div>
          {loading ? (
             <div className="flex justify-center items-center py-8">
                <Loader2 className="ml-2 h-5 w-5 animate-spin primary-gradient-text" />
                <span>در حال بارگذاری فعالیت‌ها...</span>
            </div>
          ) : drugs.length === 0 ? (
            <div className="text-muted-foreground text-center py-8 flex flex-col items-center gap-2">
                <Activity className="w-8 h-8" />
              <p>فعالیت اخیری وجود ندارد.</p>
              <p className="text-xs">برای شروع، داروی جدیدی اضافه کنید.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {latestDrug && (
                 <div className="flex items-center">
                    <div className="p-3 bg-blue-500/10 rounded-full">
                        <Activity className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-grow mr-4">
                      <p className="font-medium">
                        <span className='font-bold'>{drugDisplayName}</span> به داروخانه شما اضافه شد.
                      </p>
                       <p className="text-sm text-muted-foreground">
                         {formatDistanceToNow(new Date(latestDrug.addedAt))} پیش
                      </p>
                    </div>
                  </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
