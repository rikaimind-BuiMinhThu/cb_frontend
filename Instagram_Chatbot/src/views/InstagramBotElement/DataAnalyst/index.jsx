import React from 'react';
import { DatePicker as AntDatePicker, Space } from 'antd';
import locale from 'antd/es/date-picker/locale/ja_JP';
import { AdminPage } from '../../../components/AdminShell';
import OverviewSection from './components/OverviewSection';
import LiveDataSection from './components/LiveDataSection';
import MessageGroupsSection from './components/MessageGroupsSection';
import useDataAnalystRole from './hooks/useDataAnalystRole';
import useDateRange from './hooks/useDateRange';
import useOverviewAnalytics from './hooks/useOverviewAnalytics';
import useLiveData from './hooks/useLiveData';
import useMessageGroupsData from './hooks/useMessageGroupsData';
import './styles/data-analyst.css';

function DataAnalystPage() {
  const isAdminDeel = useDataAnalystRole();
  const { dateRange, dateRangeError, isValid, handleDateRangeChange } = useDateRange();

  const overview = useOverviewAnalytics({
    dateRange,
    isValid,
    isAdminDeel,
  });

  const liveData = useLiveData({
    dateRange,
    isValid,
    isAdminDeel,
  });

  const messageGroups = useMessageGroupsData({
    dateRange,
    isValid,
    isAdminDeel,
  });

  return (
    <AdminPage
      title="サマリー"
      card={false}
      className="data-analyst-page"
      toolbar={
        <Space direction="vertical" size={4} align="end">
          <AntDatePicker.RangePicker
            locale={locale}
            value={dateRange}
            onChange={handleDateRangeChange}
            format="YYYY/MM/DD"
            allowClear={false}
          />
          {dateRangeError && <div className="data-analyst-date-error">{dateRangeError}</div>}
        </Space>
      }
    >
      <OverviewSection {...overview} isAdminDeel={isAdminDeel} />
      <LiveDataSection {...liveData} isAdminDeel={isAdminDeel} />
      <MessageGroupsSection {...messageGroups} isAdminDeel={isAdminDeel} />
    </AdminPage>
  );
}

export default DataAnalystPage;
