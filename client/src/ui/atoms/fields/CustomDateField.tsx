import * as React from 'react';
import { WrappedFieldProps } from 'redux-form';
import { TextFieldProps } from 'ui/formTypes';
import { TextField } from 'material-ui';
import { IStyle, createComponent } from 'react-fela';
import { DatePickerComponent } from 'ui/app/components/DatePickerField';

export const CustomDateField: React.SFC<
  WrappedFieldProps & TextFieldProps
> = props => (
  <TextField
    fullWidth
    style={{ height: 72 }}
    {...props.input}
  >
    <>
      <DateLabel>{props.floatingLabelText}</DateLabel>
      <DateWrapper>
        <DatePickerComponent
          input={props.input}
          meta={props.meta}
          uniqId={props.id}
        />
      </DateWrapper>
    </>
  </TextField>
);

const DateWrapper = createComponent(() => ({
  '>div': {
    marginTop: 23,
    '>div>div>input': {
      color: 'rgba(0, 0, 0, 0.87)',
      paddingLeft: 0,
      paddingRight: 0,
      paddingBottom: 4,
      fontWeight: 400
    }
  }
}) as IStyle, 'div');
const DateLabel = createComponent(() => ({
  position: 'absolute',
  height: 22,
  lineHeight: '22px',
  zIndex: 1,
  pointerEvents: 'none',
  userSelect: 'none',
  color: 'rgba(0, 0, 0, 0.3)',
  fontSize: 12,
  marginTop: 6
}), 'label');
