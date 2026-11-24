import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebase';

function toAppUser(user) {
  return {
    id: user.uid,
    name: user.displayName ?? '',
    email: user.email,
  };
}

export async function logIn(email, password) {
  const { user } = await signInWithEmailAndPassword(auth, email.trim(), password);
  return toAppUser(user);
}

export async function register({ name, email, password }) {
  const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password);
  await updateProfile(user, { displayName: name.trim() });
  return toAppUser(user);
}

export async function sendPasswordReset(email) {
  await sendPasswordResetEmail(auth, email.trim());
}