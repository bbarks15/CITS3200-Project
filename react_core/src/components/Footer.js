import React, { Component } from "react";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import theme from "../theme";

function Copyright() {
  return (
    <Typography variant="body2" color="secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://xytovet.com.au/">
        Xytovet
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

var style = {
  backgroundColor: "#282a2b",
  zIndex: theme.zIndex.drawer+1,
  textAlign: "center",
  padding: "15px",
  position: "fixed",
  left: "0",
  bottom: "0",
  height: "25px",
  width: "100%",
};






class Footer extends Component {
  render() {
    return (
        <div style={style}>
          <Copyright />
        </div>
    );
  }
}

export default Footer;
