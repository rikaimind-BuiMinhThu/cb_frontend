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
import {
  buildClientsUrl,
  getConversionPreviewDates,
  isValidConversionDateRange,
  PAGE_SIZE,
} from 'v2/views/ClientManagement/utils/clientManagementUtils';
import {
  DATE_SLICE_LENGTH,
  END_DATE_AFTER_START,
  END_DATE_REQUIRED,
  PLANS_API_PATH,
  START_DATE_REQUIRED,
} from '../constants';

const useClientList = () => {
  const [clients, setClients] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [conversionRange, setConversionRange] = useState(null);
  const [dateRangeError, setDateRangeError] = useState('');
  const [namesearch, setNamesearch] = useState('');
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const userRole = Cookies.get(USER_ROLE_COOKIE_KEY);
    if (!userRole) {
      window.location.href = getSignInPath();
    }
    if (userRole === ROLE_ADMIN_CLIENT || userRole === ROLE_CLIENT) {
      window.location.href = getAdminRoutePath('/dashboard');
    }
  }, []);

  useEffect(() => {
    const token = Cookies.get(TOKEN_COOKIE_KEY);
    if (token === undefined || token === null || token === '') {
      window.location.href = getSignInPath();
    }
    if (Cookies.get(IS_AUTH_COOKIE_KEY) === AUTH_FALSE_VALUE) {
      window.location.href = getSignInPath();
    }
  }, []);

  useEffect(() => {
    const cancellation = { aborted: false };
    api
      .get(PLANS_API_PATH)
      .then((res) => {
        if (!cancellation.aborted) setPlans(res.data.data);
      })
      .catch((error) => {
        if (cancellation.aborted) return;
        if (error.response?.data.code === 0) tokenExpired();
      });
    return () => {
      cancellation.aborted = true;
    };
  }, []);

  const fetchRequestId = useRef(0);

  const fetchClients = useCallback((pageNum, name = namesearch, range = conversionRange) => {
    const { startPreview, endPreview } = getConversionPreviewDates(range);

    if (range?.[0] && !range?.[1]) {
      setDateRangeError(END_DATE_REQUIRED);
      return;
    }
    if (!range?.[0] && range?.[1]) {
      setDateRangeError(START_DATE_REQUIRED);
      return;
    }
    if (startPreview && endPreview) {
      const startD = startPreview.toISOString().slice(0, DATE_SLICE_LENGTH);
      const endD = endPreview.toISOString().slice(0, DATE_SLICE_LENGTH);
      if (!isValidConversionDateRange(startD, endD)) {
        setDateRangeError(END_DATE_AFTER_START);
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
        if (error.response?.data.code === 0) tokenExpired();
      })
      .finally(() => {
        if (requestId === fetchRequestId.current) setLoading(false);
      });
  }, [namesearch, conversionRange]);

  useEffect(() => {
    fetchClients(1);
  }, [fetchClients]);

  const handleSearch = () => {
    setPage(1);
    fetchClients(1, namesearch);
  };

  const handlePageChange = (nextPage) => {
    fetchClients(nextPage, namesearch);
    window.scrollTo(0, 0);
  };

  const handleConversionDateChange = (dates) => {
    setConversionRange(dates);
    if (!dates?.[0] || !dates?.[1]) {
      setDateRangeError('');
      fetchClients(1, namesearch, null);
      return;
    }

    const { startPreview, endPreview } = getConversionPreviewDates(dates);
    const startD = startPreview.toISOString().slice(0, DATE_SLICE_LENGTH);
    const endD = endPreview.toISOString().slice(0, DATE_SLICE_LENGTH);
    if (!isValidConversionDateRange(startD, endD)) {
      setDateRangeError(END_DATE_AFTER_START);
      return;
    }

    setDateRangeError('');
    setPage(1);
    fetchClients(1, namesearch, dates);
  };

  const reloadListClient = (pgIndex = page) => {
    fetchClients(pgIndex, namesearch);
  };

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
};

export default useClientList;
