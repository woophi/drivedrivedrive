import store from 'core/shared/store';
import { UserAuthInfo } from 'core/models';
import { UserProfile } from 'core/models/api';
import { api, loadData } from 'core/app/api';
import { ProfileDispatch, FileCloud } from './types';

const state = () => store.getState();

export const getProfile = async () => {
  try {
    const payload: Partial<UserAuthInfo> = {
      userId: state().authInfo && state().authInfo.userId || ''
    };
    await loadData('userProfile', () => api.user.getProfile(payload));
  } catch (error) {
    throw error;
  }
};

export const updateProfile = (data: UserProfile) => api.user.updateProfile(data);

const fileToPreSave = (payload: FileCloud) => store.dispatch({ type: 'user/upload/file', payload } as ProfileDispatch);
export const clearPreSave = () => store.dispatch({ type: 'user/upload/clear' } as ProfileDispatch);

export const uploading = (payload: number) => store.dispatch({ type: 'user/upload/progress', payload } as ProfileDispatch);

export const upload = (file: File) => {


  return new Promise((resolve, reject) => {
    const url = `https://api.cloudinary.com/v1_1/dqbo8zk4k/upload`;
    const unsignedUploadPreset = 'h0uihgmr';

    const fd = new FormData();


    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    xhr.upload.addEventListener('progress', e => {
      const progress = Math.round((e.loaded * 100.0) / e.total);
      uploading(progress)
    });

    xhr.onreadystatechange = function(e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        // File uploaded successfully
        var response = JSON.parse(xhr.responseText);
        fileToPreSave(response);
        resolve();
      }
    };

    xhr.onerror = () => {
      reject(xhr.status);
    };


    fd.append('upload_preset', unsignedUploadPreset);
    fd.append('file', file);
    xhr.send(fd);
  });
};
