import * as React from 'react';
import Preloader from './preloader';
import { createComponent } from 'react-fela';
import Scrollbar from 'react-custom-scrollbars';

type Props = {
  fetchGdpr: () => Promise<void>;
  isLoading: boolean;
  data: any;
};

const Container = createComponent(
  () => ({
    height: '350px',
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
        <Scrollbar style={{ height: 350 }}>
          <div dangerouslySetInnerHTML={{ __html: this.props.data }} />
        </Scrollbar>
        <Preloader isShow={this.props.isLoading} />
      </Container>
    );
  }
}

export const PrivacyPolicy = PrivacyPolicyComp;
