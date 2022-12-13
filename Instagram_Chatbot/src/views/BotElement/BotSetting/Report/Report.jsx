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

function Report() {
  // states
  const [botId, setBotId] = useState(Cookies.get('bot_id'));
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [dateState, setDateState] = useState(new Date());
  const [allScenarios, setAllScenarios] = useState([]);
  const [dataReportCount, setDataReportCount] = useState();
  const [device, setDevice] = useState('all');
  const [numOfConversion, setNumofConversion] = useState(0);
  const [numOfBotStart, setNumofBotStart] = useState();
  const [numOfOpenBot, setNumOfOpenBot] = useState(0)
  const [devicePieChartSeries, setDevicePieChartSeries] = useState([]);
  const [devicePieChartSeriesCount, setDevicePieChartSeriesCount] = useState([]);
  const [cvr, setCvr] = useState(0)
  const [barChart, setBarChart] = useState({
    series: [{
      name: 'Marine Sprite',
      data: [44]
    }, {
      name: 'Striking Calf',
      data: [53]
    }
    ],
    options: {
      chart: {
        type: 'bar',
        height: 380,
        stacked: true,
      },
      plotOptions: {
        bar: {
          distributed: true,
          horizontal: true,
          dataLabels: {
            total: {
              enabled: true,
              offsetX: 0,
              style: {
                fontSize: '13px',
                fontWeight: 900
              }
            },
            position: 'bottom',
          }
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
          return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val +'%';
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
        categories: ['Total'],
        labels: {
          formatter: function (val) {
            return val + "%"
          }
        }
      },
      yaxis: {
        // labels: {
        //   show: false,
        // },
        categories: ['Total'],
      },
      title: {
        text: 'Custom DataLabels',
        align: 'center',
        floating: true,
      },
      subtitle: {
        text: 'Category Names as DataLabels inside bars',
        align: 'center',
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + "%"
          }
        }
      },
    },
  });
  // const [lineChart, setLineChart] = useState({
  //   series: [
  //     {
  //       name: 'TEAM A',
  //       type: 'area',
  //       data: [44, 55, 31, 47, 31, 43, 26, 41, 31, 47, 33],
  //     },
  //     {
  //       name: 'TEAM B',
  //       type: 'line',
  //       data: [55, 69, 45, 61, 43, 54, 37, 52, 44, 61, 43],
  //     },
  //   ],
  //   options: {
  //     chart: {
  //       height: 350,
  //       width: '100%',
  //       type: 'line',
  //     },
  //     stroke: {
  //       curve: 'smooth',
  //     },
  //     fill: {
  //       type: 'solid',
  //       opacity: [0.35, 1],
  //     },
  //     labels: [
  //       'Dec 01',
  //       'Dec 02',
  //       'Dec 03',
  //       'Dec 04',
  //       'Dec 05',
  //       'Dec 06',
  //       'Dec 07',
  //       'Dec 08',
  //       'Dec 09 ',
  //       'Dec 10',
  //       'Dec 11',
  //     ],
  //     markers: {
  //       size: 0,
  //     },
  //     yaxis: [
  //       {
  //         title: {
  //           text: 'Series A',
  //         },
  //       },
  //       {
  //         opposite: true,
  //         title: {
  //           text: 'Series B',
  //         },
  //       },
  //     ],
  //     tooltip: {
  //       shared: true,
  //       intersect: false,
  //       y: {
  //         formatter: function (y) {
  //           if (typeof y !== 'undefined') {
  //             return y.toFixed(0) + ' points';
  //           }
  //           return y;
  //         },
  //       },
  //     },
  //   },
  // });

  var optionsCVR = {
    series: [{
      name: 'Conversion',
      data: [numOfConversion]
    }, {
      name: 'Bot Load',
      data: [numOfBotStart]
    }
    ],
    options: {
      chart: {
        type: 'bar',
        height: 380,
        stacked: true,
      },
      plotOptions: {
        bar: {
          distributed: true,
          horizontal: true,
          dataLabels: {
            total: {
              enabled: true,
              offsetX: 0,
              style: {
                fontSize: '13px',
                fontWeight: 900
              }
            },
            position: 'bottom',
          }
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
        categories: [`CVR: ${numOfBotStart === 0 ? 0 :((Math.round(numOfConversion *100 / numOfBotStart)).toFixed(2))}%`],
        labels: {
          formatter: function (val) {
            return val
          }
        }
      },
      yaxis: {
        // labels: {
        //   show: false,
        // },
        categories: ['Total'],
      },
      title: {
        text: 'Custom DataLabels',
        align: 'center',
        floating: true,
      },
      subtitle: {
        text: 'Category Names as DataLabels inside bars',
        align: 'center',
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + "%"
          }
        }
      },
    },
  };
  // const [lineChartScenario, setLineChartScenario] = useState({
  //   series: [
  //     {
  //       name: 'TEAM A',
  //       type: 'area',
  //       data: [44, 55, 31, 47, 31, 43, 26, 41, 31, 47, 33],
  //     },
  //     {
  //       name: 'TEAM B',
  //       type: 'line',
  //       data: [55, 69, 45, 61, 43, 54, 37, 52, 44, 61, 43],
  //     },
  //     {
  //       name: 'TEAM C',
  //       type: 'line',
  //       data: [65, 29, 35, 61, 73, 44, 87, 42, 34, 91, 23],
  //     },
  //   ],
  //   options: {
  //     chart: {
  //       height: 350,
  //       width: '100%',
  //       type: 'line',
  //     },
  //     stroke: {
  //       curve: 'smooth',
  //     },
  //     fill: {
  //       type: 'solid',
  //       opacity: [0.35, 1],
  //     },
  //     labels: [
  //       'Dec 01',
  //       'Dec 02',
  //       'Dec 03',
  //       'Dec 04',
  //       'Dec 05',
  //       'Dec 06',
  //       'Dec 07',
  //       'Dec 08',
  //       'Dec 09 ',
  //       'Dec 10',
  //       'Dec 11',
  //     ],
  //     markers: {
  //       size: 0,
  //     },
  //     yaxis: [
  //       {
  //         title: {
  //           text: 'Series A',
  //         },
  //       },
  //       // {
  //       //   opposite: true,
  //       //   title: {
  //       //     text: 'Series B',
  //       //   },
  //       // },
  //     ],
  //     tooltip: {
  //       shared: true,
  //       intersect: false,
  //       y: {
  //         formatter: function (y) {
  //           if (typeof y !== 'undefined') {
  //             return y.toFixed(0) + ' points';
  //           }
  //           return y;
  //         },
  //       },
  //     },
  //   },
  // });

  const numOfConversionBotStart = {
    series: [
      {
        data: [numOfConversion, numOfBotStart],
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
        categories: ['Conversion', 'botStart'],
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      title: {
        text: 'Conversion / Bot start',
        align: 'center',
        floating: true,
      },
      subtitle: {
        text: 'Rate(Conversion / Bot start) inside bars',
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
  }

  

  // chart
  let devicePieChartConfig = {
    series: devicePieChartSeries,
    options: {
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: ['PC', 'SP', 'Tablet'],
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
  const [shortenedList, setShortenedList] = useState([]);

  useEffect(() => {
    setBotId(Cookies.get('bot_id'));
  }, []);

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

  // // get data device pie chart
  // useEffect(() => {
  //   api
  //     .get(`/api/v1/analytics/chatbot_counts/${botId}`)
  //     .then((res) => {
  //       console.log(res?.data?.data?.chatbot);
  //       let chatbotData = res?.data?.data?.chatbot;
  //       let chatbotValue = [
  //         chatbotData.num_of_pc_count,
  //         chatbotData.num_of_sp_count,
  //         chatbotData.num_of_tablet_count,
  //       ];
  //       setDevicePieChartSeries(chatbotValue);
  //     })
  //     .catch((err) => {
  //       if (err.response?.data.code === 0) {
  //         tokenExpired();
  //       }
  //     });
  // }, [botId]);

  //get All Scenarios
  useEffect(() => {
    api
      .get(`/api/v1/managements/chatbots/${botId}/all_scenarios`)
      .then((res) => {
        if (res.data.code === 1) {
          let dataScenario = res?.data?.data
          if (dataScenario != []) {
            api.get(`/api/v1/analytics/scenario_counts/${dataScenario[0].id}`).then(ress => {
              console.log('bot data: ', ress.data.data);
              setDataReportCount(ress?.data?.data)
              let chatbotData = ress?.data?.data
              let chatbotDataCount = [1,1,1]
              let chatbotValue = [
                chatbotData.pc_count,
                chatbotData.smartphone_count,
                chatbotData.tablet_count,
              ];
              if (chatbotData.pc_count == 0 &&
                chatbotData.pc_count == 0 &&
                chatbotData.pc_count == 0) {
                  chatbotValue = [1, 1, 1]
                // setDevicePieChartSeriesCount(chatbotDataCount)
              }
              // console.log(chatbotValue)
              let numOfCon = chatbotData.smartphone_count + chatbotData.pc_conversion_count + chatbotData.tablet_conversion_count
              setNumofConversion(numOfCon)
              let numOfBS = chatbotData.pc_open_chatbot_window_count + chatbotData.tablet_open_chatbot_window_count + chatbotData.smartphone_open_chatbot_window_count
              setNumofBotStart(numOfBS)
              let numOfOB = chatbotData.pc_count + chatbotData.tablet_count + chatbotData.smartphone_count
              setNumOfOpenBot(numOfOB)
              setDevicePieChartSeries(chatbotValue);
              setDevicePieChartSeriesCount(chatbotValue)
            }).catch(error => {
              console.log(error);
            })
          }

          setAllScenarios(dataScenario);
        }
      })
      .catch((err) => {
        if (err.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }, []);

  function validDateRange(start, end) {
    const errDate = document.getElementById('errDate');
    if (start > end) {
      errDate.style.display = 'block';
      errDate.innerHTML = 'Start date have to small than end date.';
    } else {
      errDate.style.display = 'none';
      errDate.innerHTML = '';
    }
  }

  function selectStartDate(date) {
    setStartDate(date);
    const start = parseInt(format(date, 'yyyy/MM/dd').replaceAll('/', ''));
    const end = parseInt(format(endDate, 'yyyy/MM/dd').replaceAll('/', ''));
    validDateRange(start, end);
  }

  function selectEndDate(date) {
    setEndDate(date);
    const start = parseInt(format(startDate, 'yyyy/MM/dd').replaceAll('/', ''));
    const end = parseInt(format(date, 'yyyy/MM/dd').replaceAll('/', ''));
    validDateRange(start, end);
  }

  function handleSearch(e) {
    e.preventDefault();
    const formSearch = document.getElementById('formSearch');
    console.log(formSearch.length);
    for (let i = 0; i < formSearch.length - 1; i++) {
      console.log(formSearch[i].value);
    }
  }

  function changeConversionRate() {
    // document.getElementById('conversion_rate').style.display = 'block'
    // document.getElementById('click_through_rate').style.display = 'none'


    // bart({
    //   series: [
    //     {
    //       data: [70, 95],
    //     },
    //   ],
    //   options: {
    //     chart: {
    //       type: 'bar',
    //       height: 380,
    //     },
    //     plotOptions: {
    //       bar: {
    //         barHeight: '100%',
    //         distributed: true,
    //         horizontal: true,
    //         dataLabels: {
    //           position: 'bottom',
    //         },
    //       },
    //     },
    //     colors: ['#33b2df', '#546E7A'],
    //     dataLabels: {
    //       enabled: true,
    //       textAnchor: 'start',
    //       style: {
    //         colors: ['#fff'],
    //       },
    //       formatter: function (val, opt) {
    //         return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val;
    //       },
    //       offsetX: 0,
    //       dropShadow: {
    //         enabled: true,
    //       },
    //     },
    //     stroke: {
    //       width: 1,
    //       colors: ['#fff'],
    //     },
    //     xaxis: {
    //       categories: ['South Korea', 'Canada'],
    //     },
    //     yaxis: {
    //       labels: {
    //         show: false,
    //       },
    //     },
    //     title: {
    //       text: 'Conversion rate',
    //       align: 'center',
    //       floating: true,
    //     },
    //     // subtitle: {
    //     //   text: 'Category Names as DataLabels inside bars',
    //     //   align: 'center',
    //     // },
    //     tooltip: {
    //       theme: 'dark',
    //       x: {
    //         show: false,
    //       },
    //       y: {
    //         title: {
    //           formatter: function () {
    //             return '';
    //           },
    //         },
    //       },
    //     },
    //   },
    // });
  }

  function changeClickConversionRate() {
    // document.getElementById('conversion_rate').style.display = 'none'
    // document.getElementById('click_through_rate').style.display = 'block'

    
    // setBarChart({
    //   series: [
    //     {
    //       data: [20, 85],
    //     },
    //   ],
    //   options: {
    //     chart: {
    //       type: 'bar',
    //       height: 380,
    //     },
    //     plotOptions: {
    //       bar: {
    //         barHeight: '100%',
    //         distributed: true,
    //         horizontal: true,
    //         dataLabels: {
    //           position: 'bottom',
    //         },
    //       },
    //     },
    //     colors: ['#33b2df', '#546E7A'],
    //     dataLabels: {
    //       enabled: true,
    //       textAnchor: 'start',
    //       style: {
    //         colors: ['#fff'],
    //       },
    //       formatter: function (val, opt) {
    //         return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val;
    //       },
    //       offsetX: 0,
    //       dropShadow: {
    //         enabled: true,
    //       },
    //     },
    //     stroke: {
    //       width: 1,
    //       colors: ['#fff'],
    //     },
    //     xaxis: {
    //       categories: ['Hien dang', 'no 50k'],
    //     },
    //     yaxis: {
    //       labels: {
    //         show: false,
    //       },
    //     },
    //     title: {
    //       text: 'Click Through Rate',
    //       align: 'center',
    //       floating: true,
    //     },
    //     // subtitle: {
    //     //   text: 'Category Names as DataLabels inside bars',
    //     //   align: 'center',
    //     // },
    //     tooltip: {
    //       theme: 'dark',
    //       x: {
    //         show: false,
    //       },
    //       y: {
    //         title: {
    //           formatter: function () {
    //             return '';
    //           },
    //         },
    //       },
    //     },
    //   },
    // });
  }

  return (
    <>
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>
                <div className="report">
                  <form id="formSearch" className="report__info">
                    <p className="report__group">Aggregation period:</p>
                    <div className="report__group">
                      <select className="report__group-select" name="" id="">
                        <option value="aggregation_period">Aggregation period</option>
                        <option value="the_day_before">The day before</option>
                        <option value="last_7_days">Last 7 days</option>
                        <option value="last_30_days">last 30 days</option>
                      </select>
                    </div>
                    <div className="report__group report-date">
                      <DatePicker
                        className="report__group-input"
                        id="startDate"
                        selected={startDate}
                        onChange={(date) => selectStartDate(date)}
                        dateFormat="yyyy/MM/dd"
                      />
                    </div>
                    <div className="report__group report-date">
                      <DatePicker
                        className="report__group-input"
                        id="endDate"
                        selected={endDate}
                        onChange={(date) => selectEndDate(date)}
                        dateFormat="yyyy/MM/dd"
                      />
                    </div>
                    <p className="report__group">device</p>
                    <div className="report__group">
                      <select className="report__group-select" name="" id="">
                        <option value="all">All</option>
                        <option value="computer">computer</option>
                        <option value="tablet">Tablet</option>
                        <option value="smartphone">Smart phone</option>
                      </select>
                    </div>
                    <p className="report__group">scenario</p>
                    <div className="report__group">
                      <select className="report__group-select" name="" id="">
                        {allScenarios.map((scenario, index) => (
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
                    <span id="errDate" className="err-date"></span>
                  </form>
                  <div className="report__download">
                    <button className="btn btn-primary">Input contents download</button>
                    <button className="btn btn-primary">download</button>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div className="report__body">
                  <div className="report__item">
                    <div className="report__item-head">
                      CONVERSION RATE (CVR) / CLICK-THROUGH RATE (CTR
                      <a href="">
                        <i className="far fa-question-circle"></i>
                      </a>
                    </div>
                    <div className="report__item-btn">
                      <button
                        className="btn btn-success"
                        id="btn_conversion_rate"
                        onClick={() => changeConversionRate()}
                      >
                        Conversion rate (CVR)
                      </button>
                      <button
                        className="btn btn-success"
                        id="btn_click_through_conversion_rate"
                        onClick={() => changeClickConversionRate()}
                      >
                        Click-through rate (CTR)
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
                      NUMBER OF CONVERSIONS / NUMBER OF BOT STARTS
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
                    <div className="report__item-head report__item-2-head">
                      CHANGE IN MONTHLY CONVERSIONS
                      <a href="">
                        <i className="far fa-question-circle"></i>
                      </a>
                      <Calendar
                        className="report__item-2-head-calender"
                        value={dateState}
                        onChange={(e) => {
                          setDateState(e);
                        }}
                      />
                    </div>
                  </div>

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

                  {/* <div className="report__item">
                    <div className="report__item-head">
                      CONTENT
                      <a href="">
                        <i className="far fa-question-circle"></i>
                      </a>
                      <div className="report__item-btn">
                        <button className="btn btn-success">start page</button>
                        <button className="btn btn-success">CV page</button>
                      </div>
                      <div className="report__item-content">
                        <Table>
                          <thead className="text-primary">
                            <tr>
                              <th style={{ width: '4%' }}>page</th>
                              <th style={{ width: '4%' }}> starting number</th>
                              <th style={{ width: '4%' }}>Number of CVs</th>
                              <th style={{ width: '4%' }}>Urls</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>sdsssd</tr>
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </div> */}

                  <div className="report__item report__item-2">
                    <div className="report__item-head report__item-2-head-main">
                      DEVICE
                      <a href="">
                        <i className="far fa-question-circle"></i>
                      </a>
                      {/* <div className="report__item-btn">
                        <button className="btn btn-success">number of bot starts</button>
                        <button className="btn btn-success">Conversions (CV)</button>
                      </div> */}
                      <div className="report__item-pie">
                        <ReactApexChart
                          options={devicePieChartConfig.options}
                          series={devicePieChartConfig.series}
                          type="pie"
                          height={350}
                        />
                      </div>
                    </div>
                    <div className="report__item-head report__item-2-head">
                      <div className="report__item-head report__item-2-head">
                        PC
                        <a href="">
                          <i className="far fa-question-circle"></i>
                        </a>
                        {devicePieChartSeriesCount[0] > 0 ? (
                          <div>{devicePieChartSeriesCount[0]}</div>
                        ) : (
                          <div>There's no data.</div>
                        )}
                      </div>
                      <div className="report__item-head report__item-2-head">
                        Smartphone
                        <a href="">
                          <i className="far fa-question-circle"></i>
                        </a>
                        {devicePieChartSeriesCount[1] > 0 ? (
                          <div>{devicePieChartSeriesCount[1]}</div>
                        ) : (
                          <div>There's no data.</div>
                        )}
                      </div>
                      <div className="report__item-head report__item-2-head">
                        Tablet
                        <a href="">
                          <i className="far fa-question-circle"></i>
                        </a>
                        {devicePieChartSeriesCount[2] > 0 ? (
                          <div>{devicePieChartSeriesCount[2]}</div>
                        ) : (
                          <div>There's no data.</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="report__item">
                    <div style={{ textAlign: 'center' }} className="report__item-head">
                      SHORTENED LINK CLICKS
                      <a href="">
                        <i className="far fa-question-circle"></i>
                      </a>
                      <div className="report__item-btn">
                        <button className="btn btn-success">start page</button>
                        <button className="btn btn-success">CV page</button>
                      </div>
                      <br />
                      <br />
                      <div className="report__item-content">
                        <Table bordered height="200" className="report__item-content--fix-table">
                          <thead className="text-primary">
                            <tr>
                              <th className="report__item-content-title" style={{ width: '5%' }}>
                                No
                              </th>
                              <th className="report__item-content-title" style={{ width: '15%' }}>
                                Number of click
                              </th>
                              <th className="report__item-content-title" style={{ width: '60%' }}>
                                Original URL
                              </th>
                              <th className="report__item-content-title" style={{ width: '20%' }}>
                                Url Shortening
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>ss</td>
                              <td>ss</td>
                              <td>ss</td>
                              <td>ss</td>
                            </tr>
                            <tr>
                              <td>ss</td>
                              <td>ss</td>
                              <td>ss</td>
                              <td>ss</td>
                            </tr>
                            <tr>
                              <td>ss</td>
                              <td>ss</td>
                              <td>ss</td>
                              <td>ss</td>
                            </tr>
                            <tr>
                              <td>ss</td>
                              <td>ss</td>
                              <td>ss</td>
                              <td>ss</td>
                            </tr>
                            <tr>
                              <td>ss</td>
                              <td>ss</td>
                              <td>ss</td>
                              <td>ss</td>
                            </tr>
                            <tr>
                              <td>ss</td>
                              <td>ss</td>
                              <td>ss</td>
                              <td>ss</td>
                            </tr>
                            <tr>
                              <td>ss</td>
                              <td>ss</td>
                              <td>ss</td>
                              <td>ss</td>
                            </tr>
                            <tr>
                              <td>ss</td>
                              <td>ss</td>
                              <td>ss</td>
                              <td>ss</td>
                            </tr>
                            <tr>
                              <td>ss</td>
                              <td>ss</td>
                              <td>ss</td>
                              <td>ss</td>
                            </tr>
                            <tr>
                              <td>ss</td>
                              <td>ss</td>
                              <td>ss</td>
                              <td>ss</td>
                            </tr>

                            <tr>
                              <td>ss</td>
                              <td>ss</td>
                              <td>ss</td>
                              <td>ss</td>
                            </tr>
                            {/* {shortenedList?.map((item, index) => (
                              <tr key={index}>
                                <th scope="row">{item.id}</th>
                                <td>{item.num_of_click}</td>
                                <td>{item.origin_url}</td>
                                <td>{item.shorten_code}</td>
                              </tr>
                            ))} */}
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
