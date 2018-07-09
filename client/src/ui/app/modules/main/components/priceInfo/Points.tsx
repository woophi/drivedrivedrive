import * as React from 'react';
import { compose } from 'redux';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import { handlePoints } from '../../operations';
import { HandlePoints } from '../../types';

type FelaProps = FelaStyles<typeof mapStylesToProps>;

const DRGESDEN = require('../../../../../assets/dresden.gif');
const KARLOVY_VARY = require('../../../../../assets/vary.gif');
const VENA = require('../../../../../assets/vienna.gif');

const Points: React.SFC<FelaProps> = ({ styles }) => {

  const handleDresden = () => handlePoints(HandlePoints.p_d);
  const handleVary = () => handlePoints(HandlePoints.p_kv);
  const handleVena = () => handlePoints(HandlePoints.p_v);

  return (
    <div className={styles.container}>
      <div className={styles.box1}>
        <img className={styles.img} src={DRGESDEN} alt="dresden flag"/>
        <span className={styles.mainTitle}>ПРАГА - ДРЕЗДЕН</span>
        <span className={styles.text}>Всего 90 минут пути до одного из крупнейших центров культуры Германии</span>
        <button onClick={handleDresden} className={styles.button}>Узнать цену</button>
      </div>
      <div className={styles.box2}>
        <img className={styles.img} src={KARLOVY_VARY} alt="karlovy vary flag"/>
        <span className={styles.mainTitle} style={{color: '#4CC89A'}}>ПРАГА - КАРЛОВЫ ВАРЫ</span>
        <span className={styles.text}>Один из самых популярных маршрутов из Праги в город-курорт Карловы Вары</span>
        <button onClick={handleVary} className={styles.button}>Узнать цену</button>
      </div>
      <div className={styles.box3}>
        <img className={styles.img} src={VENA} alt="vena flag"/>
        <span className={styles.mainTitle} style={{color: '#4CC89A'}}>ПРАГА - ВЕНА</span>
        <span className={styles.text}>Вена - культурная столица Европы. Всего в 3,5 часах от Праги</span>
        <button onClick={handleVena} className={styles.button}>Узнать цену</button>
      </div>
      <div className={styles.box4}>
        <i className={`fas fa-map-marker-alt ${styles.icon}`} />
        <span className={styles.mainTitle} style={{color: '#fff'}}>ПРАГА - НОРДКАП</span>
        <span className={styles.text}>Отвезем Вас даже в самую северную точку Европы</span>
      </div>
    </div>
  );
};

const container: FelaRule = props => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '9rem',
  [`@media screen and (max-height: 967px)`]: {
    marginTop: '17rem',
  },
});

const box1: FelaRule = () => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#000',
  color: '#fff',
  minWidth: 245,
  height: 350,
  width: 245,
});

const img: FelaRule = () => ({
  width: 108,
  height: 114,
  margin: '1rem auto'
});

const icon: FelaRule = () => ({
  ...img(),
  fontSize: '7rem',
  paddingLeft: 24
})

const mainTitle: FelaRule = () => ({
  margin: '0 auto',
  fontSize: 18,
  lineHeight: '1em',
  fontWeight: 'bold',
  alignSelf: 'center'
});

const text: FelaRule = () => ({
  fontSize: 16,
  lineHeight: '1.4em',
  textAlign: 'center',
  margin: '1rem',
});

const button: FelaRule = props => ({
  ...props.theme.items.primaryButton,
  margin: '1rem'
});

const box2: FelaRule = () => ({
  ...box1(),
  backgroundColor: '#555555'
});

const box3: FelaRule = () => ({
  ...box1(),
  backgroundColor: '#EDEDED',
  color: '#000'
});
const box4: FelaRule = () => ({
  ...box1(),
  backgroundColor: '#4BD1A0',
  color: '#000'
});

const mapStylesToProps = {
  container,
  box1,
  img,
  mainTitle,
  button,
  text,
  box2,
  box3,
  box4,
  icon
};

export default compose(
  FelaConnect(mapStylesToProps)
)(Points);
