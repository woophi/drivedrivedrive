import * as React from 'react';
import { Paper } from 'material-ui';
import { compose } from 'redux';
import { reduxForm, InjectedFormProps, Field } from 'redux-form';
import { CustomInputField } from 'ui/atoms/fields';
import { FormButtonsRow } from 'ui/atoms/buttons';
import { validate, submit } from './form';

class WpKekComponent extends React.Component<
  InjectedFormProps<{ message: string }, {}>
> {
  render() {
    const { handleSubmit, pristine, submitting } = this.props;
    return (
      <Paper zDepth={2}>
        <form onSubmit={handleSubmit}>
          <h1>Here is no php bullshit.</h1>
          <h2>Leave me a message why are u here?</h2>
          <Field
            name="message"
            component={CustomInputField}
            type="text"
            {...{
              floatingLabelText: 'Message',
              fullWidth: true,
              hintText: '??????????????????????',
              multiLine: true,
              rows: 4
            }}
          />

          <FormButtonsRow
            noCancel
            labelSubmit={'send'}
            pristine={pristine}
            resetForm={'wpMessage'}
            submitting={submitting}
          />
        </form>
      </Paper>
    );
  }
}

export default compose(
  reduxForm<{ message: string }, {}>({
    form: 'wpMessage',
    enableReinitialize: true,
    destroyOnUnmount: true,
    validate: validate,
    onSubmit: submit
  })
)(WpKekComponent);
