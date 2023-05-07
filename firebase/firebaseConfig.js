import { initializeApp, getApps } from 'firebase/app';
// import { getAnalytics } from "firebase/analytics";
import { initializeAuth } from "firebase/auth"
import { getReactNativePersistence } from "firebase/auth/react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getAuth } from 'firebase/auth';
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCMz6Rq7iNYZav8dCIywq0gmrgPGOOy7c0",
    authDomain: "ride-together-f8d4e.firebaseapp.com",
    databaseURL: "https://ride-together-f8d4e-default-rtdb.firebaseio.com",
    projectId: "ride-together-f8d4e",
    storageBucket: "ride-together-f8d4e.appspot.com",
    messagingSenderId: "225362941844",
    appId: "1:225362941844:web:6813fb77afd5c91b83e181",
    measurementId: "G-TPXMR5N7CZ"
};

if (getApps().length === 0) {
    const defaultApp = initializeApp(firebaseConfig);
    initializeAuth(defaultApp, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
}
// export const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app);
export const firebaseAuth = getAuth();
export const database = getDatabase();
export const storage = getStorage();
// export const database = getDatabase(defaultApp);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
