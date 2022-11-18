
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  //adminbase
  // apiKey: "AIzaSyD274fpIFZ8Yp6TqDPQ85ilJtG6LufhvsQ",
  // authDomain: "adminbase-cca7d.firebaseapp.com",
  // projectId: "adminbase-cca7d",
  // storageBucket: "adminbase-cca7d.appspot.com",
  // messagingSenderId: "886433379716",
  // appId: "1:886433379716:web:381148379ecfceb87f59d1"
  
  //auth-movie-dev
  apiKey: "AIzaSyANX1r1VOw8G2YhGOe88XRwrg3Leq0RMQM",
  authDomain: "auth-movie-dev.firebaseapp.com",
  projectId: "auth-movie-dev",
  storageBucket: "auth-movie-dev.appspot.com",
  messagingSenderId: "351481381109",
  appId: "1:351481381109:web:9b625712138c23047a05bc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const storage = getStorage(app);