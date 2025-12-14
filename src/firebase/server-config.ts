
import * as admin from 'firebase-admin';

// This is a global flag to ensure we only initialize the admin app once.
let isFirebaseAdminInitialized = false;

/**
 * Initializes the Firebase Admin SDK if it hasn't been already.
 * This is a singleton pattern to prevent re-initialization errors in Next.js hot-reloading environments.
 * It safely attempts to use existing service account credentials from the environment.
 */
function initializeFirebaseAdmin() {
  if (!isFirebaseAdminInitialized) {
    try {
      // If GOOGLE_APPLICATION_CREDENTIALS is set, `admin.credential.applicationDefault()` will use it.
      // Otherwise, it might discover credentials in other ways if the environment supports it (e.g., Google Cloud).
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
      console.log('Firebase Admin SDK initialized successfully.');
      isFirebaseAdminInitialized = true;
    } catch (error: any) {
      // We check for this specific error code which means it's already initialized.
      if (error.code === 'app/duplicate-app') {
        console.warn('Firebase Admin SDK already initialized.');
        isFirebaseAdminInitialized = true;
      } else {
        console.error('Firebase Admin SDK initialization error:', error);
        // We throw the error if it's not the duplicate-app error because it's a critical failure.
        throw error;
      }
    }
  }
}

/**
 * A singleton getter for the Firebase Admin SDK instance.
 * It ensures the SDK is initialized before returning it.
 * @returns The initialized Firebase Admin SDK instance.
 */
export function getFirebaseAdmin() {
  initializeFirebaseAdmin();
  return admin;
}
