
import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseConfig } from './config';

let adminApp: App;

if (!getApps().length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    adminApp = initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    // This fallback is for environments like Google Cloud Run where credentials are auto-discovered.
    // It's less reliable for local development without specific setup.
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
