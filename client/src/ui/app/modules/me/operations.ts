import store from 'core/shared/store';
import { UserAuthInfo } from 'core/models';
import { UserProfile } from 'core/models/api';
import { api, loadData } from 'core/app/api';

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

/**
 * @param setContent
 */
export const upload = (file: File) => {


  return new Promise((resolve, reject) => {
    const url = `https://api.cloudinary.com/v1_1/dqbo8zk4k/upload`;
    const unsignedUploadPreset = 'h0uihgmr';

    const fd = new FormData();


    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    xhr.upload.addEventListener('progress', e => {
      // store.dispatch({ type: 'admin/files/uploadProgress', payload: e.loaded / e.total } as FilesDispatch);
      const progress = Math.round((e.loaded * 100.0) / e.total);

      console.log(`fileuploadprogress data.loaded: ${e.loaded},
      data.total: ${e.total}`);
    });

    xhr.onreadystatechange = function(e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        console.warn();
        // File uploaded successfully
        var response = JSON.parse(xhr.responseText);
        // https://res.cloudinary.com/cloudName/image/upload/v1483481128/public_id.jpg
        var url = response.secure_url;
        // Create a thumbnail of the uploaded image, with 150px width
        var tokens = url.split('/');
        tokens.splice(-2, 0, 'w_150,c_scale');
        var img = new Image(); // HTML5 Constructor
        img.src = tokens.join('/');
        img.alt = response.public_id;
        // document.getElementById('gallery').appendChild(img);
        resolve();
        console.warn(response);
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
