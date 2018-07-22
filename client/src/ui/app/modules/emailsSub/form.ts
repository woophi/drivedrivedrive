import { unSubscribe } from './operations';
import { FormSubmitHandler, SubmissionError, reset } from 'redux-form';

export const submitSubDriver: FormSubmitHandler<null> = async (_, dispatch) => {
  try {
    await unSubscribe();
    await dispatch(reset('emailSubDriver'));
  } catch (e) {
    throw new SubmissionError({ _error: e.error.message });
  }
};
