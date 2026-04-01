const { initializeApp, cert } = require('firebase-admin/app');

let adminApp = null;
let adminAuth = null;

/**
 * Initialize Firebase Admin SDK for server-side operations
 * Call this once at app startup via connectFirebaseAdmin()
 */
const connectFirebaseAdmin = () => {
  if (adminApp) return { app: adminApp, auth: adminAuth };

  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    };

    if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
      console.warn('Firebase Admin credentials not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env');
      return null;
    }

    adminApp = initializeApp({
      credential: cert(serviceAccount)
    });

    const { getAuth } = require('firebase-admin/auth');
    adminAuth = getAuth(adminApp);

    console.log('Firebase Admin SDK initialized successfully');
    return { app: adminApp, auth: adminAuth };
  } catch (error) {
    console.error('Firebase Admin initialization error:', error.message);
    return null;
  }
};

/**
 * Verify a Firebase ID token
 * @param {string} idToken - The Firebase ID token to verify
 * @returns {Promise<Object>} - The decoded token with uid, email, etc.
 */
const verifyFirebaseToken = async (idToken) => {
  if (!adminAuth) {
    throw new Error('Firebase Admin not initialized');
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid Firebase token');
  }
};

/**
 * Get user by UID
 */
const getUserByUid = async (uid) => {
  if (!adminAuth) throw new Error('Firebase Admin not initialized');
  return adminAuth.getUser(uid);
};

/**
 * Get user by email
 */
const getUserByEmail = async (email) => {
  if (!adminAuth) throw new Error('Firebase Admin not initialized');
  return adminAuth.getUserByEmail(email);
};

/**
 * Sign in with email and password using Firebase Auth REST API
 * Admin SDK doesn't support password verification, so we use the REST API
 */
const signInWithPassword = async ({ email, password }) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error('Firebase API key not configured');

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error?.message || 'Authentication failed');
    error.code = data.error?.code;
    throw error;
  }

  return data;
};

/**
 * Create a new user
 */
const createUser = async ({ email, password, displayName }) => {
  if (!adminAuth) throw new Error('Firebase Admin not initialized');
  return adminAuth.createUser({ email, password, displayName });
};

module.exports = {
  connectFirebaseAdmin,
  verifyFirebaseToken,
  getUserByUid,
  getUserByEmail,
  createUser,
  signInWithPassword
};
