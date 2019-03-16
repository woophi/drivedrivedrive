import { createComponent } from 'react-fela';
import * as React from 'react';
import * as ReactHintFactory from 'react-hint';
import 'react-hint/css/index.css';
import 'react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';
import { Router } from './Routes';
import { ScreenMeasurer } from '../modules/screenMeasurer';

const ReactHint = ReactHintFactory(React);

export class AppRoot extends React.Component {
  render() {
    return (
        <Container>
          <ScreenMeasurer />
          <Router />
          <div id="user_confirmation_modal_container" />
          <ReactHint events delay={0} />
        </Container>
    );
  }
}

const Container = createComponent(
  () => ({
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
  }),
  'div'
);
