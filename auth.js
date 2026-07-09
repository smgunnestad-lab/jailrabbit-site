/*====== AUTH LOGIC ======*/
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const auth = getAuth();
const provider = new GoogleAuthProvider();

export const login = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);
export const checkAuthState = (callback) => onAuthStateChanged(auth, callback);


const auth = getAuth();
const googleProvider = new GoogleAuthProvider();