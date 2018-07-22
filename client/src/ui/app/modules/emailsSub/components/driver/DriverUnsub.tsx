import * as React from 'react';
import { getSubscribeState } from '../../operations';
import { SubState } from './SubState';

class DriverUnsubComponent extends React.PureComponent {
  async componentDidMount() {
    await getSubscribeState();
  }

  render() {
    return(
      <SubState />
    );
  }
}

export const DriverUnsub = DriverUnsubComponent;
