import { AppState } from 'core/models/app';
import { connect as ReduxConnect } from 'react-redux';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import { returntypeof } from 'react-redux-typescript';
import * as React from 'react';
import { compose } from 'redux';
import { getSubStateDataResult } from '../../selectors';
import Paper from 'material-ui/Paper';
import { SubStatus } from 'core/models/api';
import { Form } from './Form';

const mapStateToProps = (state: AppState) => ({
  SubStateCode: getSubStateDataResult(state)
});

const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps;
type FelaProps = FelaStyles<typeof mapStylesToProps>;

class SubStateComponent extends React.PureComponent<Props & FelaProps> {

  get processUnsub() {
    const { styles, SubStateCode } = this.props;
    return(SubStatus.PROCESS === SubStateCode &&
      <>
        <div className={styles.headBox}>
          <h1 className={styles.texts}>Вы уверены, что хотите отписаться от почтовой рассылки?</h1>
          <p>Отключая рассылку уведомлений, Вы отказываетесь от использования сервиса.</p>
        </div>
        <Form />
      </>
    );
  }
  get doneUnsub() {
    const { styles, SubStateCode } = this.props;
    return(SubStatus.DONE === SubStateCode &&
      <div className={styles.headBox}>
        <h1 className={styles.texts}>Вы отписались от почтовой рассылки уведомлений.</h1>
      </div>
    );
  }
  get invalidUnsub() {
    const { styles, SubStateCode } = this.props;
    return(SubStatus.INVALID === SubStateCode &&
      <div className={styles.headBox}>
        <h1 className={styles.texts}>Ошибка: недействительная ссылка</h1>
      </div>
    );
  }

  render() {
    const { styles } = this.props;
    return(
      <div className={styles.container}>
        <Paper zDepth={2} style={{margin: '1rem'}}>
          {this.processUnsub}
          {this.doneUnsub}
          {this.invalidUnsub}
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
  padding: '1rem',
  alignItems: 'center'
});

const texts: FelaRule<Props> = () => ({
  margin: '1rem 0'
});

const mapStylesToProps = {
  container,
  headBox,
  texts
};

export const SubState = compose(
  ReduxConnect(mapStateToProps),
  FelaConnect(mapStylesToProps),
)(SubStateComponent);
