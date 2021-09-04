import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, makeStyles, TextField, Typography } from '@material-ui/core';
import { Favorite, FavoriteBorder, ModeCommentOutlined, MoreVert, ShareOutlined } from '@material-ui/icons';
import React, { useEffect, useState, useContext } from 'react'
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import { firebaseDB } from '../config/firebase';
import { AuthContext } from '../context/AuthProvider';

const Post = ({ post }) => {
  const { uid, pid } = post;
  let [user, setUser] = useState(null);
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([]);

  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const { currentUser, setNotificationObj } = useContext(AuthContext);
  const isCurrentUserGuest = currentUser?.email === "guest@reels.com";

  function sendNotification(message, info = true) {
    setNotificationObj({
      message,
      open: true,
      color: info ? "#2196f3" : undefined
    })
  }

  const handleComment = async () => {
    if (comment.trim() === "") {
      return;
    }
    let doc = await firebaseDB.collection("posts").doc(pid).get();
    let oldDocument = doc.data();
    let commentObject = {
      uid: currentUser.uid,
      comment
    };
    oldDocument.comments = [commentObject, ...oldDocument.comments];
    if (isCurrentUserGuest) {
      sendNotification("Guest user's comments are not saved in the database !", false);
    } else {
      await firebaseDB.collection("posts").doc(pid).set(oldDocument);
    }
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
    let postDoc = post;
    if (isLiked) {
      let filteredLikes = postDoc.likes.filter(el => el !== currentUser.uid);
      postDoc.likes = filteredLikes;
      if (isCurrentUserGuest) {
        sendNotification("Guest user's interactions are not saved in the database 😢", false)
      } else {
        await firebaseDB.collection("posts").doc(pid).set(postDoc);
        sendNotification(`You unliked the ${post.type}  💔`);
      }
      setIsLiked(false);
    } else {
      postDoc.likes.push(currentUser.uid);
      if (isCurrentUserGuest) {
        sendNotification("Guest user's interactions are not saved in the database 😢", false)
      } else {
        await firebaseDB.collection("posts").doc(pid).set(postDoc);
        sendNotification(`You liked the ${post.type}  ❤`);
      }
      setIsLiked(true);
    }
  }

  useEffect(() => {
    (async function anonymousFunc() {
      try {
        let doc = await firebaseDB.collection("users").doc(uid).get();
        let user = doc.data();
        setUser(user);
        let updatedCommentList = await fetchCommentUserDetails(post.comments);
        setCommentList(updatedCommentList);
        let likes = post.likes;
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

  const useStyles = makeStyles({
    container: {
      margin: "24px 0"
    },
    cardIconsContainer: {
      display: "flex",
      justifyContent: "flex-start",
      width: "100%",
      padding: "0 5px"
    },
    cardActions: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start"
    },
    commentList: {
      maxHeight: "10rem",
      overflow: "auto",
      width: "100%"
    },
    comments: {
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis"
    },
    userComment: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%"
    },
    caption: {
      padding: "2px",
    },
    imagePost: {
      objectFit: "contain",
      width: "100%"
    }
  });
  const classes = useStyles();
  const postDate = new Date(post.createdAt.toMillis());
  const postTimeFormatted = `${postDate.toDateString()} - ${postDate.toLocaleTimeString()}`;
  const avatarLetter = user ? (user.username ? user.username[0] : user.email[0]) : "😎";
  return user ? (
    <Grid container justifyContent="center" className={classes.container}>
      <Grid item xs={12} sm={6} md={4} zeroMinWidth>
        <Card>
          <CardHeader
            avatar={
              <Avatar src={user.profileImageUrl}>{avatarLetter.toUpperCase()}</Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVert />
              </IconButton>
            }
            title={user.username ? user.username : user.email}
            subheader={postTimeFormatted}
          />
          <CardContent>
            <Typography variant="body1" className={classes.caption}>{post.caption}</Typography>
            <CardMedia>
              {post.type === "image" ? (
                <img src={post.mediaLink} className={classes.imagePost} alt="Post media"></img>
              ) : (
                <div className="video-container">
                  <Video src={post.mediaLink}></Video>
                </div>
              )}
            </CardMedia>
          </CardContent>
          <CardActions className={classes.cardActions}>
            <div className={classes.cardIconsContainer}>
              <IconButton onClick={toggleLikeIcon} size="small">
                {isLiked ?
                  (<Favorite
                    color="secondary"
                    fontSize="large"
                  ></Favorite>)
                  :
                  (<FavoriteBorder fontSize="large"></FavoriteBorder>)}
              </IconButton>
              <IconButton size="small">
                <ModeCommentOutlined fontSize="large"></ModeCommentOutlined>
              </IconButton>
              <IconButton size="small">
                <ShareOutlined fontSize="large"></ShareOutlined>
              </IconButton>
            </div>
            {(likesCount > 0) &&
              <div><Typography variant="body1">
                {isLiked ? `You and ${likesCount} other(s) liked it.` : `${likesCount} people liked it.`}
              </Typography></div>}
            <List component="ul" className={classes.commentList}>
              {commentList.map(comment => (
                <ListItem key={comment.id} disableGutters >
                  <ListItemIcon>
                    <Avatar src={comment.profilePic}>{comment.username?.charAt(0).toUpperCase()}</Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography className={classes.comments}>{comment.username}</Typography>}
                    secondary={<Typography className={classes.comments} style={{ color: "rgba(0,0,0,0.5)" }}>{comment.comment}</Typography>}
                    disableTypography />
                </ListItem>
              ))}
            </List>
            <div className={classes.userComment}>
              <TextField
                variant="outlined"
                placeholder="Add a comment"
                size="small"
                value={comment}
                onChange={e => setComment(e.target.value)}
                style={{ flexGrow: 1 }}
              ></TextField>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={handleComment}
                style={{ margin: "0 24px 8px 24px" }}
              >Post</Button>
            </div>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  ) : (<></>);
}

function Video(props) {

  const handleAutoScroll = (e) => {
    let next = ReactDOM.findDOMNode(e.target).parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.nextSibling;
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
      style={{ width: "100%", border: "1px solid whitesmoke" }}
      onEnded={handleAutoScroll}
    >
      <source src={props.src} type="video/mp4" />
    </video>
  )
}

export default Post;