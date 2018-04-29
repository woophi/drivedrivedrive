import * as React from 'react';
import { compose } from 'redux';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';

type Props = {};

type FelaProps = FelaStyles<typeof mapStylesToProps>;

class Index extends React.Component<FelaProps> {
  render() {
    const { styles } = this.props;
    return <div className={styles.container}>HEllo</div>
  }
}

const container: FelaRule<Props> = () => ({
  display: 'flex',
  flexDirection: 'column',
  padding: '0 2rem',
  flex: 1
});
const mapStylesToProps = { container };

export default compose(
  FelaConnect(mapStylesToProps)
)(Index);
