import { useCallback, useMemo, useState } from 'react';
import { getDefaultDateRange, isValidDateRange } from '../utils/dateRange';

export default function useDateRange() {
  const [dateRange, setDateRange] = useState(getDefaultDateRange);

  const dateRangeError = useMemo(() => {
    if (isValidDateRange(dateRange?.[0], dateRange?.[1])) {
      return '';
    }
    return '終了日を開始日の前に設定することはできません';
  }, [dateRange]);

  const isValid = dateRangeError === '';

  const handleDateRangeChange = useCallback((nextRange) => {
    setDateRange(nextRange);
  }, []);

  return {
    dateRange,
    dateRangeError,
    isValid,
    handleDateRangeChange,
  };
}
