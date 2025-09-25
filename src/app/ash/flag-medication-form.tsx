'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { flagMedicationInconsistencies, type FlagMedicationInconsistenciesOutput } from '@/ai/flows/flag-medication-inconsistencies';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  drugName: z.string().min(1, "نام دارو الزامی است."),
  drugCategory: z.string().min(1, "دسته بندی دارو الزامی است."),
  drugTags: z.string().min(1, "لطفا تگ ها را با کاما جدا کنید."),
  description: z.string().min(1, "توضیحات الزامی است."),
});

export function FlagMedicationForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<FlagMedicationInconsistenciesOutput | null>(null);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            drugName: "آسپرین",
            drugCategory: "تسکین دهنده درد",
            drugTags: "NSAID, ضد التهاب, کاهش دهنده تب, رقیق کننده خون",
            description: "یک داروی رایج برای تسکین درد، تب و التهاب. همچنین به عنوان یک عامل ضد پلاکت استفاده می شود."
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setResult(null);
        try {
            const aiResult = await flagMedicationInconsistencies({
                ...values,
                drugTags: values.drugTags.split(',').map(tag => tag.trim()),
            });
            setResult(aiResult);
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'خطا',
                description: 'بررسی عدم انطباق ناموفق بود.'
            })
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-right">
                    <FormField control={form.control} name="drugName" render={({ field }) => (
                        <FormItem>
                            <FormLabel>نام دارو</FormLabel>
                            <FormControl>
                                <Input placeholder="مثال: آتورواستاتین" {...field} className="neumorphic-input" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="drugCategory" render={({ field }) => (
                        <FormItem>
                            <FormLabel>دسته بندی دارو</FormLabel>
                            <FormControl>
                                <Input placeholder="مثال: استاتین" {...field} className="neumorphic-input" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="drugTags" render={({ field }) => (
                        <FormItem>
                            <FormLabel>تگ های دارو (جدا شده با کاما)</FormLabel>
                            <FormControl>
                                <Input placeholder="مثال: کلسترول, کاهش دهنده چربی" {...field} className="neumorphic-input" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem>
                            <FormLabel>توضیحات</FormLabel>
                            <FormControl>
                                <Textarea placeholder="کاربرد و خواص دارو را شرح دهید." {...field} className="neumorphic-input" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <Button type="submit" disabled={isLoading} className="w-full neumorphic-button">
                        {isLoading ? <><Loader2 className="ml-2 animate-spin" />درحال بررسی...</> : 'بررسی عدم انطباق'}
                    </Button>
                </form>
            </Form>

            {result && (
                 <Alert dir='rtl' className={`neumorphic-card ${result.isConsistent ? 'border-green-500/50' : 'border-destructive/50'}`}>
                    {result.isConsistent ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-destructive" />}
                    <AlertTitle>{result.isConsistent ? 'مطابق' : 'عدم انطباق شناسایی شد'}</AlertTitle>
                    <AlertDescription>
                        {result.isConsistent ? 'اطلاعات دارو به نظر مطابق می آید.' : result.flagReason}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
