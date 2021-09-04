import { makeStyles } from '@material-ui/core';
import React, {  useEffect } from 'react'
import { useState } from 'react';
import { firebaseDB } from '../config/firebase';

import Post from './Post';
const Feeds = (props) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let conditionObject = {
      root: null, // Observer from the whole page
      threshold: "0.7"
    }
    function observerCallback(entries) {
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
    setTimeout(() => {
      let observerObject = new IntersectionObserver(observerCallback, conditionObject);
      let elements = document.querySelectorAll(".video-container");
      elements.forEach(el => {
        observerObject.observe(el);
      })
    },5000)
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

  const useStyles = makeStyles({
    postList: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }
  })

  const classes = useStyles();

  return (<>
    <div className={classes.postList}>
      {posts.map(post => (
        <Post key={post.pid} post={post}></Post>
      ))}
    </div>
  </>);
}

export default Feeds;