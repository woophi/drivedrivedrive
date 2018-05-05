import * as React from 'react';
import { compose } from 'redux';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';

type FelaProps = FelaStyles<typeof mapStylesToProps>;
type OwnProps = {
}

const Points: React.SFC<FelaProps & OwnProps> = ({ styles }) => {
  const DRGESDEN = "https://static.wixstatic.com/media/78d0ca_6fa62954888c4dff9b27f387ded73359~mv2.gif";
  const KARLOVY_VARY = "https://static.wixstatic.com/media/78d0ca_ee5c4321b9fc46c99ff3b5a9c75b034e~mv2.gif";
  const VENA = "https://static.wixstatic.com/media/78d0ca_50f4cb1aa58345adbe75ad1dfe001fe9~mv2.gif";
  return (
    <div className={styles.container}>
      <div className={styles.box1}>
        <img className={styles.img} src={DRGESDEN} alt="dresden flag"/>
        <span className={styles.mainTitle}>ПРАГА - ДРЕЗДЕН</span>
        <span className={styles.text}>Всего 90 минут пути до одного из крупнейших центров культуры Германии</span>
        <button className={styles.button}>Узнать цену</button>
      </div>
      <div className={styles.box2}>
        <img className={styles.img} src={KARLOVY_VARY} alt="karlovy vary flag"/>
        <span className={styles.mainTitle} style={{color: '#4CC89A'}}>ПРАГА - КАРЛОВЫ ВАРЫ</span>
        <span className={styles.text}>Один из самых популярных маршрутов из Праги в город-курорт Карловы Вары</span>
        <button className={styles.button}>Узнать цену</button>
      </div>
      <div className={styles.box3}>
        <img className={styles.img} src={VENA} alt="vena flag"/>
        <span className={styles.mainTitle} style={{color: '#4CC89A'}}>ПРАГА - ВЕНА</span>
        <span className={styles.text}>Вена - культурная столица Европы. Всего в 3,5 часах от Праги</span>
        <button className={styles.button}>Узнать цену</button>
      </div>
      <div className={styles.box4}>
        <i className={`fas fa-map-marker-alt ${styles.icon}`} />
        <span className={styles.mainTitle} style={{color: '#fff'}}>ПРАГА - НОРДКАП</span>
        <span className={styles.text}>Отвезем Вас даже в самую северную точку Европы</span>
      </div>
    </div>
  );
};

const container: FelaRule = () => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '7rem'
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
  fontWeight: 'bold'
});

const text: FelaRule = () => ({
  fontSize: 16,
  lineHeight: '1.4em',
  textAlign: 'center',
  margin: '1rem',
});

const button: FelaRule<OwnProps> = props => ({
  ...props.theme.items.primaryButton,
  margin: '1rem'
});

const box2: FelaRule<OwnProps> = props => ({
  ...box1(),
  backgroundColor: '#555555'
});

const box3: FelaRule<OwnProps> = props => ({
  ...box1(),
  backgroundColor: '#EDEDED',
  color: '#000'
});
const box4: FelaRule<OwnProps> = props => ({
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
