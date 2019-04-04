import {
  FormErrors,
  FormSubmitHandler,
  reset,
  SubmissionError
} from 'redux-form';
import { i18n } from 'ui/app/components/i18n-proxy';
import { api } from 'core/app/api';

export const validate = (values: {
  message: string;
}): FormErrors<{ message: string }> => {
  const errors = {} as FormErrors<{ message: string }>;
  if (!values.message) {
    errors.message = i18n.required;
  }

  return errors;
};

export const submit: FormSubmitHandler<{ message: string }> = async (
  values: { message: string },
  dispatch
) => {
  try {
    await api.guest.sendMeMessage(values.message);
    await dispatch(reset('wpMessage'));
  } catch (e) {
    throw new SubmissionError({ _error: JSON.stringify(e) });
  }
};
