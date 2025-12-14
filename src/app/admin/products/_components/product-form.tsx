
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createProduct, updateProduct } from '@/app/actions/product-actions';
import type { Product } from '@/lib/types';
import { Loader2, UploadCloud } from 'lucide-react';
import React from 'react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  category: z.enum(['T-Shirt', 'Hoodie', 'Jacket', 'Cap']),
  sizes: z.string().min(1, 'Please enter comma-separated sizes.'),
  colors: z.string().min(1, 'Please enter comma-separated hex color codes.'),
  isNew: z.boolean(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  product?: Product | null;
}

export function ProductForm({ product }: ProductFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const defaultValues = product
    ? {
        ...product,
        sizes: product.sizes.join(', '),
        colors: product.colors.join(', '),
      }
    : {
        name: '',
        description: '',
        price: 0,
        category: 'T-Shirt' as const,
        sizes: 'S, M, L, XL',
        colors: '#000000, #FFFFFF',
        isNew: true,
      };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange',
  });

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    
    //
    // TODO: This is a temporary placeholder for the file upload feature.
    // The `images` array will be populated with URLs from the upload service.
    //
    const images = product?.images.length ? product.images : ['https://picsum.photos/seed/placeholder/600/800'];

    const productData = {
        ...data,
        sizes: data.sizes.split(',').map(s => s.trim()).filter(Boolean),
        colors: data.colors.split(',').map(c => c.trim()).filter(Boolean),
        images: images,
    };

    try {
        let result;
        if (product) {
            result = await updateProduct(product.id, productData);
            if (result.success) {
                toast({ title: 'Product Updated', description: `"${data.name}" has been successfully updated.` });
            } else {
                throw new Error(result.message || 'Update failed');
            }
        } else {
            result = await createProduct(productData);
            if (result.success) {
                toast({ title: 'Product Created', description: `New product "${data.name}" has been added.` });
            } else {
                throw new Error(result.message || 'Creation failed');
            }
        }
        
        router.push('/admin/products');
        router.refresh();

    } catch (error: any) {
        toast({
            title: 'Error',
            description: error.message || (product ? 'Could not update product.' : 'Could not create product.'),
            variant: 'destructive',
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Tioras Signature Tee" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea rows={5} placeholder="Describe the product details, materials, and fit." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <div>
                    <FormLabel>Images & Video</FormLabel>
                    <FormDescription className="mb-2">Upload images and videos for the product. The first item will be the main display.</FormDescription>
                    <div className="flex items-center justify-center w-full">
                        <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB; MP4 up to 100MB</p>
                            </div>
                            {/* This input will be used for the actual file upload logic in the future */}
                            <input id="dropzone-file" type="file" className="hidden" multiple disabled/>
                        </div>
                    </div>
                 </div>
            </div>
            <div className="space-y-8">
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="2499" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="T-Shirt">T-Shirt</SelectItem>
                                <SelectItem value="Hoodie">Hoodie</SelectItem>
                                <SelectItem value="Jacket">Jacket</SelectItem>
                                <SelectItem value="Cap">Cap</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="sizes"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Sizes</FormLabel>
                        <FormControl>
                            <Input placeholder="S, M, L, XL" {...field} />
                        </FormControl>
                        <FormDescription>Comma-separated values.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="colors"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Colors</FormLabel>
                        <FormControl>
                            <Input placeholder="#000000, #FFFFFF" {...field} />
                        </FormControl>
                        <FormDescription>Comma-separated hex codes.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="isNew"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel>New Arrival</FormLabel>
                                <FormDescription>
                                    Display a 'New' badge on the product.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                    />
            </div>
        </div>
        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
          {product ? 'Save Changes' : 'Create Product'}
        </Button>
      </form>
    </Form>
  );
}
