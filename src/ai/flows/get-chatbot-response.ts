'use server';
/**
 * @fileOverview A conversational AI chatbot that provides medication advice.
 *
 * - getChatbotResponse - A function that returns a response from the chatbot.
 * - ChatbotInput - The input type for the getChatbotResponse function.
 * - ChatbotOutput - The return type for the getChatbotResponse function.
 */

import {ai} from '@/ai/genkit';
import { Drug } from '@/context/drug-context';
import {z} from 'genkit';

// Define a schema for a single chat message
const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

const ChatbotInputSchema = z.object({
  userHealthConditions: z.string().describe("A text description of the user's known health conditions."),
  userMedications: z.array(z.object({
    brandName: z.string().optional(),
    activeIngredients: z.array(z.string()),
  })).describe('A list of medications available in the user\'s pharmacy.'),
  currentQuery: z.string().describe('The latest message from the user.'),
  chatHistory: z.array(ChatMessageSchema).describe('The history of the conversation so far.'),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  response: z.string().describe('The AI\'s response to the user\'s query.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function getChatbotResponse(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: {schema: ChatbotInputSchema},
  output: {schema: ChatbotOutputSchema},
  prompt: `You are a helpful and cautious pharmacy assistant chatbot. Your name is DarooAI.

  You have access to the user's health profile and their list of available medications.
  - User's Health Conditions: {{{userHealthConditions}}}
  - Medications in User's Pharmacy: {{#each userMedications}} {{brandName}} ({{#each activeIngredients}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}){{#unless @last}};{{/unless}} {{/each}}

  Your primary goal is to help the user with their health questions, like suggesting a medication they already own for a specific symptom (e.g., "I have a headache").

  Conversation History:
  {{#each chatHistory}}
  {{#if (eq role 'user')}}User: {{content}}{{/if}}
  {{#if (eq role 'assistant')}}Assistant: {{content}}{{/if}}
  {{/each}}
  
  User's latest message: "{{{currentQuery}}}"

  **Your Task:**
  1.  Analyze the user's latest message in the context of the conversation history and their health conditions.
  2.  If the user is asking for a medication for a symptom, FIRST ask 2-3 relevant follow-up questions to better understand their situation (e.g., "How severe is the headache?", "Have you eaten today?", "Are you feeling any other symptoms?").
  3.  **Only after you have gathered enough information**, suggest the most appropriate medication **from their available list**.
  4.  When suggesting a medication, briefly mention potential common side effects and check for obvious interactions with other drugs in their list.
  5.  If no medication from their list is suitable, explain why and suggest they consult a doctor.
  6.  ALWAYS include a disclaimer: "This is not medical advice. Please consult with a healthcare professional for any medical concerns."
  7.  Keep your responses concise, clear, and in Persian.
  8.  If the conversation is not health-related, politely steer it back to your purpose as a pharmacy assistant.

  Generate the next response from the assistant.`,
});

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
