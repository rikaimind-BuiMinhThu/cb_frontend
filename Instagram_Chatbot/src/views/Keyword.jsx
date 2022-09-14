import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import '../assets/css/release.css';
import api from '../api/api-management';
import requestNewToken from 'api/request-new-token';
// reactstrap components
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import Switch from 'react-switch';
import ModalNoti from './Popup/ModalNoti';
import Cookies from 'js-cookie';
import ModalShort from './Popup/ModalShort';
import { useEffect } from 'react';
import { Pagination } from '@material-ui/lab';

function Keyword() {
  var [customDiv, setCustomDiv] = useState([]);
  var [numKeyword, setNumKeyword] = useState(1);
  const [listGroup, setListGroup] = useState([]);
  const [listKeyword, setListKeyword] = useState([]);
  const [bagName, setBagName] = useState([]);
  const [instaSetting, setInstaSetting] = useState();
  const [newKWBag, setNewKWBag] = useState();
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [msgNoti, setMsgNoti] = useState();
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  // const [checked, setChecked] = useState([true, false, true])

  // React.useEffect(() => {
  //     console.log('token in dashboard', Cookies.get('token'))
  //     if (Cookies.get('token') == undefined) {
  //         window.location.href = '/'
  //     }
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

    api
      .get(`/api/v1/message_managements/keyword_settings?page=1`)
      .then((res) => {
        // console.log('keyword_settings: ', res.data);
        setTotalPage(Math.ceil(res.data?.total / 15));
        setListKeyword(res.data?.data);
        // var listkey = res.data.data
        // console.log(listkey.length)
      })
      .catch((error) => {
        console.log(error);
        // if (error.response.data.code === 3) {
        //     requestNewToken(path)
        // }
      });
  }, []);

  function reloadListKW() {
    var path = window.location.pathname;
    // console.log("Reload ne")
    api
      .get(`/api/v1/message_managements/keyword_settings?page=1`)
      .then((res) => {
        // console.log("keyword_settings: ", res.data.data)
        setTotalPage(Math.ceil(res.data?.total / 15));
        setListKeyword(res.data.data);
        // var listkey = res.data.data
        // console.log(listkey.length)
      })
      .catch((error) => {
        console.log(error);
        // if (error.response.data.code === 3) {
        //     requestNewToken(path)
        // }
      });
  }

  const [instagramSettingData, setInstagramSettingData] = useState({});
  const [defaultReplyGroupId, setDefaultReplyGroupId] = useState(null);
  const [defaultReplyBagId, setDefaultReplyBagId] = useState(null);
  React.useEffect(() => {
    // var path = window.location.pathname;
    api
      .get(`/api/v1/instagram_settings`)
      .then((res) => {
        // console.log(res?.data?.data[0]);
        setInstagramSettingData(res?.data?.data[0]);
        setDefaultReplyGroupId(res?.data?.data[0]?.default_reply_group_id);
        setDefaultReplyBagId(res?.data?.data[0]?.default_reply_bag_id);
        setInstaSetting(res?.data?.data[0]?.id);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  React.useEffect(() => {
    var path = window.location.pathname;
    api
      .get(`/api/v1/message_managements/message_groups`)
      .then((res) => {
        // console.log("list group: ", res.data.data)
        setListGroup(res.data.data);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.code === 3) {
          requestNewToken(path);
        }
      });
  }, []);

  function removeOptions(selectElement) {
    var i,
      L = selectElement.options.length - 1;
    for (i = L; i >= 0; i--) {
      selectElement.remove(i);
    }
  }

  function selectedGroup(value, key) {
    var path = window.location.pathname;
    // document.getElementById(`listGroup${key}`).defaultValue = value;
    api
      .get(`/api/v1/message_managements/message_groups/${value}`)
      .then((res) => {
        // console.log(res.data.data.message_bags)
        // setListBag(res.data.data.message_bags)
        var group = document.getElementById(`listBag${key}`);
        removeOptions(group);
        for (var i = 0; i < res.data.data.message_bags.length; i++) {
          var option = document.createElement('option');
          option.value = res.data.data.message_bags[i].id;
          option.text = res.data.data.message_bags[i].bag_name;
          group.add(option);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function selectedGroupNew(value, key) {
    var path = window.location.pathname;
    api
      .get(`/api/v1/message_managements/message_groups/${value}`)
      .then((res) => {
        // console.log(res.data.data.message_bags)
        // setListBag(res.data.data.message_bags)
        var group = document.getElementById(`listBag`);
        // console.log("group ne: ", group)
        removeOptions(group);
        for (var i = 0; i < res.data.data.message_bags.length; i++) {
          var option = document.createElement('option');
          option.value = res.data.data.message_bags[i].id;
          option.text = res.data.data.message_bags[i].bag_name;
          group.add(option);
        }
        // group.value = res.data.data.message_bags[0].id
        setNewKWBag(res.data.data.message_bags[0].id);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function selectedBag(value) {
    console.log(value);
  }

  function selectedBagNew(value) {
    setNewKWBag(value);
  }

  function addNewKeyword() {
    // document.getElementById('')
    let cDivs = customDiv;

    cDivs.push(`newDiv${numKeyword}`);
    // console.log(cDivs)
    setCustomDiv(cDivs);
    setNumKeyword(numKeyword + 1);
    document.getElementById('cancel_save').style.display = 'block';
    var nodeBtn = document.getElementById('addbtn').getElementsByTagName('*');
    for (var i = 0; i < nodeBtn.length; i++) {
      nodeBtn[i].disabled = true;
    }
    // newFAQ()
    //   document.getElementById('actionFixed').style.display = "block
  }

  function saveFixedMessage() {
    // new_FAQ
    var elements = document.getElementById('keyword-form').elements;
    var obj = {};
    var faq = [];
    var group = [];
    var bag = [];
    var title_val = [];
    var keyword_val = [];
    var text_kw = [];
    for (var i = 0; i < elements.length; i++) {
      var item = elements.item(i);
      // console.log(item)
      if (item.name.includes('title-keyword')) {
        title_val.push(item.value);
      } else if (item.name.includes('bag')) {
        bag.push(item.value);
      } else if (item.name.includes('answer')) {
        var arrkw = item.value.split(/[, ]+/);
        // console.log("arrkw: ", arrkw)
        var kw = '';
        for (var i = 0; i < arrkw.length; i++) {
          if (i == arrkw.length - 1) {
            kw = kw.concat(arrkw[i].toString());
          } else {
            kw = kw.concat(arrkw[i].toString());
            kw = kw.concat('|');
          }
        }
        keyword_val.push(kw);

        // keyword_val.push(item.value)
      }
      // obj[item.name] = item.value;
    }

    // title_val.forEach((ele, index) => {
    //     obj[ele] = { title: title_val[index], keyword: keyword_val[index], instagram_account_id: instaSetting, message_bag_id: bag[index] }
    // })

    if (title_val[0] == '' || title_val[0] == null) {
      setIsOpenNoti(true);
      setMsgNoti('タイトルを入力してください！');
      setTimeout(() => {
        setMsgNoti('');
        setIsOpenNoti(false);
      }, 1500);
    } else if (keyword_val[0] == '' || keyword_val[0] == null) {
      setIsOpenNoti(true);
      setMsgNoti('キーワードを入力してください！');
      setTimeout(() => {
        setMsgNoti('');
        setIsOpenNoti(false);
      }, 1500);
    } else if (newKWBag == undefined || newKWBag == '') {
      setIsOpenNoti(true);
      setMsgNoti('メッセージ袋を選択してください！');
      setTimeout(() => {
        setMsgNoti('');
        setIsOpenNoti(false);
      }, 1500);
    } else {
      var newKW = {
        keyword_setting: {
          title: title_val[0],
          keyword: keyword_val[0],
          instagram_account_id: instaSetting,
          message_bag_id: parseInt(newKWBag),
        },
      };
      // console.log(newKW)
      var nodeBtn = document.getElementById('addbtn').getElementsByTagName('*');
      for (var i = 0; i < nodeBtn.length; i++) {
        nodeBtn[i].disabled = false;
      }

      api
        .post(`/api/v1/message_managements/keyword_settings`, newKW)
        .then((res) => {
          // console.log(res)
          document.getElementById('cancel_save').style.display = 'none';
          setIsOpenNoti(true);
          setMsgNoti('キーワードを追加しました。');
          setTimeout(() => {
            setMsgNoti('');
            setIsOpenNoti(false);
          }, 1500);
          reloadListKW();
          setCustomDiv([]);
          // setListBag(res.data.data.message_bags)
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  function enableEdit(value) {
    document.getElementById(`l-title-keyword-${value}`).readOnly = false;
    document.getElementById(`l-answer-${value}`).readOnly = false;
    document.getElementById(`listGroup${value}`).readOnly = false;
    document.getElementById(`listBag${value}`).readOnly = false;
    document.getElementById(`ene-${value}`).style.display = 'none';
    document.getElementById(`sav-${value}`).style.display = 'block';
  }

  function editKeywordInList(
    instagram_account_id_val,
    is_dm_val,
    is_story_comment_val,
    is_post_comment_val,
    is_live_comment_val,
    is_active_val,
    idUpdate,
    i
  ) {
    var a;
    var title_val = document.getElementById(`l-title-keyword-${i}`).value;
    var bag_val = document.getElementById(`listBag${i}`).value;
    var ans_val = document.getElementById(`l-answer-${i}`).value;

    var arrkw = ans_val.split(/[, ]+/);
    var kw = '';
    for (var j = 0; j < arrkw.length; j++) {
      if (j == arrkw.length - 1) {
        kw = kw.concat(arrkw[j].toString());
      } else {
        kw = kw.concat(arrkw[j].toString());
        kw = kw.concat('|');
      }
    }

    if (title_val == '') {
      setIsOpenNoti(true);
      setMsgNoti('タイトルを入力してください！');
      setTimeout(() => {
        setMsgNoti('');
        setIsOpenNoti(false);
      }, 1500);
    } else if (bag_val == '') {
      setIsOpenNoti(true);
      setMsgNoti('メッセージ袋を選択してください！');
      setTimeout(() => {
        setMsgNoti('');
        setIsOpenNoti(false);
      }, 1500);
    } else if (ans_val == '') {
      setIsOpenNoti(true);
      setMsgNoti('キーワードを入力してください！');
      setTimeout(() => {
        setMsgNoti('');
        setIsOpenNoti(false);
      }, 1500);
    } else {
      if (is_active_val == null) {
        a = false;
      } else {
        a = is_active_val;
      }
      var update = {
        keyword_setting: {
          title: title_val,
          keyword: kw,
          instagram_account_id: instagram_account_id_val,
          message_bag_id: parseInt(bag_val),
          is_dm: true,
          is_story_comment: is_story_comment_val,
          is_post_comment: is_post_comment_val,
          is_live_comment: is_live_comment_val,
          is_active: a,
        },
      };

      api
        .patch(`/api/v1/message_managements/keyword_settings/${idUpdate}`, update)
        .then((res) => {
          reloadListKW();
          document.getElementById(`ene-${i}`).style.display = 'block';
          document.getElementById(`sav-${i}`).style.display = 'none';
          // window.location.reload()
          // setMsgNoti(`固定メッセージ設定をオンにしました。`)
          // setIsOpenNoti(true)
          // setTimeout(() => {
          //   setMsgNoti("")
          //   setIsOpenNoti(false)
          // }, 2000)
          setIsOpenNoti(true);
          setMsgNoti('キーワードを更新しました。');
          setTimeout(() => {
            setMsgNoti('');
            setIsOpenNoti(false);
          }, 1500);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  const [idDelete, setIdDelete] = useState();
  function confirmDelete(id) {
    setIdDelete(id);
    setIsOpenDelete(true);
  }

  function deleteKeyword() {
    setIsOpenDelete(false);

    api
      .delete(`/api/v1/message_managements/keyword_settings/${idDelete}`)
      .then((res) => {
        // console.log(res);
        reloadListKW();
        setIsOpenNoti(true);
        setMsgNoti('削除しました。');
        setTimeout(() => {
          setIsOpenNoti(false);
          setMsgNoti('');
        }, 1500);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function cancelAdd() {
    document.getElementById('cancel_save').style.display = 'none';
    const list = document.getElementById('keyword_add');
    // console.log(list)
    while (list.hasChildNodes()) {
      list.removeChild(list.firstChild);
    }
    var nodeBtn = document.getElementById('addbtn').getElementsByTagName('*');
    for (var i = 0; i < nodeBtn.length; i++) {
      nodeBtn[i].disabled = false;
    }
  }

  function getBgName(id, index) {
    api
      .get(`/api/v1/message_managements/message_bags/${id}`)
      .then((res) => {
        // console.log("index: ", index, ": ", res.data.data.message_bag.bag_name)

        var x = document.getElementById(`listBag${index}`);
        var option = document.createElement('option');
        option.value = id;
        option.text = res.data.data.message_bag.bag_name;
        x.add(option);

        var myOpts = x.options;
        for (var i = 0; i < myOpts.length; i++) {
          if (i > 0) {
            if (myOpts[i].value == myOpts[i - 1].value) {
              // alert('same')
              myOpts.remove(i);
            }
          }
        }
        // bgName.push(res.data.data.message_bag.bag_name.toString())
        // listkey[i].bgn = res.data.data.message_bag.bag_name
        // setBagName(bgName)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function changeKWOnOff(
    title_val,
    keyword_val,
    instagram_account_id_val,
    message_bag_id_val,
    is_dm_val,
    is_story_comment_val,
    is_post_comment_val,
    is_live_comment_val,
    is_active_val,
    idUpdate,
    i
  ) {
    // setChecked(!checked)
    var a;
    if (is_active_val == null) {
      a = false;
    } else {
      a = is_active_val;
    }
    var update = {
      keyword_setting: {
        title: title_val,
        keyword: keyword_val,
        instagram_account_id: instagram_account_id_val,
        message_bag_id: message_bag_id_val,
        is_dm: true,
        is_story_comment: is_story_comment_val,
        is_post_comment: is_post_comment_val,
        is_live_comment: is_live_comment_val,
        is_active: !a,
      },
    };

    api
      .patch(`/api/v1/message_managements/keyword_settings/${idUpdate}`, update)
      .then((res) => {
        reloadListKW();
        // setMsgNoti(`固定メッセージ設定をオンにしました。`)
        // setIsOpenNoti(true)
        // setTimeout(() => {
        //   setMsgNoti("")
        //   setIsOpenNoti(false)
        // }, 2000)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const getBagSelected = (groupId, bagId, index) => {
    api
      .get(`/api/v1/message_managements/message_groups/${groupId}`)
      .then((res) => {
        document.getElementById(`listGroup${index}`).value = groupId;
        var group = document.getElementById(`listBag${index}`);
        removeOptions(group);
        for (var i = 0; i < res.data.data.message_bags.length; i++) {
          var option = document.createElement('option');
          option.value = res.data.data.message_bags[i].id;
          option.text = res.data.data.message_bags[i].bag_name;
          group.add(option);
        }
        group.value = bagId;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // get default reply bag
  const [defaultReplyBag, setDefaultReplyBag] = useState([]);
  useEffect(() => {
    if (instagramSettingData?.default_reply_group_id) {
      api
        .get(
          `/api/v1/message_managements/message_groups/${instagramSettingData?.default_reply_group_id}`
        )
        .then((res) => {
          setDefaultReplyBag(res?.data?.data?.message_bags);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [instagramSettingData]);

  // save default reply
  const saveDefaultReply = () => {
    const post_comment_bag_id = document.getElementById('bag-reply').value;
    if (post_comment_bag_id) {
      const payload = {
        instagram_setting: {
          post_comment_bag_id: instagramSettingData?.post_comment_bag_id,
          story_comment_bag_id: instagramSettingData?.story_comment_bag_id,
          live_comment_bag_id: instagramSettingData?.live_comment_bag_id,
          default_reply_bag_id: parseInt(post_comment_bag_id),
        },
      };
      api
        .patch(`/api/v1/instagram_settings/${instaSetting}`, payload)
        .then((res) => {
          // console.log(res);
          setIsOpenNoti(true);
          setMsgNoti('デフォルト返事を保存しました。');
          setTimeout(() => {
            setMsgNoti('');
            setIsOpenNoti(false);
          }, 1500);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      const defaultReplyBagError = document.getElementById('bag-reply-err');
      defaultReplyBagError.innerHTML = 'メッセージ袋を選択してください。';
      defaultReplyBagError.style.display = 'block';
    }
  };

  // handle select message group reply
  const handleSelectMsgReply = (e) => {
    setDefaultReplyGroupId(e.target.value);
    setDefaultReplyBagId('');
    api
      .get(`/api/v1/message_managements/message_groups/${e.target.value}`)
      .then((res) => {
        setDefaultReplyBag(res?.data?.data?.message_bags);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // handle select bag reply
  const handleSelectBagReply = (e) => {
    setDefaultReplyBagId(e.target.value);
    const defaultReplyBagError = document.getElementById('bag-reply-err');
    defaultReplyBagError.innerHTML = '';
    defaultReplyBagError.style.display = 'none';
  };

  // handle change page
  const handleChangePage = (e, value) => {
    setPage(parseInt(value));
    // reload
    api
      .get(`/api/v1/message_managements/keyword_settings?page=${value}`)
      .then((res) => {
        let totalPage = Math.ceil(res.data?.total / 15);
        if (totalPage < parseInt(value)) {
          api
            .get(`/api/v1/message_managements/keyword_settings?page=${totalPage}`)
            .then((res) => {
              setListKeyword(res.data?.data);
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          setListKeyword(res.data?.data);
        }
        setTotalPage(Math.ceil(res.data?.total / 15));
      })
      .catch((error) => {
        console.log(error);
      });
    document.querySelector('.main-panel').scrollTop = 0;
  };

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              {/* <CardHeader>
                <div>Header</div>
              </CardHeader> */}
              <CardBody>
                <div style={{ width: '100%' }}>
                  <div
                    className="div-add-aq"
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        width: '60%',
                      }}
                    >
                      <div
                        style={{
                          marginBottom: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          // justifyContent: 'space-between',
                        }}
                      >
                        <span style={{ margin: '0', width: '150px' }}>デフォルト返事</span>
                        <select
                          name="msg-reply"
                          id="msg-reply"
                          style={{ padding: '8px 0px 8px 0px' }}
                          // defaultValue={
                          //   instagramSettingData?.default_reply_group_id
                          //     ? instagramSettingData?.default_reply_group_id
                          //     : ''
                          // }
                          value={defaultReplyGroupId ? defaultReplyGroupId : ''}
                          className="new-faq-q-so"
                          onChange={handleSelectMsgReply}
                        >
                          {listGroup?.map((group) => (
                            <option key={group.id} value={group.id}>
                              {group.group_name}
                            </option>
                          ))}
                          <option value="" disabled hidden>
                            メッセージグループを選択してください。
                          </option>
                        </select>
                        <select
                          name="bag-reply"
                          id="bag-reply"
                          // defaultValue={
                          //   instagramSettingData?.default_reply_bag_id
                          //     ? instagramSettingData?.default_reply_bag_id
                          //     : ''
                          // }
                          style={{ padding: '8px 0px 8px 0px' }}
                          value={defaultReplyBagId ? defaultReplyBagId : ''}
                          className="new-faq-q-so"
                          onChange={handleSelectBagReply}
                        >
                          <option value="" disabled hidden>
                            メッセージ袋を選択してください
                          </option>
                          {defaultReplyBag?.map((replyBag) => (
                            <option key={replyBag.id} value={replyBag.id}>
                              {replyBag.bag_name}
                            </option>
                          ))}
                        </select>
                        <div
                          style={{
                            marginLeft: '30px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <i
                            className="nc-icon nc-cloud-download-93 nc-3x"
                            style={{
                              fontSize: '30px',
                              // marginTop: '5px',
                              // marginRight: '30px',
                              cursor: 'pointer',
                            }}
                            onClick={saveDefaultReply}
                          ></i>
                        </div>
                      </div>
                      <span
                        id="bag-reply-err"
                        style={{ display: 'none', color: 'red', float: 'right' }}
                      ></span>
                    </div>
                  </div>
                  <div style={{ width: '100%' }}>
                    <div style={{ width: '100%', display: 'flex' }}>
                      <div style={{ width: '50%' }}>
                        <br />
                        <span>
                          <i className="nc-icon icon-question-sign"></i>
                        </span>
                      </div>
                      <div id="addbtn" style={{ width: '50%', textAlign: 'right' }}>
                        <Button
                          onClick={() => addNewKeyword()}
                          style={{
                            backgroundColor: 'white',
                            color: '#248eff',
                            border: '1px solid #248eff',
                          }}
                        >
                          追加
                        </Button>
                      </div>
                      <div style={{ margin: '15px 0px 0px 20px' }}>
                        {/* <Switch onChange={() => changeFixedMenuOnOff()} onColor="#64c1ff" checked={checkedFixedMenu} /> */}
                      </div>
                    </div>
                  </div>
                  <div className="div-add-aq" style={{ width: '100%', display: 'block' }}>
                    <div style={{ display: 'flex' }}>
                      <div
                        className="new-faq-q-so-title"
                        style={{ paddingLeft: '8%', width: '20%' }}
                      >
                        タイトル
                      </div>
                      <div
                        className="new-faq-q-so-title"
                        style={{ paddingLeft: '15%', width: '43%' }}
                      >
                        キーワード
                      </div>
                      <div
                        className="new-faq-q-so-title"
                        style={{ paddingLeft: '5%', width: '30%' }}
                      >
                        メッセージグループ
                      </div>
                      <div
                        className="new-faq-q-so-title"
                        style={{ paddingLeft: '2%', width: '30%' }}
                      >
                        メッセージ袋
                      </div>
                    </div>
                  </div>
                  <div id="addKeywordContent" style={{ width: '100%' }}>
                    {listKeyword.map((cdiv, i) => (
                      <form key={cdiv.id} id={`l-fixed-menu-${i}`}>
                        <div
                          onLoad={getBagSelected(cdiv.message_group_id, cdiv.message_bag_id, i)}
                          key={cdiv}
                        >
                          <div
                            id={`fixed-div-${i}`}
                            className="div-add-aq"
                            style={{ display: 'flex', width: '100%' }}
                          >
                            <Switch
                              id={`check${i}`}
                              onChange={(e) =>
                                changeKWOnOff(
                                  cdiv.title,
                                  cdiv.keyword,
                                  cdiv.instagram_account_id,
                                  cdiv.message_bag_id,
                                  cdiv.is_dm,
                                  cdiv.is_story_comment,
                                  cdiv.is_post_comment,
                                  cdiv.is_live_comment,
                                  cdiv.is_active,
                                  cdiv.id,
                                  i
                                )
                              }
                              onColor="#64c1ff"
                              checked={(cdiv.is_active = null ? false : cdiv.is_active)}
                            />
                            <input
                              name={`l-title-keyword-${i}`}
                              defaultValue={cdiv.title}
                              id={`l-title-keyword-${i}`}
                              className="new-faq-q-so"
                              placeholder="キーワードグループ..."
                              type="text"
                              style={{ width: '20%' }}
                            />
                            <input
                              name={`l-answer-${i}`}
                              defaultValue={cdiv.keyword.replaceAll('|', ', ')}
                              className="new-faq-q-so"
                              type="text"
                              id={`l-answer-${i}`}
                              placeholder="コマーまたはスペースで区別(例:key1, key2,...)"
                              style={{ width: '53%' }}
                            />
                            <select
                              id={`listGroup${i}`}
                              style={{ width: '25%' }}
                              // defaultValue={cdiv.message_group_id}
                              onChange={(e) => selectedGroup(e.target.value, i)}
                              className="new-faq-q-so"
                              name="l-group"
                            >
                              {/* <option value={cdiv.message_group_id} disabled hidden>{cdiv.message_group_name}</option> */}
                              {listGroup?.map((group, i) => {
                                return (
                                  <option key={i} value={group.id}>
                                    {group.group_name}
                                  </option>
                                );
                              })}
                            </select>
                            <select
                              id={`listBag${i}`}
                              style={{ width: '25%' }}
                              onChange={(e) => selectedBag(e.target.value)}
                              className="new-faq-q-so"
                              name={`l-bag${i}`}
                            >
                              {/* <option value="" disabled hidden></option> */}
                            </select>
                            <div
                              id={`ene-${i}`}
                              onClick={() => enableEdit(i)}
                              style={{ width: '5%', cursor: 'pointer' }}
                            >
                              <i
                                className="nc-icon nc-align-center nc-3x"
                                style={{
                                  fontSize: '30px',
                                  marginTop: '5px',
                                  marginRight: '30px',
                                }}
                              ></i>
                            </div>
                            <div
                              id={`sav-${i}`}
                              onClick={() =>
                                editKeywordInList(
                                  cdiv.instagram_account_id,
                                  cdiv.is_dm,
                                  cdiv.is_story_comment,
                                  cdiv.is_post_comment,
                                  cdiv.is_live_comment,
                                  cdiv.is_active,
                                  cdiv.id,
                                  i
                                )
                              }
                              style={{ width: '5%', display: 'none' }}
                            >
                              <i
                                className="nc-icon nc-cloud-download-93 nc-3x"
                                style={{
                                  fontSize: '30px',
                                  marginTop: '5px',
                                  marginRight: '30px',
                                  cursor: 'pointer',
                                }}
                              ></i>
                            </div>
                            <div onClick={() => confirmDelete(cdiv.id)}>
                              <i
                                className="nc-icon nc-box nc-3x"
                                style={{ fontSize: '30px', marginTop: '5px', cursor: 'pointer' }}
                              ></i>
                            </div>
                          </div>
                        </div>
                      </form>
                    ))}
                    <form action="" id="keyword-form">
                      <div style={{ width: '100%' }} id="keyword_add">
                        {customDiv.map((cdiv, i) => (
                          <div key={cdiv}>
                            <div
                              id={`fixed-div-${i}`}
                              className="div-add-aq"
                              style={{ display: 'flex', width: '100%' }}
                            >
                              <div
                                style={{
                                  width: '90px',
                                  position: 'relative',
                                  display: 'inline-block',
                                  opacity: '1',
                                  direction: 'ltr',
                                  transition: 'opacity 0.25s ease 0s',
                                }}
                              ></div>
                              <input
                                name={`title-keyword-${i}`}
                                id={`title-keyword-${i}`}
                                className="new-faq-q-so"
                                placeholder="キーワードグループ..."
                                type="text"
                                style={{ width: '20%' }}
                              />
                              <input
                                name={`answer-${i}`}
                                className="new-faq-q-so"
                                type="text"
                                placeholder="コマーまたはスペースで区別(例:key1, key2,...)"
                                style={{ width: '53%' }}
                              />
                              <select
                                id="listGroup"
                                style={{ width: '25%' }}
                                defaultValue={''}
                                onChange={(e) => selectedGroupNew(e.target.value, i)}
                                className="new-faq-q-so"
                                name="group"
                              >
                                <option value="" disabled hidden>
                                  メッセージグループ選択 ...
                                </option>
                                {listGroup?.map((group, i) => {
                                  return (
                                    <option key={i} value={group.id}>
                                      {group.group_name}
                                    </option>
                                  );
                                })}
                              </select>
                              <select
                                id={`listBag`}
                                style={{ width: '25%' }}
                                defaultValue={''}
                                onChange={(e) => selectedBagNew(e.target.value)}
                                className="new-faq-q-so"
                                name="bag"
                              >
                                <option value="" disabled hidden>
                                  メッセージ袋選択 ...
                                </option>
                              </select>
                              <div style={{ width: '90px' }}></div>
                              <div>
                                <i
                                  className="nc-icon nc-box nc-3x"
                                  style={{
                                    fontSize: '30px',
                                    marginTop: '5px',
                                    cursor: 'pointer',
                                  }}
                                ></i>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </form>
                    <div
                      id="cancel_save"
                      style={{
                        width: '100%',
                        textAlign: 'right',
                        padding: '20px',
                        display: 'none',
                      }}
                    >
                      <Button style={{ marginRight: '10px' }} onClick={() => cancelAdd()}>
                        キャンセル
                      </Button>
                      <Button onClick={() => saveFixedMessage()}>保存</Button>
                    </div>
                  </div>
                </div>

                <Pagination
                  count={totalPage}
                  variant="outlined"
                  page={page}
                  onChange={handleChangePage}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
          <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
            <h4>{msgNoti}</h4>
          </div>
        </ModalNoti>
        <ModalShort open={isOpenDelete} onClose={() => setIsOpenDelete(false)}>
          <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
            <h4>キーワードを削除しますか。</h4>
            <Button onClick={() => deleteKeyword()}>はい</Button>
            <Button onClick={() => setIsOpenDelete(false)}>いいえ</Button>
          </div>
        </ModalShort>
      </div>
    </>
  );
}

export default Keyword;
