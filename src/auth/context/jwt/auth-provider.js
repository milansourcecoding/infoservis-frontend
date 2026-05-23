import PropTypes from 'prop-types';
import { useEffect, useReducer, useCallback, useMemo } from 'react';
// utils
import axios, { endpoints } from 'src/utils/axios';
//
import { AuthContext } from './auth-context';
import { isValidToken, setSession } from './utils';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  user: null,
  firma: null,
  loading: true,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
      firma: action.payload.firma,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
      firma: action.payload.firma,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: action.payload.user,
      firma: action.payload.firma,
    };
  }
  if (action.type === 'SET_USER') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'SET_FIRMA') {
    return {
      ...state,
      firma: action.payload.firma,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
      firma: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';
const STORAGE_USER = 'accessUser';
const STORAGE_FIRMA = 'accessFirma';
const STORAGE_EXPIRES_AT = 'tokenExpiresAt';

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);
      const tokenExpiresAt = sessionStorage.getItem(STORAGE_EXPIRES_AT);

      if (accessToken && isValidToken(accessToken, tokenExpiresAt)) {
        setSession(accessToken, tokenExpiresAt);


        const response = await axios.get(endpoints.auth.user);
        const { token_expires_at, user, firma } = (response && response.data && response.data.data) ? response.data.data : null;

        setSession(accessToken, token_expires_at);

        dispatch({
          type: 'INITIAL',
          payload: {
            user: {
              ...user,
              accessToken,
            },
            firma,
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
            firma: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
          firma: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email, password) => {
    const data = {
      email,
      password,
    };

    const response = await axios.post(endpoints.auth.login, data);
    const { token, token_expires_at, user, firma } = (response && response.data && response.data.data) ? response.data.data : null;

    setSession(token, token_expires_at);
    sessionStorage.setItem(STORAGE_USER, user);
    sessionStorage.setItem(STORAGE_FIRMA, firma);

    dispatch({
      type: 'LOGIN',
      payload: {
        user: {
          ...user,
          token,
        },
        firma,
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
    const data = {
      email,
      password,
      firstName,
      lastName,
    };

    const response = await axios.post(endpoints.auth.register, data);
    const { token, token_expires_at, user, firma } = (response && response.data && response.data.data) ? response.data.data : null;

    sessionStorage.setItem(STORAGE_KEY, token);
    sessionStorage.setItem(STORAGE_EXPIRES_AT, token_expires_at);
    sessionStorage.setItem(STORAGE_USER, user);
    sessionStorage.setItem(STORAGE_FIRMA, firma);

    dispatch({
      type: 'REGISTER',
      payload: {
        user: {
          ...user,
          token,
        },
        firma,
      },
    });
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null, null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);


  // SET USER
  const setUser = useCallback(async (user) => {
    const token = sessionStorage.getItem('accessToken');

    dispatch({
      type: 'SET_USER',
      payload: {
        user: {
          ...user,
          token,
        },
      },
    });
  }, []);

  // SET FIRMA
  const setFirma = useCallback(async (firma) => {
    dispatch({
      type: 'SET_FIRMA',
      payload: {
        firma,
      },
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      firma: state.firma,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      setUser,
      setFirma,
      logout,
    }),
    [login, logout, register, setUser, setFirma, state.user, state.firma, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
