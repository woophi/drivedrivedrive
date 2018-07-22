import { api, loadData } from 'core/app/api';

export const getSubscribeState = () =>
  loadData('subscribeState', api.user.subscribeState);

export const unSubscribe = () =>
  loadData('subscribeState', api.user.unsubFromMails);
