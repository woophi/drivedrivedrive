import * as React from 'react';
import { compose } from 'redux';
import { InjectedFormProps, reduxForm, Field } from 'redux-form';
import { connect as ReduxConnect } from 'react-redux';
import { IStyle, createComponent } from 'react-fela';
import { AppState } from 'core/models/app';
import { RequestInfo } from 'core/models';
import { getGuestRequestResult } from '../selectors';
import { validateRequest, submitEditRequest } from '../form';
import { Alert } from 'ui/app/components/Alert';
import { Preloader } from 'ui/app/components/preloader';
import { CustomInputField, CustomDateField } from 'ui/atoms/fields';
import { parseToInt } from 'ui/shared/transforms';
import { FormButtonsRow } from 'ui/atoms/buttons';
import { resetForm } from 'ui/app/operations';

type OwnProps = {
  style?: IStyle;
};

type Props = {} & OwnProps;

class FormComponent extends React.Component<
  Props & InjectedFormProps<RequestInfo, Props>
> {

  handleResetForm = () => {
    resetForm('guestRequest');
  }

  render() {
    const {
      style,
      submitting,
      pristine,
      handleSubmit,
      error,
      initialValues
    } = this.props;
    return (
      <>
        <Form style={style} onSubmit={handleSubmit} autoComplete={''}>
          {error && <Alert mssg={error} type={'error'} />}
          <Field
            name="name"
            component={CustomInputField}
            type="text"
            {...{
              floatingLabelText: 'Имя',
              fullWidth: true
            }}
          />
          <Field
            name="phone"
            component={CustomInputField}
            type="tel"
            {...{
              floatingLabelText: 'Номер телефона',
              fullWidth: true
            }}
          />
          <Field
            name="email"
            component={CustomInputField}
            type="text"
            {...{
              floatingLabelText: 'E-mail',
              fullWidth: true
            }}
          />
          <Field
            name="count"
            component={CustomInputField}
            type="number"
            parse={parseToInt}
            {...{
              floatingLabelText: 'Количество человек',
              fullWidth: true
            }}
          />
          <Field
            name="from"
            component={CustomInputField}
            type="text"
            {...{
              floatingLabelText: 'Пункт отправления',
              fullWidth: true
            }}
          />
          <Field
            name="to"
            component={CustomInputField}
            type="text"
            {...{
              floatingLabelText: 'Пункт назначения',
              fullWidth: true
            }}
          />
          <Field
            name="date"
            component={CustomDateField}
            type="date"
            id={'guest_request_date'}
            {...{
              floatingLabelText: 'Дата',
              fullWidth: true
            }}
          />
          <Field
            name="time"
            component={CustomInputField}
            type="time"
            {...{
              floatingLabelText: 'Время',
              fullWidth: true
            }}
          />
          <Field
            name="comment"
            component={CustomInputField}
            type="text"
            {...{
              floatingLabelText: 'Комментарий',
              fullWidth: true,
              hintText: 'ваши пожелания или номер рейса'
            }}
          />

          <FormButtonsRow
            labelCancel={'Сбросить изменения'}
            labelSubmit={'Обновить'}
            pristine={pristine}
            resetForm={this.handleResetForm}
            submitting={submitting}
          />
        </Form>
        <Preloader isShow={!initialValues} />
      </>
    );
  }
}

export const FormEdit = compose(
  ReduxConnect((state: AppState, props: OwnProps) => ({
    initialValues: getGuestRequestResult(state),
    hashId: state.ui.guests.hashId
  })),
  reduxForm<RequestInfo, Props>({
    form: 'guestRequest',
    enableReinitialize: true,
    destroyOnUnmount: false,
    validate: validateRequest,
    onSubmit: submitEditRequest
  })
)(FormComponent);

const Form = createComponent(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '0 auto',
  padding: '1rem',
  height: '100%',
  maxWidth: 700
}), 'form', ['onSubmit','autoComplete', 'style']);
