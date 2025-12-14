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
import type { Product, ProductMedia } from '@/lib/types';
import { Loader2, PlusCircle, Trash2, Video } from 'lucide-react';
import React from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const mediaSchema = z.object({
  type: z.enum(['image', 'video']),
  url: z.string().url('Please enter a valid URL.'),
});

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  category: z.enum(['T-Shirt', 'Hoodie', 'Jacket', 'Cap']),
  sizes: z.string().min(1, 'Please enter comma-separated sizes.'),
  colors: z.string().min(1, 'Please enter comma-separated hex color codes.'),
  media: z.array(mediaSchema).min(1, 'Add at least one image or video.'),
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
  const [newMediaUrl, setNewMediaUrl] = React.useState('');
  const [newMediaType, setNewMediaType] = React.useState<'image' | 'video'>('image');
  const [isAddMediaOpen, setIsAddMediaOpen] = React.useState(false);

  const defaultValues = product
    ? {
        ...product,
        sizes: product.sizes.join(', '),
        colors: product.colors.join(', '),
        media: product.media,
      }
    : {
        name: '',
        description: '',
        price: 0,
        category: 'T-Shirt' as const,
        sizes: 'S, M, L, XL',
        colors: '#000000, #FFFFFF',
        media: [{ type: 'image', url: 'https://picsum.photos/seed/placeholder/600/800' }],
        isNew: true,
      };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'media',
  });

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    
    const productData = {
        ...data,
        sizes: data.sizes.split(',').map(s => s.trim()).filter(Boolean),
        colors: data.colors.split(',').map(c => c.trim()).filter(Boolean),
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
            result = await createProduct(productData as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>);
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

  const handleAddMedia = () => {
    if (newMediaUrl) {
        try {
            z.string().url().parse(newMediaUrl);
            append({ url: newMediaUrl, type: newMediaType });
            setNewMediaUrl('');
            setNewMediaType('image');
            setIsAddMediaOpen(false);
        } catch (error) {
            toast({
                title: 'Invalid URL',
                description: 'Please enter a valid media URL.',
                variant: 'destructive'
            });
        }
    }
  }

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
                    <FormDescription className="mb-2">Manage media for the product. The first item is the main display.</FormDescription>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {fields.map((field, index) => (
                            <div key={field.id} className="relative group aspect-square w-full">
                                {field.type === 'image' ? (
                                     <Image
                                        src={field.url}
                                        alt={`Product media ${index + 1}`}
                                        fill
                                        className="rounded-md object-cover"
                                    />
                                ) : (
                                    <div className="flex size-full items-center justify-center rounded-md bg-muted">
                                        <Video className="size-8 text-muted-foreground"/>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="size-8"
                                        onClick={() => remove(index)}
                                    >
                                        <Trash2 className="size-4" />
                                        <span className="sr-only">Remove Media</span>
                                    </Button>
                                </div>
                            </div>
                        ))}
                         <Dialog open={isAddMediaOpen} onOpenChange={setIsAddMediaOpen}>
                            <DialogTrigger asChild>
                                <button type="button" className="flex aspect-square w-full items-center justify-center rounded-md border-2 border-dashed bg-muted/50 transition-colors hover:bg-muted/80">
                                    <PlusCircle className="size-8 text-muted-foreground" />
                                    <span className="sr-only">Add Media</span>
                                </button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Media</DialogTitle>
                                    <DialogDescription>
                                        Paste the URL of the image or video you want to add.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                     <div className="space-y-2">
                                        <Label>Media Type</Label>
                                         <RadioGroup value={newMediaType} onValueChange={(v) => setNewMediaType(v as 'image' | 'video')}>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="image" id="r-image" />
                                                <Label htmlFor="r-image">Image</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="video" id="r-video" />
                                                <Label htmlFor="r-video">Video</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new-media-url">Media URL</Label>
                                        <Input 
                                            id="new-media-url"
                                            value={newMediaUrl}
                                            onChange={(e) => setNewMediaUrl(e.target.value)}
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsAddMediaOpen(false)}>Cancel</Button>
                                    <Button type="button" onClick={handleAddMedia}>Add Media</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <FormMessage>{form.formState.errors.media?.root?.message || form.formState.errors.media?.message}</FormMessage>
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
                        <FormDescription>Comma-separated hex codes.</FormMessage>
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
