import { AppState } from 'core/models/app';
import { connect as ReduxConnect } from 'react-redux';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import { returntypeof } from 'react-redux-typescript';
import { driveTheme } from 'ui/shared/driveUI';
import * as React from 'react';
import * as ReactHintFactory from 'react-hint';
import { compose } from 'redux';
import 'react-hint/css/index.css';
// import '../scss/main.scss';
// import Routes from './Routes';
import ScreenMeasurer from '../modules/ScreenMeasurer';

const ReactHint = ReactHintFactory(React);

const mapStateToProps = (state: AppState) => ({
  isMobile: state.localAppState.isMobile
});

const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps;
type FelaProps = FelaStyles<typeof mapStylesToProps>;

class Main extends React.Component<Props & FelaProps> {
  render() {
    const { styles } = this.props;
    return (
        <div className={styles.container}>
          <ScreenMeasurer />
          {/* <Routes /> */}
          <div>HELO</div>
          <div id="user_confirmation_modal_container" />
          <ReactHint events delay={0} />
        </div>
    );
  }
}

const container: FelaRule<Props> = ({ isMobile }) => ({
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'row',
  boxSizing: 'border-box',
  position: 'absolute',
  height: '100%',
  width: '100%',
  '&:after': {
    content: '""',
    display: 'block',
    clear: 'both'
  }
});

const rootContainer: FelaRule<Props> = () => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'row',
  backgroundColor: driveTheme.palette.light,
  boxSizing: 'border-box',
  height: '100%'
});

const mapStylesToProps = { container, rootContainer };

export default compose (
  ReduxConnect(mapStateToProps),
  FelaConnect(mapStylesToProps)
)(Main);
