import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { APIService } from "../services/api.service";
import DangerButton from "../components/DangerButton";
import { Delete } from "@material-ui/icons";
import UserDeleteDialog from "../components/UserDeleteDialog";
import EmailDialog from "../components/EmailDialog";
import { displayAlert } from "./Notification";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  card: {
    margin: "auto",
    color: theme.palette.text.secondary,
    height: '100%',
  },
}));




export default function ProfileAdmin(props) {
  const [dialogData, setDialogData] = useState({ open: false });
  const [emailDialogData, setEmailDialogData] = useState({ open: false });
  const classes = useStyles();
  const { user } = props;

  const changeUserType = (setAdmin) => {
    const id = props.user.id;
    if (setAdmin === user.isAdmin) return; // already correct type
    APIService.patch(id ? `/user/${id}` : `/user`, {
      admin: setAdmin,
    })
      .then(() => {
        props.onRefresh(false);
        displayAlert(`User type has been changed to ${setAdmin ? 'admin' : 'client'}!`, 'success')
      })
      .catch(() => displayAlert('Failed to update user!', 'error'));
  }



  const handleOpenDialog = () => {
    setDialogData({ open: true, user: user });
  }

  const handleOpenEmailDialog = () => {
    setEmailDialogData({ open: true, user: user });
  }

  const handleCloseDialog = () => {
    setDialogData({ open: false, user: null });
    setEmailDialogData({ open: false });
  }

  return (
    <Grid item xs={3}>

      <UserDeleteDialog context={dialogData} onClose={handleCloseDialog} redirect />
      <EmailDialog context={emailDialogData} onClose={handleCloseDialog} redirect />
      <Card elevation={6} className={classes.card}>
        <CardContent>
          <Typography color="primary" gutterBottom variant="h4">
            Admin
          </Typography>
          <List>
            <Typography gutterBottom variant="h6">User Type</Typography>
            <ListItem disableGutters>
              <ButtonGroup disableElevation fullWidth size="small">
                <DangerButton id="admin"
                  onClick={(ev) => changeUserType(true)}
                  variant={user.isAdmin ? "contained" : "outlined"}>
                  Admin
                </DangerButton>
                <Button color="primary" id="client"
                  onClick={(ev) => changeUserType(false)}
                  variant={!user.isAdmin ? "contained" : "outlined"}>
                  Client
                </Button>
              </ButtonGroup>
            </ListItem>
            <ListItem disableGutters>
              <Typography gutterBottom variant="body2">
                Change the user type. Admin users have the ability to create, delete, and alter any user in the system.
                      </Typography>
            </ListItem>

            <Typography variant="h6">Actions </Typography>
            <ListItem disableGutters>
              <Button fullWidth disableElevation color="primary" size="small" variant="outlined" onClick={handleOpenEmailDialog}>Send Registration Email</Button>
            </ListItem>
            <ListItem disableGutters>
              <Typography gutterBottom variant="body2" >
                Resend the initial welcome email. Use if the user does not recieve the email or the registration link has expired.
              </Typography>
            </ListItem>
            <ListItem disableGutters>
              <DangerButton variant="contained" fullWidth size="small" onClick={handleOpenDialog} startIcon={<Delete size="small" />}>Delete</DangerButton>
            </ListItem>
            <ListItem disableGutters>
              <Typography gutterBottom variant="body2">
                Permanently remove the user from the system. Internal client records will be preserved.
              </Typography>
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Grid>)
}