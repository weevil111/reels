import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthProvider'
import { v4 as uuidv4 } from 'uuid';
import { PhotoCamera } from '@material-ui/icons';
import { Button, Grid, makeStyles, Typography } from '@material-ui/core';
import { firebaseDB, firebaseStorage, timestamp } from '../config/firebase';

function Upload({ history }) {
  const [caption, setCaption] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const { currentUser, setNotificationObj } = useContext(AuthContext);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaFileType, setMediaFileType] = useState("")
  const isCurrentUserGuest = currentUser?.email === "guest@reels.com";

  function showErrorNotification(message) {
    setNotificationObj({
      open: true,
      message
    })
  }
  const handleInputFile = (e) => {
    let file = e.target.files[0];
    if (!file) {
      return;
    }

    let errorMessage = "";
    const mediaType = file.type.split("/")[0];
    if(isCurrentUserGuest){
      errorMessage = "Sorry ! Guest users cannot upload content 😞";
    }else if (!["video", "image"].includes(mediaType)) {
      errorMessage = "Unsupported media type.";
    } else if ((file.size / 1024 / 1024) > 10) {
      errorMessage = "File too large ( > 10 MB)";
    }
    if (errorMessage) {
      showErrorNotification(errorMessage);
      setMediaFile(null);
      setMediaFileType("");
      e.target.value = "";
      return;
    }
    setMediaFileType(mediaType);
    setMediaFile(file);
  }
  const handleUploadFile = async () => {

    if (!mediaFile) {
      return;
    }
    
    if (caption.length > 250 ) {
      showErrorNotification("Caption length too long ( > 250 characters)")
      return;
    }

    let uid = currentUser.uid;
    try {
      setButtonDisabled(true);
      const uploadVideoObject = firebaseStorage
        .ref(`/media/${uid}/posts/${mediaFileType}/${Date.now()}.${mediaFileType==="image"?"jpg":"mp4"}`)
        .put(mediaFile);
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
        let mediaUrl = await uploadVideoObject.snapshot.ref.getDownloadURL();
        console.log(mediaUrl);
        let pid = uuidv4();
        await firebaseDB.collection("posts").doc(pid).set({
          pid,
          uid,
          comments: [],
          likes: [],
          mediaLink: mediaUrl,
          caption,
          type: mediaFileType,
          createdAt: timestamp()
        });
        let doc = await firebaseDB.collection("users").doc(uid).get();
        let oldDocument = doc.data();
        oldDocument.postsCreated.push(pid);
        await firebaseDB.collection("users").doc(uid).set(oldDocument);
        setMediaFile(null);
        setCaption("");
        setButtonDisabled(false)
        history?.push("/");
      }

    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if(isCurrentUserGuest){
      showErrorNotification("Sorry ! Guest users cannot upload content 😞");
    }
  }, [isCurrentUserGuest])

  const useStyles = makeStyles({
    formContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      marginTop: "4rem",
      padding: "2rem",
      borderRadius: "4px",
      minHeight: "50vh",
      border: "1px solid rgba(0, 0, 0, 0.12)",
      '& button, div, input': {
        marginBottom: "1rem"
      }
    },
    caption: {
      padding: "8px",
      "&::placeholder": {
        color: "rgba(0,0,0,0.5)"
      },
      "&:-ms-input-placeholder": {
        color: "rgba(0,0,0,0.5)"
      },
      "&::-ms-input-placeholder": {
        color: "rgba(0,0,0,0.5)"
      }
    },
    singleLineText: {
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      textAlign: "center"
    },
  })
  const classes = useStyles();
  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={8} sm={6} md={5} className={classes.formContainer}>
        <input
          placeholder="Enter Caption"
          onChange={e => setCaption(e.target.value)}
          value={caption}
          className={classes.caption}
        />
        <label htmlFor="videoInput">
          <input
            type="file"
            id="videoInput"
            style={{ display: "none" }}
            onChange={handleInputFile} />
            <Typography variant="body1" component="div" className={classes.singleLineText}>{mediaFile?.name}</Typography>
          <Button
            variant="contained"
            color="secondary"
            style={{ width: "100%" }}
            startIcon={<PhotoCamera></PhotoCamera>}
            disabled={buttonDisabled}
            component="div"
          >Upload</Button>
        </label>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUploadFile}
          disabled={buttonDisabled}
        >Post</Button>
      </Grid>
    </Grid>
  )
}

export default Upload
