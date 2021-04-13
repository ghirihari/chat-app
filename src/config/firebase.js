import Firebase from 'firebase';
import "firebase/auth";
// import * as admin from 'firebase-admin';

var firebaseConfig = {
    apiKey: "AIzaSyDqtvna4fTwx3IU3aLAXu5JlY6_aSz_0Ds",
    authDomain: "mc-chat-2e403.firebaseapp.com",
    databaseURL: "https://mc-chat-2e403-default-rtdb.firebaseio.com",
    projectId: "mc-chat-2e403",
    storageBucket: "mc-chat-2e403.appspot.com",
    messagingSenderId: "579190295032",
    appId: "1:579190295032:web:08736623bdb7e0776cae0d"
  };

const fire = Firebase.initializeApp(firebaseConfig);
export default fire;

// var serviceAccount = require("path/to/serviceAccountKey.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://mc-chat-2e403-default-rtdb.firebaseio.com"
// });
// admin.initializeApp();
// const db = admin.firestore();
// export {db};

