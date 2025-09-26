'use server';
import { config } from 'dotenv';
config();

import '@/genkit/flows/flag-medication-inconsistencies.ts';
import '@/genkit/flows/get-chatbot-response.ts';
import '@/genkit/flows/scan-and-categorize-drug.ts';
import '@/genkit/flows/get-drug-summary.ts';
import '@/genkit/flows/get-drug-interaction.ts';
