'use server';
/**
 * @fileOverview Scans a medicine label, identifies the drug's brand name and active ingredients (with dosage), categorizes it, and extracts relevant tags by using a web search tool.
 *
 * - scanAndCategorizeDrug - A function that handles the drug scanning and categorization process.
 * - ScanAndCategorizeDrugInput - The input type for the scanAndCategorizeDrug function.
 * - ScanAndCategorizeDrugOutput - The return type for the scanAndCategorizeDrug function.
 */

import {ai} from '@/genkit';
import {z} from 'genkit';
import { getDrugSummary } from './get-drug-summary';

// Mock search tool for demonstration. In a real scenario, this would call a search API.
const searchForDrugInfo = ai.defineTool(
  {
    name: 'searchForDrugInfo',
    description: 'Searches the web for information about a specific drug or supplement brand name to find its active ingredients, their dosages, and its category.',
    inputSchema: z.object({
      brandName: z.string().describe('The brand name of the drug to search for.'),
    }),
    outputSchema: z.object({
      activeIngredients: z.array(z.object({
          name: z.string().describe('The name of the active ingredient.'),
          dosage: z.string().optional().describe('The dosage of the ingredient, e.g., "500mg".')
      })).describe('A list of active ingredients and their dosages.'),
      category: z.string().describe('The primary pharmaceutical category of the drug.'),
    }),
  },
  async ({brandName}) => {
    // This is a mock implementation.
    // In a real-world app, you would use a Google Search API or similar.
    console.log(`Searching for drug: ${brandName}`);
    if (brandName.toLowerCase().includes('curcumax')) {
      return {
        activeIngredients: [
            { name: 'Turmeric Root Extract', dosage: '600mg' },
            { name: 'Ginger Root Extract', dosage: '10mg' },
            { name: 'Black Pepper Extract', dosage: '5mg' },
        ],
        category: 'Herbal Supplement',
      };
    }
    if (brandName.toLowerCase().includes('advil')) {
      return {
        activeIngredients: [{ name: 'Ibuprofen', dosage: '200mg' }],
        category: 'Pain Reliever',
      };
    }
    // Default fallback
    return {
      activeIngredients: [{ name: brandName, dosage: 'N/A' }],
      category: 'Unknown',
    };
  }
);


const ScanAndCategorizeDrugInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a medicine label, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ScanAndCategorizeDrugInput = z.infer<typeof ScanAndCategorizeDrugInputSchema>;

const ScanAndCategorizeDrugOutputSchema = z.object({
  brandName: z.string().optional().describe('The brand name of the drug, if available.'),
  activeIngredients: z.array(z.object({
      name: z.string().describe('The translated Persian name of the active ingredient, with the original English name in parentheses.'),
      dosage: z.string().optional().describe('The dosage of the ingredient, e.g., "500mg".')
  })).describe('A list of active ingredients and their dosages.'),
  category: z.string().describe('The primary category of the drug in Persian (e.g., "مسکن", "مکمل گیاهی").'),
  tags: z.array(z.string()).describe('A list of 3-5 relevant tags for the drug in Persian.'),
  summary: z.string().describe('A brief, easy-to-understand summary of what the drug is used for, in Persian.'),
  sideEffects: z.string().describe('A list of common side effects, presented as a single string with bullet points, in Persian.'),
});
export type ScanAndCategorizeDrugOutput = z.infer<typeof ScanAndCategorizeDrugOutputSchema>;

export async function scanAndCategorizeDrug(input: ScanAndCategorizeDrugInput): Promise<ScanAndCategorizeDrugOutput> {
  return scanAndCategorizeDrugFlow(input);
}


const scanAndCategorizeDrugPrompt = ai.definePrompt({
    name: 'scanAndCategorizeDrugPrompt',
    tools: [searchForDrugInfo],
    input: { schema: ScanAndCategorizeDrugInputSchema },
    output: { schema: Omit<ScanAndCategorizeDrugOutput, 'summary' | 'sideEffects'> },
    prompt: `You are an expert pharmacist with OCR capabilities. Your task is to analyze the provided image of a medicine or supplement package with absolute precision and provide the output in Persian.

Your process must be as follows:
1.  **Extract Brand Name**: Carefully analyze the image to identify the most prominent text on the package. This is the **brandName**. Keep this in its original language.
2.  **Use Search Tool**: You MUST use the 'searchForDrugInfo' tool to look up the extracted brandName. This will provide you with the accurate active ingredients, their dosages, and the drug's category.
3.  **Translate and Format**:
    *   The 'name' for each active ingredient **MUST be translated to Persian**, with the original English name in parentheses. For example: 'عصاره ریشه زردچوبه (Turmeric Root Extract)'.
    *   The 'category' field **MUST be in Persian**.
    *   The 'tags' field **MUST be an array of Persian strings**. Generate 3-5 relevant tags.
4.  **Format Output**: Compile all the information into the required JSON output format. Ensure the 'activeIngredients' array from the tool is correctly placed and translated.

Return ONLY the valid JSON object.

Image: {{media url=photoDataUri}}`
});


const scanAndCategorizeDrugFlow = ai.defineFlow(
  {
    name: 'scanAndCategorizeDrugFlow',
    inputSchema: ScanAndCategorizeDrugInputSchema,
    outputSchema: ScanAndCategorizeDrugOutputSchema,
  },
  async (input) => {
    const { output } = await scanAndCategorizeDrugPrompt(input);
    
    if (!output) {
        throw new Error('The AI failed to return a valid structured response.');
    }

    // Fallback logic: If after all that, activeIngredients is still empty, but we have a brand name,
    // use the brand name as the ingredient. This prevents a total failure.
    if (!output.activeIngredients || output.activeIngredients.length === 0) {
        if (!output.brandName) {
            throw new Error('AI could not identify any brand name or active ingredients.');
        }
        // As a last resort, use the brand name itself as the ingredient.
        output.activeIngredients = [{ name: output.brandName }];
    }

    // Now, get the summary and side effects
    const drugNameToSummarize = output.brandName || output.activeIngredients[0].name;
    const summaryData = await getDrugSummary({ drugName: drugNameToSummarize });

    return {
      ...output,
      summary: summaryData.summary,
      sideEffects: summaryData.sideEffects,
    };
  }
);
