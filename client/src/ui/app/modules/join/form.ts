import * as data from 'core/models';
import { FormErrors, FormSubmitHandler, reset, SubmissionError } from 'redux-form';
import { registerNewUser } from 'core/app/request';
import { changeUrl } from 'ui/app/operations';
import { i18n } from 'ui/app/components/i18n-proxy';

export const validateNewUser = (values: Partial<data.NewUser>): FormErrors<data.NewUser> => {
  const errors = {} as FormErrors<data.NewUser>;
  if (!values.email) {
    errors.email = i18n.required;
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = i18n.invalidEmail;
  }

  if (!values.firstname) {
    errors.firstname = i18n.required;
  }

  if (!values.lastname) {
    errors.lastname = i18n.required;
  }

  if (!values.password) {
    errors.password = i18n.required;
  } else if (!/^(?=.*[A-Za-z])[A-Za-z\d]{8,16}$/g.test(values.password)) {
    errors.password = i18n.invalidPassword;
  }

  if (!values.phone) {
    errors.phone = i18n.required;
  }

  if (!values.gdpr) {
    errors.gdpr = i18n.required;
  }
  if (!values.language) {
    errors.language = i18n.required;
  }

  return errors;
};

export const submitNewUser: FormSubmitHandler<data.NewUser> = async (values: data.NewUser, dispatch) => {
  try {
    await registerNewUser(values)
      .then(() => changeUrl('/me'));
    await dispatch(reset('newUser'));

  } catch (e) {
    const error = e.error.message ? e.error.message : JSON.stringify(e);
    throw new SubmissionError({ _error: error });
  }
};
