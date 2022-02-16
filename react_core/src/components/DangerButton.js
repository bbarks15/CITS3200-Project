
import Button from '@material-ui/core/Button'
import { withStyles} from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';

const DangerButton = withStyles((theme) => ({
  contained: {
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.error.main,
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
    },
  },
  outlined: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    "&:hover": {
      color: theme.palette.error.dark,
      borderColor: theme.palette.error.dark,
      backgroundColor: red[50],
    },
  },
  text: {
    color: theme.palette.error.main,
    "&:hover": {
      color: theme.palette.error.dark,
      backgroundColor: red[50],
    }
  }
}))(Button);

export default DangerButton;