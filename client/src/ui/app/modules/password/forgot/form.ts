import * as data from 'core/models';
import {
  FormErrors,
  FormSubmitHandler,
  reset,
  SubmissionError
} from 'redux-form';
import { forgotPassword } from 'core/app/password';
import { changeUrl } from 'ui/app/operations';
import { i18n } from 'ui/app/components/i18n-proxy';

export const validateFP = (
  values: Partial<data.PasswordForgot>
): FormErrors<data.PasswordForgot> => {
  const errors = {} as FormErrors<data.PasswordForgot>;
  if (!values.email) {
    errors.email = i18n.required;
  }

  return errors;
};

export const submitFP: FormSubmitHandler<data.PasswordForgot> = async (
  values: data.PasswordForgot,
  dispatch
) => {
  try {
    await forgotPassword(values);
    await dispatch(reset('forgotPassword'));
    changeUrl(`/signin`);
  } catch (e) {
    throw new SubmissionError({ _error: JSON.stringify(e) });
  }
};
