import axios, { AxiosRequestConfig } from 'axios';
import i18n from 'i18next';
import { store } from './store';
import { setCookie, getCookie } from 'core/cookieManager';

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

interface LocaleBundleExports {
  localeData: any[];
  momentLang?: string;
  resLang?: string;
  i18n: any;
  default: any;
}


function loadLocale(
  bundleId: string,
  localeId: string
): Promise<LocaleBundleExports> {
  const req = require.context(
    '../../locale',
    true,
    /^\.\/loc_.*\.ts$/
  );

  return new Promise((resolve, reject) => {
    for (const l of [localeId, localeId.split(/[-_]/)[0], 'default']) {
      const pth = `./loc_${bundleId}_${l}.ts`;

      if (req.keys().indexOf(pth) === -1) {
        continue;
      }

      resolve(req(pth));

      break;
    }
  });
}

export async function getLocaleBundle(localeId: string) {
  const bundleId = 'app';
  if (i18n.hasResourceBundle(localeId, bundleId)) {
    return i18n.getResourceBundle(localeId, bundleId);
  }

  try {
    const loc = await loadLocale(bundleId, localeId);
    const bundle = {
      ...loc.default,
      ...loc
    };

    Object.keys(bundle.i18n).forEach(ns => {
      i18n.addResourceBundle(bundle.resLang, ns, bundle.i18n[ns]);
    });
  } catch (e) {
    console.error(e);
  }

  return i18n.getResourceBundle(localeId, bundleId);
}

export async function setLocale(localeId: string) {
  const getSavedLang = getCookie('prefLang');
  if (!getSavedLang) {
    setCookie('prefLang', localeId, 128);
  }
  const setLangId = getSavedLang ? getSavedLang : localeId;
  await getLocaleBundle(setLangId);

  store.dispatch({ type: 'setResourcesLanguage', payload: setLangId });

  if (!i18n.isInitialized) {
    i18n.on('initialized', () => i18n.changeLanguage(setLangId));
  } else {
    i18n.changeLanguage(setLangId);
  }
}
