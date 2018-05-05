import * as React from "react";
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import { compose } from 'redux';
import Divider from 'material-ui/Divider';
import * as VisibilitySensor from 'react-visibility-sensor';
import { connect as ReduxConnect } from 'react-redux';
import { AppState } from 'core/models/app';
import * as equals from 'ramda/src/equals';

const MOBILE_SCREEN_WIDTH = 768;

type FelaProps = FelaStyles<typeof mapStylesToProps>;
type Props = {
  isMobile: boolean
};

type LocalState = {
  boxes: {
    [key: number]: boolean
  }
}

class HowWork extends React.Component<Props & FelaProps, LocalState> {

  state: LocalState = {
    boxes: {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false
    }
  }

  componentDidUpdate(prevProps: Props, prevState: LocalState) {
    const keys = Object.keys(this.state.boxes);
    const hiddenBoxes = keys.filter(k => !this.state.boxes[Number(k)]);
    if (hiddenBoxes.length && !equals(this.state.boxes, prevState.boxes)) {
      this.awaitAnimation(true);
    }
  }

  changeStateOfBoxes = () => {
    const keys = Object.keys(this.state.boxes);
    const hiddenBoxes = keys.filter(k => !this.state.boxes[Number(k)]);
    if (hiddenBoxes.length) {
      const key = hiddenBoxes[0];
      this.setState({
        boxes: {
          ...this.state.boxes,
          [Number(key)]: true
        }
      })
    }
  }

  awaitAnimation = (visible: boolean) => {
    const keys = Object.keys(this.state.boxes);
    const hiddenBoxes = keys.filter(k => !this.state.boxes[Number(k)]);
    if (!visible) return;
    if (!this.state.boxes[1]) {
        this.changeStateOfBoxes();
    } else if (hiddenBoxes.length) {
      setTimeout(this.changeStateOfBoxes, 1000);
    }
  }

  rednerDesktop = () => {
    const handleStyleBox1 = (show: boolean): React.CSSProperties => ({
      visibility: show ? 'visible' : 'hidden',
      opacity: show ? 1 : 0.01,
      transform: show ? 'translateX(0)' : 'translateX(750px)',
      transition: 'all 1s ease'
    });
    const handleStyleBox2 = (show: boolean): React.CSSProperties => ({
      visibility: show ? 'visible' : 'hidden',
      opacity: show ? 1 : 0.01,
      transform: show ? 'translateX(0)' : 'translateX(500px)',
      transition: 'all 1s ease'
    });
    const handleStyleBox3= (show: boolean): React.CSSProperties => ({
      visibility: show ? 'visible' : 'hidden',
      opacity: show ? 1 : 0.01,
      transform: show ? 'translateX(0)' : 'translateX(250px)',
      transition: 'all 1s ease'
    });
    const handleStyleBottomBox= (show: boolean): React.CSSProperties => ({
      visibility: show ? 'visible' : 'hidden',
      opacity: show ? 1 : 0.9,
      clip: show ?  'rect(0px,282px,auto,0px)' :  'rect(0px,0,auto,0px)',
      transition: 'all 1s ease',
    });
    const { styles } = this.props;
    return (
      <VisibilitySensor onChange={this.awaitAnimation}>
        {({isVisible}: {isVisible: boolean}) =>
          <div className={styles.container}>
            <div style={handleStyleBox1(this.state.boxes[1])} className={`${styles.box}`}>
              <span className={styles.numberHead}>01</span>
              <Divider className={styles.dividerStl} />
              <span className={styles.boxText}>РАЗМЕСТИТЕ ЗАПРОС</span>
              <div style={handleStyleBottomBox(this.state.boxes[4])} className={`${styles.bottomBox} `}>
                <span className={'m-auto'}>Выберете пункт отправления и прибытия, укажите количество пассажиров и время отправления</span>
              </div>
              <div style={handleStyleBottomBox(this.state.boxes[7])} className={styles.topBox}>
                <span className={'m-auto'}>Эта информация будет видна водителям, которые предложат Вам свои услуги</span>
              </div>
            </div>
            <div style={handleStyleBox2(this.state.boxes[2])} className={styles.box}>
              <span className={styles.numberHead}>02</span>
              <Divider className={styles.dividerStl} />
              <span className={styles.boxText} style={{textAlign: 'center'}}>ОЗНАКОМЬТЕСЬ С ПРЕДЛОЖЕНИЯМИ</span>
              <div style={handleStyleBottomBox(this.state.boxes[5])} className={styles.bottomBox}>
                <span className={'m-auto'}>Вам будут поступать ценовые предложения от водителей</span>
              </div>
              <div style={handleStyleBottomBox(this.state.boxes[7])} className={styles.topBox}>
                <span className={'m-auto'}>Вы увидите цену поездки и модель авто, а так же оценки и отзывы о водителе</span>
              </div>
            </div>
            <div style={handleStyleBox3(this.state.boxes[3])} className={`${styles.box}`}>
              <span className={styles.numberHead}>03</span>
              <Divider className={styles.dividerStl} />
              <span className={styles.boxText}>ЗАКАЖИТЕ ТРАНСФЕР</span>
              <div style={handleStyleBottomBox(this.state.boxes[6])} className={styles.bottomBox}>
                <span className={'m-auto'}>Выберите подходящее Вам предложение и подтвердите отправление</span>
              </div>
              <div style={handleStyleBottomBox(this.state.boxes[7])} className={styles.topBox}>
                <span className={'m-auto'}>Вам на почту придет подтверждение и контактные данные водителя. Приятной поездки!</span>
              </div>
            </div>
          </div>
        }
      </VisibilitySensor>
    )
  }

  renderMobile = () => {
    const { styles } = this.props;
    return (
        <div className={styles.container}>
          <div className={`${styles.box}`}>
            <div className={`${styles.subBoxMob} `}>
              <span className={styles.numberHead}>01</span>
              <span className={styles.boxText}>РАЗМЕСТИТЕ ЗАПРОС</span>
              <Divider className={styles.dividerStl} />
              <span className={`${styles.bottomTextMob} m-auto`}>Выберете пункт отправления и прибытия, укажите количество пассажиров и время отправления</span>
            </div>
            <div className={`${styles.subBoxMob} `} >
              <span className={`${styles.bottomTextMob} m-auto`}>Эта информация будет видна водителям, которые предложат Вам свои услуги</span>
            </div>
          </div>
          <div className={styles.box}>
            <div className={`${styles.subBoxMob} `}>
              <span className={styles.numberHead}>02</span>
              <span className={styles.boxText}>ОЗНАКОМЬТЕСЬ С ПРЕДЛОЖЕНИЯМИ</span>
              <Divider className={styles.dividerStl} />
              <span className={`${styles.bottomTextMob} m-auto`}>Вам будут поступать ценовые предложения от водителей</span>
            </div>
            <div className={`${styles.subBoxMob} `}>
              <span className={`${styles.bottomTextMob} m-auto`}>Вы увидите цену поездки и модель авто, а так же оценки и отзывы о водителе</span>
            </div>
          </div>
          <div className={`${styles.box}`}>
            <div className={`${styles.subBoxMob} `}>
              <span className={styles.numberHead}>03</span>
              <span className={styles.boxText}>ЗАКАЖИТЕ ТРАНСФЕР</span>
              <Divider className={styles.dividerStl} />
              <span className={`${styles.bottomTextMob} m-auto`}>Выберите подходящее Вам предложение и подтвердите отправление</span>
            </div>
            <div className={`${styles.subBoxMob} `}>
              <span className={`${styles.bottomTextMob} m-auto`}>Вам на почту придет подтверждение и контактные данные водителя. Приятной поездки!</span>
            </div>
          </div>
        </div>
    )
  }

  render() {
    const { isMobile } = this.props;

    return isMobile ? this.renderMobile() : this.rednerDesktop();
  }
}

const container: FelaRule<Props> = ({theme}) => ({
  display: 'flex',
  color: '#fff',
  justifyContent: 'center',
  marginTop: '6rem',
  flexWrap: 'wrap',
  ...theme.mobile({
    marginTop: '-19rem'
  })
});

const box: FelaRule<Props> = ({theme}) => ({
  margin: '.5rem 1.5rem 0',
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  maxWidth: 250,
  minWidth: 250,
  width: '100%',
  backgroundColor: 'rgba(85, 85, 85, 0.7)',
  position: 'relative',
  height: 420,
  ...theme.mobile({
    height: 'auto'
  })
});

const numberHead: FelaRule<Props> = ({theme}) => ({
  fontSize: '7rem',
  fontWeight: 300,
  fontStyle: 'italic',
  margin: '0 auto 1rem',
  ...theme.mobile({
    fontSize: '3rem',
    margin: '0 0 0 .5rem'
  })
});

const boxText: FelaRule<Props> = ({theme}) => ({
  fontSize: '1rem',
  margin: '1rem auto',
  ...theme.mobile({
    letterSpacing: 1.6,
    margin: '0 0 0 .5rem'
  })
});

const bottomBox: FelaRule<Props> = prosp => ({
  display: 'flex',
  backgroundColor: 'rgba(85, 85, 85, 0.7)',
  padding: '1rem',
  position: 'absolute',
  width: 250,
  bottom: 0,
  left: 0,
  fontSize: '1rem',
  textAlign: 'center',
  height: '33%'
});

const topBox: FelaRule<Props> = props => ({
  ...bottomBox(props),
  top: 0,
  backgroundColor: 'rgba(85, 85, 85, 0.91)',
});

const subBoxMob: FelaRule<Props> = ({theme}) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'rgba(85, 85, 85, 0.91)',
  marginBottom: '.5rem'
});

const bottomTextMob: FelaRule<Props> = ({theme}) => ({
  textAlign: 'center',
  fontSize: '1rem',
  margin: '1rem .5rem'
});

const dividerStl: FelaRule<Props> = ({theme}) => ({
  height: '2 !important',
  ...theme.mobile({
    margin: '0 .5rem !important'
  })
});

const mapStylesToProps = {
  container,
  box,
  numberHead,
  boxText,
  bottomBox,
  topBox,
  subBoxMob,
  bottomTextMob,
  dividerStl
};

export default compose(
  FelaConnect(mapStylesToProps),
  ReduxConnect((state: AppState) => ({
    isMobile: state.screen.width <= MOBILE_SCREEN_WIDTH
  }))
)(HowWork);
