
'use client';

import {useEffect, useState} from 'react';
import {onAuthStateChanged, User} from 'firebase/auth';
import {useAuth as useFirebaseAuth} from '@/firebase/provider';
import { createSession, removeSession } from '@/app/actions/auth-actions';

export const useUser = () => {
  const {auth, isLoading: isAuthLoading} = useFirebaseAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If the auth service itself is loading, we are transitively loading.
    if (isAuthLoading) {
      setLoading(true);
      return;
    }
    
    if (!auth) {
      setUser(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      if (user) {
        const token = await user.getIdToken();
        await createSession(token);
      } else {
        await removeSession();
      }
    });

    return () => unsubscribe();
  }, [auth, isAuthLoading]);

  return {user, loading};
};
