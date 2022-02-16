import React from "react";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import { Card, CardContent, Container, Divider, Grid, Hidden, Paper } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import ProjectSummary from "../components/ProjectSummary";
import { Component } from "react";
import { APIService } from "../services/api.service";
import { displayAlert } from "../components/Notification";

const style = (theme) => ({
  paper: {
    marginTop: theme.spacing(0),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    textAlign: 'center',
    height: "100%"
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  spacer: { height: "147px" },
  divider: {
    margin: theme.spacing(2, 0),
  },
});

class Home extends Component {
  state = {
    tests: [],
    count: [],
  }

  componentDidMount() {
    APIService.get('/project')
      .then(res => res.data)
      .then(data => {
        const projects = data.projects.sort((a, b) => (b.ga_number - a.ga_number));
        const project = projects[0];
        APIService.get(`/project/${project.ga_number}`)
          .then(res => this.setState({ project: res.data }))
          .catch((e) => displayAlert(e.response ? e.response.data.message : 'OOP! Something went wrong.', 'error'));
        APIService.get(`/project/${project.ga_number}/tests`)
          .then(res => this.setState({ tests: res.data }))
          .catch(() => {});
      })
      .catch(() => {});
    APIService.get('/project/count')
      .then(res => { this.setState({ count: res.data }) })
      .catch(() => {});
  }

  render() {
    const { classes } = this.props;
    const { project, tests, count } = this.state;
    return (
      <main className={classes.root}>
        <Container className={classes.content}>
          <Grid container spacing={2}>
            <Grid container item spacing={3} justify={"space-between"}>
              <Grid item xs={12} md={8}>
                <Card elevation={3}>
                  <CardContent className={classes.paper}>
                    <Typography variant="h4" color="primary">Project Overview</Typography>
                    <Grid container justify="space-evenly">
                      <Grid item xs>
                        <Box color="warning.main" >
                          <Typography variant="h2" color="warning">{count.incomplete ?? '-'}</Typography>
                        </Box>
                        <Typography variant="caption">Projects</Typography>
                        <Typography variant="h5" color="textSecondary" >Incomplete</Typography>
                      </Grid>
                      <Grid item xs >

                        <Box color="success.main" >
                          <Typography variant="h2">{count.complete ?? '-'}</Typography>
                        </Box>
                        <Typography variant="caption">Projects</Typography>
                        <Typography variant="h5" color="textSecondary">Complete</Typography>
                      </Grid>
                      <Grid container item xs={1} justify="center" alignItems="center">
                        <Divider orientation="vertical"></Divider>
                      </Grid>
                      <Grid item xs >
                        <Typography variant="h2" color="primary">{count.total ?? '-'}</Typography>
                        <Typography variant="caption">Projects</Typography>
                        <Typography variant="h5" color="textSecondary">Total</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Hidden smDown>
                <Grid item xs={4}>
                  <Paper elevation={3} className={classes.paper}>
                    <CardContent>
                      <Typography variant="h4" color="primary">Welcome</Typography>
                      <Typography variant="body1" color="textSecondary">
                        Welcome to the <strong>Xytovet</strong> job status tracker.
                    </Typography>
                    </CardContent>
                  </Paper>
                </Grid>
              </Hidden>

            </Grid>

            <Grid item xs={12}><Divider p={5}></Divider></Grid>
            <Grid item xs={12}>
              <Typography variant="h3" color="primary">Most Recent Project</Typography>
            </Grid>

            <Grid container item spacing={3} justify={"space-between"}>
              {project && <ProjectSummary project={project} tests={tests} />}
              {project ?
                <Grid item xs={12}>
                  <Link to={`/projects/${project ? project.id : ''}`}>
                    <Button
                      color="primary"
                      variant="contained"
                      fullWidth
                    >
                      View Project Details
                </Button>
                  </Link>
                </Grid>
                :
                <Paper elevation={3} className={classes.paper}>
                  <CardContent>
                    <Typography variant="h5" color="primary">You do not have any projects yet!</Typography>
                  </CardContent>
                </Paper>
              }
            </Grid>
          </Grid>
        </Container>
      </main>

    );
  }
}

export default withStyles(style, { withTheme: true })(Home);