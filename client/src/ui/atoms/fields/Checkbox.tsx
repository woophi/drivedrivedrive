import * as React from 'react';
import { WrappedFieldProps } from 'redux-form';
import { TextFieldProps } from 'ui/formTypes';
import { Checkbox } from 'material-ui';

export const CustomCheckBoxField: React.SFC<
  WrappedFieldProps & TextFieldProps
> = props => (
  <Checkbox
    checked={props.input.checked}
    disabled={props.disabled}
    label={props.floatingLabelText}
    {...props.input}
  />
);
