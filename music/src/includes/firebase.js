import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA0F1ipjp2pR6gDpcxyv5XxRa9CgwJSafQ",
  authDomain: "music-e6dac.firebaseapp.com",
  projectId: "music-e6dac",
  storageBucket: "music-e6dac.appspot.com",
  messagingSenderId: "957847408632",
  appId: "1:957847408632:web:264c2f5e19fbda07da500d"
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const userCollection = db.collection('users');

export { auth, db, userCollection };