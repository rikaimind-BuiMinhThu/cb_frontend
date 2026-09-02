import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardBody, Row, Col } from 'reactstrap';
import Cookies from 'js-cookie';
import ReactApexChart from 'react-apexcharts';
import api from 'v2/api/api-management';
import { tokenExpired } from 'v2/api/tokenExpired';
import {
  AUTH_FALSE_VALUE,
  IS_AUTH_COOKIE_KEY,
  TOKEN_COOKIE_KEY,
  USER_ROLE_COOKIE_KEY,
  ROLE_ADMIN_DEEL,
} from 'v2/api/constants';
import { USER_ROLE_ADMIN_DEEL } from 'v2/components/AdminShell/constants';
import { AdminPage } from 'v2/components/AdminShell';
import { getSignInPath } from 'v2/variables/constants';
import {
  DASHBOARD_CHART_USER_ADMIN_LABEL,
  DASHBOARD_CHART_USER_CLIENT_LABEL,
  DASHBOARD_CHART_MESSAGE_LABEL,
  DASHBOARD_OVERVIEW_TITLE,
  DASHBOARD_CHART_EMPTY,
  DASHBOARD_CLIENT_MANAGEMENT,
  DASHBOARD_USER_MANAGEMENT,
  DASHBOARD_KEYWORD_SETTING,
  DASHBOARD_CHATBOT,
  DASHBOARD_CLIENT_ROUTE,
  DASHBOARD_USER_ROUTE,
  DASHBOARD_KEYWORD_ROUTE,
  DASHBOARD_CHATBOT_ROUTE,
  DASHBOARD_ANALYTICS_USER_PATH,
  DASHBOARD_ANALYTICS_MESSAGE_PATH,
  DASHBOARD_ANALYTICS_USERS_PATH,
  DASHBOARD_CHART_HEIGHT,
  buildDateRange,
  buildHistoricalBeginDate,
  formatChartDateLabel,
  parseStoredClient,
} from './Dashboard/constants';

const hasChartActivity = (userData, messageData) => {
  const combined = [...(userData || []), ...(messageData || [])];
  if (combined.length === 0) {
    return false;
  }
  return combined.some((value) => Number(value) > 0);
};

const Dashboard = () => {
  const [dateLabels, setDateLabels] = useState([]);
  const [userCounts, setUserCounts] = useState([]);
  const [messageCounts, setMessageCounts] = useState([]);
  const [lineDataWithoutRole, setLineDataWithoutRole] = useState([]);
  const [isAdminDeel, setIsAdminDeel] = useState(false);
  const [hasLoadedChartData, setHasLoadedChartData] = useState(false);
  const client = parseStoredClient();

  useEffect(() => {
    const userRole = Cookies.get(USER_ROLE_COOKIE_KEY);
    setIsAdminDeel(userRole === USER_ROLE_ADMIN_DEEL || userRole === ROLE_ADMIN_DEEL);
  }, []);

  useEffect(() => {
    const token = Cookies.get(TOKEN_COOKIE_KEY);
    if (token === undefined || token === null || token === '') {
      window.location.href = getSignInPath();
    }
    if (Cookies.get(IS_AUTH_COOKIE_KEY) === AUTH_FALSE_VALUE) {
      window.location.href = getSignInPath();
    }
  }, []);

  useEffect(() => {
    const { beginDate, endDate, monthIndex } = buildDateRange();
    const querySuffix = `?begin_date=${beginDate}&end_date=${endDate}`;

    const handleAnalyticsError = (error) => {
      if (error.response?.data.code === 0) {
        tokenExpired();
      }
    };

    Promise.all([
      api
        .get(`${DASHBOARD_ANALYTICS_USER_PATH}${querySuffix}`)
        .then((res) => {
          const usageEntries = res.data.counts || [];
          setDateLabels(usageEntries.map((entry) => formatChartDateLabel(entry.log_date)));
          setUserCounts(usageEntries.map((entry) => entry.user_count));
        })
        .catch(handleAnalyticsError),
      api
        .get(`${DASHBOARD_ANALYTICS_MESSAGE_PATH}${querySuffix}`)
        .then((res) => {
          const messageEntries = res.data.counts || [];
          setMessageCounts(messageEntries.map((entry) => entry.message_count));
        })
        .catch(handleAnalyticsError),
      api
        .get(`${DASHBOARD_ANALYTICS_USERS_PATH}${querySuffix}`)
        .then((res) => {
          setLineDataWithoutRole(res.data?.user_counts?.map((user) => user.user_count) || []);
        })
        .catch(handleAnalyticsError),
    ]).finally(() => {
      setHasLoadedChartData(true);
    });

    api
      .get(`${DASHBOARD_ANALYTICS_USERS_PATH}?begin_date=${buildHistoricalBeginDate(beginDate, monthIndex)}&end_date=${endDate}`)
      .catch(handleAnalyticsError);
  }, []);

  const userSeriesLabel = isAdminDeel ? DASHBOARD_CHART_USER_ADMIN_LABEL : DASHBOARD_CHART_USER_CLIENT_LABEL;
  const userSeriesData = isAdminDeel ? userCounts : lineDataWithoutRole;
  const hasActivity = hasChartActivity(userSeriesData, messageCounts);
  const showChart = hasLoadedChartData && hasActivity;
  const showChartEmpty = hasLoadedChartData && !hasActivity;

  const chartConfig = useMemo(() => ({
    series: [
      {
        name: userSeriesLabel,
        type: 'area',
        data: userSeriesData,
      },
      {
        name: DASHBOARD_CHART_MESSAGE_LABEL,
        type: 'line',
        data: messageCounts,
      },
    ],
    options: {
      chart: {
        height: DASHBOARD_CHART_HEIGHT,
        type: 'line',
      },
      stroke: {
        curve: 'smooth',
      },
      fill: {
        type: ['solid', 'solid'],
        opacity: [0.35, 1],
      },
      xaxis: {
        categories: dateLabels,
      },
      markers: {
        size: 0,
      },
      yaxis: [
        {
          title: {
            text: userSeriesLabel,
          },
        },
        {
          opposite: true,
          title: {
            text: DASHBOARD_CHART_MESSAGE_LABEL,
          },
        },
      ],
      tooltip: {
        shared: true,
        intersect: false,
        enabled: true,
        y: {
          formatter: (value) => (typeof value !== 'undefined' ? `${value.toFixed(0)}` : value),
        },
      },
    },
  }), [dateLabels, messageCounts, userSeriesData, userSeriesLabel]);

  const renderShortcutTile = (href, iconName, iconColor, title) => (
    <a href={href} className="admin-dashboard-tile-link">
      <div className="admin-dashboard-tile">
        <div className={`admin-dashboard-tile-icon ${iconColor}`}>
          <i className={`nc-icon ${iconName}`} />
        </div>
        <span className="admin-dashboard-tile-label">{title}</span>
      </div>
    </a>
  );

  return (
    <AdminPage card={false}>
      <div className="content admin-dashboard">
        <Row className="admin-dashboard-tiles">
          {isAdminDeel ? (
            <>
              <Col lg="3" md="6" sm="6">
                {renderShortcutTile(DASHBOARD_CLIENT_ROUTE, 'nc-badge', 'text-warning', DASHBOARD_CLIENT_MANAGEMENT)}
              </Col>
              <Col lg="3" md="6" sm="6">
                {renderShortcutTile(DASHBOARD_USER_ROUTE, 'nc-circle-10', 'text-success', DASHBOARD_USER_MANAGEMENT)}
              </Col>
            </>
          ) : null}
          {client?.is_instagram ? (
            <>
              <Col lg="3" md="6" sm="6">
                {renderShortcutTile(DASHBOARD_KEYWORD_ROUTE, 'nc-key-25', 'text-danger', DASHBOARD_KEYWORD_SETTING)}
              </Col>
              <Col lg="3" md="6" sm="6">
                {renderShortcutTile(DASHBOARD_CHATBOT_ROUTE, 'nc-atom', 'text-primary', DASHBOARD_CHATBOT)}
              </Col>
            </>
          ) : null}
        </Row>
        {client?.is_instagram ? (
          <Row>
            <Col md="12">
              <Card className="admin-dashboard-overview">
                <CardBody>
                  <div className="admin-dashboard-overview-header">
                    <h3 className="admin-dashboard-overview-title">{DASHBOARD_OVERVIEW_TITLE}</h3>
                  </div>
                  {showChart ? (
                    <ReactApexChart
                      options={chartConfig.options}
                      series={chartConfig.series}
                      type="line"
                      height={DASHBOARD_CHART_HEIGHT}
                    />
                  ) : null}
                  {showChartEmpty ? (
                    <div className="admin-dashboard-chart-empty">
                      <p className="admin-dashboard-chart-empty-text">{DASHBOARD_CHART_EMPTY}</p>
                    </div>
                  ) : null}
                </CardBody>
              </Card>
            </Col>
          </Row>
        ) : null}
      </div>
    </AdminPage>
  );
};

export default Dashboard;
