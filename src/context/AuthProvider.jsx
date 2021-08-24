import React, { useState, useEffect } from 'react';
import { firebaseAuth } from '../config/firebase';

export const AuthContext = React.createContext();

export function AuthProvider({ children }) {

  const [currentUser, setCurrentUser] = useState(null);

  function login(email, password) {
    return firebaseAuth.signInWithEmailAndPassword(email, password);
  }

  function signOut(){
    return firebaseAuth.signOut();
  }

  function signUp(){
    //
  }

  useEffect(() => {
    firebaseAuth.onAuthStateChanged( user => {
      console.log("Inside auth state changed ", user );
      setCurrentUser(user);
    })
  },[]);

  let value = {
    currentUser: currentUser,
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