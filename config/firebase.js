import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";
// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCHykgCilZ1Tr7aw1wZ_Fd6x4SjlnFC_58",
    authDomain: "messenge-app-cc4be.firebaseapp.com",
    projectId: "messenge-app-cc4be",
    storageBucket: "messenge-app-cc4be.appspot.com",
    messagingSenderId: "749834508639",
    appId: "1:749834508639:web:d29916ffba06f02d0e7eea",
    measurementId: "G-6SNWSJBPXV"

  //   @deprecated is deprecated Constants.manifest
};
// initialize firebase
initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore();
