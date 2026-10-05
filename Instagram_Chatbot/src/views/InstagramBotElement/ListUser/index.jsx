import React, { useCallback, useState } from 'react';
import { Button, DatePicker as AntDatePicker, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import locale from 'antd/es/date-picker/locale/ja_JP';
import { AdminPage } from '../../../components/AdminShell';
import AnalyticsOverviewSection from './components/AnalyticsOverviewSection';
import UserStatsSection from './components/UserStatsSection';
import UserTableSection from './components/UserTableSection';
import { fetchAllInstagramUsersForExport } from './api/listUserApi';
import useDateRange from './hooks/useDateRange';
import useInstagramUsers from './hooks/useInstagramUsers';
import useListUserRole from './hooks/useListUserRole';
import useUserAnalytics from './hooks/useUserAnalytics';
import { downloadInstagramUserCsv } from './utils/csvBuilders';
import './styles/list-user.css';

function ListUserPage() {
  const isAdminDeel = useListUserRole();
  const { dateRange, dateRangeError, isValid, handleDateRangeChange } = useDateRange();
  const [exporting, setExporting] = useState(false);

  const analytics = useUserAnalytics({
    dateRange,
    isValid,
    isAdminDeel,
  });

  const users = useInstagramUsers({ isAdminDeel });

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      const allUsers = await fetchAllInstagramUsersForExport({
        instagramUserName: users.appliedUsername,
        clientName: users.appliedClientName,
      });
      downloadInstagramUserCsv(allUsers);
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  }, [users.appliedClientName, users.appliedUsername]);

  return (
    <AdminPage
      title="ユーザー一覧"
      card={false}
      className="list-user-page"
      toolbar={
        <div className="list-user-toolbar">
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            loading={exporting}
            onClick={handleExport}
          >
            インスタグラムユーザー出力
          </Button>
          <Space direction="vertical" size={4} align="end">
            <AntDatePicker.RangePicker
              locale={locale}
              value={dateRange}
              onChange={handleDateRangeChange}
              format="YYYY/MM/DD"
              allowClear={false}
            />
            {dateRangeError && <div className="list-user-date-error">{dateRangeError}</div>}
          </Space>
        </div>
      }
    >
      <UserStatsSection {...analytics} />
      <AnalyticsOverviewSection {...analytics} isAdminDeel={isAdminDeel} />
      <UserTableSection {...users} isAdminDeel={isAdminDeel} />
    </AdminPage>
  );
}

export default ListUserPage;
