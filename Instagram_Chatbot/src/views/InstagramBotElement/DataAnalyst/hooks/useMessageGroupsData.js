import { useCallback, useEffect, useState } from 'react';
import { fetchMessageGroupExport, fetchMessageGroups, normalizePage } from '../api/dataAnalystApi';
import { PAGE_SIZE } from '../constants';
import { formatDateToApi } from '../utils/dateRange';
import {
  downloadMessageGroupChatCsv,
  downloadMessageGroupUserCsv,
} from '../utils/csvBuilders';

async function loadMessageGroupsPage({ dateRange, isValid, isAdminDeel, appliedSearch, nextPage }) {
  if (!isValid || !dateRange?.[0] || !dateRange?.[1]) {
    return { items: [], total: 0, page: 1 };
  }

  const beginDate = formatDateToApi(dateRange[0]);
  const endDate = formatDateToApi(dateRange[1]);
  const clientName = isAdminDeel ? appliedSearch : undefined;

  let result = await fetchMessageGroups({
    beginDate,
    endDate,
    page: nextPage,
    clientName,
  });

  const normalizedPage = normalizePage(nextPage, result.total);
  if (normalizedPage !== nextPage) {
    result = await fetchMessageGroups({
      beginDate,
      endDate,
      page: normalizedPage,
      clientName,
    });
    return { items: result.items, total: result.total, page: normalizedPage };
  }

  return { items: result.items, total: result.total, page: nextPage };
}

export default function useMessageGroupsData({ dateRange, isValid, isAdminDeel }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exportingKey, setExportingKey] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadFirstPage() {
      setLoading(true);
      setError('');

      try {
        const result = await loadMessageGroupsPage({
          dateRange,
          isValid,
          isAdminDeel,
          appliedSearch,
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
          setError('メッセージグループの取得に失敗しました');
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
  }, [appliedSearch, dateRange, isAdminDeel, isValid]);

  const handleSearch = useCallback(() => {
    setAppliedSearch(searchValue.trim());
  }, [searchValue]);

  const handlePageChange = useCallback(
    async (nextPage) => {
      setLoading(true);
      setError('');

      try {
        const result = await loadMessageGroupsPage({
          dateRange,
          isValid,
          isAdminDeel,
          appliedSearch,
          nextPage,
        });
        setItems(result.items);
        setTotal(result.total);
        setPage(result.page);
      } catch (err) {
        console.error(err);
        setError('メッセージグループの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    },
    [appliedSearch, dateRange, isAdminDeel, isValid]
  );

  const handleExport = useCallback(async (groupId, exportType) => {
    const exportKey = `${groupId}-${exportType}`;
    setExportingKey(exportKey);

    try {
      const instagramUsers = await fetchMessageGroupExport(groupId);
      if (exportType === 'chat') {
        downloadMessageGroupChatCsv(instagramUsers);
      } else {
        downloadMessageGroupUserCsv(instagramUsers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setExportingKey(null);
    }
  }, []);

  return {
    items,
    total,
    page,
    pageSize: PAGE_SIZE,
    loading,
    error,
    searchValue,
    setSearchValue,
    handleSearch,
    handlePageChange,
    handleExport,
    exportingKey,
  };
}
