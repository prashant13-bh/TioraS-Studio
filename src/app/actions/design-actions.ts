
'use server';

import { z } from 'zod';
import { generateCustomDesign as generateCustomDesignFlow } from '@/ai/flows/generate-custom-designs';
import { revalidatePath } from 'next/cache';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { verifySession } from '@/app/actions/auth-actions';

const generateSchema = z.object({
  prompt: z.string().min(3, 'Prompt must be at least 3 characters long.'),
  productType: z.enum(['T-Shirt', 'Hoodie', 'Jacket', 'Cap']),
});

export async function generateDesignAction(prevState: any, formData: FormData) {
  const session = await verifySession();
  if (!session) {
    return {
      message: 'You must be logged in to generate designs.',
      imageUrl: null,
      prompt: formData.get('prompt'),
      productType: formData.get('productType'),
    };
  }

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
  } catch (error: any) {
    console.error('AI design generation failed:', error);
    console.error('Error details:', error.message, error.stack);
    return {
      message: `Failed to generate design: ${error.message || 'Unknown error'}`,
      imageUrl: null,
      prompt,
      productType,
    };
  }
}


const saveSchema = z.object({
    userId: z.string().min(1, 'User ID is required.'),
    name: z.string().min(1),
    prompt: z.string().min(1),
    productType: z.string().min(1),
    imageUrl: z.string().url(),
});

export async function saveDesignAction(
    userId: string,
    name: string,
    prompt: string,
    productType: string,
    imageUrl: string
) {
    const session = await verifySession();
    if (!session || session.uid !== userId) {
        return { success: false, message: 'Unauthorized: You can only save designs to your own profile.' };
    }

    const validatedFields = saveSchema.safeParse({
        userId,
        name,
        prompt,
        productType,
        imageUrl,
    });
    
    if (!validatedFields.success) {
        return { success: false, message: 'Invalid design data.' };
    }

    try {
        const db = getAdminFirestore();
        const now = new Date().toISOString();
        const designData = {
            name,
            prompt,
            product: productType,
            imageUrl,
            status: 'Draft',
            createdAt: now,
            updatedAt: now,
            userId,
        };
        
        await db.collection('users').doc(userId).collection('designs').add(designData);

        revalidatePath('/dashboard/designs');
        return { success: true, message: 'Design saved successfully!' };
    } catch (error) {
        console.error('Failed to save design:', error);
        return { success: false, message: 'Failed to save design to database.' };
    }
}


