import { AppState } from 'core/models/app';
import { connect as ReduxConnect } from 'react-redux';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import { returntypeof } from 'react-redux-typescript';
import * as React from 'react';
import { compose } from 'redux';

const mapStateToProps = (state: AppState) => ({
  isMobile: state.localAppState.isMobile
});

const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps;
type FelaProps = FelaStyles<typeof mapStylesToProps>;

class Index extends React.Component<Props & FelaProps> {
  render() {
    const { styles } = this.props;
    return (
        <div className={styles.container}>
          <div>login</div>
        </div>
    );
  }
}

const container: FelaRule<Props> = () => ({
  display: 'flex',
  flexDirection: 'row',
  flex: 1
});
const mapStylesToProps = { container };

export default compose (
  ReduxConnect(mapStateToProps),
  FelaConnect(mapStylesToProps)
)(Index);
