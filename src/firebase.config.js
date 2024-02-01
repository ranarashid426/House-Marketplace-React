// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRRsyEvllIXEMZzZ3ssJSV_erRZ1MGSRc",
  authDomain: "house-marketplace-app-35068.firebaseapp.com",
  projectId: "house-marketplace-app-35068",
  storageBucket: "house-marketplace-app-35068.appspot.com",
  messagingSenderId: "272253638010",
  appId: "1:272253638010:web:a7dfad1469ffa678f072c3",
  measurementId: "G-Q5TP9HPEYX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);
export const db = getFirestore()