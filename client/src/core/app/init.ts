import { reducer as formReducer } from 'redux-form';
import { applicationEpic } from 'ui/app/uiEpic';
import { injectEpic, injectReducer } from 'core/shared/store';
import { checkAuth } from './login';

export const init = async () => {
  injectEpic(applicationEpic);
  injectReducer('form', formReducer);
  await checkAuth();
};
