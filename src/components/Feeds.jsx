import { Button } from '@material-ui/core';
import { PhotoCamera } from '@material-ui/icons';
import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { firebaseDB, firebaseStorage, timestamp } from '../config/firebase';
import { AuthContext } from '../context/AuthProvider'
import VideoPost from './Post';
const Feeds = (props) => {
  const { signOut, currentUser } = useContext(AuthContext);
  const [videoFile, setVideoFile] = useState(null);
  const [errMessage, setErrMessage] = useState("");
  const [fileLocalPath, setfileLocalPath] = useState("");
  const [posts, setPosts] = useState([]);

  const handleLogout = async () => {
    try {
      await signOut();
      props.history.push("/login")
    } catch (err) {
      console.log(err);
    }
  }
  const handleInputFile = (e) => {
    let file = e.target.files[0];
    if(!file){
      return;
    } else if((file.size/1024/1024) > 25){
      setErrMessage("File too large ( > 25 MB)");
      // return;
    }
    setErrMessage("");
    setfileLocalPath(e.target.value);
    setVideoFile(file);
  }
  const handleUploadFile = async () => {
    if (!videoFile) {
      return;
    }
    let uid = currentUser.uid;
    try {
      const uploadVideoObject = firebaseStorage
        .ref(`/media/${uid}/posts/videos/${Date.now()}.mp4`)
        .put(videoFile);
      uploadVideoObject.on("state_changed", fun1, fun2, fun3);

      function fun1(snapshot) {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(progress);

      }

      // It indicates an error
      function fun2(error) {
        console.log(error);
      }

      // It indicates sucess of the upload
      async function fun3() {
        let videoUrl = await uploadVideoObject.snapshot.ref.getDownloadURL();
        console.log(videoUrl);
        let pid = uuidv4();
        await firebaseDB.collection("posts").doc(pid).set({
          pid,
          uid,
          comments: [],
          likes: [],
          mediaLink: videoUrl,
          caption: "First video",
          type: "video",
          createdAt: timestamp()
        });
        let doc = await firebaseDB.collection("users").doc(uid).get();
        let oldDocument = doc.data();
        oldDocument.postsCreated.push(pid);
        await firebaseDB.collection("users").doc(uid).set(oldDocument);
        setVideoFile(null);
        setfileLocalPath("");
      }

    } catch (err) {
      console.log(err);
    }
  }
  let conditionObject = {
    root: null, // Observer from the whole page
    threshold: "0.8"
  }

  function observerCallback(entries) {
    console.log(entries);
    entries.forEach(entry => {
      let child = entry.target.children[0];
      // play() => async
      // pause() => sync
      child.play().then(function () {
        if (entry.isIntersecting === false) {
          child.pause();
        }
      })
    })
  }

  useEffect(() => {
    let observerObject = new IntersectionObserver(observerCallback, conditionObject);
    let elements = document.querySelectorAll(".video-container");

    elements.forEach(el => {
      observerObject.observe(el);
    })

  }, [posts])

  useEffect(() => {
    firebaseDB.collection("posts")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      let allPosts = snapshot.docs.map(doc => {
        return doc.data();
      });
      setPosts(allPosts);
    })
  }, [])

  return (<div>
    <button onClick={handleLogout}>Logout</button>
    <div className="uploadVideo">
      <div>
        <input
          type="file"
          name="videoInput"
          value={fileLocalPath}
          onChange={handleInputFile} />
        <label htmlFor="videoInput">
          <Button
            variant="contained"
            color="secondary"
            startIcon={<PhotoCamera></PhotoCamera>}
            onClick={handleUploadFile}
          >Upload</Button>
        </label>
      </div>
      <p style={{color:"red"}}>{errMessage}</p>
    </div>
    <div className="feeds-video-list">
      {posts.map(post => (
        <VideoPost key={post.pid} post={post}></VideoPost>
      ))}
    </div>
  </div>);
}

export default Feeds;