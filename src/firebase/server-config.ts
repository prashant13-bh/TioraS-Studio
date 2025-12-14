
import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let adminApp: App;

if (!getApps().length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    adminApp = initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    // This fallback is for environments like Google Cloud Run where credentials are auto-discovered.
    // It is less reliable for local development without specific setup. For local dev,
    // ensure FIREBASE_SERVICE_ACCOUNT is set.
    adminApp = initializeApp();
  }
} else {
  adminApp = getApps()[0];
}

export function getFirebaseAdmin() {
    return {
        firestore: getFirestore(adminApp),
    };
}
