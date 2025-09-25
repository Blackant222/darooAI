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
      description: 'Categorizes a drug and extracts 5 relevant tags. Should be called after the drug name is extracted from an image.',
      inputSchema: z.object({
        drugName: z.string().describe('The name of the drug to categorize.'),
      }),
      outputSchema: z.object({
        category: z.string().describe('The category of the drug.'),
        tags: z.array(z.string()).describe('An array of 5 relevant tags for the drug.'),
      }),
    },
    async ({ drugName }) => {
        const { text } = await ai.generate({
            prompt: `You are a drug categorization expert. For the drug "${drugName}", provide its category and 5 relevant tags. Format your response with "Category:" on one line and "Tags:" on the next.`,
        });

        const lines = text.split('\n');
        const categoryLine = lines.find(line => line.startsWith('Category:'));
        const tagsLine = lines.find(line => line.startsWith('Tags:'));
        
        const category = categoryLine ? categoryLine.substring('Category:'.length).trim() : 'Unknown';
        const tagsString = tagsLine ? tagsLine.substring('Tags:'.length).trim() : '';
        const tags = tagsString.split(',').map(tag => tag.trim()).filter(Boolean);

        return { category, tags };
    },
);

const scanAndCategorizeDrugFlow = ai.defineFlow(
  {
    name: 'scanAndCategorizeDrugFlow',
    inputSchema: ScanAndCategorizeDrugInputSchema,
    outputSchema: ScanAndCategorizeDrugOutputSchema,
  },
  async (input) => {
    const { text: drugName, toolRequest } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      tools: [categorizeDrug],
      prompt: `From the provided image of a medicine label, first extract the drug's name. Then, use the provided tool to categorize it and get tags.
      
      Image: {{media url=photoDataUri}}`,
    });

    if (!drugName) {
        throw new Error('Could not extract drug name from the image.');
    }
    
    if (toolRequest) {
        const toolResponse = await toolRequest.run();
        const output = toolResponse[0].output as { category: string; tags: string[] };
        return {
            drugName: JSON.parse(toolResponse[0].input as string).drugName,
            category: output.category,
            tags: output.tags,
        };
    }

    // Fallback if the tool is not called
    const toolResult = await categorizeDrug({ drugName });

    return {
        drugName: drugName,
        category: toolResult.category,
        tags: toolResult.tags,
    };
  }
);
