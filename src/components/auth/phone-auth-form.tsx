
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
    grecaptcha?: any;
  }
}

interface PhoneAuthFormProps {
  onVerify: (user: any) => void;
}

export function PhoneAuthForm({ onVerify }: PhoneAuthFormProps) {
  const { auth } = useAuth();
  const { toast } = useToast();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!auth || window.recaptchaVerifier) return;
    
    // Ensure the container exists before creating the verifier
    if (recaptchaContainerRef.current) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
            'size': 'invisible',
            'callback': (response: any) => {
              // reCAPTCHA solved, allow signInWithPhoneNumber.
              // This callback is sometimes needed for auto-verification.
            }
        });
        window.recaptchaVerifier.render();
    }
  }, [auth]);

  const handleSendOtp = async () => {
    if (!auth) {
        toast({ title: "Error", description: "Auth service not ready.", variant: "destructive"});
        return;
    }
    if (!window.recaptchaVerifier) {
        toast({ title: "Error", description: "reCAPTCHA not ready. Please refresh and try again.", variant: "destructive"});
        return;
    }

    setIsSendingOtp(true);
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, `+${phone}`, window.recaptchaVerifier);
      window.confirmationResult = confirmationResult;
      setOtpSent(true);
      toast({ title: 'OTP Sent', description: 'An OTP has been sent to your phone.' });
    } catch (error: any) {
      console.error("Error sending OTP", error);
      toast({ title: 'Error', description: `Failed to send OTP: ${error.message}`, variant: 'destructive' });
      // Only reset if grecaptcha is available on window
      if (window.grecaptcha && typeof window.grecaptcha.reset === 'function' && window.recaptchaVerifier) {
          window.grecaptcha.reset(window.recaptchaVerifier.widgetId);
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
     if (!window.confirmationResult) {
        toast({ title: "Error", description: "Please send OTP first.", variant: "destructive"});
        return;
    }
    setIsVerifyingOtp(true);
    try {
      const result = await window.confirmationResult.confirm(otp);
      toast({ title: 'Success', description: 'You have been signed in.' });
      onVerify(result.user);
    } catch (error: any) {
      toast({ title: 'Verification Failed', description: error.message, variant: 'destructive' });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div className="space-y-4 pt-4">
      <div ref={recaptchaContainerRef}></div>
      {!otpSent ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (with country code)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="919876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <Button className="w-full" onClick={handleSendOtp} disabled={isSendingOtp}>
            {isSendingOtp && <Loader2 className="mr-2 size-4 animate-spin" />}
            Send OTP
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Enter OTP</Label>
            <Input
              id="otp"
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <Button className="w-full" onClick={handleVerifyOtp} disabled={isVerifyingOtp}>
            {isVerifyingOtp && <Loader2 className="mr-2 size-4 animate-spin" />}
            Verify OTP & Sign In
          </Button>
           <Button variant="link" size="sm" onClick={() => setOtpSent(false)}>Back to phone number</Button>
        </div>
      )}
    </div>
  );
}
