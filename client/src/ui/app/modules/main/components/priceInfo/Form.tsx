import { Field, InjectedFormProps, reduxForm, WrappedFieldProps } from 'redux-form';
import { AppState } from 'core/models/app';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import { returntypeof } from 'react-redux-typescript';
import * as React from 'react';
import { compose } from 'redux';
import { connect as ReduxConnect } from 'react-redux';
import * as data from 'core/models';
import { submitRequest, validateRequest } from '../../form';
import { Alert } from 'ui/app/components/Alert';
import { parseToInt } from 'ui/shared/transforms';
import IconButton  from 'material-ui/IconButton';
import { triggerForm } from '../../operations';

const mapStateToProps = (state: AppState) => ({
  authInfo: state.authInfo,
  formState: state.ui.guests.guestSubmitForm
});

const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps;
type FelaProps = FelaStyles<typeof mapStylesToProps>;

type TextFieldProps = {
  type: string;
  label: string;
  placeHodler?: string;
  styleInput?: React.CSSProperties;
  styleLable?: React.CSSProperties;
  additionalClassName?: string;
  required?: boolean;
  id?: string;
};

class Form extends React.Component<Props & FelaProps & InjectedFormProps<data.RequestInfo, Props>> {

  componentInput = (props: WrappedFieldProps & TextFieldProps) => {
    const { styles } = this.props;
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
          className={props.meta.touched && props.meta.error ? styles.errInputSt : styles.inputSt}
          type={props.type}
          placeholder={props.placeHodler || ''}
          style={props.styleInput || {}}
          required={props.required || false}
          id={props.id || ''}
        />
      </div>
    );
  }

  componentForm = () => {
    const { styles, handleSubmit, error, pristine, submitting } = this.props;
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
                maxWidth: 150,
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
            component={this.componentInput}
            type="date"
            label={'Дата трансфера'}
            {...{
              required: true
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
              placeHodler: 'ваши пожелания, телефон или номер рейса',
              additionalClassName: styles.hideRequired
            }}
          />

          <button disabled={submitting} className={styles.buttonSt}>
            {submitting ? <i className="fas fa-circle-notch fa-spin" /> : 'Отправить'}
          </button>
        </form>
      </React.Fragment>
    );
  }

  get componentModal() {
    return (this.props.formState &&
      <div className={this.props.styles.modalSent}>
        <div className={this.props.styles.modalBody}>
          <IconButton
            iconClassName="fa fa-times fa-2"
            onClick={this.handleClose}
            style={{alignSelf: 'flex-end'}}
          />
          <span className={this.props.styles.modalText}>
            Спасибо за Вашу заявку! В ближайшее время Вам начнут поступать предложения от водителей
          </span>
        </div>
      </div>
    );
  }

  handleClose = () => triggerForm(false);

  render() {
    const { styles, formState } = this.props;
    return (
        <div className={styles.container}>
          {this.componentForm()}
          {this.componentModal}
        </div>
    );
  }
}

const container: FelaRule<Props> = ({theme}) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'rgba(85, 85, 85, 0.7)',
  width: 360,
  marginLeft: '3rem',
  height: 525,
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
  font: 'normal normal normal 11px/13px helvetica-w01-roman,helvetica-w02-roman,helvetica-lt-w10-roman,sans-serif',
  width: 'auto',
  paddingBottom: 5,
  letterSpacing: '.03em',
  verticalAlign: 'top',
  paddingRight: 5,
  '&:after': {
    content: '"*"',
    color: ' #cc0000',
    verticalAlign: 'top',
    margin: '0 3px',
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
  font: 'normal normal normal 14px helvetica-w01-roman,helvetica-w02-roman,helvetica-lt-w10-roman,sans-serif',
  color: 'rgba(0,0,0,1)',
  boxSizing: 'border-box'
});

const errInputSt: FelaRule<Props> = () => ({
  ...inputSt(),
  borderColor: ' #cc0000',
});

const buttonSt: FelaRule<Props> = props => ({
  ...props.theme.items.flatButton,
  margin: '5px 5px 0',
  backgroundColor: props.theme.palette.lightYellow,
  color: '#fff'
});

const hideRequired: FelaRule<Props> = props => ({
  '&:after': {
    content: '"" !important',
  }
});

const modalSent: FelaRule<Props> = props => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(85, 85, 85, 0.9)',
  display: 'flex',
  flexDirection: 'column',
});

const modalBody: FelaRule<Props> = () => ({
  margin: 'auto 2rem',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'rgba(186,218,85,1)',
});

const modalText: FelaRule = () => ({
  textAlign: 'center',
  margin: '1rem',
  fontSize: '19px',
  letterSpacing: '1px',
  color: '#fff',
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
  modalText
};

export default compose (
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
