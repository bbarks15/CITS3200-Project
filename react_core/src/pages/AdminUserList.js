
import React, { Fragment } from "react";
import { Toolbar, Container, Chip, TableContainer} from "@material-ui/core";
import { withStyles, makeStyles,} from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button'

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { red } from "@material-ui/core/colors";

import { EditOutlined, Delete, PersonAddOutlined, ListAlt, Check, Close } from '@material-ui/icons';
import { green } from '@material-ui/core/colors';

import { APIService } from "../services/api.service";
import { UserContext } from "../services/auth.service";
import UserDeleteDialog from "../components/UserDeleteDialog";
import LoadingSpinner from "../components/LoadingSpinner";
import DangerButton from "../components/DangerButton";

const style = (theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  spacer: { height: "147px" },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  table: {
    minWidth: 650,
  },
});




const UserChip = withStyles((theme) => ({
  colorSecondary: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.secondary.main,
  },
}))(Chip);

const useRowStyles = makeStyles((theme) => ({
  button: {
    marginLeft: theme.spacing(1),
  },
  chip_admin: {
    backgroundColor: red,
  },
}));

function UserRow(props) {
  const { user, onDeleteAction } = props;
  const classes = useRowStyles();
  const userContext = React.useContext(UserContext);
  return (
    <TableRow key={`user_${user.id}`}>
      <TableCell align="left">{user.company}</TableCell>
      <TableCell align="left">{user.email}</TableCell>
      <TableCell align="left">{user.ABN}</TableCell>
      <TableCell align="left">
        <UserChip size="small" label={user.isAdmin ? 'admin' : 'client'}
          color={user.isAdmin ? "secondary" : "primary"} />
      </TableCell>
  <TableCell align="center">{user.notifications ? <Check style={{ color: green[500] }}/>  : <Close color="error"/>}</TableCell>
      <TableCell align="right">
        {(userContext && userContext.email !== user.email) &&
          <Fragment>
            <Link to={`/admin/client/${user.id}/projects`}>
              <Button
                color="primary"
                aria-label="view-user"
                size="small"
                variant="outlined"
                startIcon={<ListAlt />}
              > View Projects
              </Button>
            </Link>
            <Link to={`/admin/user/${user.id}`}>
              <Button
                className={classes.button}
                color="primary"
                aria-label="view-user"
                size="small"
                startIcon={<EditOutlined />}
                variant="outlined"
              > Edit
              </Button>
            </Link>
            <DangerButton
              className={classes.button}
              aria-label="delete-user"
              size="small"
              variant="contained"
              disableElevation
              startIcon={<Delete />}
              onClick={() => onDeleteAction()}
            > Delete
            </DangerButton>
          </Fragment>
        }
      </TableCell>
    </TableRow>
  );
}

class AdminUserList extends React.Component {
  state = {
    isLoading: true,
    dialogData: { open: false },
    users: [],
  };

  constructor(props) {
    super(props);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
  }

  fetchUsers(useCache = true) {
    APIService.get(`/user`, { cache: { ignoreCache: !useCache } })
      .then(res => {
        this.setState({
          users: res.data,
          isLoading: false
        });
      });
  }

  componentDidMount() {
    this.fetchUsers(false);
  }

  handleOpenDialog(user) {
    this.setState({ dialogData: { open: true, user: user } });
  }

  handleCloseDialog() {
    this.fetchUsers(false);
    this.setState({ dialogData: { open: false, user: null } });
  }

  render() {
    const { classes } = this.props;
    const { users, dialogData } = this.state;

    return (
      <main className={classes.root}>
        <LoadingSpinner isLoading={this.state.isLoading}/>
        <UserDeleteDialog context={dialogData} onClose={this.handleCloseDialog} />

        <Container className={classes.content}>
          <TableContainer elevation={3} component={Paper}>
            <Toolbar>
              <Typography variant="h4" color="primary" className={classes.title}>Users</Typography>
              <Link to="/admin/user">
                <Button color="primary" aria-label="add-user" size="small" startIcon={<PersonAddOutlined />} variant="outlined">
                  Add User
                </Button>
              </Link>
            </Toolbar>
            <Table p={3} className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Company</TableCell>
                  <TableCell align="left">Email</TableCell>
                  <TableCell align="left">ABN</TableCell>
                  <TableCell align="left">Type</TableCell>
                  <TableCell allign="center">Recieve Notifications</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <UserRow key={`user_${user.id}`} user={user} onDeleteAction={() => this.handleOpenDialog(user)}></UserRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
        {/* <Footer /> */}
      </main>
    );
  }
}

export default withStyles(style, { withTheme: true })(AdminUserList);
