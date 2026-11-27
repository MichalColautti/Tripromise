import {
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebase';
import { syncUserProfile } from './friendService';

function toAppUser(user) {
  return {
    id: user.uid,
    name: user.displayName ?? '',
    email: user.email,
  };
}

async function toAppUserWithProfile(user) {
  const appUser = toAppUser(user);
  try {
    await syncUserProfile(appUser);
  } catch {
    return { ...appUser, profileSyncPending: true };
  }
  return appUser;
}

export async function logIn(email, password) {
  const { user } = await signInWithEmailAndPassword(auth, email.trim(), password);
  return toAppUserWithProfile(user);
}

export async function register({ name, email, password }) {
  const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password);
  await updateProfile(user, { displayName: name.trim() });
  return toAppUserWithProfile(user);
}

export async function logOut() {
  await signOut(auth);
}

export async function sendPasswordReset(email) {
  await sendPasswordResetEmail(auth, email.trim());
}
