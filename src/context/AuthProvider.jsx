import React, { useState, useEffect } from 'react';
import { firebaseAuth, firebaseDB } from '../config/firebase';

export const AuthContext = React.createContext();

export function AuthProvider({ children }) {

  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const [notificationObj, setNotificationObj] = useState({
    open: false
  });

  function login(email, password) {
    return firebaseAuth.signInWithEmailAndPassword(email, password);
  }

  async function signOut(){
    await firebaseAuth.signOut();
    setCurrentUserInfo(null);
  }

  function signUp(email, password){
    return firebaseAuth.createUserWithEmailAndPassword(email, password);
  }

  function fetchCurrentUser(){
    if(currentUser){
      firebaseDB.collection("users").doc(currentUser.uid).get()
      .then(doc => {
        setCurrentUserInfo(doc.data())
      }).catch(err => {
        console.log("An error was thrown : ",err );
      })
    }
  }

  useEffect(() => {
    firebaseAuth.onAuthStateChanged( user => {
      console.log("Inside auth state changed ", user );
      setCurrentUser(user);
    })
  },[]);

  useEffect(fetchCurrentUser,[currentUser])

  let value = {
    currentUser,
    currentUserInfo,
    notificationObj,
    setNotificationObj,
    login,
    signOut,
    signUp
  }

  return (
    <AuthContext.Provider value = {value}>
      {children}
    </AuthContext.Provider>
  )

}