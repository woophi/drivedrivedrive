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
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Alert } from 'ui/app/components/Alert';
import { getProfile } from '../operations';
import Preloader from 'ui/app/components/preloader';
import Uploader from 'ui/app/components/Uploader';
import { DataStatus } from 'core/models/api';
import { parseToInt } from 'ui/shared/transforms';
import Toggle from 'material-ui/Toggle';
import Progress from './Progress';
import { TextFieldProps } from 'ui/formTypes';

const CarSide = require('../../../../assets/side.jpg');
const CarFront = require('../../../../assets/front.jpg');
const CarInside = require('../../../../assets/inside.jpg');

const mapStateToProps = (state: AppState) => ({
  authInfo: state.authInfo,
  fetchProfile: state.ui.api.userProfile.status === DataStatus.QUIET_FETCHING,
  initialValues: state.ui.api.userProfile.result,
  handleSubmitting: state.ui.profile.handleSubmitting,
  getProfileErr: state.ui.api.userProfile.errorInfo &&
    JSON.stringify(state.ui.api.userProfile.errorInfo)
});

const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps;
type FelaProps = FelaStyles<typeof mapStylesToProps>;

class Profile extends React.Component<
  Props & FelaProps & InjectedFormProps<UserProfile, Props>
> {
  async componentDidMount() {
    await getProfile();
  }

  customImgFieldDriver = (props: WrappedFieldProps) => (
    <Uploader filedProps={props} labelName={'Фото водителя'} />
  );
  customImgFieldCarFront = (props: WrappedFieldProps) => (
    <Uploader
      filedProps={props}
      exampleFile={CarFront}
      labelName={'Фото спереди'}
    />
  );
  customImgFieldCarSide = (props: WrappedFieldProps) => (
    <Uploader
      filedProps={props}
      exampleFile={CarSide}
      labelName={'Фото сбоку'}
    />
  );
  customImgFieldCarInside = (props: WrappedFieldProps) => (
    <Uploader
      filedProps={props}
      exampleFile={CarInside}
      labelName={'Фото внутри'}
    />
  );

  customToggleField = (props: WrappedFieldProps & TextFieldProps) => {
    return (
      <Toggle
        label={props.floatingLabelText}
        toggled={Boolean(props.input.value)}
        // onToggle={props.input.onChange}
      />
    );
  };

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
          {(error || getProfileErr) && <Alert mssg={error || getProfileErr} type={'error'} />}
          <div className={styles.middleTitle}>Рассылка уведомлений</div>
          <Field
            name="notifications.email"
            component={this.customToggleField}
            type="text"
            {...{
              floatingLabelText: 'E-mail уведомления'
            }}
          />

          <div className={styles.middleTitle}>Данные</div>
          <Field
            name="firstName"
            component={CustomInputField}
            type="text"
            {...{
              floatingLabelText: 'Имя',
              fullWidth: true
            }}
          />
          <Field
            name="lastName"
            component={CustomInputField}
            type="text"
            {...{
              floatingLabelText: 'Фамилия',
              fullWidth: true
            }}
          />
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
            name="phone"
            component={CustomInputField}
            type="tel"
            {...{
              floatingLabelText: 'Номер телефона',
              fullWidth: true
            }}
          />
          <Field
            name="driverPhoto"
            component={this.customImgFieldDriver as any}
            type="text"
          />
          <div className={styles.middleTitle}>Машина</div>
          <Field
            name="photoFront"
            component={this.customImgFieldCarFront as any}
            type="text"
          />
          <Field
            name="photoSide"
            component={this.customImgFieldCarSide as any}
            type="text"
          />
          <Field
            name="photoInside"
            component={this.customImgFieldCarInside as any}
            type="text"
          />
          <Field
            name="car.kind"
            component={CustomInputField}
            type="text"
            {...{
              floatingLabelText: 'Марка',
              fullWidth: true
            }}
          />
          <Field
            name="car.model"
            component={CustomInputField}
            type="text"
            {...{
              floatingLabelText: 'Модель',
              fullWidth: true
            }}
          />
          <Field
            name="car.year"
            component={CustomInputField}
            type="number"
            {...{
              floatingLabelText: 'Год',
              fullWidth: true
            }}
            parse={parseToInt}
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

const heading: FelaRule<Props> = () => ({
  alignSelf: 'flex-start'
});

const middleTitle: FelaRule<Props> = () => ({
  fontSize: 18,
  fontWeight: 'bold',
  margin: '1rem auto'
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
  middleTitle,
  btnContainer
};

export default compose(
  ReduxConnect(mapStateToProps),
  FelaConnect(mapStylesToProps),
  reduxForm<UserProfile, Props>({
    form: 'userProfile',
    enableReinitialize: true,
    destroyOnUnmount: true,
    validate: validateProfile,
    onSubmit: submitProfile
  })
)(Profile);
