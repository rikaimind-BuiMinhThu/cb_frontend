import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Row, Col, Table } from 'reactstrap';
// import { Chart as ChartJS, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import CanvasJSReact from '../components/canvasjs-3.6.6/canvasjs.react';
import { VictoryPie } from 'victory-pie';
// import { AgChartsReact } from "ag-charts-react";
import api from '../api/api-management';
import ReactApexChart from 'react-apexcharts';
import '../assets/css/general.css';
import { CSVLink } from 'react-csv';
import { MDBIcon } from 'mdbreact';
import Cookies from 'js-cookie';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import requestNewToken from 'api/request-new-token';
// const categories = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

function DataAnalyst() {
  const [monthECUDisplay, setMonthECUDisplay] = useState(['1', '2', '3', '4']);
  const [monthInstaUser, setMonthInstaUser] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [dateECU, setDateECU] = useState([]);
  const [userECC, setUserECC] = useState([]);
  const [messageEC, setMessageEC] = useState([]);
  const [userChatwithCB, setUserChatwithCB] = useState([]);
  const [userChatwithCBAll, setUserChatwithCBAll] = useState();
  const [userTotal, setUserTotal] = useState();
  const [listGroup, setListGroup] = useState([]);

  React.useEffect(() => {
    console.log('token in dashboard', Cookies.get('token'));
    console.log('is_auth', Cookies.get('is_auth'));
    if (
      Cookies.get('token') == undefined ||
      Cookies.get('token') == null ||
      Cookies.get('token') == ''
    ) {
      window.location.href = '/';
    }
    if (Cookies.get('is_auth') == 'false') {
      window.location.href = '/';
    }
  }, []);

  React.useEffect(() => {
    let dateStart = new Date();
    dateStart = dateStart.setMonth(dateStart.getMonth() - 1);
    dateStart = new Date(dateStart);
    dateStart = dateStart.toISOString().slice(0, 10);
    let dateEnd = new Date();
    let month = dateEnd.toISOString().slice(5, 7) - 1;
    dateEnd = dateEnd.toISOString().slice(0, 10);
    console.log(dateStart, dateEnd, month);
    if (month < 10) {
      month = `0${month}`;
    }
    // ?begin_date=${startD}&end_date=${date.toISOString().slice(0, 5)}${month}-01
    api
      .get(
        `/api/v1/analytics/chatbot_usages/user?begin_date=${dateStart.slice(
          0,
          5
        )}${month}-15&end_date=${dateEnd}`
      )
      .then((res) => {
        console.log('user EC: ', res.data.counts);
        var useEC = res.data.counts;
        var dateEC = [];
        var user_count = [];
        for (var i = 0; i < useEC.length; i++) {
          // useEC[i].log_date.slice(0,5)
          dateEC.push(
            `${useEC[i].log_date.slice(3, 5)}/${useEC[i].log_date.slice(0, 2)}`
          );
          user_count.push(useEC[i].user_count);
        }
        setDateECU(dateEC);
        setUserECC(user_count);
      })
      .catch((error) => {
        console.log(error);
      });

    ////////////////////////////////////////////////
    api
      .get(
        `/api/v1/analytics/chatbot_usages/message?begin_date=${dateStart.slice(
          0,
          5
        )}${month}-15&end_date=${dateEnd}`
      )
      .then((res) => {
        console.log('message EC: ', res.data.counts);
        var messageECA = res.data.counts;
        var message_count = [];
        for (var i = 0; i < messageECA.length; i++) {
          message_count.push(messageECA[i].message_count);
        }
        setMessageEC(message_count);
      })
      .catch((error) => {
        console.log(error);
      });
    ///////////////////////////////////////////////
    api
      .get(
        `/api/v1/analytics/users?begin_date=${dateStart.slice(
          0,
          5
        )}${month}-15&end_date=${dateEnd}`
      )
      .then((res) => {
        console.log(res.data.user_counts);
        var useEC = res.data.user_counts;
        var user_count_all = 0;
        for (var i = 0; i < useEC.length; i++) {
          user_count_all = user_count_all + useEC[i].user_count;
        }
        setUserChatwithCB(user_count_all);
      })
      .catch((error) => {
        console.log(error);
      });
    ///////////////////////////////////////////////
    api
      .get(
        `/api/v1/analytics/users?begin_date=${dateStart.slice(0, 5)}${
          month - 6
        }-15&end_date=${dateEnd}`
      )
      .then((res) => {
        console.log(res.data);
        var useEC = res.data.user_counts;
        var user_count_alltime = 0;
        for (var i = 0; i < useEC.length; i++) {
          user_count_alltime = user_count_alltime + useEC[i].user_count;
        }
        setUserChatwithCBAll(user_count_alltime);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  React.useEffect(() => {
    setStartDate((prev) => {
      let date = new Date(prev.setMonth(prev.getMonth() - 1));
      date = date.setDate(15);
      return new Date(date);
    });
  }, []);

  React.useEffect(() => {
    const datePickerInputs = document.querySelectorAll(
      '.react-datepicker__input-container > input'
    );
    datePickerInputs[0].style.padding = '2px 6px';
    datePickerInputs[0].style.borderColor = '#51cbce';
    datePickerInputs[0].style.borderRadius = '5px';
    datePickerInputs[1].style.padding = '2px 6px';
    datePickerInputs[1].style.borderColor = '#51cbce';
    datePickerInputs[1].style.borderRadius = '5px';
  }, []);

  // get list message groups
  React.useEffect(() => {
    var path = window.location.pathname;
    api
      .get(`/api/v1/message_managements/message_groups`)
      .then((res) => {
        console.log('message groups: ', res.data.data);
        setListGroup(res.data.data);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.code === 3) {
          requestNewToken(path);
        }
      });
  }, []);

  const [liveData, setLiveData] = useState([]);
  React.useEffect(() => {
    let dateStart = new Date();
    dateStart = dateStart.setMonth(dateStart.getMonth() - 1);
    dateStart = new Date(dateStart);
    var month = dateStart.toISOString().slice(5, 7) - 6;
    if (month < 10) {
      month = `0${month}`;
    }else if(month <=0){
      month = "01"
    }
    // alert()
    api
      .get(
        `/api/v1/analytics/chatbot_usages/live?begin_date=${dateStart
          .toISOString()
          .slice(0, 5)}${month}-15&end_date=${dateStart
          .toISOString()
          .slice(0, 10)}`
      )
      .then((res) => {
        console.log('live analytics: ', res.data.live_usages);
        setLiveData(res.data.live_usages);
      })
      .catch((error) => {
        console.log(error);
        // if (error.response.data.code === 3) {
        //     requestNewToken(path)
        // }
      });
  }, []);

  var percentNew = (userChatwithCB / userChatwithCBAll) * 100;
  var percentold =
    ((userChatwithCBAll - userChatwithCB) / userChatwithCBAll) * 100;

  const options = {
    data: [
      {
        label: 'Users in EC',
        value: percentold,
      },
      {
        label: 'New users',
        value: percentNew,
      },
    ],
    series: [
      {
        type: 'pie',
        angleKey: 'value',
        labelKey: 'label',
        fills: ['#6ab04c', '#7ed6df'],
        strokes: ['#4a7b35', '#58969c'],
      },
    ],

    legend: {
      enabled: false,
    },
  };

  const datas = {
    series: [percentold, percentNew],
    options: {
      chart: {
        width: 400,
        type: 'pie',
      },
      labels: ['リピーター', '新規ユーザー'],
      responsive: [
        {
          breakpoint: undefined,
          options: {
            chart: {
              width: 500,
            },
            labels: {
              position: 'bottom',
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    },
  };

  // function seachInstaUser() {
  //   var startDate = document.getElementById(`startDate_Insta`).value
  //   var endDate = document.getElementById(`endDate_Insta`).value
  //   var start_year = startDate.slice(0, 4)
  //   var end_year = endDate.slice(0, 4)
  //   var start_month = startDate.slice(5, 7)
  //   var end_month = endDate.slice(5, 7)
  //   var start = (12 * parseInt(start_year)) + parseInt(start_month)
  //   var end = (12 * parseInt(end_year)) + parseInt(end_month)
  //   var month = (end - start)
  //   var monthIn = parseInt(start_month)
  //   var monthDisplay = []
  //   for (var i = 0; i < month; i++) {
  //     monthIn = monthIn + 1
  //     if (monthIn > 12) {
  //       monthDisplay.push((monthIn - 12).toString())
  //     } else {
  //       monthDisplay.push(monthIn.toString())
  //     }
  //   }
  //   setMonthInstaUser(monthDisplay)
  //   api.get(`/api/v1/analytics/users?from_date=${startDate} 12:00:00&to_date=${endDate} 12:00:00`).then(res => {
  //     console.log("analytics insta: ", res.data.user_counts)

  //   }).catch(error => {
  //     console.log(error)
  //     // if (error.response.data.code === 3) {
  //     //     requestNewToken(path)
  //     // }
  //   })
  // }

  var dataAPC = {
    series: [
      {
        name: 'Ec chatbotユーザー',
        type: 'area',
        data: userECC,
      },
      {
        name: '送信したメッセージ数',
        type: 'line',
        data: messageEC,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: 'line',
      },
      stroke: {
        curve: 'smooth',
      },
      fill: {
        type: 'solid',
        opacity: [0.35, 1],
      },
      labels: dateECU,
      markers: {
        size: 0,
      },
      yaxis: [
        {
          title: {
            text: 'Ec chatbotユーザー',
          },
        },
        {
          opposite: true,
          title: {
            text: '送信したメッセージ数',
          },
        },
      ],
      tooltip: {
        shared: true,
        intersect: false,
        enabled: false,
        enabledOnSeries: undefined,
        followCursor: false,
        inverseOrder: false,
        custom: undefined,
        fillSeriesColor: false,
        theme: false,
        y: {
          formatter: function (y) {
            if (typeof y !== 'undefined') {
              return y.toFixed(0) + '';
            }
            return y;
          },
        },
      },
    },
  };

  function selectDate(end) {
    setEndDate(end);
    var startD = startDate.toISOString().slice(0, 10);
    var endD = end.toISOString().slice(0, 10);
    api
      .get(
        `/api/v1/analytics/chatbot_usages/user?begin_date=${startD}&end_date=${endD}`
      )
      .then((res) => {
        console.log(res.data.counts);
        var useEC = res.data.counts;
        var dateEC = [];
        var user_count = [];
        for (var i = 0; i < useEC.length; i++) {
          // useEC[i].log_date.slice(0,5)

          // dateEC.push(useEC[i].log_date.slice(0, 5));
          dateEC.push(
            `${useEC[i].log_date.slice(3, 5)}/${useEC[i].log_date.slice(0, 2)}`
          );
          user_count.push(useEC[i].user_count);
        }
        setDateECU(dateEC);
        setUserECC(user_count);
      })
      .catch((error) => {
        console.log(error);
      });
    ////////////////////////////////////////////////
    api
      .get(
        `/api/v1/analytics/chatbot_usages/message?begin_date=${startD}&end_date=${endD}`
      )
      .then((res) => {
        console.log('message: ', res.data.counts);
        var messageECA = res.data.counts;
        var message_count = [];
        for (var i = 0; i < messageECA.length; i++) {
          message_count.push(messageECA[i].message_count);
        }
        setMessageEC(message_count);
      })
      .catch((error) => {
        console.log(error);
      });
    ///////////////////////////////////////////////
    api
      .get(`/api/v1/analytics/users?begin_date=${startD}&end_date=${endD}`)
      .then((res) => {
        var useEC = res.data.user_counts;
        var user_count_all = 0;
        for (var i = 0; i < useEC.length; i++) {
          user_count_all = user_count_all + useEC[i].user_count;
        }
        setUserChatwithCB(user_count_all);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const headers = [
    { label: 'ライブ開始日', key: 'media_start_at' },
    { label: 'ユーザー数', key: 'user_count' },
    { label: 'コメント数', key: 'comment_count' },
    { label: 'ユーザーコメント', key: 'user_comment' },
    { label: 'ライブコメント', key: 'comment_lives' },
    { label: 'コメント時間', key: 'time_comment' },
  ];

  const [dataEx, setDataEx] = useState([]);
  function setDataExport(item) {
    var data = [];
    var datae = [item];
    datae.forEach((it) => {
      data.push({
        media_start_at: it.media_start_at,
        user_count: it.user_count,
        comment_count: it.comment_count,
        user_comment: it.comment_lives[0].full_name,
        comment_lives: it.comment_lives[0].content,
        time_comment: it.comment_lives[0].created_at
          .slice(0, 19)
          .replaceAll('-', '/')
          .replaceAll('T', ' '),
      });
      for (var i = 1; i < it.comment_lives.length; i++) {
        const cm_live = it.comment_lives[i];
        data.push({
          media_start_at: '',
          user_count: '',
          comment_count: '',
          user_comment: cm_live.full_name,
          comment_lives: cm_live.content,
          time_comment: cm_live.created_at
            .slice(0, 19)
            .replaceAll('-', '/')
            .replaceAll('T', ' '),
          // })
        });
      }
    });
    console.log(data);
    // var datae = [item]
    setDataEx(data);
  }

  const csvReport = {
    data: dataEx,
    headers: headers,
    filename: 'Livestream.csv',
  };

  // export message group data
  const csvMessageGroupReport = {
    data: [],
    headers: [],
    filename: 'message-group.csv',
  };

  const setMessageGroupDataExport = (item) => {
    console.log(item);
  };

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardBody>
                <div style={{ display: 'flex' }}>
                  <div style={{ width: '70%' }}>
                    <CardBody>
                      <div style={{ width: '100%', textAlign: 'center' }}>
                        <h3>概要</h3>
                      </div>
                      <div style={{ display: 'flex', width: '100%' }}></div>
                      <ReactApexChart
                        options={dataAPC.options}
                        series={dataAPC.series}
                        type="line"
                        height={350}
                      />
                    </CardBody>
                  </div>
                  <div style={{ width: '30%', marginLeft: '-5%' }}>
                    <div
                      style={{
                        width: '80%',
                        margin: 'auto',
                        height: '100%',
                        padding: '30% 0% 15% 0%',
                      }}
                    >
                      {/* <AgChartsReact options={options} /> */}
                      <ReactApexChart
                        options={datas.options}
                        series={datas.series}
                        type="pie"
                        width={380}
                      />
                    </div>
                  </div>
                </div>
                <div style={{ width: '100%' }}>
                  <div style={{ float: 'right', display: 'flex' }}>
                    <div style={{ borderRadius: '5px', padding: '5px' }}>
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="yyyy/MM/dd"
                      />
                    </div>
                    <div style={{ borderRadius: '5px', padding: '5px' }}>
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => selectDate(date)}
                        dateFormat="yyyy/MM/dd"
                      />
                    </div>
                    {/* <select onChange={(e) => selectDate(e.target.value)} style={{ padding: "5px 10px 5px 10px", border: "none", borderRadius: "7.5px", backgroundColor: "#64cbcb", color: "#FFFFFF", fontWeight: "800" }} defaultValue={"5d"} name="days_num_ec_cb" id="days_num_ec_cb">
                      <option value="5d">５日間</option>
                      <option value="10d">10日間</option>
                      <option value="15d">15日間</option>
                      <option value="30d">30日間</option>
                      <option value="3m">3月間</option>
                      <option value="6m">6月間</option>
                    </select> */}
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <div>
                  <div style={{ width: '100%' }}>
                    <CardBody>
                      {/* <Line
                        data={data}
                        style={{ maxHeight: "315px", backgroundColor: "#ffffff" }}></Line> */}
                      <div>
                        <Table
                          style={{
                            textAlign: 'center',
                            tableLayout: 'fixed',
                            overflow: 'hidden',
                          }}
                        >
                          <thead className="text-primary">
                            <tr>
                              <td>
                                <h6>ライブ日</h6>
                              </td>
                              <td>
                                <h6>コメントしたユーザー数</h6>
                              </td>
                              <td>
                                <h6>コメント数</h6>
                              </td>
                              <td>
                                <h6>ダウンロード</h6>
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            {liveData &&
                              liveData.map((item) => (
                                <tr
                                  key={item.media_start_at}
                                  style={{ overflow: 'hidden', height: '14px' }}
                                >
                                  <td>{item.media_start_at.slice(0, 10)}</td>
                                  <td>{item.user_count}</td>
                                  <td>{item.comment_count}</td>
                                  <td>
                                    <span onClick={() => setDataExport(item)}>
                                      <CSVLink {...csvReport}>
                                        <MDBIcon
                                          fas
                                          icon="arrow-circle-down"
                                          style={{ color: '#51cbce' }}
                                        ></MDBIcon>
                                      </CSVLink>
                                    </span>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </Table>
                      </div>
                    </CardBody>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* message groups */}
            {/* <Card>
              <CardBody>
                <div
                  style={{
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  <h3>Message Groups</h3>
                </div>
                <div style={{ width: '100%' }}>
                  <Table
                    style={{
                      textAlign: 'center',
                      tableLayout: 'fixed',
                      overflow: 'hidden',
                    }}
                  >
                    <thead className="text-primary">
                      <tr>
                        <td>
                          <h6>Group name</h6>
                        </td>
                        <td>
                          <h6>Created/Updated date</h6>
                        </td>
                        <td>
                          <h6>Total user</h6>
                        </td>
                        <td>
                          <h6>Answer results</h6>
                        </td>
                        <td>
                          <h6>CSV download</h6>
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      {listGroup.map((item) => (
                        <tr
                          key={item?.id}
                          style={{ overflow: 'hidden', height: '14px' }}
                        >
                          <td>{item?.group_name}</td>
                          <td>{item?.updated_at?.slice(0, 10)}</td>
                          <td>???</td>
                          <td>???</td>
                          <td>
                            <span
                              onClick={() => setMessageGroupDataExport(item)}
                            >
                              <CSVLink {...csvMessageGroupReport}>
                                <MDBIcon
                                  fas
                                  icon="arrow-circle-down"
                                  style={{ color: '#51cbce' }}
                                ></MDBIcon>
                              </CSVLink>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card> */}
          </Col>
        </Row>
      </div>
    </>
  );
}

export default DataAnalyst;
