import * as React from 'react';
import { SectionChildProps } from 'ui/SectionChildType';
import { getRequest, approveRequest, resetForm } from '../operations';
import { compose } from 'redux';
import { Request } from 'core/models/admin';
import { AppState } from 'core/models/app';
import {
  Field,
  InjectedFormProps,
  reduxForm,
  WrappedFieldProps
} from 'redux-form';
import { connect as redux } from 'react-redux';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Alert } from 'ui/app/components/Alert';
import { Preloader } from 'ui/app/components/preloader';
import { TextFieldProps } from 'ui/formTypes';
import { DataStatus } from 'core/models/api';
import { createComponent, IStyle } from 'react-fela';
import { updateRequest } from '../form';
import Checkbox from 'material-ui/Checkbox';
import { DatePickerComponent } from 'ui/app/components/DatePickerField';
import { parseToInt } from 'ui/shared/transforms';

type Props = {
  fetchingRequest: boolean;
  initialValues: Request;
  getRequestErr: any;
} & SectionChildProps;

class EditRequestComponent extends React.Component<
  Props & InjectedFormProps<Request, Props>
> {
  async componentDidMount() {
    const { match } = this.props;
    await getRequest(match.params.id);
  }

  handleApproveRequest = () => {
    const { match } = this.props;
    approveRequest(match.params.id);
  }
  handleResetForm = () => {
    resetForm('editRequest')
  }

  get fields() {
    const {
      pristine,
      submitting,
      initialValues,
      dirty
    } = this.props;
    return (initialValues &&
      <>
        <Field
          name="guest.name"
          component={CustomInputField}
          type="text"
          {...{
            floatingLabelText: 'Имя',
            fullWidth: true
          }}
        />
        <Field
          name="guest.email"
          component={CustomInputField}
          type="text"
          {...{
            floatingLabelText: 'E-mail',
            fullWidth: true
          }}
        />
        <Field
          name="guest.count"
          component={CustomInputField}
          type="number"
          parse={parseToInt}
          {...{
            floatingLabelText: 'Количество человек',
            fullWidth: true
          }}
        />
        <Field
          name="guest.from"
          component={CustomInputField}
          type="text"
          {...{
            floatingLabelText: 'Пункт отправления',
            fullWidth: true
          }}
        />
        <Field
          name="guest.to"
          component={CustomInputField}
          type="text"
          {...{
            floatingLabelText: 'Пункт назначения',
            fullWidth: true
          }}
        />
        <Field
          name="guest.date"
          component={CustomDateField}
          type="date"
          id={'adm_request_date'}
          {...{
            floatingLabelText: 'Дата',
            fullWidth: true
          }}
        />
        <Field
          name="guest.time"
          component={CustomInputField}
          type="time"
          {...{
            floatingLabelText: 'Время',
            fullWidth: true
          }}
        />
        <Field
          name="guest.comment"
          component={CustomInputField}
          type="text"
          {...{
            floatingLabelText: 'Комментарий',
            fullWidth: true
          }}
        />
        <Field
          name="guest.phone"
          component={CustomInputField}
          type="tel"
          {...{
            floatingLabelText: 'Номер телефона',
            fullWidth: true
          }}
        />
        <Field
          name="guest.notify"
          component={CustomCheckBoxField}
          type="checkbox"
          {...{
            floatingLabelText: 'Подписка на рассылку сообщений',
            disabled: true
          }}
        />
        <BtnContainer>
          <RaisedButton
            disabled={pristine || submitting}
            onClick={this.handleResetForm}
            style={{ marginRight: '1rem' }}
            buttonStyle={{ padding: '0' }}
          >
            {'Сбросить изменения'}
          </RaisedButton>
          <RaisedButton
            type="submit"
            primary
            disabled={pristine || submitting}
          >
            {submitting ? (
              <i className="fas fa-circle-notch fa-spin" />
            ) : (
              'Обновить'
            )}
          </RaisedButton>
        </BtnContainer>
      </>
    )
  }

  get approveBtn() {
    const { initialValues } = this.props;
    return (initialValues && !initialValues.approved &&
      <RaisedButton
        onClick={this.handleApproveRequest}
        disabled={!!initialValues.approved}
      >
        Одобрить
      </RaisedButton>
    )
  }
  get approved() {
    const { initialValues } = this.props;
    return (initialValues && initialValues.approved &&
      <ApprovedContainer>
        <i className="far fa-check-circle" />
        Успешно одобрено
      </ApprovedContainer>
    )
  }

  render() {
    const {
      handleSubmit,
      error,
      fetchingRequest,
      getRequestErr,
      initialValues
    } = this.props;
    return (
      <Container>
        <Paper zDepth={2}>
          <Form onSubmit={handleSubmit} autoComplete={''}>
            {(error || getRequestErr) && <Alert mssg={error || getRequestErr} type={'error'} />}
            {this.approved}
            {this.approveBtn}
            {this.fields}
          </Form>
          <Preloader isShow={fetchingRequest || !initialValues} />

        </Paper>
      </Container>
    );
  }
}

const CustomInputField: React.SFC<
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
const CustomCheckBoxField: React.SFC<
  WrappedFieldProps & TextFieldProps
> = props => (
  <Checkbox
    checked={props.input.checked}
    disabled={props.disabled}
    label={props.floatingLabelText}
    {...props.input}
  />
);
const CustomDateField: React.SFC<
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

const Container = createComponent(() => ({
  '>div': {
    margin: '1rem',
    width: 'auto',
    height: '100%'
  }
}) as IStyle, 'div');
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
const Form = createComponent(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '0 auto',
  padding: '1rem',
  height: '100%',
  maxWidth: 700
}), 'form', ['onSubmit','autoComplete']);
const BtnContainer = createComponent(() => ({
  margin: '2rem 0',
  justifyContent: 'center',
  display: 'flex',
  width: '100%',
  '>div>button>div>div': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    padding: '0 .5rem'
  }
}), 'div');
const ApprovedContainer = createComponent(() => ({
  '>i': {
    color: '#43A047',
    marginRight: '1rem',
    fontWeight: 600
  },
  fontSize: 18
}) as IStyle, 'p');

export const EditRequest = compose(
  redux((state: AppState) => ({
    fetchingRequest: state.ui.api.adminRequest.status === DataStatus.QUIET_FETCHING,
    initialValues: state.ui.api.adminRequest.result,
    getRequestErr: state.ui.api.adminRequest.errorInfo &&
      JSON.stringify(state.ui.api.adminRequest.errorInfo)
  })),
  reduxForm<Request, Props>({
    form: 'editRequest',
    enableReinitialize: true,
    destroyOnUnmount: true,
    onSubmit: updateRequest
  })
)(EditRequestComponent);
