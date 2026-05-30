// routes
import { paths } from 'src/routes/paths';
// utils
import axios from 'src/utils/axios';
import { parseISO, getUnixTime, format } from 'date-fns';

// locales
import { getDefaultLang } from 'src/locales';

// ----------------------------------------------------------------------

function jwtDecode(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );

  return JSON.parse(jsonPayload);
}

// ----------------------------------------------------------------------

export const isValidToken = (accessToken, token_expires_at) => {
  if (!accessToken) {
    return false;
  }

  const exp = getUnixTimestamp(token_expires_at);
  const currentTime = Date.now() / 1000;

  return exp > currentTime;
};

// ----------------------------------------------------------------------

export const tokenExpired = (exp) => {
  // eslint-disable-next-line prefer-const
  let expiredTimer;

  const currentTime = Date.now();

  const timeLeft = exp * 1000 - currentTime;

  clearTimeout(expiredTimer);

  expiredTimer = setTimeout(() => {
    console.info('Token expired');

    localStorage.removeItem('accessToken');

    window.location.href = paths.auth.login;
  }, timeLeft);
};

// ----------------------------------------------------------------------

export const setSession = (accessToken, token_expires_at) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('tokenExpiresAt', token_expires_at);

    const selectedLanguage = getDefaultLang();

    axios.defaults.headers.common['Accept-Language'] = (selectedLanguage && selectedLanguage.value && selectedLanguage.value !== '') ? selectedLanguage.value : '';
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    // const exp = getUnixTimestamp(token_expires_at);

    // tokenExpired(exp);
  } else {
    localStorage.removeItem('accessToken');

    delete axios.defaults.headers.common['Accept-Language'];
    delete axios.defaults.headers.common.Authorization;
  }
};


export const getUnixTimestamp = (token_expires_at) => {
  const parsedDatetime = parseISO(token_expires_at);
  return getUnixTime(parsedDatetime);
};

export const getDateFromTimestamp = (ts) => {
  const date = new Date(ts * 1000);
  return format(date, 'yyyy-MM-dd HH:mm:ss');
};
