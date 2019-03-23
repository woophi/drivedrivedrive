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
import { UserProfile, DataStatus } from 'core/models/api';
import { validateProfile, submitProfile } from '../form';
import Paper from 'material-ui/Paper';
import { Alert } from 'ui/app/components/Alert';
import { Preloader } from 'ui/app/components/preloader';
import { FileUploader } from 'ui/app/components/Uploader';
import { Progress } from './Progress';
import { withTranslation, WithTranslation } from 'react-i18next';
import { FormButtonsRow } from 'ui/atoms/buttons';
import { CustomInputField, CustomSelectField } from 'ui/atoms/fields';

const mapStateToProps = (state: AppState) => ({
  fetchProfile: state.ui.api.userProfile.status === DataStatus.QUIET_FETCHING,
  initialValues: state.ui.api.userProfile.result,
  handleSubmitting: state.ui.profile.handleSubmitting,
  getProfileErr: state.ui.api.userProfile.errorInfo &&
    JSON.stringify(state.ui.api.userProfile.errorInfo)
});

const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps & WithTranslation;
type FelaProps = FelaStyles<typeof mapStylesToProps>;

class ProfileComponent extends React.Component<
  Props & FelaProps & InjectedFormProps<UserProfile, Props>
> {
  customImgFieldDriver = (props: WrappedFieldProps) => (
    <FileUploader filedProps={props} labelName={this.props.t('profile:driver')} />
  )

  render() {
    const {
      styles,
      handleSubmit,
      error,
      pristine,
      submitting,
      fetchProfile,
      handleSubmitting,
      getProfileErr,
      t
    } = this.props;
    return (
      <Paper className={styles.container} zDepth={2}>
        <form className={styles.form} onSubmit={handleSubmit} autoComplete={''}>
          {(error || getProfileErr) && <Alert mssg={error || getProfileErr} type={'error'} />}
          <Field
            name="language"
            component={CustomSelectField}
            type="select"
            {...{
              floatingLabelText: t('common:language'),
              fullWidth: true,
              options: [
                {value: 'en', primaryText: t('topBar:english')},
                {value: 'ru', primaryText: t('topBar:russian')}
              ]
            }}
          />
          <Field
            name="firstName"
            component={CustomInputField}
            type="text"
            {...{
              floatingLabelText: t('common:name'),
              fullWidth: true
            }}
          />
          <Field
            name="lastName"
            component={CustomInputField}
            type="text"
            {...{
              floatingLabelText: t('common:surname'),
              fullWidth: true
            }}
          />
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
            name="phone"
            component={CustomInputField}
            type="tel"
            {...{
              floatingLabelText: t('common:phone'),
              fullWidth: true
            }}
          />
          <Field
            name="driverPhoto"
            component={this.customImgFieldDriver}
            type="text"
          />
          <Progress />
          <FormButtonsRow
            labelSubmit={'app::common:button:save'}
            labelCancel={'app::common:button:resetChanges'}
            pristine={pristine}
            resetForm={'userProfile'}
            submitting={submitting || handleSubmitting}
          />
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

const mapStylesToProps = {
  container,
  form
};

export const Profile = compose(
  withTranslation('app'),
  ReduxConnect(mapStateToProps),
  FelaConnect(mapStylesToProps),
  reduxForm<UserProfile, Props>({
    form: 'userProfile',
    enableReinitialize: true,
    destroyOnUnmount: true,
    validate: validateProfile,
    onSubmit: submitProfile
  })
)(ProfileComponent);
