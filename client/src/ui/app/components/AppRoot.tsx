import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import * as React from 'react';
import * as ReactHintFactory from 'react-hint';
import { compose } from 'redux';
import 'react-hint/css/index.css';
import 'react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';
import { Router } from './Routes';
import { ScreenMeasurer } from '../modules/screenMeasurer';

const ReactHint = ReactHintFactory(React);
type Props = {};
type FelaProps = FelaStyles<typeof mapStylesToProps>;

class Main extends React.Component<Props & FelaProps> {
  render() {
    const { styles } = this.props;
    return (
        <div className={styles.container}>
          <ScreenMeasurer />
          <Router />
          <div id="user_confirmation_modal_container" />
          <ReactHint events delay={0} />
        </div>
    );
  }
}

const container: FelaRule<Props> = () => ({
  display: 'flex',
  flexDirection: 'row',
  boxSizing: 'border-box',
  height: '100vh',
  width: '100%',
  backgroundColor: '#fff',
  '&:after': {
    content: '""',
    display: 'block',
    clear: 'both'
  }
});
const mapStylesToProps = { container };

export const AppRoot = compose(
  FelaConnect(mapStylesToProps)
)(Main);
