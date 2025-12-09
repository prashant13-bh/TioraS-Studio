'use client';

import { useActionState, useFormStatus } from 'react-dom';
import Image from 'next/image';
import { generateDesignAction, saveDesignAction } from '@/app/actions/design-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bot, Download, Loader2, Save, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import React, { useEffect, useRef, useState } from 'react';

const initialState = {
  message: '',
  errors: null,
  imageUrl: null,
  prompt: 'A majestic lion wearing a crown, rendered in a detailed, photorealistic style.',
  productType: 'T-Shirt',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full font-bold">
      {pending ? (
        <>
          <Loader2 className="mr-2 size-5 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 size-5" />
          Generate Design
        </>
      )}
    </Button>
  );
}

export function DesignForm() {
  const [state, formAction] = useActionState(generateDesignAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [name, setName] = useState('');

  useEffect(() => {
    if (state.message && state.imageUrl === null && !state.errors) {
      toast({
        title: 'Generation Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast]);
  
  const handleSave = async () => {
    if (state.imageUrl && state.prompt && state.productType) {
        const designName = name || `AI Design - ${new Date().toLocaleString()}`;
        const result = await saveDesignAction(designName, state.prompt, state.productType, state.imageUrl);
        if (result.success) {
            toast({ title: "Success", description: result.message });
        } else {
            toast({ title: "Error", description: result.message, variant: 'destructive' });
        }
    }
  };

  const handleDownload = () => {
    if (state.imageUrl) {
        const link = document.createElement('a');
        link.href = state.imageUrl;
        link.download = `tioras-design-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Card>
        <CardContent className="p-6">
          <form ref={formRef} action={formAction} className="space-y-6">
            <div>
              <Label htmlFor="productType" className="font-semibold">Product Type</Label>
              <Select name="productType" defaultValue={state.productType}>
                <SelectTrigger id="productType">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="T-Shirt">T-Shirt</SelectItem>
                  <SelectItem value="Hoodie">Hoodie</SelectItem>
                  <SelectItem value="Jacket">Jacket</SelectItem>
                  <SelectItem value="Cap">Cap</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="prompt" className="font-semibold">Design Prompt</Label>
              <Input
                id="prompt"
                name="prompt"
                placeholder="e.g., A wolf howling at a geometric moon"
                defaultValue={state.prompt}
                className="min-h-[80px] resize-none"
              />
              {state.errors?.prompt && (
                <p className="mt-1 text-sm text-destructive">{state.errors.prompt}</p>
              )}
            </div>

            <SubmitButton />
          </form>
        </CardContent>
      </Card>

      <Card className="flex flex-col items-center justify-center bg-muted/30 p-6">
        {state.imageUrl ? (
          <div className="flex w-full flex-col items-center gap-4">
            <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-lg shadow-lg">
                <Image
                    src={state.imageUrl}
                    alt={state.prompt || 'Generated AI design'}
                    fill
                    sizes="50vw"
                    className="object-cover"
                />
            </div>
            <Input 
                type="text" 
                placeholder="Enter a name for your design"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full max-w-md"
            />
            <div className='flex gap-2'>
                <Button onClick={handleSave} variant="secondary"><Save className="mr-2 size-4" /> Save</Button>
                <Button onClick={handleDownload}><Download className="mr-2 size-4" /> Download</Button>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <Bot className="mx-auto mb-4 size-16" />
            <h3 className="font-headline text-xl font-semibold">Your design will appear here</h3>
            <p className="mt-1">
              Enter a prompt and click &quot;Generate Design&quot; to begin.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
