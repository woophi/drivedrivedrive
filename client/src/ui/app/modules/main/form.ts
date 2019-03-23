import * as data from 'core/models';
import {
  FormErrors,
  FormSubmitHandler,
  reset,
  SubmissionError
} from 'redux-form';
import { newTransferRequest } from 'core/app/request';
import { triggerForm, setHashId } from './operations';

type SharedProps = {
  hashId: string;
};

export const validateRequest = (
  values: Partial<data.RequestInfo>
): FormErrors<data.RequestInfo> => {
  const errors = {} as FormErrors<data.RequestInfo>;
  if (!values.email) {
    errors.email = 'Пожалуйста, заполните это поле';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Недействительный e-mail';
  }
  if (!values.name) {
    errors.name = 'Пожалуйста, заполните это поле';
  }
  if (!values.from) {
    errors.from = 'Пожалуйста, заполните это поле';
  }
  if (!values.to) {
    errors.to = 'Пожалуйста, заполните это поле';
  }
  if (!values.date) {
    errors.date = 'Пожалуйста, заполните это поле';
  }
  if (!values.time) {
    errors.time = 'Пожалуйста, заполните это поле';
  }
  if (!values.count) {
    errors.count = 'Пожалуйста, заполните это поле';
  }
  if (values.gdpr !== 'undefined' && !values.gdpr) {
    errors.gdpr = 'Согласие обязательно';
  }
  if (values.phone !== 'undefined' && !values.phone) {
    errors.phone = 'Пожалуйста, заполните это поле';
  }
  return errors;
};

export const submitRequest: FormSubmitHandler<data.RequestInfo> = async (
  values: data.RequestInfo,
  dispatch
) => {
  try {
    const hashId = await newTransferRequest(values);
    await setHashId(hashId);
    triggerForm(true);
    await dispatch(reset('newRequest'));
  } catch (e) {
    throw new SubmissionError({ _error: JSON.stringify(e) });
  }
};
