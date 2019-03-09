import { WrappedFieldProps } from 'redux-form';
import { TextFieldProps } from 'ui/formTypes';
import { TextField } from 'material-ui';
import * as React from 'react';

export const CustomInputField: React.SFC<
  WrappedFieldProps & TextFieldProps
> = props => (
  <TextField
    {...props.input}
    {...props}
    errorText={
      !!(props.meta.touched && props.meta.error) ? props.meta.error : ''
    }
  />
);
