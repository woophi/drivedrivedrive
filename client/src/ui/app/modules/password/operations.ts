import store from 'core/shared/store';
import * as data from 'core/models';
import { PasswordDispatch, PayloadKey } from './types';
import { getPasswordKey } from 'core/app/password';
import { getKeyFromPath } from './selectors';

const state = () => store.getState();

export const triggerKeyState = (payload: PayloadKey) => store.dispatch({ type: 'ui/getKey', payload } as PasswordDispatch);

export const checkPasswordKey = async () => {
  const params = {
    key: getKeyFromPath(state())
  }
  await getPasswordKey(params)
    .then(triggerKeyState)
    .catch(e => triggerKeyState(e.error))
};
