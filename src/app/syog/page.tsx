'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Scissors, Info, Upload, Shirt, Palette, Sparkles, Navigation, CheckCircle } from 'lucide-react';
import { submitSyogRequestAction } from '@/app/actions/syog-actions';
import { useUser } from '@/firebase';

export default function SyogPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    garmentType: '',
    material: '',
    customizationType: '',
    instructions: '',
    condition: 'new_with_tags',
  });

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleSkipToCheckout = async () => {
     if (!user) {
         toast({ title: "Login Required", description: "You must be logged in to send a garment.", variant: "destructive" });
         router.push('/login?redirect=/syog');
         return;
     }

     setIsSubmitting(true);
     // Call server action
     const res = await submitSyogRequestAction(formData);
     setIsSubmitting(false);

     if (res.success) {
         setStep(5); // Success Step
     } else {
         toast({ title: "Submission Failed", description: res.message, variant: "destructive" });
     }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Hero */}
      <section className="relative overflow-hidden bg-muted/30 pt-16 pb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background pointer-events-none" />
        <div className="container relative z-10 mx-auto px-4 max-w-4xl text-center">
            <Badge variant="outline" className="mb-4">Sustainable Fashion</Badge>
            <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 tracking-tight">
                Send Your Own <span className="text-primary italic">Garment</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Don't buy new. Upcycle what you already own. Send us your favorite blank tee, old denim jacket, or hoodie, and our Hyperlocal experts will apply your custom AI or hand-drawn designs.
            </p>
        </div>
      </section>

      <section className="container max-w-3xl mx-auto px-4 mt-8">
        
        {step === 5 ? (
            <Card className="text-center py-16 border-primary/20 bg-primary/5">
                <CardContent className="flex flex-col items-center justify-center space-y-4">
                    <CheckCircle className="h-20 w-20 text-green-500 mb-4" />
                    <h2 className="text-3xl font-headline font-bold">Request Received!</h2>
                    <p className="text-muted-foreground w-2/3">
                        Your SYOG request has been routed to our Hyperlocal network. Please check your email for shipping instructions and the shipping label to send your garment to the nearest artisan.
                    </p>
                    <Button onClick={() => router.push('/dashboard')} className="mt-8" size="lg">
                        View Dashboard
                    </Button>
                </CardContent>
            </Card>
        ) : (
            <>
                {/* Stepper Progress */}
                <div className="flex items-center justify-between mb-8 px-4 relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-muted -z-10" />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary -z-10 transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }} />
                    
                    {[1,2,3,4].map(num => (
                        <div key={num} className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= num ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                            {num}
                        </div>
                    ))}
                </div>

                <Card className="shadow-lg border-primary/10">
                    <CardHeader className="bg-muted/30 border-b">
                        {step === 1 && (
                            <>
                            <CardTitle className="text-2xl flex items-center gap-2"><Shirt className="text-primary h-6 w-6"/> What are you sending us?</CardTitle>
                            <CardDescription>Give us the details of the blank canvas.</CardDescription>
                            </>
                        )}
                        {step === 2 && (
                            <>
                            <CardTitle className="text-2xl flex items-center gap-2"><Scissors className="text-primary h-6 w-6"/> Material & Condition</CardTitle>
                            <CardDescription>Different materials require different printing methods.</CardDescription>
                            </>
                        )}
                        {step === 3 && (
                            <>
                            <CardTitle className="text-2xl flex items-center gap-2"><Palette className="text-primary h-6 w-6"/> Customization Type</CardTitle>
                            <CardDescription>How should we apply the artwork?</CardDescription>
                            </>
                        )}
                        {step === 4 && (
                            <>
                            <CardTitle className="text-2xl flex items-center gap-2"><Navigation className="text-primary h-6 w-6"/> Final Instructions</CardTitle>
                            <CardDescription>Review and submit your upcycle request.</CardDescription>
                            </>
                        )}
                    </CardHeader>

                    <CardContent className="pt-6 min-h-[300px]">
                        {step === 1 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
                                <div className="space-y-3">
                                    <Label className="text-base">Garment Type</Label>
                                    <RadioGroup value={formData.garmentType} onValueChange={(val) => setFormData({...formData, garmentType: val})} className="grid grid-cols-2 gap-4">
                                        {['T-Shirt', 'Hoodie', 'Denim Jacket', 'Sweatpants', 'Cap', 'Other'].map(type => (
                                            <div key={type}>
                                                <RadioGroupItem value={type} id={`type-${type}`} className="peer sr-only" />
                                                <Label htmlFor={`type-${type}`} className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-center font-medium">
                                                    {type}
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8 animate-in slide-in-from-right-4 fade-in">
                                <div className="space-y-3">
                                    <Label className="text-base">Dominant Material</Label>
                                    <RadioGroup value={formData.material} onValueChange={(val) => setFormData({...formData, material: val})} className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center space-x-2 border p-3 rounded-md">
                                            <RadioGroupItem value="100% Cotton" id="mat-cotton" />
                                            <Label htmlFor="mat-cotton">100% Cotton</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border p-3 rounded-md">
                                            <RadioGroupItem value="Polyester Blend" id="mat-poly" />
                                            <Label htmlFor="mat-poly">Polyester Blend</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border p-3 rounded-md">
                                            <RadioGroupItem value="Heavy Denim" id="mat-denim" />
                                            <Label htmlFor="mat-denim">Heavy Denim</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border p-3 rounded-md">
                                            <RadioGroupItem value="Not Sure" id="mat-unknown" />
                                            <Label htmlFor="mat-unknown">Not Sure</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-base">Current Condition</Label>
                                    <RadioGroup value={formData.condition} onValueChange={(val) => setFormData({...formData, condition: val})} className="flex flex-col gap-3">
                                        <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-md">
                                            <RadioGroupItem value="new_with_tags" id="cond-new" />
                                            <Label htmlFor="cond-new">Brand new (Unwashed)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-md">
                                            <RadioGroupItem value="used_good" id="cond-used" />
                                            <Label htmlFor="cond-used">Gently used (Washed)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-md">
                                            <RadioGroupItem value="distressed" id="cond-dist" />
                                            <Label htmlFor="cond-dist">Heavily worn / Distressed</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
                                <div className="p-4 bg-muted/30 rounded-lg border border-primary/20 flex gap-3 text-sm text-muted-foreground mb-6">
                                    <Info className="h-5 w-5 text-primary shrink-0" />
                                    <p>Our vendors will apply your saved AI gallery artworks to the garment. Choose the production method here.</p>
                                </div>

                                <RadioGroup value={formData.customizationType} onValueChange={(val) => setFormData({...formData, customizationType: val})} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <RadioGroupItem value="dtf" id="cust-dtf" className="peer sr-only" />
                                        <Label htmlFor="cust-dtf" className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer text-center">
                                            <Sparkles className="h-8 w-8 mb-3 text-primary" />
                                            <span className="font-bold text-lg">DTF Print</span>
                                            <span className="text-xs text-muted-foreground mt-2">Vibrant, high-fidelity color prints perfectly bonded to the fabric. Best for cotton & poly.</span>
                                        </Label>
                                    </div>
                                    <div>
                                        <RadioGroupItem value="embroidery" id="cust-emb" className="peer sr-only" />
                                        <Label htmlFor="cust-emb" className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer text-center">
                                            <Scissors className="h-8 w-8 mb-3 text-primary" />
                                            <span className="font-bold text-lg">Embroidery</span>
                                            <span className="text-xs text-muted-foreground mt-2">Premium thread stitching. Ideal for logos, minimalist art, and heavy fabrics like denim.</span>
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
                                <div className="space-y-3">
                                    <Label className="text-base">Special Instructions for the Artisan</Label>
                                    <Textarea 
                                        placeholder="E.g., Please center the artwork exactly 3 inches below the collar. Be careful, the fabric is vintage..." 
                                        className="min-h-[120px]"
                                        value={formData.instructions}
                                        onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                                    />
                                </div>

                                <div className="p-6 bg-muted/50 rounded-lg border-2 border-dashed flex flex-col items-center text-center">
                                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                    <h4 className="font-semibold">Attach Reference Images (Optional)</h4>
                                    <p className="text-sm text-muted-foreground mt-1 mb-4">You'll map your AI designs during the final checkout stage.</p>
                                    <Button variant="outline" size="sm">Browse Files</Button>
                                </div>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex justify-between border-t bg-muted/10 p-6">
                        <Button variant="outline" onClick={handlePrev} disabled={step === 1 || isSubmitting}>
                            Back
                        </Button>
                        
                        {step < 4 ? (
                            <Button 
                                onClick={handleNext}
                                disabled={
                                    (step === 1 && !formData.garmentType) ||
                                    (step === 2 && (!formData.material || !formData.condition)) ||
                                    (step === 3 && !formData.customizationType)
                                }
                            >
                                Continue Step {step + 1}
                            </Button>
                        ) : (
                            <Button onClick={handleSkipToCheckout} disabled={isSubmitting}>
                                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Processing...</> : 'Submit SYOG Request'}
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </>
        )}
      </section>
    </div>
  );
}

// Inline Badge component to avoid massive imports, can use Shadcn Badge
function Badge({ className, variant = "default", ...props }: React.ComponentProps<"div"> & { variant?: "default" | "secondary" | "destructive" | "outline" }) {
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground",
  }
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`} {...props} />
  )
}
