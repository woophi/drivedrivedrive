import { AppState } from 'core/models/app';
import { connect as ReduxConnect } from 'react-redux';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import { returntypeof } from 'react-redux-typescript';
import * as React from 'react';
import { compose } from 'redux';
import Paper from 'material-ui/Paper';
// import { NavLink } from 'ui/app/components/Links';
import { getCheckRoles, getRequestId } from '../selectors';
import { getRequestState, getRequest } from '../operations';
import { Rstatus } from 'core/models/api';
import * as moment from 'moment';
import Form from './Form';

const mapStateToProps = (state: AppState) => ({
  getRoles: getCheckRoles(state),
  requestId: getRequestId(state),
  getRequestStatus: state.ui.api.requsetState.result,
  request: state.ui.api.selectedRequest.result
});

const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps;
type FelaProps = FelaStyles<typeof mapStylesToProps>;
class Index extends React.Component<Props & FelaProps> {

  async componentDidMount() {
    if (this.props.requestId) {
      await getRequestState(this.props.requestId)
      .then(() => {
        const { getRequestStatus } = this.props;
        if (getRequestStatus && getRequestStatus.Rstatus === Rstatus.OPEN ||
          getRequestStatus && getRequestStatus.Rstatus === Rstatus.ASSIGNED
          ) {
          getRequest(this.props.requestId);
        }
      });
    }
  }

  render() {
    const { styles, getRoles, getRequestStatus, request } = this.props;
    const openRequest = getRequestStatus && getRequestStatus.Rstatus === Rstatus.OPEN;
    const assignedRequest = getRequestStatus && getRequestStatus.Rstatus === Rstatus.ASSIGNED;
    const closedRequest = getRequestStatus && getRequestStatus.Rstatus === Rstatus.CLOSED;

    return (
        <div className={styles.container}>
          <Paper style={{margin: '1rem'}} zDepth={2}>
            {request && (openRequest || assignedRequest) &&
            <div className={styles.headBox}>
              <h1 className={styles.texts}>Новая заявка</h1>
              <span className={styles.texts}>
                <p>{`Из ${request.from}, в ${request.to}`}</p>
                <p>дата {moment(request.date).format('L')}, время {request.time}</p>
                <p>количество человек {request.count}</p>
                {request.comment && <p>комментарий {request.comment}</p>}
              </span>
            </div> ||
            <div className={styles.headBox}>
              <h1 className={styles.texts}>заявка была закрыта</h1>
            </div>}
          </Paper>
          {(openRequest || assignedRequest) &&
            <Paper style={{margin: '1rem'}} zDepth={2}>
              {!assignedRequest && <Form />}
              {assignedRequest &&
                <div className={styles.headBox}>
                  <h1 className={styles.texts}>Ценовое предложение отправлено</h1>
                  <span className={styles.texts}>
                    <p>В случае заинтересованности клиента Вам на почту придет отклик</p>
                  </span>
                </div>
              }
            </Paper>
          }
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

export default compose (
  ReduxConnect(mapStateToProps),
  FelaConnect(mapStylesToProps),
)(Index);
