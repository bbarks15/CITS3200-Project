import React from "react";
import { Box, Fab, Grid, Hidden, Divider } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button'
import Drawer from '@material-ui/core/Drawer';

import Typography from "@material-ui/core/Typography";
import { ArrowBackIos } from "@material-ui/icons";
import CheckboxFilter from "../components/CheckboxFilter.js";
import { APIService } from "../services/api.service";
import SampleList from "../components/SampleList.js";
import ProjectSummary from "../components/ProjectSummary.js";
import { displayAlert } from "../components/Notification.js";
import LoadingSpinner from "../components/LoadingSpinner";
import { FilterList } from "@material-ui/icons";

const drawerWidth = 360;

const style = (theme) => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      display: 'flex'
    }
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  grow: {
    height: "100%",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  spacer: { height: "147px" },
  divider: {
    margin: theme.spacing(2, 0),
  },
  filterButton: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
});

class ProjectDetails extends React.Component {
  state = {
    type_filter: {
      opts: [],
      sel: [],
    },
    comment_filter: {
      opts: [],
      sel: [],
    },
    tests: [],
    isLoading: true,
    filtered_samples: [],
    project: { samples: [] },
    showFilters: false,
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(target) {
    const name = target.name;
    const value = target.value;
    this.setState({ [name]: value }, () => this.applyFilters());
  }

  initFilters(samples) {
    const type_opts = [...new Set(samples.map((x) => x.sample_type ?? "Not specified"))];
    const comment_opts = [...new Set(samples.map(x => x.comment ? "Has comment" : "No comment"))];
    this.setState({
      type_filter: {
        opts: type_opts,
        sel: type_opts,
      },
      comment_filter: {
        opts: comment_opts,
        sel: comment_opts,
      },
    });
  }

  resetFilters() {
    if (!this.data || this.data.length === 0) return;
    this.setState({ isLoading: true });
    const { type_filter, comment_filter } = this.state;

    this.setState({
      filtered_samples: this.data,
      isLoading: false,
      type_filter: {
        opts: type_filter.opts,
        sel: type_filter.opts,
      },
      comment_filter: {
        opts: comment_filter.opts,
        sel: comment_filter.opts,
      },
    });
  }

  applyFilters() {
    this.setState({ isLoading: true });
    const { type_filter, comment_filter } = this.state;
    const filtered = this.data.filter((row) =>
      type_filter.sel.includes(row.sample_type ?? "Not specified")
      && comment_filter.sel.includes(row.comment ? "Has comment" : "No comment")
    );
    this.setState({ filtered_samples: filtered, isLoading: false });
  }

  fetchSamples() {
    const id = this.props.match.params.project_id;
    APIService.get(`/project/${id}/samples`)
      .then((res) => res.data)
      .then((data) => {
        this.initFilters(data);
        this.data = data;
        this.setState({
          filtered_samples: data,
          isLoading: false,
        });
      })
      .catch(e => this.setState({ filtered_samples: [], isLoading: false }));
  }

  componentDidMount() {
    const id = this.props.match.params.project_id;
    APIService.get(`/project/${id}`)
      .then((res) => res.data)
      .then((data) => {
        this.setState({ project: data });
        this.fetchSamples();
      })
      .catch((e) => {
        displayAlert(
          `${e.response.status}: ${e.response.statusText}`,
          "error",
          "/projects"
        );
      });
    APIService.get(`/project/${id}/tests`)
      .then((res) => res.data)
      .then((data) => this.setState({ tests: data }))
      .catch(e => this.setState({ tests: [] }));
  }

  render() {
    const { location, classes } = this.props;
    const { project, tests, filtered_samples } = this.state;
    const { type_filter, comment_filter } = this.state;

    const path = location.pathname.split("/")[1];
    const from = location.state ? location.state.from : '/projects';
    const drawBody = (
      <Box className={classes.content}>
        <Typography variant="h5" color="primary">
          Sample Filters
            </Typography>
        <Divider />

        <CheckboxFilter
          filter={type_filter}
          name="type_filter"
          label="Type"
          onChange={this.handleChange}
        />

        <CheckboxFilter filter={comment_filter} name="comment_filter" label="Comments" onChange={this.handleChange} />
        <div className={classes.divider} />

        <Grid container spacing={1} justify="flex-end">
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => this.resetFilters()}>
              Reset
            </Button>
          </Grid>
        </Grid>
      </Box>
    );

    return (
      <main className={classes.root}>
        <LoadingSpinner isLoading={this.state.isLoading} />
        <Hidden mdUp>
          <Drawer className={classes.drawer}
            variant="temporary"
            anchor="left"
            open={this.state.showFilters}
            classes={{ paper: classes.drawerPaper }}
            PaperProps={{ elevation: 8 }}
            onClose={() => this.setState({ showFilters: false })}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawBody}
          </Drawer>
        </Hidden>
        <Hidden smDown>
          <Drawer className={classes.drawer}
            variant="permanent"
            anchor="left"
            open
            classes={{ paper: classes.drawerPaper }}
            PaperProps={{ elevation: 8 }}
          >
            <div className={classes.spacer} />
            {drawBody}
          </Drawer>
        </Hidden>

        <Box className={classes.content}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Link to={path === "admin" ? from : "/projects"}>
                <Button
                  color="primary"
                  aria-label="back"
                  startIcon={<ArrowBackIos />}
                  variant="outlined"
                >
                  Return
                </Button>
              </Link>
            </Grid>
            <Grid container item spacing={3} justify={"space-between"}>
              <ProjectSummary project={project} tests={tests} />
              <SampleList samples={filtered_samples} />
            </Grid>
          </Grid>
          <Hidden mdUp>
            <div className={classes.divider}></div>
            <Fab onClick={() => this.setState({ showFilters: !this.setState.showFilters })} variant="extended" className={classes.filterButton} color="primary">
              <FilterList />
             Filters
             </Fab>
          </Hidden>
        </Box>
        {/* <Footer /> */}
      </main>
    );
  }
}

export default withStyles(style, { withTheme: true })(ProjectDetails);
