'use client';
import {createContext, useContext} from 'react';
import {FirebaseApp} from 'firebase/app';
import {Auth} from 'firebase/auth';
import {Firestore} from 'firebase/firestore';

export interface FirebaseContextValue {
  firebaseApp: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

export const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const useAuth = () => {
  const {auth} = useFirebase();
  if (!auth) {
    throw new Error('Auth is not available');
  }
  return {auth};
};

export const useFirestore = () => {
  const {firestore} = useFirebase();
  if (!firestore) {
    throw new Error('Firestore is not available');
  }
  return {firestore};
};

export const FirebaseProvider = ({
  children,
  firebaseApp,
  auth,
  firestore,
}: {
  children: React.ReactNode;
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}) => {
  return (
    <FirebaseContext.Provider value={{firebaseApp, auth, firestore}}>
      {children}
    </FirebaseContext.Provider>
  );
};
