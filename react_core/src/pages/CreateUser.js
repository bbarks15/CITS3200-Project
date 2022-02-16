
import React, { useEffect } from "react";
import {
  Button, CardActions, CardContent,
  CircularProgress, Container, makeStyles,
  Step, StepContent, StepLabel,
  Stepper, TextField, Typography
} from "@material-ui/core";

import { APIService } from "../services/api.service";
import { displayAlert } from "../components/Notification.js";
import { Alert, AlertTitle, Autocomplete } from "@material-ui/lab";
import NewUserForm from "../components/NewUserForm";
import { Link } from "react-router-dom";


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
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function CreateUser() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [client, setClient] = React.useState({});
  const [clientList, setClientList] = React.useState([]);

  const sendWelcome = () => {
    setLoading(true);

    APIService.post('/user/register', {
      email: client.email,
      callback: `${window.location.origin}/register`
    })
      .then(res => setClientList(res.data.client_list))
      .catch((e) => displayAlert(e.response ? e.response.data.message : 'OOP! Something went wrong.', 'error'))
      .finally(() => { setLoading(false); setActiveStep(3) });
  }
  const fetchClients = () => {
    APIService.get('/client')
      .then(res => setClientList(res.data.client_list))
      .catch((e) => displayAlert(e.response ? e.response.data.message : 'OOP! Something went wrong.', 'error'));
  };

  useEffect(fetchClients, []);

  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step key="select_client">
          <StepLabel>Select a client</StepLabel>
          <StepContent>

            <CardContent>
              <Alert severity="info"> <AlertTitle>Link a client</AlertTitle>
                <Typography>Enter a client name here. If the client already exists in
                the LIMS system their account will be created using their current details,
                  otherwise you fill be prompted to create the client in the next step.</Typography>
              </Alert>
              <Autocomplete
                freeSolo autoSelect
                clearOnBlur={false}
                options={clientList}
                renderOption={(option) => option.company}
                getOptionLabel={o => o.company ?? o}
                onChange={(ev, val) => {
                  if (typeof val === 'string') {
                    const c = clientList.find(o => o.company === val);
                    setClient(c ?? { company: val });
                  }
                  else
                    setClient(val);
                }}
                renderInput={(params) => <TextField {...params} label="Client" variant="outlined" margin="normal" />}
              />
            </CardContent>
            <CardActions>
              <Button variant="text" disabled color="primary"> Back</Button>
              <Button variant="contained" color="primary" disabled={!(client && client.company)} onClick={() => setActiveStep(1)}> Next</Button>
            </CardActions>
          </StepContent>
        </Step>

        <Step key="fill_details">
          <StepLabel>Client Details</StepLabel>
          <StepContent>
            <NewUserForm client={client} onSubmit={(c, n) => { setClient(c); setActiveStep(n); }} />
          </StepContent>
        </Step>

        <Step key="notify">
          <StepLabel>Notify User</StepLabel>
          <StepContent>
            <CardContent>
              <Alert severity="success"> <AlertTitle>User successfully created!</AlertTitle>
                <Typography>A new user has be created for <strong> {client && client.company}</strong>.
                    Account activation instructions will now be sent to the user's email address {client && client.email}.</Typography>
              </Alert>
            </CardContent>
            <CardActions>
              <Button variant="outlined" color="primary" onClick={() => setActiveStep(3)}> Skip</Button>

              <Button variant="contained" color="primary" disabled={loading} onClick={() => sendWelcome()}>Send Email
              {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
              </Button>
            </CardActions>
          </StepContent>
        </Step>
        <Step key="finish">
          <StepLabel>Finish</StepLabel>
          <StepContent>
            <CardContent>
              <Alert severity="info"> <AlertTitle>All done!</AlertTitle>
                <Typography> You can now close this form or start over to add another user.</Typography>
              </Alert>
            </CardContent>
            <CardActions>
              <Link to='/admin'>
                <Button variant="contained" color="primary"> Finish</Button>
              </Link>
            </CardActions>
          </StepContent>
        </Step>

      </Stepper>
    </Container >
  );
}
