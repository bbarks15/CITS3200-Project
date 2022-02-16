import React from "react";

import { Backdrop, CircularProgress, makeStyles} from "@material-ui/core";

const useStyle = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function LoadingSpinner({ isLoading }) {
  const classes = useStyle();
  return (
    <Backdrop className={classes.backdrop} open={isLoading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}