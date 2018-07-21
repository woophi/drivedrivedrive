import { store } from 'core/shared/store';
import { push } from 'react-router-redux';

export const changeUrl = (url: string) => {
  store.dispatch(push(url));
};
