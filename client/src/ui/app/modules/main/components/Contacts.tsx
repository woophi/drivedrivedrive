import * as React from 'react';
import { compose } from 'redux';
import { DriveTheme, driveTheme } from 'ui/shared/driveUI';
import { connect as fela, Style, FelaWithStylesProps, FelaRule } from 'react-fela';
import Star from 'material-ui/svg-icons/toggle/star';

type Props = {};

type FelaProps = FelaWithStylesProps<Props, typeof mapStylesToProps>;

const ContactsComponent: React.SFC<Props & FelaProps> = ({ styles }) => {
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
    <footer className={styles.container}>
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
        <a href="mailto:info@vettura.eu">Email: info@vettura.eu</a>
      </span>
    </footer>
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
  alignSelf: 'center'
});

const mainTitle: FelaRule = () => ({
  fontSize: 25,
  margin: '3rem auto 0',
  letterSpacing: 6,
  alignSelf: 'center'
});

const subTitle: FelaRule = () => ({
  fontFamily: 'georgia,palatino,book antiqua,palatino linotype,serif',
  fontStyle: 'italic',
  margin: '1rem auto 0',
  fontSize: 15,
  letterSpacing: '0.2em',
  alignSelf: 'center'
});

const subTitle2: FelaRule = () => ({
  ...subTitle(),
  letterSpacing: 6
});

const text: FelaRule = () => ({
  margin: '1rem auto 0',
  fontWeight: 'bold',
  width: '49%',
  ...driveTheme.mobile({
    padding: '1rem',
    width: '90%',
  })
});

const contactsSt: FelaRule = () => ({
  margin: '1rem auto 0',
  display: 'flex',
  justifyContent: 'center',
  fontWeight: 700,
  letterSpacing: '1.03px',
  '>a': {
    textDecoration: 'none'
  },
  ...driveTheme.mobile({
    flexDirection: 'column'
  })
});

const mapStylesToProps = {
  container,
  stars,
  mainTitle,
  subTitle,
  subTitle2,
  text,
  contactsSt
};

export const Contacts = compose(
  fela<Props, typeof mapStylesToProps, DriveTheme>(mapStylesToProps)
)(ContactsComponent);
