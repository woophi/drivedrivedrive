import * as data from 'core/models';
import {
  FormErrors,
  FormSubmitHandler,
  SubmissionError
} from 'redux-form';
import { updateGuestRequest, getGuestRequest } from './operations';
import { i18n } from 'ui/app/components/i18n-proxy';

type SharedProps = {
  hashId: string;
};

export const validateRequest = (
  values: Partial<data.RequestInfo>
): FormErrors<data.RequestInfo> => {
  const errors = {} as FormErrors<data.RequestInfo>;
  if (!values.email) {
    errors.email = i18n.required;
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = i18n.invalidEmail;
  }
  if (!values.name) {
    errors.name = i18n.required;
  }
  if (!values.from) {
    errors.from = i18n.required;
  }
  if (!values.to) {
    errors.to = i18n.required;
  }
  if (!values.date) {
    errors.date = i18n.required;
  }
  if (!values.time) {
    errors.time = i18n.required;
  }
  if (!values.count) {
    errors.count = i18n.required;
  }
  if (values.gdpr !== 'undefined' && !values.gdpr) {
    errors.gdpr = i18n.noGDPR;
  }
  if (values.phone !== 'undefined' && !values.phone) {
    errors.phone = i18n.required;
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
