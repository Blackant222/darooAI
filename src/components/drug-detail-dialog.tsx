'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { type Drug } from '@/context/drug-context';
import { getDrugSummary, type GetDrugSummaryOutput } from '@/ai/flows/get-drug-summary';
import { Badge } from './ui/badge';
import { Loader2, Pill, List, Tag, FileText, AlertTriangle, Sparkles } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

interface DrugDetailDialogProps {
  drug: Drug;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DrugDetailDialog({ drug, open, onOpenChange }: DrugDetailDialogProps) {
  const [aiData, setAiData] = useState<GetDrugSummaryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && drug) {
      const fetchAiData = async () => {
        setIsLoading(true);
        setError(null);
        setAiData(null);
        try {
          const result = await getDrugSummary({ drugName: drug.brandName || drug.activeIngredients[0].name });
          setAiData(result);
        } catch (e) {
          console.error("Failed to get AI summary", e);
          setError("خلاصه هوش مصنوعی در حال حاضر در دسترس نیست.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchAiData();
    }
  }, [open, drug]);
  
  const drugDisplayName = drug.brandName || drug.activeIngredients.map(ing => ing.name).join(', ');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="sm:max-w-lg">
        <DialogHeader className="text-right space-y-2">
          <div className="flex items-center gap-3">
              <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center'>
                <Pill className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="font-headline text-2xl">{drugDisplayName}</DialogTitle>
                <DialogDescription>{drug.category}</DialogDescription>
              </div>
          </div>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
            <div className="flex flex-col gap-4">
                <InfoItem icon={List} label="ماده(های) موثره">
                    <p className="font-semibold text-foreground">
                        {drug.activeIngredients.map(ing => `${ing.name} (${ing.dosage || 'N/A'})`).join(', ')}
                    </p>
                </InfoItem>

                <InfoItem icon={Tag} label="تگ ها">
                    <div className="flex flex-wrap gap-2">
                        {drug.tags?.map((tag, i) => <Badge key={i} variant="secondary">{tag}</Badge>)}
                    </div>
                </InfoItem>
            </div>

            <div className="border-t pt-4 space-y-4">
                <h3 className="font-bold flex items-center gap-2 text-primary">
                    <Sparkles className="h-5 w-5" />
                    تحلیل هوش مصنوعی
                </h3>
                {isLoading && <AiInfoSkeleton />}
                {error && <p className="text-destructive text-sm">{error}</p>}
                {aiData && (
                    <>
                        <InfoItem icon={FileText} label="خلاصه کاربرد">
                           <p className="text-foreground leading-relaxed">{aiData.summary}</p>
                        </InfoItem>
                        <InfoItem icon={AlertTriangle} label="عوارض جانبی شایع">
                            <p className="text-foreground whitespace-pre-line leading-relaxed">{aiData.sideEffects}</p>
                        </InfoItem>
                    </>
                )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoItem({ icon: Icon, label, children }: { icon: React.ElementType, label: string, children: React.ReactNode }) {
    return (
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
                <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
                <p className="text-sm text-muted-foreground">{label}</p>
                {children}
            </div>
        </div>
    )
}

function AiInfoSkeleton() {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        </div>
    )
}
