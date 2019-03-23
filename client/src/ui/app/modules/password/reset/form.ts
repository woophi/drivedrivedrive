import * as data from 'core/models';
import {
  FormErrors,
  FormSubmitHandler,
  reset,
  SubmissionError
} from 'redux-form';
import { resetPassword } from 'core/app/password';
import { checkAuth } from 'core/app/login';
import { changeUrl } from 'ui/app/operations';
import { match } from 'react-router';
import { i18n } from 'ui/app/components/i18n-proxy';

type SharedProps = {
  match?: match<{ key: string }>;
  token: string;
  isProfilePath: boolean;
};

export const validatePR = (
  values: Partial<data.PasswordReset>
): FormErrors<data.PasswordReset> => {
  const errors = {} as FormErrors<data.PasswordReset>;
  if (!values.password) {
    errors.password = i18n.required;
  } else if (!/^(?=.*[A-Za-z])[A-Za-z\d]{8,16}$/g.test(values.password)) {
    errors.password = i18n.invalidPassword;
  }

  if (!values.password_confirm) {
    errors.password_confirm = i18n.required;
  } else if (
    !/^(?=.*[A-Za-z])[A-Za-z\d]{8,16}$/g.test(values.password_confirm)
  ) {
    errors.password_confirm =
      i18n.invalidPassword;
  }

  return errors;
};

export const submitPR: FormSubmitHandler<data.PasswordReset> = async (
  values: data.PasswordReset,
  dispatch,
  props: SharedProps
) => {
  try {
    const key = props.token || props.match.params.key;
    const payload: data.PasswordReset = {
      key,
      password: values.password,
      password_confirm: values.password_confirm
    };
    await resetPassword(payload);
    if (!props.isProfilePath) {
      await checkAuth();
      changeUrl(`/me`);
    }
    await dispatch(reset('resetPassword'));
  } catch (e) {
    throw new SubmissionError({ _error: JSON.stringify(e) });
  }
};
