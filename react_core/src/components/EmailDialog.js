import React, { useState } from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { displayAlert } from './Notification';
import { APIService } from '../services/api.service';
import { CircularProgress, makeStyles } from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function EmailDialog({ context, onClose }) {
  const classes = useStyles();
  const { open, user } = context;
  const [loading, setLoading] = useState(false);


  const handleCancel = () => {
    onClose();
  };

  const sendEmail = () => {
    setLoading(true);
    APIService.post(`/user/register`, {
      email: user.email,
      callback: `${window.location.origin}/register`
    })
      .then(() => displayAlert(' email sent!', 'success'))
      .catch(() => displayAlert('Operation failed!', 'error'))
      .finally(() => onClose());
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Send Email</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you wish to send a new registration email. This will invalidate any existing registation tokens.
          </DialogContentText>
          {loading && <CircularProgress className={classes.buttonProgress} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary" autoFocus disabled={loading}>
            Cancel
          </Button>
          <Button onClick={sendEmail} color="primary" disabled={loading}>
            Confirm
            </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
