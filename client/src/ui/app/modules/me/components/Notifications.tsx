import { AppState } from 'core/models/app';
import { connect as ReduxConnect } from 'react-redux';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import { returntypeof } from 'react-redux-typescript';
import * as React from 'react';
import { compose } from 'redux';
import {
  Field,
  InjectedFormProps,
  reduxForm,
  WrappedFieldProps
} from 'redux-form';
import { UserProfile } from 'core/models/api';
import { validateProfile, submitProfile } from '../form';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { Alert } from 'ui/app/components/Alert';
import { Preloader } from 'ui/app/components/preloader';
import { DataStatus } from 'core/models/api';
import Toggle from 'material-ui/Toggle';
import { Progress } from './Progress';
import { TextFieldProps } from 'ui/formTypes';

const mapStateToProps = (state: AppState) => ({
  fetchProfile: state.ui.api.userProfile.status === DataStatus.QUIET_FETCHING,
  initialValues: state.ui.api.userProfile.result,
  handleSubmitting: state.ui.profile.handleSubmitting,
  getProfileErr:
    state.ui.api.userProfile.errorInfo &&
    JSON.stringify(state.ui.api.userProfile.errorInfo)
});

const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps;
type FelaProps = FelaStyles<typeof mapStylesToProps>;

class NotificationsComponent extends React.Component<
  Props & FelaProps & InjectedFormProps<UserProfile, Props>
> {
  customToggleField = (props: WrappedFieldProps & TextFieldProps) => {
    const warningText = 'Отключая рассылку уведомлений, Вы отказываетесь от использования сервиса';
    return (
      <>
        <Toggle
          label={props.floatingLabelText}
          toggled={Boolean(props.input.value)}
          onToggle={props.input.onChange}
        />
        {!Boolean(props.input.value) && <h2>{warningText}</h2>}
      </>
    );
  }

  render() {
    const {
      styles,
      handleSubmit,
      error,
      pristine,
      submitting,
      fetchProfile,
      handleSubmitting,
      getProfileErr
    } = this.props;
    return (
      <Paper className={styles.container} zDepth={2}>
        <form className={styles.form} onSubmit={handleSubmit} autoComplete={''}>
          {(error || getProfileErr) && (
            <Alert mssg={error || getProfileErr} type={'error'} />
          )}
          <Field
            name="notifications.email"
            component={this.customToggleField}
            type="text"
            {...{
              floatingLabelText: 'E-mail уведомления'
            }}
          />
          <Progress />
          <div className={styles.btnContainer}>
            <RaisedButton
              type="submit"
              primary
              disabled={handleSubmitting || pristine || submitting}
            >
              {submitting || handleSubmitting ? (
                <i className="fas fa-circle-notch fa-spin" />
              ) : (
                'Сохранить'
              )}
            </RaisedButton>
          </div>
        </form>
        <Preloader isShow={fetchProfile} />
      </Paper>
    );
  }
}

const container: FelaRule<Props> = () => ({
  margin: '1rem',
  width: 'auto',
  height: '100%'
});

const form: FelaRule<Props> = () => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '0 auto',
  padding: '1rem',
  height: '100%',
  maxWidth: 700
});

const btnContainer: FelaRule<Props> = () => ({
  margin: '2rem 0',
  justifyContent: 'center',
  display: 'flex',
  width: '100%'
});

const mapStylesToProps = {
  container,
  form,
  btnContainer
};

export const Notifications = compose(
  ReduxConnect(mapStateToProps),
  FelaConnect(mapStylesToProps),
  reduxForm<UserProfile, Props>({
    form: 'userProfile',
    enableReinitialize: true,
    destroyOnUnmount: true,
    validate: validateProfile,
    onSubmit: submitProfile
  })
)(NotificationsComponent);
