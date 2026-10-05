import React from 'react';
import { DatePicker as AntDatePicker, Space } from 'antd';
import locale from 'antd/es/date-picker/locale/ja_JP';
import { AdminPage } from '../../../components/AdminShell';
import ChartsSection from './components/ChartsSection';
import ConversionTableSection from './components/ConversionTableSection';
import useDateRange from './hooks/useDateRange';
import useConversionMetrics from './hooks/useConversionMetrics';
import useChatbotUsageTrend from './hooks/useChatbotUsageTrend';
import './styles/attracted-customer.css';

function AttractedCustomerPage() {
  const { dateRange, dateRangeError, isValid, handleDateRangeChange } = useDateRange();

  const conversionMetrics = useConversionMetrics({
    dateRange,
    isValid,
  });

  const usageTrend = useChatbotUsageTrend({
    dateRange,
    isValid,
  });

  return (
    <AdminPage
      title="集客"
      card={false}
      className="attracted-customer-page"
      toolbar={
        <Space direction="vertical" size={4} align="end">
          <AntDatePicker.RangePicker
            locale={locale}
            value={dateRange}
            onChange={handleDateRangeChange}
            format="YYYY/MM/DD"
            allowClear={false}
          />
          {dateRangeError && <div className="attracted-customer-date-error">{dateRangeError}</div>}
        </Space>
      }
    >
      <ChartsSection
        conversionLoading={conversionMetrics.loading}
        conversionError={conversionMetrics.error}
        pieSeries={conversionMetrics.pieSeries}
        trendLoading={usageTrend.loading}
        trendError={usageTrend.error}
        chartCategories={usageTrend.chartCategories}
        userSeries={usageTrend.userSeries}
      />
      <ConversionTableSection
        loading={conversionMetrics.loading}
        error={conversionMetrics.error}
        tableRows={conversionMetrics.tableRows}
      />
    </AdminPage>
  );
}

export default AttractedCustomerPage;
