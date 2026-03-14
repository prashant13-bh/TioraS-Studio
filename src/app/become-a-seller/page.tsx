'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { submitVendorApplicationAction, checkVendorStatus } from '@/app/actions/vendor-actions';
import { useUser } from '@/firebase';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Store, Truck, IndianRupee, Factory } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const applicationSchema = z.object({
  storeName: z.string().min(3, 'Store Name must be at least 3 characters'),
  description: z.string().min(20, 'Please provide a brief description (min 20 chars)'),
  contactEmail: z.string().email('Invalid email address'),
  contactPhone: z.string().min(10, 'Valid contact number is required'),
  address: z.object({
    line1: z.string().min(5, 'Street address is required'),
    line2: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pincode: z.string().min(5, 'Valid Zip/PIN code is required'),
  }),
  capabilities: z.object({
    dtfPrinting: z.boolean().default(false),
    embroidery: z.boolean().default(false),
    cutAndSew: z.boolean().default(false),
  }).refine(data => data.dtfPrinting || data.embroidery || data.cutAndSew, {
    message: "You must select at least one capability.",
    path: ["dtfPrinting"] // point error to first checkbox
  }),
  payoutSettings: z.object({
    bankName: z.string().min(2, 'Bank Name is required'),
    accountName: z.string().min(2, 'Account Holder is required'),
    accountNumber: z.string().min(5, 'Account Number is required'),
    ifscCode: z.string().min(5, 'IFSC code is required'),
    upiId: z.string().optional(),
  }),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export default function BecomeASellerPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState<{ checked: boolean; isVendor: boolean; status: string | null }>({
      checked: false, isVendor: false, status: null
  });

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      storeName: '',
      description: '',
      contactEmail: '',
      contactPhone: '',
      address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        pincode: '',
      },
      capabilities: {
        dtfPrinting: false,
        embroidery: false,
        cutAndSew: false,
      },
      payoutSettings: {
        bankName: '',
        accountName: '',
        accountNumber: '',
        ifscCode: '',
        upiId: '',
      },
    },
  });

  React.useEffect(() => {
    async function initCheck() {
        if (!userLoading) {
             if (!user) {
                 toast({ title: "Login Required", description: "You must be logged in to apply.", variant: "destructive" });
                 router.push('/login?redirect=/become-a-seller');
                 return;
             }
             
             // Pre-fill email
             form.setValue('contactEmail', user.email || '');
             
             // Check if they already applied
             const statusRes = await checkVendorStatus();
             setHasApplied({ checked: true, ...statusRes });
        }
    }
    initCheck();
  }, [user, userLoading, form, router, toast]);

  if (userLoading || !hasApplied.checked) {
      return <div className="min-h-[50vh] flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  }

  // Prevent double application
  if (hasApplied.isVendor) {
      return (
          <div className="container max-w-2xl py-24 text-center">
              <Store className="mx-auto h-16 w-16 mb-6 text-muted-foreground" />
              <h1 className="text-3xl font-headline font-bold mb-4">Application {hasApplied.status}</h1>
              <p className="text-muted-foreground mb-8 text-lg">
                  {hasApplied.status === 'Pending' && "Your request to join the MakeMyWear Vendor Network is currently under review by our admin team. We will contact you soon."}
                  {hasApplied.status === 'Active' && "Your account is already active! Head over to your Seller Dashboard."}
                  {hasApplied.status === 'Suspended' && "Your vendor account is suspended. Please contact support."}
              </p>
              {hasApplied.status === 'Active' && (
                  <Button size="lg" onClick={() => router.push('/seller')}>Go to Seller Dashboard</Button>
              )}
          </div>
      )
  }

  async function onSubmit(data: ApplicationFormValues) {
    if (!user) return;
    
    setIsSubmitting(true);
    const result = await submitVendorApplicationAction(data);
    setIsSubmitting(false);

    if (result.success) {
        setHasApplied({ checked: true, isVendor: true, status: 'Pending' });
        toast({
            title: "Application Submitted!",
            description: "We've received your request. We'll be in touch shortly.",
        });
        window.scrollTo(0,0);
    } else {
        toast({
            title: "Submission Failed",
            description: result.message,
            variant: "destructive"
        });
    }
  }

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="bg-muted py-16 md:py-24">
        <div className="container px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight mb-6">
            Join the MakeMyWear <span className="text-primary">Hyperlocal Network</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Are you a print shop, embroiderer, or tailor? Connect your machines to our marketplace and receive direct, ready-to-produce AI customization orders in your pincode. Free to join. Zero inventory risk.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="container px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-none shadow-none bg-secondary/50">
            <CardHeader>
              <Truck className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Hyperlocal Routing</CardTitle>
            </CardHeader>
            <CardContent>
              Receive orders exclusively from customers in your geographical zone to minimize shipping times and costs.
            </CardContent>
          </Card>
          <Card className="border-none shadow-none bg-secondary/50">
            <CardHeader>
              <Factory className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Ready-to-Print Files</CardTitle>
            </CardHeader>
            <CardContent>
              No design haggling. You receive 300DPI upscaled artwork instantly via your portal. Just download and print.
            </CardContent>
          </Card>
          <Card className="border-none shadow-none bg-secondary/50">
            <CardHeader>
              <IndianRupee className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Automatic Payouts</CardTitle>
            </CardHeader>
            <CardContent>
              Payments are held securely and released directly to your bank account via Stripe/Razorpay the moment the package ships.
            </CardContent>
          </Card>
        </div>

        <Separator className="my-16" />

        {/* Application Form */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold font-headline mb-2">Partner Application</h2>
            <p className="text-muted-foreground">Fill out the details below to join the waitlist.</p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  
                  {/* Shop Details */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold border-b pb-2">1. Business Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="storeName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Registered Shop/Business Name <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="T-Shirt Kingdom" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="contactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mobile Number <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="9876543210" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                        control={form.control}
                        name="contactEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Email</FormLabel>
                            <FormControl>
                              <Input type="email" readOnly {...field} className="bg-muted cursor-not-allowed"/>
                            </FormControl>
                             <FormDescription>Linked to your current login.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tell us about your setup <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="We have 2 DTF printers and have been operating in Mumbai for 5 years..." 
                              className="resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Capabilities */}
                  <div className="space-y-4 pt-4">
                    <h3 className="text-xl font-semibold border-b pb-2">2. Service Capabilities</h3>
                    <p className="text-sm text-muted-foreground mb-4">What exact manufacturing processes can you fulfill? (Select all that apply)</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="capabilities.dtfPrinting"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>DTF / Sublimation</FormLabel>
                                    <FormDescription className="text-xs">Direct to Film or Ink printing</FormDescription>
                                </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="capabilities.embroidery"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Embroidery</FormLabel>
                                    <FormDescription className="text-xs">Thread artwork machines</FormDescription>
                                </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="capabilities.cutAndSew"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Cut & Sew / SYOG</FormLabel>
                                    <FormDescription className="text-xs">Can handle upcycling</FormDescription>
                                </div>
                                </FormItem>
                            )}
                        />
                    </div>
                    {form.formState.errors.capabilities?.root && (
                         <p className="text-sm font-medium text-destructive mt-1">{form.formState.errors.capabilities.root.message}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="space-y-4 pt-4">
                    <h3 className="text-xl font-semibold border-b pb-2">3. Operating Address</h3>
                    <p className="text-sm text-muted-foreground">This is used for Hyperlocal Order Routing matching.</p>
                    <FormField
                      control={form.control}
                      name="address.line1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl><Input placeholder="Shop No. 12, Main Bazar" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="address.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl><Input placeholder="Mumbai" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address.state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl><Input placeholder="MH" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address.pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>PIN Code</FormLabel>
                            <FormControl><Input placeholder="400001" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Payouts */}
                  <div className="space-y-4 pt-4">
                    <h3 className="text-xl font-semibold border-b pb-2">4. Payout Information</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="payoutSettings.bankName" render={({ field }) => (
                        <FormItem><FormLabel>Bank Name</FormLabel><FormControl><Input placeholder="HDFC Bank" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                       <FormField control={form.control} name="payoutSettings.accountName" render={({ field }) => (
                        <FormItem><FormLabel>Account Holder Name</FormLabel><FormControl><Input placeholder="T-Shirt Kingdom Pvt Ltd" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                       <FormField control={form.control} name="payoutSettings.accountNumber" render={({ field }) => (
                        <FormItem><FormLabel>Account Number</FormLabel><FormControl><Input placeholder="502000213XXX" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                       <FormField control={form.control} name="payoutSettings.ifscCode" render={({ field }) => (
                        <FormItem><FormLabel>IFSC Code</FormLabel><FormControl><Input placeholder="HDFC000123" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full text-lg mt-8" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting Application...</> : 'Submit Application'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
