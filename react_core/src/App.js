import React, { Component, Fragment } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";
import SignIn from "./pages/sign-in";
import Home from "./pages/Home";
import ProjectList from "./pages/ProjectList";
import ProjectDetails from "./pages/ProjectDetails";
import MenuAppBar from "./components/MenuAppBar";
import Notification, { setupAlertHandler } from "./components/Notification";
import Profile from "./pages/Profile";
import AuthService, { UserContext } from "./services/auth.service";
import setupAPI, { APIService } from "./services/api.service";
import { createBrowserHistory } from 'history';
import AdminUserList from "./pages/AdminUserList";
import CreateUser from "./pages/CreateUser";
import PasswordReset from "./pages/PasswordReset";
import Register from "./pages/Register";
import PasswordResetRequest from "./pages/PaswordResetRequest";
import { CssBaseline } from "@material-ui/core";

export const history = createBrowserHistory();
setupAPI.setupInterceptors(history);
setupAlertHandler(history);

class MainContent extends Component {
  state = null;

  fetchMe(useCache = true) {
    APIService.get('/me', { cache: { ignoreCache: !useCache } })
      .then(res => this.setState(res.data))
      .catch(() => {
        AuthService.logout();
        this.setState(null);
        history.push('/login');
      });
  }

  componentDidMount() {
    this.fetchMe();
  }

  render() {
    return (
      <UserContext.Provider value={this.state} >
        <MenuAppBar />
        <Switch>
          <Route exact path="/"><Redirect to="/home" /></Route>
          <Route exact path="/home" component={Home} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/projects" component={ProjectList} />
          <Route path="/projects/:project_id" component={ProjectDetails} />
          <Route exact path="/admin" component={AdminUserList} />
          <Route exact path="/admin/user" component={CreateUser} />
          <Route path="/admin/user/:user_id" component={Profile} />
          <Route path="/admin/client/:client_id/projects" component={ProjectList} />
          <Route path="/admin/projects/:project_id" component={ProjectDetails} />
        </Switch>
      </UserContext.Provider>
    );
  }
}

class App extends Component {

  render() {
    return (
      <Fragment>
        <CssBaseline />
        <ThemeProvider theme={theme}>
          <Notification history={history} />
          <Router history={history} >
            <Switch>
              {/* Public pages */}
              <Route exact path="/login" component={SignIn} />
              <Route exact path="/password_reset" component={PasswordResetRequest} />
              <Route path="/password_reset/:token" component={PasswordReset} />
              <Route path="/register/:token" component={Register} />
              {/* Protected content */}
              <PrivateRoute path="/" component={MainContent} />
            </Switch>
          </Router>
        </ThemeProvider>
      </Fragment>
    );
  }
}

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        AuthService.isAuth() ? (
          <Fragment>
            <Component {...props} {...rest} />
          </Fragment>
        ) : (
            <Redirect to="/login" />
          )
      }
    />
  );
}

export default App;
