// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYTjrH6y-2L-1gnEE0eawxhWaf27rKj3o",
  authDomain: "inventory-management-4c3c9.firebaseapp.com",
  projectId: "inventory-management-4c3c9",
  storageBucket: "inventory-management-4c3c9.appspot.com",
  messagingSenderId: "815544816214",
  appId: "1:815544816214:web:b57793c5d4feda7d4021f7",
  measurementId: "G-7SFVTX4B7T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}
