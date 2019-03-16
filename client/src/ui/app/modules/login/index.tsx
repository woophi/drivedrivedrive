import { AppState } from 'core/models/app';
import { connect as ReduxConnect } from 'react-redux';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import { returntypeof } from 'react-redux-typescript';
import * as React from 'react';
import { compose } from 'redux';
import { Field, InjectedFormProps, reduxForm } from 'redux-form';
import * as data from 'core/models';
import { validateLogin, submitLogin } from './form';
import Paper from 'material-ui/Paper';
import { Link } from 'ui/app/components/Links';
import { changeUrl } from 'ui/app/operations';
import { Alert } from 'ui/app/components/Alert';
import { PasswordField } from 'ui/app/components/PasswordField';
import { withTranslation, WithTranslation } from 'react-i18next';
import { CustomInputField } from 'ui/atoms/fields';
import { FormButtonsRow } from 'ui/atoms/buttons';

const mapStateToProps = (state: AppState) => ({
  authInfo: state.authInfo,
  unauthPath: state.ui.profile.unauthPath
});

const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps & WithTranslation;
type FelaProps = FelaStyles<typeof mapStylesToProps>;

class Index extends React.Component<
  Props & FelaProps & InjectedFormProps<data.LoginInfo, Props>
> {
  componentDidMount() {
    if (this.props.authInfo) {
      changeUrl('/me');
    }
  }

  render() {
    const { styles, handleSubmit, error, pristine, submitting, t } = this.props;
    return (
      <Paper className={styles.container} zDepth={2}>
        <form className={styles.form} onSubmit={handleSubmit} autoComplete={''}>
          <h1 className={styles.heading}>{t('login:title')}</h1>
          {error && <Alert mssg={error} type={'error'} />}
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
            name="secret"
            component={PasswordField}
            type="password"
            {...{
              floatingLabelText: t('common:password'),
              fullWidth: true
            }}
          />
          <FormButtonsRow
            labelCancel={'app::common:button:cancel'}
            labelSubmit={'app::common:button:enter'}
            pristine={pristine}
            resetForm={'login'}
            submitting={submitting}
          />
          <div className={styles.subContainer}>
            <span>
              Новый водитель? <Link to={'/join'}>Зарегистрироваться</Link>
            </span>
            <Link to={'/forgot-password'}>Забыли пароль?</Link>
          </div>
        </form>
      </Paper>
    );
  }
}

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
  alignSelf: 'flex-start'
});

const subContainer: FelaRule<Props> = () => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between'
});

const mapStylesToProps = {
  container,
  heading,
  form,
  subContainer
};

export default compose(
  withTranslation('app'),
  ReduxConnect(mapStateToProps),
  FelaConnect(mapStylesToProps),
  reduxForm<data.LoginInfo, Props>({
    form: 'login',
    enableReinitialize: true,
    destroyOnUnmount: true,
    validate: validateLogin,
    onSubmit: submitLogin
  })
)(Index);
