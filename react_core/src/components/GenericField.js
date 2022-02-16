import React from "react";
import TextField from "@material-ui/core/TextField";

export default function GenericField({ label, field, setField, variant, disabled, required }) {
  const handleChange = (ev) => {
    const newValue = ev.target.value;
    (required && !newValue)
      ? setField({ value: newValue, errorText: `${label ?? 'Field'} is required` })
      : setField({ value: newValue, errorText: '' });
  }
  return (
    <TextField
      required={required} fullWidth
      variant={variant ?? "outlined"}
      label={label ?? ''}
      disabled={disabled ?? false}
      autoComplete={label}
      value={(field && field.value)??''}
      onChange={handleChange}
      error={field && !!field.errorText}
      helperText={(field && field.errorText) ?? ''}
    />
  );
}