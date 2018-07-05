import { AppState } from 'core/models/app';
import { connect as ReduxConnect } from 'react-redux';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import { returntypeof } from 'react-redux-typescript';
import * as React from 'react';
import { compose } from 'redux';
import { Field, InjectedFormProps, reduxForm, WrappedFieldProps } from 'redux-form';
import * as data from 'core/models';
import { validatePR, submitPR } from './form';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'ui/app/components/Links';
import { changeUrl } from 'ui/app/operations';
import { Alert } from 'ui/app/components/Alert';
import { checkPasswordKey } from '../operations';
import { TextFieldProps } from 'ui/formTypes';

const mapStateToProps = (state: AppState) => ({
  keyState: state.ui.keyPassword.key
});

const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps;
type FelaProps = FelaStyles<typeof mapStylesToProps>;

class Index extends React.Component<Props & FelaProps & InjectedFormProps<data.PasswordReset, Props>> {
  async componentDidMount() {
    await checkPasswordKey();
  }

  renderForm = () => {
    const { styles, handleSubmit, error, pristine, submitting } = this.props;
    return (
      <form className={styles.form} onSubmit={handleSubmit} autoComplete={''}>
        <h1 className={styles.heading}>Сбросить пароль</h1>
        {error && <Alert mssg={error} type={'error'} />}
        <Field
          name="password"
          component={CustomInputField}
          type="password"
          {...{
            floatingLabelText: 'Новый пароль',
            fullWidth: true
          }}
        />
        <Field
          name="password_confirm"
          component={CustomInputField}
          type="password"
          {...{
            floatingLabelText: 'Подтвердить пароль',
            fullWidth: true
          }}
        />
        <div className={styles.btnContainer}>
          <Link to={`/`} className={'mr-1'}>
            <RaisedButton>{'отмена'}</RaisedButton>
          </Link>
          <RaisedButton type="submit" primary disabled={pristine || submitting}>
            {submitting ? <i className="fas fa-circle-notch fa-spin" /> : <span style={{margin: 8}}>Обновить пароль</span>}
          </RaisedButton>
        </div>
        <div className={styles.subContainer}>
          <span>В этот раз точно вспомнил, <Link to={'/signin'}>войти</Link></span>
        </div>
      </form>
    );
  }

  render() {
    const { styles, keyState } = this.props;
    return (
      <Paper className={styles.container} zDepth={2}>
        {keyState.status ? this.renderForm() : <Alert mssg={keyState.message} type={'warning'} />}
      </Paper>
    );
  }
}


const CustomInputField: React.SFC<WrappedFieldProps & TextFieldProps> = props =>
    <TextField
      {...props.input}
      {...props}
      errorText={!!(props.meta.touched && props.meta.error) ? props.meta.error : ''}
    />
;

const container: FelaRule<Props> = () => ({
  maxWidth: 650,
  margin: 'auto',
  minWidth: 320,
  width: '100%'
});

const form: FelaRule<Props> = () => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '1rem'
});

const heading: FelaRule<Props> = () => ({
  alignSelf:  'flex-start'
});

const subContainer: FelaRule<Props> = () => ({
  display:  'flex',
  width:  '100%',
  justifyContent: 'space-between'
});

const btnContainer: FelaRule<Props> = () => ({
  margin: '2rem 0',
  justifyContent: 'center',
  display: 'flex',
  width: '100%',
});

const mapStylesToProps = {
  container,
  heading,
  form,
  subContainer,
  btnContainer
};

export default compose (
  ReduxConnect(mapStateToProps),
  FelaConnect(mapStylesToProps),
  reduxForm<data.PasswordReset, Props>({
    form: 'resetPassword',
    enableReinitialize: true,
    destroyOnUnmount: true,
    validate: validatePR,
    onSubmit: submitPR
  })
)(Index);
