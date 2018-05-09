import { ProfileDispatch, ProfileState } from './types';

const defaultState: ProfileState = {
  filesOnUpload: [],
  uploadProgress: 0
};

export const reducer = (state = defaultState, dispatch: ProfileDispatch): ProfileState => {
  switch (dispatch.type) {
    case 'user/upload/file':
      return {
        ...state,
        filesOnUpload: [
          ...state.filesOnUpload,
          dispatch.payload
        ]
      };
    case 'user/upload/clear':
      return {
        ...state,
        filesOnUpload: []
      };
    case 'user/upload/progress':
      return {
        ...state,
        uploadProgress: dispatch.payload
      }

    default:
      return state;
  }
};
