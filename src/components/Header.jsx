import { Avatar, Button, Grid, makeStyles, Menu, MenuItem } from '@material-ui/core'
import { AccountCircle, ExitToApp, ExploreOutlined, HomeOutlined, Input, PermIdentity, VpnKey } from '@material-ui/icons'
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
    img: {
      margin: "auto",
      display: "block",
      width: "150px",
      height: "100%",
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
      zIndex: "999"
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
      <Grid item xs={4}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/840px-Instagram_logo.svg.png"
          alt="Instagram logo"
          onClick={() => navigate("/")}
          className={classes.img}
        />
      </Grid>
      <Grid item xs={4}>
        {currentUserInfo ? (<div className={classes.menuOptions}>
          <Button 
            onClick={() => navigate("/")}
            startIcon={<HomeOutlined></HomeOutlined>}
            style={{alignItems: "flex-start" }}
            >Home</Button>
          <Button 
            onClick={() => navigate("/")}
            startIcon={<ExploreOutlined></ExploreOutlined>}
            style={{alignItems: "flex-start" }}
            >Explore</Button>
          <Avatar
            src={currentUserInfo.profileImageUrl}
            onClick={(e) => setAnchorEl(e.target)}
            style={{ cursor: "pointer" }}
          ></Avatar>
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