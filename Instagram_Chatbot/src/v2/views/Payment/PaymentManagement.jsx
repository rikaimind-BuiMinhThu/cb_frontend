import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import moment from 'moment';
import api from 'v2/api/api-management';
import Cookies from 'js-cookie';
import { API_SUCCESS_CODE, BOT_ID_COOKIE_KEY, USER_ROLE_COOKIE_KEY } from 'v2/api/constants';
import { tokenExpired } from 'v2/api/tokenExpired';
import { AdminPage } from 'v2/components/AdminShell';
import { USER_ROLE_ADMIN_DEEL } from 'v2/components/AdminShell/constants';
import PaymentOrderHistoryTab from './PaymentOrderHistoryTab';
import PaymentSettingsTab from './PaymentSettingsTab';
import usePaymentSettings from './hooks/usePaymentSettings';
import {
  BOTS_BY_CLIENT_PATH,
  CLIENT_FILTER_DEEL,
  CLIENTS_WITH_NAME_PATH,
  DATE_RANGE_ERROR,
  EMPTY_VALUE,
  TAB_ORDERS,
  TAB_ORDERS_LABEL,
  TAB_SETTINGS,
  TAB_SETTINGS_LABEL,
} from './paymentConstants';
import 'v2/views/Payment/styles/payment-management.css';
import 'v2/assets/css/bot/report.css';

const PaymentManagement = () => {
  const [botId] = useState(Cookies.get(BOT_ID_COOKIE_KEY));
  const [startDate, setStartDate] = useState(() => moment().startOf('month'));
  const [endDate, setEndDate] = useState(() => moment().subtract(1, 'day'));
  const [tab, setTab] = useState(TAB_ORDERS);
  const [dateError, setDateError] = useState(EMPTY_VALUE);
  const [isAdminDeel] = useState(() => Cookies.get(USER_ROLE_COOKIE_KEY) === USER_ROLE_ADMIN_DEEL);
  const [allClient, setAllClient] = useState([]);
  const [allBot, setAllBot] = useState([]);
  const [currentClientId, setCurrentClientId] = useState(CLIENT_FILTER_DEEL);
  const settings = usePaymentSettings(botId);

  useEffect(() => {
    if (!isAdminDeel) return undefined;
    const request = { cancelled: false };
    api
      .get(CLIENTS_WITH_NAME_PATH)
      .then((res) => {
        if (request.cancelled) return;
        if (res.data?.code === API_SUCCESS_CODE) {
          setAllClient(res.data?.data);
        }
      })
      .catch((error) => {
        if (request.cancelled) return;
        if (error.response?.data?.code === 0) {
          tokenExpired();
        }
      });
    return () => {
      request.cancelled = true;
    };
  }, [isAdminDeel]);

  const validateDateRange = (start, end) => {
    if (start && end && start.isAfter(end)) {
      setDateError(DATE_RANGE_ERROR);
      return false;
    }
    setDateError(EMPTY_VALUE);
    return true;
  };

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      validateDateRange(start, end);
      return;
    }
    setDateError(EMPTY_VALUE);
  };

  const handleSearch = () => {
    validateDateRange(startDate, endDate);
  };

  const handleSelectClient = (value) => {
    setCurrentClientId(value);
    if (value === CLIENT_FILTER_DEEL) return;
    api
      .get(`${BOTS_BY_CLIENT_PATH}${value}`)
      .then((res) => {
        setAllBot(res?.data?.data);
      })
      .catch((err) => {
        if (err?.response?.data?.code === 0) {
          tokenExpired();
        }
      });
  };

  return (
    <AdminPage className="admin-page--payment-management">
      <Tabs
        activeKey={tab}
        onChange={setTab}
        className="admin-page-tabs"
        items={[
          {
            key: TAB_ORDERS,
            label: TAB_ORDERS_LABEL,
            children: (
              <PaymentOrderHistoryTab
                startDate={startDate}
                endDate={endDate}
                dateError={dateError}
                isAdminDeel={isAdminDeel}
                allClient={allClient}
                allBot={allBot}
                currentClientId={currentClientId}
                onDateChange={handleDateChange}
                onSearch={handleSearch}
                onSelectClient={handleSelectClient}
              />
            ),
          },
          {
            key: TAB_SETTINGS,
            label: TAB_SETTINGS_LABEL,
            children: <PaymentSettingsTab settings={settings} />,
          },
        ]}
      />
    </AdminPage>
  );
};

export default PaymentManagement;
