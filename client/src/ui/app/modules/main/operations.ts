import store from 'core/shared/store';
import { GuestDispatch } from './types';
const state = () => store.getState();

export const triggerForm = (payload: boolean) => store.dispatch({ type: 'guest/changeFormState', payload } as GuestDispatch);
