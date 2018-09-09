export type GuestState = {
  guestSubmitForm: boolean;
  handlePoint: HandlePoints;
  openPrivacyPolicy: boolean;
  validEmail: boolean;
};

export const enum HandlePoints {
  p_d = 'Praha-dresden',
  p_kv = 'Praha-KarlovyVary',
  p_v = 'Praha-vena',
  none = ''
}

export type GuestDispatch =
  | { type: 'guest/changeFormState'; payload: boolean }
  | { type: 'guest/checkForEmail'; payload: boolean }
  | HandlePointAction
  | { type: 'guest/openModalDialog'; payload: boolean };

export type HandlePointAction = {
  type: 'guest/handlePoint';
  payload: HandlePoints;
};
