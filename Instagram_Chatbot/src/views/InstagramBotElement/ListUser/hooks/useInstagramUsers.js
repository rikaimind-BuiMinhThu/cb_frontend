import { useCallback, useEffect, useState } from 'react';
import { fetchInstagramUsers, normalizePage } from '../api/listUserApi';
import { PAGE_SIZE } from '../constants';

async function loadUsersPage({ appliedUsername, appliedClientName, nextPage }) {
  let result = await fetchInstagramUsers({
    page: nextPage,
    instagramUserName: appliedUsername,
    clientName: appliedClientName,
  });

  const normalizedPage = normalizePage(nextPage, result.total);
  if (normalizedPage !== nextPage) {
    result = await fetchInstagramUsers({
      page: normalizedPage,
      instagramUserName: appliedUsername,
      clientName: appliedClientName,
    });
    return { items: result.items, total: result.total, page: normalizedPage };
  }

  return { items: result.items, total: result.total, page: nextPage };
}

export default function useInstagramUsers({ isAdminDeel }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [usernameSearch, setUsernameSearch] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  const [appliedUsername, setAppliedUsername] = useState('');
  const [appliedClientName, setAppliedClientName] = useState('');
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
  }, [appliedClientName, appliedUsername]);

  const handleSearch = useCallback(() => {
    setAppliedUsername(usernameSearch.trim());
    setAppliedClientName(isAdminDeel ? clientSearch.trim() : '');
  }, [clientSearch, isAdminDeel, usernameSearch]);

  const handlePageChange = useCallback(
    async (nextPage) => {
      setLoading(true);
      setError('');

      try {
        const result = await loadUsersPage({
          appliedUsername,
          appliedClientName,
          nextPage,
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
    },
    [appliedClientName, appliedUsername]
  );

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
    appliedUsername,
    appliedClientName,
    handleSearch,
    handlePageChange,
  };
}
