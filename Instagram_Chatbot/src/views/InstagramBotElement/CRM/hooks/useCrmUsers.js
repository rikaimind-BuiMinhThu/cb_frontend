import { useCallback, useEffect, useState } from 'react';
import { fetchCrmUsers, normalizePage } from '../api/crmApi';
import { PAGE_SIZE } from '../constants';

async function loadUsersPage({
  appliedUsername,
  appliedClientName,
  supportingUsers,
  nextPage,
}) {
  let result = await fetchCrmUsers({
    page: nextPage,
    instagramUserName: appliedUsername,
    clientName: appliedClientName,
    supportingUsers,
  });

  const normalizedPage = normalizePage(nextPage, result.total);
  if (normalizedPage !== nextPage) {
    result = await fetchCrmUsers({
      page: normalizedPage,
      instagramUserName: appliedUsername,
      clientName: appliedClientName,
      supportingUsers,
    });
    return { items: result.items, total: result.total, page: normalizedPage };
  }

  return { items: result.items, total: result.total, page: nextPage };
}

export default function useCrmUsers({ isAdminDeel }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [usernameSearch, setUsernameSearch] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  const [supportingUsers, setSupportingUsers] = useState(false);
  const [appliedUsername, setAppliedUsername] = useState('');
  const [appliedClientName, setAppliedClientName] = useState('');
  const [appliedSupportingUsers, setAppliedSupportingUsers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadFirstPage() {
      setLoading(true);
      setError('');

      try {
        const result = await loadUsersPage({
          appliedUsername,
          appliedClientName,
          supportingUsers: appliedSupportingUsers,
          nextPage: 1,
        });

        if (!cancelled) {
          setItems(result.items);
          setTotal(result.total);
          setPage(result.page);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError('ユーザーデータの取得に失敗しました');
          setItems([]);
          setTotal(0);
          setPage(1);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadFirstPage();

    return () => {
      cancelled = true;
    };
  }, [appliedClientName, appliedSupportingUsers, appliedUsername]);

  const handleSearch = useCallback(() => {
    setAppliedUsername(usernameSearch.trim());
    setAppliedClientName(isAdminDeel ? clientSearch.trim() : '');
    setAppliedSupportingUsers(supportingUsers);
  }, [clientSearch, isAdminDeel, supportingUsers, usernameSearch]);

  const handlePageChange = useCallback(
    async (nextPage) => {
      setLoading(true);
      setError('');

      try {
        const result = await loadUsersPage({
          appliedUsername,
          appliedClientName,
          supportingUsers: appliedSupportingUsers,
          nextPage,
        });
        setItems(result.items);
        setTotal(result.total);
        setPage(result.page);
        document.querySelector('.main-panel')?.scrollTo({ top: 0 });
      } catch (err) {
        console.error(err);
        setError('ユーザーデータの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    },
    [appliedClientName, appliedSupportingUsers, appliedUsername]
  );

  const refreshList = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const result = await loadUsersPage({
        appliedUsername,
        appliedClientName,
        supportingUsers: appliedSupportingUsers,
        nextPage: page,
      });
      setItems(result.items);
      setTotal(result.total);
      setPage(result.page);
    } catch (err) {
      console.error(err);
      setError('ユーザーデータの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, [appliedClientName, appliedSupportingUsers, appliedUsername, page]);

  return {
    items,
    total,
    page,
    pageSize: PAGE_SIZE,
    loading,
    error,
    usernameSearch,
    setUsernameSearch,
    clientSearch,
    setClientSearch,
    supportingUsers,
    setSupportingUsers,
    handleSearch,
    handlePageChange,
    refreshList,
  };
}
