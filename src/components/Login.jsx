import { Container, Grid, Paper, Card, CardMedia, CardContent, TextField, CardActions, Button, Typography, makeStyles } from '@material-ui/core';
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
const Login = (props) => {
  const [email, setEmail] = useState("apm@apm.com");
  const [password, setPassword] = useState("Test@123");
  const [message, setMessage] = useState("");
  const {login} = useContext(AuthContext);
  const handleLogin = async (e) => {
    try{
      await login(email, password);
      props.history.push("/")
    }catch(err){
      setMessage(err.message);
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
      height: "10rem",
      backgroundColor: "lightgray"
    },
    fullWidth:{
      width: "100%"
    }, 
    centerElements: {
      display: "flex",
      flexDirection: "column",
    },
    mb: {
      marginBottom: "1rem"
    },
    pd: {
      padding:"1rem"
    },
    alignCenter: {
      justifyContent: "center"
    },
    textCenter: {
      textAlign: "center"
    }
  })

  let classes = useStyles();

  return (
  <Container >
    <Grid container spacing={2} justifyContent="center" >
      <Grid item sm={5}>
        <Paper className={classes.carousal}>Carousel</Paper>
      </Grid>
      <Grid item sm={5} >
        <Card variant="outlined">
          <CardMedia image="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/840px-Instagram_logo.svg.png" style={{height:"5rem", backgroundSize:"contain"}}>
          </CardMedia>
          <CardContent className={classes.cardContent}>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              value={email}
              size="small"
              onChange={(e) => setEmail(e.target.value)}
              className={classes.mb}
            ></TextField>
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              size="small"
              onChange={(e) => setPassword(e.target.value)}
            ></TextField>
            <Typography style={{color: "red"}}>{message}</Typography>
          </CardContent>
          <CardActions>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleLogin}
              className={classes.fullWidth}
              >Login</Button>
          </CardActions>
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