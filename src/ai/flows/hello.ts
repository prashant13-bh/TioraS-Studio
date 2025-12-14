'use server';

/**
 * @fileOverview A simple "Hello World" flow for Genkit.
 * 
 * - hello - A function that takes a name and returns a greeting from the AI.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export async function hello(name: string): Promise<string> {
    const { output } = await helloFlow(name);
    if (!output) {
        throw new Error("The flow did not return an output.");
    }
    return output;
}

const helloFlow = ai.defineFlow(
  {
    name: 'helloFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (name) => {
    const { text } = await ai.generate({
        prompt: `Hello Gemini, my name is ${name}. Please say hello back to me.`,
    });

    return text;
  }
);
