import * as React from 'react';
import { compose } from 'redux';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import Header from './Header';
import { Parallax } from 'react-spring';
import CompanyTittle from './CompanyTitle';
import { Link } from 'ui/app/components/Links';
import HowWork from './HowWork';
import PriceInfo from './priceInfo';
import { Contacts } from './Contacts';
import { connect as ReduxConnect } from 'react-redux';
import { AppState } from 'core/models/app';
import { GuestRequestComponent } from './GuestRequest';

const MOBILE_SCREEN_WIDTH = 834;

const VIDEO_BG = require('../../../../assets/file.mp4');
const IMG_BG = require('../../../../assets/bck.jpg');

type Props = {
  isMobile: boolean;
};

type FelaProps = FelaStyles<typeof mapStylesToProps>;

class Index extends React.Component<Props & FelaProps> {
  parallax: any = null;

  setRef = {
    refLax: (el: any) => (this.parallax = el)
  };

  componentDidMount() {
    if (this.parallax) {
      this.forceUpdate();
    }
  }

  get renderBackground() {
    return this.props.isMobile ? (
      <img className={this.props.styles.img} src={IMG_BG} alt="default back" />
    ) : (
      <video
        preload="none"
        className={this.props.styles.video}
        autoPlay
        loop
        muted
      >
        <source src={`${VIDEO_BG}`} type="video/mp4" />
      </video>
    );
  }

  handleScrollTo = () => this.parallax.scrollTo(1.8);

  render() {
    const { styles, isMobile } = this.props;

    const mainLayer: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem'
    };

    const headText =
      'Закажите трансфер у нас.\n Выберите авто, водителя и наслаждайтесь поездкой.\n По лучшей цене.';
    return (
      <div className={styles.container}>
        {this.renderBackground}
        <Header parallaxRef={this.parallax} />
        <Parallax
          ref={this.setRef.refLax}
          pages={isMobile ? 3.9 : 3.5}
          style={{ minHeight: 900 }}
        >
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

          <Parallax.Layer offset={0.2} speed={0.1} style={mainLayer}>
            <h1 className={styles.headingStyle}>{headText}</h1>
          </Parallax.Layer>

          <Parallax.Layer
            offset={0.5}
            speed={0.1}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <button
              className={styles.buttonLarge}
              onClick={this.handleScrollTo}
            >
              Узнать цену
            </button>
          </Parallax.Layer>

          <Parallax.Layer
            offset={1}
            speed={0.1}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <h2 className={styles.headingStyle2}>{'Как мы работаем'}</h2>
          </Parallax.Layer>

          <Parallax.Layer
            offset={1.1}
            speed={0.1}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <HowWork />
          </Parallax.Layer>

          <Parallax.Layer
            offset={1.8}
            speed={0.1}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <h2 className={styles.headingStyle21}>{'Узнайте цену'}</h2>
          </Parallax.Layer>

          <Parallax.Layer
            offset={1.9}
            speed={0.1}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <PriceInfo />
          </Parallax.Layer>

          <Parallax.Layer
            offset={3}
            factor={isMobile ? 0.7 : 0.5}
            speed={0}
            style={{ display: 'flex', flexDirection: 'column', minHeight: 450 }}
          >
            <Contacts />
          </Parallax.Layer>
        </Parallax>
        {/* <GuestRequestComponent /> */}
      </div>
    );
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
});

const button: FelaRule<Props> = props => ({
  ...props.theme.items.primaryButton
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

const headingStyle: FelaRule<Props> = ({ theme }) => ({
  minWidth: 320,
  margin: '5rem auto 0',
  maxWidth: 1100,
  color: '#fff',
  fontSize: '4rem',
  fontWeight: 'normal',
  lineHeight: 1.1,
  alignSelf: 'center',
  ...theme.mobileEarly({
    alignSelf: 'unset',
  }),
  ...theme.mobile({
    fontSize: '2.5rem',
  })
});

const headingStyle2: FelaRule<Props> = props => ({
  alignSelf: 'center',
  color: '#fff',
  fontSize: '2.5rem',
  textTransform: 'uppercase',
  letterSpacing: 3,
  fontWeight: 'normal',
  marginTop: '6rem',
  ...props.theme.mobile({
    fontSize: '1.5rem',
    marginTop: '-17rem'
  }),
  ...props.theme.mobileEarly({
    marginTop: '-17rem'
  })
});

const headingStyle21: FelaRule<Props> = props => ({
  ...headingStyle2(props),
  marginTop: '8rem',
  ...props.theme.mobile({
    fontSize: '1.5rem',
    marginTop: '10rem'
  }),
  ...props.theme.mobileEarly({
    marginTop: '10rem'
  })
});

const img: FelaRule<Props> = ({ theme }) => ({
  position: 'absolute',
  left: 0,
  width: '100%',
  height: '100%',
  [`@media (min-aspect-ratio: 16/9)`]: {
    height: '300%',
    top: '-100%'
  },
  ...theme.mobileEarly({
    height: '100% !important',
    top: '0 !important'
  })
});

const preventHChageHeight: FelaRule = () => ({
  minHeight: '900px !important',
  height: '900px !important'
});

const mapStylesToProps = {
  container,
  video,
  button,
  headingStyle,
  buttonLarge,
  alignButton,
  headingStyle2,
  headingStyle21,
  img,
  preventHChageHeight
};

export default compose(
  FelaConnect(mapStylesToProps),
  ReduxConnect((state: AppState) => ({
    isMobile: state.screen.width <= MOBILE_SCREEN_WIDTH
  }))
)(Index);
