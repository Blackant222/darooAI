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
import { Loader2, UploadCloud, X, CheckCircle, AlertTriangle, PlusCircle, ScanLine } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { scanAndCategorizeDrug, type ScanAndCategorizeDrugOutput } from '@/ai/flows/scan-and-categorize-drug';
import { Badge } from './ui/badge';

export function ScanDrugDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScanAndCategorizeDrugOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 4 * 1024 * 1024) { // 4MB limit
        setError('File size must be less than 4MB.');
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  };

  const resetState = () => {
    setFile(null);
    setPreview(null);
    setIsLoading(false);
    setResult(null);
    setError(null);
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

    setIsLoading(true);
    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const dataUri = reader.result as string;
        const response = await scanAndCategorizeDrug({ photoDataUri: dataUri });
        setResult(response);
      } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
        setError(`Scan failed: ${errorMessage}`);
        toast({
          variant: 'destructive',
          title: 'Scan Failed',
          description: 'Could not analyze the medication label. Please try a clearer image.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = (err) => {
      console.error("FileReader error:", err);
      setError('Failed to read the file.');
      setIsLoading(false);
    };
  };
  
  const handleAddToPharmacy = () => {
    // In a real app, this would save to a database.
    // For now, we'll just show a success toast.
    toast({
      title: 'Medication Added',
      description: `${result?.drugName} has been added to your virtual pharmacy.`,
    });
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md neumorphic-card">
        <DialogHeader>
          <DialogTitle className="font-headline text-center">Scan New Medication</DialogTitle>
          <DialogDescription className="text-center">Upload a photo of the medication label to add it to your pharmacy.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {preview ? (
            <div className="relative group w-full aspect-video rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/50 flex justify-center items-center">
              <Image src={preview} alt="Medication preview" fill style={{ objectFit: 'contain' }} />
              <button
                onClick={() => { setFile(null); setPreview(null); setResult(null); setError(null); }}
                className="absolute top-2 right-2 bg-card/80 backdrop-blur-sm rounded-full p-1 text-card-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="relative w-full aspect-video rounded-lg border-2 border-dashed border-muted-foreground/50 flex flex-col justify-center items-center text-center p-4 hover:border-primary transition-colors">
              <UploadCloud className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
          )}
          
          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm p-3 bg-destructive/10 rounded-lg">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="space-y-4 p-4 bg-muted/20 dark:bg-muted/50 rounded-lg border">
              <h4 className="font-semibold text-lg flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary"/>Scan Successful</h4>
              <div className="space-y-3">
                <p><strong>Drug Name:</strong> {result.drugName}</p>
                <p><strong>Category:</strong> {result.category}</p>
                <div>
                  <strong>Tags:</strong>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {result.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {result ? (
            <Button onClick={handleAddToPharmacy} className="w-full neumorphic-button bg-primary text-primary-foreground hover:bg-primary/90">
              <PlusCircle className="mr-2"/> Add to Pharmacy
            </Button>
          ) : (
            <Button onClick={handleScan} disabled={!file || isLoading} className="w-full neumorphic-button">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 animate-spin" /> Scanning...
                </>
              ) : (
                <>
                  <ScanLine className="mr-2"/> Scan Label
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
