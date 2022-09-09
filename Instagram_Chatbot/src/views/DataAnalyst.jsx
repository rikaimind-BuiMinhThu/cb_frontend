import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Row, Col, Table, Button } from 'reactstrap';
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
import * as utils from './../JS/client.js';
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
  const [userRole, setUserRole] = useState(false);

  React.useEffect(() => {
    var cook = Cookies.get('user_role');
    if (cook === 'admin_deel') {
      setUserRole(true);
    }
  }, []);

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

  var testMsgEx = [
    {
      id: 1,
      instagram_id: '5105085919538441',
      username: 'linhvu9740',
      full_name: 'Linh Vu',
      follower_count: 0,
      is_verified_user: null,
      is_user_follow_business: true,
      is_business_follow_user: false,
      instagram_account_id: 1,
      created_at: '2022-07-31T09:58:36.678Z',
      updated_at: '2022-08-26T17:34:21.215Z',
      pending_message_id: null,
      email: 'Hha@gmail.com',
      phone_number: '03111111111',
      real_name: 'Haha',
      company_name: 'haha@gmail.com',
      company_role: null,
      website: null,
      propose: null,
      know_product_in: null,
      status: 'completion',
      start_chatbot_in: 'dm',
      start_chatbot_at: '2022-08-15T17:55:49.293Z',
      chatbot_usages: [
        {
          id: 24591,
          usage_type: 'dm_received',
          content: 'Kaka',
          media_id: '',
          media_start_at: null,
          instagram_account_id: 1,
          created_at: '2022-08-26T16:57:23.874Z',
          updated_at: '2022-08-26T16:57:23.874Z',
          instagram_user_id: 1,
        },
        {
          id: 24592,
          usage_type: 'dm_sent',
          content: 'ssd',
          media_id: null,
          media_start_at: null,
          instagram_account_id: 1,
          created_at: '2022-08-26T16:57:25.616Z',
          updated_at: '2022-08-26T16:57:25.616Z',
          instagram_user_id: 1,
        },
        {
          id: 24593,
          usage_type: 'dm_sent',
          content: 'ssdd',
          media_id: null,
          media_start_at: null,
          instagram_account_id: 1,
          created_at: '2022-08-26T16:57:26.578Z',
          updated_at: '2022-08-26T16:57:26.578Z',
          instagram_user_id: 1,
        },
      ],
    },
    {
      id: 1,
      instagram_id: '5105085919538441',
      username: 'linhvu9740',
      full_name: 'Linh Vu',
      follower_count: 0,
      is_verified_user: null,
      is_user_follow_business: true,
      is_business_follow_user: false,
      instagram_account_id: 1,
      created_at: '2022-07-31T09:58:36.678Z',
      updated_at: '2022-08-26T17:34:21.215Z',
      pending_message_id: null,
      email: 'Hha@gmail.com',
      phone_number: '03111111111',
      real_name: 'Haha',
      company_name: 'haha@gmail.com',
      company_role: null,
      website: null,
      propose: null,
      know_product_in: null,
      status: 'completion',
      start_chatbot_in: 'dm',
      start_chatbot_at: '2022-08-15T17:55:49.293Z',
      chatbot_usages: [
        {
          id: 24591,
          usage_type: 'dm_received',
          content: 'Kaka',
          media_id: '',
          media_start_at: null,
          instagram_account_id: 1,
          created_at: '2022-08-26T16:57:23.874Z',
          updated_at: '2022-08-26T16:57:23.874Z',
          instagram_user_id: 1,
        },
        {
          id: 24592,
          usage_type: 'dm_sent',
          content: 'ssd',
          media_id: null,
          media_start_at: null,
          instagram_account_id: 1,
          created_at: '2022-08-26T16:57:25.616Z',
          updated_at: '2022-08-26T16:57:25.616Z',
          instagram_user_id: 1,
        },
        {
          id: 24593,
          usage_type: 'dm_sent',
          content: 'ssdd',
          media_id: null,
          media_start_at: null,
          instagram_account_id: 1,
          created_at: '2022-08-26T16:57:26.578Z',
          updated_at: '2022-08-26T16:57:26.578Z',
          instagram_user_id: 1,
        },
      ],
    },
    {
      id: 1,
      instagram_id: '5105085919538441',
      username: 'linhvu9740',
      full_name: 'Linh Vu',
      follower_count: 0,
      is_verified_user: null,
      is_user_follow_business: true,
      is_business_follow_user: false,
      instagram_account_id: 1,
      created_at: '2022-07-31T09:58:36.678Z',
      updated_at: '2022-08-26T17:34:21.215Z',
      pending_message_id: null,
      email: 'Hha@gmail.com',
      phone_number: '03111111111',
      real_name: 'Haha',
      company_name: 'haha@gmail.com',
      company_role: null,
      website: null,
      propose: null,
      know_product_in: null,
      status: 'completion',
      start_chatbot_in: 'dm',
      start_chatbot_at: '2022-08-15T17:55:49.293Z',
      chatbot_usages: [
        {
          id: 24591,
          usage_type: 'dm_received',
          content: 'Kaka',
          media_id: '',
          media_start_at: null,
          instagram_account_id: 1,
          created_at: '2022-08-26T16:57:23.874Z',
          updated_at: '2022-08-26T16:57:23.874Z',
          instagram_user_id: 1,
        },
        {
          id: 24592,
          usage_type: 'dm_sent',
          content: 'ssd',
          media_id: null,
          media_start_at: null,
          instagram_account_id: 1,
          created_at: '2022-08-26T16:57:25.616Z',
          updated_at: '2022-08-26T16:57:25.616Z',
          instagram_user_id: 1,
        },
        {
          id: 24593,
          usage_type: 'dm_sent',
          content: 'ssdd',
          media_id: null,
          media_start_at: null,
          instagram_account_id: 1,
          created_at: '2022-08-26T16:57:26.578Z',
          updated_at: '2022-08-26T16:57:26.578Z',
          instagram_user_id: 1,
        },
      ],
    },
  ];

  React.useEffect(() => {
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
    // ?begin_date=${startD}&end_date=${date.toISOString().slice(0, 5)}${month}-01
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
        for (var i = 0; i < useEC.length; i++) {
          // useEC[i].log_date.slice(0,5)
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
        `/api/v1/analytics/users?begin_date=${dateStart.slice(0, 5)}${month}-15&end_date=${dateEnd}`
      )
      .then((res) => {
        // console.log(res.data.user_counts);
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
        // console.log(res.data);
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
  const [msgExDataAll, setMsgExDataAll] = useState([]);
  React.useEffect(() => {
    // var path = window.location.pathname;
    let dateStart = new Date();
    dateStart = new Date(dateStart.setMonth(dateStart.getMonth() - 1));
    dateStart = new Date(dateStart.setDate(15));
    dateStart = dateStart.toISOString().slice(0, 10);
    let dateEnd = new Date();
    dateEnd = dateEnd.toISOString().slice(0, 10);
    api
      .get(
        `/api/v1/message_managements/message_groups/data_analyst?begin_date=${dateStart}&end_date=${dateEnd}`
      )
      // .get(`/api/v1/message_managements/message_groups`)
      .then((res) => {
        // console.log(res.data.data);
        setListGroup(res.data.data);
        var msgDataAll = [];
        for (var i = 0; i < res.data.data.length; i++) {
          api
            .get(`/api/v1/message_managements/message_groups/${res.data.data[i].id}/export_csv`)
            .then((res) => {
              msgDataAll.push(res.data.data.instagram_users);
            })
            .catch((error) => {
              console.log(error);
            });
        }
        // console.log('msgDataAll: ', msgDataAll);
        setMsgExDataAll(msgDataAll);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [liveData, setLiveData] = useState([]);
  React.useEffect(() => {
    // let dateStart = new Date();
    // dateStart = dateStart.setMonth(dateStart.getMonth() - 1);
    // dateStart = new Date(dateStart);
    // var month = dateStart.toISOString().slice(5, 7) - 6;
    // if (month < 10) {
    //   month = `0${month}`;
    // } else if (month <= 0) {
    //   month = '01';
    // }

    let dateLiveStart = new Date();
    dateLiveStart = dateLiveStart.setMonth(dateLiveStart.getMonth() - 1);
    dateLiveStart = new Date(dateLiveStart);
    dateLiveStart = dateLiveStart.setDate(15);
    dateLiveStart = new Date(dateLiveStart);
    let dateLiveEnd = new Date();
    dateLiveEnd = dateLiveEnd.setDate(dateLiveEnd.getDate() + 1);
    dateLiveEnd = new Date(dateLiveEnd);

    // alert()
    api
      .get(
        `/api/v1/analytics/chatbot_usages/live?begin_date=${dateLiveStart
          .toISOString()
          .slice(0, 10)}&end_date=${dateLiveEnd.toISOString().slice(0, 10)}`
      )
      .then((res) => {
        // console.log('live analytics: ', res.data.live_usages);
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
  var percentold = ((userChatwithCBAll - userChatwithCB) / userChatwithCBAll) * 100;

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
        shared: false,
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
      toolbar: {
        show: false,
        offsetX: 0,
        offsetY: 0,
        tools: {},
      },
    },
  };

  function selectDateEnd(end) {
    setEndDate(end);
    var startD = startDate.toISOString().slice(0, 10);
    var endD = end.toISOString().slice(0, 10);
    let endTemp = new Date(endD);
    let endDateLive = new Date(endTemp.setDate(endTemp.getDate() + 1));
    endDateLive = endDateLive.toISOString().slice(0, 10);
    if (utils.checkDateEnd(startD, endD) === true) {
      const datePickerInputs = document.querySelectorAll(
        '.react-datepicker__input-container > input'
      );
      datePickerInputs[1].style.borderColor = '#51cbce';
      api
        .get(`/api/v1/analytics/chatbot_usages/user?begin_date=${startD}&end_date=${endD}`)
        .then((res) => {
          // console.log(res.data.counts);
          var useEC = res.data.counts;
          var dateEC = [];
          var user_count = [];
          for (var i = 0; i < useEC.length; i++) {
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
        });
      ////////////////////////////////////////////////
      api
        .get(`/api/v1/analytics/chatbot_usages/message?begin_date=${startD}&end_date=${endD}`)
        .then((res) => {
          // console.log('message: ', res.data.counts);
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
      ///////////////////////////////////////////////
      api
        .get(`/api/v1/analytics/chatbot_usages/live?begin_date=${startD}&end_date=${endDateLive}`)
        .then((res) => {
          setLiveData(res.data.live_usages);
        })
        .catch((error) => {
          console.log(error);
        });
      ///////////////////////////////////////////////
      if (userRole) {
        const msgGroupSearchVal = document.getElementById('searchMsg').value;
        api
          .get(
            `/api/v1/message_managements/message_groups/data_analyst?begin_date=${startD}&end_date=${endD}&client_name=${msgGroupSearchVal}`
          )
          .then((res) => {
            setListGroup(res?.data?.data);
            let msgDataAll = [];
            for (let i = 0; i < res.data.data.length; i++) {
              api
                .get(`/api/v1/message_managements/message_groups/${res.data.data[i].id}/export_csv`)
                .then((res) => {
                  msgDataAll.push(res.data.data.instagram_users);
                })
                .catch((error) => {
                  console.log(error);
                });
            }
            // console.log('msgDataAll: ', msgDataAll);
            setMsgExDataAll(msgDataAll);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        api
          .get(
            `/api/v1/message_managements/message_groups/data_analyst?begin_date=${startD}&end_date=${endD}`
          )
          .then((res) => {
            setListGroup(res?.data?.data);
            let msgDataAll = [];
            for (let i = 0; i < res.data.data.length; i++) {
              api
                .get(`/api/v1/message_managements/message_groups/${res.data.data[i].id}/export_csv`)
                .then((res) => {
                  msgDataAll.push(res.data.data.instagram_users);
                })
                .catch((error) => {
                  console.log(error);
                });
            }
            // console.log('msgDataAll: ', msgDataAll);
            setMsgExDataAll(msgDataAll);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else {
      const datePickerInputs = document.querySelectorAll(
        '.react-datepicker__input-container > input'
      );
      datePickerInputs[1].style.borderColor = 'red';
      utils.checkDateEnd(startD, endD);
    }
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
          time_comment: cm_live.created_at.slice(0, 19).replaceAll('-', '/').replaceAll('T', ' '),
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
    filename: 'Livestream.csv',
  };

  const headerMsgGr = [
    { label: 'ユーザー名', key: 'username' },
    { label: '名称', key: 'full_name' },
    { label: 'メール', key: 'email' },
    { label: '電話番号', key: 'phone_number' },
    { label: 'フォローしている', key: 'is_user_follow_business' },
    { label: 'フォローされている', key: 'is_business_follow_user' },
    { label: 'タイプ', key: 'type' },
    { label: 'チャット内容', key: 'conversation' },
    { label: '時間', key: 'time' },
  ];

  const headerMsgGrUser = [
    { label: 'ユーザー名', key: 'username' },
    { label: 'アカウントURL', key: 'link_account' },
    { label: '名称', key: 'full_name' },
    { label: 'メール', key: 'email' },
    { label: '電話番号', key: 'phone_number' },
    { label: 'フォローしている', key: 'is_user_follow_business' },
    { label: 'フォローされている', key: 'is_business_follow_user' },
  ];

  const [dataExMsgGr, setDataExMsgGr] = useState([]);
  const setMessageGroupDataExport = (value) => {
    var data = [];
    var datae = value; //use testMsgEx to test export all
    // console.log('dataedatae: ', datae);
    datae.forEach((it) => {
      data.push({
        username: it.username,
        full_name: it.full_name,
        email: it.email,
        phone_number: it.phone_number,
        is_user_follow_business: it.is_user_follow_business == 'true' ? 'はい' : 'いいえ',
        is_business_follow_user: it.is_business_follow_user == 'true' ? 'はい' : 'いいえ',
        type: it.chatbot_usages[0].usage_type == 'dm_received' ? '受け' : '送り',
        conversation: it.chatbot_usages[0].content,
        time: it.chatbot_usages[0].created_at.slice(0, 19).replaceAll('T', ' '),
      });
      for (var i = 1; i < it.chatbot_usages.length; i++) {
        const chat = it.chatbot_usages[i];
        data.push({
          username: '',
          full_name: '',
          email: '',
          phone_number: '',
          is_user_follow_business: '',
          is_business_follow_user: '',
          type: chat.usage_type == 'dm_received' ? '受け' : '送り',
          conversation: chat.content,
          time: chat.created_at.slice(0, 19).replaceAll('T', ' '),
        });
      }
    });
    // console.log(value);
    setDataExMsgGr(data);
  };

  // export message group data
  const csvMessageGroupReport = {
    data: dataExMsgGr,
    headers: headerMsgGr,
    filename: 'message-group.csv',
  };

  const [dataExMsgGrUser, setDataExMsgGrUser] = useState([]);
  const setMsgGrUser = (value) => {
    var data = [];
    var datae = value; //use testMsgEx to test export all
    // console.log('dataedatae: ', datae);
    datae.forEach((it) => {
      data.push({
        username: it.username,
        link_account: `https://www.instagram.com/${it.username}`,
        full_name: it.full_name,
        email: it.email,
        phone_number: it.phone_number,
        is_user_follow_business: it.is_user_follow_business == 'true' ? 'はい' : 'いいえ',
        is_business_follow_user: it.is_business_follow_user == 'true' ? 'はい' : 'いいえ',
      });
    });
    setDataExMsgGrUser(data);
  };

  const csvMessageGroupUserReport = {
    data: dataExMsgGrUser,
    headers: headerMsgGrUser,
    filename: 'message-group-user.csv',
  };

  // select date start
  const selectDateStart = (start) => {
    setStartDate(start);
    let startD = start.toISOString().slice(0, 10);
    let endD = endDate.toISOString().slice(0, 10);
    let endTemp = new Date(endDate);
    let endDateLive = new Date(endTemp.setDate(endTemp.getDate() + 1));
    endDateLive = endDateLive.toISOString().slice(0, 10);
    if (utils.checkDateEnd(startD, endD) === true) {
      const datePickerInputs = document.querySelectorAll(
        '.react-datepicker__input-container > input'
      );
      datePickerInputs[0].style.borderColor = '#51cbce';
      api
        .get(`/api/v1/analytics/chatbot_usages/user?begin_date=${startD}&end_date=${endD}`)
        .then((res) => {
          // console.log(res.data.counts);
          let useEC = res.data.counts;
          let dateEC = [];
          let user_count = [];
          for (let i = 0; i < useEC.length; i++) {
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
        });
      ////////////////////////////////////////////////
      api
        .get(`/api/v1/analytics/chatbot_usages/message?begin_date=${startD}&end_date=${endD}`)
        .then((res) => {
          // console.log('message: ', res.data.counts);
          let messageECA = res.data.counts;
          let message_count = [];
          for (let i = 0; i < messageECA.length; i++) {
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
          let useEC = res.data.user_counts;
          let user_count_all = 0;
          for (let i = 0; i < useEC.length; i++) {
            user_count_all = user_count_all + useEC[i].user_count;
          }
          setUserChatwithCB(user_count_all);
        })
        .catch((error) => {
          console.log(error);
        });
      ///////////////////////////////////////////////
      api
        .get(`/api/v1/analytics/chatbot_usages/live?begin_date=${startD}&end_date=${endDateLive}`)
        .then((res) => {
          setLiveData(res.data.live_usages);
        })
        .catch((error) => {
          console.log(error);
        });
      ///////////////////////////////////////////////
      if (userRole) {
        const msgGroupSearchVal = document.getElementById('searchMsg').value;
        api
          .get(
            `/api/v1/message_managements/message_groups/data_analyst?begin_date=${startD}&end_date=${endD}&client_name=${msgGroupSearchVal}`
          )
          .then((res) => {
            setListGroup(res?.data?.data);
            let msgDataAll = [];
            for (let i = 0; i < res.data.data.length; i++) {
              api
                .get(`/api/v1/message_managements/message_groups/${res.data.data[i].id}/export_csv`)
                .then((res) => {
                  msgDataAll.push(res.data.data.instagram_users);
                })
                .catch((error) => {
                  console.log(error);
                });
            }
            // console.log('msgDataAll: ', msgDataAll);
            setMsgExDataAll(msgDataAll);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        api
          .get(
            `/api/v1/message_managements/message_groups/data_analyst?begin_date=${startD}&end_date=${endD}`
          )
          .then((res) => {
            setListGroup(res?.data?.data);
            let msgDataAll = [];
            for (let i = 0; i < res.data.data.length; i++) {
              api
                .get(`/api/v1/message_managements/message_groups/${res.data.data[i].id}/export_csv`)
                .then((res) => {
                  msgDataAll.push(res.data.data.instagram_users);
                })
                .catch((error) => {
                  console.log(error);
                });
            }
            // console.log('msgDataAll: ', msgDataAll);
            setMsgExDataAll(msgDataAll);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else {
      const datePickerInputs = document.querySelectorAll(
        '.react-datepicker__input-container > input'
      );
      datePickerInputs[0].style.borderColor = 'red';
      utils.checkDateEnd(startD, endD);
    }
  };

  // live search
  const liveSearch = () => {};

  // message group search
  const msgSearch = () => {
    let startD = startDate.toISOString().slice(0, 10);
    let endD = endDate.toISOString().slice(0, 10);
    const msgGroupSearchVal = document.getElementById('searchMsg').value;
    api
      .get(
        `/api/v1/message_managements/message_groups/data_analyst?begin_date=${startD}&end_date=${endD}&client_name=${msgGroupSearchVal}`
      )
      .then((res) => {
        setListGroup(res?.data?.data);
        let msgDataAll = [];
        for (let i = 0; i < res.data.data.length; i++) {
          api
            .get(`/api/v1/message_managements/message_groups/${res.data.data[i].id}/export_csv`)
            .then((res) => {
              msgDataAll.push(res.data.data.instagram_users);
            })
            .catch((error) => {
              console.log(error);
            });
        }
        // console.log('msgDataAll: ', msgDataAll);
        setMsgExDataAll(msgDataAll);
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
                <div style={{ display: 'flex', alignItems: 'end', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
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
                    {/* <select onChange={(e) => selectDate(e.target.value)} style={{ padding: "5px 10px 5px 10px", border: "none", borderRadius: "7.5px", backgroundColor: "#64cbcb", color: "#FFFFFF", fontWeight: "800" }} defaultValue={"5d"} name="days_num_ec_cb" id="days_num_ec_cb">
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
              </CardBody>
            </Card>

            {/* live preview*/}
            <Card>
              <CardHeader>
                <div
                  style={{
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  <h3>Live Data</h3>
                </div>
                {userRole && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      id="searchLive"
                      name="searchLive"
                      style={{
                        height: '38px',
                        width: '200px',
                        border: '1px solid #dee2e6',
                        paddingTop: '-10px',
                        borderRadius: '3px',
                      }}
                      placeholder="Enter client name..."
                    ></input>
                    <Button
                      onClick={() => liveSearch()}
                      style={{ backgroundColor: '#66615b', marginRight: '15px' }}
                    >
                      検索
                    </Button>
                  </div>
                )}
              </CardHeader>
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
                              {userRole && (
                                <td>
                                  <h6>Client name</h6>
                                </td>
                              )}
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
                                  {userRole && <td>Name 1</td>}
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
            <Card>
              <CardHeader>
                <div
                  style={{
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  <h3>メッセージグループ</h3>
                </div>
                {userRole && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      id="searchMsg"
                      name="searchMsg"
                      style={{
                        height: '38px',
                        width: '200px',
                        border: '1px solid #dee2e6',
                        paddingTop: '-10px',
                        borderRadius: '3px',
                      }}
                      placeholder="Enter client name..."
                    ></input>
                    <Button
                      onClick={() => msgSearch()}
                      style={{ backgroundColor: '#66615b', marginRight: '15px' }}
                    >
                      検索
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardBody>
                {/* <div
                  style={{
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  <h3>メッセージグループ</h3>
                </div> */}
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
                          <h6>グループ名</h6>
                        </td>
                        {userRole && (
                          <td>
                            <h6>Client name</h6>
                          </td>
                        )}
                        <td>
                          <h6>作成/日付更新</h6>
                        </td>
                        {/* <td>
                          <h6>Total user</h6>
                        </td>
                        <td>
                          <h6>Answer results</h6>
                        </td> */}
                        <td>
                          <h6>チャット内容</h6>
                        </td>
                        <td>
                          <h6>インスタグラムユーザー詳細</h6>
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      {listGroup.map((item, i) => (
                        <tr key={item?.id} style={{ overflow: 'hidden', height: '14px' }}>
                          <td>{item?.group_name}</td>
                          {userRole && <td>{item?.client_name}</td>}
                          <td>{item?.updated_at?.slice(0, 10)}</td>
                          <td>
                            <span onClick={() => setMessageGroupDataExport(msgExDataAll[i])}>
                              <CSVLink {...csvMessageGroupReport}>
                                <MDBIcon
                                  fas
                                  icon="arrow-circle-down"
                                  style={{ color: '#51cbce' }}
                                ></MDBIcon>
                              </CSVLink>
                            </span>
                          </td>
                          <td>
                            <span onClick={() => setMsgGrUser(msgExDataAll[i])}>
                              <CSVLink {...csvMessageGroupUserReport}>
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
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default DataAnalyst;
