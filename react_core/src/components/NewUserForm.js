

import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@material-ui/core";
import { APIService } from "../services/api.service";
import EmailField from "./EmailField";
import GenericField from "./GenericField";
import { displayAlert } from "./Notification";

const style = (theme) => ({
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
    margin: "auto",
    height: "100%",
    color: theme.palette.text.secondary,
  },
  button: {
    marginLeft: theme.spacing(1),
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

class ProfileForm extends Component {
  state = {
    loading: false,
    email: { value: '' }, phone: { value: '' },
    company: { value: '' }, ABN: { value: '' },
    address: { value: '' }, address2: { value: '' },
    notifications: { value: '' },
  }

  constructor(props) {
    super(props);
    this.addUser = this.addUser.bind(this);
  }


  add(field) {
    return ({ [field]: this.state[field].value ?? '' });
  }

  addUser(ev) {
    ev.preventDefault();
    this.setState({ loading: true });
    const { email } = this.state;
    if (!email.value)
      this.setState({ email: { value: '', errorText: 'Enter an email' } });

    if (email.value) {
      const client = {
        company: this.props.client.company,
        email: email.value,
      };
      const body = Object.assign(client,
        this.add('phone'),
        this.add('ABN'),
        this.add('address'),
        this.add('address2'),
      );
      APIService.post(`/user/create`, body)
        .then(() => {
          this.props.onSubmit(client, 2);
        })
        .catch((e) => displayAlert(e.response ? e.response.data.message : 'Failed to create user!', 'error'))
        .finally(this.setState({ loading: false }));
    }
    else {
      this.setState({ loading: false });

    }
  }

  getClient(id) {
    if (id) {
      APIService.get(`/client/${id}`)
        .then(res => res.data)
        .then(user => {
          const newState = Object.keys(user)
            .map((x) => { return { [x]: { value: user[x], errorText: '' } } })
            .reduce((obj, val) => { return { ...obj, ...val } });
          this.setState(newState, console.log(this.state))
        })
        .catch(() => displayAlert('Failed to fetch user!', 'error'));
    }
    else {
      this.setState({
        email: { value: '' }, phone: { value: '' },
        company: { value: this.props.client.company }, ABN: { value: '' },
        address: { value: '' }, address2: { value: '' },
        notifications: { value: '' },
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.client.id !== prevProps.client.id)
      this.getClient(this.props.client.id);
  }


  componentDidMount() {
    this.getClient(this.props.client.id);
  }

  render() {
    const { email, phone, ABN, address2, address, company, loading } = this.state;
    const { classes, onSubmit, client } = this.props;
    const isNewClient = !client.id;
    return (
      <form className={classes.form} onSubmit={this.addUser} noValidate>
        <CardContent>
          <Typography color="primary" variant="h4">
            {isNewClient ? 'Create Client' : 'Verify Client'}
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h6">Company Details</Typography>
            </Grid>
            <Grid container item spacing={1}>
              <Grid item xs={7} md={9}>
                <GenericField variant="standard"
                  required disabled
                  label="Company Name"
                  field={company}
                />
              </Grid>
              <Grid item xs={5} md={3}>
                <GenericField variant="standard"
                  disabled={!isNewClient}
                  label="ABN"
                  field={ABN}
                  setField={(ev) => this.setState({ ABN: ev })}
                />
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Address</Typography>
            </Grid>
            <Grid item xs={12}>
              <GenericField variant="standard"
                disabled={!isNewClient}
                label="Primary Address"
                field={address}
                setField={(ev) => this.setState({ address: ev })}
              />
            </Grid>
            <Grid item xs={12}>
              <GenericField variant="standard"
                disabled={!isNewClient}
                label="Secondary Address"
                field={address2}
                setField={(ev) => this.setState({ address2: ev })}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Contact Details</Typography>
            </Grid>
            <Grid container item spacing={1}>
              <Grid item xs={12} md={8}>
                <EmailField disabled={!isNewClient} email={email} setEmail={(ev) => { this.setState({ email: ev }) }} variant="standard" />
              </Grid>
              <Grid item xs={12} md={8}>
                <GenericField variant="standard"
                  disabled={!isNewClient}
                  label="Phone"
                  field={phone}
                  setField={(ev) => this.setState({ phone: ev })}
                />
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button variant="text" color="primary" onClick={() => onSubmit('', 0)}> Back</Button>
          <Button variant="contained" color="primary" type="submit" disabled={loading}> Create User
              {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
          </Button>
        </CardActions>
      </form>
    );
  }
}

export default withStyles(style, { withTheme: true })(ProfileForm);