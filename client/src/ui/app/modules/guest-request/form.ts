import * as data from 'core/models';
import {
  FormErrors,
  FormSubmitHandler,
  SubmissionError
} from 'redux-form';
import { updateGuestRequest, getGuestRequest } from './operations';

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

export const submitEditRequest: FormSubmitHandler<data.RequestInfo> = async (
  values: data.RequestInfo,
  _,
  props: SharedProps
) => {
  try {
    const payload: data.UpdateRequestInfo = {
      ...values,
      hash: props.hashId
    };
    await updateGuestRequest(payload);
    await getGuestRequest(props.hashId);
  } catch (e) {
    throw new SubmissionError({ _error: e.error.message });
  }
};
