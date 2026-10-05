import { useCallback, useEffect, useState } from 'react';
import { fetchOverviewAnalytics } from '../api/dataAnalystApi';
import { formatDateToApi } from '../utils/dateRange';

const EMPTY_OVERVIEW = {
  chartCategories: [],
  userSeries: [],
  messageSeries: [],
  repeaterPercent: 0,
  newUserPercent: 0,
};

export default function useOverviewAnalytics({ dateRange, isValid, isAdminDeel }) {
  const [data, setData] = useState(EMPTY_OVERVIEW);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadOverview = useCallback(async () => {
    if (!isValid || !dateRange?.[0] || !dateRange?.[1]) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await fetchOverviewAnalytics({
        beginDate: formatDateToApi(dateRange[0]),
        endDate: formatDateToApi(dateRange[1]),
        isAdminDeel,
      });
      setData(result);
    } catch (err) {
      console.error(err);
      setError('概要データの取得に失敗しました');
      setData(EMPTY_OVERVIEW);
    } finally {
      setLoading(false);
    }
  }, [dateRange, isAdminDeel, isValid]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  return {
    ...data,
    loading,
    error,
    reload: loadOverview,
  };
}
