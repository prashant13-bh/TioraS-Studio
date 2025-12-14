
import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App;
let firestore: Firestore;

if (getApps().length === 0) {
  const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountEnv) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT environment variable is not set. Cannot initialize Firebase Admin SDK.'
    );
  }
  
  try {
    const serviceAccount = JSON.parse(serviceAccountEnv);
    adminApp = initializeApp({
      credential: cert(serviceAccount),
    });
  } catch (e) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT or initialize Firebase Admin SDK.", e);
    throw new Error("Firebase Admin SDK initialization failed.");
  }
} else {
  adminApp = getApps()[0];
}

firestore = getFirestore(adminApp);

export function getFirebaseAdmin() {
  return { firestore };
}
