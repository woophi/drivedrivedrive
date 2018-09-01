import { GuestDispatch, GuestState } from './app/modules/main/types';
import { PasswordDispatch, PasswordState } from './app/modules/password/types';
import { ProfileDispatch, ProfileState } from './app/modules/me/types';
import { UserDispatch, UserState } from './app/modules/join/types';
import { CookieDispatch, CookieState } from './app/modules/snackbar/types';
import { TablesDispatch, TablesState } from './app/modules/tables/types';
import { RequestsDispatch, RequestsState } from './app/modules/requests/types';
import * as apiData from 'core/models/api';

export type UIState = {
  guests: GuestState,
  keyPassword: PasswordState,
  api: apiData.DataState,
  profile: ProfileState,
  user: UserState,
  cookie: CookieState,
  tables: TablesState,
  requests: RequestsState,
};

export type UIDispatch =
  | GuestDispatch
  | PasswordDispatch
  | ProfileDispatch
  | apiData.DataDispatch
  | UserDispatch
  | CookieDispatch
  | TablesDispatch
  | RequestsDispatch
;
