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
  drugName: z.string().min(1, "Drug name is required."),
  drugCategory: z.string().min(1, "Drug category is required."),
  drugTags: z.string().min(1, "Please provide comma-separated tags."),
  description: z.string().min(1, "Description is required."),
});

export function FlagMedicationForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<FlagMedicationInconsistenciesOutput | null>(null);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            drugName: "Aspirin",
            drugCategory: "Pain Reliever",
            drugTags: "NSAID, anti-inflammatory, fever reducer, blood thinner",
            description: "A common drug used for pain relief, fever, and inflammation. It is also used as an antiplatelet agent."
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
                title: 'Error',
                description: 'Failed to check for inconsistencies.'
            })
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="drugName" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Drug Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Atorvastatin" {...field} className="neumorphic-input" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="drugCategory" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Drug Category</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Statin" {...field} className="neumorphic-input" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="drugTags" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Drug Tags (comma-separated)</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., cholesterol, lipid-lowering" {...field} className="neumorphic-input" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Describe the drug's use and properties." {...field} className="neumorphic-input" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <Button type="submit" disabled={isLoading} className="w-full neumorphic-button">
                        {isLoading ? <><Loader2 className="mr-2 animate-spin" />Checking...</> : 'Check for Inconsistencies'}
                    </Button>
                </form>
            </Form>

            {result && (
                 <Alert className={`neumorphic-card ${result.isConsistent ? 'border-green-500/50' : 'border-destructive/50'}`}>
                    {result.isConsistent ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-destructive" />}
                    <AlertTitle>{result.isConsistent ? 'Consistent' : 'Inconsistency Flagged'}</AlertTitle>
                    <AlertDescription>
                        {result.isConsistent ? 'The medication information appears to be consistent.' : result.flagReason}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
