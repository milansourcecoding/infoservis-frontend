import PropTypes from 'prop-types';
import { useEffect, useCallback, useState, lazy } from 'react';
import { useLocation } from 'react-router-dom';

// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
//
import { useAuthContext } from '../hooks';
import { NAV_ITEMS_BY_ROLE } from '../../layouts/dashboard/config-navigation';

import { NotFoundView } from '../../sections/error';

// ----------------------------------------------------------------------

const loginPaths = {
  jwt: paths.auth.login,
};

// ----------------------------------------------------------------------

export default function AuthGuard({ children }) {
  const router = useRouter();
  const location = useLocation();

  const { authenticated, method, user } = useAuthContext();

  const [checked, setChecked] = useState(false);


  const userRoles = user?.roles;


  const check = useCallback(() => {
    if (!authenticated) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString();

      const loginPath = loginPaths[method];

      const href = `${loginPath}?${searchParams}`;

      router.replace(href);
    } else {
      const items = userRoles.flatMap((role) => NAV_ITEMS_BY_ROLE[role] || []);

      if (items?.some((role) => role?.path?.includes(location.pathname))) {
        setChecked(true);
      } else {
        setChecked(false);
      }
    }
  }, [authenticated, method, router]);

  useEffect(() => {
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked) {
    return <NotFoundView />
  }

  return <>{children}</>;
}

AuthGuard.propTypes = {
  children: PropTypes.node,
};
