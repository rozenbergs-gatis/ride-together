import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseAuth } from '../firebase/firebaseConfig';
import { addUserToDb } from './userController';

export async function authenticate(email, password) {
  return signInWithEmailAndPassword(firebaseAuth, email, password);
}

export async function register(email, password) {
  const user = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  await addUserToDb(user.user);
}

export async function logout() {
  await signOut(firebaseAuth);
}

export async function userExists() {
  await onAuthStateChanged(firebaseAuth, (user) => !!user);
  return firebaseAuth.currentUser;
}

export async function getCurrentUser() {
  const userFound = await userExists();
  if (userFound) {
    const token = await firebaseAuth.currentUser.getIdToken();
    const currentToken = await AsyncStorage.getItem('token');
    if (currentToken !== token) {
      await AsyncStorage.setItem('token', token);
    }
    return firebaseAuth.currentUser;
  }

  console.log('User does not exist...');
  return false;
}
