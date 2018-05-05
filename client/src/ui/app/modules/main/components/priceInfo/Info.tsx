import * as React from 'react';
import { compose } from 'redux';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';

type FelaProps = FelaStyles<typeof mapStylesToProps>;

const Info: React.SFC<FelaProps> = ({ styles }) => {
  return (
    <div className={styles.container}>
      <div style={{margin: '1rem'}}>
        <p className={styles.parag}>
          <span className={styles.mainTitle}>Сравните цены от разных водителей</span>
          <span>Воспользовавшись нашими услугами Вы сэкономите до 50% стоимости</span>
        </p>
        <p className={styles.parag}>
          <span className={styles.mainTitle}>Будьте уверены в водителе и автомобиле</span>
          <span>Система оценок водителей позволяет нам поддерживать высокое качество сервиса</span>
        </p>
        <p className={styles.parag}>
          <span className={styles.mainTitle}>От Эконом до Премиум</span>
          <span>Вне зависимости от случая, у нас всегда найдется то, что подходит именно Вам. За лучшую цену</span>
        </p>
      </div>
    </div>
  );
};

const container: FelaRule = ({theme}) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'rgba(85, 85, 85, 0.7)',
  width: 360,
  marginRight: '3rem',
  height: 330,
  ...theme.mobile({
    margin: '0 1rem 1rem'
  })
});

const parag: FelaRule = () => ({
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'open sans,sans-serif',
});

const mainTitle: FelaRule = () => ({
  fontSize: 17,
  fontWeight: 'bold'
});

const mapStylesToProps = {
  container,
  parag,
  mainTitle
};

export default compose(
  FelaConnect(mapStylesToProps)
)(Info);
