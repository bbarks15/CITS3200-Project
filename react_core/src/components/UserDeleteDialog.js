import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { displayAlert } from './Notification';
import { withStyles } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import {APIService} from '../services/api.service';

const DangerButtonText = withStyles((theme) => ({
  root: {
    color: theme.palette.error.main,
    "&:hover": {
      color: theme.palette.error.dark,
      backgroundColor: red[50],
    },
  },
}))(Button);

export default function UserDeleteDialog({ context, onClose,redirect }) {
  const { open, user } = context;

  const handleCancel = () => {
    onClose();
  };
  const handleDelete = () => {
    APIService.delete(`/user/${user.id}`)
      .then(res=>displayAlert(`Successfully deleted "${user.company}"`,"success", redirect ? '/admin' :null))
      .catch(e=>displayAlert(`Something went wrong! user "${user.company}" not deleted.`,"error"))
      .finally(res => {if(!redirect) onClose();});
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete User"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you wish to delete {user && user.company}. This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary" autoFocus>
            Cancel
          </Button>
          <DangerButtonText onClick={handleDelete} color="primary">
            Delete
          </DangerButtonText>
        </DialogActions>
      </Dialog>
    </div>
  );
}
