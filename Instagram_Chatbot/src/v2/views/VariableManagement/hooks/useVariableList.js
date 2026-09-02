import { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import api from 'v2/api/api-management';
import { notifyApiError, variablesApiPath } from '../variableUtils';

const useVariableList = () => {
  const botId = Cookies.get('bot_id');

  const [variables, setVariables] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [appliedKeyword, setAppliedKeyword] = useState('');
  const [reloadTick, setReloadTick] = useState(0);
  const [loading, setLoading] = useState(false);

  const reload = useCallback(() => {
    setReloadTick((tick) => tick + 1);
  }, []);

  const goToFirstPage = useCallback(() => {
    setPage(1);
  }, []);

  useEffect(() => {
    if (!botId) return undefined;

    let cancelled = false;

    const fetchVariables = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(variablesApiPath(botId), {
          params: { page, name: appliedKeyword },
        });
        if (cancelled) return;
        setVariables(data.data || []);
        setTotal(data.total || 0);
      } catch (error) {
        if (cancelled) return;
        notifyApiError(error, '変数の取得に失敗しました。');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchVariables();

    return () => {
      cancelled = true;
    };
  }, [appliedKeyword, botId, page, reloadTick]);

  const handleSearch = useCallback(() => {
    setPage(1);
    setAppliedKeyword(keyword);
  }, [keyword]);

  const handlePageChange = useCallback((nextPage) => {
    setPage(nextPage);
    window.scrollTo(0, 0);
  }, []);

  const updateField = useCallback((id, field, value) => {
    setVariables((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  }, []);

  return {
    botId,
    variables,
    total,
    page,
    keyword,
    setKeyword,
    loading,
    handleSearch,
    handlePageChange,
    updateField,
    reload,
    goToFirstPage,
  };
};

export default useVariableList;
