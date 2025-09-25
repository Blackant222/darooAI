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

const identifyAndCategorizeDrug = ai.defineTool(
    {
      name: 'identifyAndCategorizeDrug',
      description: 'Identifies a drug from text, categorizes it, and extracts 5 relevant tags. If the name is a brand name or in a foreign language, it should be converted to the standard drug name.',
      inputSchema: z.object({
        extractedText: z.string().describe('The text extracted from the medicine label which may contain the drug name.'),
      }),
      outputSchema: z.object({
        drugName: z.string().describe('The identified official drug name.'),
        category: z.string().describe('The category of the drug.'),
        tags: z.array(z.string()).describe('An array of 5 relevant tags for the drug.'),
      }),
    },
    async ({ extractedText }) => {
        const { output } = await ai.generate({
            prompt: `You are a drug identification and categorization expert. Based on the following text extracted from a medicine package, identify the official drug name, its category, and 5 relevant tags.

            Extracted Text: "${extractedText}"
            
            If the text is a brand name or in a foreign language, find the generic/official name.
            
            Provide the response as a JSON object with the keys "drugName", "category", and "tags".`,
            output: {
                schema: z.object({
                    drugName: z.string(),
                    category: z.string(),
                    tags: z.array(z.string()),
                })
            }
        });
        
        return output!;
    },
);

const scanAndCategorizeDrugFlow = ai.defineFlow(
  {
    name: 'scanAndCategorizeDrugFlow',
    inputSchema: ScanAndCategorizeDrugInputSchema,
    outputSchema: ScanAndCategorizeDrugOutputSchema,
  },
  async (input) => {
    const { text: initialExtraction } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: `Analyze the provided image of a medicine label and extract the most prominent text that likely represents the drug's name. Respond with only the extracted text.
      Image: {{media url=photoDataUri}}`,
    });
    
    if (!initialExtraction) {
        throw new Error('Could not extract any text from the image.');
    }

    const finalResult = await identifyAndCategorizeDrug({ extractedText: initialExtraction });

    return finalResult;
  }
);
