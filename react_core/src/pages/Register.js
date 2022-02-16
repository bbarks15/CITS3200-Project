
import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";

import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import LogoFinal from "../images/LogoFinal.png";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useParams, useLocation } from "react-router-dom";
import AuthService from "../services/auth.service";
import { displayAlert } from "../components/Notification";
import PasswordField from "../components/PasswordField";
import Alert from "@material-ui/lab/Alert";
import { Collapse } from "@material-ui/core";
import qs from 'qs';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://xytovet.com.au/">
        Xytovet
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  logo: {
    width: "100%",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },

}));

export default function Register() {
  const classes = useStyles();
  const { token } = useParams();
  const location = useLocation();
  const { email } = qs.parse(location.search, { ignoreQueryPrefix: true });
  const [password1, setPassword1] = React.useState({
    value: '', errorText: '',
  });
  const [password2, setPassword2] = React.useState({
    value: '', errorText: '',
  });
  const [formError, setFormError] = React.useState('');

  const handlePasswordReset = (ev) => {
    ev.preventDefault();
    if (password1.value && (password1.value === password2.value)) {
      AuthService.AuthProvider.patch(`/password?email=${email}`, {
        token: token,
        password: password1.value,
      })
        .then( () => AuthService.login(email,password1.value)
          .then( () => displayAlert('Password set successfully.', 'success', '/home') )
        )
        .catch(e => {
          if (e.response.status === 401)
            setFormError('Invalid request, this link has expired or already been used.');
          else
            setFormError('A fatal error occured processing your request, please try again later.');
        })
      return;
    }
    if (!password1.value)
      setPassword1({ ...password1, ...{ errorText: 'Enter a password' } });
    if (!password2.value)
      setPassword2({ ...password2, ...{ errorText: 'Enter a password' } });
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <img alt="Logo" src={LogoFinal} className={classes.logo} />
        <Typography component="h1" variant="h5">
          Welcome 
        </Typography>
        <Typography  variant="body1">
          Welcome to the Xytovet client portal. Please set a password to continue.
        </Typography>
        <form className={classes.form} onSubmit={handlePasswordReset} noValidate>
          <Box mb={2}>
            <Collapse in={!!formError}>
              <Alert severity="error">{formError}</Alert>
            </Collapse>
          </Box>
          <PasswordField label="New Password" password={password1} setPassword={setPassword1} />
          <PasswordField label="Confirm Password" password={password2} setPassword={setPassword2} match={password1.value}/>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Submit
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}


