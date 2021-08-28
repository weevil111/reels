import { Container, Grid, Card, CardMedia, CardContent, TextField, CardActions, Button, Typography, makeStyles, Input, InputLabel } from '@material-ui/core';
import { Camera } from '@material-ui/icons';
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import { firebaseDB, firebaseStorage } from '../config/firebase';
import { AuthContext } from '../context/AuthProvider';
const Signup = (props) => {
  const [email, setEmail] = useState("elonmusk@gmail.com");
  const [password, setPassword] = useState("Test@123");
  const [username, setUsername] = useState("elon_musk");
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState("");
  const { signUp, signOut, setNotificationObj } = useContext(AuthContext);

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
        let profileImageUrl = await uploadPhotoObject.snapshot.ref.getDownloadURL();
        await firebaseDB.collection("users").doc(uid).set({
          email,
          userId: uid,
          username,
          profileImageUrl,
          postsCreated: []
        });
        setNotificationObj({
          message: "Sigup successful 😎 Please login to continue",
          open: true,
          color: "#4caf50"
        })
        signOut()
      }
    } catch (err) {
      setMessage(err.message)
    }
  }
  let useStyles = makeStyles({
    cardContent: {
      display: "flex",
      flexDirection: "column",
      marginBottom: "1rem"
    },
    centerElements: {
      display: "flex",
      flexDirection: "column",
    },
    fullWidth: {
      width: "100%"
    },
    textCenter: {
      textAlign: "center"
    },
    uploadText: {
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      textAlign: "center"
    },
    mb: {
      marginBottom: "1rem"
    },
    mt: {
      marginTop: "2rem"
    },
    ma: {
      margin: "1rem"
    },
    pd: {
      padding: "1rem"
    },
  });
  let classes = useStyles();
  return (
    <Container className={classes.mt}>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={4}>
          <Card variant="outlined">
            <CardMedia image="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/840px-Instagram_logo.svg.png" style={{ height: "5rem", backgroundSize: "contain" }}>
            </CardMedia>
            <CardContent className={classes.centerElements}>
              <Typography className={`${classes.textCenter} ${classes.mb}`}>Signup to see photos and videos of your friends</Typography>
              <TextField
                placeholder="Username"
                type="username"
                variant="outlined"
                value={username}
                size="small"
                onChange={(e) => setUsername(e.target.value)}
                className={classes.mb}
              ></TextField>
              <TextField
                placeholder="Email"
                type="email"
                size="small"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={classes.mb}
              ></TextField>
              <TextField
                placeholder="Password"
                type="password"
                variant="outlined"
                value={password}
                size="small"
                onChange={(e) => setPassword(e.target.value)}
              ></TextField>
              <Typography style={{ color: "red" }}>{message}</Typography>
            </CardContent>
            <CardActions className={classes.centerElements}>
              <label htmlFor="inputFile" className={classes.fullWidth}>
                <Input
                  type="file"
                  style={{ display: "none" }}
                  id="inputFile"
                  color="secondary"
                  inputProps={{ accept: "image/*" }}
                  onChange={(e) => handleFileSubmit(e)}
                ></Input>
              <Typography variant="body1" component="div" className={classes.uploadText}>{profileImage ? profileImage.name:""}</Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  style={{width: "100%", marginBottom: "1rem"}}
                  startIcon={<Camera></Camera>}
                  component="div"
                > Upload
                </Button>
              </label>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSignUp}
                className={classes.fullWidth}
              >SignUp</Button>
            </CardActions>
          </Card>
          <Card variant="outlined" className={classes.pd}>
            <Typography className={classes.textCenter}>
              Have an account ?
              <Button variant="text" color="primary">
                <Link to="/login">Login</Link>
              </Button>
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Signup;