import * as React from 'react';
import Divider from 'material-ui/Divider';
import { compose } from 'redux';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';

type FelaProps = FelaStyles<typeof mapStylesToProps>;

const CompanyTitle: React.SFC<FelaProps> = ({ styles }) => {
  return (
    <div className={styles.container}>
      <Divider style={{height: 2}} />
      <div className={styles.wrapperTitle}>
        <span className={styles.mainTitle}>VETTURA</span>
        <span className={styles.subTitle}>поиск трансферов по Европе</span>
      </div>
      <Divider style={{height: 2}} />
    </div>
  );
};

const container: FelaRule = () => ({
  width: '25%', margin: '5rem auto 0', minWidth: 320, maxWidth: 600
});

const wrapperTitle: FelaRule = () => ({
  display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '.25rem 0'
});

const mainTitle: FelaRule = () => ({
  fontSize: '2rem', color: '#fff', fontWeight: 'bold', letterSpacing: '.5rem'
});

const subTitle: FelaRule = () => ({
  fontSize: '1rem', color: '#fff', fontStyle: 'italic'
});

const mapStylesToProps = {
  container,
  wrapperTitle,
  mainTitle,
  subTitle
};

export default compose<React.ComponentClass<{}>>(
  FelaConnect(mapStylesToProps)
)(CompanyTitle);
