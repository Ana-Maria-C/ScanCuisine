import firebase from "firebase/compat/app";

// Import Firebase SDKs
require("https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js");
require("https://www.gstatic.com/firebasejs/9.1.2/firebase-messaging.js");

firebase.initializeApp({
  messagingSenderId: "458939864048",
});

const initMessaging = firebase.messaging();
