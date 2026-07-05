import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import api from 'api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import {
  buildClientsUrl,
  getConversionPreviewDates,
  isValidConversionDateRange,
  PAGE_SIZE,
} from '../utils/clientManagementUtils';

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
      window.location.href = '/';
    }
    if (userRole === 'admin_client' || userRole === 'client') {
      window.location.href = '/v2/admin/dashboard';
    }
  }, []);

  useEffect(() => {
    if (
      Cookies.get('token') == undefined ||
      Cookies.get('token') == null ||
      Cookies.get('token') == ''
    ) {
      window.location.href = '/';
    }
    if (Cookies.get('is_auth') == 'false') {
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {
    api
      .get('/api/v1/managements/plans')
      .then((res) => setPlans(res.data.data))
      .catch((error) => {
        if (error.response?.data.code === 0) tokenExpired();
      });
  }, []);

  function fetchClients(pageNum, name = namesearch, range = conversionRange) {
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

    api
      .get(buildClientsUrl(pageNum, name, startPreview, endPreview))
      .then((res) => {
        const data = res?.data?.data || {};
        const totalCount = data.total || 0;
        const maxPage = Math.max(1, Math.ceil(totalCount / PAGE_SIZE) || 1);
        const targetPage = totalCount > 0 && pageNum > maxPage ? maxPage : pageNum;

        if (targetPage !== pageNum) {
          return api
            .get(buildClientsUrl(targetPage, name, startPreview, endPreview))
            .then((retryRes) => {
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
        console.log(error);
        if (error.response?.data.code === 0) tokenExpired();
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchClients(1);
  }, []);

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
