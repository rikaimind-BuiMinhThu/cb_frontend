import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import api from 'api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { PAGE_SIZE } from '../constants';

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
      window.location.href = '/';
    }
    if (Cookies.get('is_auth') === 'false') {
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {
    api
      .get(`/api/v1/managements/clients`)
      .then((res) => {
        setListClient(res.data.data || []);
      })
      .catch((error) => {
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }, []);

  function fetchUsers(pageNum, name = namesearch) {
    setLoading(true);
    api
      .get(`/api/v1/managements/users?name=${name}&page=${pageNum}&client_id=`)
      .then((res) => {
        const totalCount = res.data.total || 0;
        const totalPage = Math.ceil(totalCount / PAGE_SIZE) || 1;
        if (pageNum > totalPage && totalCount > 0) {
          return api
            .get(`/api/v1/managements/users?name=${name}&page=${totalPage}&client_id=`)
            .then((resp) => {
              setUsers(resp.data.users || []);
              setTotal(resp.data.total || 0);
              setPage(totalPage);
            });
        }
        setUsers(res.data.users || []);
        setTotal(totalCount);
        setPage(pageNum);
      })
      .catch((error) => {
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchUsers(1, '');
  }, []);

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
