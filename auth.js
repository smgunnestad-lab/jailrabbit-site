/*====== FIREBASE INIT & AUTH LOGIC ======*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Dine Firebase-nøkler
const firebaseConfig = {
  apiKey: "AIzaSyA78X3VQmbKB-3jnsbwo44k_3rmiOzLMIw",
  authDomain: "jailrabbit-backend.firebaseapp.com",
  projectId: "jailrabbit-backend",
  storageBucket: "jailrabbit-backend.firebasestorage.app",
  messagingSenderId: "746247741693",
  appId: "1:746247741693:web:58f5f48f77b18970481e94"
};

// Start Firebase (MÅ skje før vi ber om innlogging)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Funksjoner vi kan bruke på andre sider
export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);
export const checkAuthState = (callback) => onAuthStateChanged(auth, callback);
export { db, auth };