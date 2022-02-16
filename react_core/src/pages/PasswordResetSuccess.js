
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

export default function PasswordResetSuccess(email) {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <img alt="Logo" src={LogoFinal} className={classes.logo} />
        <Typography component="h1" variant="h5">
          Password Reset Email Sent
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" >
          We have sent an email to your email address {email}.
            Follow the instructions in the email to reset your password.
          </Typography>
        <Box mb={2}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}>
            Done
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/login" variant="body2">Back to login</Link>
            </Grid>
          </Grid>
        </Box>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

