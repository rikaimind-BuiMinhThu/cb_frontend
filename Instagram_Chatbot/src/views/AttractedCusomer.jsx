import React, { useEffect, useState } from 'react';
import { Card, CardBody, Row, Col, Table } from 'reactstrap';
import ReactApexChart from 'react-apexcharts';
import api from '../api/api-management';

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

  // mounted
  useEffect(() => {
    api
      .get('/api/v1/managements/instagram_users')
      .then((res) => {
        console.log('Data: ', res.data?.data?.instagram_users);
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
            } else if (
              dataStartChatbotIn[i].start_chatbot_in === 'story_comment'
            ) {
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
      labels: ['Direct message', 'Story comment', 'Live comment'],
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

  // data line chart
  let dataLine = {
    series: [
      {
        name: 'Ec chatbotユーザー',
        type: 'area',
        data: [1, 2, 3, 4, 5, 6, 7],
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
      labels: [1, 2, 3, 4, 5, 6, 7],
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

  // select date on change
  const selectDate = (value) => {
    console.log(value);
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
                justifyContent: 'flex-end',
                paddingBottom: '10px',
              }}
            >
              <div>
                <select
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
                </select>
              </div>
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
                      <h3>Source</h3>
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
                    <h3>Title</h3>
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
                        <th>Title</th>
                        <th>Total user</th>
                        <th>Total message</th>
                        <th>Avg message</th>
                        <th>Is purchase</th>
                        <th>Percent</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ overflow: 'hidden', height: '14px' }}>
                        <td>Direct message</td>
                        <td>{dmData.totalUser}</td>
                        <td>{dmData.totalMessages}</td>
                        <td>
                          {dmData.totalUser !== 0
                            ? dmData.totalMessages / dmData.totalUser
                            : 0}
                        </td>
                        <td>{dmData.totalPurchase}</td>
                        <td>1</td>
                      </tr>
                      <tr style={{ overflow: 'hidden', height: '14px' }}>
                        <td>Story comment</td>
                        <td>{scData.totalUser}</td>
                        <td>{scData.totalMessages}</td>
                        <td>
                          {scData.totalUser !== 0
                            ? scData.totalMessages / scData.totalUser
                            : 0}
                        </td>
                        <td>{scData.totalPurchase}</td>
                        <td>1</td>
                      </tr>
                      <tr style={{ overflow: 'hidden', height: '14px' }}>
                        <td>Live comment</td>
                        <td>{lcData.totalUser}</td>
                        <td>{lcData.totalMessages}</td>
                        <td>
                          {lcData.totalUser !== 0
                            ? lcData.totalMessages / lcData.totalUser
                            : 0}
                        </td>
                        <td>{lcData.totalPurchase}</td>
                        <td>1</td>
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
