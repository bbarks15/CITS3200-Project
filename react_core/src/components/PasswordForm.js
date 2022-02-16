
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@material-ui/core";

import { UserContext } from "../services/auth.service";
import PasswordField from "../components/PasswordField";
import { APIService } from "../services/api.service";
import { VpnKey } from "@material-ui/icons";
import { displayAlert } from "./Notification";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    margin: "auto",
    color: theme.palette.text.secondary,
  },
  card: {
    padding: theme.spacing(2),
    margin: "auto",
    color: theme.palette.text.secondary,
  },
  title: {
    color: "grey",
  },
}));

export default function PasswordForm({ match, user }) {
  const classes = useStyles();
  const userContext = React.useContext(UserContext);
  const [password1, setPassword1] = React.useState({});
  const [password2, setPassword2] = React.useState({});
  const [passwordOld, setPasswordOld] = React.useState({});

  const handlePasswordChange = (ev) => {
    ev.preventDefault();
    const id = match.params.user_id;
    if ((passwordOld.value || id) && password1.value && (password1.value === password2.value)) {
      APIService.patch(id ? `/user/${id}/password` : `/user/password`,
        Object.assign({ newPassword: password1.value }, (id ? null : { oldPassword: passwordOld.value }))
        ).then(() => {
            displayAlert('Success: password changed', 'success')
          })
          .catch(() => {
            displayAlert('Password change failed!', 'error')
          });
      return;
    }
    if (!passwordOld.value)
      setPasswordOld({ ...passwordOld, ...{ errorText: 'Enter a password' } });
    if (!password1.value)
      setPassword1({ ...password1, ...{ errorText: 'Enter a password' } });
    if (!password2.value)
      setPassword2({ ...password2, ...{ errorText: 'Enter a password' } });
  }

  const showOldPassword = !(userContext && userContext.isAdmin && user.email !== userContext.email);
  return (
    <Card elevation={6}>
      <form className={classes.form} onSubmit={handlePasswordChange} noValidate>
        <CardContent>
          <Typography color="primary" variant="h4">
            Password
          </Typography>
          {showOldPassword &&
            <PasswordField variant="standard" label="Current Password"
              setPassword={setPasswordOld}
              password={passwordOld} />
          }
          <PasswordField variant="standard" label="New Password"
            setPassword={setPassword1}
            password={password1} />
          <PasswordField variant="standard" label="Confirm Password"
            setPassword={setPassword2}
            match={password1.value}
            password={password2} />
        </CardContent>
        <CardActions>
          <Grid container direction="row" justify="flex-end" alignItems="flex-start">
            <Button variant="contained" color="primary" type="submit" startIcon={<VpnKey />}>Update Password</Button>
          </Grid>
        </CardActions>
      </form>
    </Card>
  );
}
