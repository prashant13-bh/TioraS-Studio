"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/app/actions/product-actions";
import type { Product, ProductMedia } from "@/lib/types";
import { Loader2, PlusCircle, Trash2, Video } from "lucide-react";
import React from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ImageUpload } from "@/components/ui/image-upload";

const mediaSchema = z.object({
  type: z.enum(["image", "video"]),
  url: z.string().url("Please enter a valid URL."),
});

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  category: z.enum(["T-Shirt", "Hoodie", "Jacket", "Cap"]),
  sizes: z.string().min(1, "Please enter comma-separated sizes."),
  colors: z.string().min(1, "Please enter comma-separated hex color codes."),
  media: z.array(mediaSchema).min(1, "Add at least one image or video."),
  isNew: z.boolean(),
  stock: z.coerce.number().min(0, "Stock must be a positive number."),
  sku: z.string().optional(),
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
        sizes: product.sizes.join(", "),
        colors: product.colors.join(", "),
        media: product.media,
        stock: product.stock || 0,
        sku: product.sku || "",
      }
    : {
        name: "",
        description: "",
        price: 0,
        category: "T-Shirt" as const,
        sizes: "S, M, L, XL",
        colors: "#000000, #FFFFFF",
        media: [
          {
            type: "image",
            url: "https://picsum.photos/seed/placeholder/600/800",
          },
        ],
        isNew: true,
        stock: 0,
        sku: "",
      };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "media",
  });

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);

    const productData = {
      ...data,
      sizes: data.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      colors: data.colors
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      stock: data.stock || 0,
      sku: data.sku || `SKU-${Date.now()}`,
    };

    try {
      let result;
      if (product) {
        result = await updateProduct(product.id, productData);
        if (result.success) {
          toast({
            title: "Product Updated",
            description: `"${data.name}" has been successfully updated.`,
          });
        } else {
          throw new Error(result.message || "Update failed");
        }
      } else {
        result = await createProduct(
          productData as Omit<Product, "id" | "createdAt" | "updatedAt">
        );
        if (result.success) {
          toast({
            title: "Product Created",
            description: `New product "${data.name}" has been added.`,
          });
        } else {
          throw new Error(result.message || "Creation failed");
        }
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message ||
          (product ? "Could not update product." : "Could not create product."),
        variant: "destructive",
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
                    <Input
                      placeholder="e.g., Tioras Signature Tee"
                      {...field}
                    />
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
                    <Textarea
                      rows={5}
                      placeholder="Describe the product details, materials, and fit."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormLabel>Images</FormLabel>
              <FormDescription className="mb-4">
                Upload product images. The first image will be the main display.
              </FormDescription>
              
              <div className="space-y-4">
                <ImageUpload
                  value={fields.map((field) => field.url)}
                  disabled={isSubmitting}
                  onChange={(url) => {
                    const isVideo = url.includes('.mp4') || url.includes('.webm') || url.includes('.ogg');
                    append({ url, type: isVideo ? "video" : "image" });
                  }}
                  onRemove={(url) => {
                    const index = fields.findIndex((field) => field.url === url);
                    if (index !== -1) remove(index);
                  }}
                />
              </div>
              <FormMessage>
                {form.formState.errors.media?.root?.message ||
                  form.formState.errors.media?.message}
              </FormMessage>
            </div>
          </div>
          <div className="space-y-8">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="2499" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="100" {...field} />
                  </FormControl>
                  <FormDescription>Initial inventory count</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="SKU-12345" {...field} />
                  </FormControl>
                  <FormDescription>Unique product identifier for barcode</FormDescription>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
          {product ? "Save Changes" : "Create Product"}
        </Button>
      </form>
    </Form>
  );
}
