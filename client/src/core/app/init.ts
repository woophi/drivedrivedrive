import { reducer as formReducer } from 'redux-form';
import applicationEpic from 'ui/app/uiEpic';
import store, { injectEpic, injectReducer } from 'core/shared/store';
import { checkAuth } from './login';

const appReducer = require('core/app/reducer');

export function init() {
  injectEpic(applicationEpic);
  injectReducer('form', formReducer);
  injectReducer('ui', appReducer.default);
  checkAuth();
}
