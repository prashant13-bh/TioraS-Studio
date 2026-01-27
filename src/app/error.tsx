'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error);
  }, [error]);

  const isFirebaseError = error.message.includes('Firebase') || 
                          error.message.includes('environment variables');

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Something went wrong!</h1>
          <p className="text-muted-foreground">
            {isFirebaseError 
              ? 'There was an issue connecting to our services.'
              : 'An unexpected error occurred while loading the application.'}
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-left">
            <p className="mb-2 font-semibold text-destructive">Error Details (Development Only):</p>
            <pre className="overflow-auto text-xs text-destructive">
              {error.message}
            </pre>
            {error.digest && (
              <p className="mt-2 text-xs text-muted-foreground">
                Error Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {isFirebaseError && process.env.NODE_ENV === 'production' && (
          <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4 text-left">
            <p className="mb-2 font-semibold text-yellow-600 dark:text-yellow-500">
              Configuration Issue Detected
            </p>
            <p className="text-sm text-muted-foreground">
              This application requires Firebase configuration. If you're the site administrator,
              please ensure all Firebase environment variables are properly configured in your
              deployment settings.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button
            onClick={reset}
            variant="default"
          >
            Try again
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
          >
            Go to homepage
          </Button>
        </div>
      </div>
    </div>
  );
}
