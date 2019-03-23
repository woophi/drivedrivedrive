import { WrappedFieldProps } from 'redux-form';
import { TextFieldProps } from 'ui/formTypes';
import { SelectField, MenuItem } from 'material-ui';
import * as React from 'react';

type LocalState = {
  selectedValue: any;
};

type Props = WrappedFieldProps & TextFieldProps;

export class CustomSelectField extends React.PureComponent<Props, LocalState> {
  state: LocalState = {
    selectedValue: this.props.input.value
  };

  componentDidUpdate(prevProps: Props) {
    const {
      input: { value },
      meta: { pristine }
    } = this.props;
    if (!!value && pristine && value !== prevProps.input.value) {
      this.setState({ selectedValue: this.props.input.value });
    }
  }

  handleClick = (event: any, index: number, value: any) => {
    this.setState({ selectedValue: value });
    this.props.input.onChange(value);
  };

  render() {
    const { ...props } = this.props;
    const { selectedValue } = this.state;
    return (
      <SelectField
        {...props.input}
        {...props}
        onChange={this.handleClick}
        value={selectedValue}
        errorText={
          !!(props.meta.touched && props.meta.error) ? props.meta.error : ''
        }
      >
        {props.options &&
          props.options.map((o, i) => (
            <MenuItem
              key={`o-u-${i}-${o.value}`}
              value={o.value}
              primaryText={o.primaryText}
            />
          ))}
      </SelectField>
    );
  }
}
