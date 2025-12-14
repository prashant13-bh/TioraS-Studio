
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
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
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import React from 'react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  category: z.enum(['T-Shirt', 'Hoodie', 'Jacket', 'Cap']),
  sizes: z.string().min(1, 'Please enter comma-separated sizes.'),
  colors: z.string().min(1, 'Please enter comma-separated hex color codes.'),
  images: z.array(z.object({ value: z.string().url({ message: "Please enter a valid URL." }) })).min(1, 'At least one image is required.'),
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
        images: product.images.map(url => ({ value: url })),
      }
    : {
        name: '',
        description: '',
        price: 0,
        category: 'T-Shirt' as const,
        sizes: 'S, M, L, XL',
        colors: '#000000, #FFFFFF',
        images: [{ value: 'https://picsum.photos/seed/101/600/800' }],
        isNew: true,
      };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'images'
  });

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    const productData = {
        ...data,
        sizes: data.sizes.split(',').map(s => s.trim()).filter(Boolean),
        colors: data.colors.split(',').map(c => c.trim()).filter(Boolean),
        images: data.images.map(img => img.value).filter(Boolean),
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
                    <FormLabel>Images</FormLabel>
                    <FormDescription className="mb-2">The first image will be the main display image. Add at least one image URL.</FormDescription>
                    <div className="space-y-4">
                        {fields.map((field, index) => (
                        <FormField
                            key={field.id}
                            control={form.control}
                            name={`images.${index}.value`}
                            render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center gap-2">
                                <FormControl>
                                    <Input placeholder="https://example.com/image.png" {...field} />
                                </FormControl>
                                {fields.length > 1 && (
                                    <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => remove(index)}
                                    >
                                    <Trash2 className="size-4" />
                                    <span className="sr-only">Remove image</span>
                                    </Button>
                                )}
                                </div>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        ))}
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => append({ value: '' })}
                        >
                        <PlusCircle className="mr-2 size-4" />
                        Add Image
                    </Button>
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
