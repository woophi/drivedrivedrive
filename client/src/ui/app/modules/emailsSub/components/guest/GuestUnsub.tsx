import * as React from 'react';
import { getSubscribeStateGuest } from '../../operations';
import { SubState } from './SubState';

class GuestUnsubComponent extends React.PureComponent {
  async componentDidMount() {
    await getSubscribeStateGuest();
  }

  render() {
    return(
      <SubState />
    );
  }
}

export const GuestUnsub = GuestUnsubComponent;
