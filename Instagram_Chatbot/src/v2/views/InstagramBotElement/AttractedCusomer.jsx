import React, { useEffect, useState } from 'react';
import { Card, CardBody, Row, Col, Table } from 'reactstrap';
import ReactApexChart from 'react-apexcharts';
import api from './../../api/api-management';
import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ja from "date-fns/locale/ja";
import * as utils from '../../JS/client.js';
import { tokenExpired } from 'v2/api/tokenExpired';
registerLocale("ja", ja);

function AttractedCustomer() {
  // states
  const [startChatbotIn, setStartChatbotIn] = useState([]);
  const [dmData, setDmData] = useState({
    totalUser: 0,
    totalMessages: 0,
    totalPurchase: 0,
  });
  const [scData, setScData] = useState({
    totalUser: 0,
    totalMessages: 0,
    totalPurchase: 0,
  });
  const [lcData, setLcData] = useState({
    totalUser: 0,
    totalMessages: 0,
    totalPurchase: 0,
  });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [userECC, setUserECC] = useState([]);
  const [dataECU, setDataECU] = useState([]);
  const [CVAL, setCVAL] = useState({});
  React.useEffect(() => {
    api.get('/api/v1/instagram_users/conversions').then((res) => {
      // console.log('res CV: ', res.data.data);
      setCVAL(res.data.data);
    });
  }, []);

  // mounted
  useEffect(() => {
    api
      .get('/api/v1/managements/instagram_users')
      .then((res) => {
        const dataStartChatbotIn = res.data?.data?.instagram_users;
        let dmCount = 0;
        let scCount = 0;
        let lcCount = 0;
        let dmMessageSent = 0;
        let scMessageSent = 0;
        let lcMessageSent = 0;
        let dmPurchaseCount = 0;
        let scPurchaseCount = 0;
        let lcPurchaseCount = 0;

        if (dataStartChatbotIn) {
          for (let i = 0; i < dataStartChatbotIn.length; i++) {
            if (dataStartChatbotIn[i].start_chatbot_in === 'dm') {
              dmCount++;
              dmMessageSent += dataStartChatbotIn[i].num_of_messages_sent;
              dmPurchaseCount += dataStartChatbotIn[i].num_of_conversions;
            } else if (dataStartChatbotIn[i].start_chatbot_in === 'story_comment') {
              scCount++;
              scMessageSent += dataStartChatbotIn[i].num_of_messages_sent;
              scPurchaseCount += dataStartChatbotIn[i].num_of_conversions;
            } else {
              lcCount++;
              lcMessageSent += dataStartChatbotIn[i].num_of_messages_sent;
              lcPurchaseCount += dataStartChatbotIn[i].num_of_conversions;
            }
          }
          setStartChatbotIn([dmCount, scCount, lcCount]);
          setDmData((prev) => {
            return {
              ...prev,
              totalUser: dmCount,
              totalMessages: dmMessageSent,
              totalPurchase: dmPurchaseCount,
            };
          });
          setScData((prev) => {
            return {
              ...prev,
              totalUser: scCount,
              totalMessages: scMessageSent,
              totalPurchase: scPurchaseCount,
            };
          });
          setLcData((prev) => {
            return {
              ...prev,
              totalUser: lcCount,
              totalMessages: lcMessageSent,
              totalPurchase: lcPurchaseCount,
            };
          });
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired()
        }
      });
  }, []);

  useEffect(() => {
    setStartDate((prev) => {
      let date = new Date(prev.setMonth(prev.getMonth() - 1));
      date = date.setDate(15);
      return new Date(date);
    });
  }, []);

  useEffect(() => {
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

  useEffect(() => {
    let dateStart = new Date();
    dateStart = dateStart.setMonth(dateStart.getMonth() - 1);
    dateStart = new Date(dateStart);
    dateStart = dateStart.toISOString().slice(0, 10);
    let dateEnd = new Date();
    let month = dateEnd.toISOString().slice(5, 7) - 1;
    dateEnd = dateEnd.toISOString().slice(0, 10);
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
        let useEC = res.data.counts;
        let dataEC = [];
        let user_count = [];
        for (let i = 0; i < useEC.length; i++) {
          // dataEC.push(useEC[i].log_date.slice(0, 5));
          dataEC.push(`${useEC[i].log_date.slice(3, 5)}/${useEC[i].log_date.slice(0, 2)}`);
          user_count.push(useEC[i].user_count);
        }
        setDataECU(dataEC);
        setUserECC(user_count);
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired()
        }
      });
  }, []);

  // data pie chart
  let dataPie = {
    series: startChatbotIn,
    options: {
      chart: {
        width: 400,
        type: 'pie',
      },
      labels: ['DM', 'ストーリー', 'ライブ'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 500,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    },
  };

  // data line chart
  let dataLine = {
    series: [
      {
        name: 'Ec chatbotユーザー',
        type: 'area',
        data: userECC,
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
        opacity: 0,
      },
      xaxis: {
        categories: dataECU,
      },
      markers: {
        size: 0,
      },
      yaxis: [
        {
          title: {
            text: '',
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

  // select date end on change
  const selectDateEnd = (value) => {
    setEndDate(value);
    let startD = startDate.toISOString().slice(0, 10);
    let endD = value.toISOString().slice(0, 10);
    if (utils.checkDateEnd(startD, endD) === true) {
      const datePickerInputs = document.querySelectorAll(
        '.react-datepicker__input-container > input'
      );
      datePickerInputs[1].style.borderColor = '#51cbce';
      api
        .get(`/api/v1/analytics/chatbot_usages/user?begin_date=${startD}&end_date=${endD}`)
        .then((res) => {
          let useEC = res.data.counts;
          let dataEC = [];
          let user_count = [];
          for (let i = 0; i < useEC.length; i++) {
            // dataEC.push(useEC[i].log_date.slice(0, 5));
            dataEC.push(`${useEC[i].log_date.slice(3, 5)}/${useEC[i].log_date.slice(0, 2)}`);
            user_count.push(useEC[i].user_count);
          }
          setDataECU(dataEC);
          setUserECC(user_count);
        })
        .catch((error) => {
          console.log(error);
          if (error.response?.data.code === 0) {
            tokenExpired()
          }
        });
    } else {
      const datePickerInputs = document.querySelectorAll(
        '.react-datepicker__input-container > input'
      );
      datePickerInputs[1].style.borderColor = 'red';
      utils.checkDateEnd(startD, endD);
    }
  };

  // select date start
  const selectDateStart = (value) => {
    setStartDate(value);
    let startD = value.toISOString().slice(0, 10);
    let endD = endDate.toISOString().slice(0, 10);
    if (utils.checkDateEnd(startD, endD) === true) {
      const datePickerInputs = document.querySelectorAll(
        '.react-datepicker__input-container > input'
      );
      datePickerInputs[0].style.borderColor = '#51cbce';
      api
        .get(`/api/v1/analytics/chatbot_usages/user?begin_date=${startD}&end_date=${endD}`)
        .then((res) => {
          let useEC = res.data.counts;
          let dataEC = [];
          let user_count = [];
          for (let i = 0; i < useEC.length; i++) {
            // dataEC.push(useEC[i].log_date.slice(0, 5));
            dataEC.push(`${useEC[i].log_date.slice(3, 5)}/${useEC[i].log_date.slice(0, 2)}`);
            user_count.push(useEC[i].user_count);
          }
          setDataECU(dataEC);
          setUserECC(user_count);
        })
        .catch((error) => {
          console.log(error);
          if (error.response?.data.code === 0) {
            tokenExpired()
          }
        });
    } else {
      const datePickerInputs = document.querySelectorAll(
        '.react-datepicker__input-container > input'
      );
      datePickerInputs[0].style.borderColor = 'red';
      utils.checkDateEnd(startD, endD);
    }
  };

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            {/* select time */}
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'end',
                flexDirection: 'column',
                position: 'relative',
                minHeight: '50px',
                marginBottom: '10px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  // position: 'absolute',
                  zIndex: '15',
                }}
              >
                <div style={{ padding: '5px' }}>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => selectDateStart(date)}
                    dateFormat="yyyy/MM/dd"
                    locale='ja'
                  />
                </div>
                <div style={{ padding: '5px' }}>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => selectDateEnd(date)}
                    dateFormat="yyyy/MM/dd"
                    locale='ja'
                  />
                </div>
                {/* <select
                  style={{
                    padding: '5px 10px 5px 10px',
                    border: 'none',
                    borderRadius: '7.5px',
                    backgroundColor: '#64cbcb',
                    color: '#FFFFFF',
                    fontWeight: '800',
                  }}
                  defaultValue={'5d'}
                  name="days_num_ec_cb"
                  id="days_num_ec_cb"
                  onChange={(e) => selectDate(e.target.value)}
                >
                  <option value="5d">５日間</option>
                  <option value="10d">10日間</option>
                  <option value="15d">15日間</option>
                  <option value="30d">30日間</option>
                  <option value="3m">3月間</option>
                  <option value="6m">6月間</option>
                </select> */}
              </div>
              <span id="dateCheckErrMsg" style={{ color: 'red', display: 'none' }}></span>
            </div>

            {/* Charts view */}
            <Card>
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <CardBody style={{ width: '33.33333%' }}>
                  <div style={{ width: '100%' }}>
                    <div style={{ width: '100%', textAlign: 'center' }}>
                      <h3>流入元</h3>
                    </div>
                    <div style={{ paddingTop: '10%' }}>
                      <div
                        style={{
                          width: '100%',
                          margin: 'auto',
                          height: '100%',
                          // padding: '20% 0% 15% 0%',
                        }}
                      >
                        <ReactApexChart
                          options={dataPie.options}
                          series={dataPie.series}
                          type="pie"
                          width={350}
                        />
                      </div>
                    </div>
                  </div>
                </CardBody>

                <CardBody style={{ width: '66.66666%' }}>
                  <div style={{ width: '100%', textAlign: 'center' }}>
                    <h3>EC Chatbotユーザー</h3>
                  </div>
                  <ReactApexChart
                    options={dataLine.options}
                    series={dataLine.series}
                    type="line"
                    height={350}
                  />
                </CardBody>
              </div>
            </Card>

            {/* Table data */}
            <Card>
              <div>
                <CardBody>
                  <Table>
                    <thead>
                      <tr>
                        <th>タイトル</th>
                        <th>ユーザー数</th>
                        <th>メッセージ数</th>
                        <th>平均メッセージ数</th>
                        <th>コンバージョン数</th>
                        <th>コンバージョン率</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ overflow: 'hidden', height: '14px' }}>
                        <td>DM</td>
                        {/* <td>{dmData.totalUser}</td> */}
                        <td>{CVAL.dm_instagram_user_count}</td>
                        {/* <td>{dmData.totalMessages}</td> */}
                        <td>{CVAL.dm_instagram_message_count}</td>
                        <td>
                          {/* {dmData.totalUser !== 0
                            ? (dmData.totalMessages / dmData.totalUser).toFixed(
                              2
                            )
                            : 0} */}
                          {CVAL.dm_instagram_user_count !== 0
                            ? (
                              CVAL.dm_instagram_message_count / CVAL.dm_instagram_user_count
                            ).toFixed(2)
                            : 0}
                        </td>
                        {/* <td>{dmData.totalPurchase}</td> */}
                        <td>{CVAL.dm_conversion_count}</td>
                        <td>
                          {CVAL.dm_instagram_message_count !== 0
                            ? (CVAL.dm_conversion_count / CVAL.dm_instagram_message_count).toFixed(
                              2
                            )
                            : `0.00`}
                          %
                        </td>
                      </tr>
                      <tr style={{ overflow: 'hidden', height: '14px' }}>
                        <td>ストーリー</td>
                        {/* <td>{scData.totalUser}</td> */}
                        <td>{CVAL.story_instagram_user_count}</td>
                        {/* <td>{scData.totalMessages}</td> */}
                        <td>{CVAL.story_instagram_message_count}</td>
                        <td>
                          {/* {scData.totalUser !== 0
                            ? (scData.totalMessages / scData.totalUser).toFixed(
                              2
                            )
                            : 0} */}
                          {CVAL.story_instagram_user_count !== 0
                            ? (
                              CVAL.story_instagram_message_count / CVAL.story_instagram_user_count
                            ).toFixed(2)
                            : 0}
                        </td>
                        {/* <td>{scData.totalPurchase}</td> */}
                        <td>{CVAL.story_conversion_count}</td>
                        <td>
                          {CVAL.story_instagram_message_count !== 0
                            ? (
                              CVAL.story_conversion_count / CVAL.story_instagram_message_count
                            ).toFixed(2)
                            : `0.00`}
                          %
                        </td>
                      </tr>
                      <tr style={{ overflow: 'hidden', height: '14px' }}>
                        <td>ライブ</td>
                        {/* <td>{lcData.totalUser}</td> */}
                        <td>{CVAL.live_instagram_user_count}</td>
                        {/* <td>{lcData.totalMessages}</td> */}
                        <td>{CVAL.live_instagram_message_count}</td>
                        <td>
                          {/* {CVAL.live_instagram_user_count !== 0
                            ? CVAL.live_instagram_message_count / CVAL.live_instagram_user_count
                            : 0} */}
                          {CVAL.live_instagram_user_count !== 0
                            ? CVAL.live_instagram_message_count / CVAL.live_instagram_user_count
                            : 0}
                        </td>
                        {/* <td>{lcData.totalPurchase}</td> */}
                        <td>{CVAL.live_conversion_count}</td>
                        <td>
                          {/* {lcData.totalMessages !== 0
                            ? (
                              lcData.totalPurchase / lcData.totalMessages
                            ).toFixed(2)
                            : `0.00`} */}
                          {CVAL.live_instagram_message_count !== 0
                            ? (
                              CVAL.live_conversion_count / CVAL.live_instagram_message_count
                            ).toFixed(2)
                            : `0.00`}
                          %
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </CardBody>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default AttractedCustomer;
