import {
  Field,
  InjectedFormProps,
  reduxForm,
  WrappedFieldProps
} from 'redux-form';
import { AppState } from 'core/models/app';
import { DataStatus } from 'core/models/api';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import { returntypeof } from 'react-redux-typescript';
import * as React from 'react';
import { compose } from 'redux';
import { connect as ReduxConnect } from 'react-redux';
import * as data from 'core/models';
import { submitRequest, validateRequest } from '../../form';
import { Alert } from 'ui/app/components/Alert';
import { Modal } from 'ui/app/components/Modal';
import { PrivacyPolicy } from 'ui/app/components/PrivacyPolicy';
import { parseToInt } from 'ui/shared/transforms';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import {
  triggerForm,
  handleTriggerGDPRDialog,
  getGdprGuest
} from '../../operations';
import { getGdprGuestData, getGdprGuestResult } from '../../selectors';
import { DatePickerComponent } from 'ui/app/components/DatePickerField';

const mapStateToProps = (state: AppState) => ({
  authInfo: state.authInfo,
  formState: state.ui.guests.guestSubmitForm,
  isOpenGDPR: state.ui.guests.openPrivacyPolicy,
  isLoadingGdpr:
    getGdprGuestData(state).status === DataStatus.FETCHING ||
    getGdprGuestData(state).status === DataStatus.QUIET_FETCHING,
  gdprResult:
    (getGdprGuestResult(state) && getGdprGuestResult(state).text) || ''
});

const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps;
type FelaProps = FelaStyles<typeof mapStylesToProps>;

type TextFieldProps = {
  type: string;
  label: any;
  placeHodler?: string;
  styleInput?: React.CSSProperties;
  styleLable?: React.CSSProperties;
  additionalClassName?: string;
  required?: boolean;
  id?: string;
};

class Form extends React.Component<
  Props & FelaProps & InjectedFormProps<data.RequestInfo, Props>
> {
  componentInput = (props: WrappedFieldProps & TextFieldProps) => {
    const { styles } = this.props;
    const labelClassName =
      props.meta.touched && props.meta.error
        ? styles.errInputSt
        : styles.inputSt;
    return (
      <div className={styles.fieldSt}>
        <label
          className={`${props.additionalClassName || ''} ${styles.labelSt}`}
          style={props.styleLable || {}}
        >
          {props.label}
        </label>
        <input
          {...props.input}
          className={labelClassName}
          type={props.type}
          placeholder={props.placeHodler || ''}
          style={props.styleInput || {}}
          required={props.required || false}
          id={props.id || ''}
          autoComplete={props.input.name || ''}
          min={1}
        />
      </div>
    );
  }
  componentInputDate = (props: WrappedFieldProps & TextFieldProps) => {
    const { styles } = this.props;
    const labelClassName =
      props.meta.touched && props.meta.error
        ? styles.dateStInvalid
        : styles.dateSt;
    return (
      <div className={styles.fieldSt}>
        <label
          className={`${props.additionalClassName || ''} ${styles.labelSt}`}
          style={props.styleLable || {}}
        >
          {props.label}
        </label>
        <div className={labelClassName}>
          <DatePickerComponent
            uniqId={props.id}
            input={props.input}
            meta={props.meta}
          />
        </div>
      </div>
    );
  }

  componentCheckbox = (props: WrappedFieldProps & TextFieldProps) => {
    const { styles } = this.props;
    const labelClassName =
      props.meta.touched && props.meta.error
        ? styles.checkboxLabelErr
        : styles.checkboxLabel;
    return (
      <div className={styles.flexContainer}>
        <input
          {...props.input}
          type={props.type}
          id={props.id}
          className={styles.checkbox}
          required={props.required}
        />
        <label htmlFor={props.id} className={labelClassName}>
          <i className="fas fa-check" />
        </label>
        <label className={styles.checkboxLabel2}>{props.label}</label>
      </div>
    );
  }

  handleClick = () => handleTriggerGDPRDialog(true);

  componentForm = () => {
    const { styles, handleSubmit, error, pristine, submitting } = this.props;
    const submittingButton = submitting ? (
      <i className="fas fa-circle-notch fa-spin" />
    ) : (
      'Отправить'
    );

    const gdprLink = (
      <a style={{ textDecoration: 'underline' }} onClick={this.handleClick}>
        Согласие на обработку персональных данных
      </a>
    );
    return (
      <React.Fragment>
        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <Alert mssg={error} type={'error'} />}
          <Field
            name="name"
            component={this.componentInput}
            type="text"
            label={'Имя'}
            {...{
              required: true,
              id: 'guest_name_input'
            }}
          />
          <Field
            name="email"
            component={this.componentInput}
            type="email"
            label={'E-mail'}
            {...{
              required: true
            }}
          />
          <Field
            name="count"
            component={this.componentInput}
            type="number"
            parse={parseToInt}
            label={'Количество пассажиров'}
            {...{
              styleInput: {
                maxWidth: 150
              },
              required: true
            }}
          />
          <Field
            name="from"
            component={this.componentInput}
            type="text"
            label={'Отправление из'}
            {...{
              required: true
            }}
          />
          <Field
            name="to"
            component={this.componentInput}
            type="text"
            label={'Прибытие в'}
            {...{
              required: true
            }}
          />
          <Field
            name="date"
            component={this.componentInputDate}
            label={'Дата трансфера'}
            type={'date'}
            {...{
              required: true,
              id: 'datePcikerRequest'
            }}
          />

          <Field
            name="time"
            component={this.componentInput}
            type="time"
            label={'Время трансфера'}
            {...{
              required: true
            }}
          />

          <Field
            name="comment"
            component={this.componentInput}
            type="text"
            label={'Ваш комментарий'}
            {...{
              placeHodler: 'ваши пожелания или номер рейса',
              additionalClassName: styles.hideRequired
            }}
          />

          <Field
            name="gdpr"
            component={this.componentCheckbox}
            type="checkbox"
            label={gdprLink}
            {...{
              required: true,
              id: 'checkGDPR'
            }}
          />

          <button disabled={submitting} className={styles.buttonSt}>
            {submittingButton}
          </button>
        </form>
      </React.Fragment>
    );
  }

  get componentModal() {
    return (
      this.props.formState && (
        <div className={this.props.styles.modalSent}>
          <div className={this.props.styles.modalBody}>
            <IconButton
              iconClassName="fa fa-times fa-2"
              onClick={this.handleCloseAfterSubmit}
              style={{ alignSelf: 'flex-end' }}
              iconStyle={{ color: '#fff' }}
            />
            <span className={this.props.styles.modalText}>
              Спасибо за Вашу заявку! В ближайшее время Вам начнут поступать
              предложения от водителей
            </span>
          </div>
        </div>
      )
    );
  }

  get gdprComponent() {
    return (
      <PrivacyPolicy
        data={this.props.gdprResult}
        fetchGdpr={getGdprGuest}
        isLoading={this.props.isLoadingGdpr}
      />
    );
  }

  handleCloseAfterSubmit = () => triggerForm(false);
  handleCloseModalGDPR = () => handleTriggerGDPRDialog(false);

  render() {
    const { styles, formState, isOpenGDPR } = this.props;
    const actionButtons = [
      <RaisedButton
        label={'Закрыть'}
        primary
        onClick={this.handleCloseModalGDPR}
      />
    ];
    return (
      <React.Fragment>
        <div className={styles.container}>
          {this.componentForm()}
          {this.componentModal}
        </div>
        <Modal
          actions={actionButtons}
          body={this.gdprComponent}
          handleClose={this.handleCloseModalGDPR}
          open={isOpenGDPR}
          title={'Пользовательское соглашение'}
        />
      </React.Fragment>
    );
  }
}

const container: FelaRule<Props> = ({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'rgba(85, 85, 85, 0.7)',
  width: 360,
  marginLeft: '3rem',
  height: 600,
  position: 'relative',
  ...theme.mobileEarly({
    margin: '0 1rem'
  })
});

const form: FelaRule<Props> = () => ({
  display: 'flex',
  flexDirection: 'column',
  margin: '1rem'
});

const labelSt: FelaRule<Props> = () => ({
  font:
    'normal normal normal 11px/13px helvetica-w01-roman,helvetica-w02-roman,helvetica-lt-w10-roman,sans-serif',
  width: 'auto',
  paddingBottom: 5,
  letterSpacing: '.03em',
  verticalAlign: 'top',
  paddingRight: 5,
  '&:after': {
    content: '"*"',
    color: ' #cc0000',
    verticalAlign: 'top',
    margin: '0 3px'
  }
});

const fieldSt: FelaRule<Props> = () => ({
  margin: 5,
  width: 'calc(100% - 12px)',
  letterSpacing: '.03em',
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative'
});

const inputSt: FelaRule<Props> = () => ({
  padding: '6px 12px',
  borderColor: 'rgba(186,218,85,1)',
  borderRadius: 7,
  borderWidth: 1,
  borderStyle: 'solid',
  width: '100%',
  boxShadow: 'inset 0 1px 1px rgba(0,0,0,.075)',
  transition: 'border-color linear .2s,box-shadow linear .2s',
  font:
    'normal normal normal 14px helvetica-w01-roman,helvetica-w02-roman,helvetica-lt-w10-roman,sans-serif',
  color: 'rgba(0,0,0,1)',
  boxSizing: 'border-box'
});

const errInputSt: FelaRule<Props> = () => ({
  ...inputSt(),
  borderColor: ' #cc0000'
});

const dateSt: FelaRule<Props> = () => ({
  '>div': {
    height: 33,
    '>div': {
      display: 'flex',
      borderRadius: 7,
      borderColor: 'rgba(186,218,85,1)',
      borderWidth: 1,
      borderStyle: 'solid',
      height: 33,
      boxSizing: 'border-box',
      '>button': {
        padding: '0px 10px 4px'
      },
      '>div>input': {
        padding: 1
      }
    }
  }
});
const dateStInvalid: FelaRule<Props> = () => ({
  '>div': {
    height: 33,
    '>div': {
      display: 'flex',
      borderRadius: 7,
      borderColor: '#cc0000',
      borderWidth: 1,
      borderStyle: 'solid',
      height: 33,
      boxSizing: 'border-box',
      '>button': {
        padding: '0px 10px 4px'
      },
      '>div>input': {
        padding: 1
      }
    }
  }
});

const buttonSt: FelaRule<Props> = props => ({
  ...props.theme.items.flatButton,
  margin: '5px 5px 0',
  backgroundColor: props.theme.palette.lightYellow,
  color: '#fff'
});

const hideRequired = () => ({
  '&:after': {
    content: '"" !important'
  }
});

const modalSent: FelaRule<Props> = props => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(85, 85, 85, 0.9)',
  display: 'flex',
  flexDirection: 'column'
});

const modalBody: FelaRule<Props> = () => ({
  margin: 'auto 2rem',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'rgba(186,218,85,1)'
});

const modalText: FelaRule = () => ({
  textAlign: 'center',
  margin: '1rem',
  fontSize: '19px',
  letterSpacing: '1px',
  color: '#fff'
});

const checkboxLabel: FelaRule = () => ({
  flexShrink: 0,
  display: 'block',
  cursor: 'pointer',
  outline: 'none',
  marginRight: '8px',
  height: '1.5rem',
  width: '1.5rem',
  borderRadius: '.5rem',
  boxShadow: '0px 0 5px rgba(0, 0, 0, 0.3)',
  boxSizing: 'border-box',
  backgroundColor: '#FFF',
  transition: '0.2s ease',
  borderColor: 'rgba(186,218,85,1)',
  borderWidth: 1,
  borderStyle: 'solid',
  position: 'relative',
  top: '-1px',
  '>i': {
    display: 'none'
  }
});

const checkboxLabelErr: FelaRule = () => ({
  ...checkboxLabel(),
  borderColor: ' #cc0000'
});

const checkbox: FelaRule = () => ({
  position: 'absolute',
  top: 5,
  left: 5,
  ':checked + label': {
    '>i': {
      display: 'inline-block',
      margin: 3,
      fontSize: '1rem',
      color: '#000'
    }
  }
});

const checkboxLabel2: FelaRule = () => ({
  display: 'block',
  marginBottom: '.25rem',
  cursor: 'pointer'
});

const flexContainer: FelaRule = () => ({
  display: 'flex',
  margin: '1rem 0 .25rem 0.35rem',
  position: 'relative'
});

const mapStylesToProps = {
  container,
  labelSt,
  form,
  fieldSt,
  inputSt,
  buttonSt,
  hideRequired,
  errInputSt,
  modalSent,
  modalBody,
  modalText,
  checkboxLabel,
  checkbox,
  checkboxLabel2,
  flexContainer,
  checkboxLabelErr,
  dateSt,
  dateStInvalid
};

export default compose(
  ReduxConnect(mapStateToProps),
  FelaConnect(mapStylesToProps),
  reduxForm<data.RequestInfo, Props>({
    form: 'newRequest',
    enableReinitialize: true,
    destroyOnUnmount: true,
    validate: validateRequest,
    onSubmit: submitRequest
  })
)(Form);
