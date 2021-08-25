import React, { Component, useContext, useState } from 'react'
import { firebaseDB, firebaseStorage } from '../config/firebase';
import { AuthContext } from '../context/AuthProvider';
const Signup = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState("");
  const {signUp} = useContext(AuthContext);

  const handleFileSubmit = (event) => {
    let fileObject = event.target.files[0];
    setProfileImage(fileObject);
  }

  const handleSignUp = async () => {
    try {
      let response = await signUp(email, password);
      let uid = response.user.uid;
      const uploadPhotoObject = firebaseStorage.ref(`/media/${uid}/profile/profilePhoto.jpg`).put(profileImage);
      uploadPhotoObject.on("state_changed", fun1, fun2, fun3);
      // to track the progess of the upload
      function fun1(snapshot){
        let progress = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
        console.log(progress);

      }

      // It indicates an error
      function fun2(error){
        console.log(error);
      }

      // It indicates sucess of the upload
      async function fun3(){
        let profileImageUrl = await uploadPhotoObject.snapshot.ref.getDownloadURL();
        firebaseDB.collection("users").doc(uid).set({
          email,
          userId: uid,
          username,
          profileImageUrl,
          postsCreated: []
        });
        props.history.push("/");
      }
    } catch (err) {
      setMessage(err.message)
    }
  }

  return ( <>
    <h1>Signup page</h1>
      <div>
        <div>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          Profile Image
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSubmit(e)}
          />
        </div>
      </div>
      <button onClick={handleSignUp}>SignUp</button>
      <h2 style={{color: "red"}}> {message}</h2>
    </> );
}
 
export default Signup;