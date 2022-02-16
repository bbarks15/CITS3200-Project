import React, { Fragment } from "react";
import { Box, Grid } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'


import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card'
import { CardContent, CardActions } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  grow: {
    height: '100%'
  },
}));

function getStatusColor(status) {
  if (status === "Complete")
    return "success.main";
  else
    return "warning.main";
};

export default function ProjectSummary(props) {
  const { project, tests } = props;
  const classes = useStyles();
  console.log(project);

  return (
    <Fragment>
      <Grid item xs={12} md={9}>
        <Card elevation={3} className={classes.grow}>
          <CardContent>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="h4" color="primary">Project Details</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" color="textSecondary">Project</Typography>
                <Typography variant="h5">{project.project_name !== '' ? project.project_name : `GA_${project.id}`}</Typography>
                <Typography variant="h6" color="textSecondary">Last Modified</Typography>
                <Typography variant="h5">{project.status_date ?? "no milestones recorded"}</Typography>

              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" color="textSecondary">Samples</Typography>
                <Typography variant="h5">{project.samples.length} </Typography>
                <Typography variant="h6" color="textSecondary">Comment</Typography>
                <Typography variant="h5">{project.project_comment ?? "no comments"} </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs md={3}>
        <Card elevation={3} className={classes.grow}>
          <CardContent>
            <Typography variant="h4" color="primary">Progress</Typography>
            <Grid container>
              <Grid item xs={6} md={12}>
                <Typography variant="h6" color="textSecondary">Status</Typography>
                <Box color={getStatusColor(project.project_status)} >
                  <Typography variant="h5" >{project.project_status ?? "In progress"}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={12}>
                <Typography variant="h6" color="textSecondary">Tests completed</Typography>
                <Typography variant="h5">{tests.test_count ? `${tests.test_complete} of ${tests.test_count}` : 'No tests lodged.'}</Typography>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Button color="primary" aria-label="back" variant="outlined" disabled={project.report_link ? false : true} href={project.report_link}>
              Download Report
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Fragment>
  );
}