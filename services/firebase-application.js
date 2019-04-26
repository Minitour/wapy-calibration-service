const firebase = require('firebase');

const FirebaseApplication = firebase.initializeApp({
    apiKey: "AIzaSyAkiuPYiTDEn1x2GBwcJ5TLXbKlLiWcxL0",
    authDomain: "wapy-15dac.firebaseapp.com",
    databaseURL: "https://wapy-15dac.firebaseio.com",
    projectId: "wapy-15dac",
    storageBucket: "wapy-15dac.appspot.com",
    messagingSenderId: "417744984701"
});

module.exports = FirebaseApplication;