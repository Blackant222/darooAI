'use client';

import { useState } from "react";
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
import { PlusCircle, MoreHorizontal, Trash2, Loader2, Tag } from "lucide-react";
import { ScanDrugDialog } from "@/components/scan-drug-dialog";
import { useDrugContext, type Drug } from "@/context/drug-context";
import { formatDistanceToNow } from 'date-fns-jalali';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { DrugDetailDialog } from "@/components/drug-detail-dialog";


export default function PharmacyPage() {
    const { drugs, removeDrug, loading } = useDrugContext();
    const { toast } = useToast();
    const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);

    const handleRemove = async (id: string) => {
        try {
            await removeDrug(id);
            toast({
                title: "دارو حذف شد",
                description: "داروی مورد نظر با موفقیت از داروخانه شما حذف شد.",
            })
        } catch (error) {
            toast({
                variant: "destructive",
                title: "خطا",
                description: "حذف دارو ناموفق بود.",
            })
        }
    }

  return (
    <>
      <Card className="bg-secondary">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle>داروخانه من</CardTitle>
            <CardDescription>
              تمام داروهای ذخیره شده شما در یک مکان.
            </CardDescription>
          </div>
          <ScanDrugDialog>
            <Button className="w-full md:w-auto">
              <PlusCircle className="ml-2 h-4 w-4" /> افزودن دارو
            </Button>
          </ScanDrugDialog>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border neumorphic-light dark:neumorphic-dark">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>نام دارو</TableHead>
                  <TableHead className="hidden md:table-cell">دسته بندی</TableHead>
                  <TableHead className="hidden lg:table-cell">تگ ها</TableHead>
                  <TableHead className="hidden md:table-cell">زمان افزودن</TableHead>
                  <TableHead className="text-left">اقدامات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                          <div className="flex justify-center items-center">
                              <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                              <span>در حال بارگذاری داروها...</span>
                          </div>
                      </TableCell>
                  </TableRow>
                ) : drugs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      دارویی یافت نشد. برای شروع یک دارو اضافه کنید.
                    </TableCell>
                  </TableRow>
                ) : (
                  drugs.map((drug) => (
                      <TableRow key={drug.id}>
                          <TableCell className="font-medium">
                              <button onClick={() => setSelectedDrug(drug)} className="text-right hover:underline hover:text-primary transition-colors">
                                  <p className="font-bold">{drug.brandName || drug.activeIngredients.map(i => i.name).join(', ')}</p>
                              </button>
                              <div className="text-xs text-muted-foreground md:hidden mt-1 space-y-1">
                                  <p><Badge variant="outline" className="ml-1">{drug.category}</Badge></p>
                                  <p>{drug.addedAt ? formatDistanceToNow(new Date(drug.addedAt)) : '-'} پیش</p>
                              </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                              <Badge variant="outline">{drug.category}</Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                  {drug.tags?.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                              </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{drug.addedAt ? formatDistanceToNow(new Date(drug.addedAt)) : '-'} پیش</TableCell>
                          <TableCell className="text-left">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">باز کردن منو</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" dir="rtl">
                                  <DropdownMenuItem onClick={() => handleRemove(drug.id)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
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
      {selectedDrug && (
        <DrugDetailDialog 
            drug={selectedDrug}
            open={!!selectedDrug}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    setSelectedDrug(null);
                }
            }}
        />
      )}
    </>
  );
}
