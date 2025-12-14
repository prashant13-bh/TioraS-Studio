
'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener'

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
}

// Combined state for the Firebase context
export interface FirebaseContextState {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  isLoading: boolean; // True if any service is not yet available.
}

/**
 * FirebaseProvider manages and provides Firebase services.
 */
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  
  const isLoading = !firebaseApp || !firestore || !auth;

  const contextValue = useMemo((): FirebaseContextState => {
    return {
      firebaseApp,
      firestore,
      auth,
      isLoading,
    };
  }, [firebaseApp, firestore, auth, isLoading]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

const useFirebaseContext = () => {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
        throw new Error('useFirebaseContext must be used within a FirebaseProvider.');
    }
    return context;
}

/** Hook to access Firebase Auth instance and its loading state. */
export const useAuth = (): { auth: Auth | null; isLoading: boolean } => {
  const { auth, isLoading } = useFirebaseContext();
  return { auth, isLoading };
};

/** Hook to access Firestore instance. */
export const useFirestore = (): { firestore: Firestore | null, isLoading: boolean} => {
  const { firestore, isLoading } = useFirebaseContext();
  return { firestore, isLoading };
};

/** Hook to access Firebase App instance. */
export const useFirebaseApp = (): { firebaseApp: FirebaseApp | null, isLoading: boolean } => {
  const { firebaseApp, isLoading } = useFirebaseContext();
  return { firebaseApp, isLoading };
};

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  
  return memoized;
}

// Keeping the old useUser hook as it's used in many places and relies on a different logic
export const useUser = () => {
    const { auth, isLoading: isAuthLoading } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthLoading) {
            setLoading(true);
            return;
        }

        if (!auth) {
            setUser(null);
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth, isAuthLoading]);

    return { user, loading };
};
