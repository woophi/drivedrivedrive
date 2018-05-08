import store from 'core/shared/store';
import { UserAuthInfo } from 'core/models';
import { api, loadData } from 'core/app/api';
// import { getKeyFromPath } from './selectors';

const state = () => store.getState();

export const getProfile = async () => {
  try {
    const payload: Partial<UserAuthInfo> = {
      userId: state().authInfo && state().authInfo.userId || ''
    };
    await loadData('userProfile', () => api.user.getProfile(payload));
  } catch (error) {
    throw error;
  }
};
