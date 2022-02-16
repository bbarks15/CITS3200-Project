

import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  Typography,
} from "@material-ui/core";
import { ClearOutlined, EditOutlined, SaveOutlined } from "@material-ui/icons";
import { APIService } from "../services/api.service";
import EmailField from "./EmailField";
import GenericField from "./GenericField";
import DangerButton from "./DangerButton";
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
});

class ProfileForm extends Component {
  state = {
    user: null,
    edit: false,
    email: null, phone: null,
    company: null, ABN: null,
    address: null, address2: null,
    notifications: null,
  }

  constructor(props) {
    super(props);
    this.handleProfileUpdate = this.handleProfileUpdate.bind(this);
  }
  resetForm() {
    const user = this.props.user;
    if (!user) return;
    const newState = Object.keys(user)
      .map((x) => { return { [x]: { value: user[x], errorText: '' } } })
      .reduce((obj, val) => { return { ...obj, ...val } });
    this.setState(newState);
  }


  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user !== this.props.user) {
      this.resetForm();
    }
  }

  add(field) {
    const { user } = this.props;
    return (this.state[field].value !== user[field]) ? { [field]: this.state[field].value } : null;
  }

  handleProfileUpdate(ev) {
    ev.preventDefault();
    const id = this.props.user.id;
    const body = Object.assign({},
      this.add('email'),
      this.add('company'),
      this.add('ABN'),
      this.add('phone'),
      this.add('address'),
      this.add('address2'),
      this.add('notifications'),
    );
    if (JSON.stringify(body) === '{}') {
      this.setState({ edit: false })
    }
    else {
      APIService.patch(id ? `/user/${id}` : `/user`, body)
        .then(() => {
          this.props.onRefresh(false);
          this.setState({ edit: false })
          displayAlert('User profile updated!', 'success')
        })
        .catch(() => displayAlert('Failed to update user!', 'error'));
    }
  }

  render() {
    const { edit, email, phone, ABN, address2, address, company, notifications } = this.state;
    const { classes } = this.props;
    return (
      <Card elevation={6} className={classes.card}>
        <form className={classes.form} onSubmit={this.handleProfileUpdate} noValidate>
          <CardContent>
            <Typography color="primary" variant="h4">
              Profile
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="h6">Company Details</Typography>
              </Grid>
              <Grid container item spacing={1}>
                <Grid item xs={7} md={9}>
                  <GenericField variant="standard"
                    disabled={!edit} required={true}
                    label="Company Name"
                    field={company}
                    setField={(ev) => this.setState({ company: ev })}
                  />
                </Grid>
                <Grid item xs={5} md={3}>
                  <GenericField variant="standard"
                    disabled={!edit} required={true}
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
                  disabled={!edit} required={true}
                  label="Primary Address"
                  field={address}
                  setField={(ev) => this.setState({ address: ev })}
                />
              </Grid>
              <Grid item xs={12}>
                <GenericField variant="standard"
                  disabled={!edit}
                  label="Secondary Address"
                  field={address2}
                  setField={(ev) => this.setState({ address2: ev })}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6">Contact Details</Typography>
              </Grid>
              <Grid container item spacing={1}>
                <Grid item xs={12} sm={7} md={8}>
                  <EmailField disabled={!edit} email={email} setEmail={(ev) => { this.setState({ email: ev }) }} variant="standard" />
                </Grid>
                <Grid item xs={12} sm={5} md={4}>
                  <GenericField variant="standard"
                    disabled={!edit}
                    label="Phone"
                    field={phone}
                    setField={(ev) => this.setState({ phone: ev })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={(notifications && notifications.value) ?? false}
                        onChange={(ev) => { this.setState({ notifications: { value: ev.target.checked } }) }}
                        disabled={!edit} color="primary"
                      />}
                    label="Receive Notifications"
                  />
                  <FormHelperText>
                    I would like to recieve email notifications informing me when my jobs have been recieved, processed, and completed.
                    </FormHelperText>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Grid container direction="row" justify="flex-end" alignItems="flex-start">
              {edit && <Fragment>
                <DangerButton
                  startIcon={<ClearOutlined />}
                  onClick={() => { this.resetForm(); this.setState({ edit: false }) }}
                  className={classes.button}>
                  Cancel
                </DangerButton>
                <Button
                  type="submit" variant="outlined" color="primary"
                  onClick={this.handleProfileUpdate}
                  startIcon={<SaveOutlined />}
                  className={classes.button}>
                  save
                </Button>
              </Fragment>}
              {!edit && <Button
                variant="contained" color="primary"
                onClick={() => { this.setState({ edit: true }) }}
                startIcon={<EditOutlined />}
                className={classes.button}>
                edit
              </Button>}
            </Grid>
          </CardActions>
        </form>
      </Card>
    );
  }
}

export default withStyles(style, { withTheme: true })(ProfileForm);