// Server-side Firebase initialization for server actions
// This file does NOT have 'use client' so it can be used in server actions

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

let firebaseApp: FirebaseApp | null = null;
let db: Firestore | null = null;

export function getServerFirestore(): Firestore {
  if (!firebaseApp) {
    if (getApps().length > 0) {
      firebaseApp = getApp();
    } else {
      firebaseApp = initializeApp(firebaseConfig);
    }
  }
  
  if (!db) {
    db = getFirestore(firebaseApp);
  }
  
  return db;
}
