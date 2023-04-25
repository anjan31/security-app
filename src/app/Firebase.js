// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUNejJN8icuARb_lLmzFgIIO2w-V8oG54",
  authDomain: "home-security-1aa3a.firebaseapp.com",
  projectId: "home-security-1aa3a",
  storageBucket: "home-security-1aa3a.appspot.com",
  messagingSenderId: "71304979850",
  appId: "1:71304979850:web:3b6db4be0bf0225e22d473",
  measurementId: "G-ME9DPTPS9M"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

const storage = firebase.storage(); 
export {auth,storage};
export default db;

