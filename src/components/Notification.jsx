import { IconButton, makeStyles, Snackbar, Typography } from '@material-ui/core'
import { Close } from '@material-ui/icons';
import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthProvider'

function Notification() {
  const { notificationObj, setNotificationObj } = useContext(AuthContext);
  const handleClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotificationObj({
      open: false
    });
  }

  let { color="#f44336", message = "", hideDuration = 5000 } = notificationObj

  const useStyles = makeStyles({
    snackbar: {
      "& div": {
        backgroundColor: color
      }
    }
  })
  const classes = useStyles();
  return (
    <Snackbar
      className={classes.snackbar}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={notificationObj.open}
      autoHideDuration={hideDuration}
      onClose={handleClose}
      message={<Typography>{message}</Typography>}
      action={
        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
          <Close fontSize="small" />
        </IconButton>
      }>
    </ Snackbar>
  )
}

export default Notification
