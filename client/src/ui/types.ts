// import * as data from 'core/models/data';
import { GuestDispatch, GuestState } from './app/modules/main/types';
import { PasswordDispatch, PasswordState } from './app/modules/password/types';
import { ProfileDispatch, ProfileState } from './app/modules/me/types';
import { UserDispatch, UserState } from './app/modules/join/types';
import * as apiData from 'core/models/api';

export type UIState = {
  guests: GuestState,
  keyPassword: PasswordState,
  api: apiData.DataState,
  profile: ProfileState,
  user: UserState
};

export type UIDispatch =
  | GuestDispatch
  | PasswordDispatch
  | ProfileDispatch
  | apiData.DataDispatch
  | UserDispatch
;
