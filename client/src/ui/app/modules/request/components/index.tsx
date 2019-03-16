import { AppState } from 'core/models/app';
import { connect as ReduxConnect } from 'react-redux';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import { returntypeof } from 'react-redux-typescript';
import * as React from 'react';
import { compose } from 'redux';
import Paper from 'material-ui/Paper';
import { getRequestId } from '../selectors';
import { getRequestState, getRequest } from '../operations';
import { Rstatus } from 'core/models/api';
import * as moment from 'moment';
import Form from './Form';
import { withTranslation, WithTranslation } from 'react-i18next';

const mapStateToProps = (state: AppState) => ({
  requestId: getRequestId(state),
  getRequestStatus: state.ui.api.requsetState.result,
  request: state.ui.api.selectedRequest.result,
  locale: state.localAppState.lang
});

const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps & WithTranslation;
type FelaProps = FelaStyles<typeof mapStylesToProps>;
class Index extends React.Component<Props & FelaProps> {
  async componentDidMount() {
    if (this.props.requestId) {
      await getRequestState(this.props.requestId).then(() => {
        const { getRequestStatus } = this.props;
        if (
          (getRequestStatus && getRequestStatus.Rstatus === Rstatus.OPEN) ||
          (getRequestStatus && getRequestStatus.Rstatus === Rstatus.ASSIGNED)
        ) {
          getRequest(this.props.requestId);
        }
      });
    }
  }

  render() {
    const { styles, getRequestStatus, request, t, locale } = this.props;
    const openRequest =
      getRequestStatus && getRequestStatus.Rstatus === Rstatus.OPEN;
    const assignedRequest =
      getRequestStatus && getRequestStatus.Rstatus === Rstatus.ASSIGNED;
    const closedRequest =
      getRequestStatus && getRequestStatus.Rstatus === Rstatus.CLOSED;
    const invalidRequest =
      getRequestStatus && getRequestStatus.Rstatus === Rstatus.INVALID;

    return (
      <div className={styles.container}>
        <Paper style={{ margin: '1rem' }} zDepth={2}>
          {request && (openRequest || assignedRequest) && (
            <div className={styles.headBox}>
              <h1 className={styles.texts}>{t('newRequest')}</h1>
              <span className={styles.texts}>
                <p>
                  {t('common:from')} <b>{request.from}</b>, {t('common:to')}{' '}
                  <b>{request.to}</b>
                </p>
                <p>
                  {t('common:date')}{' '}
                  <b>
                    {moment(request.date)
                      .locale(locale)
                      .format('LL')}
                  </b>
                  , {t('common:time')} <b>{request.time}</b>
                </p>
                <p>
                  {t('common:count')} {request.count}
                </p>
                {request.comment && (
                  <p>
                    {t('common:comment')} {request.comment}
                  </p>
                )}
              </span>
            </div>
          )}
          {closedRequest && (
            <div className={styles.headBox}>
              <h1 className={styles.texts}>{t('requestClosed')}</h1>
            </div>
          )}
          {invalidRequest && (
            <div className={styles.headBox}>
              <h1 className={styles.texts}>{t('errors:invalidLink')}</h1>
            </div>
          )}
        </Paper>
        {(openRequest || assignedRequest) && (
          <Paper style={{ margin: '1rem' }} zDepth={2}>
            {!assignedRequest && <Form />}
            {assignedRequest && (
              <div className={styles.headBox}>
                <h1 className={styles.texts}>{t('answerReq:offerSent')}</h1>
                <span className={styles.texts}>
                  <p>{t('answerReq:offerSuc')}</p>
                </span>
              </div>
            )}
          </Paper>
        )}
      </div>
    );
  }
}

const container: FelaRule<Props> = () => ({
  height: '100%',
  width: '100%'
});

const headBox: FelaRule<Props> = () => ({
  display: 'flex',
  flexDirection: 'column',
  fontSize: '1rem',
  padding: '1rem'
});

const texts: FelaRule<Props> = () => ({
  margin: '1rem 0'
});

const mapStylesToProps = {
  container,
  headBox,
  texts
};

export default compose(
  withTranslation('app'),
  ReduxConnect(mapStateToProps),
  FelaConnect(mapStylesToProps)
)(Index);
