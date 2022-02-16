import React, { Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Box, Grid, Toolbar, Paper, Collapse, TableContainer } from "@material-ui/core";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { displayAlert } from "./Notification";
import { APIService } from "../services/api.service";

const style = (theme) => ({
  root: {
    display: "flex",
  },
});

function getTestState(test) {
  if (!test.started) return "Pending";
  else if (!test.result) return "In progress";
  else return "Complete";
};

class TestRow extends React.Component {
  render() {
    const { test } = this.props;
    const info = test.test_info ?? {};
    return (
      <TableRow>
        <TableCell>{`${info.target} (${info.type})` ?? "Not found"}</TableCell>
        <TableCell align="left">{test.comment ?? "-"}</TableCell>
        <TableCell align="right">{getTestState(test)}</TableCell>
        <TableCell align="right">{test.date}</TableCell>
        <TableCell align="right">{`${test.result ?? info.lod} ${info.uom}`}</TableCell>
      </TableRow>
    );
  }
}

class SampleRow extends React.Component {
  state = {
    open: false,
    tests: [],
  };

  componentDidMount() {
    const id = this.props.sample.ed_number;
    APIService.get(`/samples/${id}/tests`)
      .then((res) => res.data)
      .then((data) => this.setState({ tests: data }))
      .catch((e) => displayAlert(e.response ? e.response.data.message : 'OOP! Something went wrong.', 'error'));
  }
  render() {
    const { sample} = this.props;
    const { open, tests } = this.state;
    return (
      <Fragment>
        {/* Sample infomation */}
        <TableRow key={`sample_${sample.ed_number}`}>
          <TableCell component="th" scope="row">
            {sample.ed_number}
          </TableCell>
          <TableCell align="left">{sample.sample_type ?? "-"}</TableCell>
          <TableCell align="left">{sample.comment ?? "-"}</TableCell>
          <TableCell align="right">{sample.collection_date}</TableCell>
          <TableCell align="right">{sample.received_date}</TableCell>
          <TableCell align="right">
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => this.setState({ open: !open })}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        </TableRow>
        {/* collapsable test infomation table */}
        <TableRow>
          <TableCell style={{ padding: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={0} paddingLeft={2} >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Analysis</TableCell>
                      <TableCell align="left">Comment</TableCell>
                      <TableCell align="right">Status</TableCell>
                      <TableCell align="right">Date</TableCell>
                      <TableCell align="right">Result</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tests.map((test) => (
                      <TestRow
                        key={`test_${test.test_identifier}`}
                        test={test}
                      />
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </Fragment>
    );
  }
}

class SampleList extends React.Component {

  render() {
    const { classes, samples } = this.props;
    return (
      <Grid item xs={12}>
        <TableContainer component={Paper} elevation={3}>
          <Toolbar>
            <Typography variant="h4" color="primary" className={classes.title}>
              Samples
            </Typography>
          </Toolbar>
          <Table p={3} className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Sample ID</TableCell>
                <TableCell align="left">Type</TableCell>
                <TableCell align="left">Comment</TableCell>
                <TableCell align="right">Collection Date</TableCell>
                <TableCell align="right">Recieved Date</TableCell>
                <TableCell align="right">Tests</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {samples.length === 0 ?
                <TableRow>
                  <TableCell align="center" colSpan={7}><Typography variant="h6">No samples</Typography></TableCell>
                </TableRow>
                :
                samples.map((sample) => (
                  <SampleRow
                    key={`sample_test_${sample.ed_number}`}
                    sample={sample}
                  ></SampleRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    );
  }
}

export default withStyles(style, { withTheme: true })(SampleList);
