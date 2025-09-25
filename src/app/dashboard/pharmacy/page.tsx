'use client';

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
import { PlusCircle, MoreHorizontal, Trash2 } from "lucide-react";
import { ScanDrugDialog } from "@/components/scan-drug-dialog";
import { useDrugContext } from "@/context/drug-context";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns-jalali';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


export default function PharmacyPage() {
    const { drugs, removeDrug } = useDrugContext();
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
                <TableHead>ماده موثره</TableHead>
                <TableHead>دسته بندی</TableHead>
                <TableHead>زمان افزودن</TableHead>
                <TableHead className="text-left">اقدامات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drugs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    دارویی یافت نشد. برای شروع یک دارو اضافه کنید.
                  </TableCell>
                </TableRow>
              ) : (
                drugs.map((drug) => (
                    <TableRow key={drug.id}>
                        <TableCell className="font-medium">{drug.brandName || drug.activeIngredients.join(', ')}</TableCell>
                        <TableCell>{drug.activeIngredients.join(', ')}</TableCell>
                        <TableCell>{drug.category}</TableCell>
                        <TableCell>{formatDistanceToNow(new Date(drug.addedAt))} پیش</TableCell>
                        <TableCell className="text-left">
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">باز کردن منو</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" dir="rtl" className="neumorphic-card">
                                <DropdownMenuItem onClick={() => removeDrug(drug.id)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                  <Trash2 className="ml-2 h-4 w-4" />
                                  حذف
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
