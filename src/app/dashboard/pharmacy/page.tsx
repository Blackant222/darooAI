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
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ScanDrugDialog } from "@/components/scan-drug-dialog";

export default function PharmacyPage() {
  return (
    <Card className="neumorphic-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>داروخانه من</CardTitle>
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
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  دارویی یافت نشد. برای شروع یک دارو اضافه کنید.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
