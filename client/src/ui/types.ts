// import * as data from 'core/models/data';
import { GuestDispatch, GuestState } from './app/modules/main/types';

export type UIState = {
  guests: GuestState
};

export type UIDispatch =
  | GuestDispatch
;
