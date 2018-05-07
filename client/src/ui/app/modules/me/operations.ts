import store from 'core/shared/store';
import * as data from 'core/models';
import { getUserProfile } from 'core/app/request';
// import { getKeyFromPath } from './selectors';

const state = () => store.getState();

export const getProfile = async () => {
  try {
    const payload: Partial<data.UserAuthInfo> = {
      userId: state().authInfo && state().authInfo.userId || ''
    };
    await getUserProfile(payload);
  } catch (error) {
    throw error;
  }
};
