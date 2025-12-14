
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
function initializeAdminApp() {
    // Check if the app is already initialized
  if (getApps().length > 0) {
    adminApp = getApps()[0];
    return;
  }
  
  // When running in a Google Cloud environment (like Cloud Run),
  // the SDK can often auto-discover credentials.
  // For local development, you'd set GOOGLE_APPLICATION_CREDENTIALS.
  try {
      // First, try to initialize with default credentials. This works in many cloud environments.
      adminApp = initializeApp();
  } catch(e) {
      console.warn("Could not initialize Firebase Admin SDK with default credentials. This is expected in local development. Falling back to service account object if available.");
      // If default fails, try to use the service account from environment variables.
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        adminApp = initializeApp({
          credential: cert(serviceAccount),
        });
      } else {
        console.error("Firebase Admin SDK initialization failed. No default credentials found and FIREBASE_SERVICE_ACCOUNT env var is not set.");
        // Fallback to a basic init with just projectId if nothing else works, though this may have limited permissions.
         adminApp = initializeApp({
            projectId: firebaseConfig.projectId,
         });
      }
  }
}

// Initialize the app when this module is first loaded
initializeAdminApp();

export function getFirebaseAdmin() {
    return {
        firestore: getFirestore(adminApp),
    };
}
