import * as React from 'react';
import { Preloader } from './preloader';
import { createComponent, connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import Scrollbar from 'react-custom-scrollbars';

type Props = {
  fetchGdpr: () => Promise<void>;
  isLoading: boolean;
  data: any;
};

const Container = createComponent(
  () => ({
    width: '100%',
    position: 'relative'
  }),
  'div'
);

type FelaProps = FelaStyles<typeof mapStylesToProps>;
class PrivacyPolicyComp extends React.PureComponent<Props & FelaProps> {
  async componentDidMount() {
    await this.props.fetchGdpr();
  }

  render() {
    const { styles } = this.props;
    return (
      <Container className={styles.container}>
        <Scrollbar className={styles.container}>
          <div
            style={{ padding: '0.35rem' }}
            dangerouslySetInnerHTML={{ __html: this.props.data }}
          />
        </Scrollbar>
        <Preloader isShow={this.props.isLoading} />
      </Container>
    );
  }
}
const container: FelaRule<Props> = props => ({
  height: '350px',
  ...props.theme.mobile({
    height: 'auto',
    minHeight: '150px',
  })
});

const mapStylesToProps = {
  container
};
export const PrivacyPolicy = FelaConnect(mapStylesToProps)(PrivacyPolicyComp);
