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
import { Alert } from 'ui/app/components/Alert';
import { Preloader } from 'ui/app/components/preloader';
import { FileUploader } from 'ui/app/components/Uploader';
import { DataStatus } from 'core/models/api';
import { parseToInt } from 'ui/shared/transforms';
import { Progress } from './Progress';
import { withTranslation, WithTranslation } from 'react-i18next';
import { CustomInputField } from 'ui/atoms/fields';
import { FormButtonsRow } from 'ui/atoms/buttons';

const CarSide = require('../../../../assets/side.jpg');
const CarFront = require('../../../../assets/front.jpg');
const CarInside = require('../../../../assets/inside.jpg');

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

class CarComponent extends React.Component<
  Props & FelaProps & InjectedFormProps<UserProfile, Props>
> {
  customImgFieldCarFront = (props: WrappedFieldProps) => (
    <FileUploader
      filedProps={props}
      exampleFile={CarFront}
      labelName={this.props.t('profile:front')}
    />
  )
  customImgFieldCarSide = (props: WrappedFieldProps) => (
    <FileUploader
      filedProps={props}
      exampleFile={CarSide}
      labelName={this.props.t('profile:side')}
    />
  )
  customImgFieldCarInside = (props: WrappedFieldProps) => (
    <FileUploader
      filedProps={props}
      exampleFile={CarInside}
      labelName={this.props.t('profile:inside')}
    />
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
            name="photoFront"
            component={this.customImgFieldCarFront}
            type="text"
          />
          <Field
            name="photoSide"
            component={this.customImgFieldCarSide}
            type="text"
          />
          <Field
            name="photoInside"
            component={this.customImgFieldCarInside}
            type="text"
          />
          <Field
            name="car.kind"
            component={CustomInputField}
            type="text"
            {...{
              floatingLabelText: t('profile:kind'),
              fullWidth: true
            }}
          />
          <Field
            name="car.model"
            component={CustomInputField}
            type="text"
            {...{
              floatingLabelText: t('profile:model'),
              fullWidth: true
            }}
          />
          <Field
            name="car.year"
            component={CustomInputField}
            type="number"
            {...{
              floatingLabelText: t('profile:year'),
              fullWidth: true
            }}
            parse={parseToInt}
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

export const Car = compose(
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
)(CarComponent);
