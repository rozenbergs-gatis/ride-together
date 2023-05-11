import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  deleteUser,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseAuth } from '../firebase/firebaseConfig';
import { addUsername, addUserToDb, updateUsername } from './userController';

export async function authenticate(email, password) {
  return signInWithEmailAndPassword(firebaseAuth, email, password);
}

export async function register(email, password, username) {
  const user = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  try {
    await addUsername(username, user.user.uid);
  } catch (error) {
    await deleteUser(user.user);
    const newError = new Error('Username already exists!');
    newError.code = 'username-already-in-use';
    throw newError;
  }
  await updateUsername(user.user, username);
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
