'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, FileWarning, Lightbulb, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';
import { getPersonalizedHealthInsights, type PersonalizedHealthInsightsOutput } from '@/ai/flows/get-personalized-health-insights';

export default function InsightsPage() {
  const [healthConditions, setHealthConditions] = useState("فشار خون بالا, دیابت نوع ۲");
  const [medications, setMedications] = useState("لیزینوپریل, متفورمین, سیمواستاتین, آملودیپین");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<PersonalizedHealthInsightsOutput | null>(null);
  const { toast } = useToast();

  const handleGetInsights = async () => {
    setIsLoading(true);
    setResults(null);
    try {
      const insights = await getPersonalizedHealthInsights({ healthConditions, medications });
      setResults(insights);
    } catch (error) {
      console.error("Failed to get health insights:", error);
      toast({
        variant: "destructive",
        title: "خطا",
        description: "دریافت اطلاعات از هوش مصنوعی با مشکل مواجه شد. لطفاً بعداً دوباره امتحان کنید.",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle>اطلاعات سلامتی مبتنی بر هوش مصنوعی</CardTitle>
          <CardDescription>
            توصیه‌های دارویی شخصی‌سازی‌شده و هشدارهای تداخل دارویی را بر اساس پروفایل سلامتی خود دریافت کنید.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="health-conditions">شرایط سلامتی شما</Label>
            <Textarea
              id="health-conditions"
              value={healthConditions}
              onChange={(e) => setHealthConditions(e.target.value)}
              placeholder="مثال: فشار خون بالا, آسم"
              className="neumorphic-input"
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="medications">داروهای فعلی شما</Label>
            <Textarea
              id="medications"
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              placeholder="مثال: لیزینوپریل, آلبوترول"
              className="neumorphic-input"
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGetInsights} disabled={isLoading} className="neumorphic-button">
            {isLoading ? (
              <>
                <Loader2 className="ml-2 animate-spin" /> در حال دریافت اطلاعات...
              </>
            ) : (
               <>
                <Lightbulb className="ml-2" /> دریافت اطلاعات
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {isLoading && (
         <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
         </div>
      )}

      {results && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold font-headline">نتایج شما</h3>
          {results.interactionAlerts && (
            <Alert variant="destructive" className="neumorphic-card">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>تداخل دارویی بالقوه</AlertTitle>
              <AlertDescription>
                {results.interactionAlerts}
              </AlertDescription>
            </Alert>
          )}
          {results.recommendations && (
            <Alert className="neumorphic-card">
              <FileWarning className="h-4 w-4" />
              <AlertTitle>توصیه دارویی</AlertTitle>
              <AlertDescription>
                {results.recommendations}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}
