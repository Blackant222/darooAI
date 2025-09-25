'use server';
/**
 * @fileOverview Scans a medicine label, identifies the drug, categorizes it, and extracts relevant tags.
 *
 * - scanAndCategorizeDrug - A function that handles the drug scanning and categorization process.
 * - ScanAndCategorizeDrugInput - The input type for the scanAndCategorizeDrug function.
 * - ScanAndCategorizeDrugOutput - The return type for the scanAndCategorizeDrug function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScanAndCategorizeDrugInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a medicine label, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ScanAndCategorizeDrugInput = z.infer<typeof ScanAndCategorizeDrugInputSchema>;

const ScanAndCategorizeDrugOutputSchema = z.object({
  drugName: z.string().describe('The name of the identified drug.'),
  category: z.string().describe('The category of the drug.'),
  tags: z.array(z.string()).describe('Relevant tags for the drug.'),
});
export type ScanAndCategorizeDrugOutput = z.infer<typeof ScanAndCategorizeDrugOutputSchema>;

export async function scanAndCategorizeDrug(input: ScanAndCategorizeDrugInput): Promise<ScanAndCategorizeDrugOutput> {
  return scanAndCategorizeDrugFlow(input);
}

const categorizeDrug = ai.defineTool(
  {
    name: 'categorizeDrug',
    description: 'Categorizes a drug and extracts relevant tags.',
    inputSchema: z.object({
      drugName: z.string().describe('The name of the drug to categorize.'),
    }),
    outputSchema: z.object({
      category: z.string().describe('The category of the drug.'),
      tags: z.array(z.string()).describe('Relevant tags for the drug.'),
    }),
  },
  async (input) => {
    const {text} = await ai.generate({
      prompt: `You are an expert at categorizing drugs and extracting relevant tags.

      Categorize the following drug and extract 5 relevant tags.

      Drug Name: ${input.drugName}
      Category: 
      Tags: `,
    });

    const lines = text.split('\n');
    const categoryLine = lines.find(line => line.startsWith('Category:'));
    const tagsLine = lines.find(line => line.startsWith('Tags:'));

    const category = categoryLine ? categoryLine.substring('Category:'.length).trim() : 'Unknown';
    const tagsString = tagsLine ? tagsLine.substring('Tags:'.length).trim() : '';
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    return {
      category: category,
      tags: tags,
    };
  }
);

const prompt = ai.definePrompt({
  name: 'scanAndCategorizeDrugPrompt',
  input: {schema: ScanAndCategorizeDrugInputSchema},
  output: {schema: ScanAndCategorizeDrugOutputSchema},
  tools: [categorizeDrug],
  prompt: `You are an AI assistant that identifies drugs from medicine label photos, categorizes them, and extracts relevant tags.

  1.  Extract the drug name from the medicine label photo.
  2.  Use the categorizeDrug tool to categorize the drug and extract relevant tags.

  Photo: {{media url=photoDataUri}}
  `,
});

const scanAndCategorizeDrugFlow = ai.defineFlow(
  {
    name: 'scanAndCategorizeDrugFlow',
    inputSchema: ScanAndCategorizeDrugInputSchema,
    outputSchema: ScanAndCategorizeDrugOutputSchema,
  },
  async input => {
    const ocrResult = await ai.generate({
      prompt: `Extract the drug name from this medicine label.  Return just the name of the drug, nothing else.
      Photo: {{media url=${input.photoDataUri}}}`, 
    });

    const drugName = ocrResult.text;

    if (!drugName) {
      throw new Error('Could not extract drug name from the image.');
    }
    
    const toolResult = await categorizeDrug({ drugName });

    return {
        drugName: drugName,
        category: toolResult.category,
        tags: toolResult.tags,
    };
  }
);
