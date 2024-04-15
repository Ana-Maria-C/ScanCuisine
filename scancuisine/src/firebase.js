// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD28R73_GJe4pMOe7wbVgQLX1NiLAAPwOI",
  authDomain: "scan-cuisine-f4b13.firebaseapp.com",
  projectId: "scan-cuisine-f4b13",
  storageBucket: "scan-cuisine-f4b13.appspot.com",
  messagingSenderId: "458939864048",
  appId: "1:458939864048:web:4c51916b1b8c85967a8335",
  measurementId: "G-62VYS9VWES",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);
