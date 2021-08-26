import { Avatar, Button, Card, CardContent, CardMedia, TextField, Typography } from '@material-ui/core';
import React, {useEffect, useState, useContext} from 'react'
import { v4 as uuidv4 } from 'uuid';
import { firebaseDB } from '../config/firebase';
import { AuthContext } from '../context/AuthProvider';

const Post = (props) => {
  const { uid, pid } = props.post;
  let [user, setUser] = useState({});
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([]);
  const {currentUser} = useContext(AuthContext);

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

  useEffect(async () => {
    try {
      let doc = await firebaseDB.collection("users").doc(uid).get();
      let user = doc.data();
      setUser(user);
      let updatedCommentList = await fetchCommentUserDetails(props.post.comments);
      setCommentList(updatedCommentList);
    } catch (err) {
      console.log(err);
    }
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
  return (
    <video
      className="video-styles"
      muted={true}
      loop={true}
      controls
      style={{ height: "80vh", border: "1px solid whitesmoke" }}
    >
      <source src={props.src} type="video/mp4" />
    </video>
  )
}

export default Post;