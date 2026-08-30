/**
 * Firebase Service for EduAscent
 * Provides authentication with Google and Firestore cloud data persistence.
 */

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  getDocFromServer,
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App & Services
const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

// Operation Types for hardened error tracing
export const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write'
};

/**
 * Validates connection to Firestore on initial boot
 */
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firestore connection verified successfully.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

/**
 * Standard error handler conforming to FirestoreErrorInfo
 */
export function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Sign in using Google Auth Popup
 */
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

/**
 * Sign out current authenticated user
 */
export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

/**
 * Listen for Firebase authentication state changes
 */
export function onAuthUserChanged(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Load student cloud document and subcollections
 */
export async function fetchStudentCloudData(userId) {
  const userPath = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      return null;
    }

    const userData = userSnap.data();

    // Fetch Class Records subcollection
    const classRecordsPath = `users/${userId}/classRecords`;
    const classSnap = await getDocs(collection(db, 'users', userId, 'classRecords'));
    const classRecords = {};
    classSnap.forEach(docSnap => {
      const data = docSnap.data();
      classRecords[data.classLevel] = {
        unlocked: data.unlocked,
        completed: data.completed,
        solved: data.solved,
        correct: data.correct,
        testsTaken: data.testsTaken,
        testAvg: data.testAvg
      };
    });

    // Fetch Test Logs subcollection
    const logsPath = `users/${userId}/testLogs`;
    const logsSnap = await getDocs(collection(db, 'users', userId, 'testLogs'));
    const testLogs = [];
    logsSnap.forEach(docSnap => {
      const data = docSnap.data();
      testLogs.push({
        id: data.id,
        date: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString() : new Date().toLocaleDateString(),
        classLevel: data.classLevel,
        subjectId: data.subjectId,
        score: data.score,
        percent: data.percent,
        passed: data.passed
      });
    });

    return {
      profile: {
        name: userData.displayName || 'Student',
        email: userData.email || '',
        photoURL: userData.photoURL || '',
        currentClass: userData.currentClass || 7,
        viewingClass: userData.viewingClass || 7,
        streakDays: userData.streakDays || 1,
        lastActiveDate: userData.lastActiveDate || new Date().toISOString().split('T')[0],
        academicYear: '2026–2027'
      },
      classRecords,
      testLogs
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, userPath);
  }
}

/**
 * Initialize a new user profile in Firestore with initial state
 */
export async function initStudentCloudProfile(user, localState) {
  const userPath = `users/${user.uid}`;
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const userPayload = {
      userId: user.uid,
      email: (user.email || 'student@school.edu').substring(0, 256),
      displayName: (user.displayName || localState.profile.name || 'Student').substring(0, 128),
      photoURL: (user.photoURL || '').substring(0, 512),
      currentClass: Number(localState.profile.currentClass) || 7,
      viewingClass: Number(localState.profile.viewingClass) || 7,
      streakDays: Number(localState.profile.streakDays) || 1,
      lastActiveDate: localState.profile.lastActiveDate || new Date().toISOString().split('T')[0],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(userDocRef, userPayload);

    // Initialize all 6 class records
    for (let c = 7; c <= 12; c++) {
      const rec = localState.classRecords[c] || {
        unlocked: c === 7,
        completed: false,
        solved: 0,
        correct: 0,
        testsTaken: 0,
        testAvg: 0
      };
      await saveClassRecordToCloud(user.uid, c, rec);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, userPath);
  }
}

/**
 * Sync user profile mutations to Firestore
 */
export async function syncUserProfileToCloud(userId, profile) {
  const userPath = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      displayName: (profile.name || 'Student').substring(0, 128),
      photoURL: (profile.photoURL || '').substring(0, 512),
      currentClass: Number(profile.currentClass),
      viewingClass: Number(profile.viewingClass),
      streakDays: Number(profile.streakDays),
      lastActiveDate: String(profile.lastActiveDate).substring(0, 32),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, userPath);
  }
}

/**
 * Save or update a single class record in Firestore
 */
export async function saveClassRecordToCloud(userId, classLevel, rec) {
  const classId = `class_${classLevel}`;
  const path = `users/${userId}/classRecords/${classId}`;
  try {
    const classDocRef = doc(db, 'users', userId, 'classRecords', classId);
    const existingSnap = await getDoc(classDocRef);

    const payload = {
      classId: classId,
      classLevel: Number(classLevel),
      unlocked: Boolean(rec.unlocked),
      completed: Boolean(rec.completed),
      solved: Number(rec.solved) || 0,
      correct: Number(rec.correct) || 0,
      testsTaken: Number(rec.testsTaken) || 0,
      testAvg: Math.min(100, Math.max(0, Number(rec.testAvg) || 0)),
      updatedAt: serverTimestamp()
    };

    if (existingSnap.exists()) {
      await updateDoc(classDocRef, {
        unlocked: payload.unlocked,
        completed: payload.completed,
        solved: payload.solved,
        correct: payload.correct,
        testsTaken: payload.testsTaken,
        testAvg: payload.testAvg,
        updatedAt: serverTimestamp()
      });
    } else {
      await setDoc(classDocRef, payload);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Save a newly completed test assessment record to Firestore
 */
export async function saveTestLogToCloud(userId, logData) {
  const logId = `test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const path = `users/${userId}/testLogs/${logId}`;
  try {
    const logDocRef = doc(db, 'users', userId, 'testLogs', logId);
    const payload = {
      id: logId,
      userId: userId,
      classLevel: Number(logData.classLevel),
      subjectId: String(logData.subjectId).substring(0, 64),
      score: Math.min(10, Math.max(0, Number(logData.score))),
      percent: Math.min(100, Math.max(0, Number(logData.percent))),
      passed: Boolean(logData.passed),
      createdAt: serverTimestamp()
    };
    await setDoc(logDocRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Reset all student records in cloud
 */
export async function resetStudentCloudData(userId) {
  const path = `users/${userId}`;
  try {
    // Delete test logs
    const logsSnap = await getDocs(collection(db, 'users', userId, 'testLogs'));
    for (const d of logsSnap.docs) {
      await deleteDoc(d.ref);
    }

    // Reset class records
    for (let c = 7; c <= 12; c++) {
      const classDocRef = doc(db, 'users', userId, 'classRecords', `class_${c}`);
      await updateDoc(classDocRef, {
        unlocked: c === 7,
        completed: false,
        solved: 0,
        correct: 0,
        testsTaken: 0,
        testAvg: 0,
        updatedAt: serverTimestamp()
      });
    }

    // Reset user doc
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      currentClass: 7,
      viewingClass: 7,
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
