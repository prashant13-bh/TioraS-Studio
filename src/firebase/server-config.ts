
import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App;
let firestore: Firestore;

// This function ensures a single instance of the Firebase Admin SDK is initialized and reused.
function getInitializedAdminApp() {
  if (!getApps().length) {
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
      firestore = getFirestore(adminApp);
    } catch (e) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT or initialize Firebase Admin SDK.", e);
      throw new Error("Firebase Admin SDK initialization failed.");
    }

  } else {
    adminApp = getApps()[0];
    firestore = getFirestore(adminApp);
  }
  return { adminApp, firestore };
}

// Main export that provides the initialized firestore instance.
export function getFirebaseAdmin() {
  const { firestore } = getInitializedAdminApp();
  return { firestore };
}
