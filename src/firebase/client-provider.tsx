'use client';

import {useEffect, useState} from 'react';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {FirebaseProvider} from './provider';
import {initializeFirebase} from '.';

export function FirebaseClientProvider({children}: {children: React.ReactNode}) {
  const [firebaseApp, setFirebaseApp] = useState<any>(null);

  useEffect(() => {
    const app = initializeFirebase();
    setFirebaseApp(app);
  }, []);

  if (!firebaseApp) {
    return null; // or a loading spinner
  }
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);

  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      auth={auth}
      firestore={firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
