import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

import Divider from '@material-ui/core/Divider';
const drawerWidth = 360;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
}));


export default function FilterDrawer() {
  const classes = useStyles();

  return (
    <div className={classes.drawerContainer} 
    >

      <Drawer
        variant="permanent"
        classes={{
          root: classes.drawer,
          paper: classes.drawerPaper,
        }}
        PaperProps={{elevation:8}}
      >
        <Divider />
        <Divider />
      </Drawer>
    </div>
  );
}




