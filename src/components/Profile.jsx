import { Grid, TableContainer, Paper, Table, TableBody, TableRow, TableCell } from '@material-ui/core';
import React from 'react'
import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
const Profile = () => {
  const { currentUserInfo } = useContext(AuthContext);
  return currentUserInfo && (
    <Grid
      container
      justifyContent="space-around"
      alignItems="center"
      style={{ paddingTop: "2rem" }}
    >
      <Grid item xs={3} sm={5} lg={4}>
        <img
          src={currentUserInfo.profileImageUrl || "https://images.pexels.com/photos/685674/pexels-photo-685674.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"}
          style={{ width: "100%" }}
          alt="Profile pictuer"
        />
      </Grid>
      <Grid item xs={6}>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Username:</TableCell>
                <TableCell>{currentUserInfo.username}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Email:</TableCell>
                <TableCell>{currentUserInfo.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total posts:</TableCell>
                <TableCell>{currentUserInfo.postsCreated.length}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>);
}

export default Profile;