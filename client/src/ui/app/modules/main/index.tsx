import * as React from 'react';
import { compose } from 'redux';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import Header from './Header';
import { Parallax } from 'react-spring';
import RaisedButton from 'material-ui/RaisedButton';

const url = (name: string, wrap = false) => `${wrap ? 'url(' : ''}https://awv3node-homepage.surge.sh/build/assets/${name}.svg${wrap ? ')' : ''}`

const VIDEO_BG = require('../../../assets/file.mp4');

type Props = {};

type FelaProps = FelaStyles<typeof mapStylesToProps>;

class Index extends React.Component<FelaProps> {
  componentDidMount() {
    if (this.parallax) {
      this.forceUpdate();
    }
  }

  parallax: any = null;

  setRef = {
    refLax: (el: any) => this.parallax = el
  }

  render() {
    const { styles } = this.props;
    return (
      <div className={styles.container}>
        <video className={styles.video} autoPlay loop muted>
          <source src={VIDEO_BG} type="video/mp4" />
        </video>
        <Header parallaxRef={this.parallax} />
        <Parallax ref={this.setRef.refLax} pages={4}>

          <Parallax.Layer
            offset={2}
            speed={-0.3}
            style={{
              backgroundSize: '80%',
              backgroundPosition: 'center',
              backgroundImage: url('clients', true)
            }}
          />

          <Parallax.Layer
            offset={0.1}
            speed={0.1}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <img src={url('server')} style={{ width: '20%' }} />
          </Parallax.Layer>

          <Parallax.Layer
            offset={1}
            speed={0.1}
            onClick={() => this.parallax.scrollTo(2)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={url('bash')} style={{ width: '40%' }} />
          </Parallax.Layer>

          <Parallax.Layer
            offset={2}
            speed={0.1}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => this.parallax.scrollTo(0)}>
            <img src={url('clients-main')} style={{ width: '40%' }} />
          </Parallax.Layer>

          <Parallax.Layer
            offset={3}
            speed={0}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => this.parallax.scrollTo(0)}>
            <img src={url('clients-main')} style={{ width: '40%' }} />
          </Parallax.Layer>
        </Parallax>
      </div>
    )
  }
}

const container: FelaRule<Props> = () => ({
    overflow: 'hidden',
    flex: 1,
    position: 'relative',
    height: '100vh'
});

const video: FelaRule = () => ({
  position: 'absolute',
  left: 0,
  width: '100%',
  height: '100%',
  [`@media (min-aspect-ratio: 16/9)`]: {
    height: '300%',
    top: '-100%'
  },
  [`@media (max-aspect-ratio: 16/9)`]: {
    width: '300%',
    left: '-100%'
  }
});



const mapStylesToProps = { container, video };

export default compose(
  FelaConnect(mapStylesToProps)
)(Index);
