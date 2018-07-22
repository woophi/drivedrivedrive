import * as data from 'core/models/api';
import { FormErrors, FormSubmitHandler, reset, SubmissionError } from 'redux-form';
import { api } from 'core/app/api';
import { getRequestState } from './operations';

type SharedProps = {
  requestId: string;
  driverId: string;
}

export const validateRA = (values: Partial<{guestPhone: string}>): FormErrors<{guestPhone: string}> => {
  const errors = {} as FormErrors<{guestPhone: string}>;
  if (!values.guestPhone) {
    errors.guestPhone = 'Поле обязательно к заполнению';
  }

  return errors;
};

export const submitRA: FormSubmitHandler<{guestPhone: string}> = async (values: {guestPhone: string}, dispatch, props: SharedProps) => {
  try {
    const payload: data.AcceptRequest = {
      requestId: props.requestId,
      guestPhone: values.guestPhone,
      driverId: props.driverId
    };
    await api.request.acceptRequest(payload)
      .then(() => getRequestState(props.requestId));
    dispatch(reset('acceptRequest'));
  } catch (e) {
    throw new SubmissionError({  _error: e.error.message });
  }
};
