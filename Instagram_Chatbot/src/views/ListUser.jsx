import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
// import { Chart as ChartJS, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import CanvasJSReact from '../components/canvasjs-3.6.6/canvasjs.react';
import { VictoryPie } from 'victory-pie';
import ReactApexChart from 'react-apexcharts';
// var CanvasJS = CanvasJSReact.CanvasJS;
// var CanvasJSChart = CanvasJSReact.CanvasJSChart;
// ChartJS.register(...registerables)
import '../assets/css/general.css';
// import { AgChartsReact } from "ag-charts-react";
import api from '../api/api-management';
import { Icon } from 'semantic-ui-react';
import { MDBIcon } from 'mdbreact';
import { CSVLink } from 'react-csv';
import Cookies from 'js-cookie';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
function ListUser() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [dateECU, setDateECU] = useState([]);
  const [userECC, setUserECC] = useState([]);
  const [messageEC, setMessageEC] = useState([]);
  const [messageECA, setMessageECA] = useState();
  const [messageECAll, setMessageECAll] = useState();
  const [userChatwithCB, setUserChatwithCB] = useState([]);
  const [userChatwithCBAll, setUserChatwithCBAll] = useState();
  const [userCB, setUserCB] = useState();
  const [userCBAll, setUserCBAll] = useState();
  const [instaUser, setInstaUser] = useState([]);

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
    // var date = new Date();
    // var startD = date.toISOString().slice(0, 10);
    // console.log(startD);
    // console.log(typeof startD);
    // var month = date.toISOString().slice(5, 7) - 1;
    let dateStart = new Date();
    dateStart = dateStart.setMonth(dateStart.getMonth() - 1);
    dateStart = new Date(dateStart);
    dateStart = dateStart.toISOString().slice(0, 10);
    let dateEnd = new Date();
    let month = dateEnd.toISOString().slice(5, 7) - 1;
    dateEnd = dateEnd.toISOString().slice(0, 10);
    // console.log(dateStart, dateEnd, month);
    if (month < 10) {
      month = `0${month}`;
    }
    api
      .get(
        `/api/v1/analytics/chatbot_usages/user?begin_date=${dateStart.slice(
          0,
          5
        )}${month}-15&end_date=${dateEnd}`
      )
      .then((res) => {
        // console.log('user EC: ', res.data.counts);
        var useEC = res.data.counts;
        var dateEC = [];
        var user_count = [];
        var totalEC = 0;
        for (var i = 0; i < useEC.length; i++) {
          // useEC[i].log_date.slice(0,5)
          // dateEC.push(useEC[i].log_date.slice(0, 5));
          dateEC.push(`${useEC[i].log_date.slice(3, 5)}/${useEC[i].log_date.slice(0, 2)}`);
          user_count.push(useEC[i].user_count);
          totalEC = totalEC + useEC[i].user_count;
        }
        setDateECU(dateEC);
        setUserECC(user_count);
        // console.log('totalEC: ', totalEC);
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
        // console.log('message EC: ', res.data.counts);
        var messageECA = res.data.counts;
        var message_count = [];
        var totalM = 0;
        for (var i = 0; i < messageECA.length; i++) {
          message_count.push(messageECA[i].message_count);
          totalM = totalM + messageECA[i].message_count;
        }
        setMessageEC(message_count);
        setMessageECA(totalM);
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
        // console.log('message EC: ', res.data.counts);
        var messageECA = res.data.counts;
        var message_count = 0;
        for (var i = 0; i < messageECA.length; i++) {
          message_count = message_count + messageECA[i].message_count;
        }
        setMessageECAll(message_count);
      })
      .catch((error) => {
        console.log(error);
      });
    ///////////////////////////////////////////////
    api
      .get(
        `/api/v1/analytics/users?begin_date=${dateStart.slice(0, 5)}${month}-15&end_date=${dateEnd}`
      )
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
    ///////////////////////////////////////////////
    api
      .get(
        `/api/v1/analytics/users?begin_date=${dateStart.slice(0, 5)}${
          month - 6
        }-15&end_date=${dateEnd}`
      )
      .then((res) => {
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

    ///////////////////////////////////////////////
    api
      .get(
        `/api/v1/analytics/chatbot_usages/user?begin_date=${dateStart.slice(0, 5)}${
          month - 6
        }-15&end_date=${dateEnd}`
      )
      .then((res) => {
        var useEC = res.data.counts;
        var user_count_alltime = 0;
        for (var i = 0; i < useEC.length; i++) {
          user_count_alltime = user_count_alltime + useEC[i].user_count;
        }
        setUserCBAll(user_count_alltime / useEC.length);
        // console.log('analytics/users: ', user_count_alltime / useEC.length);
      })
      .catch((error) => {
        console.log(error);
      });
    ///////////////////////////////////////////////
    api
      .get(
        `/api/v1/analytics/chatbot_usages/user?begin_date=${dateStart.slice(
          0,
          5
        )}${month}-15&end_date=${dateEnd}`
      )
      .then((res) => {
        var useEC = res.data.counts;
        var user_count_alltime = 0;
        for (var i = 0; i < useEC.length; i++) {
          user_count_alltime = user_count_alltime + useEC[i].user_count;
        }
        setUserCB(user_count_alltime / useEC.length);
      })
      .catch((error) => {
        console.log(error);
      });

    ///////////////////////////////////////////////
    api
      .get(`/api/v1/managements/instagram_users`)
      .then((res) => {
        // console.log("insta user: ", res.data.data.instagram_users)
        setInstaUser(res.data.data.instagram_users);
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

  var percentNew = (userChatwithCB / userChatwithCBAll) * 100;
  var percentold = ((userChatwithCBAll - userChatwithCB) / userChatwithCBAll) * 100;

  var percentECnew = (Math.abs(userCB - userCBAll) / userCBAll) * 100;
  var percentECold = (userCB / userCBAll) * 100;

  // console.log('percentECnew: ', percentECnew);

  const options = {
    data: [
      {
        label: 'Users use chatbot',
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

  var datas = {
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

  const options2 = {
    data: [
      {
        label: 'Users in EC',
        value: percentECold,
      },
      {
        label: 'New users',
        value: percentECnew,
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

  function selectDateEnd(end) {
    setEndDate(end);
    var startD = startDate.toISOString().slice(0, 10);
    var endD = end.toISOString().slice(0, 10);
    api
      .get(`/api/v1/analytics/chatbot_usages/user?begin_date=${startD}&end_date=${endD}`)
      .then((res) => {
        var useEC = res.data.counts;
        var dateEC = [];
        var user_count = [];
        for (var i = 0; i < useEC.length; i++) {
          // useEC[i].log_date.slice(0,5)
          // if (value == "3m" || value == "6m") {
          //     dateEC.push(useEC[i].log_date.slice(0, 7))
          // } else {
          // dateEC.push(useEC[i].log_date.slice(0, 5));
          // }
          dateEC.push(`${useEC[i].log_date.slice(3, 5)}/${useEC[i].log_date.slice(0, 2)}`);
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
      .get(`/api/v1/analytics/chatbot_usages/message?begin_date=${startD}&end_date=${endD}`)
      .then((res) => {
        var messageECA = res.data.counts;
        var message_count = [];
        var totalM = 0;
        for (var i = 0; i < messageECA.length; i++) {
          message_count.push(messageECA[i].message_count);
          totalM = totalM + messageECA[i].message_count;
        }
        setMessageEC(message_count);
        setMessageECA(totalM);
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
    ///////////////////////////////////////////////
    api
      .get(`/api/v1/analytics/chatbot_usages/user?begin_date=${startD}&end_date=${endD}`)
      .then((res) => {
        var useEC = res.data.counts;
        var user_count_alltime = 0;
        for (var i = 0; i < useEC.length; i++) {
          user_count_alltime = user_count_alltime + useEC[i].user_count;
        }
        setUserCB(user_count_alltime / useEC.length);
        // console.log('analytics/users: ', user_count_alltime / useEC.length);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  var datass = {
    series: [percentECold, percentECnew],
    options: {
      chart: {
        width: 400,
        type: 'pie',
      },
      labels: ['ECユーザー', '新規ユーザー'],
      responsive: [
        {
          breakpoint: undefined,
          options: {
            chart: {
              width: 450,
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

  var totalMessage = messageECAll;
  var kj = messageECAll - messageECA;
  var percentChangeMSG;
  if (kj == 0) {
    percentChangeMSG = 0;
  } else {
    percentChangeMSG = (messageECA / (messageECAll - messageECA)) * 100;
  }

  // window.dispatchEvent(new Event('resize'));

  const headers = [
    { label: 'ユーザー名', key: 'username' },
    { label: '名前', key: 'full_name' },
    { label: 'フォロワー数', key: 'follower_count' },
    { label: 'インスタグラムID', key: 'instagram_id' },
    {
      label: 'インスタグラムアカウントをフォローしているか',
      key: 'is_user_follow_business',
    },
    { label: 'ユーザーをフォローしているか', key: 'is_business_follow_user' },
    { label: '作成日', key: 'created_at' },
  ];

  const [dataEx, setDataEx] = useState([]);
  function setDataExport() {
    var data = [];
    var datae = instaUser;
    datae.forEach((it) => {
      data.push({
        username: it.username,
        full_name: it.full_name,
        follower_count: it.follower_count,
        instagram_id: it.instagram_id,
        is_user_follow_business: it.is_user_follow_business,
        is_business_follow_user: it.is_business_follow_user,
        created_at: it.created_at.slice(0, 19).replaceAll('-', '/').replaceAll('T', ' '),
      });
      for (var i = 1; i < it.length; i++) {
        const cm_live = it[i];
        data.push({
          username: cm_live.username,
          full_name: cm_live.full_name,
          follower_count: cm_live.follower_count,
          instagram_id: cm_live.instagram_id,
          is_user_follow_business: cm_live.is_user_follow_business,
          is_business_follow_user: cm_live.is_business_follow_user,
          created_at: cm_live.created_at.slice(0, 19).replaceAll('-', '/').replaceAll('T', ' '),
          // })
        });
      }
    });
    // console.log(data);
    // var datae = [item]
    setDataEx(data);
  }

  const csvReport = {
    data: dataEx,
    headers: headers,
    filename: 'Listusers.csv',
  };

  // select date start
  const selectDateStart = (start) => {
    setStartDate(start);
    var startD = start.toISOString().slice(0, 10);
    var endD = endDate.toISOString().slice(0, 10);
    api
      .get(`/api/v1/analytics/chatbot_usages/user?begin_date=${startD}&end_date=${endD}`)
      .then((res) => {
        var useEC = res.data.counts;
        var dateEC = [];
        var user_count = [];
        for (var i = 0; i < useEC.length; i++) {
          // useEC[i].log_date.slice(0,5)
          // if (value == "3m" || value == "6m") {
          //     dateEC.push(useEC[i].log_date.slice(0, 7))
          // } else {
          // dateEC.push(useEC[i].log_date.slice(0, 5));
          // }
          dateEC.push(`${useEC[i].log_date.slice(3, 5)}/${useEC[i].log_date.slice(0, 2)}`);
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
      .get(`/api/v1/analytics/chatbot_usages/message?begin_date=${startD}&end_date=${endD}`)
      .then((res) => {
        var messageECA = res.data.counts;
        var message_count = [];
        var totalM = 0;
        for (var i = 0; i < messageECA.length; i++) {
          message_count.push(messageECA[i].message_count);
          totalM = totalM + messageECA[i].message_count;
        }
        setMessageEC(message_count);
        setMessageECA(totalM);
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
    ///////////////////////////////////////////////
    api
      .get(`/api/v1/analytics/chatbot_usages/user?begin_date=${startD}&end_date=${endD}`)
      .then((res) => {
        var useEC = res.data.counts;
        var user_count_alltime = 0;
        for (var i = 0; i < useEC.length; i++) {
          user_count_alltime = user_count_alltime + useEC[i].user_count;
        }
        setUserCB(user_count_alltime / useEC.length);
        // console.log('analytics/users: ', user_count_alltime / useEC.length);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card style={{ width: '100%' }}>
              <div style={{ width: '100%', padding: '5px 20px 0px 20px' }}>
                <div style={{ float: 'right', display: 'flex' }}>
                  <div
                    onClick={() => setDataExport()}
                    style={{
                      padding: '5px 10px 5px 10px',
                      border: 'none',
                      borderRadius: '7.5px',
                      backgroundColor: '#64cbcb',
                      color: '#FFFFFF',
                      fontWeight: '800',
                      marginRight: '10px',
                    }}
                  >
                    <CSVLink {...csvReport}>
                      <span style={{ color: 'white' }}>インスタグラムユーザー出力</span>{' '}
                      <MDBIcon fas icon="arrow-circle-down" style={{ color: 'white' }}></MDBIcon>
                    </CSVLink>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <div style={{ borderRadius: '5px', padding: '5px' }}>
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => selectDateStart(date)}
                        dateFormat="yyyy/MM/dd"
                      />
                    </div>
                    <div style={{ borderRadius: '5px', padding: '5px' }}>
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => selectDateEnd(date)}
                        dateFormat="yyyy/MM/dd"
                      />
                    </div>
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
              <div style={{ display: 'flex', width: '100%' }}>
                <CardBody style={{ width: '50%' }}>
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
                </CardBody>
                <CardBody style={{ width: '24%', marginLeft: '-3.5%' }}>
                  <div style={{ width: '100%' }}>
                    <div style={{ paddingTop: '10%' }}>
                      <div
                        style={{
                          width: '100%',
                          margin: 'auto',
                          height: '100%',
                          padding: '20% 0% 15% 0%',
                        }}
                      >
                        {/* <AgChartsReact options={options} /> */}
                        <ReactApexChart
                          options={datas.options}
                          series={datas.series}
                          type="pie"
                          width={350}
                        />
                      </div>
                    </div>
                  </div>
                </CardBody>
                <CardBody style={{ width: '24%', marginLeft: '-6%' }}>
                  <div style={{ width: '100%' }}>
                    <div style={{ paddingTop: '10%' }}>
                      <div
                        style={{
                          width: '100%',
                          margin: 'auto',
                          height: '100%',
                          padding: '20% 0% 15% 0%',
                        }}
                      >
                        {/* <AgChartsReact options={options} /> */}
                        <ReactApexChart
                          options={datass.options}
                          series={datass.series}
                          type="pie"
                          width={350}
                        />
                      </div>
                    </div>
                  </div>
                </CardBody>
              </div>
            </Card>
            <Card>
              <CardBody>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ width: '50%' }}>
                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        textAlign: 'center',
                      }}
                    >
                      <h5 style={{ margin: 'auto' }}>
                        {totalMessage} &emsp;
                        <MDBIcon fas icon="angle-up" style={{ color: '#00e396' }} />
                        &ensp;
                        <span style={{ fontSize: '19px', color: '#00e396' }}>
                          {parseFloat(percentChangeMSG).toFixed(1)}%
                        </span>
                      </h5>
                    </div>
                    <div>
                      <h6>メッセージ数</h6>
                    </div>
                  </div>
                  <div style={{ width: '50%' }}>
                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        textAlign: 'center',
                      }}
                    >
                      <h5 style={{ margin: 'auto' }}>
                        {percentECold.toFixed(2)} &emsp;
                        <MDBIcon fas icon="angle-up" style={{ color: '#00e396' }} />
                        &ensp;
                        <span style={{ fontSize: '19px', color: '#00e396' }}>
                          {parseFloat((percentECnew / (percentECold + percentECnew)) * 100).toFixed(
                            1
                          )}
                          %
                        </span>
                      </h5>
                    </div>
                    <div>
                      <h6>ユーザー数</h6>
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

export default ListUser;
