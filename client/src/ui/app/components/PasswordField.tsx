import * as React from 'react';
import { TextFieldProps } from 'ui/formTypes';
import IconButton from 'material-ui/IconButton';
import { WrappedFieldProps } from 'redux-form';
import TextField from 'material-ui/TextField';
import { createComponent } from 'react-fela';

type Props = WrappedFieldProps & TextFieldProps;

type LocalState = {
  passwordIsMasked: boolean;
};

const Container = createComponent(
  () => ({
    width: '100%',
    display: 'flex'
  }),
  'div'
);

class PassFieldComponent extends React.PureComponent<Props, LocalState> {
  state: LocalState = {
    passwordIsMasked: true
  };

  handleMask = () =>
    this.setState({ passwordIsMasked: !this.state.passwordIsMasked });

  render() {
    const { meta, input, floatingLabelText, fullWidth, hintText } = this.props;
    const typeField = this.state.passwordIsMasked ? 'password' : 'text';
    const eyeIcon = this.state.passwordIsMasked
      ? 'fas fa-eye'
      : 'fas fa-eye-slash';
    return (
      <Container>
        <TextField
          type={typeField}
          {...this.props.input}
          floatingLabelText={floatingLabelText}
          hintText={hintText}
          fullWidth={fullWidth}
          errorText={!!(meta.touched && meta.error) ? meta.error : ''}
        />
        <IconButton
          aria-label="Toggle password visibility"
          onClick={this.handleMask}
          iconClassName={eyeIcon}
          style={{ marginTop: 24 }}
        />
      </Container>
    );
  }
}

export const PasswordField = PassFieldComponent;
