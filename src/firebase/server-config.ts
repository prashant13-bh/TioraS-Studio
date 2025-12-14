
import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseConfig } from './config';

let adminApp: App;

if (getApps().length === 0) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    adminApp = initializeApp({ credential: cert(serviceAccount) });
  } else {
    // This is a fallback for environments where the service account isn't set,
    // but the app might be running in a Google Cloud environment where credentials
    // are automatically discovered.
    adminApp = initializeApp({
       projectId: firebaseConfig.projectId,
    });
  }
} else {
  adminApp = getApps()[0];
}


export function getFirebaseAdmin() {
    return {
        firestore: getFirestore(adminApp),
    };
}
