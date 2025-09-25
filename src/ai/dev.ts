import { config } from 'dotenv';
config();

import '@/ai/flows/flag-medication-inconsistencies.ts';
import '@/ai/flows/get-chatbot-response.ts';
import '@/ai/flows/scan-and-categorize-drug.ts';
