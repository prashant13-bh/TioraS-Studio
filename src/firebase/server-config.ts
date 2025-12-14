
// This file is intentionally left blank for now to prevent server-side Firebase Admin SDK initialization issues.
// A stable backend integration will be re-introduced according to the plan in `docs/backend-integration-plan.md`.

export function getFirebaseAdmin() {
  throw new Error(
    'Firebase Admin SDK is not configured. This is intentional to ensure app stability. See docs/backend-integration-plan.md'
  );
}
