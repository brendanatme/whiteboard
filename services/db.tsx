// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.GATSBY_API_KEY,
  authDomain: 'whiteboard-proto.firebaseapp.com',
  databaseURL: 'https://whiteboard-proto-default-rtdb.firebaseio.com',
  projectId: 'whiteboard-proto',
  storageBucket: 'whiteboard-proto.appspot.com',
  messagingSenderId: '450404446343',
  appId: process.env.GATSBY_APP_ID,
  measurementId: 'G-ZRVMNCYMSZ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);