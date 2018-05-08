import * as data from 'core/models/api';
import { change, FormErrors, FormSubmitHandler, reset, SubmissionError } from 'redux-form';
import { updateProfile, getProfile, upload } from './operations';
import { resolve } from 'url';
import { reject } from 'ramda';

export const validateProfile = (values: Partial<data.UserProfile>): FormErrors<data.UserProfile> => {
  const errors = {} as FormErrors<data.UserProfile>;
  if (!values.email) {
    errors.email = 'Поле обязательно к заполнению';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Недействительный e-mail';
  }

  if (!values.firstName) {
    errors.firstName = 'Поле обязательно к заполнению';
  }

  if (!values.lastName) {
    errors.lastName = 'Поле обязательно к заполнению';
  }

  if (!values.phone) {
    errors.phone = 'Поле обязательно к заполнению';
  }

  return errors;
};

function checkFile(f: any) {
  if (!f || typeof f === 'string') {
    return false;
  } else {
    return true;
  }
}

async function promiseFiles(files: any[]) {
  for (var i = 0; i < files.length; i++) {
    await upload(files[i]);
  }
}

export const submitProfile: FormSubmitHandler<data.UserProfile> = async (values: data.UserProfile, dispatch) => {
  try {
    let files: any[] = []
    files = checkFile(values.driverPhoto) ? [ values.driverPhoto ] : [];
    files = checkFile(values.photoFront) ? [ ...files, values.photoFront ] : files;
    files = checkFile(values.photoSide) ? [ ...files, values.photoSide ] : files;
    files = checkFile(values.photoInside) ? [ ...files, values.photoInside ] : files;
    console.warn(files);
    if (files.length) {
      console.warn(promiseFiles(files));
      // promiseFiles(files)
      //   .then((r: any) => {
      //     const driverPhoto: any = (checkFile(values.driverPhoto) ? {
      //       public_id: r.public_id,
      //       version: r.version,
      //       signature: r.signature,
      //       width: r.width,
      //       height: r.height,
      //       format: r.format,
      //       resource_type: r.resource_type,
      //       url: r.url,
      //       secure_url: r.secure_url
      //     } : null);
      //     const payload: data.UserProfile = {
      //       ...values,
      //       driverPhoto
      //     };
      //     console.warn(driverPhoto);
      //     updateProfile(values);
      //   })
      //   .then(() => getProfile());
    } else {
      await updateProfile(values);
      await getProfile();
    }

  } catch (e) {
    throw new SubmissionError({  _error: e || e.error.message || e.error });
  }
};

