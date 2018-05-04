import * as React from 'react';
import { compose } from 'redux';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import Header from './Header';
import { Parallax } from 'react-spring';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import CompanyTittle from './CompanyTitle';
import { Link } from 'ui/app/components/Links';
import HowWork from './HowWork';

const VIDEO_BG = 'http://res.cloudinary.com/dqbo8zk4k/video/upload/v1525077103/file.mp4';

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
        <video className={styles.video} /*autoPlay*/ loop muted>
          <source src={VIDEO_BG} type="video/mp4" />
        </video>
        <Header parallaxRef={this.parallax} />
        <Parallax ref={this.setRef.refLax} pages={3.5}>

          <Parallax.Layer
            offset={0}
            speed={0.1}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <Link to={'/signin'} className={styles.alignButton}>
              <button className={styles.button}>Вход для водителей</button>
            </Link>
          </Parallax.Layer>

          <Parallax.Layer
            offset={0.1}
            speed={0.1}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <CompanyTittle />
          </Parallax.Layer>

          <Parallax.Layer
            offset={0.2}
            speed={0.1}
            style={{ display: 'flex', flexDirection: 'column', padding: '1rem' }}
          >
            <h1 className={styles.headingStyle}>
              {'Закажите трансфер у нас.\n Выберите авто, водителя и наслаждайтесь поездкой.\n По лучшей цене.'}
            </h1>
          </Parallax.Layer>

          <Parallax.Layer
            offset={0.5}
            speed={0.1}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <button
              className={styles.buttonLarge}
              onClick={() => this.parallax.scrollTo(2)}
            >
              Узнать цену
            </button>
          </Parallax.Layer>

          <Parallax.Layer
            offset={1}
            speed={0.1}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <h2 className={styles.headingStyle2}>
              {'Как мы работаем'}
            </h2>
          </Parallax.Layer>

          <Parallax.Layer
            offset={1.1}
            speed={0.1}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <HowWork />
          </Parallax.Layer>

          <Parallax.Layer
            offset={2.1}
            speed={0.1}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <h2 className={styles.headingStyle2}>
              {'Узнайте цену'}
            </h2>
          </Parallax.Layer>

          <Parallax.Layer
            offset={3}
            factor={0.5}
            speed={0}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'red', border: '1px solid green' }}
          >
            <div>kek</div>
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

const alignButton: FelaRule<Props> = () => ({
  marginTop: '4rem',
  alignSelf: 'flex-end',
  marginRight: '4rem'
})

const button: FelaRule<Props> = props => ({
  ...props.theme.items.primaryButton,
});

const buttonLarge: FelaRule<Props> = ({ theme }) => ({
  ...theme.items.primaryButton,
  marginTop: '10rem',
  alignSelf: 'center',
  fontSize: '2rem',
  textTransform: 'uppercase',
  height: '4rem',
  borderRadius: '2rem',
  padding: '0 2rem'
});

const headingStyle: FelaRule<Props> = ({theme}) => ({
  minWidth: 320,
  margin: '5rem auto 0',
  maxWidth: 1100,
  color: '#fff',
  fontSize: '4rem',
  fontWeight: 'normal',
  lineHeight: 1.1,
  ...theme.mobile({
    fontSize: '2.5rem',
  })
});

const headingStyle2: FelaRule<Props> = ({theme}) => ({
  alignSelf: 'center',
  color: '#fff',
  fontSize: '2.5rem',
  textTransform: 'uppercase',
  letterSpacing: 3,
  fontWeight: 'normal',
  marginTop: '6rem',
  ...theme.mobile({
    fontSize: '1.5rem',
    marginTop: '-17rem'
  })
})

const mapStylesToProps = {
  container,
  video,
  button,
  headingStyle,
  buttonLarge,
  alignButton,
  headingStyle2
};

export default compose(
  FelaConnect(mapStylesToProps)
)(Index);
