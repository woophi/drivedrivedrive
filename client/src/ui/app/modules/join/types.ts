export type UserState = {
  openPrivacyPolicy: boolean;
};

export type UserDispatch =
  | { type: 'user/openModalDialog'; payload: boolean };
