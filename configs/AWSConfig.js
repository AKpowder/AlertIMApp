// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1iIr-8e4RHjLoSYgwq2VdlnFvv40gh1Q",
  authDomain: "alertim-82818.firebaseapp.com",
  projectId: "alertim-82818",
  storageBucket: "alertim-82818.appspot.com",
  messagingSenderId: "285467266936",
  appId: "1:285467266936:web:185213e4dcf7b095d4828d",
  measurementId: "G-FBYB3KHK0E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(app);

export { firestore };