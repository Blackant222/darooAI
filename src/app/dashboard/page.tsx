import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, Lightbulb, Pill } from "lucide-react";
import { ScanDrugDialog } from "@/components/scan-drug-dialog";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">خوش آمدید!</h1>
        <p className="text-muted-foreground">
          در اینجا یک نمای کلی از داروخانه شما آورده شده است.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="neumorphic-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              تعداد کل داروها
            </CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">۵</div>
            <p className="text-xs text-muted-foreground">
              در داروخانه مجازی شما
            </p>
          </CardContent>
        </Card>
        <Card className="neumorphic-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">بینش هوش مصنوعی</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">۲</div>
            <p className="text-xs text-muted-foreground">
              توصیه جدید در دسترس است
            </p>
          </CardContent>
        </Card>
        <Card className="neumorphic-card col-span-full lg:col-span-1 flex flex-col justify-center items-center p-6">
          <CardTitle className="text-lg font-semibold mb-2">
            افزودن داروی جدید
          </CardTitle>
          <CardDescription className="text-center mb-4">
            برای شروع، برچسب دارو را اسکن کنید.
          </CardDescription>
          <ScanDrugDialog>
            <Button className="w-full neumorphic-button bg-primary text-primary-foreground hover:bg-primary/90">
              <FileUp className="ml-2 h-4 w-4" /> اسکن کن
            </Button>
          </ScanDrugDialog>
        </Card>
      </div>

      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle>فعالیت اخیر</CardTitle>
          <CardDescription>
            نمای کلی از گزارشات مصرف اخیر شما.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            فعالیت اخیری وجود ندارد.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
