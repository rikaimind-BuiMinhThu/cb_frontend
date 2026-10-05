import { useCallback, useEffect, useState } from 'react';
import { fetchUserAnalytics, formatDateToApi } from '../api/listUserApi';

const EMPTY_ANALYTICS = {
  chartCategories: [],
  userSeries: [],
  messageSeries: [],
  repeaterPercent: 0,
  newUserPercent: 0,
  periodMessageTotal: 0,
  messageChangePercent: 0,
  ecUserPercent: 0,
  ecNewUserPercent: 0,
};

export default function useUserAnalytics({ dateRange, isValid, isAdminDeel }) {
  const [data, setData] = useState(EMPTY_ANALYTICS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadAnalytics = useCallback(async () => {
    if (!isValid || !dateRange?.[0] || !dateRange?.[1]) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await fetchUserAnalytics({
        beginDate: formatDateToApi(dateRange[0]),
        endDate: formatDateToApi(dateRange[1]),
        isAdminDeel,
      });
      setData(result);
    } catch (err) {
      console.error(err);
      setError('分析データの取得に失敗しました');
      setData(EMPTY_ANALYTICS);
    } finally {
      setLoading(false);
    }
  }, [dateRange, isAdminDeel, isValid]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  return {
    ...data,
    loading,
    error,
    reload: loadAnalytics,
  };
}
