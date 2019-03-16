import { RateRequest } from 'core/models/api';
import {
  FormErrors,
  FormSubmitHandler,
  reset,
  SubmissionError
} from 'redux-form';
import { getRequestToRate, rateRequest } from './operations';
import { i18n } from 'ui/app/components/i18n-proxy';

type SharedProps = {
  requestId: string;
  query: number;
};

export const validateRR = (
  values: Partial<RateRequest>
): FormErrors<RateRequest> => {
  const errors = {} as FormErrors<RateRequest>;
  if (!values.ratingCar) {
    errors.ratingCar = i18n.rateIt;
  }
  if (!values.ratingDriver) {
    errors.ratingDriver = i18n.rateIt;
  }
  if (!values.ratingTrip) {
    errors.ratingTrip = i18n.rateIt;
  }

  if (
    values &&
    (values.ratingTrip <= 4 ||
      values.ratingDriver <= 4 ||
      values.ratingCar <= 4) &&
    !values.ratingComment
  ) {
    errors.ratingComment = i18n.commentRating;
  }

  return errors;
};

export const submitRR: FormSubmitHandler<RateRequest> = async (
  values: RateRequest,
  dispatch,
  props: SharedProps
) => {
  try {
    const payload: RateRequest = {
      requestId: props.requestId,
      ...values
    };
    await rateRequest(payload).then(() =>
      getRequestToRate(props.requestId, props.query)
    );
    dispatch(reset('assignRequest'));
  } catch (e) {
    throw new SubmissionError({ _error: e.error.message });
  }
};
