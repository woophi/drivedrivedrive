import { combineReducers } from 'redux';
import { reducer as guests } from 'ui/app/modules/main/reducer';
import { reducer as keyPassword } from 'ui/app/modules/password/reducer';

export default combineReducers({
  guests,
  keyPassword
});
