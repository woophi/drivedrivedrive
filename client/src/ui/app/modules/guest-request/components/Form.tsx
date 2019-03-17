import * as React from 'react';
import { compose } from 'redux';
import { InjectedFormProps, reduxForm, Field } from 'redux-form';
import { connect as ReduxConnect } from 'react-redux';
import { IStyle, createComponent } from 'react-fela';
import { AppState } from 'core/models/app';
import { RequestInfo } from 'core/models';
import { getGuestRequestResult, getGuestRequestData } from '../selectors';
import { validateRequest, submitEditRequest } from '../form';
import { Alert } from 'ui/app/components/Alert';
import { Preloader } from 'ui/app/components/preloader';
import { CustomInputField, CustomDateField } from 'ui/atoms/fields';
import { parseToInt } from 'ui/shared/transforms';
import { FormButtonsRow } from 'ui/atoms/buttons';
import { withTranslation, WithTranslation } from 'react-i18next';

type OwnProps = {
  style?: IStyle;
};

type Props = {
  getRequestErr: string;
} & OwnProps & WithTranslation;

class FormComponent extends React.Component<
  Props & InjectedFormProps<RequestInfo, Props>
> {
  render() {
    const {
      style,
      submitting,
      pristine,
      handleSubmit,
      error,
      initialValues,
      getRequestErr,
      t
    } = this.props;
    return (
      <>
        <Form style={style} onSubmit={handleSubmit} autoComplete={''}>
          {(error || getRequestErr) && (
            <Alert mssg={error || getRequestErr} type={'error'} />
          )}
          <Field
            name="name"
            component={CustomInputField}
            type="text"
            {...{
              floatingLabelText: t('common:name'),
              fullWidth: true
            }}
          />
          <Field
            name="phone"
            component={CustomInputField}
            type="tel"
            {...{
              floatingLabelText: t('common:phone'),
              fullWidth: true
            }}
          />
          <Field
            name="email"
            component={CustomInputField}
            type="text"
            {...{
              floatingLabelText: t('common:email'),
              fullWidth: true
            }}
          />
          <Field
            name="count"
            component={CustomInputField}
            type="number"
            parse={parseToInt}
            {...{
              floatingLabelText: t('common:count'),
              fullWidth: true
            }}
          />
          <Field
            name="from"
            component={CustomInputField}
            type="text"
            {...{
              floatingLabelText: t('common:from'),
              fullWidth: true
            }}
          />
          <Field
            name="to"
            component={CustomInputField}
            type="text"
            {...{
              floatingLabelText: t('common:to'),
              fullWidth: true
            }}
          />
          <Field
            name="date"
            component={CustomDateField}
            type="date"
            id={'guest_request_date'}
            {...{
              floatingLabelText: t('common:date'),
              fullWidth: true
            }}
          />
          <Field
            name="time"
            component={CustomInputField}
            type="time"
            {...{
              floatingLabelText: t('common:time'),
              fullWidth: true
            }}
          />
          <Field
            name="comment"
            component={CustomInputField}
            type="text"
            {...{
              floatingLabelText: t('common:comment'),
              fullWidth: true,
              hintText: t('common:commentHint'),
              multiLine: true,
              rows: 4
            }}
          />

          <FormButtonsRow
            labelCancel={'app::common:button:resetChanges'}
            labelSubmit={'app::common:button:update'}
            pristine={pristine}
            resetForm={'guestRequest'}
            submitting={submitting}
          />
        </Form>
        <Preloader isShow={!initialValues && !getRequestErr} />
      </>
    );
  }
}

export const FormEdit = compose<React.ComponentClass<OwnProps>>(
  withTranslation('app'),
  ReduxConnect((state: AppState, _: OwnProps) => ({
    initialValues: getGuestRequestResult(state),
    hashId: state.ui.guests.hashId,
    getRequestErr:
      getGuestRequestData(state).errorInfo &&
      JSON.stringify((getGuestRequestData(state).errorInfo))
  })),
  reduxForm<RequestInfo, Props>({
    form: 'guestRequest',
    enableReinitialize: true,
    destroyOnUnmount: false,
    validate: validateRequest,
    onSubmit: submitEditRequest
  })
)(FormComponent);

const Form = createComponent(
  () => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '0 auto',
    padding: '1rem',
    height: '100%',
    maxWidth: 700
  }),
  'form',
  ['onSubmit', 'autoComplete', 'style']
);
