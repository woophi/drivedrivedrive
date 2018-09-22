import { AppState } from 'core/models/app';
import { connect as ReduxConnect } from 'react-redux';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import { returntypeof } from 'react-redux-typescript';
import * as React from 'react';
import { compose } from 'redux';
import Paper from 'material-ui/Paper';
import { getRequestId, getDriverId } from '../selectors';
import { acceptDriverAndGetRequestState } from '../operations';
import { Rstatus, DataStatus } from 'core/models/api';
import { Preloader } from 'ui/app/components/preloader';

const mapStateToProps = (state: AppState) => ({
  driverId: getDriverId(state),
  requestId: getRequestId(state),
  getRequestStatus: state.ui.api.requsetState.result,
  loading:
    state.ui.api.requsetState.status === DataStatus.FETCHING ||
    state.ui.api.requsetState.status === DataStatus.QUIET_FETCHING
});

const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps;
type FelaProps = FelaStyles<typeof mapStylesToProps>;
class Index extends React.Component<Props & FelaProps> {
  componentDidMount() {
    if (this.props.requestId) {
      acceptDriverAndGetRequestState(
        this.props.requestId,
        this.props.driverId
      );
    }
  }

  render() {
    const { styles, getRequestStatus, loading } = this.props;
    const closedRequest =
      getRequestStatus && getRequestStatus.Rstatus === Rstatus.CLOSED;
    const invalidRequest =
      getRequestStatus && getRequestStatus.Rstatus === Rstatus.INVALID;

    return (
      <div className={styles.container}>
        <Paper style={{ margin: '1rem' }} zDepth={2}>
          {closedRequest && (
            <div className={styles.headBox}>
              <h1 className={styles.texts}>Спасибо!</h1>
              <span className={styles.texts}>
                <p>Ваш отклик отправлен водителю.</p>
                <p>
                  В ближайшее время Вам на почту придет подтверждение трансфера
                  с деталями.
                </p>
              </span>
            </div>
          )}
          {invalidRequest && (
            <div className={styles.headBox}>
              <h1 className={styles.texts}>
                Ошибка: недействительная ссылка
              </h1>
            </div>
          )}
        </Paper>
        <Preloader isShow={loading} />
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
  ReduxConnect(mapStateToProps),
  FelaConnect(mapStylesToProps)
)(Index);
