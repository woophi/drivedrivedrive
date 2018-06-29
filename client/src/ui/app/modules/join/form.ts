import * as data from 'core/models';
import { change, FormErrors, FormSubmitHandler, reset, SubmissionError } from 'redux-form';
import { registerNewUser } from 'core/app/request';
import { changeUrl } from 'ui/app/operations';

export const validateNewUser = (values: Partial<data.NewUser>): FormErrors<data.NewUser> => {
  const errors = {} as FormErrors<data.NewUser>;
  if (!values.email) {
    errors.email = 'Поле обязательно к заполнению';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Недействительный e-mail';
  }

  if (!values.firstname) {
    errors.firstname = 'Поле обязательно к заполнению';
  }

  if (!values.lastname) {
    errors.lastname = 'Поле обязательно к заполнению';
  }

  if (!values.password) {
    errors.password = 'Поле обязательно к заполнению';
  } else if (!/^(?=.*[A-Za-z])[A-Za-z\d]{8,16}$/g.test(values.password)) {
    errors.password = 'Пароль должен быть не менее 8 символов и не более 16';
  }

  if (!values.phone) {
    errors.phone = 'Поле обязательно к заполнению';
  }

  if (!values.gdpr) {
    errors.gdpr = 'Поле обязательно к заполнению';
  }

  return errors;
};

export const submitNewUser: FormSubmitHandler<data.NewUser> = async (values: data.NewUser, dispatch) => {
  try {
    await registerNewUser(values)
      .then(() => changeUrl('/me'));
    await dispatch(reset('newUser'));

  } catch (e) {
    throw new SubmissionError({  _error: e.error.message });
  }
};
