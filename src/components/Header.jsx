import { Avatar, Button, Grid, Hidden, makeStyles, Menu, MenuItem } from '@material-ui/core'
import { AccountCircle, ExitToApp, ExploreOutlined, Input, MovieCreationOutlined, PermIdentity } from '@material-ui/icons'
import React, { useState } from 'react'
import { useContext } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthProvider'
const Header = () => {
  const { signOut, currentUserInfo } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut();
      history.push("/login")
    } catch (err) {
      console.log(err);
    }
    setAnchorEl(null);
  }
  const useStyles = makeStyles({
    logoContainer:{
      display: "flex",
      justifyContent: "center"
    },
    img: {
      margin: "0 10px",
      display: "block",
      height: "30px",
    },
    menuOptions: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-around"
    },
    outerContainer: {
      padding: "10px 10vw 0 10vw",
      borderBottom: "1px solid whitesmoke",
      position: "sticky",
      top: "0",
      background: "white",
      zIndex: "999",
      height: "5rem"
    }
  })
  const navigate = (path) => {
    history.push(path);
    setAnchorEl(null);
  }
  const classes = useStyles();
  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      className={classes.outerContainer}
    >
      <Grid item xs={2} sm={4}>
        <div className={classes.logoContainer}>
        <img src="https://seeklogo.com/images/I/instagram-reels-logo-18CF7D9510-seeklogo.com.png"
          alt="Instagram logo"
          onClick={() => navigate("/")}
          className={classes.img}
        />
        <h3>Reels</h3>
        </div>
      </Grid>
      <Grid item xs={4}>
        {currentUserInfo ? (<div className={classes.menuOptions}>
          <Button 
            onClick={() => navigate("/")}
            startIcon={<ExploreOutlined></ExploreOutlined>}
            style={{alignItems: "flex-start" }}
            ><Hidden smDown>Explore</Hidden></Button>
          <Button 
            onClick={() => navigate("/upload")}
            startIcon={<MovieCreationOutlined></MovieCreationOutlined>}
            style={{alignItems: "flex-start" }}
            ><Hidden smDown>Upload</Hidden></Button>
          <Avatar
            src={currentUserInfo.profileImageUrl}
            onClick={(e) => setAnchorEl(e.target)}
            style={{ cursor: "pointer" }}
          >{currentUserInfo.email?.charAt(0).toUpperCase()}</Avatar>
          <Menu
            id="header-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={() => navigate("/profile")}>
              <AccountCircle style={{ marginRight: "5px" }}></AccountCircle>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ExitToApp style={{ marginRight: "5px" }}></ExitToApp>
              Logout
            </MenuItem>
          </Menu>
        </div>): location.pathname === "/login"? 
          <Button 
            onClick={() => navigate("/signup")}
            startIcon={<PermIdentity></PermIdentity>}
            style={{alignItems: "flex-start" }}
            >Signup</Button>:
          <Button 
            onClick={() => navigate("/login")}
            startIcon={<Input></Input>}
            style={{alignItems: "flex-start" }}
            >Login</Button>
          }
      </Grid>
    </Grid>);
}

export default Header;