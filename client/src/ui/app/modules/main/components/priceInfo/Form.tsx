import {
  InjectedFormProps,
  reduxForm,
} from 'redux-form';
import { AppState } from 'core/models/app';
import { DataStatus } from 'core/models/api';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import { returntypeof } from 'react-redux-typescript';
import * as React from 'react';
import { compose } from 'redux';
import { connect as ReduxConnect } from 'react-redux';
import * as data from 'core/models';
import { submitRequest, validateRequest } from '../../form';
import { Alert } from 'ui/app/components/Alert';
import { Modal } from 'ui/app/components/Modal';
import { PrivacyPolicy } from 'ui/app/components/PrivacyPolicy';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import {
  triggerForm,
  handleTriggerGDPRDialog,
  getGdprGuest
} from '../../operations';
import { getGdprGuestData, getGdprGuestResult } from '../../selectors';
import { RequestFields } from './RequestFields';

const mapStateToProps = (state: AppState) => ({
  authInfo: state.authInfo,
  formState: state.ui.guests.guestSubmitForm,
  isOpenGDPR: state.ui.guests.openPrivacyPolicy,
  isLoadingGdpr:
    getGdprGuestData(state).status === DataStatus.FETCHING ||
    getGdprGuestData(state).status === DataStatus.QUIET_FETCHING,
  gdprResult:
    (getGdprGuestResult(state) && getGdprGuestResult(state).text) || ''
});

const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps;
type FelaProps = FelaStyles<typeof mapStylesToProps>;

class FormComponent extends React.Component<
  Props & FelaProps & InjectedFormProps<data.RequestInfo, Props>
> {

  handleClick = () => handleTriggerGDPRDialog(true);
  gaClick = () => {
    (window as any).gtag_report_conversion();
  }
  componentForm = () => {
    const { styles, handleSubmit, error, submitting } = this.props;
    const submittingButton = submitting ? (
      <i className="fas fa-circle-notch fa-spin" />
    ) : (
      'Отправить'
    );
    return (
      <React.Fragment>
        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <Alert mssg={error} type={'error'} />}
          <RequestFields
            clickOnGdpr={this.handleClick}
            withGdpr
          />

          <button
            onClick={this.gaClick}
            disabled={submitting}
            className={styles.buttonSt}
          >
            {submittingButton}
          </button>
        </form>
      </React.Fragment>
    );
  }

  get componentModal() {
    return (
      this.props.formState && (
        <div className={this.props.styles.modalSent}>
          <div className={this.props.styles.modalBody}>
            <IconButton
              iconClassName="fa fa-times fa-2"
              onClick={this.handleCloseAfterSubmit}
              style={{ alignSelf: 'flex-end' }}
              iconStyle={{ color: '#fff' }}
            />
            <span className={this.props.styles.modalText}>
              Спасибо за Вашу заявку! В ближайшее время Вам начнут поступать
              предложения от водителей
            </span>
          </div>
        </div>
      )
    );
  }

  get gdprComponent() {
    return (
      <PrivacyPolicy
        data={this.props.gdprResult}
        fetchGdpr={getGdprGuest}
        isLoading={this.props.isLoadingGdpr}
      />
    );
  }

  handleCloseAfterSubmit = () => triggerForm(false);
  handleCloseModalGDPR = () => handleTriggerGDPRDialog(false);

  render() {
    const { styles, isOpenGDPR } = this.props;
    const actionButtons = [
      <RaisedButton
        label={'Закрыть'}
        primary
        onClick={this.handleCloseModalGDPR}
        key={'0-c-b'}
      />
    ];
    return (
      <React.Fragment>
        <div className={styles.container}>
          {this.componentForm()}
          {this.componentModal}
        </div>
        <Modal
          actions={actionButtons}
          body={this.gdprComponent}
          handleClose={this.handleCloseModalGDPR}
          open={isOpenGDPR}
          title={'Пользовательское соглашение'}
        />
      </React.Fragment>
    );
  }
}

const container: FelaRule<Props> = ({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'rgba(85, 85, 85, 0.7)',
  width: 360,
  marginLeft: '3rem',
  height: 600,
  position: 'relative',
  ...theme.mobileEarly({
    margin: '0 1rem'
  })
});

const form: FelaRule<Props> = () => ({
  display: 'flex',
  flexDirection: 'column',
  margin: '1rem'
});

const buttonSt: FelaRule<Props> = props => ({
  ...props.theme.items.flatButton,
  margin: '5px 5px 0',
  backgroundColor: props.theme.palette.lightYellow,
  color: '#fff'
});

const modalSent: FelaRule<Props> = props => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(85, 85, 85, 0.9)',
  display: 'flex',
  flexDirection: 'column'
});

const modalBody: FelaRule<Props> = () => ({
  margin: 'auto 2rem',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'rgba(186,218,85,1)'
});

const modalText: FelaRule = () => ({
  textAlign: 'center',
  margin: '1rem',
  fontSize: '19px',
  letterSpacing: '1px',
  color: '#fff'
});


const mapStylesToProps = {
  container,
  form,
  buttonSt,
  modalSent,
  modalBody,
  modalText
};

export const Form = compose(
  ReduxConnect(mapStateToProps),
  FelaConnect(mapStylesToProps),
  reduxForm<data.RequestInfo, Props>({
    form: 'newRequest',
    enableReinitialize: true,
    destroyOnUnmount: true,
    validate: validateRequest,
    onSubmit: submitRequest
  })
)(FormComponent);
