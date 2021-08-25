import { Button } from '@material-ui/core';
import { PhotoCamera } from '@material-ui/icons';
import React, { useContext } from 'react'
import { useState } from 'react';
import { v4 as uuidv4  } from 'uuid';
import { firebaseDB, firebaseStorage } from '../config/firebase';
import { AuthContext } from '../context/AuthProvider'
const Feeds = (props) => {
  const {signOut, currentUser} = useContext(AuthContext);
  const handleLogout = async () => {
    try{
      await signOut();
      props.history.push("/login")
    }catch(err){
      console.log(err);
    }
  }
  const [videoFile, setVideoFile] = useState(null);
  const handleInputFile = (e) => {
    let file = e.target.files[0];
    setVideoFile(file);
  }

  const handleUploadFile = async() => {
    let uid = currentUser.uid;
    try{
      const uploadVideoObject = firebaseStorage
      .ref(`/media/${uid}/posts/videos/${Date.now()}.mp4`)
      .put(videoFile);
      uploadVideoObject.on("state_changed", fun1, fun2, fun3);

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
        let videoUrl = await uploadVideoObject.snapshot.ref.getDownloadURL();
        console.log(videoUrl);
        let pid = uuidv4();
        await firebaseDB.collection("posts").doc(uid).set({
          pid,
          uid,
          comments: [],
          likes:[],
          mediaLink: videoUrl,
          caption:"First video",
          type: "video"
        });
        let doc = await firebaseDB.collection("users").doc(uid).get();
        let oldDocument = doc.data();
        oldDocument.postsCreated.push(pid);
        await firebaseDB.collection("users").doc(uid).set(oldDocument);
        
      }

    }catch(err){
      console.log(err);
    }
  }



  return ( <div>
    <h1>Feeds</h1>
    <button onClick={handleLogout}>Logout</button>
    <div className="uploadVideo">
      <div>
        <input type="file" name="videoInput" onChange={handleInputFile} />
        <label htmlFor="videoInput">
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<PhotoCamera></PhotoCamera>}
            onClick={handleUploadFile}
            >Upload</Button>
        </label>
      </div>
    </div>
  </div> );
}
 
export default Feeds;