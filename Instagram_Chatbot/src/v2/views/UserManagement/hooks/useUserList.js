import { useCallback, useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import api from 'v2/api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { PAGE_SIZE } from '../constants';
import { getSignInPath } from 'v2/variables/constants';

export default function useUserList() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [namesearch, setNamesearch] = useState('');
  const [listClient, setListClient] = useState([]);

  useEffect(() => {
    const cook = Cookies.get('user_role');
    if (cook === 'admin_client' || cook === 'client') {
      window.location.href = '/v2/admin/dashboard';
    }
  }, []);

  useEffect(() => {
    if (
      Cookies.get('token') === undefined ||
      Cookies.get('token') == null ||
      Cookies.get('token') === ''
    ) {
      window.location.href = getSignInPath();
    }
    if (Cookies.get('is_auth') === 'false') {
      window.location.href = getSignInPath();
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    api
      .get(`/api/v1/managements/clients`)
      .then((res) => {
        if (!cancelled) setListClient(res.data.data || []);
      })
      .catch((error) => {
        if (cancelled) return;
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const fetchRequestId = useRef(0);

  const fetchUsers = useCallback((pageNum, name = namesearch) => {
    setLoading(true);
    const requestId = ++fetchRequestId.current;
    api
      .get(`/api/v1/managements/users?name=${name}&page=${pageNum}&client_id=`)
      .then((res) => {
        if (requestId !== fetchRequestId.current) return undefined;
        const totalCount = res.data.total || 0;
        const totalPage = Math.ceil(totalCount / PAGE_SIZE) || 1;
        if (pageNum > totalPage && totalCount > 0) {
          return api
            .get(`/api/v1/managements/users?name=${name}&page=${totalPage}&client_id=`)
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

  function handleSearch() {
    fetchUsers(1, namesearch);
  }

  function handlePageChange(nextPage) {
    fetchUsers(nextPage, namesearch);
    const panel = document.querySelector('.main-panel');
    if (panel) panel.scrollTop = 0;
  }

  function reloadList(pageNum = page) {
    fetchUsers(pageNum, namesearch);
  }

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
}
