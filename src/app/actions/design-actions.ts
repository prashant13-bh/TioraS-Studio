'use server';

import { z } from 'zod';
import { generateCustomDesign as generateCustomDesignFlow } from '@/ai/flows/generate-custom-designs';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const generateSchema = z.object({
  prompt: z.string().min(3, 'Prompt must be at least 3 characters long.'),
  productType: z.enum(['T-Shirt', 'Hoodie', 'Jacket', 'Cap']),
});

export async function generateDesignAction(prevState: any, formData: FormData) {
  const validatedFields = generateSchema.safeParse({
    prompt: formData.get('prompt'),
    productType: formData.get('productType'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
      imageUrl: null,
      prompt: formData.get('prompt'),
      productType: formData.get('productType'),
    };
  }
  
  const { prompt, productType } = validatedFields.data;

  try {
    const result = await generateCustomDesignFlow({ prompt, productType });
    
    return {
      message: 'Design generated successfully.',
      imageUrl: result.imageUrl,
      prompt,
      productType,
    };
  } catch (error) {
    console.error('AI design generation failed:', error);
    return {
      message: 'Failed to generate design. Please try again later.',
      imageUrl: null,
      prompt,
      productType,
    };
  }
}


const saveSchema = z.object({
    name: z.string().min(1),
    prompt: z.string().min(1),
    productType: z.string().min(1),
    imageUrl: z.string().url(),
});

export async function saveDesignAction(
    name: string,
    prompt: string,
    productType: string,
    imageUrl: string
) {
    const validatedFields = saveSchema.safeParse({
        name,
        prompt,
        productType,
        imageUrl,
    });
    
    if (!validatedFields.success) {
        return { success: false, message: 'Invalid design data.' };
    }

    try {
        await prisma.design.create({
            data: {
                name,
                prompt,
                product: productType,
                imageUrl,
                status: 'Draft',
            },
        });
        revalidatePath('/admin/reviews');
        revalidatePath('/dashboard');
        return { success: true, message: 'Design saved successfully!' };
    } catch (error) {
        console.error('Failed to save design:', error);
        return { success: false, message: 'Failed to save design to database.' };
    }
}
