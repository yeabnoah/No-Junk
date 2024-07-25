// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRK_xTEoJnwqu9W05HFOrio9WvkgrHV8o",
  authDomain: "tatari-7e56a.firebaseapp.com",
  projectId: "tatari-7e56a",
  storageBucket: "tatari-7e56a.appspot.com",
  messagingSenderId: "849400855564",
  appId: "1:849400855564:web:6a97848dd4cc8bd7404229",
  measurementId: "G-M53NRZH36T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);
