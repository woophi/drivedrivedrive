// import * as data from 'core/models/data';
import { GuestDispatch, GuestState } from './app/modules/main/types';
import { PasswordDispatch, PasswordState } from './app/modules/password/types';

export type UIState = {
  guests: GuestState,
  keyPassword: PasswordState
};

export type UIDispatch =
  | GuestDispatch
  | PasswordDispatch
;
