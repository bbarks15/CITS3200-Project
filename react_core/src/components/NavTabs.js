import React, { useState, useEffect } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { APIService } from "../services/api.service";
import { useMediaQuery, useTheme } from "@material-ui/core";
import { displayAlert } from "./Notification";

const useStyles = makeStyles((theme) => ({
  MuiTabs: {
    color: theme.palette.background.default,
    [theme.breakpoints.up('md')]: {
      marginLeft: 360,
    }
  },
}));

export default function NavTabs() {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [user, setUser] = useState(null);
  const selected = "/" + history.location.pathname.split("/")[1];

  const fetchUser = () => {
    APIService.get("/me")
      .then((res) => setUser(res.data))
      .catch((e) => displayAlert(e.response ? e.response.data.message : 'OOP! Something went wrong.', 'error','/login'));
  }

  useEffect(fetchUser, []);

  if (!user) {
    return null;
  }

  return (
    <Tabs
      value={selected}
      onChange={history.push}
      aria-label="navigation"
      indicatorColor="secondary"
      variant={isDesktop ? 'standard' : 'fullWidth'}
      className={classes.MuiTabs}
    >
      <Tab
        disableRipple
        label="Home"
        value="/home"
        component={Link}
        to="/home"
      />
      {
        !(user && user.isAdmin) && (
          <Tab
            disableRipple
            label="Projects"
            value="/projects"
            component={Link}
            to="/projects"
          />)
      }

      <Tab
        disableRipple
        label="Profile"
        value="/profile"
        component={Link}
        to="/profile"
      />
      {
        user && user.isAdmin && (
          <Tab
            disableRipple
            label="Admin"
            value="/admin"
            component={Link}
            to="/admin"
          />
        )
      }
    </Tabs >
  );
}

