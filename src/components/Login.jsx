import { Container, Grid, Card, CardMedia, CardContent, TextField, CardActions, Button, Typography, makeStyles, Hidden } from '@material-ui/core';
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, setNotificationObj } = useContext(AuthContext);
  const handleLogin = async (e) => {
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
            <CardMedia image="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/840px-Instagram_logo.svg.png" style={{ height: "5rem", backgroundSize: "contain" }}>
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