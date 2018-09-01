import * as React from 'react';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import { TabsRequests } from './Tabs';
import 'react-virtualized/styles.css';

type FelaProps = FelaStyles<typeof mapStylesToProps>;

class RequestsComponent extends React.PureComponent<FelaProps> {
  render() {
    const { styles } = this.props;
    return (
      <div className={styles.container}>
        <TabsRequests />
      </div>
    );
  }
}

const container: FelaRule<{}> = () => ({
  height: '100%',
  width: '100%'
});

const mapStylesToProps = {
  container
};

export const Requests = FelaConnect(mapStylesToProps)(RequestsComponent);
