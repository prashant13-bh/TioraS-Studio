'use server';

/**
 * @fileOverview AI-generated design review flow.
 *
 * This flow allows admins to review AI-generated designs, approve or reject them, and manage their status.
 * It includes:
 * - `reviewAIGeneratedDesign`: Function to initiate the review process.
 * - `ReviewAIGeneratedDesignInput`: Input schema for the function.
 * - `ReviewAIGeneratedDesignOutput`: Output schema for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReviewAIGeneratedDesignInputSchema = z.object({
  designId: z.string().describe('The ID of the AI-generated design to review.'),
  action: z.enum(['approve', 'reject']).describe('The action to take on the design (approve or reject).'),
  reason: z.string().optional().describe('The reason for rejection, if applicable.'),
});
export type ReviewAIGeneratedDesignInput = z.infer<typeof ReviewAIGeneratedDesignInputSchema>;

const ReviewAIGeneratedDesignOutputSchema = z.object({
  success: z.boolean().describe('Whether the review action was successful.'),
  message: z.string().describe('A message indicating the result of the review action.'),
});
export type ReviewAIGeneratedDesignOutput = z.infer<typeof ReviewAIGeneratedDesignOutputSchema>;


export async function reviewAIGeneratedDesign(input: ReviewAIGeneratedDesignInput): Promise<ReviewAIGeneratedDesignOutput> {
  return reviewAIGeneratedDesignFlow(input);
}

const reviewAIGeneratedDesignFlow = ai.defineFlow(
  {
    name: 'reviewAIGeneratedDesignFlow',
    inputSchema: ReviewAIGeneratedDesignInputSchema,
    outputSchema: ReviewAIGeneratedDesignOutputSchema,
  },
  async input => {
    // Simulate database update based on action
    let message = `Design ${input.designId} `; // Initialize the message
    if (input.action === 'approve') {
      message += 'approved successfully.';
      // In a real implementation, you would update the database to set the design status to "Approved"
    } else if (input.action === 'reject') {
      message += `rejected. Reason: ${input.reason || 'No reason provided.'}`;
      // In a real implementation, you would update the database to set the design status to "Rejected"
    }

    return {
      success: true, // Assuming the update is always successful for this simulation
      message: message,
    };
  }
);
