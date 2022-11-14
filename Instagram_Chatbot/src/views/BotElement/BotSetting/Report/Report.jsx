import DatePicker from 'react-datepicker';
import React from 'react';
import { Card, CardHeader, CardBody, Table, Row, Col } from 'reactstrap';
import './../../../../assets/css/bot/report.css';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import ReactApexChart from 'react-apexcharts';

function Report() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [dateState, setDateState] = useState(new Date());
  const [barChart, setBarChart] = useState({

    series: [{
      data: [70, 95]
    }],
    options: {
      chart: {
        type: 'bar',
        height: 380
      },
      plotOptions: {
        bar: {
          barHeight: '100%',
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: 'bottom'
          },
        }
      },
      colors: ['#33b2df', '#546E7A'
      ],
      dataLabels: {
        enabled: true,
        textAnchor: 'start',
        style: {
          colors: ['#fff']
        },
        formatter: function (val, opt) {
          return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
        },
        offsetX: 0,
        dropShadow: {
          enabled: true
        }
      },
      stroke: {
        width: 1,
        colors: ['#fff']
      },
      xaxis: {
        categories: ['South Korea', 'Canada'
        ],
      },
      yaxis: {
        labels: {
          show: false
        }
      },
      title: {
        text: 'Custom DataLabels',
        align: 'center',
        floating: true
      },
      subtitle: {
        text: 'Category Names as DataLabels inside bars',
        align: 'center',
      },
      tooltip: {
        theme: 'dark',
        x: {
          show: false
        },
        y: {
          title: {
            formatter: function () {
              return ''
            }
          }
        }
      }
    }
  })

  const [lineChart, setLineChart] = useState({
    series: [{
      name: 'TEAM A',
      type: 'area',
      data: [44, 55, 31, 47, 31, 43, 26, 41, 31, 47, 33]
    }, {
      name: 'TEAM B',
      type: 'line',
      data: [55, 69, 45, 61, 43, 54, 37, 52, 44, 61, 43]
    },
    {
      name: 'TEAM C',
      type: 'line',
      data: [65, 29, 35, 61, 73, 44, 87, 42, 34, 91, 23]
    }],
    options: {
      chart: {
        height: 350,
        width: "100%",
        type: 'line',
      },
      stroke: {
        curve: 'smooth'
      },
      fill: {
        type: 'solid',
        opacity: [0.35, 1],
      },
      labels: ['Dec 01', 'Dec 02', 'Dec 03', 'Dec 04', 'Dec 05', 'Dec 06', 'Dec 07', 'Dec 08', 'Dec 09 ', 'Dec 10', 'Dec 11'],
      markers: {
        size: 0
      },
      yaxis: [
        {
          title: {
            text: 'Series A',
          },
        },
        {
          opposite: true,
          title: {
            text: 'Series B',
          },
        },
      ],
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return y.toFixed(0) + " points";
            }
            return y;
          }
        }

      }
    }

  }
  )
  const [lineChartScenario, setLineChartScenario] = useState({
    series: [{
      name: 'TEAM A',
      type: 'area',
      data: [44, 55, 31, 47, 31, 43, 26, 41, 31, 47, 33]
    }, {
      name: 'TEAM B',
      type: 'line',
      data: [55, 69, 45, 61, 43, 54, 37, 52, 44, 61, 43]
    },
    {
      name: 'TEAM C',
      type: 'line',
      data: [65, 29, 35, 61, 73, 44, 87, 42, 34, 91, 23]
    }],
    options: {
      chart: {
        height: 350,
        width: "100%",
        type: 'line',
      },
      stroke: {
        curve: 'smooth'
      },
      fill: {
        type:'solid',
        opacity: [0.35, 1],
      },
      labels: ['Dec 01', 'Dec 02','Dec 03','Dec 04','Dec 05','Dec 06','Dec 07','Dec 08','Dec 09 ','Dec 10','Dec 11'],
      markers: {
        size: 0
      },
      yaxis: [
        {
          title: {
            text: 'Series A',
          },
        },
        // {
        //   opposite: true,
        //   title: {
        //     text: 'Series B',
        //   },
        // },
      ],
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (y) {
            if(typeof y !== "undefined") {
              return  y.toFixed(0) + " points";
            }
            return y;
          }
        }
      
    }
    }
  
  }
  )

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
    setBarChart(
      {

        series: [{
          data: [70, 95]
        }],
        options: {
          chart: {
            type: 'bar',
            height: 380
          },
          plotOptions: {
            bar: {
              barHeight: '100%',
              distributed: true,
              horizontal: true,
              dataLabels: {
                position: 'bottom'
              },
            }
          },
          colors: ['#33b2df', '#546E7A'
          ],
          dataLabels: {
            enabled: true,
            textAnchor: 'start',
            style: {
              colors: ['#fff']
            },
            formatter: function (val, opt) {
              return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
            },
            offsetX: 0,
            dropShadow: {
              enabled: true
            }
          },
          stroke: {
            width: 1,
            colors: ['#fff']
          },
          xaxis: {
            categories: ['South Korea', 'Canada'
            ],
          },
          yaxis: {
            labels: {
              show: false
            }
          },
          title: {
            text: 'Conversion rate',
            align: 'center',
            floating: true
          },
          // subtitle: {
          //   text: 'Category Names as DataLabels inside bars',
          //   align: 'center',
          // },
          tooltip: {
            theme: 'dark',
            x: {
              show: false
            },
            y: {
              title: {
                formatter: function () {
                  return ''
                }
              }
            }
          }
        }
      }
    )
  }

  function changeClickConversionRate() {
    // document.getElementById('conversion_rate').style.display = 'none'
    // document.getElementById('click_through_rate').style.display = 'block'
    setBarChart(
      {

        series: [{
          data: [20, 85]
        }],
        options: {
          chart: {
            type: 'bar',
            height: 380
          },
          plotOptions: {
            bar: {
              barHeight: '100%',
              distributed: true,
              horizontal: true,
              dataLabels: {
                position: 'bottom'
              },
            }
          },
          colors: ['#33b2df', '#546E7A'
          ],
          dataLabels: {
            enabled: true,
            textAnchor: 'start',
            style: {
              colors: ['#fff']
            },
            formatter: function (val, opt) {
              return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
            },
            offsetX: 0,
            dropShadow: {
              enabled: true
            }
          },
          stroke: {
            width: 1,
            colors: ['#fff']
          },
          xaxis: {
            categories: ['Hien dang', 'no 50k'
            ],
          },
          yaxis: {
            labels: {
              show: false
            }
          },
          title: {
            text: 'Click Through Rate',
            align: 'center',
            floating: true
          },
          // subtitle: {
          //   text: 'Category Names as DataLabels inside bars',
          //   align: 'center',
          // },
          tooltip: {
            theme: 'dark',
            x: {
              show: false
            },
            y: {
              title: {
                formatter: function () {
                  return ''
                }
              }
            }
          }
        }
      }
    )
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
                      <select name="" id="">
                        <option value="qqq">Aggregation period</option>
                        <option value="">The day before</option>
                        <option value="">Last 7 days</option>
                        <option value="">last 30 days</option>
                      </select>
                    </div>
                    <div className="report__group report-date">
                      <DatePicker
                        id="startDate"
                        selected={startDate}
                        onChange={(date) => selectStartDate(date)}
                        dateFormat="yyyy/MM/dd"
                      />
                    </div>
                    <div className="report__group report-date">
                      <DatePicker
                        id="endDate"
                        selected={endDate}
                        onChange={(date) => selectEndDate(date)}
                        dateFormat="yyyy/MM/dd"
                      />
                    </div>
                    <p className="report__group">device</p>
                    <div className="report__group">
                      <select name="" id="">
                        <option value="qqqwe">All</option>
                        <option value="">computer</option>
                        <option value="">Tablet</option>
                        <option value="">Smart phone</option>
                      </select>
                    </div>
                    <p className="report__group">scenario</p>
                    <div className="report__group">
                      <select name="" id="">
                        <option value="dddd">BOB scenario</option>
                        <option value="">Test1</option>
                        <option value="">Test2</option>
                      </select>
                    </div>
                    <div className="report__group">
                      <button className="btn btn-primary" onClick={(e) => handleSearch(e)}>
                        <i class="fa fa-search" aria-hidden="true"></i>
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
                        <i class="far fa-question-circle"></i>
                      </a>
                    </div>
                    <div className="report__item-btn">
                      <button className="btn btn-success"
                        id='btn_conversion_rate'
                        onClick={() => changeConversionRate()}>
                        Conversion rate (CVR)</button>
                      <button className="btn btn-success"
                        id='btn_click_through_conversion_rate'
                        onClick={() => changeClickConversionRate()}>Click-through rate (CTR)</button>
                    </div>
                    <div id='conversion_rate' className="report__item-chart">
                      <ReactApexChart options={barChart.options} series={barChart.series} type="bar" height={350} />

                    </div>
                    {/* <div id='click_through_rate' className="report__item-chart" style={{ display: 'none' }}>
                      <ReactApexChart options={barChart.options} series={barChart.series} type="bar" height={350} />

                    </div> */}
                  </div>

                  <div className="report__item report__item-2">
                    <div className="report__item-head report__item-2-head-main">
                      NUMBER OF CONVERSIONS / NUMBER OF BOT STARTS
                      <a href="">
                        <i class="far fa-question-circle"></i>
                      </a>
                      <ReactApexChart options={lineChart.options} series={lineChart.series} type="line" height={350} />
                    </div>
                    <div className="report__item-head report__item-2-head">
                      CHANGE IN MONTHLY CONVERSIONS
                      <a href="">
                        <i class="far fa-question-circle"></i>
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

                  <div className="report__item">
                    <div className="report__item-head">
                      SCENARIO TRANSITION
                      <a href="">
                        <i class="far fa-question-circle"></i>
                      </a>
                      <div className="report__item-btn">
                        <button className="btn btn-success">Overall Scenario Transition</button>
                        <button className="btn btn-success">Scenario trends for each item</button>
                      </div>
                      <div className="report__item-content">
                        <ReactApexChart options={lineChartScenario.options} series={lineChart.series} type="line" height={350} />
                      </div>
                    </div>
                  </div>

                  <div className="report__item">
                    <div className="report__item-head">
                      CONTENT
                      <a href="">
                        <i class="far fa-question-circle"></i>
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
                  </div>

                  <div className="report__item report__item-2">
                    <div className="report__item-head report__item-2-head-main">
                      AREA
                      <a href="">
                        <i class="far fa-question-circle"></i>
                      </a>
                      <div className="report__item-btn">
                        <button className="btn btn-success">number of bot starts</button>
                        <button className="btn btn-success">Conversions (CV)</button>
                      </div>
                    </div>
                    <div className="report__item-head report__item-2-head">
                    <div className="report__item-head report__item-2-head">
                      DEVICE
                      <a href="">
                        <i class="far fa-question-circle"></i>
                      </a>
                      <div>
                        There's no data.
                      </div>
                    </div>
                    <div className="report__item-head report__item-2-head">
                      DEVICE
                      <a href="">
                        <i class="far fa-question-circle"></i>
                      </a>
                      <div>
                        There's no data.
                      </div>
                    </div>
                    <div className="report__item-head report__item-2-head">
                      DEVICE
                      <a href="">
                        <i class="far fa-question-circle"></i>
                      </a>
                      <div>
                        There's no data.
                      </div>
                    </div>
                    </div>
                  </div>

                  <div className="report__item">
                    <div style={{textAlign: 'center'}} className="report__item-head">
                    SHORTENED LINK CLICKS
                      {/* <a href="">
                        <i class="far fa-question-circle"></i>
                      </a> */}
                      {/* <div className="report__item-btn">
                        <button className="btn btn-success">start page</button>
                        <button className="btn btn-success">CV page</button>
                      </div> */}
                      <br /><br />
                      <div className="report__item-content">
                        <Table>
                          <thead className="text-primary">
                            <tr>
                              <th style={{ width: '5%' }}>No</th>
                              <th style={{ width: '15%' }}>Number of click</th>
                              <th style={{ width: '60%' }}>Original URL</th>
                              <th style={{ width: '20%' }}>Url Shortening</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>sdsssd</tr>
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
