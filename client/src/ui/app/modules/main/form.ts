import * as data from 'core/models';
import {
  change,
  FormErrors,
  FormSubmitHandler,
  reset,
  SubmissionError
} from 'redux-form';
import { newTransferRequest } from 'core/app/request';
import { triggerForm } from './operations';

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
  if (!values.gdpr) {
    errors.gdpr = 'Согласие обязательно';
  }
  return errors;
};

export const submitRequest: FormSubmitHandler<data.RequestInfo> = async (
  values: data.RequestInfo,
  dispatch
) => {
  try {
    await newTransferRequest(values);
    triggerForm(true);
    await dispatch(reset('newRequest'));
  } catch (e) {
    console.error('err', e);
    throw new SubmissionError({ _error: e.error.message });
  }
};
