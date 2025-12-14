
'use client';

import {useEffect, useState} from 'react';
import {onAuthStateChanged, User} from 'firebase/auth';
import {useAuth as useFirebaseAuth} from '@/firebase/provider';

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

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, isAuthLoading]);

  return {user, loading};
};
