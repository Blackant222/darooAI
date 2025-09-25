import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, PlusCircle } from "lucide-react";
import { ScanDrugDialog } from "@/components/scan-drug-dialog";

const mockMedications = [
  {
    id: "1",
    name: "لیزینوپریل",
    use: "فشار خون بالا",
    tags: ["مهارکننده ACE", "روزانه", "با غذا"],
    lastTaken: "امروز, ۸:۰۰ صبح",
  },
  {
    id: "2",
    name: "متفورمین",
    use: "دیابت نوع ۲",
    tags: ["بیگوانید", "دو بار در روز", "خوراکی"],
    lastTaken: "امروز, ۹:۰۰ صبح",
  },
  {
    id: "3",
    name: "سیمواستاتین",
    use: "کلسترول بالا",
    tags: ["استاتین", "عصر", "کاهش دهنده چربی"],
    lastTaken: "دیروز, ۹:۰۰ شب",
  },
  {
    id: "4",
    name: "آملودیپین",
    use: "فشار خون بالا",
    tags: ["مسدود کننده کانال کلسیم", "روزانه"],
    lastTaken: "امروز, ۸:۰۰ صبح",
  },
];

export default function PharmacyPage() {
  return (
    <Card className="neumorphic-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>داروخانه مجازی من</CardTitle>
          <CardDescription>
            تمام داروهای ذخیره شده شما در یک مکان.
          </CardDescription>
        </div>
        <ScanDrugDialog>
          <Button className="neumorphic-button">
            <PlusCircle className="ml-2 h-4 w-4" /> افزودن دارو
          </Button>
        </ScanDrugDialog>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>نام دارو</TableHead>
                <TableHead>کاربرد اصلی</TableHead>
                <TableHead>تگ ها</TableHead>
                <TableHead>آخرین مصرف</TableHead>
                <TableHead className="text-left">اقدامات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMedications.map((med) => (
                <TableRow key={med.id}>
                  <TableCell className="font-medium">{med.name}</TableCell>
                  <TableCell>{med.use}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {med.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{med.lastTaken}</TableCell>
                  <TableCell className="text-left">
                    <Button variant="outline" size="sm" className="neumorphic-button">
                      <Clock className="ml-2 h-4 w-4" /> ثبت مصرف
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
