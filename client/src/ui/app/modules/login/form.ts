import * as data from 'core/models';
import { change, FormErrors, FormSubmitHandler, reset, SubmissionError } from 'redux-form';
import { loginSecret } from 'core/app/login';
import { changeUrl } from 'ui/app/operations';
import { saveUnauthPath } from 'ui/app/modules/me/operations';

type SharedProps = {
  unauthPath: string
}

export const validateLogin = (values: Partial<data.LoginInfo>): FormErrors<data.LoginInfo> => {
  const errors = {} as FormErrors<data.LoginInfo>;
  if (!values.email) {
    errors.email = 'Поле обязательно к заполнению';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Недействительный e-mail';
  }

  if (!values.secret) {
    errors.secret = 'Поле обязательно к заполнению';
  }

  return errors;
};

export const submitLogin: FormSubmitHandler<data.LoginInfo> = async (values: data.LoginInfo, dispatch, props: SharedProps) => {
  try {
    await loginSecret(values);
    await dispatch(reset('login'));
    if (props.unauthPath) {
      changeUrl(props.unauthPath);
      saveUnauthPath('');
    } else {
      changeUrl(`/me`);
    }
  } catch (e) {
    console.debug('wtf', e);
    throw new SubmissionError({  _error: e.error.message });
  }
};
