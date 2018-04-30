import axios, { AxiosRequestConfig } from 'axios';
import store from './store';

export function callApi<T>(url: string, params: any, auth?: string): Promise<T> {
  const rc: AxiosRequestConfig = {
    headers: {
      'Accept': 'application/json'
    }
  };

  let data: any = null;
  if (typeof params === 'string') {
    data = params;
    rc.headers['Content-Type'] = 'application/octet-stream';
  } else if (params === null) {
    data = null;
  } else {
    data = JSON.stringify(params);
    rc.headers['Content-Type'] = 'application/json; charset=UTF-8';
  }

  if (auth) {
    rc.headers['Authorization'] = `Bearer ${auth}`;
  }

  return axios.post(url, data, rc)
    .then(r => r.status === 204 ? null : r.data as T, f => {
      const errorData = ((f && ('response' in f) && f.response) ? f.response['data'] as any : null) || {code: null, message: null};
      return Promise.reject(errorData) as any;
    });
}
