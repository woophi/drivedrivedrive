import axios, { AxiosRequestConfig } from 'axios';

export type HTTPMethod = 'get' | 'post' | 'put' | 'delete';

export function callApi<T>(method: HTTPMethod = 'post', url: string, data: any, auth?: string): Promise<T> {
  const rc: AxiosRequestConfig = {
    url,
    headers: {
      'Accept': 'application/json'
    },
    method
  };

  if (typeof data === 'string') {
    rc.data = data;
    rc.headers['Content-Type'] = 'application/octet-stream';
  } else if (data === null) {
    data = null;
  } else {
    rc.data = JSON.stringify(data);
    rc.headers['Content-Type'] = 'application/json; charset=UTF-8';
  }

  if (auth) {
    rc.headers.Authorization = `${auth}`;
  }

  return axios(rc)
    .then(r => r.status === 204 ? null : r.data as T, f => {
      const errorData = ((f && ('response' in f) && f.response) ? f.response['data'] as any : null) || {code: null, message: null};
      return Promise.reject(errorData) as any;
    });
}
