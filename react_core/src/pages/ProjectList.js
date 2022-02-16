import React from "react";
import { Box, Chip, Divider, Fab, Grid, Hidden, TableContainer, Toolbar } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button'
import Drawer from '@material-ui/core/Drawer';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import CheckboxFilter from "../components/CheckboxFilter.js";
import { APIService } from "../services/api.service";
import LoadingSpinner from "../components/LoadingSpinner";
import NotifyMenu from "../components/NotifyMenu.js";
import { FilterList } from "@material-ui/icons";
import { displayAlert } from "../components/Notification.js";

const drawerWidth = 360;

const style = theme => ({
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
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  spacer: { height: '147px' },
  divider: {
    margin: theme.spacing(2, 0),
  },
  filterButton: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  button: {
    marginLeft: theme.spacing(1),
  },
  table: {
    minWidth: 560,
  }
});

class ProjectList extends React.Component {
  state = {
    status_filter: {
      opts: [],
      sel: []
    },
    comment_filter: {
      opts: [],
      sel: [],
    },
    project_list: [],
    isLoading: true,
    dialogContext: { open: false },
    showFilters: false,
  }

  handleChange = (target) => {
    const name = target.name;
    const value = target.value;
    this.setState({ [name]: value }, () => this.applyFilters());
  }

  initFilters(projects) {
    const status_opts = [...new Set(projects.map(x => x.status ?? "In progress"))];
    const comment_opts = [...new Set(projects.map(x => x.comment ? "Has comment" : "No comment"))];
    this.setState({
      status_filter: {
        opts: status_opts,
        sel: status_opts,
      },
      comment_filter: {
        opts: comment_opts,
        sel: comment_opts,
      },
    })
  };

  resetFilters() {
    if (this.data.length === 0) return;
    this.setState({ isLoading: true });
    const { status_filter, comment_filter } = this.state;

    this.setState({
      project_list: this.data,
      isLoading: false,
      status_filter: {
        opts: status_filter.opts,
        sel: status_filter.opts,
      },
      comment_filter: {
        opts: comment_filter.opts,
        sel: comment_filter.opts,
      },
    });
  };

  applyFilters() {
    this.setState({ isLoading: true });
    const { status_filter, comment_filter } = this.state;
    const filtered = this.data.filter(row =>
      status_filter.sel.includes(row.status ?? "In progress")
      && comment_filter.sel.includes(row.comment ? "Has comment" : "No comment")
    );
    this.setState({ project_list: filtered, isLoading: false });
  };

  fetchProjects(useCache = true) {
    const id = this.props.match.params.client_id;
    if (id) {
      APIService.get(`/user/${id}`)
        .then(res => this.setState({ client: res.data.company }))
        .catch((e) => displayAlert(e.response ? e.response.data.message : 'OOP! Something went wrong.', 'error'));
    }
    APIService.get(id ? `/user/${id}/projects` : '/project', { cache: { ignoreCache: !useCache } })
      .then(res => res.data)
      .then(data => {
        const projects = data.projects.sort((a, b) => (b.ga_number - a.ga_number));
        this.setState({ project_list: projects });
        this.data = projects;
        this.initFilters(projects);
      })
      .catch((e) => displayAlert(e.response ? e.response.data.message : 'OOP! Something went wrong.', 'error'))
      .finally(this.setState({ isLoading: false }));
  }

  componentDidMount() {
    this.fetchProjects();
  }


  getEmailChip(notifications_sent) {
    if (notifications_sent.completed)
      return 'Completed';
    else if (notifications_sent.lodged)
      return 'Lodged';
    else if (notifications_sent.recieved)
      return 'Recieved';
    else
      return 'None';
  }



  render() {
    const id = this.props.match.params.client_id;
    const url = id ? '/admin/projects' : '/projects';
    const { location, classes } = this.props;
    const { status_filter, comment_filter } = this.state;

    const drawBody = (
      <Box className={classes.content}>
        <Typography variant="h5" color="primary">Project Filters</Typography>
        <Divider />

        {/* <CheckboxFilter options={subprojects} name="subprojects" value={state.subprojects} onChange={handleChange} /> */}
        <CheckboxFilter filter={status_filter} name="status_filter" label="Status" onChange={this.handleChange} />
        <CheckboxFilter filter={comment_filter} name="comment_filter" label="Comments" onChange={this.handleChange} />

        <div className={classes.divider} />

        <Grid container spacing={1} justify="flex-end">
          <Grid item>
            <Button variant="outlined" color="primary" size="small" onClick={() => this.resetFilters()}>Reset</Button>
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

          <TableContainer elevation={3} component={Paper}>
            <Toolbar>
              <Typography variant="h4" color="primary" >Projects{id ? ` for ${this.state.client ?? ''}` : ''}</Typography>
            </Toolbar>
            <Table p={3} className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Ref.</TableCell>
                  <TableCell align="left">Project</TableCell>
                  <TableCell align="left">Comment</TableCell>
                  <TableCell align="right">Status</TableCell>
                  <TableCell align="right">Last updated</TableCell>
                  {id && <TableCell align="right">Latest Email Sent</TableCell>}
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.project_list.length === 0 &&
                  <TableRow>
                    <TableCell align="center" colSpan={7}><Typography variant="h6">No projects</Typography></TableCell>
                  </TableRow>
                }
                {this.state.project_list.map((row) => (
                  <TableRow key={row.ga_number}>
                    <TableCell component="th" scope="row">
                      {row.ga_number}
                    </TableCell>
                    <TableCell align="left">{row.project !== '' ? row.project : `GA_${row.ga_number}`}</TableCell>
                    <TableCell align="left">{row.comment ?? "-"}</TableCell>
                    <TableCell align="right">{row.status ?? "In progress"}</TableCell>
                    <TableCell align="right">{row.date_modified ?? "N/A"}</TableCell>
                    {id && <TableCell align="right">
                      <Chip size="small" color="primary" label={this.getEmailChip(row.notifications_sent)} />
                    </TableCell>}
                    <TableCell align="right">
                      <Link to={{ pathname: `${url}/${row.ga_number}`, state: { from: location.pathname } }}>
                        <Button variant="outlined" color="primary" size="small">Details</Button>
                      </Link>
                      {id &&
                        <NotifyMenu project={row} onRefresh={() => { this.fetchProjects(false); this.applyFilters(); }} />
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </TableContainer>
          <Hidden mdUp>
            <div className={classes.divider}></div>
            <Fab onClick={() => this.setState({ showFilters: !this.setState.showFilters })} variant="extended" className={classes.filterButton} color="primary">
              <FilterList />
             Filters
             </Fab>
          </Hidden>
        </Box>
        {/* <Footer /> */}
      </main >
    );
  }
}

export default withStyles(style, { withTheme: true })(ProjectList);
