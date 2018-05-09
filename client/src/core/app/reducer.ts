import { combineReducers } from 'redux';
import { reducer as guests } from 'ui/app/modules/main/reducer';
import { reducer as keyPassword } from 'ui/app/modules/password/reducer';
import { reducer as profile } from 'ui/app/modules/me/reducer';
import { reducer as api } from './data';

export default combineReducers({
  guests,
  keyPassword,
  api,
  profile
});
