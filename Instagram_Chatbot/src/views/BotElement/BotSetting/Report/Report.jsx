import DatePicker from 'react-datepicker';
import React from 'react';
import { Card, CardHeader, CardBody, Table, Row, Col } from 'reactstrap';
import './../../../../assets/css/bot/report.css';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import ReactApexChart from 'react-apexcharts';
import { useEffect } from 'react';
import api from './../../../../api/api-management';
import Cookies from 'js-cookie';
import { tokenExpired } from 'api/tokenExpired';
import { utils, writeFileXLSX } from 'xlsx';

function Report() {
  // states
  const [botId, setBotId] = useState(Cookies.get('bot_id'));
  const [startDate, setStartDate] = useState(new Date().setDate(1));
  const [endDate, setEndDate] = useState(new Date().setDate(new Date().getDate() - 1));
  const [dateState, setDateState] = useState(new Date());
  const [allScenarios, setAllScenarios] = useState([]);
  const [dataReportCount, setDataReportCount] = useState();
  const [device, setDevice] = useState('all');
  const [numOfBotStart, setNumofBotStart] = useState();
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
                startPageExportData.push(['開始ページ', 'CV数', 'URLs']);
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
                contentPageExport.push(['開始ページ', 'CV数', 'URLs']);
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
                  chatbotData.pc_open_chatbot_window_count +
                  chatbotData.tablet_open_chatbot_window_count +
                  chatbotData.smartphone_open_chatbot_window_count;
                setOpWinAll(numOfBS);
                setNumofBotStart(numOfBS);
                // setBotCVRCTR(numOfBS)
                let numOfOB =
                  chatbotData.pc_count + chatbotData.tablet_count + chatbotData.smartphone_count;
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
                    index.pc_open_chatbot_window_count +
                    index.smartphone_open_chatbot_window_count +
                    index.tablet_open_chatbot_window_count;
                  totalBotOpen += index.pc_count + index.smartphone_count + index.tablet_count;
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
        data: [CVRCTR === false ? conversionCVRCTR : numOfOpenBot],
      },
      {
        name: CVRCTR === false ? 'BOT起動' : 'BOT開始',
        data: [CVRCTR === false ? numOfOpenBot : numOfBotStart],
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
      colors: ['#33b2df', '#546E7A'],
      dataLabels: {
        enabled: true,
        textAnchor: 'start',
        style: {
          colors: ['#fff'],
        },
        formatter: function (val, opt) {
          return 'Total:  ' + val;
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
        // labels: {
        //   show: false,
        // },
        categories: ['合計'],
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
        data: [numOfCloseBot, numOfBotStart],
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
      colors: ['#33b2df', '#546E7A'],
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
        data: [conversionCVRCTR, numOfBotStart],
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
      colors: ['#33b2df', '#546E7A'],
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
      labels: ['PC', 'スマートフォン', 'タブレット'],
    },
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
  };

  function validDateRange(start, end) {
    const errDate = document.getElementById('errDate');
    if (start > end) {
      errDate.style.display = 'block';
      errDate.innerHTML = '開始日時は終了日時より大きいです。';
      return false;
    } else {
      errDate.style.display = 'none';
      errDate.innerHTML = '';
      return true;
    }
  }

  function selectStartDate(date) {
    if (date) {
      setStartDate(date);
    } else {
      setStartDate(null);
    }
  }

  function selectEndDate(date) {
    if (date) {
      setEndDate(date);
    } else {
      setEndDate(null);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    const formSearch = document.getElementById('formSearch');
    var searchVal = {};
    for (let i = 0; i < formSearch.length; i++) {
      searchVal[formSearch[i].name] = formSearch[i].value;
    }
    // console.log(searchVal);

    if (!searchVal.startDate || !searchVal.endDate) {
      const errDate = document.getElementById('errDate');
      errDate.style.display = 'block';
      errDate.innerHTML = 'Date cannot blank';
    } else {
      const start = parseInt(format(startDate, 'yyyy/MM/dd').replaceAll('/', ''));
      const end = parseInt(format(endDate, 'yyyy/MM/dd').replaceAll('/', ''));
      if (validDateRange(start, end) === true) {
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
            startPageExportData.push(['開始ページ', 'CV数', 'URLs']);
            let contentPageExport = [['集計期間', `${searchVal.startDate}~${searchVal.endDate}`]];
            contentPageExport.push(['開始ページ', 'CV数', 'URLs']);
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
              chatbotData.pc_open_chatbot_window_count +
              chatbotData.tablet_open_chatbot_window_count +
              chatbotData.smartphone_open_chatbot_window_count;
            setOpWinAll(numOfBS);
            // setNumofBotStart(numOfBS)
            // setBotCVRCTR(numOfBS)
            let numOfOB =
              chatbotData.pc_count + chatbotData.tablet_count + chatbotData.smartphone_count;
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
              setNumofBotStart(chatbotData.pc_open_chatbot_window_count);
              setNumOfOpenBot(chatbotData.pc_count);
              setNumOfCloseBot(chatbotData.pc_close_chatbot_window_count);
            } else if (searchVal.device == 'tablet') {
              setConversionCVRCTR(chatbotData.tablet_conversion_count);
              setNumofBotStart(chatbotData.tablet_open_chatbot_window_count);
              setNumOfOpenBot(chatbotData.tablet_count);
              setNumOfCloseBot(chatbotData.tablet_close_chatbot_window_count);
            } else if (searchVal.device == 'smartphone') {
              setConversionCVRCTR(chatbotData.smartphone_conversion_count);
              setNumofBotStart(chatbotData.smartphone_open_chatbot_window_count);
              setNumOfOpenBot(chatbotData.smartphone_count);
              setNumOfCloseBot(chatbotData.smartphone_close_chatbot_window_count);
            }
          })
          .catch((error) => {
            console.log(error);
          });
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
                  ? index.pc_open_chatbot_window_count +
                  index.smartphone_open_chatbot_window_count +
                  index.tablet_open_chatbot_window_count
                  : searchVal.device == 'computer'
                    ? index.pc_open_chatbot_window_count
                    : searchVal.device == 'tablet'
                      ? index.tablet_open_chatbot_window_count
                      : index.smartphone_open_chatbot_window_count;
              totalBotOpen +=
                searchVal.device == 'all'
                  ? index.pc_count + index.smartphone_count + index.tablet_count
                  : (searchVal.device == 'computer'
                    ? index.pc_count
                    : searchVal.device == 'tablet'
                      ? index.tablet_count
                      : index.smartphone_count)
              ctrPC += index.pc_open_chatbot_window_count;
              ctrTB += index.tablet_open_chatbot_window_count;
              ctrSP += index.smartphone_open_chatbot_window_count;
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
          });
      }
    }
  }

  function chooseAggreation(value) {
    // setStartDate
    setReportGroupSelect(value);
    setEndDate(new Date().setDate(new Date().getDate() - 1));
    if (value == 'first') {
      console.log('date: ', new Date(new Date().setDate(new Date().getDate() - 7)));
      setStartDate(new Date().setDate(1));
    } else if (value == '1') {
      setStartDate(new Date(new Date().setDate(new Date().getDate() - 1)));
    } else if (value == '7') {
      setStartDate(new Date(new Date().setDate(new Date().getDate() - 7)));
    } else if (value == '30') {
      setStartDate(new Date(new Date().setDate(new Date().getDate() - 30)));
    }
  }

  const [startPage, setStartPage] = useState(true);
  function startPageContent() { }

  function cvPageContent() { }

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
          console.log('da: ', res.data);
          // if (res.data?.code === 1) {
          setAllScenarios(res.data?.data);
          // }
        })
        .catch((error) => {
          console.log(error);
        });
      setCurrentClientId(value);
    }
  };

  return (
    <> 
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>
                <div className="report">
                  <form id="formSearch" className="report__info">
                    <p className="report__group">集計期間:</p>
                    <div className="report__group">
                      <select
                        className="report__group-select"
                        onChange={(e) => chooseAggreation(e.target.value)}
                        name="aggregation"
                        id=""
                        value={reportGroupSelect}
                      >
                        <option value="first">指定期間</option>
                        <option value="1">前日</option>
                        <option value="7">最近7日間</option>
                        <option value="30">最近30日間</option>
                      </select>
                    </div>
                    <div className="report__group report-date">
                      <DatePicker
                        className="report__group-input"
                        id="startDate"
                        name="startDate"
                        selected={startDate}
                        onChange={(date) => selectStartDate(date)}
                        dateFormat="yyyy/MM/dd"
                        disabled={reportGroupSelect !== 'first'}
                      />
                    </div>
                    <div className="report__group report-date">
                      <DatePicker
                        className="report__group-input"
                        id="endDate"
                        name="endDate"
                        selected={endDate}
                        onChange={(date) => selectEndDate(date)}
                        dateFormat="yyyy/MM/dd"
                        disabled={reportGroupSelect !== 'first'}
                      />
                    </div>
                    <p className="report__group">デバイス</p>
                    <div className="report__group">
                      <select className="report__group-select" name="device" id="">
                        <option value="all">すべて</option>
                        <option value="computer">PC</option>
                        <option value="tablet">タブレット</option>
                        <option value="smartphone">スマートフォン</option>
                      </select>
                    </div>
                    {isAdminDeel && (
                      <>
                        <p className="report__group">Current Client</p>
                        <div className="report__group">
                          <select
                            className="report__group-select"
                            name="currentClientId"
                            id=""
                            value={currentClientId}
                            onChange={(e) => handleSelectClient(e.target.value)}
                          >
                            <option value={'deel'}>Deel</option>
                            {allClient.map((client, index) => (
                              <option key={index} value={client.id}>
                                {client.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}
                    <p className="report__group">シナリオ</p>
                    <div className="report__group">
                      <select className="report__group-select" name="scenarioId" id="">
                        {allScenarios?.map((scenario, index) => (
                          <option key={index} value={scenario.id}>
                            {scenario.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="report__group">
                      <button className="btn btn-primary" onClick={(e) => handleSearch(e)}>
                        <i className="fa fa-search" aria-hidden="true"></i>
                      </button>
                    </div>
                  </form>
                  <div className="report__download">
                    {/* <button className="btn btn-primary">Input contents download</button> */}
                    {/* <button className="btn btn-primary">入力内容ダウンロード</button> */}
                    <button className="btn btn-primary" onClick={handleExport}>
                      ダウンロード
                    </button>
                    {/* <button className="btn btn-primary">ダウンロード</button> */}
                  </div>
                </div>
                <span id="errDate" className="err-date"></span>
              </CardHeader>
              <CardBody>
                <div className="report__body">
                  <div className="report__item">
                    <div className="report__item-head">
                      コンバージョンレート（CVR）/クリックスルレート（CTR）
                      <a href="">
                        <i className="far fa-question-circle"></i>
                      </a>
                    </div>
                    <div className="report__item-btn">
                      <button
                        className="btn btn-success"
                        id="btn_conversion_rate"
                        onClick={() => setCVRCTR(false)}
                      >
                        コンバージョンレート（CVR）
                      </button>
                      <button
                        className="btn btn-success"
                        id="btn_click_through_conversion_rate"
                        onClick={() => setCVRCTR(true)}
                      >
                        クリックスルレート（CTR）
                      </button>
                    </div>
                    <div id="conversion_rate" className="report__item-chart">
                      <ReactApexChart
                        options={optionsCVR.options}
                        series={optionsCVR.series}
                        type="bar"
                        height={350}
                      />
                    </div>
                    {/* <div id='click_through_rate' className="report__item-chart" style={{ display: 'none' }}>
                      <ReactApexChart options={barChart.options} series={barChart.series} type="bar" height={350} />   

                    </div> */}
                  </div>

                  <div className="report__item report__item-2">
                    <div className="report__item-head report__item-2-head-main">
                      離脱
                      <a href="">
                        <i className="far fa-question-circle"></i>
                      </a>
                      <ReactApexChart
                        options={leaveBot.options}
                        series={leaveBot.series}
                        type="bar"
                        height={350}
                      />
                    </div>
                  </div>

                  {/* <div className="report__item report__item-2">
                    <div className="report__item-head report__item-2-head-main">
                      コンバージョン数/BOT開始数推移
                      <a href="">
                        <i className="far fa-question-circle"></i>
                      </a>
                      <ReactApexChart
                        options={numOfConversionBotStart.options}
                        series={numOfConversionBotStart.series}
                        type="bar"
                        height={350}
                      />
                    </div>

                  </div> */}

                  {/* <div className="report__item">
                    <div className="report__item-head">
                      SCENARIO TRANSITION
                      <a href="">
                        <i className="far fa-question-circle"></i>
                      </a>
                      <div className="report__item-btn">
                        <button className="btn btn-success">Overall Scenario Transition</button>
                        <button className="btn btn-success">Scenario trends for each item</button>
                      </div>
                      <div className="report__item-content">
                        <ReactApexChart
                          options={lineChartScenario.options}
                          series={lineChart.series}
                          type="line"
                          height={350}
                        />
                      </div>
                    </div>
                  </div> */}

                  <div className="report__item">
                    <div className="report__item-head">
                      コンテンツ
                      <a href="">
                        <i className="far fa-question-circle"></i>
                      </a>
                      <div className="report__item-btn">
                        <button className="btn btn-success" onClick={() => setStartPage(true)}>
                          開始ページ
                        </button>
                        <button className="btn btn-success" onClick={() => setStartPage(false)}>
                          CVページ
                        </button>
                      </div>
                      <div className="report__item-content">
                        <Table>
                          <thead className="text-primary">
                            <tr>
                              {/* <th style={{ width: '4%' }}>page</th> */}
                              <th style={{ width: '4%' }}>開始数</th>
                              <th style={{ width: '4%' }}>CV数</th>
                              <th style={{ width: '4%' }}>URLS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* <tr>sdsssd</tr> */}
                            {startPage
                              ? listContent?.map((item, index) => (
                                <tr key={index}>
                                  <td>{item.num_of_start}</td>
                                  <td>{item.num_of_cv}</td>
                                  <td>{item.url}</td>
                                </tr>
                              ))
                              : listContent?.map((item, index) =>
                                item.num_of_cv > 0 ? (
                                  <tr key={index}>
                                    <td>{item.num_of_start}</td>
                                    <td>{item.num_of_cv}</td>
                                    <td>{item.url}</td>
                                  </tr>
                                ) : (
                                  <tr key={index}></tr>
                                )
                              )}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </div>

                  <div className="report__item report__item-2">
                    <div className="report__item-head report__item-2-head-main">
                      デバイス
                      <a href="">
                        <i className="far fa-question-circle"></i>
                      </a>
                      {/* <div className="report__item-btn">
                        <button className="btn btn-success">number of bot starts</button>
                        <button className="btn btn-success">Conversions (CV)</button>
                      </div> */}
                      <div className="report__item-pie">
                        {emptyDevice == true ? (
                          <div style={{ width: '100%', textAlign: 'center', marginTop: '50px' }}>
                            <span>デバイスがありません。</span>
                          </div>
                        ) : (
                          <ReactApexChart
                            options={devicePieChartConfig.options}
                            series={devicePieChartConfig.series}
                            type="pie"
                            height={350}
                          />
                        )}
                      </div>
                    </div>
                    <div className="report__item-head report__item-2-head">
                      <div className="report__item-head report__item-2-head">
                        PC
                        <a href="">
                          <i className="far fa-question-circle"></i>
                        </a>
                        {devicePieChartSeriesCount[0] > 0 ? (
                          emptyDevice == true ? (
                            <div>データがありません。</div>
                          ) : (
                            <div>{devicePieChartSeriesCount[0]}</div>
                          )
                        ) : (
                          <div>データがありません。</div>
                        )}
                      </div>
                      <div className="report__item-head report__item-2-head">
                        スマートフォン
                        <a href="">
                          <i className="far fa-question-circle"></i>
                        </a>
                        {devicePieChartSeriesCount[1] > 0 ? (
                          emptyDevice == true ? (
                            <div>データがありません。</div>
                          ) : (
                            <div>{devicePieChartSeriesCount[1]}</div>
                          )
                        ) : (
                          <div>データがありません。</div>
                        )}
                      </div>
                      <div className="report__item-head report__item-2-head">
                        タブレット
                        <a href="">
                          <i className="far fa-question-circle"></i>
                        </a>
                        {devicePieChartSeriesCount[2] > 0 ? (
                          emptyDevice == true ? (
                            <div>データがありません。</div>
                          ) : (
                            <div>{devicePieChartSeriesCount[2]}</div>
                          )
                        ) : (
                          <div>データがありません。</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="report__item">
                    <div style={{ textAlign: 'center' }} className="report__item-head">
                      リンククリックの短縮
                      <a href="">
                        <i className="far fa-question-circle"></i>
                      </a>
                      {/* <div className="report__item-btn">
                        <button className="btn btn-success">start page</button>
                        <button className="btn btn-success">CV page</button>
                      </div> */}
                      <br />
                      <br />
                      <div className="report__item-content">
                        <Table bordered height="200" className="report__item-content--fix-table">
                          <thead className="text-primary">
                            <tr>
                              <th className="report__item-content-title" style={{ width: '5%' }}>
                                No.
                              </th>
                              <th className="report__item-content-title" style={{ width: '15%' }}>
                                クリック数
                              </th>
                              <th className="report__item-content-title" style={{ width: '60%' }}>
                                元のURL
                              </th>
                              <th className="report__item-content-title" style={{ width: '20%' }}>
                                短縮URL
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {shortenedList?.map((item, index) => (
                              <tr key={index} style={{ height: '20px' }}>
                                <td>{index + 1}</td>
                                <td>{item.num_of_click}</td>
                                <td>{item.origin_url}</td>
                                <td>https://ec-chatbot1.com/s/{item.shorten_code}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Report;
