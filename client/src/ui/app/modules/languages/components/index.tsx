import * as React from 'react';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import { AppState } from 'core/models/app';
import { returntypeof } from 'react-redux-typescript';
import { compose } from 'redux';
import { connect as ReduxConnect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Ru } from './Ru';
import { En } from './En';
import { changeLanguage } from '../operations';

const mapStateToProps = (state: AppState) => ({
  activeLang: state.localAppState.lang
});
const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps & WithTranslation;

class LangComponent extends React.Component<Props> {
  get menuIcon() {
    const { activeLang } = this.props;
    const activeFlag = activeLang === 'en' ? <En /> : <Ru />;
    return <IconButton>{activeFlag}</IconButton>;
  }
  get ruFlag() {
    return (
      <IconButton>
        <Ru inMenu />
      </IconButton>
    );
  }
  get enFlag() {
    return (
      <IconButton>
        <En inMenu />
      </IconButton>
    );
  }

  handleEnChange = () => {
    console.warn('i click');
    changeLanguage('en');
  };
  handleRuChange = () => {
    changeLanguage('ru');
  };

  render() {
    const { t } = this.props;
    return (
      <IconMenu
        iconButtonElement={this.menuIcon}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuItem
          onClick={this.handleEnChange}
          leftIcon={this.enFlag}
          primaryText={t('topBar:english')}
        />
        <MenuItem
          onClick={this.handleRuChange}
          leftIcon={this.ruFlag}
          primaryText={t('topBar:russian')}
        />
      </IconMenu>
    );
  }
}

export const LanguagesMenu = compose(
  withTranslation('app'),
  ReduxConnect(mapStateToProps)
)(LangComponent);
