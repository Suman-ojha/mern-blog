// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// console.log(import.meta.env.VITE_FIREBASE_API_KEY)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-3a120.firebaseapp.com",
  projectId: "mern-blog-3a120",
  storageBucket: "mern-blog-3a120.appspot.com",
  messagingSenderId: "269727408439",
  appId: "1:269727408439:web:70c12fb00ffd6de3be3ab2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);