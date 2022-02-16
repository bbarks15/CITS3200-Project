import React, { useEffect } from "react";
import { Container, Grid, makeStyles} from "@material-ui/core";
import PasswordForm from "../components/PasswordForm";
import ProfileForm from "../components/ProfileForm";
import { useRouteMatch } from "react-router-dom";
import { UserContext } from "../services/auth.service";
import LoadingSpinner from "../components/LoadingSpinner";
import { APIService } from "../services/api.service";
import { displayAlert } from "../components/Notification.js";
import ProfileAdmin from "../components/ProfileAdmin";

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
}));

export default function Profile() {
  const match = useRouteMatch();
  const userContext = React.useContext(UserContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState({});

  const classes = useStyles();

  const fetchUser = (useCache = true) => {
    const id = match.params.user_id;
    APIService.get(id ? `/user/${id}` : `/me`, { cache: { ignoreCache: !useCache } })
      .then(res => {
        setUser(res.data);
      })
      .then(() => { setIsLoading(false) })
      .catch(() => 
        displayAlert("Could not load user","error",id ? "/admin" : "/home")
      );
  }

  useEffect(fetchUser, [match.params.user_id]);

  const showAdminPanel = userContext && userContext.isAdmin && user.email !== userContext.email;
  return (
    <main className={classes.root}>
      <LoadingSpinner isLoading={isLoading} />
      <Container className={classes.content}>
        <Grid container spacing={3}>
          <Grid item xs={showAdminPanel ? 9 : 12}>
            <ProfileForm user={user} onRefresh={fetchUser}/>
          </Grid>
          {showAdminPanel  &&
            <ProfileAdmin user={user} onRefresh={fetchUser}/>
          }
          <Grid item xs={12}>
            <PasswordForm match={match} user={user}/>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}
