import { unSubscribe, unSubscribeGuest } from './operations';
import { FormSubmitHandler, SubmissionError, reset } from 'redux-form';

export const submitSubDriver: FormSubmitHandler<null> = async (_, dispatch) => {
  try {
    await unSubscribe();
    await dispatch(reset('emailSubDriver'));
  } catch (e) {
    throw new SubmissionError({ _error: JSON.stringify(e) });
  }
};
export const submitSubGuest: FormSubmitHandler<null> = async (_, dispatch) => {
  try {
    await unSubscribeGuest();
    await dispatch(reset('emailSubGuest'));
  } catch (e) {
    throw new SubmissionError({ _error: JSON.stringify(e) });
  }
};
