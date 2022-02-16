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

import AuthService from "../services/auth.service";
import Alert from "@material-ui/lab/Alert";
import { Collapse } from "@material-ui/core";
import EmailField from "../components/EmailField";
import LoadingSpinner from "../components/LoadingSpinner";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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

export default function PasswordResetRequest() {
  const classes = useStyles();
  const [email, setEmail] = React.useState({ value: '', errorText: '' });
  const [formError, setFormError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [showDialog, setShowDialog] = React.useState(false);

  const handleFormSubmit = (ev) => {
    ev.preventDefault();
    if (email.value) {
      setIsLoading(true);
      AuthService.AuthProvider.post('/reset_password', {
        email: email.value,
        callback: `${window.location.href}`
      })
        .then(() => setShowDialog(true))
        .catch(e => {
          setIsLoading(false);
          if (e.response && e.response.status === 404)
            setFormError(`Could not find an account with the email ${email.value}.`);
          else
            setFormError('A fatal error occured processing your request, please try again later.');
        })
    }
    else {
      setEmail({ ...email, ...{ errorText: 'Please enter a valid email address' } });
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <LoadingSpinner isLoading={isLoading} />
      <Dialog open={showDialog}>
        <DialogTitle>Request Sent</DialogTitle>
        <DialogContent>
          <DialogContentText>
            We have sent an email to your email address {email.value}.
            Follow the instructions in the email to reset your password.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button href="/login" component="button" autoFocus color="primary">ok</Button>
        </DialogActions>
      </Dialog>
      <div className={classes.paper}>
        <img alt="Logo" src={LogoFinal} className={classes.logo} />
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        <form className={classes.form} onSubmit={handleFormSubmit} noValidate>
          <Typography variant="subtitle1" color="textSecondary" >
            Enter your email and we'll send you a link to reset your password.
          </Typography>
          <Box mb={2}>
            <Collapse in={!!formError}>
              <Alert severity="error">{formError}</Alert>
            </Collapse>
          </Box>
          <EmailField email={email} setEmail={setEmail} />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}>
            Submit
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/login" variant="body2">Back to login</Link>
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