import { AppState } from 'core/models/app';
import { connect as ReduxConnect } from 'react-redux';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import { returntypeof } from 'react-redux-typescript';
import * as React from 'react';
import { compose } from 'redux';
import Paper from 'material-ui/Paper';
import { getRequestId } from '../selectors';
import { confirmAndGetRequestState } from '../operations';
import { Rstatus } from 'core/models/api';

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
      await confirmAndGetRequestState(this.props.requestId);
    }
  }

  render() {
    const { styles, getRequestStatus } = this.props;
    const confirmedRequest = getRequestStatus && getRequestStatus.Rstatus === Rstatus.CONFIRMED;
    const invalidRequest = getRequestStatus && getRequestStatus.Rstatus === Rstatus.INVALID;
    const closedRequest = getRequestStatus && getRequestStatus.Rstatus === Rstatus.CLOSED;

    return (
        <div className={styles.container}>
          <Paper style={{margin: '1rem'}} zDepth={2}>
            {closedRequest &&
            <div className={styles.headBox}>
              <h1 className={styles.texts}>Заявка подтверждена!</h1>
              <span className={styles.texts}>
                <p>Данные о заявки были отправлены клиенту на почту</p>
              </span>
            </div>}
            {(invalidRequest || confirmedRequest) &&
            <div className={styles.headBox}>
              <h1 className={styles.texts}>Ошибка: недействительная ссылка</h1>
            </div> }
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