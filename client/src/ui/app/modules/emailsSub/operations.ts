import { api, loadData } from 'core/app/api';
import { store } from 'core/shared/store';
import { getHash } from './selectors';
const state = () => store.getState();

export const getSubscribeState = () =>
  loadData('subscribeState', api.user.subscribeState);

export const unSubscribe = () =>
  loadData('subscribeState', api.user.unsubFromMails);

export const getSubscribeStateGuest = () => {
  const payload = {
    hash: getHash(state())
  };
  return loadData('subscribeState', () => api.guest.subscribeState(payload));
};

export const unSubscribeGuest = () => {
  const payload = {
    hash: getHash(state())
  };
  return loadData('subscribeState', () => api.guest.unsubFromMails(payload));
};
