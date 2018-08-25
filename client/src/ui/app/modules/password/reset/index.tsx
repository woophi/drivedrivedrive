import { AppState } from 'core/models/app';
import { connect as ReduxConnect } from 'react-redux';
import {
  connect as FelaConnect,
  FelaRule,
  FelaStyles,
  IStyle
} from 'react-fela';
import { returntypeof } from 'react-redux-typescript';
import * as React from 'react';
import { compose } from 'redux';
import {
  Field,
  InjectedFormProps,
  reduxForm,
  WrappedFieldProps
} from 'redux-form';
import * as data from 'core/models';
import { validatePR, submitPR } from './form';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'ui/app/components/Links';
import { Alert } from 'ui/app/components/Alert';
import { checkPasswordKey } from '../operations';
import { TextFieldProps } from 'ui/formTypes';

const mapStateToProps = (state: AppState) => ({
  keyState: state.ui.keyPassword.key,
  token: state.authInfo && state.authInfo.token,
  isProfilePath: state.router.location.pathname === '/me'
});

const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps;
type FelaProps = FelaStyles<typeof mapStylesToProps>;

class ResetPasswordComponent extends React.Component<
  Props & FelaProps & InjectedFormProps<data.PasswordReset, Props>
> {
  async componentDidMount() {
    if (!this.props.isProfilePath) {
      await checkPasswordKey();
    }
  }

  renderForm = () => {
    const {
      styles,
      handleSubmit,
      error,
      pristine,
      submitting,
      token,
      isProfilePath,
      keyState
    } = this.props;

    const labelBtn = token && isProfilePath ? 'Изменить' : 'Обновить пароль';

    const submitBtn = submitting ? (
      <i className="fas fa-circle-notch fa-spin" />
    ) : (
      <span style={{ margin: 8 }}>{labelBtn}</span>
    );

    const header =
      isProfilePath ? null : (
        <h1 className={styles.heading}>Сбросить пароль</h1>
      );

    const cancelBtn =
      isProfilePath ? null : (
        <Link to={`/`} className={'mr-1'}>
          <RaisedButton>{'отмена'}</RaisedButton>
        </Link>
      );

    const usefulLink =
      isProfilePath ? null : (
        <span>
          В этот раз точно вспомнил, <Link to={'/signin'}>войти</Link>
        </span>
      );

    const getError = (keyState.message && !isProfilePath || error) && (
      <Alert mssg={error || keyState.message} type={'error'} />
    );

    return (
      <form className={styles.form} onSubmit={handleSubmit} autoComplete={''}>
        {header}
        {getError}
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
          {cancelBtn}
          <RaisedButton type="submit" primary disabled={pristine || submitting}>
            {submitBtn}
          </RaisedButton>
        </div>
        <div className={styles.subContainer}>{usefulLink}</div>
      </form>
    );
  };

  get renderView() {
    const { keyState, isProfilePath } = this.props;
    if (keyState.status && !isProfilePath || isProfilePath) {
      return this.renderForm();
    } else if (!keyState.status && !isProfilePath && keyState.message) {
      return (
        <h1>
          Ошибка: недействительная ссылка
        </h1>
      );
    } else {
      return (
        <h1>
          Проверка
        </h1>
      );
    }
  }

  render() {
    return (
      <Paper className={this.props.styles.container} zDepth={2}>
        {this.renderView}
      </Paper>
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

const container: FelaRule<Props> = ({ isProfilePath }) => {
  const fromProfileSt = isProfilePath && {
      margin: '1rem',
      width: 'auto',
      height: '100%'
    };
  const routeResetPasswordSt = !isProfilePath && {
      maxWidth: 650,
      margin: 'auto',
      minWidth: 320,
      width: '100%',
      padding: '1rem'
    };
  return {
    ...fromProfileSt,
    ...routeResetPasswordSt
  };
};

const form: FelaRule<Props> = ({ isProfilePath }) => {
  const fromProfileSt: IStyle = isProfilePath && {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: '0 auto',
      padding: '1rem',
      height: '100%',
      maxWidth: 700
    };
  const routeResetPasswordSt: IStyle = !isProfilePath && {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1rem'
    };
  return {
    ...fromProfileSt,
    ...routeResetPasswordSt
  };
};

const heading: FelaRule<Props> = () => ({
  alignSelf: 'flex-start'
});

const subContainer: FelaRule<Props> = () => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between'
});

const btnContainer: FelaRule<Props> = () => ({
  margin: '2rem 0',
  justifyContent: 'center',
  display: 'flex',
  width: '100%'
});

const mapStylesToProps = {
  container,
  heading,
  form,
  subContainer,
  btnContainer
};

export default compose(
  ReduxConnect(mapStateToProps),
  FelaConnect(mapStylesToProps),
  reduxForm<data.PasswordReset, Props>({
    form: 'resetPassword',
    enableReinitialize: true,
    destroyOnUnmount: true,
    validate: validatePR,
    onSubmit: submitPR
  })
)(ResetPasswordComponent);
