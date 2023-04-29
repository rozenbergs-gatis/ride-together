import { firebaseAuth } from '../firebase/firebaseConfig';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export async function authenticate(email, password) {
    await signInWithEmailAndPassword(firebaseAuth, email, password);
}

export async function register(email, password) {
    await createUserWithEmailAndPassword(firebaseAuth, email, password);
}