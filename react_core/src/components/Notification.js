import React, { Component } from "react";
import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { AlertTitle } from "@material-ui/lab";

function title(str) {
  return str.replace(/(^|\s)\S/g, function(t) { return t.toUpperCase() });
}

export default class Notification extends Component {
  state = { msg: null, open: false };

  componentDidMount() {
    const { history } = this.props;
    history.listen((location, action) => {
      if (location.state && location.state.msg)
        this.setState({ ...location.state, open: true });
    });
  }

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ open: false });
  };

  render() {
    const { open, msg } = this.state;
    return (
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        onClose={this.handleClose}
        autoHideDuration={6000}
      >
        <Alert
          elevation={6}
          severity={msg ? msg.type : "info"}
          onClose={this.handleClose}
        >
          <AlertTitle>{msg ? title(msg.type) : "Info"}</AlertTitle>
          {msg ? msg.text : ""}
        </Alert>
      </Snackbar>
    );
  }
}

let _history = null;

export function setupAlertHandler(history) {
  _history = history;
}

export function displayAlert(text, severity, redirect) {
  const path = redirect ?? _history.location.pathname;
  _history.push(path, { msg: { text: text, type: severity } });
}
