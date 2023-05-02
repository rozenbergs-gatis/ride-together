import { firebaseAuth } from '../firebase/firebaseConfig';
import {
    onAuthStateChanged,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from 'firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function authenticate(email, password) {
    return signInWithEmailAndPassword(firebaseAuth, email, password)
}

export async function register(email, password) {
    await createUserWithEmailAndPassword(firebaseAuth, email, password);
}

export async function logout() {
    await signOut(firebaseAuth);
}

export async function userExists() {
    await onAuthStateChanged(firebaseAuth, user => {
        return !!user;
    })
    return firebaseAuth.currentUser;
}

export async function getCurrentUser() {
    const userFound = await userExists()
    if (userFound) {
        const token = await firebaseAuth.currentUser.getIdToken();
        const currentToken = await AsyncStorage.getItem('token');
        if (currentToken !== token) {
            await AsyncStorage.setItem('token', token);
        }
    }
    else {
        console.log('User does not exist...');
    }
}