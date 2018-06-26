import * as data from 'core/models';
import { AppState } from 'core/models/app';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import { returntypeof } from 'react-redux-typescript';
import * as React from 'react';
import { compose } from 'redux';
import { Field, InjectedFormProps, reduxForm, WrappedFieldProps } from 'redux-form';
import { connect as ReduxConnect } from 'react-redux';
import { submitNewUser, validateNewUser } from './form';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'ui/app/components/Links';
import { changeUrl } from 'ui/app/operations';
import { Alert } from 'ui/app/components/Alert';
import Checkbox from 'material-ui/Checkbox';
import { Modal } from 'ui/app/components/Modal';
import { PrivacyPolicy } from 'ui/app/components/PrivacyPolicy';
import { handleTriggerGDPRDialog, getGdprUser } from './operations';
import { DataStatus } from 'core/models/api';
import { getGdprUserData, getGdprUserResult } from './selectors';

const mapStateToProps = (state: AppState) => ({
  authInfo: state.authInfo,
  isOpenGDPR: state.ui.user.openPrivacyPolicy,
  isLoadingGdpr:
    getGdprUserData(state).status === DataStatus.FETCHING ||
    getGdprUserData(state).status === DataStatus.QUIET_FETCHING,
  gdprResult:
    (getGdprUserResult(state) && getGdprUserResult(state).text) || ''
});

const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps;
type FelaProps = FelaStyles<typeof mapStylesToProps>;

type TextFieldProps = {
  hintText?: string;
  floatingLabelText?: any;
  errorText?: string;
  type?: string
};

class Index extends React.Component<Props & FelaProps & InjectedFormProps<data.NewUser, Props>> {
  componentDidMount() {
    if (this.props.authInfo) {
      changeUrl('/me');
    }
  }

  get gdprComponent() {
    return (
      <PrivacyPolicy
        data={this.props.gdprResult}
        fetchGdpr={getGdprUser}
        isLoading={this.props.isLoadingGdpr}
      />
    );
  }

  handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    handleTriggerGDPRDialog(true);
  }
  handleCloseModalGDPR = () => handleTriggerGDPRDialog(false);

  render() {
    const { styles, handleSubmit, error, pristine, submitting, isOpenGDPR } = this.props;
    const actionButtons = [
      <RaisedButton
        label={'Закрыть'}
        primary
        onClick={this.handleCloseModalGDPR}
      />
    ];

    const gdprLink = (
      <a style={{ textDecoration: 'underline' }} onClick={this.handleClick}>
        Согласие на обработку персональных данных
      </a>
    );
    return (
      <>
        <Paper className={styles.container} zDepth={2}>
          <form className={styles.form} onSubmit={handleSubmit} autoComplete={''}>
            <h1 className={styles.heading}>Регистрация нового водителя</h1>
            {error && <Alert mssg={error} type={'error'} />}
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
              name="firstname"
              component={CustomInputField}
              type="text"
              {...{
                floatingLabelText: 'Имя',
                fullWidth: true
              }}
            />
            <Field
              name="lastname"
              component={CustomInputField}
              type="text"
              {...{
                floatingLabelText: 'Фамилия',
                fullWidth: true
              }}
            />
            <Field
              name="password"
              component={CustomInputField}
              type="password"
              {...{
                floatingLabelText: 'Пароль',
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
              name="gdpr"
              component={CustomCheckbox}
              type="checkbox"
              {...{
                floatingLabelText: gdprLink
              }}
            />
            <div className={styles.btnContainer}>
              <Link to={`/`} className={'mr-1'}>
                <RaisedButton>{'отмена'}</RaisedButton>
              </Link>
              <RaisedButton type="submit" primary disabled={submitting}>
                {submitting ? <i className="fas fa-circle-notch fa-spin" /> : <span style={{margin: 8}}>Зарегистрироваться</span>}
              </RaisedButton>
            </div>
          </form>
        </Paper>
        <Modal
          actions={actionButtons}
          body={this.gdprComponent}
          handleClose={this.handleCloseModalGDPR}
          open={isOpenGDPR}
          title={'Пользовательское соглашение'}
        />
      </>
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
const CustomCheckbox: React.SFC<WrappedFieldProps & TextFieldProps> = props =>
    <Checkbox
      {...props.input}
      required={!!(props.meta.touched && props.meta.error)}
      onCheck={props.input.onChange}
      checked={Boolean(props.input.value)}
      // label={props.floatingLabelText}
      style={{marginTop: '1rem'}}
    />
;

const container: FelaRule<Props> = ({theme}) => ({
  maxWidth: 650,
  margin: 'auto',
  minWidth: 320,
  width: '100%',
  ...theme.mobile({
    marginTop: '4rem'
  })
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
  btnContainer
};

export default compose (
  ReduxConnect(mapStateToProps),
  FelaConnect(mapStylesToProps),
  reduxForm<data.NewUser, Props>({
    form: 'newUser',
    enableReinitialize: true,
    destroyOnUnmount: true,
    validate: validateNewUser,
    onSubmit: submitNewUser
  })
)(Index);
