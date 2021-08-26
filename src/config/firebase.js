import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyB1hCZSqA32mulc6VYbV3BKILwskAoQdAI",
  authDomain: "reels-3c4eb.firebaseapp.com",
  projectId: "reels-3c4eb",
  storageBucket: "reels-3c4eb.appspot.com",
  messagingSenderId: "869265952214",
  appId: "1:869265952214:web:5e5b95497b0ae4d49aa877"
};

let firebaseApp = firebase.initializeApp(firebaseConfig);
let firebaseAuth = firebaseApp.auth();
let firebaseStorage = firebaseApp.storage();
let firebaseDB = firebaseApp.firestore();
let timestamp = firebase.firestore.FieldValue.serverTimestamp;

export {firebaseAuth, firebaseStorage, firebaseDB, timestamp};