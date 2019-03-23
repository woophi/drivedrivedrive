import * as data from 'core/models';
import { AppState } from 'core/models/app';
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
import { connect as ReduxConnect } from 'react-redux';
import { submitNewUser, validateNewUser } from './form';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { changeUrl } from 'ui/app/operations';
import { Alert } from 'ui/app/components/Alert';
import Checkbox from 'material-ui/Checkbox';
import { Modal } from 'ui/app/components/Modal';
import { PrivacyPolicy } from 'ui/app/components/PrivacyPolicy';
import { handleTriggerGDPRDialog, getGdprUser } from './operations';
import { DataStatus } from 'core/models/api';
import { getGdprUserData, getGdprUserResult } from './selectors';
import { TextFieldProps } from 'ui/formTypes';
import { CustomInputField, CustomSelectField } from 'ui/atoms/fields';
import { FormButtonsRow } from 'ui/atoms/buttons';
import { withTranslation, WithTranslation } from 'react-i18next';

const mapStateToProps = (state: AppState) => ({
  authInfo: state.authInfo,
  isOpenGDPR: state.ui.user.openPrivacyPolicy,
  isLoadingGdpr:
    getGdprUserData(state).status === DataStatus.FETCHING ||
    getGdprUserData(state).status === DataStatus.QUIET_FETCHING,
  gdprResult: (getGdprUserResult(state) && getGdprUserResult(state).text) || ''
});

const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps & WithTranslation;
type FelaProps = FelaStyles<typeof mapStylesToProps>;

class Index extends React.Component<
  Props & FelaProps & InjectedFormProps<data.NewUser, Props>
> {
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
  };
  handleCloseModalGDPR = () => handleTriggerGDPRDialog(false);

  render() {
    const {
      styles,
      handleSubmit,
      error,
      pristine,
      submitting,
      isOpenGDPR,
      t
    } = this.props;
    const actionButtons = [
      <RaisedButton
        label={t('common:button:close')}
        primary
        onClick={this.handleCloseModalGDPR}
      />
    ];

    const gdprLink = (
      <a
        className={'curp'}
        style={{ textDecoration: 'underline' }}
        onClick={this.handleClick}
      >
        {t('register:gdpr')}
      </a>
    );
    return (
      <>
        <Paper className={styles.container} zDepth={2}>
          <form
            className={styles.form}
            onSubmit={handleSubmit}
            autoComplete={''}
          >
            <h1 className={styles.heading}>{t('register:title')}</h1>
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
              name="firstname"
              component={CustomInputField}
              type="text"
              {...{
                floatingLabelText: t('common:name'),
                fullWidth: true
              }}
            />
            <Field
              name="lastname"
              component={CustomInputField}
              type="text"
              {...{
                floatingLabelText: t('common:surname'),
                fullWidth: true
              }}
            />
            <Field
              name="password"
              component={CustomInputField}
              type="password"
              {...{
                floatingLabelText: t('common:password'),
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
              name="gdpr"
              component={CustomCheckbox}
              type="checkbox"
              {...{
                floatingLabelText: gdprLink,
                className: styles.gdprCheckbox
              }}
            />
            <FormButtonsRow
              labelCancel={'app::common:button:cancel'}
              labelSubmit={'app::common:button:register'}
              pristine={pristine}
              resetForm={'newUser'}
              submitting={submitting}
            />
          </form>
        </Paper>
        <Modal
          actions={actionButtons}
          body={this.gdprComponent}
          handleClose={this.handleCloseModalGDPR}
          open={isOpenGDPR}
          title={t('gdpr')}
        />
      </>
    );
  }
}
const CustomCheckbox: React.SFC<WrappedFieldProps & TextFieldProps> = props => (
  <div className={props.className}>
    <Checkbox
      {...props.input}
      required={!!(props.meta.touched && props.meta.error)}
      onCheck={props.input.onChange}
      checked={Boolean(props.input.value)}
    />
    {props.floatingLabelText}
  </div>
);

const container: FelaRule<Props> = ({ theme }) => ({
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
  alignSelf: 'flex-start'
});


const gdprCheckbox: FelaRule = () => ({
  display: 'flex',
  width: '100%',
  '>div': {
    marginTop: '1rem',
    flexBasis: '0 !important',
    width: '0 !important'
  },
  '>a': {
    marginTop: '1.2rem',
    flexBasis: '100% !important',
  }
});

const mapStylesToProps = {
  container,
  heading,
  form,
  gdprCheckbox
};

export default compose(
  withTranslation('app'),
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
