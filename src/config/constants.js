import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyB6RWvCCJRxajAoD3UT8d0p1mHxKeJgPnc",
    authDomain: "bubenchiki-9e183.firebaseapp.com",
    databaseURL: "https://bubenchiki-9e183.firebaseio.com",
};

firebase.initializeApp(config);

export const ref = firebase.database().ref();
export const firebaseAuth = firebase.auth;
