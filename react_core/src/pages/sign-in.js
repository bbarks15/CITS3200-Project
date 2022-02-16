import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LogoFinal from "../images/LogoFinal.png";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useHistory } from "react-router-dom";
import EmailValidator from 'email-validator';
import LoadingSpinner from "../components/LoadingSpinner";

import AuthService from "../services/auth.service";
import Alert from "@material-ui/lab/Alert";
import { Collapse } from "@material-ui/core";
import EmailField from "../components/EmailField";
import PasswordField from "../components/PasswordField";

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

export default function SignIn() {
  const history = useHistory();
  const classes = useStyles();

  const [email, setEmail] = React.useState({
    value: '', errorText: '',
  });
  const [password, setPassword] = React.useState({
    value: '', errorText: '',
  });
  const [formError, setFormError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);


  const handleLogin = (ev) => {
    ev.preventDefault();
    if (EmailValidator.validate(email.value) && password.value) {
      setIsLoading(true);
      AuthService.login(email.value, password.value)
        .then(() => { history.push('/home') })
        .catch(e => {
          if (e.response && e.response.status === 401) {
            setFormError('Invalid credentials, check that your email or password are correct and please try again.');
          } else {
            setFormError('A fatal error occured processing your request, please try again later.');
          }
          setIsLoading(false);
        });
    } else {
      if (!EmailValidator.validate(email.value))
        setEmail({ ...email, ...{ errorText: 'Please enter a valid email address' } });
      if (!password.value)
        setPassword({ ...password, ...{ errorText: 'Enter a password' } });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <LoadingSpinner isLoading={isLoading} />
      <div className={classes.paper}>
        <img alt="Logo" src={LogoFinal} className={classes.logo} />
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={handleLogin} noValidate>
          <Box mb={2}>
            <Collapse in={!!formError}>
              <Alert severity="error">{formError}</Alert>
            </Collapse>
          </Box>
          <EmailField email={email} setEmail={setEmail} />
          <PasswordField password={password} setPassword={setPassword} />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          > Sign In </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/password_reset" variant="body2">
                Forgot password?
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
