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
import api from './../../../../api/api-management';
import Cookies from 'js-cookie';
import { tokenExpired } from 'v2/api/tokenExpired';
import { utils, writeFileXLSX } from 'xlsx';
import { AdminPage, AdminTable, AdminActionButton, AdminInfoTooltip, useAdminHeaderActions } from '../../../../components/AdminShell';
import { adminChartPalette } from '../../../../theme/adminTheme';
import './../../../../assets/css/bot/report.css';

function Report() {
  // states
  const [botId, setBotId] = useState(Cookies.get('bot_id'));
  const [startDate, setStartDate] = useState(() => moment().startOf('month'));
  const [endDate, setEndDate] = useState(() => moment().subtract(1, 'day'));
  const [allScenarios, setAllScenarios] = useState([]);
  const [scenarioId, setScenarioId] = useState(null);
  const [dataReportCount, setDataReportCount] = useState();
  const [device, setDevice] = useState('all');
  const [loading, setLoading] = useState(false);
  const [dateError, setDateError] = useState('');
  const [numOfBotStart, setNumofBotStart] = useState(0);
  const [numOfOpenBot, setNumOfOpenBot] = useState(0);
  const [numOfCloseBot, setNumOfCloseBot] = useState(0);
  const [reportGroupSelect, setReportGroupSelect] = useState('first');
  //
  const [devicePieChartSeries, setDevicePieChartSeries] = useState([]);
  const [devicePieChartSeriesCount, setDevicePieChartSeriesCount] = useState([]);
  const [conversionAll, setConversionAll] = useState(0);
  const [opWinAll, setOpWinAll] = useState(0);
  const [opPCAll, setOpPCAll] = useState(0);
  const [closeAll, setCloseAll] = useState(0);
  const [conversionCVRCTR, setConversionCVRCTR] = useState(0);
  const [CVRCTR, setCVRCTR] = useState(false);
  const [shortenedList, setShortenedList] = useState([]);
  const [listContent, setListContent] = useState([]);
  //
  const [conversionExport, setConversionExport] = useState([]);
  const [clickThroughExport, setClickThroughExport] = useState([]);
  const [leaveBotExport, setLeaveBotExport] = useState([]);
  const [conversionRateExport, setConversionRateExport] = useState([]);
  const [clickThroughRateExport, setClickThroughRateExport] = useState([]);
  const [botLeaveRate, setBotLeaveRate] = useState([]);
  const [startPageExport, setStartPageExport] = useState([]);
  const [cvPageExport, setCvPageExport] = useState([]);
  // const [deviceExport, setDeviceExport] = useState([]);
  const [isAdminDeel, setIsAdminDeel] = useState(false);
  const [allClient, setAllClient] = useState([]);
  const [currentClientId, setCurrentClientId] = useState('deel');
  const [emptyDevice, setEmptyDevice] = useState(false);

  const [startDateEx, setStartDateEx] = useState();
  const [endDateEx, setEndDateEx] = useState();

  useEffect(() => {
    setBotId(Cookies.get('bot_id'));
  }, []);

  useEffect(() => {
    if (Cookies.get('user_role') === 'admin_deel') {
      setIsAdminDeel(true);
    } else {
      setIsAdminDeel(false);
    }
  }, []);

  useEffect(() => {
    if (isAdminDeel) {
      api
        .get('/api/v1/managements/get_client_with_name')
        .then((res) => {
          console.log('all client: ', res.data);
          if (res.data?.code === 1) {
            setAllClient(res.data?.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [isAdminDeel]);

  //get data SHORTENED
  useEffect(() => {
    let botId = Cookies.get('bot_id');
    api
      .get(`/api/v1/managements/history_click_urls?chatbot_id=${botId}`)
      .then((res) => {
        setShortenedList(res.data.data);
      })
      .catch((err) => {
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }, []);

  //get All Scenarios
  useEffect(() => {
    // let dateStart = new Date(new Date().setDate(1))
    // console.log('start date: ', dateStart.toISOString().slice(0,10));
    api
      .get(`/api/v1/managements/chatbots/${botId}/all_scenarios`)
      .then((res) => {
        if (res.data.code === 1) {
          let dataScenario = res?.data?.data;
          if (dataScenario != []) {
            api
              .get(
                `/api/v1/analytics/scenario_counts/${dataScenario[0].id}?begin_date=${new Date(
                  new Date().setDate(1)
                )
                  .toISOString()
                  .slice(0, 10)}&end_date=${new Date(new Date().setDate(new Date().getDate() - 1))
                    .toISOString()
                    .slice(0, 10)}`
              )
              .then((res) => {
                // console.log('bot data: ', res.data);
                setListContent(res.data?.scenario_pages);
                //set page export
                let pages = res.data?.scenario_pages;
                let startPageExportData = [
                  [
                    '集計期間',
                    `${new Date(new Date().setDate(1)).toISOString().slice(0, 10)}~${new Date(
                      new Date().setDate(new Date().getDate() - 1)
                    )
                      .toISOString()
                      .slice(0, 10)}`,
                  ],
                ];
                startPageExportData.push(['開始ページ', 'CV数', 'URL']);
                let contentPageExport = [
                  [
                    '集計期間',
                    `${new Date(new Date().setDate(1)).toISOString().slice(0, 10)}~${new Date(
                      new Date().setDate(new Date().getDate() - 1)
                    )
                      .toISOString()
                      .slice(0, 10)}`,
                  ],
                ];
                contentPageExport.push(['開始ページ', 'CV数', 'URL']);
                pages.forEach((index) => {
                  startPageExportData.push([index.num_of_start, index.num_of_cv, index.url]);
                  if (index.num_of_cv > 0) {
                    contentPageExport.push([index.num_of_start, index.num_of_cv, index.url]);
                  }
                });
                setStartPageExport(startPageExportData);
                setCvPageExport(contentPageExport);

                setDataReportCount(res?.data?.data);
                let chatbotData = res?.data?.data;
                // let chatbotDataCount = [1,1,1]
                let chatbotValue = [
                  chatbotData.pc_open_chatbot_window_count,
                  chatbotData.smartphone_open_chatbot_window_count,
                  chatbotData.tablet_open_chatbot_window_count,
                ];
                if (
                  chatbotData.pc_count == 0 &&
                  chatbotData.pc_count == 0 &&
                  chatbotData.pc_count == 0
                ) {
                  // chatbotValue = [1, 1, 1];
                  setEmptyDevice(true);
                  // setDevicePieChartSeriesCount(chatbotDataCount)
                }
                // console.log(chatbotValue)
                let numOfCon =
                  chatbotData.smartphone_conversion_count +
                  chatbotData.pc_conversion_count +
                  chatbotData.tablet_conversion_count;
                // setNumofConversion(numOfCon)
                setConversionAll(numOfCon);
                setConversionCVRCTR(numOfCon);
                let numOfBS =
                  chatbotData.pc_count +
                  chatbotData.tablet_count +
                  chatbotData.smartphone_count;
                setOpWinAll(numOfBS);
                setNumofBotStart(numOfBS);
                // setBotCVRCTR(numOfBS)
                let numOfOB =
                  chatbotData.pc_open_chatbot_window_count + chatbotData.tablet_open_chatbot_window_count + chatbotData.smartphone_open_chatbot_window_count;
                setOpPCAll(numOfOB);
                setNumOfOpenBot(numOfOB);
                let numOfCB =
                  chatbotData.pc_close_chatbot_window_count +
                  chatbotData.tablet_close_chatbot_window_count +
                  chatbotData.smartphone_close_chatbot_window_count;
                setCloseAll(numOfCB);
                setNumOfCloseBot(numOfCB);
                //Pie chart///
                setDevicePieChartSeries(chatbotValue);
                setDevicePieChartSeriesCount(chatbotValue);
              })
              .catch((error) => {
                console.log(error);
              });
            api
              .get(
                `/api/v1/analytics/scenario_counts/${dataScenario[0].id
                }/download?begin_date=${new Date(new Date().setDate(1))
                  .toISOString()
                  .slice(0, 10)}&end_date=${new Date(new Date().setDate(new Date().getDate() - 1))
                    .toISOString()
                    .slice(0, 10)}`
              )
              .then((res) => {
                setStartDateEx(new Date(new Date().setDate(1)).toISOString().slice(0, 10));
                setEndDateEx(
                  new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().slice(0, 10)
                );
                // console.log(`download: `, res.data.data)
                let exportData = res?.data.data;
                let totalConversion = 0;
                let totalBotStart = 0;
                let totalBotOpen = 0;
                let totalBotLeave = 0;
                let cvrPC = 0;
                let cvrTB = 0;
                let cvrSP = 0;
                let ctrPC = 0;
                let ctrTB = 0;
                let ctrSP = 0;
                let lBPC = 0;
                let lBTB = 0;
                let lBSP = 0;
                let exportCV = [['集計期間', 'CV PC', 'CV タブレット', 'CV スマートフォン']];
                let exportClickThrough = [['集計期間', 'BOT開始', 'BOT起動']];
                let exportBotLeave = [
                  [
                    '集計期間',
                    'PC離脱',
                    'タブレット離脱',
                    'スマートフォン離脱',
                    'BOT開始',
                    'BOT離脱',
                  ],
                ];
                let exportCVR = [
                  [
                    '集計期間',
                    `${new Date(new Date().setDate(1)).toISOString().slice(0, 10)}~${new Date(
                      new Date().setDate(new Date().getDate() - 1)
                    )
                      .toISOString()
                      .slice(0, 10)}`,
                  ],
                ];
                exportCVR.push([
                  'CV PC',
                  'CV タブレット',
                  'CV スマートフォン',
                  'CV合計数',
                  'BOT起動',
                ]);
                let exportCTR = [
                  [
                    'Date',
                    `${new Date(new Date().setDate(1)).toISOString().slice(0, 10)}~${new Date(
                      new Date().setDate(new Date().getDate() - 1)
                    )
                      .toISOString()
                      .slice(0, 10)}`,
                  ],
                ];
                exportCTR.push([
                  'CT PC',
                  'CT タブレット',
                  'CT スマートフォン',
                  'BOT開始',
                  'BOT起動',
                ]);
                let exportLeaveBotRate = [
                  [
                    '集計期間',
                    `${new Date(new Date().setDate(1)).toISOString().slice(0, 10)}~${new Date(
                      new Date().setDate(new Date().getDate() - 1)
                    )
                      .toISOString()
                      .slice(0, 10)}`,
                  ],
                ];
                exportLeaveBotRate.push(['PC', 'タブレット', 'スマートフォン', '合計', 'BOT開始']);
                exportData.forEach((index) => {
                  exportCV.push([
                    index.log_date,
                    index.pc_conversion_count,
                    index.tablet_conversion_count,
                    index.smartphone_conversion_count,
                  ]);
                  totalConversion +=
                    index.pc_conversion_count +
                    index.tablet_conversion_count +
                    index.smartphone_conversion_count;
                  cvrPC += index.pc_conversion_count;
                  cvrTB += index.tablet_conversion_count;
                  cvrSP += index.smartphone_conversion_count;
                  exportClickThrough.push([
                    index.log_date,
                    index.pc_open_chatbot_window_count +
                    index.smartphone_open_chatbot_window_count +
                    index.tablet_open_chatbot_window_count,
                    index.pc_count + index.smartphone_count + index.tablet_count,
                  ]);
                  totalBotStart +=
                    index.pc_count +
                    index.smartphone_count +
                    index.tablet_count;
                  totalBotOpen += index.pc_open_chatbot_window_count + index.smartphone_open_chatbot_window_count + index.tablet_open_chatbot_window_count;
                  ctrPC += index.pc_open_chatbot_window_count;
                  ctrTB += index.tablet_open_chatbot_window_count;
                  ctrSP += index.smartphone_open_chatbot_window_count;
                  exportBotLeave.push([
                    index.log_date,
                    index.pc_close_chatbot_window_count,
                    index.tablet_close_chatbot_window_count,
                    index.smartphone_close_chatbot_window_count,
                    index.pc_open_chatbot_window_count +
                    index.smartphone_open_chatbot_window_count +
                    index.tablet_open_chatbot_window_count,
                    index.pc_close_chatbot_window_count +
                    index.tablet_close_chatbot_window_count +
                    index.smartphone_close_chatbot_window_count,
                  ]);
                  totalBotLeave +=
                    index.pc_close_chatbot_window_count +
                    index.tablet_close_chatbot_window_count +
                    index.smartphone_close_chatbot_window_count;
                  lBPC += index.pc_close_chatbot_window_count;
                  lBTB += index.tablet_close_chatbot_window_count;
                  lBSP += index.smartphone_close_chatbot_window_count;
                });
                console.log('totalBotStart: ', totalBotStart);
                exportCVR.push([cvrPC, cvrTB, cvrSP, totalConversion, totalBotOpen]);
                exportCVR.push([
                  '',
                  '',
                  '',
                  'CVR',
                  totalBotOpen === 0
                    ? `0%`
                    : `${Math.round((totalConversion * 100) / totalBotOpen).toFixed(2)}%`,
                ]);
                exportCTR.push([ctrPC, ctrTB, ctrSP, totalBotStart, totalBotOpen]);
                exportCTR.push([
                  '',
                  '',
                  '',
                  'CTR',
                  totalBotOpen === 0
                    ? `0%`
                    : `${Math.round((totalBotOpen * 100) / totalBotStart).toFixed(2)}%`,
                ]);
                exportLeaveBotRate.push([lBPC, lBTB, lBSP, totalBotLeave, totalBotStart]);
                exportLeaveBotRate.push([
                  '',
                  '',
                  '',
                  '離脱率',
                  totalBotStart === 0
                    ? `0%`
                    : `${Math.round((totalBotLeave * 100) / totalBotStart).toFixed(2)}%`,
                ]);
                exportCV.push(['', '合計', '', totalConversion]);
                exportClickThrough.push(['合計', totalBotStart, totalBotOpen]);
                exportBotLeave.push(['', '合計', '', '', totalBotStart, totalBotLeave]);
                setConversionExport(exportCV);
                setClickThroughExport(exportClickThrough);
                setLeaveBotExport(exportBotLeave);
                setConversionRateExport(exportCVR);
                setClickThroughRateExport(exportCTR);
                setBotLeaveRate(exportLeaveBotRate);
              })
              .catch((error) => {
                console.log(error);
              });
          }
          // api.get(`/api/v1/analytics/scenario_pages/${dataScenario[0].id}`).then((resCon) => {
          //   // console.log('resCon: ', resCon.data.data);
          //   setListContent(resCon.data.data);
          // });

          setAllScenarios(dataScenario);
          if (dataScenario?.[0]?.id) {
            setScenarioId(dataScenario[0].id);
          }
        }
      })
      .catch((err) => {
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }, [botId]);

  var optionsCVR = {
    series: [
      {
        name: CVRCTR === false ? 'コンバージョン' : 'BOT起動',
        data: [CVRCTR === false ? conversionCVRCTR ?? 0 : numOfOpenBot ?? 0],
      },
      {
        name: CVRCTR === false ? 'BOT起動' : 'BOT開始',
        data: [CVRCTR === false ? numOfOpenBot ?? 0 : numOfBotStart ?? 0],
      },
    ],
    options: {
      chart: {
        type: 'bar',
        height: 380,
        stacked: true,
        // background: ['#33b2df', '#546E7A'],
      },
      plotOptions: {
        bar: {
          // distributed: true,
          horizontal: true,
          dataLabels: {
            total: {
              enabled: true,
              offsetX: 0,
              style: {
                fontSize: '13px',
                fontWeight: 900,
              },
            },
            position: 'bottom',
          },
        },
      },
      colors: [adminChartPalette[0], adminChartPalette[1]],
      dataLabels: {
        enabled: true,
        textAnchor: 'start',
        style: {
          colors: ['#fff'],
        },
        formatter: function (val, opt) {
          return '合計:  ' + val;
        },
        offsetX: 0,
        dropShadow: {
          enabled: true,
        },
      },
      stroke: {
        width: 1,
        colors: ['#fff'],
      },
      xaxis: {
        categories: [
          ` ${CVRCTR === false
            ? numOfOpenBot === 0
              ? `CVR: 0`
              : `CVR: ${Math.round((conversionCVRCTR * 100) / numOfOpenBot).toFixed(2)}`
            : numOfBotStart === 0
              ? `CTR: 0`
              : `CTR: ${Math.round((numOfOpenBot * 100) / numOfBotStart).toFixed(2)}`
          }%`,
        ],
        labels: {
          formatter: function (val) {
            return val;
          },
        },
      },
      yaxis: {
        labels: {
          show: true,
        },
      },
      title: {
        text: CVRCTR === false ? 'コンバージョン率(CVR)' : 'CTR (BOT起動数/BOT開始数）',
        align: 'center',
        floating: true,
      },
      subtitle: {
        text: CVRCTR === false ? 'コンバージョン数／BOT開始' : 'BOT起動/BOT開始',
        align: 'center',
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + '';
          },
        },
      },
    },
  };

  const leaveBot = {
    series: [
      {
        data: [numOfCloseBot ?? 0, numOfBotStart ?? 0],
      },
    ],
    options: {
      chart: {
        type: 'bar',
        height: 380,
      },
      plotOptions: {
        bar: {
          barHeight: '100%',
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: 'bottom',
          },
        },
      },
      colors: [adminChartPalette[0], adminChartPalette[1]],
      dataLabels: {
        enabled: true,
        textAnchor: 'start',
        style: {
          colors: ['#fff'],
        },
        formatter: function (val, opt) {
          return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val;
        },
        offsetX: 0,
        dropShadow: {
          enabled: true,
        },
      },
      stroke: {
        width: 1,
        colors: ['#fff'],
      },
      xaxis: {
        categories: ['離脱', 'BOT開始'],
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      title: {
        text: '離脱/BOT開始',
        align: 'center',
        floating: true,
      },
      subtitle: {
        text: `離脱: ${numOfBotStart === 0 ? 0 : Math.round((numOfCloseBot * 100) / numOfBotStart).toFixed(2)
          }%`,
        align: 'center',
      },
      tooltip: {
        theme: 'dark',
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: function () {
              return '';
            },
          },
        },
      },
    },
  };

  const numOfConversionBotStart = {
    series: [
      {
        data: [conversionCVRCTR ?? 0, numOfBotStart ?? 0],
      },
    ],
    options: {
      chart: {
        type: 'bar',
        height: 380,
      },
      plotOptions: {
        bar: {
          barHeight: '100%',
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: 'bottom',
          },
        },
      },
      colors: [adminChartPalette[0], adminChartPalette[1]],
      dataLabels: {
        enabled: true,
        textAnchor: 'start',
        style: {
          colors: ['#fff'],
        },
        formatter: function (val, opt) {
          return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val;
        },
        offsetX: 0,
        dropShadow: {
          enabled: true,
        },
      },
      stroke: {
        width: 1,
        colors: ['#fff'],
      },
      xaxis: {
        categories: ['コンバージョンレート', 'クリックスルーレート'],
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      title: {
        text: 'コンバージョン数/BOT開始数',
        align: 'center',
        floating: true,
      },
      subtitle: {
        text: `CTR (BOT開始数/BOT起動数: ${numOfBotStart === 0 ? 0 : Math.round((conversionCVRCTR * 100) / numOfBotStart).toFixed(2)
          }%`,
        align: 'center',
      },
      tooltip: {
        theme: 'dark',
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: function () {
              return '';
            },
          },
        },
      },
    },
  };

  // chart
  let devicePieChartConfig = {
    series: emptyDevice == true ? [0, 0, 0] : devicePieChartSeries,
    options: {
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: ['パソコン', 'スマートフォン', 'タブレット'],
      colors: adminChartPalette,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    },
  };

  function validDateRange(start, end) {
    if (start > end) {
      setDateError('開始日時は終了日時より大きいです。');
      return false;
    }
    setDateError('');
    return true;
  }

  function selectStartDate(date) {
    setStartDate(date ? moment(date) : null);
  }

  function selectEndDate(date) {
    setEndDate(date ? moment(date) : null);
  }

  function getSearchParams() {
    return {
      scenarioId,
      device,
      startDate: moment(startDate).format('YYYY/MM/DD'),
      endDate: moment(endDate).format('YYYY/MM/DD'),
    };
  }

  function handleSearch(e) {
    e?.preventDefault?.();

    if (!startDate || !endDate) {
      setDateError('日付を入力してください');
      return;
    }

    const searchVal = getSearchParams();
    const start = parseInt(searchVal.startDate.replaceAll('/', ''), 10);
    const end = parseInt(searchVal.endDate.replaceAll('/', ''), 10);

    if (!searchVal.scenarioId) {
      return;
    }

    if (validDateRange(start, end) !== true) {
      return;
    }

    setLoading(true);
    let pendingRequests = 2;
    const finishLoading = () => {
      pendingRequests -= 1;
      if (pendingRequests === 0) {
        setLoading(false);
      }
    };

    api
      .get(
        `/api/v1/analytics/scenario_counts/${searchVal.scenarioId}?begin_date=${searchVal.startDate}&end_date=${searchVal.endDate}`
      )
      .then((res) => {
            setStartDateEx(searchVal.startDate?.replaceAll('/', '-'));
            setEndDateEx(searchVal.endDate?.replaceAll('/', '-'));
            // console.log('search data: ', res.data);
            setListContent(res.data?.scenario_pages);
            //set page export
            let pages = res.data?.scenario_pages;
            let startPageExportData = [['集計期間', `${searchVal.startDate}~${searchVal.endDate}`]];
            startPageExportData.push(['開始ページ', 'CV数', 'URL']);
            let contentPageExport = [['集計期間', `${searchVal.startDate}~${searchVal.endDate}`]];
            contentPageExport.push(['開始ページ', 'CV数', 'URL']);
            pages.forEach((index) => {
              startPageExportData.push([index.num_of_start, index.num_of_cv, index.url]);
              if (index.num_of_cv > 0) {
                contentPageExport.push([index.num_of_start, index.num_of_cv, index.url]);
              }
            });
            setStartPageExport(startPageExportData);
            setCvPageExport(contentPageExport);

            setDataReportCount(res?.data?.data);
            let chatbotData = res?.data?.data;
            // let chatbotDataCount = [1,1,1]
            let chatbotValue = [
              chatbotData.pc_open_chatbot_window_count,
              chatbotData.smartphone_open_chatbot_window_count,
              chatbotData.tablet_open_chatbot_window_count,
            ];
            if (
              chatbotData.pc_count == 0 &&
              chatbotData.pc_count == 0 &&
              chatbotData.pc_count == 0
            ) {
              // chatbotValue = [1, 1, 1];
              setEmptyDevice(true);
              // setDevicePieChartSeriesCount(chatbotDataCount)
            } else {
              setEmptyDevice(false);
            }
            // console.log(chatbotValue)
            let numOfCon =
              chatbotData.smartphone_conversion_count +
              chatbotData.pc_conversion_count +
              chatbotData.tablet_conversion_count;
            // setNumofConversion(numOfCon)
            setConversionAll(numOfCon);
            // setConversionCVRCTR(numOfCon)
            let numOfBS =
              chatbotData.pc_count +
              chatbotData.tablet_count +
              chatbotData.smartphone_count;
            setOpWinAll(numOfBS);
            // setNumofBotStart(numOfBS)
            // setBotCVRCTR(numOfBS)
            let numOfOB =
              chatbotData.pc_open_chatbot_window_count + chatbotData.tablet_open_chatbot_window_count + chatbotData.smartphone_open_chatbot_window_count;
            setOpPCAll(numOfOB);
            // setNumOfOpenBot(numOfOB)
            let numOfCB =
              chatbotData.pc_close_chatbot_window_count +
              chatbotData.tablet_close_chatbot_window_count +
              chatbotData.smartphone_close_chatbot_window_count;
            setCloseAll(numOfCB);
            // setNumOfCloseBot(numOfCB)
            //Pie chart///
            setDevicePieChartSeries(chatbotValue);
            setDevicePieChartSeriesCount(chatbotValue);

            if (searchVal.device == 'all') {
              setConversionCVRCTR(numOfCon);
              setNumofBotStart(numOfBS);
              setNumOfOpenBot(numOfOB);
              setNumOfCloseBot(numOfCB);
            } else if (searchVal.device == 'computer') {
              setConversionCVRCTR(chatbotData.pc_conversion_count);
              setNumofBotStart(chatbotData.pc_count);
              setNumOfOpenBot(chatbotData.pc_open_chatbot_window_count);
              setNumOfCloseBot(chatbotData.pc_close_chatbot_window_count);
            } else if (searchVal.device == 'tablet') {
              setConversionCVRCTR(chatbotData.tablet_conversion_count);
              setNumofBotStart(chatbotData.tablet_count);
              setNumOfOpenBot(chatbotData.tablet_open_chatbot_window_count);
              setNumOfCloseBot(chatbotData.tablet_close_chatbot_window_count);
            } else if (searchVal.device == 'smartphone') {
              setConversionCVRCTR(chatbotData.smartphone_conversion_count);
              setNumofBotStart(chatbotData.smartphone_count);
              setNumOfOpenBot(chatbotData.smartphone_open_chatbot_window_count);
              setNumOfCloseBot(chatbotData.smartphone_close_chatbot_window_count);
            }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(finishLoading);

    api
      .get(
        `/api/v1/analytics/scenario_counts/${searchVal.scenarioId}}/download?begin_date=${searchVal.startDate}&end_date=${searchVal.endDate}`
      )
      .then((res) => {
            // console.log(`download: `, res.data.data)
            let exportData = res?.data.data;
            let totalConversion = 0;
            let totalBotStart = 0;
            let totalBotOpen = 0;
            let totalBotLeave = 0;
            let cvrPC = 0;
            let cvrTB = 0;
            let cvrSP = 0;
            let ctrPC = 0;
            let ctrTB = 0;
            let ctrSP = 0;
            let lBPC = 0;
            let lBTB = 0;
            let lBSP = 0;
            let exportCV =
              searchVal.device == 'all'
                ? [['集計期間', 'CV PC', 'CV タブレット', 'CV スマートフォン']]
                : searchVal.device == 'computer'
                  ? [['集計期間', 'CV PC']]
                  : searchVal.device == 'tablet'
                    ? [['集計期間', 'CV タブレット']]
                    : [['集計期間', 'CV スマートフォン']];

            let exportCVR = [['集計期間', `${searchVal.startDate}~${searchVal.endDate}`]];
            exportCVR.push(
              searchVal.device == 'all'
                ? ['CV PC', 'CV タブレット', 'CV スマートフォン', 'CV合計数', 'BOT起動']
                : searchVal.device == 'computer'
                  ? ['CV PC', 'CV合計数', 'BOT起動']
                  : searchVal.device == 'tablet'
                    ? ['CV タブレット', 'CV合計数', 'BOT起動']
                    : ['CV スマートフォン', 'CV合計数', 'BOT起動']
            );
            let exportCTR = [['集計期間', `${searchVal.startDate}~${searchVal.endDate}`]];
            let exportClickThrough = [['集計期間', 'BOT開始', 'BOT起動']];
            let exportBotLeave = [
              searchVal.device == 'all'
                ? [
                  '集計期間',
                  'PC離脱',
                  'タブレット離脱',
                  'スマートフォン離脱',
                  'BOT開始',
                  'BOT離脱',
                ]
                : searchVal.device == 'computer'
                  ? ['集計期間', 'PC離脱', 'BOT開始', 'BOT離脱']
                  : searchVal.device == 'tablet'
                    ? ['集計期間', 'タブレット離脱', 'BOT開始', 'BOT離脱']
                    : ['集計期間', 'スマートフォン離脱', 'BOT開始', 'BOT離脱'],
            ];
            exportCTR.push(
              searchVal.device == 'all'
                ? ['CT PC', 'CT タブレット', 'CT スマートフォン', 'BOT開始', 'BOT起動']
                : searchVal.device == 'computer'
                  ? ['CT PC', 'BOT開始', 'BOT起動']
                  : searchVal.device == 'tablet'
                    ? ['CT タブレット', 'BOT開始', 'BOT起動']
                    : ['CT スマートフォン', 'BOT開始', 'BOT起動']
            );
            let exportLeaveBotRate = [['集計期間', `${searchVal.startDate}~${searchVal.endDate}`]];
            exportLeaveBotRate.push(
              searchVal.device == 'all'
                ? ['PC', 'タブレット', 'スマートフォン', '合計', 'BOT開始']
                : searchVal.device == 'computer'
                  ? ['PC', '合計', 'BOT開始']
                  : searchVal.device == 'tablet'
                    ? ['タブレット', '合計', 'BOT開始']
                    : ['スマートフォン', '合計', 'BOT開始']
            );
            exportData.forEach((index) => {
              exportCV.push(
                searchVal.device == 'all'
                  ? [
                    index.log_date,
                    index.pc_conversion_count,
                    index.tablet_conversion_count,
                    index.smartphone_conversion_count,
                  ]
                  : searchVal.device == 'computer'
                    ? [index.log_date, index.pc_conversion_count]
                    : searchVal.device == 'tablet'
                      ? [index.log_date, index.tablet_conversion_count]
                      : [index.log_date, index.smartphone_conversion_count]
              );
              totalConversion +=
                searchVal.device == 'all'
                  ? index.pc_conversion_count +
                  index.tablet_conversion_count +
                  index.smartphone_conversion_count
                  : searchVal.device == 'computer'
                    ? index.pc_conversion_count
                    : searchVal.device == 'tablet'
                      ? index.tablet_conversion_count
                      : index.smartphone_conversion_count;

              cvrPC += index.pc_conversion_count;
              cvrTB += index.tablet_conversion_count;
              cvrSP += index.smartphone_conversion_count;
              exportClickThrough.push([
                index.log_date,
                searchVal.device == 'all'
                  ? index.pc_open_chatbot_window_count +
                  index.smartphone_open_chatbot_window_count +
                  index.tablet_open_chatbot_window_count
                  : searchVal.device == 'computer'
                    ? index.pc_open_chatbot_window_count
                    : searchVal.device == 'tablet'
                      ? index.tablet_open_chatbot_window_count
                      : index.smartphone_open_chatbot_window_count,
                searchVal.device == 'all'
                  ? index.pc_count + index.smartphone_count + index.tablet_count
                  : searchVal.device == 'computer'
                    ? index.pc_count
                    : searchVal == 'tablet'
                      ? index.tablet_count
                      : index.smartphone_count,
              ]);
              totalBotStart +=
                searchVal.device == 'all'
                  ? index.pc_count +
                  index.smartphone_count +
                  index.tablet_count
                  : searchVal.device == 'computer'
                    ? index.pc_count
                    : searchVal.device == 'tablet'
                      ? index.tablet_count
                      : index.smartphone_count;
              totalBotOpen +=
                searchVal.device == 'all'
                  ? index.pc_open_chatbot_window_count + index.smartphone_open_chatbot_window_count + index.tablet_open_chatbot_window_count
                  : (searchVal.device == 'computer'
                    ? index.pc_open_chatbot_window_count
                    : searchVal.device == 'tablet'
                      ? index.tablet_open_chatbot_window_count
                      : index.smartphone_open_chatbot_window_count)
              ctrPC += index.pc_count;
              ctrTB += index.tablet_count;
              ctrSP += index.smartphone_count;
              exportBotLeave.push(
                searchVal.device == 'all'
                  ? [
                    index.log_date,
                    index.pc_close_chatbot_window_count,
                    index.tablet_close_chatbot_window_count,
                    index.smartphone_close_chatbot_window_count,
                    index.pc_open_chatbot_window_count +
                    index.smartphone_open_chatbot_window_count +
                    index.tablet_open_chatbot_window_count,
                    index.pc_close_chatbot_window_count +
                    index.tablet_close_chatbot_window_count +
                    index.smartphone_close_chatbot_window_count,
                  ]
                  : searchVal.device == 'computer'
                    ? [
                      index.log_date,
                      index.pc_close_chatbot_window_count,
                      index.pc_open_chatbot_window_count,
                      index.pc_close_chatbot_window_count,
                    ]
                    : searchVal.device == 'tablet'
                      ? [
                        index.log_date,
                        index.tablet_close_chatbot_window_count,
                        index.tablet_open_chatbot_window_count,
                        index.smartphone_close_chatbot_window_count,
                      ]
                      : [
                        index.log_date,
                        index.smartphone_close_chatbot_window_count,
                        index.smartphone_open_chatbot_window_count,
                        index.smartphone_close_chatbot_window_count,
                      ]
              );
              totalBotLeave +=
                searchVal.device == 'all'
                  ? index.pc_close_chatbot_window_count +
                  index.tablet_close_chatbot_window_count +
                  index.smartphone_close_chatbot_window_count
                  : searchVal.device == 'computer'
                    ? index.pc_close_chatbot_window_count
                    : searchVal.device == 'tablet'
                      ? index.tablet_close_chatbot_window_count
                      : index.smartphone_close_chatbot_window_count;
              lBPC += index.pc_close_chatbot_window_count;
              lBTB += index.tablet_close_chatbot_window_count;
              lBSP += index.smartphone_close_chatbot_window_count;
            });
            exportCVR.push(
              searchVal.device == 'all'
                ? [cvrPC, cvrTB, cvrSP, totalConversion, totalBotOpen]
                : searchVal.device == 'computer'
                  ? [cvrPC, totalConversion, totalBotOpen]
                  : searchVal.device == 'tablet'
                    ? [cvrTB, totalConversion, totalBotOpen]
                    : [cvrSP, totalConversion, totalBotOpen]
            );
            exportCVR.push([
              '',
              'CVR',
              totalBotOpen === 0
                ? `0%`
                : `${Math.round((totalConversion * 100) / totalBotOpen).toFixed(2)}%`,
              '',
              '',
            ]);
            exportCTR.push(
              searchVal.device == 'all'
                ? [ctrPC, ctrTB, ctrSP, totalBotStart, totalBotOpen]
                : searchVal.device == 'computer'
                  ? [ctrPC, totalBotStart, totalBotOpen]
                  : searchVal.device == 'tablet'
                    ? [ctrTB, totalBotStart, totalBotOpen]
                    : [ctrSP, totalBotStart, totalBotOpen]
            );
            exportCTR.push([
              '',
              'CTR',
              totalBotStart === 0
                ? `0%`
                : `${Math.round((totalBotOpen * 100) / totalBotStart).toFixed(2)}%`,
              '',
              '',
            ]);
            exportLeaveBotRate.push(
              searchVal.device == 'all'
                ? [lBPC, lBTB, lBSP, totalBotLeave, totalBotStart]
                : searchVal.device == 'computer'
                  ? [lBPC, totalBotLeave, totalBotStart]
                  : searchVal.device == 'tablet'
                    ? [lBTB, totalBotLeave, totalBotStart]
                    : [lBSP, totalBotLeave, totalBotStart]
            );
            exportLeaveBotRate.push([
              '',
              '',
              '',
              '離脱率',
              totalBotStart === 0
                ? `0%`
                : `${Math.round((totalBotLeave * 100) / totalBotStart).toFixed(2)}%`,
            ]);
            exportCV.push(['', '合計', totalConversion, '']);
            exportClickThrough.push(['合計', totalBotStart, totalBotOpen]);
            exportBotLeave.push(['', '合計', totalBotStart, totalBotLeave, '', '']);
            setConversionExport(exportCV);
            setClickThroughExport(exportClickThrough);
            setLeaveBotExport(exportBotLeave);
            setConversionRateExport(exportCVR);
            setClickThroughRateExport(exportCTR);
            setBotLeaveRate(exportLeaveBotRate);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(finishLoading);
  }

  function chooseAggreation(value) {
    setReportGroupSelect(value);
    setEndDate(moment().subtract(1, 'day'));
    if (value === 'first') {
      setStartDate(moment().startOf('month'));
    } else if (value === '1') {
      setStartDate(moment().subtract(1, 'day'));
    } else if (value === '7') {
      setStartDate(moment().subtract(7, 'day'));
    } else if (value === '30') {
      setStartDate(moment().subtract(30, 'day'));
    }
  }

  const [startPage, setStartPage] = useState(true);

  // handle export
  const handleExport = async () => {
    try {
      let wb = utils.book_new();
      let cvr = utils.aoa_to_sheet(conversionRateExport);
      let ws1 = utils.aoa_to_sheet(conversionExport);
      let ctr = utils.aoa_to_sheet(clickThroughRateExport);
      let ws2 = utils.aoa_to_sheet(clickThroughExport);
      let lbr = utils.aoa_to_sheet(botLeaveRate);
      let ws3 = utils.aoa_to_sheet(leaveBotExport);
      let startPage = utils.aoa_to_sheet(startPageExport);
      let cvPage = utils.aoa_to_sheet(cvPageExport);

      utils.book_append_sheet(wb, cvr, 'コンバージョン率(CVR)');
      utils.book_append_sheet(wb, ws1, 'コンバージョン数');
      utils.book_append_sheet(wb, ctr, 'クリックスルーレート(CTR) ');
      utils.book_append_sheet(wb, ws2, 'クリックスルーレート数');
      utils.book_append_sheet(wb, lbr, '離脱率');
      utils.book_append_sheet(wb, ws3, '離脱数');
      utils.book_append_sheet(wb, startPage, '開始ページ');
      utils.book_append_sheet(wb, cvPage, 'CVページ');
      writeFileXLSX(wb, `Export ${startDateEx}_${endDateEx}.xlsx`);
    } catch (error) {
      console.log(error);
    }
  };

  // handle select current client
  const handleSelectClient = (value) => {
    console.log();
    if (value === 'deel') {
      api
        .get(`/api/v1/managements/chatbots/${botId}/all_scenarios`)
        .then((res) => {
          if (res.data?.code === 1) {
            setAllScenarios(res.data?.data);
            setScenarioId(res.data?.data?.[0]?.id ?? null);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      setCurrentClientId(value);
    } else {
      api
        .get(`/api/v1/managements/get_list_scenario_by_client?client_id=${value}`)
        .then((res) => {
          const scenarios = res.data?.data ?? [];
          setAllScenarios(scenarios);
          setScenarioId(scenarios[0]?.id ?? null);
        })
        .catch((error) => {
          console.log(error);
        });
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
        title: '開始数',
        dataIndex: 'num_of_start',
        width: 100,
      },
      {
        title: 'CV数',
        dataIndex: 'num_of_cv',
        width: 100,
      },
      {
        title: 'URL',
        dataIndex: 'url',
        ellipsis: true,
      },
    ],
    []
  );

  const shortenedColumns = useMemo(
    () => [
      {
        title: '番号',
        width: 70,
        align: 'center',
        render: (_, __, index) => index + 1,
      },
      {
        title: 'クリック数',
        dataIndex: 'num_of_click',
        width: 110,
      },
      {
        title: '元のURL',
        dataIndex: 'origin_url',
        ellipsis: true,
      },
      {
        title: '短縮URL',
        dataIndex: 'shorten_code',
        width: 220,
        render: (code) => `https://ec-chatbot1.com/s/${code}`,
      },
    ],
    []
  );

  const aggregationOptions = [
    { value: 'first', label: '指定期間' },
    { value: '1', label: '前日' },
    { value: '7', label: '最近7日間' },
    { value: '30', label: '最近30日間' },
  ];

  const deviceOptions = [
    { value: 'all', label: 'すべて' },
    { value: 'computer', label: 'パソコン' },
    { value: 'tablet', label: 'タブレット' },
    { value: 'smartphone', label: 'スマートフォン' },
  ];

  const scenarioOptions = useMemo(
    () =>
      allScenarios?.map((scenario) => ({
        value: scenario.id,
        label: scenario.name,
      })) ?? [],
    [allScenarios]
  );

  const clientOptions = useMemo(
    () => [
      { value: 'deel', label: 'Deel' },
      ...allClient.map((client) => ({
        value: client.id,
        label: client.name,
      })),
    ],
    [allClient]
  );

  const getContentRowKey = (record) =>
    `${record.url ?? ''}-${record.num_of_start ?? 0}-${record.num_of_cv ?? 0}`;

  const filterToolbar = (
    <Space wrap size={12} className="report-filter-toolbar">
      <Space size={4}>
        <Typography.Text type="secondary">集計期間</Typography.Text>
        <Select
          value={reportGroupSelect}
          onChange={chooseAggreation}
          options={aggregationOptions}
          style={{ minWidth: 130 }}
        />
      </Space>
      <DatePicker.RangePicker
        value={[startDate, endDate]}
        onChange={(dates) => {
          selectStartDate(dates?.[0] ?? null);
          selectEndDate(dates?.[1] ?? null);
        }}
        format="YYYY/MM/DD"
        disabled={reportGroupSelect !== 'first'}
      />
      <Space size={4}>
        <Typography.Text type="secondary">デバイス</Typography.Text>
        <Select value={device} onChange={setDevice} options={deviceOptions} style={{ minWidth: 140 }} />
      </Space>
      {isAdminDeel && (
        <Space size={4}>
          <Typography.Text type="secondary">クライアント</Typography.Text>
          <Select
            value={currentClientId}
            onChange={handleSelectClient}
            options={clientOptions}
            style={{ minWidth: 140 }}
          />
        </Space>
      )}
      <Space size={4}>
        <Typography.Text type="secondary">シナリオ</Typography.Text>
        <Select
          value={scenarioId}
          onChange={setScenarioId}
          options={scenarioOptions}
          style={{ minWidth: 160 }}
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
          {emptyDevice || !value ? 'なし' : value}
        </Typography.Text>
      </div>
    </div>
  );

  return (
    <AdminPage
      className="admin-page--report"
      card={false}
    >
      <div id="screenAll" className="admin-page-card report-page-card">
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
              {renderSectionTitle(
                'コンバージョンレート（CVR）/クリックスルレート（CTR）',
                'コンバージョン率とクリックスルー率の推移'
              )}
              <Tabs
                activeKey={CVRCTR ? 'ctr' : 'cvr'}
                onChange={(key) => setCVRCTR(key === 'ctr')}
                className="admin-page-tabs"
                items={[
                  {
                    key: 'cvr',
                    label: 'コンバージョンレート（CVR）',
                    children: (
                      <div className="report-chart-panel">
                        <ReactApexChart
                          options={optionsCVR.options}
                          series={optionsCVR.series}
                          type="bar"
                          height={350}
                        />
                      </div>
                    ),
                  },
                  {
                    key: 'ctr',
                    label: 'クリックスルレート（CTR）',
                    children: (
                      <div className="report-chart-panel">
                        <ReactApexChart
                          options={optionsCVR.options}
                          series={optionsCVR.series}
                          type="bar"
                          height={350}
                        />
                      </div>
                    ),
                  },
                ]}
              />
            </div>

            <div className="report-section">
              {renderSectionTitle('離脱', 'BOT開始に対する離脱の割合')}
              <div className="report-chart-panel">
                <ReactApexChart
                  options={leaveBot.options}
                  series={leaveBot.series}
                  type="bar"
                  height={350}
                />
              </div>
            </div>

            <div className="report-section">
              {renderSectionTitle('コンテンツ', '開始ページとCVページの集計')}
              <Tabs
                activeKey={startPage ? 'start' : 'cv'}
                onChange={(key) => setStartPage(key === 'start')}
                className="admin-page-tabs"
                items={[
                  {
                    key: 'start',
                    label: '開始ページ',
                    children: (
                      <AdminTable
                        columns={contentColumns}
                        dataSource={contentTableData}
                        rowKey={getContentRowKey}
                        emptyDescription="データがありません"
                        pagination={{ pageSize: 10 }}
                      />
                    ),
                  },
                  {
                    key: 'cv',
                    label: 'CVページ',
                    children: (
                      <AdminTable
                        columns={contentColumns}
                        dataSource={contentTableData}
                        rowKey={getContentRowKey}
                        emptyDescription="データがありません"
                        pagination={{ pageSize: 10 }}
                      />
                    ),
                  },
                ]}
              />
            </div>

            <div className="report-section">
              {renderSectionTitle('デバイス', 'デバイス別のBOT起動数')}
              <div className="report-device-grid">
                <div className="report-chart-panel">
                  {emptyDevice ? (
                    <Empty description="デバイスがありません。" />
                  ) : (
                    <ReactApexChart
                      options={devicePieChartConfig.options}
                      series={devicePieChartConfig.series}
                      type="pie"
                      height={350}
                    />
                  )}
                </div>
                <div className="report-stat-cards">
                  {renderDeviceStat('パソコン', devicePieChartSeriesCount[0], 'pc')}
                  {renderDeviceStat('スマートフォン', devicePieChartSeriesCount[1], 'sp')}
                  {renderDeviceStat('タブレット', devicePieChartSeriesCount[2], 'tablet')}
                </div>
              </div>
            </div>

            <div className="report-section">
              {renderSectionTitle('リンククリックの短縮', '短縮URLのクリック数')}
              <AdminTable
                columns={shortenedColumns}
                dataSource={shortenedList ?? []}
                rowKey="shorten_code"
                emptyDescription="データがありません"
                pagination={{ pageSize: 10 }}
              />
            </div>
          </div>
        </Spin>
      </div>
    </AdminPage>
  );
}

export default Report;
