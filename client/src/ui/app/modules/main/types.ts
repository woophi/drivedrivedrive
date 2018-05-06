export type GuestState = {
  guestSubmitForm: boolean
};

export type GuestDispatch =
  | { type: 'guest/changeFormState', payload: boolean }
;
