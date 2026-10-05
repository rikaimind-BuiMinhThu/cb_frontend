import api from '../../../../api/api-management';
import { tokenExpired } from '../../../../api/tokenExpired';
import { EMPTY_CONVERSION_METRICS } from '../constants';
import { formatDateToApi, formatChartDate } from '../../DataAnalyst/utils/dateRange';

function buildQuery(params) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, value);
    }
  });
  return search.toString();
}

function handleApiError(error) {
  if (error.response?.data?.code === 0) {
    tokenExpired();
  }
  throw error;
}

export async function fetchConversionMetrics({ beginDate, endDate }) {
  const query = buildQuery({
    begin_date: beginDate,
    end_date: endDate,
  });

  try {
    const response = await api.get(`/api/v1/instagram_users/conversions?${query}`);
    return response.data?.data || EMPTY_CONVERSION_METRICS;
  } catch (error) {
    handleApiError(error);
    return EMPTY_CONVERSION_METRICS;
  }
}

export async function fetchChatbotUsageTrend({ beginDate, endDate }) {
  const query = buildQuery({
    begin_date: beginDate,
    end_date: endDate,
  });

  try {
    const response = await api.get(`/api/v1/analytics/chatbot_usages/user?${query}`);
    const counts = response.data?.counts || [];

    return {
      chartCategories: counts.map((item) => formatChartDate(item.log_date)),
      userSeries: counts.map((item) => item.user_count),
    };
  } catch (error) {
    handleApiError(error);
    return {
      chartCategories: [],
      userSeries: [],
    };
  }
}

export { formatDateToApi };
