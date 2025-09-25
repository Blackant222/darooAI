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

const searchForDrugName = ai.defineTool(
  {
    name: 'searchForDrugName',
    description: 'Performs a search to identify a drug name if it is not immediately clear from the image due to brand names, language, or poor quality.',
    inputSchema: z.object({
      query: z.string().describe('The search query, which should be text extracted from the image.'),
    }),
    outputSchema: z.object({
      drugName: z.string().describe('The identified official drug name from the search.'),
    }),
  },
  async ({ query }) => {
    // In a real application, this would call a Google Search API.
    // For this prototype, we'll use a powerful AI prompt to "simulate" a search and distill the name.
    const { text } = await ai.generate({
      prompt: `Based on the following text which might be a brand name or a foreign name from a drug package: "${query}", what is the most likely official/generic drug name? Respond with only the drug name.`,
    });
    return { drugName: text.trim() };
  }
);

const scanAndCategorizeDrugFlow = ai.defineFlow(
  {
    name: 'scanAndCategorizeDrugFlow',
    inputSchema: ScanAndCategorizeDrugInputSchema,
    outputSchema: ScanAndCategorizeDrugOutputSchema,
  },
  async (input) => {
    const { text: initialExtraction, toolRequest } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      tools: [categorizeDrug, searchForDrugName],
      prompt: `Analyze the provided image of a medicine label. Your goal is to identify the drug name and then categorize it.

      1. First, try to extract the primary drug name directly from the image text.
      2. If the name is a common drug, use the 'categorizeDrug' tool immediately with the extracted name.
      3. If the text is unclear, seems like a brand name, or is in a foreign language, use the 'searchForDrugName' tool to find the official drug name. Once you have the official name, pass it to the 'categorizeDrug' tool.

      Image: {{media url=photoDataUri}}`,
    });
    
    if (toolRequest) {
        const toolResponse = await toolRequest.run();
        
        // Find the output from the categorizeDrug tool call, as that's the final step
        const finalCategorization = toolResponse.find(res => res.toolName === 'categorizeDrug');

        if (finalCategorization && finalCategorization.output) {
             const output = finalCategorization.output as { category: string; tags: string[] };
             const inputArgs = JSON.parse(finalCategorization.input as string) as {drugName: string};
            return {
                drugName: inputArgs.drugName,
                category: output.category,
                tags: output.tags,
            };
        }
    }
    
    // Fallback if the model returns text directly or if tool logic fails
    if (initialExtraction) {
        const toolResult = await categorizeDrug({ drugName: initialExtraction });
        return {
            drugName: initialExtraction,
            category: toolResult.category,
            tags: toolResult.tags,
        };
    }

    throw new Error('Could not identify or categorize the drug from the image.');
  }
);
