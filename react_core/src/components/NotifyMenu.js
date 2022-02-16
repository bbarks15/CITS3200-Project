
import React, { Fragment, useState } from "react";
import Button from '@material-ui/core/Button';
import { CircularProgress, makeStyles, Menu, MenuItem } from "@material-ui/core";
import { MailOutline } from "@material-ui/icons";

import { APIService } from '../services/api.service';
import { displayAlert } from "./Notification";


const useStyles = makeStyles((theme) => ({
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  button: {
    marginLeft: theme.spacing(1),
  }

}));

const typeString = [
      'recieved',
      'lodged',
      'completed',
 ];

export default function NotifyMenu({ project, onRefresh }) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);



  const sendEmail = (type) => {
    setAnchorEl(null);
    setLoading(true);
    APIService.patch(`/project/${project.ga_number}/notification`, {
      notification_sent: type
    })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]),);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `GA_${project.ga_number}_samples_${typeString[type-1]}.eml`);
        link.setAttribute('type', 'application/mbox');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .then(onRefresh)
      .catch((e) => displayAlert(e.response ? e.response.data.message : 'OOP! Something went wrong.', 'error'))
      .finally(() => setLoading(false));
  }
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <Button variant="outlined" color="primary" size="small"
        disabled={loading}
        startIcon={<MailOutline />} className={classes.button}
        onClick={(ev) => setAnchorEl(ev.currentTarget)}>
        Email
        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        <MenuItem color="primary" disabled>Select a template</MenuItem>
        <MenuItem onClick={() => sendEmail(1)} href={``}>1. Samples recieved</MenuItem>
        <MenuItem onClick={() => sendEmail(2)}>2. Samples lodged</MenuItem>
        <MenuItem onClick={() => sendEmail(3)}>3. Project Completed</MenuItem>
      </Menu>
    </Fragment >
  );
}
