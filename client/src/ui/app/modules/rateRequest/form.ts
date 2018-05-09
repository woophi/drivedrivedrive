import { RateRequest } from 'core/models/api';
import { change, FormErrors, FormSubmitHandler, reset, SubmissionError } from 'redux-form';
import { getRequestToRate, rateRequest } from './operations';

type SharedProps = {
  requestId: string;
  query: number;
}

export const validateRR = (values: Partial<RateRequest>): FormErrors<RateRequest> => {
  const errors = {} as FormErrors<RateRequest>;
  if (!values.ratingCar) {
    errors.ratingCar = 'Пожалуйста, поставьте оценку';
  }
  if (!values.ratingDriver) {
    errors.ratingDriver = 'Пожалуйста, поставьте оценку';
  }
  if (!values.ratingTrip) {
    errors.ratingTrip = 'Пожалуйста, поставьте оценку';
  }

  if (values && (values.ratingTrip <= 1 || values.ratingDriver <= 1 || values.ratingCar <= 1)) {
    errors.ratingComment = 'Пожалуйста, напишите, что Вам не понравилось';
  }

  return errors;
};

export const submitRR: FormSubmitHandler<RateRequest> = async (values: RateRequest, dispatch, props: SharedProps) => {
  try {
    const payload: RateRequest = {
      requestId: props.requestId,
      ...values
    };
    await rateRequest(payload)
      .then(() => getRequestToRate(props.requestId, props.query));
    dispatch(reset('assignRequest'));
  } catch (e) {
    throw new SubmissionError({  _error: e.error.message || e.error });
  }
};
