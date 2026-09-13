import { useCallback, useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import api from 'v2/api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import {
  AUTH_FALSE_VALUE,
  IS_AUTH_COOKIE_KEY,
  ROLE_ADMIN_CLIENT,
  ROLE_CLIENT,
  TOKEN_COOKIE_KEY,
  USER_ROLE_COOKIE_KEY,
} from 'v2/api/constants';
import { getAdminRoutePath, getSignInPath } from 'v2/variables/constants';
import { CLIENTS_API_PATH, DASHBOARD_PATH, PAGE_SIZE, USERS_API_PATH } from '../constants';

const useUserList = () => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [namesearch, setNamesearch] = useState('');
  const [listClient, setListClient] = useState([]);

  useEffect(() => {
    const cook = Cookies.get(USER_ROLE_COOKIE_KEY);
    if (cook === ROLE_ADMIN_CLIENT || cook === ROLE_CLIENT) {
      window.location.href = getAdminRoutePath(DASHBOARD_PATH);
    }
  }, []);

  useEffect(() => {
    const token = Cookies.get(TOKEN_COOKIE_KEY);
    if (token === undefined || token == null || token === '') {
      window.location.href = getSignInPath();
    }
    if (Cookies.get(IS_AUTH_COOKIE_KEY) === AUTH_FALSE_VALUE) {
      window.location.href = getSignInPath();
    }
  }, []);

  useEffect(() => {
    const cancellation = { aborted: false };
    api
      .get(CLIENTS_API_PATH)
      .then((res) => {
        if (!cancellation.aborted) setListClient(res.data.data || []);
      })
      .catch((error) => {
        if (cancellation.aborted) return;
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
    return () => {
      cancellation.aborted = true;
    };
  }, []);

  const fetchRequestId = useRef(0);

  const fetchUsers = useCallback((pageNum, name = namesearch) => {
    setLoading(true);
    const requestId = ++fetchRequestId.current;
    api
      .get(`${USERS_API_PATH}?name=${name}&page=${pageNum}&client_id=`)
      .then((res) => {
        if (requestId !== fetchRequestId.current) return undefined;
        const totalCount = res.data.total || 0;
        const totalPage = Math.ceil(totalCount / PAGE_SIZE) || 1;
        if (pageNum > totalPage && totalCount > 0) {
          return api
            .get(`${USERS_API_PATH}?name=${name}&page=${totalPage}&client_id=`)
            .then((resp) => {
              if (requestId !== fetchRequestId.current) return;
              setUsers(resp.data.users || []);
              setTotal(resp.data.total || 0);
              setPage(totalPage);
            });
        }
        setUsers(res.data.users || []);
        setTotal(totalCount);
        setPage(pageNum);
        return undefined;
      })
      .catch((error) => {
        if (requestId !== fetchRequestId.current) return;
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      })
      .finally(() => {
        if (requestId === fetchRequestId.current) setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps -- name is always passed at call sites; namesearch would retrigger mount fetch with ''
  }, []);

  useEffect(() => {
    fetchUsers(1, '');
  }, [fetchUsers]);

  const handleSearch = () => {
    fetchUsers(1, namesearch);
  };

  const handlePageChange = (nextPage) => {
    fetchUsers(nextPage, namesearch);
    window.scrollTo(0, 0);
  };

  const reloadList = (pageNum = page) => {
    fetchUsers(pageNum, namesearch);
  };

  return {
    users,
    total,
    page,
    loading,
    namesearch,
    setNamesearch,
    listClient,
    handleSearch,
    handlePageChange,
    reloadList,
  };
};

export default useUserList;
