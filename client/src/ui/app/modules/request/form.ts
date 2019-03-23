import * as data from 'core/models/api';
import {
  FormErrors,
  FormSubmitHandler,
  reset,
  SubmissionError
} from 'redux-form';
import { api } from 'core/app/api';
import { getRequestState } from './operations';
import { i18n } from 'ui/app/components/i18n-proxy';

type SharedProps = {
  requestId: string;
};

export const validatePrice = (
  values: Partial<{ requestPrice: number }>
): FormErrors<{ requestPrice: number }> => {
  const errors = {} as FormErrors<{ requestPrice: number }>;
  if (!values.requestPrice) {
    errors.requestPrice = i18n.required;
  }

  return errors;
};

export const submitPrice: FormSubmitHandler<{ requestPrice: number }> = async (
  values: { requestPrice: number },
  dispatch,
  props: SharedProps
) => {
  try {
    const payload: data.AssignRequest = {
      requestId: props.requestId,
      requestPrice: values.requestPrice
    };
    await api.request
      .assignRequest(payload)
      .then(() => getRequestState(props.requestId));
    dispatch(reset('assignRequest'));
  } catch (e) {
    throw new SubmissionError({ _error: JSON.stringify(e) });
  }
};
