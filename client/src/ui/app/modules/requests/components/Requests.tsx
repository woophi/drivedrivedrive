import * as React from 'react';
import Paper from 'material-ui/Paper';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';

type FelaProps = FelaStyles<typeof mapStylesToProps>;

class RequestsComponent extends React.PureComponent<FelaProps> {
  render() {
    const { styles } = this.props;
    return (
      <div className={styles.container}>
        <Paper zDepth={2} style={{margin: '1rem', height: '100vh'}} >

        </Paper>
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
