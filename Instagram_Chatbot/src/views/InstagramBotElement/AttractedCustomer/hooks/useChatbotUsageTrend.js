import { useCallback, useEffect, useState } from 'react';
import { fetchChatbotUsageTrend, formatDateToApi } from '../api/attractedCustomerApi';

const EMPTY_TREND = {
  chartCategories: [],
  userSeries: [],
};

export default function useChatbotUsageTrend({ dateRange, isValid }) {
  const [data, setData] = useState(EMPTY_TREND);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadTrend = useCallback(async () => {
    if (!isValid || !dateRange?.[0] || !dateRange?.[1]) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await fetchChatbotUsageTrend({
        beginDate: formatDateToApi(dateRange[0]),
        endDate: formatDateToApi(dateRange[1]),
      });
      setData(result);
    } catch (err) {
      console.error(err);
      setError('利用状況データの取得に失敗しました');
      setData(EMPTY_TREND);
    } finally {
      setLoading(false);
    }
  }, [dateRange, isValid]);

  useEffect(() => {
    loadTrend();
  }, [loadTrend]);

  return {
    ...data,
    loading,
    error,
    reload: loadTrend,
  };
}
