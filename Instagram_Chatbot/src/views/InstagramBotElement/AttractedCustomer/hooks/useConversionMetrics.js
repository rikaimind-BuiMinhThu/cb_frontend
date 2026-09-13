import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchConversionMetrics, formatDateToApi } from '../api/attractedCustomerApi';
import { EMPTY_CONVERSION_METRICS } from '../constants';
import { buildConversionTableRows, buildInflowPieSeries } from '../utils/channelMetrics';

export default function useConversionMetrics({ dateRange, isValid }) {
  const [metrics, setMetrics] = useState(EMPTY_CONVERSION_METRICS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadMetrics = useCallback(async () => {
    if (!isValid || !dateRange?.[0] || !dateRange?.[1]) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await fetchConversionMetrics({
        beginDate: formatDateToApi(dateRange[0]),
        endDate: formatDateToApi(dateRange[1]),
      });
      setMetrics(result);
    } catch (err) {
      console.error(err);
      setError('コンバージョンデータの取得に失敗しました');
      setMetrics(EMPTY_CONVERSION_METRICS);
    } finally {
      setLoading(false);
    }
  }, [dateRange, isValid]);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  const pieSeries = useMemo(() => buildInflowPieSeries(metrics), [metrics]);
  const tableRows = useMemo(() => buildConversionTableRows(metrics), [metrics]);

  return {
    metrics,
    pieSeries,
    tableRows,
    loading,
    error,
    reload: loadMetrics,
  };
}
