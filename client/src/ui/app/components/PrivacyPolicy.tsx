import * as React from 'react';
import Preloader from './preloader';
import { createComponent } from 'react-fela';

type Props = {
  fetchGdpr: () => Promise<void>;
  isLoading: boolean;
  data: any;
};

const Container = createComponent(
  () => ({
    height: '100%',
    width: '100%',
    position: 'relative'
  }),
  'div'
);

class PrivacyPolicyComp extends React.PureComponent<Props> {
  async componentDidMount() {
    await this.props.fetchGdpr();
  }

  render() {
    return (
      <Container>
        {this.props.data}
        <Preloader isShow={this.props.isLoading} />
      </Container>
    );
  }
}

export const PrivacyPolicy = PrivacyPolicyComp;
