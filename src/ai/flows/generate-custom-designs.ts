'use server';

/**
 * @fileOverview A flow that generates custom clothing designs using Google Gemini Pro.
 *
 * - generateCustomDesign - A function that handles the design generation process.
 * - GenerateCustomDesignInput - The input type for the generateCustomDesign function.
 * - GenerateCustomDesignOutput - The return type for the generateCustomDesign function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCustomDesignInputSchema = z.object({
  prompt: z.string().describe('The text prompt for generating the design.'),
  productType: z
    .enum(['T-Shirt', 'Hoodie', 'Jacket', 'Cap'])
    .describe('The type of product for the design.'),
});
export type GenerateCustomDesignInput = z.infer<typeof GenerateCustomDesignInputSchema>;

const GenerateCustomDesignOutputSchema = z.object({
  imageUrl: z.string().describe('The URL of the generated image.'),
});
export type GenerateCustomDesignOutput = z.infer<typeof GenerateCustomDesignOutputSchema>;

export async function generateCustomDesign(
  input: GenerateCustomDesignInput
): Promise<GenerateCustomDesignOutput> {
  return generateCustomDesignFlow(input);
}

const generateCustomDesignPrompt = ai.definePrompt({
  name: 'generateCustomDesignPrompt',
  input: {schema: GenerateCustomDesignInputSchema},
  output: {schema: GenerateCustomDesignOutputSchema},
  prompt: `Generate a design for a {{{productType}}} with the following description: {{{prompt}}}. Return the URL of the generated image.`,
});

const generateCustomDesignFlow = ai.defineFlow(
  {
    name: 'generateCustomDesignFlow',
    inputSchema: GenerateCustomDesignInputSchema,
    outputSchema: GenerateCustomDesignOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Generate a design for a ${input.productType} with the following description: ${input.prompt}`,
    });

    return {imageUrl: media.url!};
  }
);
