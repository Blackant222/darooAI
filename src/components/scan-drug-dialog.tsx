'use client';

import { useState, type ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, UploadCloud, X, CheckCircle, AlertTriangle, PlusCircle, ScanLine, ArrowRight, Pill, Tag, List, Beaker } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { scanAndCategorizeDrug, type ScanAndCategorizeDrugOutput } from '@/ai/flows/scan-and-categorize-drug';
import { Badge } from './ui/badge';
import { useDrugContext } from '@/context/drug-context';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';

export function ScanDrugDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [result, setResult] = useState<ScanAndCategorizeDrugOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [isTaking, setIsTaking] = useState<"yes" | "no" | undefined>(undefined);
  const [frequency, setFrequency] = useState('');
  const [startDate, setStartDate] = useState('');
  
  const { toast } = useToast();
  const { addDrug } = useDrugContext();


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 4 * 1024 * 1024) { // 4MB limit
        setError('اندازه فایل باید کمتر از ۴ مگابایت باشد.');
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
      setStep(1);
    }
  };

  const resetState = () => {
    setFile(null);
    setPreview(null);
    setIsAiLoading(false);
    setResult(null);
    setError(null);
    setStep(1);
    setIsTaking(undefined);
    setFrequency('');
    setStartDate('');
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Delay reset to allow for closing animation
      setTimeout(resetState, 300);
    }
  };

  const handleScan = async () => {
    if (!file) return;

    setIsAiLoading(true);
    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const dataUri = reader.result as string;
        const response = await scanAndCategorizeDrug({ photoDataUri: dataUri });
        setResult(response);
        setStep(2); // Move to the next step on successful scan
      } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'یک خطای غیرمنتظره رخ داد.';
        setError(`اسکن ناموفق بود: ${errorMessage}`);
        toast({
          variant: 'destructive',
          title: 'اسکن ناموفق بود',
          description: 'امکان تحلیل برچسب دارو وجود نداشت. لطفاً از تصویر واضح‌تری استفاده کنید.',
        });
      } finally {
        setIsAiLoading(false);
      }
    };
    reader.onerror = (err) => {
      console.error("FileReader error:", err);
      setError('خواندن فایل ناموفق بود.');
      setIsAiLoading(false);
    };
  };
  
  const handleAddToPharmacy = async () => {
    if (!result) return;
    
    let newDrug = {
      brandName: result.brandName,
      activeIngredients: result.activeIngredients,
      category: result.category,
      tags: result.tags,
      isTaking: isTaking === 'yes',
      ...(isTaking === 'yes' && { frequency, startDate }),
    };

    try {
        await addDrug(newDrug);
        toast({
          title: 'دارو اضافه شد',
          description: `${result.brandName || result.activeIngredients.map(i => i.name).join(', ')} به داروخانه شما اضافه شد.`,
        });
        handleOpenChange(false);
    } catch (error) {
        console.error("Failed to add drug:", error)
        toast({
            variant: "destructive",
            title: "خطا",
            description: "افزودن دارو به داروخانه ناموفق بود."
        })
    }
  };

  const renderStepOne = () => (
    <>
      <DialogHeader>
        <DialogTitle className="font-headline text-center">اسکن داروی جدید</DialogTitle>
        <DialogDescription className="text-center">برای افزودن به داروخانه، عکس برچسب دارو را بارگذاری کنید.</DialogDescription>
      </DialogHeader>
       <div className="space-y-4 py-4">
        {preview ? (
          <div className="relative group w-full aspect-video rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/50 flex justify-center items-center">
            <Image src={preview} alt="پیش‌نمایش دارو" fill style={{ objectFit: 'contain' }} />
            <button
              onClick={() => { setFile(null); setPreview(null); setResult(null); setError(null); }}
              className="absolute top-2 left-2 bg-card/80 backdrop-blur-sm rounded-full p-1 text-card-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="relative w-full aspect-video rounded-lg border-2 border-dashed border-muted-foreground/50 flex flex-col justify-center items-center text-center p-4 hover:border-primary transition-colors">
            <UploadCloud className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">برای بارگذاری، فایل را بکشید و رها کنید یا کلیک کنید</p>
            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          </div>
        )}
        
        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm p-3 bg-destructive/10 rounded-lg">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
      <DialogFooter>
        <Button onClick={handleScan} disabled={!file || isAiLoading} className="w-full neumorphic-button">
          {isAiLoading ? (
            <>
              <Loader2 className="ml-2 animate-spin" /> در حال اسکن...
            </>
          ) : (
            <>
              <ScanLine className="ml-2"/> اسکن برچسب
            </>
          )}
        </Button>
      </DialogFooter>
    </>
  );

  const renderStepTwo = () => (
    <>
      <DialogHeader>
        <DialogTitle className="font-headline text-center">اطلاعات مصرف</DialogTitle>
        <DialogDescription className="text-center">جزئیات مصرف این دارو را مشخص کنید.</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4 text-right">
        {result && (
          <Card className='neumorphic-card-inset p-4'>
            <CardContent className='p-0 space-y-4'>
                 <div className="flex items-center gap-3">
                    <Pill className='text-primary' />
                    <div>
                        <p className='text-sm text-muted-foreground'>نام برند</p>
                        <p className="font-bold text-lg">{result.brandName || '-'}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Beaker className='text-primary mt-1' />
                    <div>
                        <p className='text-sm text-muted-foreground'>ماده(های) موثره</p>
                        <ul className='list-none p-0 m-0'>
                            {result.activeIngredients.map((ing, i) => (
                                <li key={i} className='font-semibold'>{ing.name} <span className='text-muted-foreground font-normal'>({ing.dosage || 'N/A'})</span></li>
                            ))}
                        </ul>
                    </div>
                </div>
                 <div className="flex items-center gap-3">
                    <List className='text-primary' />
                    <div>
                        <p className='text-sm text-muted-foreground'>دسته بندی</p>
                        <p className='font-semibold'>{result.category}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <Tag className='text-primary mt-1' />
                    <div>
                        <p className='text-sm text-muted-foreground'>تگ ها</p>
                        <div className="flex flex-wrap gap-2 pt-1">
                            {result.tags.map((tag, i) => <Badge key={i} variant='secondary' className='neumorphic-badge'>{tag}</Badge>)}
                        </div>
                    </div>
                </div>
            </CardContent>
          </Card>
        )}
        <div className="space-y-3 pt-2">
          <Label>آیا در حال حاضر این دارو را مصرف می‌کنید؟</Label>
          <RadioGroup dir="ltr" onValueChange={(val: "yes" | "no") => setIsTaking(val)} value={isTaking} className="flex justify-end gap-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <RadioGroupItem value="no" id="r-no" />
              <Label htmlFor="r-no">خیر</Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <RadioGroupItem value="yes" id="r-yes" />
              <Label htmlFor="r-yes">بله</Label>
            </div>
          </RadioGroup>
        </div>

        {isTaking === 'yes' && (
          <div className="space-y-4 pt-4 border-t">
              <div className="grid gap-2">
                <Label htmlFor="frequency">تکرار مصرف</Label>
                <Select dir='rtl' onValueChange={setFrequency} value={frequency}>
                    <SelectTrigger id="frequency" className="neumorphic-input">
                        <SelectValue placeholder="انتخاب کنید..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Once a day">یک بار در روز</SelectItem>
                        <SelectItem value="Twice a day">دو بار در روز</SelectItem>
                        <SelectItem value="Weekly">هفتگی</SelectItem>
                        <SelectItem value="As needed">در صورت نیاز</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="start-date">تاریخ شروع</Label>
                <Input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="neumorphic-input" />
              </div>
          </div>
        )}
      </div>
       <DialogFooter className='flex-row justify-between'>
          <Button onClick={() => setStep(1)} variant='outline' className="neumorphic-button">
            <ArrowRight className="ml-2"/> بازگشت
          </Button>
          <Button onClick={handleAddToPharmacy} disabled={!isTaking} className="neumorphic-button bg-primary text-primary-foreground hover:bg-primary/90">
            <PlusCircle className="ml-2"/> افزودن به داروخانه
          </Button>
      </DialogFooter>
    </>
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent dir="rtl" className="sm:max-w-md neumorphic-card">
        {step === 1 && renderStepOne()}
        {step === 2 && renderStepTwo()}
      </DialogContent>
    </Dialog>
  );
}
