'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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

  const latestDrug = drugs.length > 0 ? drugs.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())[0] : null;
  const drugDisplayName = latestDrug?.brandName || latestDrug?.activeIngredients.map(i => i.name).join(', ');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">خوش آمدید، {user?.displayName || 'کاربر'}!</h1>
        <p className="text-muted-foreground">
          در اینجا یک نمای کلی از داروخانه شما آورده شده است.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              تعداد کل داروها
            </CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Loader2 className="h-6 w-6 animate-spin"/> : <div className="text-2xl font-bold">{drugs.length}</div>}
            <p className="text-xs text-muted-foreground">
              در داروخانه مجازی شما
            </p>
          </CardContent>
        </Card>
        <Card className="bg-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">بینش هوش مصنوعی</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">۰</div>
            <p className="text-xs text-muted-foreground">
              توصیه جدید در دسترس است
            </p>
          </CardContent>
        </Card>
        <Card className="bg-secondary col-span-full lg:col-span-1 flex flex-col justify-center items-center p-6">
          <CardTitle className="text-lg font-semibold mb-2">
            افزودن داروی جدید
          </CardTitle>
          <CardDescription className="text-center mb-4">
            برای شروع، برچسب دارو را اسکن کنید.
          </CardDescription>
          <ScanDrugDialog>
            <Button className="w-full">
              <FileUp className="ml-2 h-4 w-4" /> اسکن کن
            </Button>
          </ScanDrugDialog>
        </Card>
      </div>

      <Card className="bg-secondary">
        <CardHeader>
          <CardTitle>فعالیت اخیر</CardTitle>
          <CardDescription>
            نمای کلی از گزارشات مصرف اخیر شما.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="flex justify-center items-center py-8">
                <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                <span>در حال بارگذاری فعالیت‌ها...</span>
            </div>
          ) : drugs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              فعالیت اخیری وجود ندارد.
            </p>
          ) : (
            <div className="space-y-4">
              {latestDrug && (
                 <div className="flex items-center">
                    <Activity className="h-5 w-5 text-muted-foreground ml-4" />
                    <div className="flex-grow">
                      <p className="font-medium">
                        <span className='font-bold'>{drugDisplayName}</span> اضافه شد.
                      </p>
                       <p className="text-sm text-muted-foreground">
                         {formatDistanceToNow(new Date(latestDrug.addedAt))} پیش
                      </p>
                    </div>
                  </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
