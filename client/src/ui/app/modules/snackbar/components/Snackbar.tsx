import * as React from 'react';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import RaisedButton from 'material-ui/RaisedButton';
import { PrivacyPolicy } from 'ui/app/components/PrivacyPolicy';
import { returntypeof } from 'react-redux-typescript';
import { Modal } from 'ui/app/components/Modal';
import { AppState } from 'core/models/app';
import { compose } from 'redux';
import { DataStatus } from 'core/models/api';
import { connect as ReduxConnect } from 'react-redux';
import { getGdprCookieData, getGdprCookieResult } from '../selectors';
import {
  getGdprCookie,
  handleTriggerCookieModal,
  confirmCookie
} from '../operations';

const mapStateToProps = (state: AppState) => ({
  isOpenCookie: state.ui.cookie.open,
  isLoadingGdprCookie:
    getGdprCookieData(state).status === DataStatus.FETCHING ||
    getGdprCookieData(state).status === DataStatus.QUIET_FETCHING,
  cookieResult:
    (getGdprCookieResult(state) && getGdprCookieResult(state).text) || '',
  isCookieConfirmed: state.ui.cookie.confirmed
});

const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps;
type FelaProps = FelaStyles<typeof mapStylesToProps>;

const COOKIE = require('../../../../assets/cookie.png');
class SnackbarComponent extends React.PureComponent<Props & FelaProps> {
  get gdprComponent() {
    return (
      <PrivacyPolicy
        data={this.props.cookieResult}
        fetchGdpr={getGdprCookie}
        isLoading={this.props.isLoadingGdprCookie}
      />
    );
  }

  handleClose = () => handleTriggerCookieModal(false);
  handleOpen = () => handleTriggerCookieModal(true);

  render() {
    const { styles, isOpenCookie, isCookieConfirmed } = this.props;
    const actionButtons = [
      <RaisedButton
        key={'a-1'}
        label={'Закрыть'}
        primary
        onClick={this.handleClose}
      />
    ];
    const policy = (
      <a onClick={this.handleOpen} className={'curp'}>
        Подробнее здесь
      </a>
    );
    if (isCookieConfirmed) {
      return null;
    }
    return (
      <>
        <div className={styles.container}>
          <div className={styles.innerContainer}>
            <span>
              При предоставлении услуг на сайте нам помогают файлы cookies,
              продолжая пользоваться сайтом вы принимаете политику cookies.{' '}
              {policy}
              <img src={COOKIE} alt={'cookie'} onClick={this.handleOpen} />
            </span>
            <RaisedButton label={'Oк'} primary onClick={confirmCookie} />
          </div>
        </div>
        <Modal
          actions={actionButtons}
          body={this.gdprComponent}
          handleClose={this.handleClose}
          open={isOpenCookie}
          title={'Информация об использовании Cookies'}
        />
      </>
    );
  }
}

const container: FelaRule<Props> = props => ({
  position: 'fixed',
  bottom: 0,
  width: '100%',
  height: 'auto',
  display: 'flex',
  zIndex: 1300,
  visibility: 'visible',
  transform: 'translate(0%, 0px)',
  transition:
    'transform 400ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, visibility 400ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
  backgroundColor: 'rgba(0, 0, 0, 0.87)'
});

const innerContainer: FelaRule<Props> = () => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  padding: '1rem',
  justifyContent: 'space-around',
  color: 'rgb(255, 255, 255)',
  '>span': {
    padding: '.5rem',
    fontSize: '1rem',
    position: 'relative',
    '>a': {
      marginRight: 5
    },
    '>img': {
      width: '25px',
      height: '25px',
      position: 'absolute',
      cursor: 'pointer'
    }
  },
  '>div': {
    margin: 'auto 0',
    alignSelf: 'center'
  }
});

const mapStylesToProps = {
  container,
  innerContainer
};

export const SnackBar = compose(
  ReduxConnect(mapStateToProps),
  FelaConnect(mapStylesToProps)
)(SnackbarComponent);
