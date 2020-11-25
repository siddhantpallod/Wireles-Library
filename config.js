import firebase from 'firebase'
require('@firebase/firestore')

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCfFWKhTn0Obae7dfp0jrjZfeNT_0DiuGE",
  authDomain: "wireless-library-f781d.firebaseapp.com",
  databaseURL: "https://wireless-library-f781d.firebaseio.com",
  projectId: "wireless-library-f781d",
  storageBucket: "wireless-library-f781d.appspot.com",
  messagingSenderId: "549092849288",
  appId: "1:549092849288:web:14e75758f854cecf69113d"
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();

export default db;