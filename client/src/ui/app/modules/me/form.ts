import * as data from 'core/models/api';
import { change, FormErrors, FormSubmitHandler, reset, SubmissionError } from 'redux-form';
import * as operations from './operations';
import { resolve } from 'url';
import { reject } from 'ramda';
import store from 'core/shared/store';

const state = () => store.getState();

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

function getFileName(f: any) {
  const re = /(?:\.([^.]+))?$/;
  const fileName = f.name.replace(re, '');;
  return fileName ? fileName : null;
}

function getPreSave(f: any) {
  if (checkFile(f)) {
    const fileName = getFileName(f);
    const preSaveFiles = state().ui.profile.filesOnUpload;
    if (fileName) {
      const file = preSaveFiles.find(pf => pf.original_filename === fileName);
      if (file) {
        return {
          public_id: file.public_id,
          version: file.version,
          signature: file.signature,
          width: file.width,
          height: file.height,
          format: file.format,
          resource_type: file.resource_type,
          url: file.url,
          secure_url: file.secure_url
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  } else {
    return null;
  }
}

async function promiseFiles(files: any[]) {
  for (var i = 0; i < files.length; i++) {
    await operations.upload(files[i]);
  }
}

export const submitProfile: FormSubmitHandler<data.UserProfile> = async (values: data.UserProfile, dispatch) => {
  try {
    operations.handleSubmitting(true);
    let files: any[] = []
    files = checkFile(values.driverPhoto) ? [ values.driverPhoto ] : [];
    files = checkFile(values.photoFront) ? [ ...files, values.photoFront ] : files;
    files = checkFile(values.photoSide) ? [ ...files, values.photoSide ] : files;
    files = checkFile(values.photoInside) ? [ ...files, values.photoInside ] : files;

    if (files.length) {
      promiseFiles(files)
        .then(() => {
          const driverPhoto = getPreSave(values.driverPhoto);
          const photoFront = getPreSave(values.photoFront);
          const photoSide = getPreSave(values.photoSide);
          const photoInside = getPreSave(values.photoInside);

          const payload: data.UserProfile = {
            ...values,
            driverPhoto,
            photoFront,
            photoSide,
            photoInside
          };
          operations.updateProfile(payload);
        })
        .then(() => operations.clearPreSave())
        .then(() => operations.uploading(0))
        .then(() => operations.getProfile())
        .then(() => operations.handleSubmitting(false));
    } else {
      await operations.updateProfile(values);
      await operations.handleSubmitting(false);
      await operations.getProfile();
    }

  } catch (e) {
    throw new SubmissionError({  _error: JSON.stringify(e) });
  }
};
