import { AppState } from 'core/models/app';
import { connect as ReduxConnect } from 'react-redux';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import { returntypeof } from 'react-redux-typescript';
import * as React from 'react';
import { compose } from 'redux';
import { Field, InjectedFormProps, reduxForm, WrappedFieldProps } from 'redux-form';
import * as data from 'core/models';
import { validateLogin, submitLogin } from './form';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'ui/app/components/Links';

const mapStateToProps = (state: AppState) => ({
  isMobile: state.localAppState.isMobile
});

const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps;
type FelaProps = FelaStyles<typeof mapStylesToProps>;

type TextFieldProps = {
  hintText?: string;
  floatingLabelText?: string;
  errorText?: string;
  type?: string
}

class Index extends React.Component<Props & FelaProps & InjectedFormProps<data.LoginInfo, Props>> {

  render() {
    const { styles, handleSubmit, error, pristine, submitting } = this.props;
    return (
        <div className={styles.container}>
          <form onSubmit={handleSubmit} autoComplete={''}>
            {error && <Paper zDepth={2}>{error}</Paper>}
            <Field
              name="email"
              component={CustomInputField}
              type="text"
              {...{
                floatingLabelText: 'email',
                errorText: error ? 'required' : ''
              }}
            />
            <Field
              name="secret"
              component={CustomInputField}
              type="password"
              {...{
                floatingLabelText: 'пароль',
                errorText: error ? 'required' : ''
              }}
            />
            <Link to={`/`}>
              <RaisedButton>{'отмена'}</RaisedButton>
            </Link>
            <RaisedButton type="submit" primary disabled={pristine || submitting}>
              {submitting ? <i className="fa fa-circle-o-notch fa-spin" /> : 'Войти'}
            </RaisedButton>
          </form>
        </div>
    );
  }
}


const CustomInputField: React.SFC<WrappedFieldProps & TextFieldProps> = props =>
    // {/* <Input {...props.input} {...props} invalid={!!(props.meta.touched && props.meta.error)} /> */}
    <TextField
      {...props.input}
      {...props}
      // value={props.input.value}
      // onChange={props.input.onChange}
    />
;

const container: FelaRule<Props> = () => ({
  display: 'flex',
  flexDirection: 'row',
  flex: 1
});
const mapStylesToProps = { container };

export default compose (
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
