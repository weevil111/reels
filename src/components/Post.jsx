import { Avatar, Button, Card, CardContent, CardMedia, IconButton, TextField, Typography } from '@material-ui/core';
import { Favorite, FavoriteBorder } from '@material-ui/icons';
import React, { useEffect, useState, useContext } from 'react'
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import { firebaseDB } from '../config/firebase';
import { AuthContext } from '../context/AuthProvider';

const Post = (props) => {
  const { uid, pid } = props.post;
  let [user, setUser] = useState({});
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([]);

  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const handleComment = async () => {
    let doc = await firebaseDB.collection("posts").doc(pid).get();
    let oldDocument = doc.data();
    let commentObject = {
      uid: currentUser.uid,
      comment
    };
    oldDocument.comments = [...oldDocument.comments, commentObject];
    await firebaseDB.collection("posts").doc(pid).set(oldDocument);
    let currentCommentData = await fetchCommentUserDetails([commentObject]);
    setCommentList(oldCommentList => {
      return currentCommentData.concat(oldCommentList);
    })
    setComment("");
  }

  const fetchCommentUserDetails = async (comments) => {
    let commentList = await Promise.all(comments.map(async (commentObj) => {
      let doc = await firebaseDB.collection("users").doc(commentObj.uid).get();
      doc = doc.data();
      let commentUserPic = doc.profileImageUrl;
      let username = doc.username ? doc.username : doc.email;
      return {
        profilePic: commentUserPic,
        username,
        comment: commentObj.comment,
        id: uuidv4()
      }
    }))
    return commentList;
  }

  const toggleLikeIcon = async (e) => {
    let postDoc = props.post;
    if (isLiked) {
      let filteredLikes = postDoc.likes.filter(el => el !== currentUser.uid);
      postDoc.likes = filteredLikes;
      await firebaseDB.collection("posts").doc(pid).set(postDoc);
      setIsLiked(false);
    } else {
      postDoc.likes.push(currentUser.uid);
      await firebaseDB.collection("posts").doc(pid).set(postDoc);
      setIsLiked(true);
    }
  }

  useEffect(() => {
    (async function anonymousFunc() {
      try {
        let doc = await firebaseDB.collection("users").doc(uid).get();
        let user = doc.data();
        setUser(user);
        let updatedCommentList = await fetchCommentUserDetails(props.post.comments);
        setCommentList(updatedCommentList);
        let likes = props.post.likes;
        let isLiked = likes.includes(currentUser.uid);
        setIsLiked(isLiked);
        if (isLiked) {
          setLikesCount(likes.length - 1);
        } else {
          setLikesCount(likes.length);
        }
      } catch (err) {
        console.log(err);
      }
    })()
  }, [])
  return (
    <Card>
      <CardContent>
        <Avatar src={user.profileImageUrl}></Avatar>
        <Typography variant="h3">{user.username}</Typography>
        <CardMedia>
          <div className="video-container">
            <Video src={props.post.mediaLink}></Video>
          </div>
        </CardMedia>
        <IconButton>
          {isLiked ?
            (<Favorite
              style={{ color: "red" }}
              onClick={toggleLikeIcon}
            ></Favorite>)
            :
            (<FavoriteBorder onClick={toggleLikeIcon}></FavoriteBorder>)}
        </IconButton>
        {(likesCount > 0) &&
          <div><Typography variant="body1">
            {isLiked? `You and ${likesCount} other(s) liked it.`: `${likesCount} people liked it.`}
          </Typography></div>}
        <Typography variant="body1">Comments</Typography>
        <TextField
          variant="outlined"
          placeholder="Add a comment"
          size="small"
          value={comment}
          onChange={e => setComment(e.target.value)}
        ></TextField>
        <Button variant="contained" color="secondary" onClick={handleComment}>Post</Button>
        {commentList.map(commentObj => (<div key={commentObj.id}>
          <Avatar src={commentObj.profilePic}></Avatar>
          <Typography variant="body1">{commentObj.comment}</Typography>
        </div>))}
      </CardContent>
    </Card>);
}

function Video(props) {

  const handleAutoScroll = (e) => {
    let next = ReactDOM.findDOMNode(e.target).parentNode.parentNode.parentNode.parentNode.nextSibling
    if (next) {
      next.scrollIntoView({ behaviour: "smooth" });
      e.target.muted = "true";
    }
  }

  return (
    <video
      className="video-styles"
      muted={true}
      controls
      style={{ height: "80vh", border: "1px solid whitesmoke" }}
      onEnded={handleAutoScroll}
    >
      <source src={props.src} type="video/mp4" />
    </video>
  )
}

export default Post;