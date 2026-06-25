import PropTypes from 'prop-types';
import { useEffect, useReducer, useCallback, useMemo } from 'react';
// utils
import axios from 'src/utils/axios';
//
import { AuthContext } from './auth-context';
import { isValidToken, setSession, STORAGE_USER, STORAGE_KEY, getUser } from '../../../utils/utils.tsx';

// ----------------------------------------------------------------------

const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'SET_USER') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

// const STORAGE_EXPIRES_AT = 'tokenExpiresAt';

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem(STORAGE_KEY);
      // const tokenExpiresAt = localStorage.getItem(STORAGE_EXPIRES_AT);

      if (accessToken) { // && isValidToken(accessToken, tokenExpiresAt)) {
        const token_expires_at = '';
        setSession(accessToken, token_expires_at);

        const savedUser = getUser();

        const response = await axios.get(`user/${savedUser?.id}`);
        const user = (response && response.data && response.data.data) ? response.data.data : null;

        setSession(accessToken, token_expires_at);
        localStorage.setItem(STORAGE_USER, JSON.stringify(user));

        dispatch({
          type: 'INITIAL',
          payload: {
            user: {
              ...user,
              accessToken,
            },
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
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

    const response = await axios.post('auth/login', data);
    const { token, user } = (response && response.data && response.data.data) ? response.data.data : null;

    const token_expires_at = '';
    setSession(token?.access_token, token_expires_at);
    localStorage.setItem(STORAGE_USER, JSON.stringify(user));

    dispatch({
      type: 'LOGIN',
      payload: {
        user: {
          ...user,
          token: token?.access_token,
        },
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(async (data) => {
   
    const response = await axios.post('auth/register', data);
    const { token, user } = (response && response.data && response.data.data) ? response.data.data : null;

    const token_expires_at = '';
    setSession(token?.access_token, token_expires_at);
    localStorage.setItem(STORAGE_USER, JSON.stringify(user));

    dispatch({
      type: 'REGISTER',
      payload: {
        user: {
          ...user,
          token: token?.access_token,
        },
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
    const token = localStorage.getItem('accessToken');

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

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      setUser,
      logout,
    }),
    [login, logout, register, setUser, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
