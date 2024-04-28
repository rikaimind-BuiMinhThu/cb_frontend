
import React, { useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Card, CardHeader, CardBody, CardFooter, CardTitle, Row, Col } from 'reactstrap';
import Cookies from 'js-cookie';
import {
  dashboard24HoursPerformanceChart,
  dashboardEmailStatisticsChart,
  dashboardNASDAQChart,
} from 'variables/charts.js';
import ReactApexChart from 'react-apexcharts';
import api from '../api/api-management';
import { tokenExpired } from 'api/tokenExpired';

function Dashboard() {
  const [monthECUDisplay, setMonthECUDisplay] = useState(['1', '2', '3', '4']);
  const [monthInstaUser, setMonthInstaUser] = useState([]);

  const [dateECU, setDateECU] = useState([]);
  const [userECC, setUserECC] = useState([]);
  const [messageEC, setMessageEC] = useState([]);
  const [userChatwithCB, setUserChatwithCB] = useState([]);
  const [userChatwithCBAll, setUserChatwithCBAll] = useState();
  const [userTotal, setUserTotal] = useState();
  const [isAdminDeel, setIsAdminDeel] = useState(false);
  const [lineDataWithoutRole, setLineDataWithoutRole] = useState([]);
  // const client = JSON.parse(sessionStorage.getItem('client'));
  const client = JSON.parse(sessionStorage.getItem('client'));

  React.useEffect(() => {
    var cook = Cookies.get('user_role');
    if (cook === 'admin_deel') {
      setIsAdminDeel(true);
    }
    if(cook !== "admin_deel"){
      document.getElementById('client_management').style.display = 'none'
      document.getElementById('user_management').style.display = 'none'
    }else{
      document.getElementById('client_management').style.display = 'block'
      document.getElementById('user_management').style.display = 'block'
    }
    console.log("cook: ", cook)
  }, []);

  React.useEffect(() => {
    console.log('token in dashboard', Cookies.get('token'));
  }, []);
  // React.useEffect(() => {
  //   console.log('token in dashboard', Cookies.get('token'))
  //   if(Cookies.get('token') == undefined){
  //     window.location.href ='/'
  //   }
  // }, [])
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
    var path = window.location.pathname;
    let dateStart = new Date();
    let dateEnd = new Date();
    dateStart = dateStart.setDate(dateEnd.getDate() - 15);
    dateStart = new Date(dateStart);
    dateStart = dateStart.toISOString().slice(0, 10);
    let month = dateEnd.toISOString().slice(5, 7) - 1;
    dateEnd = dateEnd.toISOString().slice(0, 10);
    api
      .get(`/api/v1/analytics/chatbot_usages/user?begin_date=${dateStart}&end_date=${dateEnd}`)
      .then((res) => {
        // console.log('user EC: ', res.data.counts);
        var useEC = res.data.counts;
        var dateEC = [];
        var user_count = [];
        for (var i = 0; i < useEC?.length; i++) {
          // useEC[i].log_date.slice(0,5)
          // dateEC.push(useEC[i].log_date.slice(0, 5));
          dateEC.push(`${useEC[i].log_date.slice(3, 5)}/${useEC[i].log_date.slice(0, 2)}`);
          user_count.push(useEC[i].user_count);
        }
        setDateECU(dateEC);
        setUserECC(user_count);
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired()
        }
      });
    ////////////////////////////////////////////////
    api
      .get(`/api/v1/analytics/chatbot_usages/message?begin_date=${dateStart}&end_date=${dateEnd}`)
      .then((res) => {
        // console.log('message EC: ', res.data.counts);
        var messageECA = res.data.counts;
        var message_count = [];
        for (var i = 0; i < messageECA?.length; i++) {
          message_count.push(messageECA[i].message_count);
        }
        setMessageEC(message_count);
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired()
        }
      });
    ///////////////////////////////////////////////
    api
      .get(`/api/v1/analytics/users?begin_date=${dateStart}&end_date=${dateEnd}`)
      .then((res) => {
        setLineDataWithoutRole(res.data?.user_counts?.map((user) => user.user_count));
        var useEC = res.data.user_counts;
        var user_count_all = 0;
        for (var i = 0; i < useEC?.length; i++) {
          user_count_all = user_count_all + useEC[i].user_count;
        }
        setUserChatwithCB(user_count_all);
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired()
        }
      });
    ///////////////////////////////////////////////
    api
      .get(
        `/api/v1/analytics/users?begin_date=${dateStart.slice(0, 5)}${
          Math.abs(month - 6)
        }-15&end_date=${dateEnd}`
      )
      .then((res) => {
        var useEC = res.data.user_counts;
        var user_count_alltime = 0;
        for (var i = 0; i < useEC?.length; i++) {
          user_count_alltime = user_count_alltime + useEC[i].user_count;
        }
        setUserChatwithCBAll(user_count_alltime);
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired()
        }
      });
  }, []);

  var dataAPC = {
    series: [
      {
        name: isAdminDeel ? 'Ec chatbotユーザー' : '新規ユーザー',
        type: 'area',
        data: isAdminDeel ? userECC : lineDataWithoutRole,
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
            text: isAdminDeel ? 'Ec chatbotユーザー' : '新規ユーザー',
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

  return (
    <>
      <div className="content">
        <Row>
          <Col lg="3" md="6" sm="6" id='client_management'>
            <a href="/admin/client-management">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="3" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-badge text-warning" />
                      </div>
                    </Col>
                    <Col md="9" xs="7">
                      <div className="numbers">
                        <CardTitle tag="p" style={{ fontSize: '23px' }}>
                          クライアント管理
                        </CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats"></div>
                </CardFooter>
              </Card>
            </a>
          </Col>
          <Col lg="3" md="6" sm="6" id='user_management'>
            <a href="/admin/user-management">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="3" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-circle-10 text-success" />
                      </div>
                    </Col>
                    <Col md="9" xs="7">
                      <div className="numbers">
                        <CardTitle tag="p" style={{ fontSize: '23px' }}>
                          ユーザー管理
                        </CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats"></div>
                </CardFooter>
              </Card>
            </a>
          </Col>
          <Col lg="3" md="6" sm="6">
          {client?.is_instagram ? (<a href="/admin/keyword">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-key-25 text-danger" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <CardTitle tag="p" style={{ fontSize: '23px' }}>
                          キーワード設定
                        </CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats"></div>
                </CardFooter>
              </Card>
            </a>) : ('')}
          </Col>
          <Col lg="3" md="6" sm="6">
          {client?.is_instagram ? (<a href="/admin/chatbot">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-atom text-primary" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <CardTitle tag="p" style={{ fontSize: '23px' }}>
                          チャットボット
                        </CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats"></div>
                </CardFooter>
              </Card>
            </a>) : ('')}
          </Col>
        </Row>
        <Row>
          <Col md="12">
            {client?.is_instagram ? (<Card>
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
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fa fa-history" /> Updated 3 minutes ago
                </div>
              </CardFooter>
            </Card>) : ('')}
          </Col>
        </Row>
        <Row>
          {/* <Col md="4">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Email Statistics</CardTitle>
                <p className="card-category">Last Campaign Performance</p>
              </CardHeader>
              <CardBody style={{ height: "266px" }}>
                <Pie
                  data={dashboardEmailStatisticsChart.data}
                  options={dashboardEmailStatisticsChart.options}
                />
              </CardBody>
              <CardFooter>
                <div className="legend">
                  <i className="fa fa-circle text-primary" /> Opened{" "}
                  <i className="fa fa-circle text-warning" /> Read{" "}
                  <i className="fa fa-circle text-danger" /> Deleted{" "}
                  <i className="fa fa-circle text-gray" /> Unopened
                </div>
                <hr />
                <div className="stats">
                  <i className="fa fa-calendar" /> Number of emails sent
                </div>
              </CardFooter>
            </Card>
          </Col> */}
          {/* <Col md="8">
            <Card className="card-chart">
              <CardHeader>
                <CardTitle tag="h5">NASDAQ: AAPL</CardTitle>
                <p className="card-category">Line Chart with Points</p>
              </CardHeader>
              <CardBody>
                <Line
                  data={dashboardNASDAQChart.data}
                  options={dashboardNASDAQChart.options}
                  width={400}
                  height={100}
                />
              </CardBody>
              <CardFooter>
                <div className="chart-legend">
                  <i className="fa fa-circle text-info" /> Tesla Model S{" "}
                  <i className="fa fa-circle text-warning" /> BMW 5 Series
                </div>
                <hr />
                <div className="card-stats">
                  <i className="fa fa-check" /> Data information certified
                </div>
              </CardFooter>
            </Card>
          </Col> */}
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
