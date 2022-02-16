import React from "react";
import TextField from "@material-ui/core/TextField";
import EmailValidator from 'email-validator';

export default function EmailField({ email, setEmail,variant,disabled }) {
  const handleEmailChange = (ev) => {
    if (!email) return;
    const newValue = ev.target.value;
    ((ev.type === 'change' && !newValue)
      || (ev.type === 'blur' && (newValue || email.errorText) && !EmailValidator.validate(newValue)))
      || (email.errorText && !EmailValidator.validate(newValue))
      ? setEmail({ value:newValue, errorText: 'Please enter a valid email address' })
      : setEmail({ value: newValue, errorText: '' });
  }
  return (
    <TextField
      required fullWidth  
      variant={variant ?? "outlined"}
      id="email"
      label="Email Address"
      name="username"
      disabled={disabled ?? false}
      value={(email && email.value) ?? ''}
      autoComplete="email"
      onChange={handleEmailChange}
      onBlur={handleEmailChange}
      error={email && !!email.errorText}
      helperText={(email && email.errorText) ?? ''}
    />
  );
}