import { AppState } from 'core/models/app';
import { connect as ReduxConnect } from 'react-redux';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import { returntypeof } from 'react-redux-typescript';
import * as React from 'react';
import { compose } from 'redux';
import { Field, InjectedFormProps, reduxForm, WrappedFieldProps } from 'redux-form';
import * as data from 'core/models';
import { validateRequest, submitRequest } from '../../form';
import { Alert } from 'ui/app/components/Alert';
import { parseToInt } from 'ui/shared/transforms';

const mapStateToProps = (state: AppState) => ({
  authInfo: state.authInfo
});

const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps;
type FelaProps = FelaStyles<typeof mapStylesToProps>;

type TextFieldProps = {
  type: string;
  placeHodler?: string;
  styleInput?: React.CSSProperties;
  styleLable?: React.CSSProperties;
  additionalClassName?: string;
  required?: boolean
}

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
        />
      </div>
    )
  }

  render() {
    const { styles, handleSubmit, error, pristine, submitting } = this.props;
    return (
        <div className={styles.container}>
          <form className={styles.form} onSubmit={handleSubmit}>
            {error && <Alert mssg={error} type={'error'} />}
            <Field
              name="name"
              component={this.componentInput}
              type="text"
              label={'Имя'}
              {...{
                required: true
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

            <button className={styles.buttonSt}>Отправить</button>
          </form>
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
  ...theme.mobile({
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
})

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

const mapStylesToProps = {
  container,
  labelSt,
  form,
  fieldSt,
  inputSt,
  buttonSt,
  hideRequired,
  errInputSt
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
