import { Container, Grid, Card, CardMedia, CardContent, TextField, CardActions, Button, Typography, makeStyles, Hidden } from '@material-ui/core';
import { ArrowForward } from '@material-ui/icons';
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, setNotificationObj } = useContext(AuthContext);
  const handleLogin = async (e) => {
    if(!email.trim() || !password){
      setNotificationObj({
        open: true,
        message: "Please fill up all the fields !"
      });
      return;
    }
    try {
      await login(email, password);
      props.history.push("/")
    } catch (err) {
      setNotificationObj({
        message: err.message,
        open: true,
      });
      setPassword("");
    }
  }

  const guestLogin = async function(){
    try {
      await login("guest@reels.com", "Test@123");
      props.history.push("/")
    } catch (err) {
      setNotificationObj({
        message: err.message,
        open: true,
      });
    }
  }
  
  let useStyles = makeStyles({
    cardContent: {
      display: "flex",
      flexDirection: "column",
      marginBottom: "1rem"
    },
    carousal: {
      height: "80%",
    },
    carousalContainerImage: {
      maxHeight: "88vh",
      maxWidth: "100%"
    },
    fullWidth: {
      width: "100%"
    },
    centerElements: {
      display: "flex",
      flexDirection: "column",
    },
    mt: {
      marginTop: "1rem"
    },
    pd: {
      padding: "1rem"
    },
    alignCenter: {
      justifyContent: "center"
    },
    textCenter: {
      textAlign: "center"
    },
    forgotPassword: {
      cursor: "pointer",
      margin: "1rem",
      textAlign: "center"
    }
  })

  let classes = useStyles();

  return (
    <Container>
      <Grid container spacing={2} justifyContent="center" alignItems="center" >
        <Hidden xsDown>
          <Grid item sm={6} md={6} lg={5}>
            <img
              src="/login.png"
              className={classes.carousalContainerImage}
              alt=""
            />
          </Grid>
        </Hidden>
        <Grid item xs={8} sm={6} md={4}>
          <Card variant="outlined">
            <CardMedia image="https://seeklogo.com/images/I/instagram-reels-logo-18CF7D9510-seeklogo.com.png" style={{ height: "4rem", backgroundSize: "contain", margin: "8px" }}>
            </CardMedia>
            <CardContent className={classes.cardContent}>
              <TextField
                placeholder="Email"
                type="email"
                variant="outlined"
                value={email}
                size="small"
                onChange={(e) => setEmail(e.target.value)}
              ></TextField>
              <TextField
                placeholder="Password"
                type="password"
                variant="outlined"
                value={password}
                size="small"
                className={classes.mt}
                onChange={(e) => setPassword(e.target.value)}
              ></TextField>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                onClick={handleLogin}
                className={classes.fullWidth}
              >Login</Button>
            </CardActions>
            <Typography variant="subtitle2" style={{ textAlign: "center" }}>OR</Typography>
            <Button
              color="secondary"
              onClick={guestLogin}
              className={classes.fullWidth}
              endIcon={<ArrowForward></ArrowForward>}
            >Continue as a guest </Button>
            <Typography className={classes.forgotPassword}>Forgot password ?</Typography>
          </Card>
          <Card variant="outlined" className={classes.pd}>
            <Typography className={classes.textCenter}>
              Don't have an account ?
              <Button variant="text" color="primary">
                <Link to="/signup">Signup</Link>
              </Button>
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Login;