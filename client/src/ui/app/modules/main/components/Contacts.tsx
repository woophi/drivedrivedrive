import * as React from 'react';
import { compose } from 'redux';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import Star from 'material-ui/svg-icons/toggle/star';

type FelaProps = FelaStyles<typeof mapStylesToProps>;

const Contacts: React.SFC<FelaProps> = ({ styles }) => {
  const star1: React.CSSProperties = {
    position: 'absolute',
    top: 21,
    left: -40,
    width: 12,
    height: 12
  };
  const star2: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: -9,
    width: 12,
    height: 12
  };
  const star3: React.CSSProperties = {
    position: 'absolute',
    top: 21,
    left: 21,
    width: 12,
    height: 12
  };
  return (
    <div className={styles.container}>
      <div className={styles.stars}>
        <Star style={star1} />
        <Star style={star2} />
        <Star style={star3} />
      </div>
      <h3 className={styles.mainTitle}>VETTURA</h3>
      <span className={styles.subTitle}>Трансферные перевозки</span>
      <span className={styles.subTitle2}>КОНТАКТЫ</span>
      <span className={styles.text}>Вы можете разместить Ваш запрос через форму бронирования и указать в комментариях любые возникшие вопросы, мы обязательно на них ответим. Но если Вы все же предпочитаете другой способ для связи - воспользуйтесь контактами ниже:</span>
      <span className={styles.contactsSt}>
        <a href="tel:+420774804414">mob. +420-774-804-414</a>
        <a href="mailto:info@transferring.cz">Email: info@transferring.cz</a>
      </span>
    </div>
  );
};

const container: FelaRule = () => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  color: '#000',
  backgroundColor: '#fff',
});

const stars: FelaRule = () => ({
  margin: '2rem auto 0',
  position: 'relative',
});

const mainTitle: FelaRule = () => ({
  fontSize: 25,
  margin: '3rem auto 0',
  letterSpacing: 6
});

const subTitle: FelaRule = () => ({
  fontFamily: 'georgia,palatino,book antiqua,palatino linotype,serif',
  fontStyle: 'italic',
  margin: '1rem auto 0',
  fontSize: 15,
  letterSpacing: '0.2em'
});

const subTitle2: FelaRule = () => ({
  ...subTitle(),
  letterSpacing: 6
});

const text: FelaRule = ({theme}) => ({
  margin: '1rem auto 0',
  fontWeight: 'bold',
  width: '49%',
  ...theme.mobile({
    padding: '1rem',
    width: '90%',
  })
});

const contactsSt: FelaRule = ({theme}) => ({
  margin: '1rem auto 0',
  display: 'flex',
  justifyContent: 'center',
  fontWeight: 700,
  letterSpacing: '1.03px',
  '>a': {
    ':first-child': {
      marginRight: '4rem'
    },
    textDecoration: 'none'
  },
  ...theme.mobile({
    flexDirection: 'column',
    '>a': {
      ':first-child': {
        marginBottom: 5
      }
    }
  })
})

const mapStylesToProps = {
  container,
  stars,
  mainTitle,
  subTitle,
  subTitle2,
  text,
  contactsSt
};

export default compose(
  FelaConnect(mapStylesToProps)
)(Contacts);
