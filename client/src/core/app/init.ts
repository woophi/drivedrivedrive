import { reducer as formReducer } from 'redux-form';
import applicationEpic from 'ui/app/uiEpic';
import store, { injectEpic, injectReducer } from 'core/shared/store';
import { checkAuth } from './login';

export function init() {
  injectEpic(applicationEpic);
  injectReducer('form', formReducer);

  checkAuth();
}
