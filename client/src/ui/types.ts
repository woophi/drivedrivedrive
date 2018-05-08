// import * as data from 'core/models/data';
import { GuestDispatch, GuestState } from './app/modules/main/types';
import { PasswordDispatch, PasswordState } from './app/modules/password/types';
import * as apiData from 'core/models/api';

export type UIState = {
  guests: GuestState,
  keyPassword: PasswordState,
  api: apiData.DataState
};

export type UIDispatch =
  | GuestDispatch
  | PasswordDispatch
  | apiData.DataDispatch
;
