import React, { useEffect } from "react";
import TextField from "@material-ui/core/TextField";

export default function PasswordField({ password, setPassword, label, match,variant}) {

  const handlePasswordChange = (ev) => {
    const newValue = ev.target.value;
    if (!newValue)
      setPassword({ ...password, ...{ errorText: 'Enter a password' } })
    // else if (newValue.length < 8)
    //   setPassword({ ...password, ...{ errorText: 'Passwords must be at least 8 characters long' } })
    else if (match && newValue !== match)
      setPassword({ ...password, ...{ errorText: 'Passwords must match' } })
    else 
      setPassword({ value: newValue, errorText: '' });
  }
  const compare = () => {
    if (match && password.value !== match)
      setPassword({ ...password, ...{ errorText: 'Passwords must match' } })
    else 
      setPassword({ ...password, errorText: '' });
  }

  useEffect(compare,[match]);

  return (
    <TextField
      variant={variant ?? "outlined"}
      margin="normal"
      required
      fullWidth
      name="password"
      label= {label ?? "Password"}
      type="password"
      id="password"
      onChange={handlePasswordChange}
      autoComplete="current-password"
      error={password.errorText ? true : false}
      helperText={password.errorText ?? ''}
    />
  );
}