import store from 'core/shared/store';
import { GuestDispatch, HandlePoints } from './types';
const state = () => store.getState();

export const triggerForm = (payload: boolean) => store.dispatch({ type: 'guest/changeFormState', payload } as GuestDispatch);

export const handlePoints = (payload: HandlePoints) => store.dispatch({ type: 'guest/handlePoint', payload } as GuestDispatch);
