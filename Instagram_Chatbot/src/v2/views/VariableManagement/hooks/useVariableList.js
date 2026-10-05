import { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import api from 'v2/api/api-management';
import { BOT_ID_COOKIE_KEY } from 'v2/api/constants';
import { notifyApiError, variablesApiPath } from '../variableUtils';
import { FETCH_ERROR } from '../constants';

const useVariableList = () => {
  const botId = Cookies.get(BOT_ID_COOKIE_KEY);

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

    const request = { cancelled: false };

    const fetchVariables = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(variablesApiPath(botId), {
          params: { page, name: appliedKeyword },
        });
        if (request.cancelled) return;
        setVariables(data.data || []);
        setTotal(data.total || 0);
      } catch (error) {
        if (request.cancelled) return;
        notifyApiError(error, FETCH_ERROR);
      } finally {
        if (!request.cancelled) setLoading(false);
      }
    };

    fetchVariables();

    return () => {
      request.cancelled = true;
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
