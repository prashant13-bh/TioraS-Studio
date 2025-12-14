'use client';

import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { firebaseConfig } from './config';

export * from './provider';

let firebaseApp: FirebaseApp;

export function initializeFirebase() {
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApp();
  }
  return firebaseApp;
}

// It's better to get instances when needed rather than exporting them directly
// to ensure they are accessed after initialization.

// Re-export the hooks and providers
export { FirebaseProvider, useAuth, useFirestore, useFirebase } from './provider';
export { FirebaseClientProvider } from './client-provider';
