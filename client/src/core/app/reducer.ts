import { combineReducers } from 'redux';
import { reducer as guests } from 'ui/app/modules/main/reducer';
import { reducer as keyPassword } from 'ui/app/modules/password/reducer';
import { reducer as profile } from 'ui/app/modules/me/reducer';
import { reducer as user } from 'ui/app/modules/join/reducer';
import { reducer as cookie } from 'ui/app/modules/snackbar/reducer';
import { reducer as tables } from 'ui/app/modules/tables/reducer';
import { reducer as api } from './data';

export const uiReducers = combineReducers({
  guests,
  keyPassword,
  api,
  profile,
  user,
  cookie,
  tables
});
