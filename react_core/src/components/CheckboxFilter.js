import React from "react";
import { withStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";

import Typography from "@material-ui/core/Typography";

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

const Accordion = withStyles({
  root: {
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    // padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

export default function CheckboxFilter({ name, label, filter, onChange }) {
  const options = filter.opts;
  const value = filter.sel;

  const handleToggle = (v) => () => {
    const currentIndex = value.indexOf(v);
    const newState = [...value];

    if (currentIndex === -1) {
      newState.push(v);
    } else {
      newState.splice(currentIndex, 1);
    }
    if (typeof onChange === "function")
      onChange({
        name: name,
        value: {
          opts: options,
          sel: newState,
        },
      });
  };

  return (
    <Accordion square>
      <AccordionSummary
        aria-controls="panel1d-content"
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography variant="h6" color="textSecondary">
          {label ? label : name}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FormGroup>
          {options.map((v) => {
            return (
              <FormControlLabel
                key={v}
                control={
                  <Checkbox
                    checked={value.indexOf(v) !== -1}
                    onChange={handleToggle(v)}
                    name={v}
                    color="primary"
                  />
                }
                label={v}
              />
            );
          })}
        </FormGroup>
      </AccordionDetails>
    </Accordion>
  );
}
