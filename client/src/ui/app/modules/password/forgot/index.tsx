import { AppState } from 'core/models/app';
import { connect as ReduxConnect } from 'react-redux';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import { returntypeof } from 'react-redux-typescript';
import * as React from 'react';
import { compose } from 'redux';
import { Field, InjectedFormProps, reduxForm, WrappedFieldProps } from 'redux-form';
import * as data from 'core/models';
import { validateFP, submitFP } from './form';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'ui/app/components/Links';
import { changeUrl } from 'ui/app/operations';
import { Alert } from 'ui/app/components/Alert';
import { TextFieldProps } from 'ui/formTypes';

const mapStateToProps = (state: AppState) => ({
  authInfo: state.authInfo
});

const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps;
type FelaProps = FelaStyles<typeof mapStylesToProps>;

class Index extends React.Component<Props & FelaProps & InjectedFormProps<data.PasswordForgot, Props>> {
  componentDidMount() {
    if (this.props.authInfo) {
      changeUrl('/me');
    }
  }

  render() {
    const { styles, handleSubmit, error, pristine, submitting } = this.props;
    return (
        <Paper className={styles.container} zDepth={2}>
          <form className={styles.form} onSubmit={handleSubmit} autoComplete={''}>
            <h1 className={styles.heading}>Забыли пароль?</h1>
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
            <div className={styles.btnContainer}>
              <Link to={`/`} className={'mr-1'}>
                <RaisedButton>{'отмена'}</RaisedButton>
              </Link>
              <RaisedButton type="submit" primary disabled={submitting}>
                {submitting ? <i className="fas fa-circle-notch fa-spin" /> : <span style={{margin: 8}}>Сбросить пароль</span>}
              </RaisedButton>
            </div>
            <div className={styles.subContainer}>
              <span>Неожиданно вспомнил, <Link to={'/signin'}>войти</Link></span>
            </div>
          </form>
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
  reduxForm<data.PasswordForgot, Props>({
    form: 'forgotPassword',
    enableReinitialize: true,
    destroyOnUnmount: true,
    validate: validateFP,
    onSubmit: submitFP
  })
)(Index);
