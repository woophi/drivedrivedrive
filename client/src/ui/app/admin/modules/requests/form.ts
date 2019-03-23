import * as admin from 'core/models/admin';
import { FormSubmitHandler, SubmissionError } from 'redux-form';
import { api } from 'core/app/api';
import { getRequest } from './operations';

export const updateRequest: FormSubmitHandler<admin.Request> = async (values) => {
  try {
    await api.admin.request.update(values._id, values.guest)
      .then(() => getRequest(values._id))
  } catch (e) {
    throw new SubmissionError({  _error: JSON.stringify(e) });
  }
};
