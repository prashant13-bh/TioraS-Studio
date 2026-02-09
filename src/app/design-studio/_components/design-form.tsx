'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { generateDesignAction, saveDesignAction } from '@/app/actions/design-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bot, Download, Loader2, Save, Wand2, Sparkles, Lightbulb, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import React, { useEffect, useRef, useState } from 'react';
import { useUser } from '@/firebase';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

const initialState = {
  message: '',
  errors: undefined,
  imageUrl: null,
  prompt: '',
  productType: 'T-Shirt',
};

const PRODUCT_TYPES = [
  { value: 'T-Shirt', icon: '👕', label: 'T-Shirt' },
  { value: 'Hoodie', icon: '🧥', label: 'Hoodie' },
  { value: 'Jacket', icon: '🧥', label: 'Jacket' },
  { value: 'Cap', icon: '🧢', label: 'Cap' },
];

const PROMPT_EXAMPLES = [
  'A majestic lion wearing a crown',
  'Geometric mountain landscape at sunset',
  'Abstract space nebula with vibrant colors',
  'Vintage retro wave sunset design',
  'Minimalist japanese wave art',
  'Cyberpunk neon city skyline',
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      disabled={pending} 
      size="lg" 
      className="w-full font-bold text-base rounded-2xl h-12 md:h-14 bg-gradient-to-r from-primary via-primary to-secondary hover:opacity-90 shadow-lg"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 size-5 animate-spin" />
          Creating Magic...
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
  const { user, loading: userLoading } = useUser();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(state.prompt || '');

  useEffect(() => {
    if (state.message && state.imageUrl === null && !state.errors) {
      toast({
        title: 'Generation Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state.message, state.imageUrl, state.errors, toast]);
  
  const handleSave = async () => {
    if (!user) {
        toast({ title: "Please log in", description: "You must be logged in to save a design.", variant: 'destructive'});
        return;
    }
    if (state.imageUrl && state.prompt && state.productType) {
        setIsSaving(true);
        const designName = name || `AI Design - ${new Date().toLocaleString()}`;
        const result = await saveDesignAction(user.uid, designName, state.prompt, state.productType, state.imageUrl);
        if (result.success) {
            toast({ title: "✨ Success!", description: result.message });
        } else {
            toast({ title: "Error", description: result.message, variant: 'destructive' });
        }
        setIsSaving(false);
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
        toast({ title: '⬇️ Downloaded!', description: 'Design saved to your device' });
    }
  };

  const usePromptExample = (example: string) => {
    setSelectedPrompt(example);
    // Focus on the textarea after setting the example
    const textarea = formRef.current?.querySelector('textarea');
    if (textarea) textarea.focus();
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2 md:space-y-3"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="size-6 md:size-8 text-primary animate-pulse" />
          <h1 className="text-2xl md:text-4xl font-black font-headline bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            AI Design Studio
          </h1>
          <Sparkles className="size-6 md:size-8 text-secondary animate-pulse" />
        </div>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          Transform your ideas into stunning apparel designs with the power of AI ✨
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
        {/* Design Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-background via-background to-primary/5 rounded-3xl overflow-hidden">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
                <Zap className="size-5 text-primary" />
                Create Your Design
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Choose a product and describe your vision
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 md:space-y-6">
              <form ref={formRef} action={formAction} className="space-y-5 md:space-y-6">
                {/* Product Type */}
                <div className="space-y-3">
                  <Label htmlFor="productType" className="text-sm md:text-base font-semibold flex items-center gap-2">
                    Select Product
                  </Label>
                  <Select name="productType" defaultValue={state.productType?.toString() || 'T-Shirt'}>
                    <SelectTrigger id="productType" className="h-12 md:h-14 rounded-xl border-2 text-base">
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="text-base">
                          <span className="flex items-center gap-2">
                            <span className="text-xl">{type.icon}</span>
                            <span>{type.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Prompt Input */}
                <div className="space-y-3">
                  <Label htmlFor="prompt" className="text-sm md:text-base font-semibold flex items-center gap-2">
                    <Lightbulb className="size-4 text-primary" />
                    Design Prompt
                  </Label>
                  <Textarea
                    id="prompt"
                    name="prompt"
                    placeholder="e.g., A wolf howling at a geometric moon"
                    value={selectedPrompt}
                    onChange={(e) => setSelectedPrompt(e.target.value)}
                    className="min-h-[100px] md:min-h-[120px] resize-none rounded-xl border-2 text-sm md:text-base p-3 md:p-4"
                  />
                  {state.errors?.prompt && (
                    <p className="text-sm text-destructive">{state.errors.prompt}</p>
                  )}
                </div>

                {/* Prompt Examples */}
                <div className="space-y-2">
                  <Label className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Sparkles className="size-3 md:size-4" />
                    Quick Ideas
                  </Label>
                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {PROMPT_EXAMPLES.map((example, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all text-[10px] md:text-xs px-2 py-1 rounded-lg"
                        onClick={() => usePromptExample(example)}
                      >
                        {example}
                      </Badge>
                    ))}
                  </div>
                </div>

                <SubmitButton />
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Preview Area */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-background via-background to-secondary/5 rounded-3xl overflow-hidden h-full flex flex-col">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
                <Bot className="size-5 text-secondary" />
                Preview
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Your generated design will appear here
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center p-4 md:p-6">
              <AnimatePresence mode="wait">
                {state.imageUrl ? (
                  <motion.div 
                    key="image"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex w-full flex-col items-center gap-4"
                  >
                    <div className="relative aspect-square w-full max-w-sm md:max-w-md overflow-hidden rounded-2xl shadow-2xl ring-4 ring-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
                        <Image
                            src={state.imageUrl}
                            alt={state.prompt || 'Generated AI design'}
                            fill
                            sizes="(max-width: 768px) 90vw, 50vw"
                            className="object-cover"
                            priority
                        />
                        {/* Mobile Gesture Hint */}
                        <div className="absolute bottom-2 left-2 right-2 md:hidden">
                          <div className="bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full text-center">
                            Tap to view full size
                          </div>
                        </div>
                    </div>
                    <Input 
                        type="text" 
                        placeholder="Give your design a name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full max-w-sm md:max-w-md h-11 md:h-12 rounded-xl border-2 text-sm md:text-base"
                    />
                    <div className='flex flex-col sm:flex-row gap-2 md:gap-3 w-full max-w-sm md:max-w-md'>
                        <Button 
                          onClick={handleSave} 
                          variant="secondary" 
                          className="flex-1 h-11 md:h-12 rounded-xl font-semibold text-sm md:text-base shadow-lg" 
                          disabled={isSaving || userLoading}
                        >
                            {isSaving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
                             Save to Gallery
                        </Button>
                        <Button 
                          onClick={handleDownload} 
                          className="flex-1 h-11 md:h-12 rounded-xl font-semibold text-sm md:text-base bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg"
                        >
                          <Download className="mr-2 size-4" /> 
                          Download
                        </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-muted-foreground px-4 py-8 md:py-12"
                  >
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-3xl rounded-full" />
                      <Bot className="relative mx-auto size-16 md:size-24 text-primary/60 animate-pulse" />
                    </div>
                    <h3 className="font-headline text-base md:text-xl font-bold mb-2">
                      Ready to Create?
                    </h3>
                    <p className="text-xs md:text-sm max-w-xs mx-auto leading-relaxed">
                      Enter a creative prompt and click Generate Design to see AI magic in action! ✨
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
