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
import Preloader from 'ui/app/components/preloader';
import Uploader from 'ui/app/components/Uploader';
import { DataStatus } from 'core/models/api';
import { parseToInt } from 'ui/shared/transforms';
import { Progress } from './Progress';
import { TextFieldProps } from 'ui/formTypes';

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
type Props = typeof StateProps;
type FelaProps = FelaStyles<typeof mapStylesToProps>;

class CarComponent extends React.Component<
  Props & FelaProps & InjectedFormProps<UserProfile, Props>
> {
  customImgFieldCarFront = (props: WrappedFieldProps) => (
    <Uploader
      filedProps={props}
      exampleFile={CarFront}
      labelName={'Фото спереди'}
    />
  )
  customImgFieldCarSide = (props: WrappedFieldProps) => (
    <Uploader
      filedProps={props}
      exampleFile={CarSide}
      labelName={'Фото сбоку'}
    />
  )
  customImgFieldCarInside = (props: WrappedFieldProps) => (
    <Uploader
      filedProps={props}
      exampleFile={CarInside}
      labelName={'Фото внутри'}
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
      getProfileErr
    } = this.props;
    return (
      <Paper className={styles.container} zDepth={2}>
        <form className={styles.form} onSubmit={handleSubmit} autoComplete={''}>
          {(error || getProfileErr) && <Alert mssg={error || getProfileErr} type={'error'} />}
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

export const Car = compose(
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
