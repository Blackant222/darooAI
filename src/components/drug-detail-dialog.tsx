'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { type Drug, useDrugContext } from '@/context/drug-context';
import { Badge } from './ui/badge';
import { Pill, List, Tag, FileText, AlertTriangle, Sparkles, Beaker, GitCompareArrows, Clock, GlassWater, Loader2 } from 'lucide-react';
import { Separator } from './ui/separator';
import { getDrugInteraction, type GetDrugInteractionOutput } from '@/ai/flows/get-drug-interaction';

interface DrugDetailDialogProps {
  drug: Drug;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DrugDetailDialog({ drug, open, onOpenChange }: DrugDetailDialogProps) {
  
  const { drugs } = useDrugContext();
  const [interactionResult, setInteractionResult] = useState<GetDrugInteractionOutput | null>(null);
  const [isLoadingInteraction, setIsLoadingInteraction] = useState(false);

  useEffect(() => {
    if (open && drug) {
      const fetchInteractions = async () => {
        setIsLoadingInteraction(true);
        setInteractionResult(null);
        try {
          const otherDrugNames = drugs
            .filter(d => d.id !== drug.id)
            .map(d => d.brandName || d.activeIngredients.map(i => i.name).join(', '));
          
          const result = await getDrugInteraction({
            drugName: drug.brandName || drug.activeIngredients.map(i => i.name).join(', '),
            userDrugs: otherDrugNames,
          });
          setInteractionResult(result);
        } catch (error) {
          console.error("Failed to fetch drug interactions:", error);
          // Optionally set an error state to show in the UI
        } finally {
          setIsLoadingInteraction(false);
        }
      };
      
      fetchInteractions();
    }
  }, [open, drug, drugs]);


  const drugDisplayName = drug.brandName || drug.activeIngredients.map(ing => ing.name).join(', ');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="sm:max-w-lg">
        <DialogHeader className="text-right space-y-2">
          <div className="flex items-center gap-3">
              <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0'>
                <Pill className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="font-headline text-2xl">{drugDisplayName}</DialogTitle>
                <DialogDescription>{drug.category}</DialogDescription>
              </div>
          </div>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
            <div className="space-y-4">
                <InfoItem icon={Beaker} label="ماده(های) موثره">
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

            <Separator />

            <div className="space-y-4">
                <h3 className="font-bold flex items-center gap-2 text-primary">
                    <Sparkles className="h-5 w-5" />
                    تحلیل هوش مصنوعی
                </h3>
                 {isLoadingInteraction ? (
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>در حال بررسی تداخلات دارویی...</span>
                    </div>
                 ) : interactionResult ? (
                    <>
                        <InfoItem icon={GitCompareArrows} label="تداخل با داروهای شما">
                            <p className="text-foreground leading-relaxed">{interactionResult.interactionsWithUserDrugs}</p>
                        </InfoItem>
                         <InfoItem icon={GlassWater} label="تداخلات عمومی">
                            <p className="text-foreground leading-relaxed">{interactionResult.generalInteractions}</p>
                        </InfoItem>
                         <InfoItem icon={Clock} label="نحوه مصرف">
                            <p className="text-foreground leading-relaxed">{interactionResult.usageAdvice}</p>
                        </InfoItem>
                    </>
                 ) : (
                    <div className="flex items-center justify-center gap-2 text-destructive text-sm">
                        <AlertTriangle className="h-4 w-4"/>
                        <span>اطلاعات تداخل دارویی بارگذاری نشد.</span>
                    </div>
                 )}
            </div>

            <Separator />
            
            <div className="space-y-4">
                <InfoItem icon={FileText} label="خلاصه کاربرد">
                    <p className="text-foreground leading-relaxed">{drug.summary || 'خلاصه‌ای یافت نشد.'}</p>
                </InfoItem>
                <InfoItem icon={AlertTriangle} label="عوارض جانبی شایع">
                    <p className="text-foreground whitespace-pre-line leading-relaxed">{drug.sideEffects || 'عوارض جانبی‌ای یافت نشد.'}</p>
                </InfoItem>
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
