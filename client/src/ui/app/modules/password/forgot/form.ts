import * as data from 'core/models';
import { change, FormErrors, FormSubmitHandler, reset, SubmissionError } from 'redux-form';
import { forgotPassword } from 'core/app/password';
import { changeUrl } from 'ui/app/operations';

export const validateFP = (values: Partial<data.PasswordForgot>): FormErrors<data.PasswordForgot> => {
  const errors = {} as FormErrors<data.PasswordForgot>;
  if (!values.email) {
    errors.email = 'Поле обязательно к заполнению';
  }

  return errors;
};

export const submitFP: FormSubmitHandler<data.PasswordForgot> = async (values: data.PasswordForgot, dispatch) => {
  try {
    await forgotPassword(values);
    await dispatch(reset('forgotPassword'));
    changeUrl(`/signin`);
  } catch (e) {
    throw new SubmissionError({  _error: e.error.message });
  }
};
