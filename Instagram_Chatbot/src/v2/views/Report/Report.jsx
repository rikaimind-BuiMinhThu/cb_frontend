import React, { useEffect, useMemo, useState } from 'react';
import {
  DatePicker,
  Empty,
  Select,
  Space,
  Spin,
  Tabs,
  Typography,
} from 'antd';
import moment from 'moment';
import ReactApexChart from 'react-apexcharts';
import api from 'v2/api/api-management';
import Cookies from 'js-cookie';
import { tokenExpired } from 'v2/api/tokenExpired';
import { AdminPage, AdminTable, AdminActionButton, AdminInfoTooltip, useAdminHeaderActions } from 'v2/components/AdminShell';
import { adminChartPalette } from 'v2/theme/adminTheme';
import 'v2/assets/css/bot/report.css';
import {
  AGGREGATION_CUSTOM,
  AGGREGATION_MONTH,
  AGGREGATION_OPTIONS,
  AGGREGATION_WEEK,
  AGGREGATION_YESTERDAY,
  ALIGN_CENTER,
  API_EXPIRED_CODE,
  API_SUCCESS_CODE,
  BOT_ID_COOKIE_KEY,
  CHART_RENDER_HEIGHT,
  CHART_TYPE_BAR,
  CHART_TYPE_PIE,
  CLIENT_ID_DEEL,
  COL_CLICK_COUNT,
  COL_CV_COUNT,
  COL_INDEX,
  COL_ORIGIN_URL,
  COL_SHORT_URL,
  COL_START_COUNT,
  COL_URL,
  COL_WIDTH_CLICK,
  COL_WIDTH_CV,
  COL_WIDTH_INDEX,
  COL_WIDTH_SHORT_URL,
  COL_WIDTH_START,
  DATE_DASH,
  DATE_FORMAT,
  DATE_RANGE_ERROR,
  DATE_REQUIRED_ERROR,
  DATE_SLASH,
  DAYS_MONTH,
  DAYS_WEEK,
  DAYS_YESTERDAY,
  DEVICE_ALL,
  DEVICE_COMPUTER,
  DEVICE_OPTIONS,
  DEVICE_SMARTPHONE,
  DEVICE_TABLET,
  EMPTY_CELL,
  EMPTY_DEVICE,
  EMPTY_TABLE,
  EMPTY_VALUE,
  GET_CLIENT_WITH_NAME_PATH,
  LABEL_CLIENT,
  LABEL_CLIENT_DEEL,
  LABEL_DEVICE,
  LABEL_PC,
  LABEL_PERIOD,
  LABEL_SCENARIO,
  LABEL_SMARTPHONE,
  LABEL_TABLET,
  MOMENT_UNIT_DAY,
  MOMENT_UNIT_MONTH,
  PAGE_SIZE,
  PENDING_REQUEST_COUNT,
  ROLE_ADMIN_DEEL,
  SCREEN_ALL_ID,
  SECTION_CONTENT,
  SECTION_CVR_CTR,
  SECTION_DEVICE,
  SECTION_LEAVE,
  SECTION_SHORTENED,
  STAT_MODIFIER_PC,
  STAT_MODIFIER_SP,
  STAT_MODIFIER_TABLET,
  TAB_CTR,
  TAB_CV,
  TAB_CVR,
  TAB_LABEL_CTR,
  TAB_LABEL_CV,
  TAB_LABEL_CVR,
  TAB_LABEL_START,
  TAB_START,
  TOOLTIP_CONTENT,
  TOOLTIP_CVR_CTR,
  TOOLTIP_DEVICE,
  TOOLTIP_LEAVE,
  TOOLTIP_SHORTENED,
  USER_ROLE_COOKIE_KEY,
  formatDateRangeLabel,
  getAllScenariosPath,
  getHistoryClickUrlsPath,
  getScenarioCountsDownloadPath,
  getScenarioCountsPath,
  getSearchScenarioDownloadPath,
  getScenariosByClientPath,
  getShortenedUrl,
} from './constants';
import {
  buildInitialDownloadExport,
  buildPageExportSheets,
  buildSearchDownloadExport,
  getAllDeviceTotals,
  getDefaultRangeIso,
  getDevicePieSeries,
  isEmptyDeviceCounts,
  writeReportWorkbook,
} from './utils/buildReportExport';
import {
  buildCvrCtrChart,
  buildDevicePieChart,
  buildLeaveBotChart,
} from './utils/reportChartOptions';

const Report = () => {
  const [botId, setBotId] = useState(Cookies.get(BOT_ID_COOKIE_KEY));
  const [startDate, setStartDate] = useState(() => moment().startOf(MOMENT_UNIT_MONTH));
  const [endDate, setEndDate] = useState(() => moment().subtract(DAYS_YESTERDAY, MOMENT_UNIT_DAY));
  const [allScenarios, setAllScenarios] = useState([]);
  const [scenarioId, setScenarioId] = useState(null);
  const [, setDataReportCount] = useState();
  const [device, setDevice] = useState(DEVICE_ALL);
  const [loading, setLoading] = useState(false);
  const [dateError, setDateError] = useState(EMPTY_CELL);
  const [numOfBotStart, setNumofBotStart] = useState(0);
  const [numOfOpenBot, setNumOfOpenBot] = useState(0);
  const [numOfCloseBot, setNumOfCloseBot] = useState(0);
  const [reportGroupSelect, setReportGroupSelect] = useState(AGGREGATION_CUSTOM);
  const [devicePieChartSeries, setDevicePieChartSeries] = useState([]);
  const [devicePieChartSeriesCount, setDevicePieChartSeriesCount] = useState([]);
  const [, setConversionAll] = useState(0);
  const [, setOpWinAll] = useState(0);
  const [, setOpPCAll] = useState(0);
  const [, setCloseAll] = useState(0);
  const [conversionCVRCTR, setConversionCVRCTR] = useState(0);
  const [CVRCTR, setCVRCTR] = useState(false);
  const [shortenedList, setShortenedList] = useState([]);
  const [listContent, setListContent] = useState([]);
  const [conversionExport, setConversionExport] = useState([]);
  const [clickThroughExport, setClickThroughExport] = useState([]);
  const [leaveBotExport, setLeaveBotExport] = useState([]);
  const [conversionRateExport, setConversionRateExport] = useState([]);
  const [clickThroughRateExport, setClickThroughRateExport] = useState([]);
  const [botLeaveRate, setBotLeaveRate] = useState([]);
  const [startPageExport, setStartPageExport] = useState([]);
  const [cvPageExport, setCvPageExport] = useState([]);
  const [isAdminDeel, setIsAdminDeel] = useState(false);
  const [allClient, setAllClient] = useState([]);
  const [currentClientId, setCurrentClientId] = useState(CLIENT_ID_DEEL);
  const [emptyDevice, setEmptyDevice] = useState(false);
  const [startDateEx, setStartDateEx] = useState();
  const [endDateEx, setEndDateEx] = useState();
  const [startPage, setStartPage] = useState(true);

  useEffect(() => {
    setBotId(Cookies.get(BOT_ID_COOKIE_KEY));
  }, []);

  useEffect(() => {
    if (Cookies.get(USER_ROLE_COOKIE_KEY) === ROLE_ADMIN_DEEL) {
      setIsAdminDeel(true);
    } else {
      setIsAdminDeel(false);
    }
  }, []);

  useEffect(() => {
    if (isAdminDeel) {
      api
        .get(GET_CLIENT_WITH_NAME_PATH)
        .then((res) => {
          if (res.data?.code === API_SUCCESS_CODE) {
            setAllClient(res.data?.data);
          }
        })
        .catch(() => {});
    }
  }, [isAdminDeel]);

  useEffect(() => {
    const cookieBotId = Cookies.get(BOT_ID_COOKIE_KEY);
    api
      .get(getHistoryClickUrlsPath(cookieBotId))
      .then((res) => {
        setShortenedList(res.data.data);
      })
      .catch((err) => {
        if (err.response?.data.code === API_EXPIRED_CODE) {
          tokenExpired();
        }
      });
  }, []);

  const applyExportSheets = (sheets) => {
    setConversionExport(sheets.conversionExport);
    setClickThroughExport(sheets.clickThroughExport);
    setLeaveBotExport(sheets.leaveBotExport);
    setConversionRateExport(sheets.conversionRateExport);
    setClickThroughRateExport(sheets.clickThroughRateExport);
    setBotLeaveRate(sheets.botLeaveRate);
  };

  useEffect(() => {
    api
      .get(getAllScenariosPath(botId))
      .then((res) => {
        if (res.data.code === API_SUCCESS_CODE) {
          const dataScenario = res?.data?.data;
          if (dataScenario !== []) {
            const range = getDefaultRangeIso();
            api
              .get(getScenarioCountsPath(dataScenario[0].id, range.start, range.end))
              .then((countsRes) => {
                setListContent(countsRes.data?.scenario_pages);
                const pages = countsRes.data?.scenario_pages;
                const dateRangeLabel = formatDateRangeLabel(range.start, range.end);
                const { startPageExportData, contentPageExport } = buildPageExportSheets(
                  pages,
                  dateRangeLabel,
                );
                setStartPageExport(startPageExportData);
                setCvPageExport(contentPageExport);
                setDataReportCount(countsRes?.data?.data);
                const chatbotData = countsRes?.data?.data;
                const chatbotValue = getDevicePieSeries(chatbotData);
                if (isEmptyDeviceCounts(chatbotData)) {
                  setEmptyDevice(true);
                }
                const totals = getAllDeviceTotals(chatbotData);
                setConversionAll(totals.conversion);
                setConversionCVRCTR(totals.conversion);
                setOpWinAll(totals.botStart);
                setNumofBotStart(totals.botStart);
                setOpPCAll(totals.botOpen);
                setNumOfOpenBot(totals.botOpen);
                setCloseAll(totals.botClose);
                setNumOfCloseBot(totals.botClose);
                setDevicePieChartSeries(chatbotValue);
                setDevicePieChartSeriesCount(chatbotValue);
              })
              .catch(() => {});
            api
              .get(getScenarioCountsDownloadPath(dataScenario[0].id, range.start, range.end))
              .then((downloadRes) => {
                setStartDateEx(range.start);
                setEndDateEx(range.end);
                const exportData = downloadRes?.data.data;
                applyExportSheets(buildInitialDownloadExport(
                  exportData,
                  formatDateRangeLabel(range.start, range.end),
                ));
              })
              .catch(() => {});
          }
          setAllScenarios(dataScenario);
          if (dataScenario?.[0]?.id) {
            setScenarioId(dataScenario[0].id);
          }
        }
      })
      .catch((err) => {
        if (err.response?.data.code === API_EXPIRED_CODE) {
          tokenExpired();
        }
      });
  }, [botId]);

  const optionsCVR = buildCvrCtrChart({
    isCtr: CVRCTR,
    conversionCvrCtr: conversionCVRCTR,
    numOfOpenBot,
    numOfBotStart,
    palette: adminChartPalette,
  });

  const leaveBot = buildLeaveBotChart({
    numOfCloseBot,
    numOfBotStart,
    palette: adminChartPalette,
  });

  const devicePieChartConfig = buildDevicePieChart({
    emptyDevice,
    series: devicePieChartSeries,
    palette: adminChartPalette,
  });

  const validDateRange = (start, end) => {
    if (start > end) {
      setDateError(DATE_RANGE_ERROR);
      return false;
    }
    setDateError(EMPTY_CELL);
    return true;
  };

  const selectStartDate = (date) => {
    setStartDate(date ? moment(date) : null);
  };

  const selectEndDate = (date) => {
    setEndDate(date ? moment(date) : null);
  };

  const getSearchParams = () => ({
    scenarioId,
    device,
    startDate: moment(startDate).format(DATE_FORMAT),
    endDate: moment(endDate).format(DATE_FORMAT),
  });

  const handleSearch = (e) => {
    e?.preventDefault?.();

    if (!startDate || !endDate) {
      setDateError(DATE_REQUIRED_ERROR);
      return;
    }

    const searchVal = getSearchParams();
    const start = parseInt(searchVal.startDate.replaceAll(DATE_SLASH, EMPTY_CELL), 10);
    const end = parseInt(searchVal.endDate.replaceAll(DATE_SLASH, EMPTY_CELL), 10);

    if (!searchVal.scenarioId) {
      return;
    }

    if (validDateRange(start, end) !== true) {
      return;
    }

    setLoading(true);
    const pending = { remaining: PENDING_REQUEST_COUNT };
    const finishLoading = () => {
      pending.remaining -= 1;
      if (pending.remaining === 0) {
        setLoading(false);
      }
    };

    api
      .get(getScenarioCountsPath(searchVal.scenarioId, searchVal.startDate, searchVal.endDate))
      .then((res) => {
        setStartDateEx(searchVal.startDate?.replaceAll(DATE_SLASH, DATE_DASH));
        setEndDateEx(searchVal.endDate?.replaceAll(DATE_SLASH, DATE_DASH));
        setListContent(res.data?.scenario_pages);
        const pages = res.data?.scenario_pages;
        const dateRangeLabel = formatDateRangeLabel(searchVal.startDate, searchVal.endDate);
        const { startPageExportData, contentPageExport } = buildPageExportSheets(
          pages,
          dateRangeLabel,
        );
        setStartPageExport(startPageExportData);
        setCvPageExport(contentPageExport);
        setDataReportCount(res?.data?.data);
        const chatbotData = res?.data?.data;
        const chatbotValue = getDevicePieSeries(chatbotData);
        if (isEmptyDeviceCounts(chatbotData)) {
          setEmptyDevice(true);
        } else {
          setEmptyDevice(false);
        }
        const totals = getAllDeviceTotals(chatbotData);
        setConversionAll(totals.conversion);
        setOpWinAll(totals.botStart);
        setOpPCAll(totals.botOpen);
        setCloseAll(totals.botClose);
        setDevicePieChartSeries(chatbotValue);
        setDevicePieChartSeriesCount(chatbotValue);

        if (searchVal.device === DEVICE_ALL) {
          setConversionCVRCTR(totals.conversion);
          setNumofBotStart(totals.botStart);
          setNumOfOpenBot(totals.botOpen);
          setNumOfCloseBot(totals.botClose);
        } else if (searchVal.device === DEVICE_COMPUTER) {
          setConversionCVRCTR(chatbotData.pc_conversion_count);
          setNumofBotStart(chatbotData.pc_count);
          setNumOfOpenBot(chatbotData.pc_open_chatbot_window_count);
          setNumOfCloseBot(chatbotData.pc_close_chatbot_window_count);
        } else if (searchVal.device === DEVICE_TABLET) {
          setConversionCVRCTR(chatbotData.tablet_conversion_count);
          setNumofBotStart(chatbotData.tablet_count);
          setNumOfOpenBot(chatbotData.tablet_open_chatbot_window_count);
          setNumOfCloseBot(chatbotData.tablet_close_chatbot_window_count);
        } else if (searchVal.device === DEVICE_SMARTPHONE) {
          setConversionCVRCTR(chatbotData.smartphone_conversion_count);
          setNumofBotStart(chatbotData.smartphone_count);
          setNumOfOpenBot(chatbotData.smartphone_open_chatbot_window_count);
          setNumOfCloseBot(chatbotData.smartphone_close_chatbot_window_count);
        }
      })
      .catch(() => {})
      .finally(finishLoading);

    api
      .get(getSearchScenarioDownloadPath(searchVal.scenarioId, searchVal.startDate, searchVal.endDate))
      .then((res) => {
        const exportData = res?.data.data;
        applyExportSheets(buildSearchDownloadExport(exportData, searchVal));
      })
      .catch(() => {})
      .finally(finishLoading);
  };

  const chooseAggreation = (value) => {
    setReportGroupSelect(value);
    setEndDate(moment().subtract(DAYS_YESTERDAY, MOMENT_UNIT_DAY));
    if (value === AGGREGATION_CUSTOM) {
      setStartDate(moment().startOf(MOMENT_UNIT_MONTH));
    } else if (value === AGGREGATION_YESTERDAY) {
      setStartDate(moment().subtract(DAYS_YESTERDAY, MOMENT_UNIT_DAY));
    } else if (value === AGGREGATION_WEEK) {
      setStartDate(moment().subtract(DAYS_WEEK, MOMENT_UNIT_DAY));
    } else if (value === AGGREGATION_MONTH) {
      setStartDate(moment().subtract(DAYS_MONTH, MOMENT_UNIT_DAY));
    }
  };

  const handleExport = async () => {
    try {
      writeReportWorkbook({
        conversionRateExport,
        conversionExport,
        clickThroughRateExport,
        clickThroughExport,
        botLeaveRate,
        leaveBotExport,
        startPageExport,
        cvPageExport,
        startDateEx,
        endDateEx,
      });
    } catch {
    }
  };

  const handleSelectClient = (value) => {
    if (value === CLIENT_ID_DEEL) {
      api
        .get(getAllScenariosPath(botId))
        .then((res) => {
          if (res.data?.code === API_SUCCESS_CODE) {
            setAllScenarios(res.data?.data);
            setScenarioId(res.data?.data?.[0]?.id ?? null);
          }
        })
        .catch(() => {});
      setCurrentClientId(value);
    } else {
      api
        .get(getScenariosByClientPath(value))
        .then((res) => {
          const scenarios = res.data?.data ?? [];
          setAllScenarios(scenarios);
          setScenarioId(scenarios[0]?.id ?? null);
        })
        .catch(() => {});
      setCurrentClientId(value);
    }
  };

  const contentTableData = useMemo(() => {
    if (!listContent?.length) {
      return [];
    }
    if (startPage) {
      return listContent;
    }
    return listContent.filter((item) => item.num_of_cv > 0);
  }, [listContent, startPage]);

  const contentColumns = useMemo(
    () => [
      {
        title: COL_START_COUNT,
        dataIndex: 'num_of_start',
        width: COL_WIDTH_START,
      },
      {
        title: COL_CV_COUNT,
        dataIndex: 'num_of_cv',
        width: COL_WIDTH_CV,
      },
      {
        title: COL_URL,
        dataIndex: 'url',
        ellipsis: true,
      },
    ],
    [],
  );

  const shortenedColumns = useMemo(
    () => [
      {
        title: COL_INDEX,
        width: COL_WIDTH_INDEX,
        align: ALIGN_CENTER,
        render: (_, __, index) => index + 1,
      },
      {
        title: COL_CLICK_COUNT,
        dataIndex: 'num_of_click',
        width: COL_WIDTH_CLICK,
      },
      {
        title: COL_ORIGIN_URL,
        dataIndex: 'origin_url',
        ellipsis: true,
      },
      {
        title: COL_SHORT_URL,
        dataIndex: 'shorten_code',
        width: COL_WIDTH_SHORT_URL,
        render: (code) => getShortenedUrl(code),
      },
    ],
    [],
  );

  const scenarioOptions = useMemo(
    () =>
      allScenarios?.map((scenario) => ({
        value: scenario.id,
        label: scenario.name,
      })) ?? [],
    [allScenarios],
  );

  const clientOptions = useMemo(
    () => [
      { value: CLIENT_ID_DEEL, label: LABEL_CLIENT_DEEL },
      ...allClient.map((client) => ({
        value: client.id,
        label: client.name,
      })),
    ],
    [allClient],
  );

  const getContentRowKey = (record) =>
    `${record.url ?? EMPTY_CELL}-${record.num_of_start ?? 0}-${record.num_of_cv ?? 0}`;

  const filterToolbar = (
    <Space wrap size={12} className="report-filter-toolbar">
      <Space size={4}>
        <Typography.Text type="secondary">{LABEL_PERIOD}</Typography.Text>
        <Select
          value={reportGroupSelect}
          onChange={chooseAggreation}
          options={AGGREGATION_OPTIONS}
          className="report-filter-select report-filter-select--agg"
        />
      </Space>
      <DatePicker.RangePicker
        value={[startDate, endDate]}
        onChange={(dates) => {
          selectStartDate(dates?.[0] ?? null);
          selectEndDate(dates?.[1] ?? null);
        }}
        format={DATE_FORMAT}
        disabled={reportGroupSelect !== AGGREGATION_CUSTOM}
      />
      <Space size={4}>
        <Typography.Text type="secondary">{LABEL_DEVICE}</Typography.Text>
        <Select
          value={device}
          onChange={setDevice}
          options={DEVICE_OPTIONS}
          className="report-filter-select"
        />
      </Space>
      {isAdminDeel && (
        <Space size={4}>
          <Typography.Text type="secondary">{LABEL_CLIENT}</Typography.Text>
          <Select
            value={currentClientId}
            onChange={handleSelectClient}
            options={clientOptions}
            className="report-filter-select"
          />
        </Space>
      )}
      <Space size={4}>
        <Typography.Text type="secondary">{LABEL_SCENARIO}</Typography.Text>
        <Select
          value={scenarioId}
          onChange={setScenarioId}
          options={scenarioOptions}
          className="report-filter-select report-filter-select--scenario"
        />
      </Space>
      <AdminActionButton action="search" onClick={handleSearch} />
    </Space>
  );

  useAdminHeaderActions(
    <AdminActionButton action="download" onClick={handleExport} />
  );

  const renderSectionTitle = (title, tooltip) => (
    <div className="report-section-title">
      <Typography.Text strong>{title}</Typography.Text>
      {tooltip && <AdminInfoTooltip text={tooltip} />}
    </div>
  );

  const renderDeviceStat = (label, value, modifier) => (
    <div className={`report-stat-card report-stat-card--${modifier}`}>
      <div className="report-stat-card__icon" />
      <div className="report-stat-card__info">
        <Typography.Text type="secondary">{label}</Typography.Text>
        <Typography.Text strong className="report-stat-card__value">
          {emptyDevice || !value ? EMPTY_VALUE : value}
        </Typography.Text>
      </div>
    </div>
  );

  return (
    <AdminPage
      className="admin-page--report"
      card={false}
    >
      <div id={SCREEN_ALL_ID} className="admin-page-card report-page-card">
        <div className="report-filter-panel">
          {filterToolbar}
          {dateError && (
            <Typography.Text type="danger" className="report-date-error">
              {dateError}
            </Typography.Text>
          )}
        </div>

        <Spin spinning={loading}>
          <div className="report-sections">
            <div className="report-section">
              {renderSectionTitle(SECTION_CVR_CTR, TOOLTIP_CVR_CTR)}
              <Tabs
                activeKey={CVRCTR ? TAB_CTR : TAB_CVR}
                onChange={(key) => setCVRCTR(key === TAB_CTR)}
                className="admin-page-tabs"
                items={[
                  {
                    key: TAB_CVR,
                    label: TAB_LABEL_CVR,
                    children: (
                      <div className="report-chart-panel">
                        <ReactApexChart
                          options={optionsCVR.options}
                          series={optionsCVR.series}
                          type={CHART_TYPE_BAR}
                          height={CHART_RENDER_HEIGHT}
                        />
                      </div>
                    ),
                  },
                  {
                    key: TAB_CTR,
                    label: TAB_LABEL_CTR,
                    children: (
                      <div className="report-chart-panel">
                        <ReactApexChart
                          options={optionsCVR.options}
                          series={optionsCVR.series}
                          type={CHART_TYPE_BAR}
                          height={CHART_RENDER_HEIGHT}
                        />
                      </div>
                    ),
                  },
                ]}
              />
            </div>

            <div className="report-section">
              {renderSectionTitle(SECTION_LEAVE, TOOLTIP_LEAVE)}
              <div className="report-chart-panel">
                <ReactApexChart
                  options={leaveBot.options}
                  series={leaveBot.series}
                  type={CHART_TYPE_BAR}
                  height={CHART_RENDER_HEIGHT}
                />
              </div>
            </div>

            <div className="report-section">
              {renderSectionTitle(SECTION_CONTENT, TOOLTIP_CONTENT)}
              <Tabs
                activeKey={startPage ? TAB_START : TAB_CV}
                onChange={(key) => setStartPage(key === TAB_START)}
                className="admin-page-tabs"
                items={[
                  {
                    key: TAB_START,
                    label: TAB_LABEL_START,
                    children: (
                      <AdminTable
                        columns={contentColumns}
                        dataSource={contentTableData}
                        rowKey={getContentRowKey}
                        emptyDescription={EMPTY_TABLE}
                        pagination={{ pageSize: PAGE_SIZE }}
                      />
                    ),
                  },
                  {
                    key: TAB_CV,
                    label: TAB_LABEL_CV,
                    children: (
                      <AdminTable
                        columns={contentColumns}
                        dataSource={contentTableData}
                        rowKey={getContentRowKey}
                        emptyDescription={EMPTY_TABLE}
                        pagination={{ pageSize: PAGE_SIZE }}
                      />
                    ),
                  },
                ]}
              />
            </div>

            <div className="report-section">
              {renderSectionTitle(SECTION_DEVICE, TOOLTIP_DEVICE)}
              <div className="report-device-grid">
                <div className="report-chart-panel">
                  {emptyDevice ? (
                    <Empty description={EMPTY_DEVICE} />
                  ) : (
                    <ReactApexChart
                      options={devicePieChartConfig.options}
                      series={devicePieChartConfig.series}
                      type={CHART_TYPE_PIE}
                      height={CHART_RENDER_HEIGHT}
                    />
                  )}
                </div>
                <div className="report-stat-cards">
                  {renderDeviceStat(LABEL_PC, devicePieChartSeriesCount[0], STAT_MODIFIER_PC)}
                  {renderDeviceStat(LABEL_SMARTPHONE, devicePieChartSeriesCount[1], STAT_MODIFIER_SP)}
                  {renderDeviceStat(LABEL_TABLET, devicePieChartSeriesCount[2], STAT_MODIFIER_TABLET)}
                </div>
              </div>
            </div>

            <div className="report-section">
              {renderSectionTitle(SECTION_SHORTENED, TOOLTIP_SHORTENED)}
              <AdminTable
                columns={shortenedColumns}
                dataSource={shortenedList ?? []}
                rowKey="shorten_code"
                emptyDescription={EMPTY_TABLE}
                pagination={{ pageSize: PAGE_SIZE }}
              />
            </div>
          </div>
        </Spin>
      </div>
    </AdminPage>
  );
};

export default Report;
