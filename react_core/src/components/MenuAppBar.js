import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import LogoFinal from "../images/LogoFinal.png";
import { withRouter, useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import { ExitToAppOutlined } from '@material-ui/icons';
import NavTabs from "./NavTabs";
import authService from "../services/auth.service";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  root: {
    display: "flex",
    flexGrow: 1,
  },
  logo: {
    [theme.breakpoints.up('sm')]: {
      maxWidth: 160,
    },
    [theme.breakpoints.down('sm')]: {
      maxWidth: 90,
    }
  },
  logout: {
    position: "absolute",
    top: "50%",
    right: "10px",
    transform: "translate(-10%, -100%)",
  },
  title: {
    flexGrow: 1,
  },
  toolbar: {
    alignItems: "flex-start",
    flexDirection: "column",
    padding: 0,
    paddingTop: theme.spacing(1),
    position: "relative",
  },
  spacer: { height: "147px" },
  nav: {
    backgroundColor: theme.palette.primary.main,
    width: "100%",
  },
  topbar: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-between",
  },
}));
const MenuAppBar = (props) => {
  const history = useHistory();
  const classes = useStyles();
  const handleLogout = () => {
    authService.logout();
    history.push("/login");
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar} color="secondary">
        <Toolbar className={classes.toolbar}>
          <div className={classes.topbar}>
            <img src={LogoFinal} alt="logo" className={classes.logo} />
            <Button onClick={handleLogout} 
                    className={classes.logout} 
                    size="large" 
                    endIcon={<ExitToAppOutlined />} >
              Logout
            </Button>
          </div>

          <div className={classes.nav}>
            <NavTabs />
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.spacer} />
    </div>
  );
};

export default withRouter(MenuAppBar);
