import { useCallback, useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import api from 'v2/api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import { getSignInPath } from 'v2/variables/constants';
import {
  buildClientsUrl,
  getConversionPreviewDates,
  isValidConversionDateRange,
  PAGE_SIZE,
} from 'v2/views/ClientManagement/utils/clientManagementUtils';

export default function useClientList() {
  const [clients, setClients] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [conversionRange, setConversionRange] = useState(null);
  const [dateRangeError, setDateRangeError] = useState('');
  const [namesearch, setNamesearch] = useState('');
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const userRole = Cookies.get('user_role');
    if (!userRole) {
      window.location.href = getSignInPath();
    }
    if (userRole === 'admin_client' || userRole === 'client') {
      window.location.href = '/v2/admin/dashboard';
    }
  }, []);

  useEffect(() => {
    if (
      Cookies.get('token') === undefined ||
      Cookies.get('token') === null ||
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
      .get('/api/v1/managements/plans')
      .then((res) => {
        if (!cancelled) setPlans(res.data.data);
      })
      .catch((error) => {
        if (cancelled) return;
        if (error.response?.data.code === 0) tokenExpired();
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const fetchRequestId = useRef(0);

  const fetchClients = useCallback((pageNum, name = namesearch, range = conversionRange) => {
    const { startPreview, endPreview } = getConversionPreviewDates(range);

    if (range?.[0] && !range?.[1]) {
      setDateRangeError('終了日を指定してください');
      return;
    }
    if (!range?.[0] && range?.[1]) {
      setDateRangeError('開始日を指定してください');
      return;
    }
    if (startPreview && endPreview) {
      const startD = startPreview.toISOString().slice(0, 10);
      const endD = endPreview.toISOString().slice(0, 10);
      if (!isValidConversionDateRange(startD, endD)) {
        setDateRangeError('終了日は開始日以降を指定してください');
        return;
      }
    }
    setDateRangeError('');
    setLoading(true);
    const requestId = ++fetchRequestId.current;

    api
      .get(buildClientsUrl(pageNum, name, startPreview, endPreview))
      .then((res) => {
        if (requestId !== fetchRequestId.current) return undefined;
        const data = res?.data?.data || {};
        const totalCount = data.total || 0;
        const maxPage = Math.max(1, Math.ceil(totalCount / PAGE_SIZE) || 1);
        const targetPage = totalCount > 0 && pageNum > maxPage ? maxPage : pageNum;

        if (targetPage !== pageNum) {
          return api
            .get(buildClientsUrl(targetPage, name, startPreview, endPreview))
            .then((retryRes) => {
              if (requestId !== fetchRequestId.current) return;
              const retryData = retryRes?.data?.data || {};
              setClients(retryData.clients || []);
              setTotal(retryData.total || 0);
              setPage(targetPage);
            });
        }

        setClients(data.clients || []);
        setTotal(totalCount);
        setPage(pageNum);
        return undefined;
      })
      .catch((error) => {
        if (requestId !== fetchRequestId.current) return;
        console.log(error);
        if (error.response?.data.code === 0) tokenExpired();
      })
      .finally(() => {
        if (requestId === fetchRequestId.current) setLoading(false);
      });
  }, [namesearch, conversionRange]);

  useEffect(() => {
    fetchClients(1);
  }, [fetchClients]);

  function handleSearch() {
    setPage(1);
    fetchClients(1, namesearch);
  }

  function handlePageChange(nextPage) {
    fetchClients(nextPage, namesearch);
    window.scrollTo(0, 0);
  }

  function handleConversionDateChange(dates) {
    setConversionRange(dates);
    if (!dates?.[0] || !dates?.[1]) {
      setDateRangeError('');
      fetchClients(1, namesearch, null);
      return;
    }

    const { startPreview, endPreview } = getConversionPreviewDates(dates);
    const startD = startPreview.toISOString().slice(0, 10);
    const endD = endPreview.toISOString().slice(0, 10);
    if (!isValidConversionDateRange(startD, endD)) {
      setDateRangeError('終了日は開始日以降を指定してください');
      return;
    }

    setDateRangeError('');
    setPage(1);
    fetchClients(1, namesearch, dates);
  }

  function reloadListClient(pgIndex = page) {
    fetchClients(pgIndex, namesearch);
  }

  return {
    clients,
    total,
    page,
    loading,
    conversionRange,
    dateRangeError,
    namesearch,
    setNamesearch,
    plans,
    handleSearch,
    handlePageChange,
    handleConversionDateChange,
    reloadListClient,
  };
}
