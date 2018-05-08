import { AppState } from 'core/models/app';
import { connect as ReduxConnect } from 'react-redux';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import { returntypeof } from 'react-redux-typescript';
import * as React from 'react';
import { compose } from 'redux';
import Paper from 'material-ui/Paper';
import { getRequestId } from '../selectors';
import { getRequestState, getRequest } from 'ui/app/modules/request/operations';
import { Rstatus } from 'core/models/api';
import * as moment from 'moment';
import Form from './Form';

const mapStateToProps = (state: AppState) => ({
  requestId: getRequestId(state),
  getRequestStatus: state.ui.api.requsetState.result,
});

const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps;
type FelaProps = FelaStyles<typeof mapStylesToProps>;
class Index extends React.Component<Props & FelaProps> {

  async componentDidMount() {
    if (this.props.requestId) {
      await getRequestState(this.props.requestId, true);
    }
  }

  render() {
    const { styles, getRequestStatus } = this.props;
    const processRequest = getRequestStatus && getRequestStatus.Rstatus === Rstatus.PROCESS;
    const closedRequest = getRequestStatus && getRequestStatus.Rstatus === Rstatus.CLOSED;

    return (
        <div className={styles.container}>
          <Paper style={{margin: '1rem'}} zDepth={2}>
            {processRequest &&
            <div className={styles.headBox}>
              <h1 className={styles.texts}>Поехали!</h1>
              <span className={styles.texts}>
                <p>Пожалуйста, укажите контактный номер телефона, чтобы водитель мог связаться с Вами в день поездки</p>
              </span>
              <Form />
            </div>}
            {closedRequest && <div className={styles.headBox}>
              <h1 className={styles.texts}>Спасибо!</h1>
              <span className={styles.texts}>
                <p>Ваш отклик отправлен водителю.</p>
                <p>В ближайшее время Вам на почту придет подтверждение трансфера с деталями.</p>
              </span>
            </div> || !processRequest &&
            <div className={styles.headBox}>
              <h1 className={styles.texts}>Ошибка недействительная ссылка или заявка была закрыта</h1>
            </div>}
          </Paper>
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
