
import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseConfig } from './config';

// It's generally safe to expose the project ID, but for other sensitive details,
// especially the service account key, use environment variables.
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : {
      projectId: firebaseConfig.projectId,
      // You would typically load the full service account key from a secure environment variable
      // For this example, we'll rely on the projectId for basic server-side context
    };

let adminApp: App;

// This function initializes the Firebase Admin SDK if it hasn't been already.
async function initializeAdminApp() {
  if (!getApps().length) {
    // When running in a Google Cloud environment (like Cloud Run),
    // the SDK can often auto-discover credentials.
    // For local development, you'd set GOOGLE_APPLICATION_CREDENTIALS.
    try {
        adminApp = initializeApp();
    } catch(e) {
        console.warn("Could not initialize Firebase Admin SDK with default credentials. This is expected in local development. Falling back to service account object if available.");
         adminApp = initializeApp({
            credential: cert(serviceAccount),
         });
    }
  } else {
    adminApp = getApps()[0];
  }
}

export async function getFirebaseAdmin() {
    if (!getApps().length) {
        await initializeAdminApp();
    }
    return {
        firestore: getFirestore(adminApp),
    };
}
