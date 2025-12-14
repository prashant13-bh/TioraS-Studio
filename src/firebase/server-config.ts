
import admin from 'firebase-admin';

// This object holds the initialized Firebase Admin app instance.
let app: admin.app.App;

/**
 * A singleton pattern for initializing and retrieving the Firebase Admin SDK.
 * This ensures the SDK is initialized only once per server instance.
 *
 * It relies on the `FIREBASE_SERVICE_ACCOUNT` environment variable being set
 * with the JSON credentials for the service account.
 */
function initializeFirebaseAdmin() {
  if (!admin.apps.length) {
    try {
      // The `credential` is automatically created from the environment variable.
      app = admin.initializeApp();
    } catch (error) {
      console.error('Firebase Admin SDK initialization failed:', error);
      // We throw the error to make it clear that the server cannot function
      // without a proper Firebase Admin connection.
      throw new Error('Could not initialize Firebase Admin SDK. Is FIREBASE_SERVICE_ACCOUNT set?');
    }
  } else {
    // If the app is already initialized, just get the default app.
    app = admin.app();
  }
  return {
    app: app,
    firestore: app.firestore(),
    auth: app.auth(),
  };
}

// A simple getter function to access the initialized services.
export function getFirebaseAdmin() {
  // If `app` hasn't been initialized yet (e.g., first request), initialize it.
  if (!app) {
    return initializeFirebaseAdmin();
  }
  // Otherwise, return the already initialized services.
  return {
    app: app,
    firestore: app.firestore(),
    auth: app.auth(),
  };
}
