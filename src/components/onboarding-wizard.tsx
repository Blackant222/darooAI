'use client';

import { useEffect, useState } from 'react';
import { useOnboarding } from '@/context/onboarding-context';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowLeft, ArrowRight, Sparkles, X } from 'lucide-react';
import { useDrugContext } from '@/context/drug-context';
import { cn } from '@/lib/utils';

const STEPS = [
  {
    id: 1,
    title: 'به Avicenna خوش آمدید!',
    description: 'دستیار دارویی هوشمند شما. بیایید نگاهی سریع به امکانات بیندازیم.',
    targetId: null,
  },
  {
    id: 2,
    title: 'داروخانه شما',
    description: 'اینجا جایی است که تمام داروهای شما نگهداری می‌شود. بیایید اولین دارو را اضافه کنیم.',
    targetId: 'add-drug-button',
    popoverAlign: 'end',
    popoverSide: 'bottom',
  },
  {
    id: 3,
    title: 'فقط یک دارو!',
    description: 'حالا که اولین داروی خود را اضافه کردید، می‌توانید بقیه امکانات را بررسی کنید.',
    targetId: null,
  },
  {
    id: 4,
    title: 'شما آماده‌اید!',
    description: 'از امکانات Avicenna لذت ببرید. برای راهنمایی بیشتر، همیشه می‌توانید به این تور بازگردید.',
    targetId: null,
  },
];

export default function OnboardingWizard() {
  const { isFirstTime, completeOnboarding } = useOnboarding();
  const { drugs } = useDrugContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    if (isFirstTime) {
      setIsOpen(true);
      setCurrentStep(0);
    }
  }, [isFirstTime]);

  useEffect(() => {
    // If user adds a drug, move to the next step
    if (currentStep === 1 && drugs.length > 0) {
      handleNext();
    }
  }, [drugs, currentStep]);
  
  const handleNext = () => {
    setPopoverOpen(false);
    const nextStepIndex = currentStep + 1;
    if (nextStepIndex < STEPS.length) {
      setCurrentStep(nextStepIndex);
      const nextStepInfo = STEPS[nextStepIndex];
      if (nextStepInfo.targetId) {
        // Give time for dialog to close before opening popover
        setTimeout(() => setPopoverOpen(true), 300);
      } else {
        setIsOpen(true);
      }
    } else {
      // End of tour
      handleSkip();
    }
  };

  const handlePrev = () => {
    setPopoverOpen(false);
    const prevStepIndex = currentStep - 1;
    if (prevStepIndex >= 0) {
      setCurrentStep(prevStepIndex);
      const prevStepInfo = STEPS[prevStepIndex];
       if (prevStepInfo.targetId) {
         setTimeout(() => setPopoverOpen(true), 300);
      } else {
        setIsOpen(true);
      }
    }
  };

  const handleSkip = async () => {
    setIsOpen(false);
    setPopoverOpen(false);
    await completeOnboarding();
  };

  const step = STEPS[currentStep];

  if (!isFirstTime || !step) return null;

  if (step.targetId) {
    const targetElement = document.getElementById(step.targetId);

    if (!targetElement) return null; // Wait for element to be in DOM

    return (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
              style={{
                clipPath: `path('${getHighlightPath(targetElement)}')`,
              }}
            />
          </PopoverTrigger>
          <PopoverContent
            side={step.popoverSide as any || 'bottom'}
            align={step.popoverAlign as any || 'center'}
            sideOffset={10}
            className="z-[101] w-80 neumorphic-light dark:neumorphic-dark border-none"
          >
            <div className="space-y-4">
              <h3 className="font-bold font-headline text-lg">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
              <div className="flex justify-between items-center">
                 <Button variant="ghost" size="sm" onClick={handleSkip}>رد شدن</Button>
                 <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handlePrev} disabled={currentStep === 0}>
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                    <Button size="sm" onClick={handleNext}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                 </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
    );
  }

  // Render as a dialog if no targetId
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent dir="rtl" className="sm:max-w-md" hideCloseButton>
        <DialogHeader className="items-center text-center space-y-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="font-headline text-2xl">{step.title}</DialogTitle>
          <DialogDescription>{step.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-4 flex-row justify-between">
          <Button variant="ghost" onClick={handleSkip}>
            رد شدن
          </Button>
          <Button onClick={handleNext}>
            {currentStep === STEPS.length - 1 ? 'پایان' : 'بعدی'}
            <ArrowLeft className="mr-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


function getHighlightPath(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    const radius = 12; // Matches button border-radius
    
    // Create a path for the entire viewport
    const viewportPath = `M0,0 H${window.innerWidth} V${window.innerHeight} H0 Z`;
    
    // Create a path for the cutout (the highlighted element)
    const cutoutPath = `M${rect.left + radius},${rect.top} H${rect.right - radius} A${radius},${radius} 0 0 1 ${rect.right},${rect.top + radius} V${rect.bottom - radius} A${radius},${radius} 0 0 1 ${rect.right - radius},${rect.bottom} H${rect.left + radius} A${radius},${radius} 0 0 1 ${rect.left},${rect.bottom - radius} V${rect.top + radius} A${radius},${radius} 0 0 1 ${rect.left + radius},${rect.top} Z`;

    return `${viewportPath} ${cutoutPath}`;
}
