
'use client';

import { GoogleIcon, TiorasLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Eye, EyeOff, Loader2, Mail, Phone } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PhoneAuthForm } from '@/components/auth/phone-auth-form';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { auth, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRedirect = () => {
    router.push('/dashboard');
  };

  const handleSignUp = async () => {
    if (!auth) {
      toast({
        title: 'Error',
        description: 'Authentication service is not available.',
        variant: 'destructive',
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      toast({ title: 'Success', description: 'Your account has been created.' });
      handleRedirect();
    } catch (error: any) {
      toast({
        title: 'Sign Up Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) {
      toast({
        title: 'Error',
        description: 'Authentication service is not available.',
        variant: 'destructive',
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast({ title: 'Success', description: "You've been signed in with Google." });
      handleRedirect();
    } catch (error: any) {
      toast({
        title: 'Google Sign-In Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="mb-4 inline-flex items-center justify-center gap-2">
            <TiorasLogo className="size-8 text-primary" />
            <span className="font-headline text-2xl font-bold">TioraS</span>
          </Link>
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>
            Join TioraS to start designing and shopping.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email"><Mail className="mr-2 size-4" />Email</TabsTrigger>
              <TabsTrigger value="phone"><Phone className="mr-2 size-4"/>Phone</TabsTrigger>
            </TabsList>
            <TabsContent value="email" className="space-y-4 pt-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading || isSubmitting}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading || isSubmitting}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading || isSubmitting}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                        onClick={() => setShowPassword((prev) => !prev)}
                    >
                        {showPassword ? (
                        <EyeOff className="size-4" />
                        ) : (
                        <Eye className="size-4" />
                        )}
                        <span className="sr-only">
                        {showPassword ? 'Hide password' : 'Show password'}
                        </span>
                    </Button>
                    </div>
                </div>
                <Button className="w-full" onClick={handleSignUp} disabled={isLoading || isSubmitting}>
                  {isSubmitting ? <><Loader2 className="mr-2 size-4 animate-spin"/> Signing up...</> : 'Sign Up'}
                </Button>
            </TabsContent>
             <TabsContent value="phone">
                <PhoneAuthForm onVerify={handleRedirect} />
            </TabsContent>
          </Tabs>

           <div className="relative my-4">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs uppercase text-muted-foreground">Or continue with</span>
          </div>
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading || isSubmitting}>
             {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            <GoogleIcon className="mr-2 size-5" />
            Sign Up with Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-4">
           <Button variant="outline" className="w-full" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 size-4" />
              Back to Home
            </Link>
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
}
