import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import {
  Button,
  Card,
  CardBody,
  Row,
  Col,
} from "reactstrap";
import "../assets/css/general.css";
import Cookies from "js-cookie";
import api from '../api/api-management'
import requestNewToken from "api/request-new-token";
import ModalShort from "./Popup/ModalShort";
import * as utils from './../JS/client.js'
import ChatbotOption from "./ChatbotElement/ChatbotOption.jsx";
import ModalNoti from "./Popup/ModalNoti";
import axios from "axios";
import Modal from "./Popup/Modal";

function Chatbot() {
  const [groupList, setGroupList] = useState([])
  const [messageBag, setMessageBag] = useState([])
  const [idMsgB, setIdmsgB] = useState()
  const [isOpenNoti, setIsOpenNoti] = useState()
  const [isOpenSelectPastPost, setIsOpenSelectPastPost] = useState()
  const [isOpenSelectPastPostUp, setIsOpenSelectPastPostUp] = useState()
  const [msgNoti, setMsgNoti] = useState()
  const [idList, setIdList] = useState([])
  const [idMsgGr, setIdMsgGr] = useState()
  const [idMsgRenameGr, setIdRenameMsgGr] = useState()
  const [idMsgCopyGr, setIdCopyMsgGr] = useState()
  const [idMsgDeleteGr, setIdDeleteMsgGr] = useState()
  const [bagId, setBagId] = useState()
  var [customDiv, setCustomDiv] = useState([])
  const [isAddOpenSingleChoice, setIsAddOpenSingleChoice] = useState(false)
  const [isUpdateOpenSingleChoice, setIsUpdateOpenSingleChoice] = useState(false)
  const [isAddOpenThreeChoice, setIsAddOpenThreeChoice] = useState(false)
  const [isUpdateOpenThreeChoice, setIsUpdateOpenThreeChoice] = useState(false)
  const [isAddOpenFreeInput, setIsAddOpenFreeInput] = useState(false)
  const [isUpdateOpenFreeInput, setIsUpdateOpenFreeInput] = useState(false)

  React.useEffect(() => {
    console.log('token in dashboard', Cookies.get('token'))
    if (Cookies.get('token') == undefined) {
      window.location.href = '/'
    }
  }, [])

  React.useEffect(() => {
    var page_access_token = Cookies.get("page_access_token")
    var ig_id = Cookies.get("ig_id")

    // console.log("page_access_token: ", page_access_token)
    // console.log("ig_id: ", ig_id)


  })

  React.useEffect(() => {
    // var path = window.location.pathname;
    var access_token = Cookies.get('page_access_token')
    if (access_token == "" || access_token == undefined || access_token == null) {
      api.get(`/api/v1/instagram_settings`).then(res => {
        // console.log(res.data.data[0].page_access_token)
        Cookies.set('page_access_token', res.data.data[0].page_access_token);
        Cookies.set('ig_id', res.data.data[0].ig_id);
      }).catch(error => {
        console.log(error)
      })
    }

  }, [])

  React.useEffect(() => {
    // var paramSearch = { page: pageIndex }
    var path = window.location.pathname;
    api.get(`/api/v1/message_managements/message_groups`).then(res => {
      // var totalPage = Math.ceil(res.data.data.total / 25)
      // setTotalPage(totalPage)
      var idli = []
      for (var i = 0; i < res.data.data.length; i++) {
        idli.push(res.data.data[i].id)
        // 
      }
      setIdList(idli)
      // console.log(idli)
      setGroupList(res.data.data)
      setTimeout(() => {
        for (var i = 0; i < idli.length; i++) {
          document.getElementById('liMesBag').id = `liMesBag${idli[i]}`
        }
      }, 1000)
    }).catch(error => {
      console.log(error)
      if (error.response.data.code === 3) {
        requestNewToken(path)
      }
    })
  }, [])

  function reloadGroup() {
    var path = window.location.pathname;
    api.get(`/api/v1/message_managements/message_groups`).then(res => {
      // var totalPage = Math.ceil(res.data.data.total / 25)
      // setTotalPage(totalPage)
      var idli = []
      for (var i = 0; i < res.data.data.length; i++) {
        idli.push(res.data.data[i].id)
        // 
      }
      setIdList(idli)
      // console.log(idli)
      setGroupList(res.data.data)
      setTimeout(() => {
        for (var i = 0; i < idli.length; i++) {
          document.getElementById('liMesBag').id = `liMesBag${idli[i]}`
        }
      }, 1000)
    }).catch(error => {
      console.log(error)
      if (error.response.data.code === 3) {
        requestNewToken(path)
      }
    })
  }

  ///bo comment ben tren
  const [idPPUP, setIdPPUP] = useState()
  function refreshMsgGroup() {
    var path = window.location.pathname;
    api.get(`/api/v1/message_managements/message_groups`).then(res => {
      // var totalPage = Math.ceil(res.data.data.total / 25)
      // setTotalPage(totalPage)
      var idli = []
      for (var i = 0; i < res.data.data.length; i++) {
        idli.push(res.data.data[i].id)
        // 
      }
      document.getElementById('ulMesBag').innerHTML = ""
      for (var i = 0; i < idli.length; i++) {
        var liMesBag = document.createElement('li')
        liMesBag.setAttribute('id', 'liMesBag')

        document.getElementById('ulMesBag').appendChild(liMesBag)
        setIdList(idli)
        // console.log(idli)
        setGroupList(res.data.data)
        setTimeout(() => {
          var i = idli.length - 1
          document.getElementById('liMesBag').id = `liMesBag${idli[i]}`

        }, 1000)
      }

    }).catch(error => {
      console.log(error)
      if (error.response.data.code === 3) {
        requestNewToken(path)
      }
    })
  }



  const [idForReloadMsgBag, setIdForReloadMsgBag] = useState()
  function getBagMsg(group, id) {//
    setIdForReloadMsgBag(id)
    var path = window.location.pathname;
    const list = document.getElementById("div_custom");
    while (list.hasChildNodes()) {
      list.removeChild(list.firstChild);
    }
    const list2 = document.getElementById("logUserDiv");
    while (list2.hasChildNodes()) {
      list2.removeChild(list2.firstChild);
    }
    api.get(`/api/v1/message_managements/message_bags/${id}`).then(res => {
      // var totalPage = Math.ceil(res.data.data.total / 25)
      // setTotalPage(totalPage)
      var bagMsg = res.data.data.messages
      var bagId = res.data.data.message_bag.id
      console.log("bagMsg ne: ", res.data.data.messages)
      setMsgCBNum(bagMsg[bagMsg.length - 1].id)
      setImgCBNum(bagMsg[bagMsg.length - 1].id)
      setImgCBNum(bagMsg[bagMsg.length - 1].id)
      bagMsg.forEach((item) => {


        // Case message type is msg

        if (item.message_type == "msg") {

          var updateItem = ""
          var choiceHTML = ""
          if (typeof item.free_input !== "undefined" && item.free_input !== null) {
            // console.log("free input")
            choiceHTML =
              `
                <div id="itemFI${item.id}" >
                <div style="padding:0px 5px 10px 5px">Format check: ${item.free_input.format_check == "email"? "Email" : (item.free_input.format_check == "phone_number" ? "Phone Number" : "No validate")}</div>
                <div id="deleteChoice${item.id}" style="width:100%; padding:5px; display:none"> 
                  <button style="border: none; background-color:#f17e5d; border-radius:5px; color:white; font-weight:700; font-size:12px">
                    Delete
                  </button>
                </div>
                <input id="lblAddFI${item.free_input.message_id}" hidden type=text value="${item.free_input.free_input_labels}" />
                <input id="formatCheckSelect${item.free_input.message_id}" hidden type=text value=${item.free_input.format_check} />
                <input id="formatCheckMSG${item.free_input.message_id}" hidden type=text value="${item.free_input.format_check_message}" />
                
              </div>
              `
            updateItem = "free_input"
          } else if (item.message_buttons != []) {
            if (item.message_buttons.length == 1) {
              if (item.message_buttons[0].button_type == "mess") {
                choiceHTML =
                  `
                    <div id="itemSC${item.message_buttons[0].message_id}">
                    <div style="padding:10px 5px 0px 5px">${item.message_buttons[0].title}</div>
                    <input id="titleUPSC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].title} />
                    <input id="typeUPSC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].button_type} />
                    <input id="webUPSC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].content == null ? "" : item.message_buttons[0].content} />
                    <div style="padding:0px 5px 10px 5px">${item.message_buttons[0].message_group_name}/${item.message_buttons[0].message_bag_name}</div>
                  
                    <div id="deleteChoice${item.id}" style="width:100%; padding:5px; display:none"> 
                    <button style="border: none; background-color:#f17e5d; border-radius:5px; color:white; font-weight:700; font-size:12px">
                      Delete
                    </button>
                  </div>
                    <input id="bagUPTC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].message_bag_id} />
                    <input id="lblUPTCItem${item.message_buttons[0].message_id}" hidden type=text value="${item.message_buttons[0].message_button_labels}" />
                  </div>
                  `
                updateItem = "single_choice_msg"
              } else if (item.message_buttons[0].button_type == "web_url") {
                if (item.message_buttons[0] != undefined) {
                  choiceHTML =
                    `
                    <div >
                    <div style="padding:10px 5px 0px 5px">${item.message_buttons[0].title}</div>  
                    <div style="padding:0px 5px 10px 5px">${item.message_buttons[0].content}</div>
                      

                    <input id="titleUPTC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].title} />
                    <input id="typeUPTC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].button_type} />
                    <input id="webUPTC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].content == null ? "" : item.message_buttons[0].content} />
                      
                    <div id="deleteChoice${item.id}" style="width:100%; padding:5px; display:none"> 
                    <button style="border: none; background-color:#f17e5d; border-radius:5px; color:white; font-weight:700; font-size:12px">
                      Delete
                    </button>
                  </div>
                    <input id="bagUPTC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].message_bag_id} />
                    <input id="lblUPTCItem${item.message_buttons[0].message_id}" hidden type=text value="${item.message_buttons[0].message_button_labels}" />
                    </div>
                    `
                  updateItem = "single_choice_web"
                } else {

                }

              }
            } else if (item.message_buttons.length > 1) {
              console.log("nhieu item hon ne")
              for (var i = 0; i < item.message_buttons.length; i++) {
                if (item.message_buttons[i].button_type == "mess") {
                  console.log("mess ne")
                  choiceHTML = choiceHTML.concat(
                    `
                  <div id="itemTCUP${item.id}_${i}" style="border-bottom:${i == item.message_buttons.length - 1 ? "none" : "1px solid black"}; margin:auto; width:90%; text-align:center">
                  <div style="padding:10px 5px 0px 5px">${item.message_buttons[i].title}</div>  
                  <div style="padding:0px 5px 10px 5px">${item.message_buttons[i].message_group_name}/${item.message_buttons[i].message_bag_name}</div>
                    <input id="titleUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].title} />
                  <input id="typeUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].button_type} />
                  <input id="webUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].content == null ? "" : item.message_buttons[i].content} />
                    
                  <div id="deleteChoice${item.id}_${i}" style="width:100%; padding:5px; display:none"> 
                  <button style="border: none; background-color:#f17e5d; border-radius:5px; color:white; font-weight:700; font-size:12px">
                    Delete
                  </button>
                </div>
                  <input id="bagUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].message_bag_id} />
                  <input id="lblUPTCItem${item.message_buttons[i].message_id}" hidden type=text value="${item.message_buttons[i].message_button_labels}" />
                  </div>
                  `
                  )
                  // <input id="groupAddFI${item.id}" hidden type=text value=${`group value here`} />
                } else if (item.message_buttons[i].button_type == "web_url") {
                  console.log("web ne")
                  choiceHTML = choiceHTML.concat(
                    `
                    <div id="itemTCUP${item.id}_${i}" style="border-bottom:${i == item.message_buttons.length - 1 ? "none" : "1px solid black"}; margin:auto; width:90%; text-align:center">
                    <div style="padding:10px 5px 0px 5px;">${item.message_buttons[i].title}</div>  
                    <div style="padding:0px 5px 10px 5px">${item.message_buttons[i].content}</div>
                    <input id="titleUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].title} />
                    <input id="typeUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].button_type} />
                    <input id="webUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].content == null ? "" : item.message_buttons[i].content} />
                    <div id="deleteChoice${item.id}_${i}" style="width:100%; padding:5px; display:none"> 
                    <button style="border: none; background-color:#f17e5d; border-radius:5px; color:white; font-weight:700; font-size:12px">
                      Delete
                    </button>
                  </div>
                    <input id="bagUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].message_bag_id} />
                    <input id="lblUPTCItem${item.message_buttons[i].message_id}" hidden type=text value="${item.message_buttons[i].message_button_labels}" />
                    </div>
                    `
                  )
                }
              }

              updateItem = "three_choice"
            }

          }



          var abc = document.createElement("div")
          document.getElementById("div_custom").appendChild(abc)
          abc.innerHTML =
            `<div id="chatbot_message${item.id}" style=" border-radius: 20px; display:block; background-color: #f4f3ef; padding: 40px; margin-top: 20px; text-align: center" >
              
              <div><textarea name="messagesVa${item.id}" class="mgsChatbot" id="mgsCustomSaved${item.id}" placeholder="返事入力..." type="text" rows="3"></textarea></div>
              


              <div id="choice${item.id}">
    
              </div>

              
              <div id="msgChoice${item.id}" style="display:none">
                <div style="display: flex">
                  <div id="singleChoice${item.id}" style=" padding:5px">
                    <button style="background-color:#FFFFFF; border: 1px solid #51cbce; border-radius:10px">Single choice</button>
                  </div>
                  <div id="threeChoice${item.id}" style=" padding:5px">
                    <button style="background-color:#FFFFFF; border: 1px solid #51cbce; border-radius:10px">Three choice</button>
                  </div>
                  <div id="freeInput${item.id}" style=" padding:5px">
                    <button style="background-color:#FFFFFF; border: 1px solid #51cbce; border-radius:10px">Free input</button>
                  </div>
                </div>
              </div>
              </br>
              <div style=" border-radius:10px; background-color:white; width:200px; text-align:center">
                <div id="choiceOption${item.id}" style=" border-radius:10px; background-color:white; width:200px; text-align:center">
                
                </div>
                <div id="choiceThree${item.id}" style="display:none;border-radius:10px"></div>
              </div>



              <div id="btnDelMsg${item.id}" style="float:right;">
              <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
                font-weight:800">削除</button>
              </div>
              <div id="btnUpdateMsg${item.id}" style="float:right;">
              <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
                font-weight:800">更新</button>
              </div>
            </div>`
          // document.getElementById(`mgsCustomKey${item.id}`).textContent = item.received_message
          document.getElementById(`mgsCustomSaved${item.id}`).textContent = item.message_value
          var choiceNe = document.createElement("div")
          document.getElementById(`choiceOption${item.id}`).appendChild(choiceNe)

          document.getElementById(`singleChoice${item.id}`).addEventListener('click', (event) => {
            event.preventDefault()
            updateMsgSC(item.id)
          })
          document.getElementById(`threeChoice${item.id}`).addEventListener('click', (event) => {
            event.preventDefault()
            updateMsgTC(item.id)
          })
          document.getElementById(`freeInput${item.id}`).addEventListener('click', (event) => {
            event.preventDefault()
            updateMsgFI(item.id)
          })

          //This one use to delete choice deleteChoice
          document.getElementById(`choiceOption${item.id}`).addEventListener("click", (e) => {
            e.preventDefault()

            if (updateItem == "three_choice") {
              var idThreeChoiceDelete = item.message_buttons.length - 1
              document.getElementById(`deleteChoice${item.id}_${idThreeChoiceDelete}`).style.display = "block"
              document.getElementById(`deleteChoice${item.id}_${idThreeChoiceDelete}`).addEventListener('click', (e) => {
                e.preventDefault()
                var upd = { message: { message_value: document.getElementById(`mgsCustomSaved${item.id}`).value, message_type: "msg", img_value: "" } }
                api.patch(`/api/v1/message_managements/messages/${item.id}`, upd).then(res => {
                  console.log(res)
                  setTimeout(() => {
                    setIsOpenNoti(true)
                    setMsgNoti("更新しました。")
                  }, 1500)
                  setTimeout(function () {
                    setIsOpenNoti(false)
                  }, 2000);
                  // getBagMsg(group, id)
                  getBagMsg(idReloadMsgBagFromGetMSG, idReloadMsgBagFromGetMSG)
                }).catch(error => {
                  console.log(error)
                })
              })
            }




            if (document.getElementById(`deleteChoice${item.id}`) != null) {
              document.getElementById(`deleteChoice${item.id}`).style.display = "block"
              document.getElementById(`deleteChoice${item.id}`).addEventListener("click", (event) => {
                event.preventDefault()
                // alert("delete ne")
                var upd = { message: { message_value: document.getElementById(`mgsCustomSaved${item.id}`).value, message_type: "msg", img_value: "" } }
                api.patch(`/api/v1/message_managements/messages/${item.id}`, upd).then(res => {
                  console.log(res)
                  setTimeout(() => {
                    setIsOpenNoti(true)
                    setMsgNoti("更新しました。")
                  }, 1500)
                  setTimeout(function () {
                    setIsOpenNoti(false)
                  }, 2000);
                  getBagMsg(group, id)
                }).catch(error => {
                  console.log(error)
                })
              })
            }
          })

          // Update item down here
          if (updateItem == "") {
            document.getElementById(`msgChoice${item.id}`).style.display = "block"
          }


          choiceNe.innerHTML = choiceHTML
          document.getElementById(`mgsCustomSaved${item.id}`).addEventListener('change', (e) => msgOVSaved(e.target.value, item.id))
          // <div><textarea name="messageKey${item.id}" class="mgsChatbot" id="mgsCustomKey${item.id}" placeholder="キーワード入力..." type="text" rows="3"></textarea></div><br />
          // document.getElementById(`mgsCustomKey${item.id}`).addEventListener('change', (e) => msgOVkey(e.target.value))
          // document.getElementById(`mgsCustom${item.id}`).addEventListener('change', () => { document.getElementById(`btnDelMsg${item.id}`).style.display = 'block' })
          document.getElementById(`btnDelMsg${item.id}`).addEventListener('click', (event) => {
            event.preventDefault()
            api.delete(`/api/v1/message_managements/messages/${item.id}`).then(res => {
              console.log(res)


              setTimeout(() => {
                setIsOpenNoti(true)
                setMsgNoti("削除しました。")
              }, 1500)
              setTimeout(function () {
                setIsOpenNoti(false)
              }, 2000);
              getBagMsg(group, id)
            }).catch(error => {
              console.log(error)
            })
          })
          document.getElementById(`btnUpdateMsg${item.id}`).addEventListener('click', (event) => {
            // setIdUpdateItemMsg(item.id)
            event.preventDefault()



            var upd = { message: { message_value: document.getElementById(`mgsCustomSaved${item.id}`).value, message_type: "msg", img_value: "" } }

            var add
            if (document.getElementById(`bagAddSC${item.id}`) != null || document.getElementById(`groupAddSC${item.id}`) != null || document.getElementById(`titleAddSC${item.id}`) != null) {
              var titlea = document.getElementById(`titleAddSC${item.id}`).value
              var groupva = document.getElementById(`groupAddSC${item.id}`).value
              var group_name = document.getElementById(`groupNameAddSC${item.id}`).value
              var bag_name = document.getElementById(`groupAddSC${item.id}`).value
              var bag = document.getElementById(`bagNameAddSC${item.id}`).value
              var type = document.getElementById(`typeAddSC${item.id}`).value
              var web = document.getElementById(`webAddSC${item.id}`).value
              var lbl = document.getElementById(`lblAddSC${item.id}_${bagAddSC}`).value
              console.log("lbl: ", lbl)
              var listLbl = lbl.substring(2, lbl.length).split(", ")
              var lastListLBL = []
              for (var i = 0; i < listLbl.length; i++) {
                lastListLBL.push({ label_name: listLbl[i] })
              }
              if (type == "mess") {
                add = {
                  message: {
                    message_bag_id: bagId,
                    message_value: document.getElementById(`mgsCustomSaved${item.id}`).value,
                    message_type: "msg",
                    img_value: "",
                    message_buttons: [
                      { button_type: "mess", title: titlea, message_bag_id: `${bag}`, message_button_labels: lastListLBL }
                    ]
                  }

                }
              } else if (type == "web_url") {
                add = {
                  message: {
                    message_bag_id: bagId,
                    message_value: document.getElementById(`mgsCustomSaved${item.id}`).value,
                    message_type: "msg",
                    img_value: "",
                    message_buttons: [
                      { button_type: "web_url", title: titlea, content: web, message_button_labels: lastListLBL }
                    ]
                  }

                }
              }
            } else if (document.getElementById(`titleAddTC${item.id}_${totalItemTC}`) != null) {
              var message_buttons = []
              console.log("totalItemTC: ", totalItemTC)
              var totalTCItem = document.getElementById(`totalItemTC${item.id}`).value

              console.log("mb ne: ", totalTCItem)
              for (var i = 1; i <= totalTCItem; i++) {

                var titlea = document.getElementById(`titleAddTC${item.id}_${i}`).value
                var groupva = document.getElementById(`groupAddTC${item.id}_${i}`).value
                var group_name = document.getElementById(`groupNameAddTC${item.id}_${i}`).value
                var bag_name = document.getElementById(`bagNameAddTC${item.id}_${i}`).value
                var bag = document.getElementById(`bagAddTC${item.id}_${i}`).value
                var type = document.getElementById(`typeAddTC${item.id}_${i}`).value
                var web = document.getElementById(`webAddTC${item.id}_${i}`).value
                var lbl = document.getElementById(`lblAddTCItem${item.id}_${i}`).value
                // console.log("lbl ne: ", lbl.substring(2, lbl.length))
                var listLbl = lbl.substring(2, lbl.length).split(", ")
                var lastListLBL = []
                for (var j = 0; j < listLbl.length; j++) {
                  lastListLBL.push({ label_name: listLbl[j] })
                }
                if (type == "mess") {

                  // add = {
                  //   message: { message_bag_id: bagId, message_value: "", message_type: "img", img_value: document.getElementById(`imgDataNum${numIndex}`).value },
                  //   message_button: [
                  //     { button_type: "mess", title: titlea, content: `+message_bag_id_${bag}` }
                  //   ]
                  // }

                  message_buttons.push({ button_type: "mess", title: titlea, message_bag_id: `${bag}`, message_button_labels: lastListLBL })
                } else if (type == "web_url") {
                  // add = {
                  //   message: { message_bag_id: bagId, message_value: "", message_type: "img", img_value: document.getElementById(`imgDataNum${numIndex}`).value },
                  //   message_button: [
                  //     { button_type: "web_url", title: titlea, content: web }
                  //   ]
                  // }

                  message_buttons.push({ button_type: "web_url", title: titlea, content: web, message_button_labels: lastListLBL })
                }
              }
              add = {
                message: {
                  message_bag_id: bagId,
                  message_value: document.getElementById(`mgsCustomSaved${item.id}`).value,
                  message_type: "msg",
                  img_value: "",
                  message_buttons
                },

              }
            } else if (document.getElementById(`formatCheckSelect${item.id}`) != null || document.getElementById(`formatCheckMSG${item.id}`) != null) {
              // var group = document.getElementById(`groupAddFI${idSC}`).value
              // var bag = document.getElementById(`bagAddFI${idSC}`).value
              var lbl = document.getElementById(`lblAddFI${item.id}_${bagAddSC}`).value
              var formatCheckSelect = document.getElementById(`formatCheckSelect${item.id}`).value
              var formatCheckMSG = document.getElementById(`formatCheckMSG${item.id}`).value
              console.log("lbl: ", lbl)
              var listLbl = lbl.substring(2, lbl.length).split(", ")
              var lastListLBL = []
              for (var i = 0; i < listLbl.length; i++) {
                lastListLBL.push({ label_name: listLbl[i] })
              }
              add = {
                message: {
                  message_bag_id: bagId,
                  message_value: document.getElementById(`mgsCustomSaved${item.id}`).value,
                  message_type: "msg",
                  img_value: "",
                  free_input: {
                    message_bag_id: `1`,
                    free_input_labels: lastListLBL,
                    format_check: formatCheckSelect, //nhan 3 gia tri "no_validate", "email", "phone_number" 
                    format_check_message: formatCheckMSG
                  }
                }
                // message_button: [
                //   { button_type: "format", title: '', content: `+message_bag_id_${bag}`, label: listLbl, format: formatCheckSelect, format_msg: formatCheckMSG }
                // ]
              }
            }
            else {
              add = {
                message: { message_bag_id: bagId, message_value: document.getElementById(`mgsCustomSaved${item.id}`).value, message_type: "msg", img_value: "" }
              }
            }

            console.log(add)

            setTotalItemTC(1)


            api.patch(`/api/v1/message_managements/messages/${item.id}`, add).then(res => {
              console.log(res)

              setTimeout(() => {
                setIsOpenNoti(true)
                setMsgNoti("更新しました。")
              }, 1500)

              setTimeout(function () {
                setIsOpenNoti(false)
              }, 2000);
              getBagMsg(group, id)
            }).catch(error => {
              console.log(error)
            })


          })


          // var element2 = document.getElementById(`msgOVIKey${item.id}`)
          // if (typeof (element2) != 'undefined' && element2 != null) {
          //   // Exists.
          //   document.getElementById(`msgOVIKey${item.id}`).value = item.received_message
          // } else if (element2 === null) {
          //   var abc = document.createElement(`div`)
          //   document.getElementById('logUserDiv').appendChild(abc)
          //   abc.innerHTML =
          //     `<div id="ovMsgKey${item.id}" style="width: 70%; background-color: #51cbce; padding: 10px; float:left; margin:5px; display:block; border-radius: 10px">
          //       <input type="text" id="msgOVIKey${item.id}" style="background-color: #51cbce; border: none" readonly/>
          //      </div>`
          //   document.getElementById(`msgOVIKey${item.id}`).value = item.received_message;
          // }

          var element1 = document.getElementById(`msgOVI${item.id}`)
          if (typeof (element1) != 'undefined' && element1 != null) {
            // Exists.
            document.getElementById(`msgOVI${item.id}`).value = item.message_value
          } else if (element1 === null) {
            var abc = document.createElement(`div`)
            document.getElementById('logUserDiv').appendChild(abc)
            abc.innerHTML =
              `<div id="ovMsg${item.id}" style="width: 100%; background-color: #51cbce; padding: 10px; margin:5px; display:block; float: right; border-radius: 10px">
                <textarea type="text" id="msgOVI${item.id}" style="width:90%; text-align: right; background-color: #51cbce; border: none; overflow-y:auto" readonly/>
               </div> `
            document.getElementById(`msgOVI${item.id}`).value = item.message_value

          }





        } else if (item.message_type == "img") {

          var updateItem = ""
          var choiceHTML = ""
          if (typeof item.free_input !== "undefined" && item.free_input !== null) {
            // if (typeof item.free_input !== "undefined" && item.free_input !== null) {
            // console.log("free input")
            choiceHTML =
              `
                <div id="itemFI${item.id}" >
                <div style="padding:0px 5px 10px 5px">Format check: ${item.free_input.format_check == "email"? "Email" : (item.free_input.format_check == "phone_number" ? "Phone Number" : "No validate")}</div>
                <div id="deleteChoice${item.id}" style="width:100%; padding:5px; display:none"> 
                  <button style="border: none; background-color:#f17e5d; border-radius:5px; color:white; font-weight:700; font-size:12px">
                    Delete
                  </button>
                </div>
                <input id="lblAddFI${item.free_input.message_id}" hidden type=text value="${item.free_input.free_input_labels}" />
                <input id="formatCheckSelect${item.free_input.message_id}" hidden type=text value=${item.free_input.format_check} />
                <input id="formatCheckMSG${item.free_input.message_id}" hidden type=text value="${item.free_input.format_check_message}" />
                
              </div>
              `
            updateItem = "free_input"
          } else if (item.message_buttons != []) {
            if (item.message_buttons.length == 1) {
              if (item.message_buttons[0].button_type == "mess") {
                choiceHTML =
                  `
                    <div id="itemSC${item.message_buttons[0].message_id}">
                    <div style="padding:10px 5px 0px 5px">${item.message_buttons[0].title}</div>
                    <input id="titleUPSC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].title} />
                    <input id="typeUPSC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].button_type} />
                    <input id="webUPSC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].content == null ? "" : item.message_buttons[0].content} />
                    <div style="padding:0px 5px 10px 5px">${item.message_buttons[0].message_group_name}/${item.message_buttons[0].message_bag_name}</div>
                  
                    <div id="deleteChoice${item.id}" style="width:100%; padding:5px; display:none"> 
                    <button style="border: none; background-color:#f17e5d; border-radius:5px; color:white; font-weight:700; font-size:12px">
                      Delete
                    </button>
                  </div>
                    <input id="bagUPTC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].message_bag_id} />
                    <input id="lblUPTCItem${item.message_buttons[0].message_id}" hidden type=text value="${item.message_buttons[0].message_button_labels}" />
                  </div>
                  `
                updateItem = "single_choice_msg"
              } else if (item.message_buttons[0].button_type == "web_url") {
                // if(item.message_buttons[0] != undefined){
                choiceHTML =
                  `
                    <div >
                    <div style="padding:10px 5px 0px 5px">${item.message_buttons[0].title}</div>  
                    <div style="padding:0px 5px 10px 5px">${item.message_buttons[0].content}</div>
                      

                    <input id="titleUPTC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].title} />
                    <input id="typeUPTC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].button_type} />
                    <input id="webUPTC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].content == null ? "" : item.message_buttons[0].content} />
                      
                    <div id="deleteChoice${item.id}" style="width:100%; padding:5px; display:none"> 
                    <button style="border: none; background-color:#f17e5d; border-radius:5px; color:white; font-weight:700; font-size:12px">
                      Delete
                    </button>
                  </div>
                    <input id="bagUPTC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].message_bag_id} />
                    <input id="lblUPTCItem${item.message_buttons[0].message_id}" hidden type=text value="${item.message_buttons[0].message_button_labels}" />
                    </div>
                    `
                updateItem = "single_choice_web"
                // }else{

                // }

              }
            } else if (item.message_buttons.length > 1) {
              console.log("nhieu item hon ne")
              for (var i = 0; i < item.message_buttons.length; i++) {
                if (item.message_buttons[i].button_type == "mess") {
                  console.log("mess ne")
                  choiceHTML = choiceHTML.concat(
                    `
                  <div id="itemTCUP${item.id}_${i}" style="border-bottom:${i == item.message_buttons.length - 1 ? "none" : "1px solid black"}; margin:auto; width:90%; text-align:center">
                  <div style="padding:10px 5px 0px 5px">${item.message_buttons[i].title}</div>  
                  <div style="padding:0px 5px 10px 5px">${item.message_buttons[i].message_group_name}/${item.message_buttons[i].message_bag_name}</div>
                    <input id="titleUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].title} />
                  <input id="typeUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].button_type} />
                  <input id="webUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].content == null ? "" : item.message_buttons[i].content} />
                    
                  <div id="deleteChoice${item.id}_${i}" style="width:100%; padding:5px; display:none"> 
                  <button style="border: none; background-color:#f17e5d; border-radius:5px; color:white; font-weight:700; font-size:12px">
                    Delete
                  </button>
                </div>
                  <input id="bagUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].message_bag_id} />
                  <input id="lblUPTCItem${item.message_buttons[i].message_id}" hidden type=text value="${item.message_buttons[i].message_button_labels}" />
                  </div>
                  `
                  )
                  // <input id="groupAddFI${item.id}" hidden type=text value=${`group value here`} />
                } else if (item.message_buttons[i].button_type == "web_url") {
                  console.log("web ne")
                  choiceHTML = choiceHTML.concat(
                    `
                    <div id="itemTCUP${item.id}_${i}" style="border-bottom:${i == item.message_buttons.length - 1 ? "none" : "1px solid black"}; margin:auto; width:90%; text-align:center">
                    <div style="padding:10px 5px 0px 5px;">${item.message_buttons[i].title}</div>  
                    <div style="padding:0px 5px 10px 5px">${item.message_buttons[i].content}</div>
                    <input id="titleUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].title} />
                    <input id="typeUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].button_type} />
                    <input id="webUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].content == null ? "" : item.message_buttons[i].content} />
                    <div id="deleteChoice${item.id}_${i}" style="width:100%; padding:5px; display:none"> 
                    <button style="border: none; background-color:#f17e5d; border-radius:5px; color:white; font-weight:700; font-size:12px">
                      Delete
                    </button>
                  </div>
                    <input id="bagUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].message_bag_id} />
                    <input id="lblUPTCItem${item.message_buttons[i].message_id}" hidden type=text value="${item.message_buttons[i].message_button_labels}" />
                    </div>
                    `
                  )
                }
              }

              updateItem = "three_choice"
            }

          }





          var abc = document.createElement("div")
          document.getElementById("div_custom").appendChild(abc)
          abc.innerHTML =
            `<div id="chatbot_image${item.id}" style="border-radius: 20px; margin-top: 20px; display:block; background-color: rgb(244, 243, 239); padding: 40px; ">
            <div><textarea name="imgKey${item.id}" class="mgsChatbot" style="display:none" id="imgCustomKey${item.id}" placeholder="キーワード入力..." type="text" rows="3"></textarea></div><br />
          <input id="imgNumSaved${item.id}" name="imageChatbot" type="file" accept="image/*" />
          <input id="imgDataNumSaved${item.id}" name="imgchatbot${item.id}" type=hidden /> <br /><br />
          <div style=" text-align: center">
            <img id="output${item.id}" style=" max-height: 200px; max-width: 40%"  />
          </div>


          <div id="choice${item.id}">
    
              </div>

              
              <div id="msgChoice${item.id}" style="display:none">
                <div style="display: flex">
                  <div id="singleChoice${item.id}" style=" padding:5px">
                    <button style="background-color:#FFFFFF; border: 1px solid #51cbce; border-radius:10px">Single choice</button>
                  </div>
                  <div id="threeChoice${item.id}" style=" padding:5px">
                    <button style="background-color:#FFFFFF; border: 1px solid #51cbce; border-radius:10px">Three choice</button>
                  </div>
                  <div id="freeInput${item.id}" style=" padding:5px">
                    <button style="background-color:#FFFFFF; border: 1px solid #51cbce; border-radius:10px">Free input</button>
                  </div>
                </div>
              </div>
              </br>
              <div style=" border-radius:10px; background-color:white; width:200px; text-align:center">
                <div id="choiceOption${item.id}" style=" border-radius:10px; background-color:white; width:200px; text-align:center">
                
                </div>
                <div id="choiceThree${item.id}" style="display:none;border-radius:10px"></div>
              </div>




          <div id="btnDelImg${item.id}" style="float:right;">
              <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
              font-weight:800">削除</button>
            </div>
            <div id="btnUpdateImg${item.id}" style="float:right;">
              <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
              font-weight:800">更新</button>
            </div>
        </div>`
          var choiceNe = document.createElement("div")
          document.getElementById(`choiceOption${item.id}`).appendChild(choiceNe)
          choiceNe.innerHTML = choiceHTML

          document.getElementById(`imgCustomKey${item.id}`).value = item.received_message
          document.getElementById(`imgNumSaved${item.id}`).addEventListener('change', (e) => loadFileSaved(e, item.id))
          document.getElementById(`output${item.id}`).src = `https://ec-chatbot-test.com${item.img_value.url}`




          document.getElementById(`singleChoice${item.id}`).addEventListener('click', (event) => {
            event.preventDefault()
            updateMsgSC(item.id)
          })
          document.getElementById(`threeChoice${item.id}`).addEventListener('click', (event) => {
            event.preventDefault()
            updateMsgTC(item.id)
          })
          document.getElementById(`freeInput${item.id}`).addEventListener('click', (event) => {
            event.preventDefault()
            updateMsgFI(item.id)
          })




          // Update item down here
          if (updateItem == "") {
            document.getElementById(`msgChoice${item.id}`).style.display = "block"
          }

          //This one use to delete choice deleteChoice
          document.getElementById(`choiceOption${item.id}`).addEventListener("click", (e) => {
            e.preventDefault()

            if (updateItem == "three_choice") {
              var idThreeChoiceDelete = item.message_buttons.length - 1
              document.getElementById(`deleteChoice${item.id}_${idThreeChoiceDelete}`).style.display = "block"
              document.getElementById(`deleteChoice${item.id}_${idThreeChoiceDelete}`).addEventListener('click', (e) => {
                e.preventDefault()
                var upd = { message: { message_value: "", message_type: "img", img_value: document.getElementById(`imgDataNumSaved${item.id}`).value } }
                api.patch(`/api/v1/message_managements/messages/${item.id}`, upd).then(res => {
                  console.log(res)
                  setTimeout(() => {
                    setIsOpenNoti(true)
                    setMsgNoti("更新しました。")
                  }, 1500)
                  setTimeout(function () {
                    setIsOpenNoti(false)
                  }, 2000);
                  getBagMsg(id, id)
                }).catch(error => {
                  console.log(error)
                })
              })
            }

            if (document.getElementById(`deleteChoice${item.id}`) != null) {
              document.getElementById(`deleteChoice${item.id}`).style.display = "block"
              document.getElementById(`deleteChoice${item.id}`).addEventListener("click", (event) => {
                event.preventDefault()
                // alert("delete ne")
                var upd = { message: { message_value: "", message_type: "img", img_value: document.getElementById(`imgDataNumSaved${item.id}`).value } }
                api.patch(`/api/v1/message_managements/messages/${item.id}`, upd).then(res => {
                  console.log(res)
                  setTimeout(() => {
                    setIsOpenNoti(true)
                    setMsgNoti("更新しました。")
                  }, 1500)
                  setTimeout(function () {
                    setIsOpenNoti(false)
                  }, 2000);
                  getBagMsg(id, id)
                }).catch(error => {
                  console.log(error)
                })
              })
            }
          })

          // // Update item down here
          // if(updateItem == ""){
          //   document.getElementById(`msgChoice${item.id}`).style.display = "block"
          // }







          document.getElementById(`btnDelImg${item.id}`).addEventListener("click", (event) => {
            event.preventDefault()
            api.delete(`/api/v1/message_managements/messages/${item.id}`).then(res => {
              // alert("Delete Successfully")
              console.log(res)
              setTimeout(() => {
                setIsOpenNoti(true)
                setMsgNoti("削除しました。")
              }, 1500)

              setTimeout(function () {
                setIsOpenNoti(false)
              }, 2000);
              getBagMsg(group, id)
            }).catch(error => {
              console.log(error)
            })
          })


          document.getElementById(`btnUpdateImg${item.id}`).addEventListener("click", (event) => {
            event.preventDefault()


            // var upd = {
            //   message: { message_value: "", message_type: "img", img_value: document.getElementById(`imgDataNumSaved${item.id}`).value }
            // }




            var add
            if (document.getElementById(`bagAddSC${item.id}`) != null || document.getElementById(`groupAddSC${item.id}`) != null || document.getElementById(`titleAddSC${item.id}`) != null) {
              var titlea = document.getElementById(`titleAddSC${item.id}`).value
              var groupva = document.getElementById(`groupAddSC${item.id}`).value
              var group_name = document.getElementById(`groupNameAddSC${item.id}`).value
              var bag_name = document.getElementById(`groupAddSC${item.id}`).value
              var bag = document.getElementById(`bagNameAddSC${item.id}`).value
              var type = document.getElementById(`typeAddSC${item.id}`).value
              var web = document.getElementById(`webAddSC${item.id}`).value
              var lbl = document.getElementById(`lblAddSC${item.id}_${bagAddSC}`).value
              console.log("lbl: ", lbl)
              var listLbl = lbl.substring(2, lbl.length).split(", ")
              var lastListLBL = []
              for (var i = 0; i < listLbl.length; i++) {
                lastListLBL.push({ label_name: listLbl[i] })
              }
              if (type == "mess") {
                add = {
                  message: {
                    message_bag_id: bagId,
                    message_value: "",
                    message_type: "img",
                    img_value: document.getElementById(`imgDataNumSaved${item.id}`).value,
                    message_buttons: [
                      { button_type: "mess", title: titlea, message_bag_id: `${bag}`, message_button_labels: lastListLBL }
                    ]
                  }

                }
              } else if (type == "web_url") {
                add = {
                  message: {
                    message_bag_id: bagId,
                    message_value: "",
                    message_type: "img",
                    img_value: document.getElementById(`imgDataNumSaved${item.id}`).value,
                    message_buttons: [
                      { button_type: "web_url", title: titlea, content: web, message_button_labels: lastListLBL }
                    ]
                  }

                }
              }
            } else if (document.getElementById(`titleAddTC${item.id}_${totalItemTC}`) != null) {
              var message_buttons = []
              console.log("totalItemTC: ", totalItemTC)
              var totalTCItem = document.getElementById(`totalItemTC${item.id}`).value

              console.log("mb ne: ", totalTCItem)
              for (var i = 1; i <= totalTCItem; i++) {

                var titlea = document.getElementById(`titleAddTC${item.id}_${i}`).value
                var groupva = document.getElementById(`groupAddTC${item.id}_${i}`).value
                var group_name = document.getElementById(`groupNameAddTC${item.id}_${i}`).value
                var bag_name = document.getElementById(`bagNameAddTC${item.id}_${i}`).value
                var bag = document.getElementById(`bagAddTC${item.id}_${i}`).value
                var type = document.getElementById(`typeAddTC${item.id}_${i}`).value
                var web = document.getElementById(`webAddTC${item.id}_${i}`).value
                var lbl = document.getElementById(`lblAddTCItem${item.id}_${i}`).value
                // console.log("lbl ne: ", lbl.substring(2, lbl.length))
                var listLbl = lbl.substring(2, lbl.length).split(", ")
                var lastListLBL = []
                for (var j = 0; j < listLbl.length; j++) {
                  lastListLBL.push({ label_name: listLbl[j] })
                }
                if (type == "mess") {

                  // add = {
                  //   message: { message_bag_id: bagId, message_value: "", message_type: "img", img_value: document.getElementById(`imgDataNum${numIndex}`).value },
                  //   message_button: [
                  //     { button_type: "mess", title: titlea, content: `+message_bag_id_${bag}` }
                  //   ]
                  // }

                  message_buttons.push({ button_type: "mess", title: titlea, message_bag_id: `${bag}`, message_button_labels: lastListLBL })
                } else if (type == "web_url") {
                  // add = {
                  //   message: { message_bag_id: bagId, message_value: "", message_type: "img", img_value: document.getElementById(`imgDataNum${numIndex}`).value },
                  //   message_button: [
                  //     { button_type: "web_url", title: titlea, content: web }
                  //   ]
                  // }

                  message_buttons.push({ button_type: "web_url", title: titlea, content: web, message_button_labels: lastListLBL })
                }
              }
              add = {
                message: {
                  message_bag_id: bagId,
                  message_value: "",
                  message_type: "img",
                  img_value: document.getElementById(`imgDataNumSaved${item.id}`).value,
                  message_buttons
                },

              }
            } else if (document.getElementById(`formatCheckSelect${item.id}`) != null) {
              // var group = document.getElementById(`groupAddFI${idSC}`).value
              // var bag = document.getElementById(`bagAddFI${idSC}`).value
              var lbl = document.getElementById(`lblAddFI${item.id}_${bagAddSC}`).value
              var formatCheckSelect = document.getElementById(`formatCheckSelect${item.id}`).value
              var formatCheckMSG = document.getElementById(`formatCheckMSG${item.id}`).value
              console.log("lbl: ", lbl)
              var listLbl = lbl.substring(2, lbl.length).split(", ")
              var lastListLBL = []
              for (var i = 0; i < listLbl.length; i++) {
                lastListLBL.push({ label_name: listLbl[i] })
              }
              add = {
                message: {
                  message_bag_id: bagId,
                  message_value: "",
                  message_type: "img",
                  img_value: document.getElementById(`imgDataNumSaved${item.id}`).value,
                  free_input: {
                    message_bag_id: `1`,
                    free_input_labels: lastListLBL,
                    format_check: formatCheckSelect, //nhan 3 gia tri "no_validate", "email", "phone_number" 
                    format_check_message: formatCheckMSG
                  }
                },
                // message_button: [
                //   { button_type: "format", title: '', content: `+message_bag_id_${bag}`, label: listLbl, format: formatCheckSelect, format_msg: formatCheckMSG }
                // ]
              }
            }
            else {
              add = {
                message: { message_bag_id: bagId, message_value: document.getElementById(`mgsCustomSaved${item.id}`).value, message_type: "msg", img_value: "" }
              }
            }

            console.log(add)

            setTotalItemTC(1)


            api.patch(`/api/v1/message_managements/messages/${item.id}`, add).then(res => {
              console.log(res)

              setTimeout(() => {
                setIsOpenNoti(true)
                setMsgNoti("更新しました。")
              }, 1500)

              setTimeout(function () {
                setIsOpenNoti(false)
              }, 2000);
              getBagMsg(id, id)
            }).catch(error => {
              console.log(error)
            })


            // api.patch(`/api/v1/message_managements/messages/${item.id}`, upd).then(res => {
            //   // alert("Delete Successfully")
            //   console.log(res)
            //   setTimeout(() => {
            //     setIsOpenNoti(true)
            //     setMsgNoti("更新しました。")
            //   }, 1500)

            //   setTimeout(function () {
            //     setIsOpenNoti(false)
            //   }, 2000);
            //   getBagMsg(group, id)
            // }).catch(error => {
            //   console.log(error)
            // })
          })


          // console.log('value ne: ',document.getElementById(`output${item.id}`))
          // document.getElementById(`imgNum${item.id}`).value = item.img_value.src

          // getBaseUrlDis(item.id, item.img_value.url)



          // const toDataURL = url => fetch(url)
          //   .then(response => response.blob())
          //   .then(blob => new Promise((resolve, reject) => {
          //     const reader = new FileReader()
          //     reader.onloadend = () => resolve(reader.result)
          //     reader.onerror = reject
          //     reader.readAsDataURL(blob)
          //   }))


          // toDataURL(`https://ec-chatbot-test.com/${item.img_value.url}`)
          //   .then(dataUrl => {
          //     console.log('RESULT:', dataUrl)
          //   })

          var src = document.getElementById(`output${item.id}`).src

          const getEmergencyFoundImg = urlImg => {
            var img = new Image();
            img.src = urlImg;
            img.crossOrigin = 'Anonymous';

            var canvas = document.createElement('canvas'),
              ctx = canvas.getContext('2d');

            canvas.height = img.naturalHeight;
            canvas.width = img.naturalWidth;
            ctx.drawImage(img, 0, 0);

            var b64 = canvas.toDataURL('image/png').replace(/^data:image.+;base64,/, '');
            return b64;
          };
          // document.getElementById(`output${item.id}`).setAttribute('crossOrigin', 'anonymous')

          // console.log(getEmergencyFoundImg(src))

          // document.getElementById(`output${item.id}`).setAttribute('crossOrigin', 'anonymous')
          //           var c = document.createElement('canvas');
          //           var img = document.getElementById(`output${item.id}`);
          //           c.height = img.naturalHeight;
          //           c.width = img.naturalWidth;
          //           var ctx = c.getContext('2d');

          //           ctx.drawImage(img, 0, 0, c.width, c.height);
          //           var base64String = c.toDataURL('image/jpeg');
          // console.log('base: ',base64String)


          // function toDataURL(src, callback){
          //   var image = new Image();

          //   image.onload = function(){
          //     var canvas = document.createElement('canvas');
          //     var context = canvas.getContext('2d');
          //     canvas.height = this.naturalHeight;
          //     canvas.width = this.naturalWidth;
          //     context.drawImage(this, 0, 0);
          //     var dataURL = canvas.toDataURL('image/jpeg');
          //     callback(dataURL);
          //   };
          //   image.src = src;
          // }
          //     toDataURL(`https://ec-chatbot-test.com/${item.img_value.url}`, function(dataURL){
          //       alert(dataURL);      
          //   })


          // function toDataURL(url, callback) {
          //   var httpRequest = new XMLHttpRequest();

          //   httpRequest.onload = function () {
          //     var fileReader = new FileReader();
          //     fileReader.onloadend = function () {
          //       callback(fileReader.result);
          //     }
          //     fileReader.readAsDataURL(httpRequest.response);
          //   };
          //   httpRequest.open('GET', url);
          //   httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencode');
          //   httpRequest.setRequestHeader( 'Access-Control-Allow-Origin', '*');
          //   httpRequest.responseType = 'blob';
          //   httpRequest.send();
          // }
          // toDataURL(`https://ec-chatbot-test.com/${item.img_value.url}`, function (dataUrl) {
          //   console.log('Result in string:', dataUrl)
          // })





          // console.log(encrypt(item.img_value.url))

          // console.log(document.getElementById(`imgDataNum${item.id}`).value)
          // document.getElementById(`imgDataNum${item.id}`).value = encrypt(item.img_value.url)
          // document.getElementById(`imgNum${item.id}`).addEventListener('change', (e) => loadFile(e))
          // document.getElementById(`btnDelImg${item.id}`).addEventListener('click', () => deleteImgCB(item.id))

          var element1 = document.getElementById(`outputOV${item.id}`)
          if (typeof (element1) != 'undefined' && element1 != null) {
            // Exists.
            document.getElementById(`outputOV${item.id}`).src = `https://ec-chatbot-test.com${item.img_value.url}`
          } else if (element1 === null) {
            var abc = document.createElement(`div`)
            document.getElementById('logUserDiv').appendChild(abc)
            abc.innerHTML =
              `
              <div style="width: 100%; padding: 10px; margin:5px; display:block; float: right; border-radius: 10px">
              <img id="outputOV${item.id}" style="max-height: 200px; display: block; margin:5px; max-width: 65%; float:right" src="${`https://ec-chatbot-test.com${item.img_value.url}`}">
               </div> 
              `
            // document.getElementById(`msgOVI${item.id}`).value = item.message_value

          }

        } else if (item.message_type == "img_msg") {


          var updateItem = ""
          var choiceHTML = ""
          if (typeof item.free_input !== "undefined" && item.free_input !== null) {
            // if (typeof item.free_input !== "undefined" && item.free_input !== null) {
            // console.log("free input")
            choiceHTML =
              `
                <div id="itemFI${item.id}" >
                <div style="padding:0px 5px 10px 5px">Format check: ${item.free_input.format_check == "email"? "Email" : (item.free_input.format_check == "phone_number" ? "Phone Number" : "No validate")}</div>
                <div id="deleteChoice${item.id}" style="width:100%; padding:5px; display:none"> 
                  <button style="border: none; background-color:#f17e5d; border-radius:5px; color:white; font-weight:700; font-size:12px">
                    Delete
                  </button>
                </div>
                <input id="lblAddFI${item.free_input.message_id}" hidden type=text value="${item.free_input.free_input_labels}" />
                <input id="formatCheckSelect${item.free_input.message_id}" hidden type=text value=${item.free_input.format_check} />
                <input id="formatCheckMSG${item.free_input.message_id}" hidden type=text value="${item.free_input.format_check_message}" />
                
              </div>
              `
            updateItem = "free_input"
          } else if (item.message_buttons != []) {
            if (item.message_buttons.length == 1) {
              if (item.message_buttons[0].button_type == "mess") {
                choiceHTML =
                  `
                    <div id="itemSC${item.message_buttons[0].message_id}">
                    <div style="padding:10px 5px 0px 5px">${item.message_buttons[0].title}</div>
                    <input id="titleUPSC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].title} />
                    <input id="typeUPSC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].button_type} />
                    <input id="webUPSC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].content == null ? "" : item.message_buttons[0].content} />
                    <div style="padding:0px 5px 10px 5px">${item.message_buttons[0].message_group_name}/${item.message_buttons[0].message_bag_name}</div>
                  
                    <div id="deleteChoice${item.id}" style="width:100%; padding:5px; display:none"> 
                    <button style="border: none; background-color:#f17e5d; border-radius:5px; color:white; font-weight:700; font-size:12px">
                      Delete
                    </button>
                  </div>
                    <input id="bagUPTC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].message_bag_id} />
                    <input id="lblUPTCItem${item.message_buttons[0].message_id}" hidden type=text value="${item.message_buttons[0].message_button_labels}" />
                  </div>
                  `
                updateItem = "single_choice_msg"
              } else if (item.message_buttons[0].button_type == "web_url") {
                // if(item.message_buttons[0] != undefined){
                choiceHTML =
                  `
                    <div >
                    <div style="padding:10px 5px 0px 5px">${item.message_buttons[0].title}</div>  
                    <div style="padding:0px 5px 10px 5px">${item.message_buttons[0].content}</div>
                      

                    <input id="titleUPTC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].title} />
                    <input id="typeUPTC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].button_type} />
                    <input id="webUPTC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].content == null ? "" : item.message_buttons[0].content} />
                      
                    <div id="deleteChoice${item.id}" style="width:100%; padding:5px; display:none"> 
                    <button style="border: none; background-color:#f17e5d; border-radius:5px; color:white; font-weight:700; font-size:12px">
                      Delete
                    </button>
                  </div>
                    <input id="bagUPTC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].message_bag_id} />
                    <input id="lblUPTCItem${item.message_buttons[0].message_id}" hidden type=text value="${item.message_buttons[0].message_button_labels}" />
                    </div>
                    `
                updateItem = "single_choice_web"
                // }else{

                // }

              }
            } else if (item.message_buttons.length > 1) {
              console.log("nhieu item hon ne")
              for (var i = 0; i < item.message_buttons.length; i++) {
                if (item.message_buttons[i].button_type == "mess") {
                  console.log("mess ne")
                  choiceHTML = choiceHTML.concat(
                    `
                  <div id="itemTCUP${item.id}_${i}" style="border-bottom:${i == item.message_buttons.length - 1 ? "none" : "1px solid black"}; margin:auto; width:90%; text-align:center">
                  <div style="padding:10px 5px 0px 5px">${item.message_buttons[i].title}</div>  
                  <div style="padding:0px 5px 10px 5px">${item.message_buttons[i].message_group_name}/${item.message_buttons[i].message_bag_name}</div>
                    <input id="titleUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].title} />
                  <input id="typeUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].button_type} />
                  <input id="webUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].content == null ? "" : item.message_buttons[i].content} />
                    
                  <div id="deleteChoice${item.id}_${i}" style="width:100%; padding:5px; display:none"> 
                  <button style="border: none; background-color:#f17e5d; border-radius:5px; color:white; font-weight:700; font-size:12px">
                    Delete
                  </button>
                </div>
                  <input id="bagUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].message_bag_id} />
                  <input id="lblUPTCItem${item.message_buttons[i].message_id}" hidden type=text value="${item.message_buttons[i].message_button_labels}" />
                  </div>
                  `
                  )
                  // <input id="groupAddFI${item.id}" hidden type=text value=${`group value here`} />
                } else if (item.message_buttons[i].button_type == "web_url") {
                  console.log("web ne")
                  choiceHTML = choiceHTML.concat(
                    `
                    <div id="itemTCUP${item.id}_${i}" style="border-bottom:${i == item.message_buttons.length - 1 ? "none" : "1px solid black"}; margin:auto; width:90%; text-align:center">
                    <div style="padding:10px 5px 0px 5px;">${item.message_buttons[i].title}</div>  
                    <div style="padding:0px 5px 10px 5px">${item.message_buttons[i].content}</div>
                    <input id="titleUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].title} />
                    <input id="typeUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].button_type} />
                    <input id="webUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].content == null ? "" : item.message_buttons[i].content} />
                    <div id="deleteChoice${item.id}_${i}" style="width:100%; padding:5px; display:none"> 
                    <button style="border: none; background-color:#f17e5d; border-radius:5px; color:white; font-weight:700; font-size:12px">
                      Delete
                    </button>
                  </div>
                    <input id="bagUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].message_bag_id} />
                    <input id="lblUPTCItem${item.message_buttons[i].message_id}" hidden type=text value="${item.message_buttons[i].message_button_labels}" />
                    </div>
                    `
                  )
                }
              }

              updateItem = "three_choice"
            }

          }



          var abc = document.createElement("div")
          document.getElementById("div_custom").appendChild(abc)
          abc.innerHTML =
            `<div id="chatbot_image_msg${item.id}" style="border-radius: 20px; margin-top: 20px; background-color: rgb(244, 243, 239); padding: 40px; ">
            <div><textarea name="imgMsgKey${item.id}" style="display:none" class="mgsChatbot" id="imgMgsCustomKey${item.id}" placeholder="キーワード入力..." type="text" rows="3"></textarea></div><br />
          <input id="imgMsgNumSaved${item.id}" type="file" accept="image/*" /> <br /><br />
          <input id="imgValueMsgNumSaved${item.id}" name="imgValueMsgChatbot${item.id}" type=hidden /> <br /><br />
          <div style=" text-align: center" }}>
            <img id="outputImgMsgSaved${item.id}" style=" max-height: 200px; max-width: 40%" }} />
          </div>
          <div style="text-align: center">
          <textarea class="mgsChatbot" id="imgMgsCustomSaved${item.id}" name="imgMsgValueChatbot${item.id}" placeholder="返事入力..." type="text" rows="3"></textarea>
          </div>





          <div id="choice${item.id}">
    
              </div>

              <div id="msgChoice${item.id}" style="display:none">
                <div style="display: flex">
                  <div id="singleChoice${item.id}" style=" padding:5px">
                    <button style="background-color:#FFFFFF; border: 1px solid #51cbce; border-radius:10px">Single choice</button>
                  </div>
                  <div id="threeChoice${item.id}" style=" padding:5px">
                    <button style="background-color:#FFFFFF; border: 1px solid #51cbce; border-radius:10px">Three choice</button>
                  </div>
                  <div id="freeInput${item.id}" style=" padding:5px">
                    <button style="background-color:#FFFFFF; border: 1px solid #51cbce; border-radius:10px">Free input</button>
                  </div>
                </div>
              </div>
              </br>
              <div style=" border-radius:10px; background-color:white; width:200px; text-align:center">
                <div id="choiceOption${item.id}" style=" border-radius:10px; background-color:white; width:200px; text-align:center">
                
                </div>
                <div id="choiceThree${item.id}" style="display:none;border-radius:10px"></div>
              </div>





          <div id="btnDelImgMsg${item.id}" style="float:right;">
              <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
              font-weight:800">削除</button>
            </div>
            <div id="btnUpImgMsg${item.id}" style="float:right;">
              <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
              font-weight:800">更新</button>
            </div>
        </div>`
          var choiceNe = document.createElement("div")
          document.getElementById(`choiceOption${item.id}`).appendChild(choiceNe)
          choiceNe.innerHTML = choiceHTML

          document.getElementById(`imgMgsCustomKey${item.id}`).value = item.received_message
          document.getElementById(`imgMgsCustomSaved${item.id}`).value = item.message_value
          document.getElementById(`outputImgMsgSaved${item.id}`).src = `https://ec-chatbot-test.com${item.img_value.url}`




          document.getElementById(`singleChoice${item.id}`).addEventListener('click', (event) => {
            event.preventDefault()
            updateMsgSC(item.id)
          })
          document.getElementById(`threeChoice${item.id}`).addEventListener('click', (event) => {
            event.preventDefault()
            updateMsgTC(item.id)
          })
          document.getElementById(`freeInput${item.id}`).addEventListener('click', (event) => {
            event.preventDefault()
            updateMsgFI(item.id)
          })

          // Update item down here
          if (updateItem == "") {
            document.getElementById(`msgChoice${item.id}`).style.display = "block"
          }


          //This one use to delete choice deleteChoice
          document.getElementById(`choiceOption${item.id}`).addEventListener("click", (e) => {
            e.preventDefault()

            if (updateItem == "three_choice") {
              var idThreeChoiceDelete = item.message_buttons.length - 1
              document.getElementById(`deleteChoice${item.id}_${idThreeChoiceDelete}`).style.display = "block"
              document.getElementById(`deleteChoice${item.id}_${idThreeChoiceDelete}`).addEventListener('click', (e) => {
                e.preventDefault()
                var upd = { message: { message_value: document.getElementById(`imgMgsCustomSaved${item.id}`).value, message_type: "img_msg", img_value: document.getElementById(`imgValueMsgNumSaved${item.id}`).value } }
                api.patch(`/api/v1/message_managements/messages/${item.id}`, upd).then(res => {
                  console.log(res)
                  setTimeout(() => {
                    setIsOpenNoti(true)
                    setMsgNoti("更新しました。")
                  }, 1500)
                  setTimeout(function () {
                    setIsOpenNoti(false)
                  }, 2000);
                  getBagMsg(id, id)
                }).catch(error => {
                  console.log(error)
                })
              })
            }

            if (document.getElementById(`deleteChoice${item.id}`) != null) {
              document.getElementById(`deleteChoice${item.id}`).style.display = "block"
              document.getElementById(`deleteChoice${item.id}`).addEventListener("click", (event) => {
                event.preventDefault()
                // alert("delete ne")
                var upd = { message: { message_value: document.getElementById(`imgMgsCustomSaved${item.id}`).value, message_type: "img_msg", img_value: document.getElementById(`imgValueMsgNumSaved${item.id}`).value } }
                api.patch(`/api/v1/message_managements/messages/${item.id}`, upd).then(res => {
                  console.log(res)
                  setTimeout(() => {
                    setIsOpenNoti(true)
                    setMsgNoti("更新しました。")
                  }, 1500)
                  setTimeout(function () {
                    setIsOpenNoti(false)
                  }, 2000);
                  getBagMsg(id, id)
                }).catch(error => {
                  console.log(error)
                })
              })
            }
          })



          // document.getElementById(`imgMsgNum${item.id}`).addEventListener('change', (e) => loadFileImgMsg(e))
          document.getElementById(`imgMgsCustomSaved${item.id}`).addEventListener('change', (e) => imgMsgOVSaved(e.target.value, item.id))
          // document.getElementById(`imgMsgNum${item.id}`).addEventListener('change', () => { document.getElementById(`btnDelImgMsg${item.id}`).style.display = 'block' })
          // document.getElementById(`imgMgsCustom${item.id}`).addEventListener('change', () => { document.getElementById(`btnDelImgMsg${item.id}`).style.display = 'block' })
          document.getElementById(`imgMsgNumSaved${item.id}`).addEventListener('change', (e) => loadFileImgMsgSaved(e, item.id))
          document.getElementById(`btnDelImgMsg${item.id}`).addEventListener('click', (event) => {
            event.preventDefault()
            api.delete(`/api/v1/message_managements/messages/${item.id}`).then(res => {
              console.log(res)
              setTimeout(() => {
                setIsOpenNoti(true)
                setMsgNoti("削除しました。")
              }, 1500)

              setTimeout(function () {
                setIsOpenNoti(false)
              }, 2000);
              getBagMsg(group, id)
            }).catch(error => {
              console.log(error)
            })
          })



          document.getElementById(`btnUpImgMsg${item.id}`).addEventListener('click', (event) => {
            event.preventDefault()


            // var upd = {
            //   message: { message_value: document.getElementById(`imgMgsCustomSaved${item.id}`).value, message_type: "img_msg", img_value: document.getElementById(`imgValueMsgNumSaved${item.id}`).value }
            // }


            var add
            if (document.getElementById(`bagAddSC${item.id}`) != null || document.getElementById(`groupAddSC${item.id}`) != null || document.getElementById(`titleAddSC${item.id}`) != null) {
              var titlea = document.getElementById(`titleAddSC${item.id}`).value
              var groupva = document.getElementById(`groupAddSC${item.id}`).value
              var group_name = document.getElementById(`groupNameAddSC${item.id}`).value
              var bag_name = document.getElementById(`groupAddSC${item.id}`).value
              var bag = document.getElementById(`bagNameAddSC${item.id}`).value
              var type = document.getElementById(`typeAddSC${item.id}`).value
              var web = document.getElementById(`webAddSC${item.id}`).value
              var lbl = document.getElementById(`lblAddSC${item.id}_${bagAddSC}`).value
              console.log("lbl: ", lbl)
              var listLbl = lbl.substring(2, lbl.length).split(", ")
              var lastListLBL = []
              for (var i = 0; i < listLbl.length; i++) {
                lastListLBL.push({ label_name: listLbl[i] })
              }
              if (type == "mess") {
                add = {
                  message: {
                    message_bag_id: bagId,
                    message_value: document.getElementById(`imgMgsCustomSaved${item.id}`).value,
                    message_type: "img_msg",
                    img_value: document.getElementById(`imgValueMsgNumSaved${item.id}`).value,
                    message_buttons: [
                      { button_type: "mess", title: titlea, message_bag_id: `${bag}`, message_button_labels: lastListLBL }
                    ]
                  }

                }
              } else if (type == "web_url") {
                add = {
                  message: {
                    message_bag_id: bagId,
                    message_value: document.getElementById(`imgMgsCustomSaved${item.id}`).value,
                    message_type: "img_msg",
                    img_value: document.getElementById(`imgValueMsgNumSaved${item.id}`).value,
                    message_buttons: [
                      { button_type: "web_url", title: titlea, content: web, message_button_labels: lastListLBL }
                    ]
                  }

                }
              }
            } else if (document.getElementById(`titleAddTC${item.id}_${totalItemTC}`) != null) {
              var message_buttons = []
              console.log("totalItemTC: ", totalItemTC)
              var totalTCItem = document.getElementById(`totalItemTC${item.id}`).value

              console.log("mb ne: ", totalTCItem)
              for (var i = 1; i <= totalTCItem; i++) {

                var titlea = document.getElementById(`titleAddTC${item.id}_${i}`).value
                var groupva = document.getElementById(`groupAddTC${item.id}_${i}`).value
                var group_name = document.getElementById(`groupNameAddTC${item.id}_${i}`).value
                var bag_name = document.getElementById(`bagNameAddTC${item.id}_${i}`).value
                var bag = document.getElementById(`bagAddTC${item.id}_${i}`).value
                var type = document.getElementById(`typeAddTC${item.id}_${i}`).value
                var web = document.getElementById(`webAddTC${item.id}_${i}`).value
                var lbl = document.getElementById(`lblAddTCItem${item.id}_${i}`).value
                // console.log("lbl ne: ", lbl.substring(2, lbl.length))
                var listLbl = lbl.substring(2, lbl.length).split(", ")
                var lastListLBL = []
                for (var j = 0; j < listLbl.length; j++) {
                  lastListLBL.push({ label_name: listLbl[j] })
                }
                if (type == "mess") {

                  // add = {
                  //   message: { message_bag_id: bagId, message_value: "", message_type: "img", img_value: document.getElementById(`imgDataNum${numIndex}`).value },
                  //   message_button: [
                  //     { button_type: "mess", title: titlea, content: `+message_bag_id_${bag}` }
                  //   ]
                  // }

                  message_buttons.push({ button_type: "mess", title: titlea, message_bag_id: `${bag}`, message_button_labels: lastListLBL })
                } else if (type == "web_url") {
                  // add = {
                  //   message: { message_bag_id: bagId, message_value: "", message_type: "img", img_value: document.getElementById(`imgDataNum${numIndex}`).value },
                  //   message_button: [
                  //     { button_type: "web_url", title: titlea, content: web }
                  //   ]
                  // }

                  message_buttons.push({ button_type: "web_url", title: titlea, content: web, message_button_labels: lastListLBL })
                }
              }
              add = {
                message: {
                  message_bag_id: bagId,
                  message_value: document.getElementById(`imgMgsCustomSaved${item.id}`).value,
                  message_type: "img_msg",
                  img_value: document.getElementById(`imgValueMsgNumSaved${item.id}`).value,
                  message_buttons
                },

              }
            } else if (document.getElementById(`formatCheckSelect${item.id}`) != null) {
              // var group = document.getElementById(`groupAddFI${idSC}`).value
              // var bag = document.getElementById(`bagAddFI${idSC}`).value
              var lbl = document.getElementById(`lblAddFI${item.id}_${bagAddSC}`).value
              var formatCheckSelect = document.getElementById(`formatCheckSelect${item.id}`).value
              var formatCheckMSG = document.getElementById(`formatCheckMSG${item.id}`).value
              console.log("lbl: ", lbl)
              var listLbl = lbl.substring(2, lbl.length).split(", ")
              var lastListLBL = []
              for (var i = 0; i < listLbl.length; i++) {
                lastListLBL.push({ label_name: listLbl[i] })
              }
              add = {
                message: {
                  message_bag_id: bagId,
                  message_value: document.getElementById(`imgMgsCustomSaved${item.id}`).value,
                  message_type: "img_msg",
                  img_value: document.getElementById(`imgValueMsgNumSaved${item.id}`).value,
                  free_input: {
                    message_bag_id: `1`,
                    free_input_labels: lastListLBL,
                    format_check: formatCheckSelect, //nhan 3 gia tri "no_validate", "email", "phone_number" 
                    format_check_message: formatCheckMSG
                  }
                },
                // message_button: [
                //   { button_type: "format", title: '', content: `+message_bag_id_${bag}`, label: listLbl, format: formatCheckSelect, format_msg: formatCheckMSG }
                // ]
              }
            }
            else {
              add = {
                message: { message_bag_id: bagId, message_value: document.getElementById(`mgsCustomSaved${item.id}`).value, message_type: "msg", img_value: "" }
              }
            }

            console.log(add)

            setTotalItemTC(1)


            api.patch(`/api/v1/message_managements/messages/${item.id}`, add).then(res => {
              console.log(res)

              setTimeout(() => {
                setIsOpenNoti(true)
                setMsgNoti("更新しました。")
              }, 1500)

              setTimeout(function () {
                setIsOpenNoti(false)
              }, 2000);
              getBagMsg(id, id)
            }).catch(error => {
              console.log(error)
            })



            // api.patch(`/api/v1/message_managements/messages/${item.id}`, upd).then(res => {
            //   // alert("Delete Successfully")
            //   console.log(res)
            //   setTimeout(() => {
            //     setIsOpenNoti(true)
            //     setMsgNoti("更新しました。")
            //   }, 1500)

            //   setTimeout(function () {
            //     setIsOpenNoti(false)
            //   }, 2000);
            //   getBagMsg(group, id)
            // }).catch(error => {
            //   console.log(error)
            // })
          })

          var element1 = document.getElementById(`imgMsgOVI${item.id}`)
          var element2 = document.getElementById(`outputImgMsgOV${item.id}`)

          if ((typeof (element1) != 'undefined' && element1 != null) || (typeof (element2) != 'undefined' && element2 != null)) {
            // Exists.
            document.getElementById(`imgMsgOVI${item.id}`).value = item.message_value
            document.getElementById(`outputImgMsgOV${item.id}`).src = `https://ec-chatbot-test.com${item.img_value.url}`
          } else if (element1 === null) {
            var abc = document.createElement(`div`)
            document.getElementById('logUserDiv').appendChild(abc)
            abc.innerHTML =
              `
              <div id="ovMsg${item.id}" style="width: 100%; background-color: #51cbce; padding: 10px; margin:5px; display:block; float: right; border-radius: 10px">
                <textarea type="text" id="imgMsgOVI${item.id}" style="width:90%; text-align: right; background-color: #51cbce; border: none; overflow-y:auto" readonly/>
               </div> 
              `
            var abc1 = document.createElement(`div`)
            document.getElementById('logUserDiv').appendChild(abc1)
            abc1.innerHTML = `<br /><img id="outputImgMsgOV${item.id}" style="max-height: 200px; display: block; margin:5px; max-width: 65%; float:right" src="${`https://ec-chatbot-test.com${item.img_value.url}`}">`
            document.getElementById(`imgMsgOVI${item.id}`).value = item.message_value

          }
        } else if (item.message_type == "past_post") {
          // alert ("PP roi")

          var updateItem = ""
          var choiceHTML = ""
          if (typeof item.free_input !== "undefined" && item.free_input !== null) {
            // if (typeof item.free_input !== "undefined" && item.free_input !== null) {
            // console.log("free input")
            choiceHTML =
              `
                <div id="itemFI${item.id}" >
                <div style="padding:0px 5px 10px 5px">Format check: ${item.free_input.format_check == "email"? "Email" : (item.free_input.format_check == "phone_number" ? "Phone Number" : "No validate")}</div>
                <div id="deleteChoice${item.id}" style="width:100%; padding:5px; display:none"> 
                  <button style="border: none; background-color:#f17e5d; border-radius:5px; color:white; font-weight:700; font-size:12px">
                    Delete
                  </button>
                </div>
                <input id="lblAddFI${item.free_input.message_id}" hidden type=text value="${item.free_input.free_input_labels}" />
                <input id="formatCheckSelect${item.free_input.message_id}" hidden type=text value=${item.free_input.format_check} />
                <input id="formatCheckMSG${item.free_input.message_id}" hidden type=text value="${item.free_input.format_check_message}" />
                
              </div>
              `
            updateItem = "free_input"
          } else if (item.message_buttons != []) {
            if (item.message_buttons.length == 1) {
              if (item.message_buttons[0].button_type == "mess") {
                choiceHTML =
                  `
                    <div id="itemSC${item.message_buttons[0].message_id}">
                    <div style="padding:10px 5px 0px 5px">${item.message_buttons[0].title}</div>
                    <input id="titleUPSC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].title} />
                    <input id="typeUPSC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].button_type} />
                    <input id="webUPSC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].content == null ? "" : item.message_buttons[0].content} />
                    <div style="padding:0px 5px 10px 5px">${item.message_buttons[0].message_group_name}/${item.message_buttons[0].message_bag_name}</div>
                  
                    <div id="deleteChoice${item.id}" style="width:100%; padding:5px; display:none"> 
                    <button style="border: none; background-color:#f17e5d; border-radius:5px; color:white; font-weight:700; font-size:12px">
                      Delete
                    </button>
                  </div>
                    <input id="bagUPTC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].message_bag_id} />
                    <input id="lblUPTCItem${item.message_buttons[0].message_id}" hidden type=text value="${item.message_buttons[0].message_button_labels}" />
                  </div>
                  `
                updateItem = "single_choice_msg"
              } else if (item.message_buttons[0].button_type == "web_url") {
                // if(item.message_buttons[0] != undefined){
                choiceHTML =
                  `
                    <div >
                    <div style="padding:10px 5px 0px 5px">${item.message_buttons[0].title}</div>  
                    <div style="padding:0px 5px 10px 5px">${item.message_buttons[0].content}</div>
                      

                    <input id="titleUPTC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].title} />
                    <input id="typeUPTC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].button_type} />
                    <input id="webUPTC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].content == null ? "" : item.message_buttons[0].content} />
                      
                    <div id="deleteChoice${item.id}" style="width:100%; padding:5px; display:none"> 
                    <button style="border: none; background-color:#f17e5d; border-radius:5px; color:white; font-weight:700; font-size:12px">
                      Delete
                    </button>
                  </div>
                    <input id="bagUPTC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].message_bag_id} />
                    <input id="lblUPTCItem${item.message_buttons[0].message_id}" hidden type=text value="${item.message_buttons[0].message_button_labels}" />
                    </div>
                    `
                updateItem = "single_choice_web"
                // }else{

                // }

              }
            } else if (item.message_buttons.length > 1) {
              console.log("nhieu item hon ne")
              for (var i = 0; i < item.message_buttons.length; i++) {
                if (item.message_buttons[i].button_type == "mess") {
                  console.log("mess ne")
                  choiceHTML = choiceHTML.concat(
                    `
                  <div id="itemTCUP${item.id}_${i}" style="border-bottom:${i == item.message_buttons.length - 1 ? "none" : "1px solid black"}; margin:auto; width:90%; text-align:center">
                  <div style="padding:10px 5px 0px 5px">${item.message_buttons[i].title}</div>  
                  <div style="padding:0px 5px 10px 5px">${item.message_buttons[i].message_group_name}/${item.message_buttons[i].message_bag_name}</div>
                    <input id="titleUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].title} />
                  <input id="typeUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].button_type} />
                  <input id="webUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].content == null ? "" : item.message_buttons[i].content} />
                    
                  <div id="deleteChoice${item.id}_${i}" style="width:100%; padding:5px; display:none"> 
                  <button style="border: none; background-color:#f17e5d; border-radius:5px; color:white; font-weight:700; font-size:12px">
                    Delete
                  </button>
                </div>
                  <input id="bagUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].message_bag_id} />
                  <input id="lblUPTCItem${item.message_buttons[i].message_id}" hidden type=text value="${item.message_buttons[i].message_button_labels}" />
                  </div>
                  `
                  )
                  // <input id="groupAddFI${item.id}" hidden type=text value=${`group value here`} />
                } else if (item.message_buttons[i].button_type == "web_url") {
                  console.log("web ne")
                  choiceHTML = choiceHTML.concat(
                    `
                    <div id="itemTCUP${item.id}_${i}" style="border-bottom:${i == item.message_buttons.length - 1 ? "none" : "1px solid black"}; margin:auto; width:90%; text-align:center">
                    <div style="padding:10px 5px 0px 5px;">${item.message_buttons[i].title}</div>  
                    <div style="padding:0px 5px 10px 5px">${item.message_buttons[i].content}</div>
                    <input id="titleUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].title} />
                    <input id="typeUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].button_type} />
                    <input id="webUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].content == null ? "" : item.message_buttons[i].content} />
                    <div id="deleteChoice${item.id}_${i}" style="width:100%; padding:5px; display:none"> 
                    <button style="border: none; background-color:#f17e5d; border-radius:5px; color:white; font-weight:700; font-size:12px">
                      Delete
                    </button>
                  </div>
                    <input id="bagUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].message_bag_id} />
                    <input id="lblUPTCItem${item.message_buttons[i].message_id}" hidden type=text value="${item.message_buttons[i].message_button_labels}" />
                    </div>
                    `
                  )
                }
              }

              updateItem = "three_choice"
            }

          }



          var abc = document.createElement("div")
          document.getElementById("div_custom").appendChild(abc)
          abc.innerHTML =
            `<div id="chatbot_pp${item.id}" style="border-radius: 20px; text-align:center; margin-top: 20px; background-color: rgb(244, 243, 239); padding: 40px; ">
            
            <div style="width:100%">
            <img id="imgUpPP${item.id}" src="${item.preview_past_post_url}" style="margin: auto; max-height:200px; max-width:200px" /></div>

          <br />



          <div id="choice${item.id}">
    
              </div>

              <div id="msgChoice${item.id}" style="display:none">
                <div style="display: flex">
                  <div id="singleChoice${item.id}" style=" padding:5px">
                    <button style="background-color:#FFFFFF; border: 1px solid #51cbce; border-radius:10px">Single choice</button>
                  </div>
                  <div id="threeChoice${item.id}" style=" padding:5px">
                    <button style="background-color:#FFFFFF; border: 1px solid #51cbce; border-radius:10px">Three choice</button>
                  </div>
                  <div id="freeInput${item.id}" style=" padding:5px">
                    <button style="background-color:#FFFFFF; border: 1px solid #51cbce; border-radius:10px">Free input</button>
                  </div>
                </div>
              </div>
              </br>
              <div style=" border-radius:10px; background-color:white; width:200px; text-align:center">
                <div id="choiceOption${item.id}" style=" border-radius:10px; background-color:white; width:200px; text-align:center">
                
                </div>
                <div id="choiceThree${item.id}" style="display:none;border-radius:10px"></div>
              </div>




          <div id="btnDeletePP${item.id}" style="float:right;">
              <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
              font-weight:800">削除</button>
            </div>
            <div id="btnUpdatePP${item.id}" style="float:right; display:none">
              <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
              font-weight:800">更新</button>
            </div>
            <div id="btnChangePP${item.id}" style="float:right;">
              <button style="width:110px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
              font-weight:800">変更</button>
            </div>
        </div>`

          //paste to above
          // <input id="imgMsgNumSaved${item.id}" type="file" accept="image/*" /> <br /><br />
          //   <input id="imgValueMsgNumSaved${item.id}" name="imgValueMsgChatbot${item.id}" type=hidden /> <br /><br />
          //   <div style=" text-align: center" }}>
          //     <img id="outputImgMsgSaved${item.id}" style=" max-height: 200px; max-width: 40%" }} />
          //   </div> 

          // document.getElementById(`ppCustomSaved${item.id}`).value = item.message_value

          var choiceNe = document.createElement("div")
          document.getElementById(`choiceOption${item.id}`).appendChild(choiceNe)
          choiceNe.innerHTML = choiceHTML


          document.getElementById(`singleChoice${item.id}`).addEventListener('click', (event) => {
            event.preventDefault()
            updateMsgSC(item.id)
          })
          document.getElementById(`threeChoice${item.id}`).addEventListener('click', (event) => {
            event.preventDefault()
            updateMsgTC(item.id)
          })
          document.getElementById(`freeInput${item.id}`).addEventListener('click', (event) => {
            event.preventDefault()
            updateMsgFI(item.id)
          })

          //This one use to delete choice deleteChoice
          document.getElementById(`choiceOption${item.id}`).addEventListener("click", (e) => {
            e.preventDefault()

            if (updateItem == "three_choice") {
              var idThreeChoiceDelete = item.message_buttons.length - 1
              document.getElementById(`deleteChoice${item.id}_${idThreeChoiceDelete}`).style.display = "block"
              document.getElementById(`deleteChoice${item.id}_${idThreeChoiceDelete}`).addEventListener('click', (e) => {
                e.preventDefault()
                var upd = { message: { message_value: item.message_value, message_type: "past_post", img_value: "", preview_past_post_url: item.preview_past_post_url } }
                api.patch(`/api/v1/message_managements/messages/${item.id}`, upd).then(res => {
                  console.log(res)
                  setTimeout(() => {
                    setIsOpenNoti(true)
                    setMsgNoti("更新しました。")
                  }, 1500)
                  setTimeout(function () {
                    setIsOpenNoti(false)
                  }, 2000);
                  // getBagMsg(group, id)
                  getBagMsg(idReloadMsgBagFromGetMSG, idReloadMsgBagFromGetMSG)
                }).catch(error => {
                  console.log(error)
                })
              })
            }




            if (document.getElementById(`deleteChoice${item.id}`) != null) {
              document.getElementById(`deleteChoice${item.id}`).style.display = "block"
              document.getElementById(`deleteChoice${item.id}`).addEventListener("click", (event) => {
                event.preventDefault()
                // alert("delete ne")
                var upd = { message: { message_value: item.message_value, message_type: "past_post", img_value: "", preview_past_post_url: item.preview_past_post_url } }
                api.patch(`/api/v1/message_managements/messages/${item.id}`, upd).then(res => {
                  console.log(res)
                  setTimeout(() => {
                    setIsOpenNoti(true)
                    setMsgNoti("更新しました。")
                  }, 1500)
                  setTimeout(function () {
                    setIsOpenNoti(false)
                  }, 2000);
                  getBagMsg(group, id)
                }).catch(error => {
                  console.log(error)
                })
              })
            }
          })



          // Update item down here
          if (updateItem == "") {
            document.getElementById(`msgChoice${item.id}`).style.display = "block"
          }



          document.getElementById(`btnDeletePP${item.id}`).addEventListener('click', (event) => {
            event.preventDefault()
            api.delete(`/api/v1/message_managements/messages/${item.id}`).then(res => {
              console.log(res)
              setTimeout(() => {
                setIsOpenNoti(true)
                setMsgNoti("削除しました。")
              }, 1500)

              setTimeout(function () {
                setIsOpenNoti(false)
              }, 2000);
              getBagMsg(group, id)
            }).catch(error => {
              console.log(error)
            })
          })

          // document.getElementById(`btnUpdatePP${item.id}`).addEventListener('click', () => {
          //   var update = { message: { message_value: urlUpdatePastPost, message_type: "past_post", img_value: "" } }
          //   api.patch(`/api/v1/message_managements/messages/${item.id}`, update).then(res => {
          //     console.log(res)
          //   }).catch(error => {
          //     console.log(error)
          //   })
          // })


          // var element1 = document.getElementById(`ppOVI${item.id}`)

          // if (typeof (element1) != 'undefined' && element1 != null) {
          var abc = document.createElement(`div`)
          document.getElementById('logUserDiv').appendChild(abc)
          abc.innerHTML =
            `<br/>
            <div style="width: 100%; padding: 10px; margin:5px; display:block; float: right; border-radius: 10px">
                <img id="PPUpOV${item.id}" src="${item.preview_past_post_url}" style="max-width:100px; max-height:100px; float:right" />
               </div> 
            
              `
          // document.getElementById(`PPUpOV${item.id}`).style.display = "none"

          // setIdPPUP(item.id)
          // setTotalItemPP(item.message_buttons.length-1)
          // setUpdateItemPP(updateItem)
          document.getElementById(`btnChangePP${item.id}`).addEventListener('click', (event) => {
            event.preventDefault()
            setBagUpPP(bagId)
            setIdPPUP(item.id)
            selectPastPostUp()
            // document.getElementById(`PPUpOV${item.id}`).style.display = "block"
            // document.getElementById(`imgUpPP${item.id}`).style.display = "block"
            document.getElementById(`btnUpdatePP${item.id}`).style.display = "block"
            document.getElementById(`btnChangePP${item.id}`).style.display = "none"
            // document.getElementById(`ppCustomSavedOvi${item.id}`).style.display = "none"
            // if (document.getElementById(`lbOvPP${item.id}}`) !== null) {

            // } //
            // document.getElementById(`PPUpOV${item.id}`).url = urlUpdatePastPost
            // document.getElementById(`imgUpPP${item.id}`).style.display="block"
            // document.getElementById(`imgUpPP${item.id}`).src = urlUpdatePastPost


          })


          // }
          // document.getElementById(`ppCustomSaved${item.id}`).addEventListener('click', () => {
          //   setIdPPUP(item.id)
          //   selectPastPostUp()
          //   // document.getElementById(`PPUpOV${item.id}`).style.display = "block"
          //   // document.getElementById(`imgUpPP${item.id}`).style.display = "block"
          //   document.getElementById(`btnUpdatePP${item.id}`).style.display = "block"
          //   document.getElementById(`PPUpOV${item.id}`).style.display = "none"
          //   // document.getElementById(`ppCustomSavedOvi${item.id}`).style.display = "none"
          //   // if (document.getElementById(`lbOvPP${item.id}}`) !== null) {

          //   // } //
          //   // document.getElementById(`PPUpOV${item.id}`).url = urlUpdatePastPost
          //   // document.getElementById(`imgUpPP${item.id}`).style.display="block"
          //   // document.getElementById(`imgUpPP${item.id}`).src = urlUpdatePastPost


          // })

        }


        // document.getElementById(`outputImgMsgSaved${item.id}`).src = `https://ec-chatbot-test.com/${item.img_value.url}`


        // bagMsg.forEach((item) => {

        // })
      })
      // var bagItem = []
      // for (var i = 0; i < bagMsg.length; i++) {
      //   bagItem.push(res.data.data[i].id)
      //   // 
      // }
      // console.log(bagMsg)
    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })
  }

  function reloadMessMsgBag() {
    var id = idForReloadMsgBag
    // var idIn
    if (idForReloadMsgBag === undefined) {
      id = idReloadMsgBagFromGetMSG
    } else {
      id = idForReloadMsgBag
    }
    console.log("iddddddd: ", id)
    console.log("idReloadMsgBagFromGetMSG: ", idReloadMsgBagFromGetMSG)
    console.log("idForReloadMsgBag: ", id)
    var path = window.location.pathname;
    const list = document.getElementById("div_custom");
    while (list.hasChildNodes()) {
      list.removeChild(list.firstChild);
    }
    const list2 = document.getElementById("logUserDiv");
    while (list2.hasChildNodes()) {
      list2.removeChild(list2.firstChild);
    }
    api.get(`/api/v1/message_managements/message_bags/${id}`).then(res => {
      // var totalPage = Math.ceil(res.data.data.total / 25)
      // setTotalPage(totalPage)
      var bagMsg = res.data.data.messages
      // console.log("bagMsg: ",res.data.data.messages)
      setMsgCBNum(bagMsg[bagMsg.length - 1].id)
      setImgCBNum(bagMsg[bagMsg.length - 1].id)
      setImgCBNum(bagMsg[bagMsg.length - 1].id)
      bagMsg.forEach((item) => {
        if (item.message_type == "msg") {

          var updateItem = ""
          var choiceHTML = ""
          if (typeof item.free_input !== "undefined" && item.free_input !== null) {
            // console.log("free input")
            choiceHTML =
              `
                <div id="itemFI${item.id}" >
                <div style="padding:0px 5px 10px 5px">Format check: ${item.free_input.format_check == "email"? "Email" : (item.free_input.format_check == "phone_number" ? "Phone Number" : "No validate")}</div>
                <div id="deleteChoice${item.id}" style="width:100%; padding:5px; display:none"> 
                  <button style="border: none; background-color:#f17e5d; border-radius:5px; color:white; font-weight:700; font-size:12px">
                    Delete
                  </button>
                </div>
                <input id="lblAddFI${item.free_input.message_id}" hidden type=text value="${item.free_input.free_input_labels}" />
                <input id="formatCheckSelect${item.free_input.message_id}" hidden type=text value=${item.free_input.format_check} />
                <input id="formatCheckMSG${item.free_input.message_id}" hidden type=text value="${item.free_input.format_check_message}" />
                
              </div>
              `
            updateItem = "free_input"
          } else if (item.message_buttons != []) {
            if (item.message_buttons.length == 1) {
              if (item.message_buttons[0].button_type == "mess") {
                choiceHTML =
                  `
                    <div id="itemSC${item.message_buttons[0].message_id}">
                    <div style="padding:10px 5px 0px 5px">${item.message_buttons[0].title}</div>
                    <input id="titleUPSC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].title} />
                    <input id="typeUPSC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].button_type} />
                    <input id="webUPSC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].content == null ? "" : item.message_buttons[0].content} />
                    <div style="padding:0px 5px 10px 5px">${item.message_buttons[0].message_group_name}/${item.message_buttons[0].message_bag_name}</div>
                  
                    <div id="deleteChoice${item.id}" style="width:100%; padding:5px; display:none"> 
                    <button style="border: none; background-color:#f17e5d; border-radius:5px; color:white; font-weight:700; font-size:12px">
                      Delete
                    </button>
                  </div>
                    <input id="bagUPTC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].message_bag_id} />
                    <input id="lblUPTCItem${item.message_buttons[0].message_id}" hidden type=text value="${item.message_buttons[0].message_button_labels}" />
                  </div>
                  `
                updateItem = "single_choice_msg"
              }
              else if (item.message_buttons[0].button_type == "web_url") {
                if (item.message_buttons[0].message_id != undefined) {
                  choiceHTML =
                    `
                    <div >
                    <div style="padding:10px 5px 0px 5px">${item.message_buttons[0].title}</div>  
                    <div style="padding:0px 5px 10px 5px">${item.message_buttons[0].content}</div>
                      

                    <input id="titleUPTC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].title} />
                    <input id="typeUPTC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].button_type} />
                    <input id="webUPTC${item.message_buttons[0].message_id}" hidden type=text value=${item.message_buttons[0].content == null ? "" : item.message_buttons[0].content} />
                      
                    <div id="deleteChoice${item.id}" style="width:100%; padding:5px; display:none"> 
                    <button style="border: none; background-color:#f17e5d; border-radius:5px; color:white; font-weight:700; font-size:12px">
                      Delete
                    </button>
                  </div>
                    <input id="bagUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].message_bag_id} />
                    <input id="lblUPTCItem${item.message_buttons[i].message_id}" hidden type=text value="${item.message_buttons[i].message_button_labels}" />
                    </div>
                    `
                  updateItem = "single_choice_web"
                }

              }
            } else if (item.message_buttons.length > 1) {
              console.log("nhieu item hon ne")
              for (var i = 0; i < item.message_buttons.length; i++) {
                if (item.message_buttons[i].button_type == "mess") {
                  console.log("mess ne")
                  choiceHTML = choiceHTML.concat(
                    `
                  <div id="itemTCUP${item.id}_${i}" style="border-bottom:1px solid black; margin:auto; width:90%; text-align:center">
                  <div style="padding:10px 5px 0px 5px">${item.message_buttons[i].title}</div>  
                  <div style="padding:0px 5px 10px 5px">${item.message_buttons[i].message_group_name}/${item.message_buttons[i].message_bag_name}</div>
                    <input id="titleUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].title} />
                  <input id="typeUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].button_type} />
                  <input id="webUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].content == null ? "" : item.message_buttons[i].content} />
                    
                  <div id="deleteChoice${item.id}_${i}" style="width:100%; padding:5px; display:none"> 
                  <button style="border: none; background-color:#f17e5d; border-radius:5px; color:white; font-weight:700; font-size:12px">
                    Delete
                  </button>
                </div>
                  <input id="bagUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].message_bag_id} />
                  <input id="lblUPTCItem${item.message_buttons[i].message_id}" hidden type=text value="${item.message_buttons[i].message_button_labels}" />
                  </div>
                  `
                  )
                  // <input id="groupAddFI${item.id}" hidden type=text value=${`group value here`} />
                } else if (item.message_buttons[i].button_type == "web_url") {
                  console.log("web ne")
                  choiceHTML = choiceHTML.concat(
                    `
                    <div id="itemTCUP${item.id}_${i}" style="border-bottom:${i == item.message_buttons.length - 1 ? "none" : "1px solid black"}; margin:auto; width:90%; text-align:center">
                    <div style="padding:10px 5px 0px 5px;">${item.message_buttons[i].title}</div>  
                    <div style="padding:0px 5px 10px 5px">${item.message_buttons[i].content}</div>
                    <input id="titleUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].title} />
                    <input id="typeUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].button_type} />
                    <input id="webUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].content == null ? "" : item.message_buttons[i].content} />
                    <div id="deleteChoice${item.id}_${i}" style="width:100%; padding:5px; display:none"> 
                    <button style="border: none; background-color:#f17e5d; border-radius:5px; color:white; font-weight:700; font-size:12px">
                      Delete
                    </button>
                  </div>
                    <input id="bagUPTC${item.message_buttons[i].message_id}" hidden type=text value=${item.message_buttons[i].message_bag_id} />
                    <input id="lblUPTCItem${item.message_buttons[i].message_id}" hidden type=text value="${item.message_buttons[i].message_button_labels}" />
                    </div>
                    `
                  )
                }
              }
              updateItem = "three_choice"
            }

          }



          var abc = document.createElement("div")
          document.getElementById("div_custom").appendChild(abc)
          abc.innerHTML =
            `<div id="chatbot_message${item.id}" style=" border-radius: 20px; display:block; background-color: #f4f3ef; padding: 40px; margin-top: 20px; text-align: center" >
              
              <div><textarea name="messagesVa${item.id}" class="mgsChatbot" id="mgsCustomSaved${item.id}" placeholder="返事入力..." type="text" rows="3"></textarea></div>
              
              <div id="choice${item.id}">
    
              </div>
              
              <div id="msgChoice${item.id}" style="display:none">
                <div style="display: flex">
                  <div id="singleChoice${item.id}" style=" padding:5px">
                    <button style="background-color:#FFFFFF; border: 1px solid #51cbce; border-radius:10px">Single choice</button>
                  </div>
                  <div id="threeChoice${item.id}" style=" padding:5px">
                    <button style="background-color:#FFFFFF; border: 1px solid #51cbce; border-radius:10px">Three choice</button>
                  </div>
                  <div id="freeInput${item.id}" style=" padding:5px">
                    <button style="background-color:#FFFFFF; border: 1px solid #51cbce; border-radius:10px">Free input</button>
                  </div>
                </div>
              </div>
              </br>
              <div style=" border-radius:10px; background-color:white; width:200px; text-align:center">
                <div id="choiceOption${item.id}" style=" border-radius:10px; background-color:white; width:200px; text-align:center">
                
                </div>
                <div id="choiceThree${item.id}" style="display:none;border-radius:10px"></div>
              </div>

              <div id="btnDelMsg${item.id}" style="float:right;">
              <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
                font-weight:800">削除</button>
              </div>
              <div id="btnUpdateMsg${item.id}" style="float:right;">
              <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
                font-weight:800">更新</button>
              </div>
            </div>`
          // document.getElementById(`mgsCustomKey${item.id}`).textContent = item.received_message
          document.getElementById(`mgsCustomSaved${item.id}`).textContent = item.message_value
          var choiceNe = document.createElement("div")
          document.getElementById(`choiceOption${item.id}`).appendChild(choiceNe)

          document.getElementById(`singleChoice${item.id}`).addEventListener('click', (event) => {
            event.preventDefault()
            updateMsgSC(item.id)
          })
          document.getElementById(`threeChoice${item.id}`).addEventListener('click', (event) => {
            event.preventDefault()
            updateMsgTC(item.id)
          })
          document.getElementById(`freeInput${item.id}`).addEventListener('click', (event) => {
            event.preventDefault()
            updateMsgFI(item.id)
          })

          //This one use to delete choice deleteChoice
          document.getElementById(`choiceOption${item.id}`).addEventListener("click", (e) => {
            e.preventDefault()

            if (updateItem == "three_choice") {
              var idThreeChoiceDelete = item.message_buttons.length - 1
              document.getElementById(`deleteChoice${item.id}_${idThreeChoiceDelete}`).style.display = "block"
              document.getElementById(`deleteChoice${item.id}_${idThreeChoiceDelete}`).addEventListener('click', (e) => {
                e.preventDefault()
                var upd = { message: { message_value: document.getElementById(`mgsCustomSaved${item.id}`).value, message_type: "msg", img_value: "" } }
                api.patch(`/api/v1/message_managements/messages/${item.id}`, upd).then(res => {
                  console.log(res)
                  setTimeout(() => {
                    setIsOpenNoti(true)
                    setMsgNoti("更新しました。")
                  }, 1500)
                  setTimeout(function () {
                    setIsOpenNoti(false)
                  }, 2000);
                  getBagMsg(id, id)
                }).catch(error => {
                  console.log(error)
                })
              })
            }

            if (document.getElementById(`deleteChoice${item.id}`) != null) {
              document.getElementById(`deleteChoice${item.id}`).style.display = "block"
              document.getElementById(`deleteChoice${item.id}`).addEventListener("click", (event) => {
                event.preventDefault()
                // alert("delete ne")
                var upd = { message: { message_value: document.getElementById(`mgsCustomSaved${item.id}`).value, message_type: "msg", img_value: "" } }
                api.patch(`/api/v1/message_managements/messages/${item.id}`, upd).then(res => {
                  console.log(res)
                  setTimeout(() => {
                    setIsOpenNoti(true)
                    setMsgNoti("更新しました。")
                  }, 1500)
                  setTimeout(function () {
                    setIsOpenNoti(false)
                  }, 2000);
                  getBagMsg(id, id)
                }).catch(error => {
                  console.log(error)
                })
              })
            }
          })

          // Update item down here
          if (updateItem == "") {
            document.getElementById(`msgChoice${item.id}`).style.display = "block"
          }


          choiceNe.innerHTML = choiceHTML



          document.getElementById(`mgsCustomSaved${item.id}`).addEventListener('change', (e) => msgOVSaved(e.target.value, item.id))
          // <div><textarea name="messageKey${item.id}" class="mgsChatbot" id="mgsCustomKey${item.id}" placeholder="キーワード入力..." type="text" rows="3"></textarea></div><br />
          // document.getElementById(`mgsCustomKey${item.id}`).addEventListener('change', (e) => msgOVkey(e.target.value))
          // document.getElementById(`mgsCustom${item.id}`).addEventListener('change', () => { document.getElementById(`btnDelMsg${item.id}`).style.display = 'block' })
          document.getElementById(`btnDelMsg${item.id}`).addEventListener('click', (event) => {
            event.preventDefault()
            api.delete(`/api/v1/message_managements/messages/${item.id}`).then(res => {
              console.log(res)


              setTimeout(() => {
                setIsOpenNoti(true)
                setMsgNoti("削除しました。")
              }, 1500)
              setTimeout(function () {
                setIsOpenNoti(false)
              }, 2000);
              getBagMsg(id, id)
            }).catch(error => {
              console.log(error)
            })
          })
          document.getElementById(`btnUpdateMsg${item.id}`).addEventListener('click', (event) => {
            // setIdUpdateItemMsg(item.id)
            event.preventDefault()



            var upd = { message: { message_value: document.getElementById(`mgsCustomSaved${item.id}`).value, message_type: "msg", img_value: "" } }

            var add
            if (document.getElementById(`bagAddSC${item.id}`) != null || document.getElementById(`groupAddSC${item.id}`) != null || document.getElementById(`titleAddSC${item.id}`) != null) {
              var titlea = document.getElementById(`titleAddSC${item.id}`).value
              var groupva = document.getElementById(`groupAddSC${item.id}`).value
              var group_name = document.getElementById(`groupNameAddSC${item.id}`).value
              var bag_name = document.getElementById(`groupAddSC${item.id}`).value
              var bag = document.getElementById(`bagNameAddSC${item.id}`).value
              var type = document.getElementById(`typeAddSC${item.id}`).value
              var web = document.getElementById(`webAddSC${item.id}`).value
              var lbl = document.getElementById(`lblAddSC${item.id}_${bagAddSC}`).value
              console.log("lbl: ", lbl)
              var listLbl = lbl.substring(2, lbl.length).split(", ")
              var lastListLBL = []
              for (var i = 0; i < listLbl.length; i++) {
                lastListLBL.push({ label_name: listLbl[i] })
              }
              if (type == "mess") {
                add = {
                  message: {
                    message_bag_id: bagId,
                    message_value: document.getElementById(`mgsCustomSaved${item.id}`).value,
                    message_type: "msg",
                    img_value: "",
                    message_buttons: [
                      { button_type: "mess", title: titlea, message_bag_id: `${bag}`, message_button_labels: lastListLBL }
                    ]
                  }

                }
              } else if (type == "web_url") {
                add = {
                  message: {
                    message_bag_id: bagId,
                    message_value: document.getElementById(`mgsCustomSaved${item.id}`).value,
                    message_type: "msg",
                    img_value: "",
                    message_buttons: [
                      { button_type: "web_url", title: titlea, content: web, message_button_labels: lastListLBL }
                    ]
                  }

                }
              }
            } else if (document.getElementById(`titleAddTC${item.id}_${totalItemTC}`) != null) {
              var message_buttons = []
              console.log("totalItemTC: ", totalItemTC)
              var totalTCItem = document.getElementById(`totalItemTC${item.id}`).value

              console.log("mb ne: ", totalTCItem)
              for (var i = 1; i <= totalTCItem; i++) {

                var titlea = document.getElementById(`titleAddTC${item.id}_${i}`).value
                var groupva = document.getElementById(`groupAddTC${item.id}_${i}`).value
                var group_name = document.getElementById(`groupNameAddTC${item.id}_${i}`).value
                var bag_name = document.getElementById(`bagNameAddTC${item.id}_${i}`).value
                var bag = document.getElementById(`bagAddTC${item.id}_${i}`).value
                var type = document.getElementById(`typeAddTC${item.id}_${i}`).value
                var web = document.getElementById(`webAddTC${item.id}_${i}`).value
                var lbl = document.getElementById(`lblAddTCItem${item.id}_${i}`).value
                // console.log("lbl ne: ", lbl.substring(2, lbl.length))
                var listLbl = lbl.substring(2, lbl.length).split(", ")
                var lastListLBL = []
                for (var j = 0; j < listLbl.length; j++) {
                  lastListLBL.push({ label_name: listLbl[j] })
                }
                if (type == "mess") {

                  // add = {
                  //   message: { message_bag_id: bagId, message_value: "", message_type: "img", img_value: document.getElementById(`imgDataNum${numIndex}`).value },
                  //   message_button: [
                  //     { button_type: "mess", title: titlea, content: `+message_bag_id_${bag}` }
                  //   ]
                  // }

                  message_buttons.push({ button_type: "mess", title: titlea, message_bag_id: `${bag}`, message_button_labels: lastListLBL })
                } else if (type == "web_url") {
                  // add = {
                  //   message: { message_bag_id: bagId, message_value: "", message_type: "img", img_value: document.getElementById(`imgDataNum${numIndex}`).value },
                  //   message_button: [
                  //     { button_type: "web_url", title: titlea, content: web }
                  //   ]
                  // }

                  message_buttons.push({ button_type: "web_url", title: titlea, content: web, message_button_labels: lastListLBL })
                }
              }
              add = {
                message: {
                  message_bag_id: bagId,
                  message_value: document.getElementById(`mgsCustomSaved${item.id}`).value,
                  message_type: "msg",
                  img_value: "",
                  message_buttons
                },

              }
            } else if (document.getElementById(`formatCheckSelect${item.id}`) != null) {
              // var group = document.getElementById(`groupAddFI${idSC}`).value
              // var bag = document.getElementById(`bagAddFI${idSC}`).value
              var lbl = document.getElementById(`lblAddFI${item.id}_${bagAddSC}`).value
              var formatCheckSelect = document.getElementById(`formatCheckSelect${item.id}`).value
              var formatCheckMSG = document.getElementById(`formatCheckMSG${item.id}`).value
              console.log("lbl: ", lbl)
              var listLbl = lbl.substring(2, lbl.length).split(", ")
              var lastListLBL = []
              for (var i = 0; i < listLbl.length; i++) {
                lastListLBL.push({ label_name: listLbl[i] })
              }
              add = {
                message: {
                  message_bag_id: bagId,
                  message_value: document.getElementById(`mgsCustomSaved${item.id}`).value,
                  message_type: "msg",
                  img_value: "",
                  free_input: {
                    message_bag_id: `1`,
                    free_input_labels: lastListLBL,
                    format_check: formatCheckSelect, //nhan 3 gia tri "no_validate", "email", "phone_number" 
                    format_check_message: formatCheckMSG
                  }
                },
                // message_button: [
                //   { button_type: "format", title: '', content: `+message_bag_id_${bag}`, label: listLbl, format: formatCheckSelect, format_msg: formatCheckMSG }
                // ]
              }
            }
            else {
              add = {
                message: { message_bag_id: bagId, message_value: document.getElementById(`mgsCustomSaved${item.id}`).value, message_type: "msg", img_value: "" }
              }
            }

            console.log(add)

            setTotalItemTC(1)


            api.patch(`/api/v1/message_managements/messages/${item.id}`, add).then(res => {
              console.log(res)

              setTimeout(() => {
                setIsOpenNoti(true)
                setMsgNoti("更新しました。")
              }, 1500)

              setTimeout(function () {
                setIsOpenNoti(false)
              }, 2000);
              getBagMsg(id, id)
            }).catch(error => {
              console.log(error)
            })


          })


          // var element2 = document.getElementById(`msgOVIKey${item.id}`)
          // if (typeof (element2) != 'undefined' && element2 != null) {
          //   // Exists.
          //   document.getElementById(`msgOVIKey${item.id}`).value = item.received_message
          // } else if (element2 === null) {
          //   var abc = document.createElement(`div`)
          //   document.getElementById('logUserDiv').appendChild(abc)
          //   abc.innerHTML =
          //     `<div id="ovMsgKey${item.id}" style="width: 70%; background-color: #51cbce; padding: 10px; float:left; margin:5px; display:block; border-radius: 10px">
          //       <input type="text" id="msgOVIKey${item.id}" style="background-color: #51cbce; border: none" readonly/>
          //      </div>`
          //   document.getElementById(`msgOVIKey${item.id}`).value = item.received_message;
          // }

          var element1 = document.getElementById(`msgOVI${item.id}`)
          if (typeof (element1) != 'undefined' && element1 != null) {
            // Exists.
            document.getElementById(`msgOVI${item.id}`).value = item.message_value
          } else if (element1 === null) {
            var abc = document.createElement(`div`)
            document.getElementById('logUserDiv').appendChild(abc)
            abc.innerHTML =
              `<div id="ovMsg${item.id}" style="width: 100%; background-color: #51cbce; padding: 10px; margin:5px; display:block; float: right; border-radius: 10px">
                <textarea type="text" id="msgOVI${item.id}" style="width:90%; text-align: right; background-color: #51cbce; border: none; overflow-y:auto" readonly/>
               </div> `
            document.getElementById(`msgOVI${item.id}`).value = item.message_value

          }
        } else if (item.message_type == "img") {
          var abc = document.createElement("div")
          document.getElementById("div_custom").appendChild(abc)
          abc.innerHTML =
            `<div id="chatbot_image${item.id}" style="border-radius: 20px; margin-top: 20px; display:block; background-color: rgb(244, 243, 239); padding: 40px; ">
            <div><textarea name="imgKey${item.id}" class="mgsChatbot" style="display:none" id="imgCustomKey${item.id}" placeholder="キーワード入力..." type="text" rows="3"></textarea></div><br />
          <input id="imgNumSaved${item.id}" name="imageChatbot" type="file" accept="image/*" />
          <input id="imgDataNumSaved${item.id}" name="imgchatbot${item.id}" type=hidden /> <br /><br />
          <div style=" text-align: center">
            <img id="output${item.id}" style=" max-height: 200px; max-width: 40%"  />
          </div>
          <div id="btnDelImg${item.id}" style="float:right;">
              <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
              font-weight:800">削除</button>
            </div>
            <div id="btnUpdateImg${item.id}" style="float:right;">
              <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
              font-weight:800">更新</button>
            </div>
        </div>`
          document.getElementById(`imgCustomKey${item.id}`).value = item.received_message
          document.getElementById(`imgNumSaved${item.id}`).addEventListener('change', (e) => loadFileSaved(e, item.id))
          document.getElementById(`output${item.id}`).src = `https://ec-chatbot-test.com${item.img_value.url}`
          document.getElementById(`btnDelImg${item.id}`).addEventListener("click", (event) => {
            event.preventDefault()
            api.delete(`/api/v1/message_managements/messages/${item.id}`).then(res => {
              // alert("Delete Successfully")
              console.log(res)
              setTimeout(() => {
                setIsOpenNoti(true)
                setMsgNoti("削除しました。")
              }, 1500)

              setTimeout(function () {
                setIsOpenNoti(false)
              }, 2000);
              getBagMsg(id, id)
            }).catch(error => {
              console.log(error)
            })
          })
          document.getElementById(`btnUpdateImg${item.id}`).addEventListener("click", (event) => {
            event.preventDefault()
            var upd = {
              message: { message_value: "", message_type: "img", img_value: document.getElementById(`imgDataNumSaved${item.id}`).value }
            }
            api.patch(`/api/v1/message_managements/messages/${item.id}`, upd).then(res => {
              // alert("Delete Successfully")
              console.log(res)
              setTimeout(() => {
                setIsOpenNoti(true)
                setMsgNoti("更新しました。")
              }, 1500)

              setTimeout(function () {
                setIsOpenNoti(false)
              }, 2000);
              getBagMsg(id, id)
            }).catch(error => {
              console.log(error)
            })
          })


          // console.log('value ne: ',document.getElementById(`output${item.id}`))
          // document.getElementById(`imgNum${item.id}`).value = item.img_value.src

          // getBaseUrlDis(item.id, item.img_value.url)



          // const toDataURL = url => fetch(url)
          //   .then(response => response.blob())
          //   .then(blob => new Promise((resolve, reject) => {
          //     const reader = new FileReader()
          //     reader.onloadend = () => resolve(reader.result)
          //     reader.onerror = reject
          //     reader.readAsDataURL(blob)
          //   }))


          // toDataURL(`https://ec-chatbot-test.com/${item.img_value.url}`)
          //   .then(dataUrl => {
          //     console.log('RESULT:', dataUrl)
          //   })

          var src = document.getElementById(`output${item.id}`).src

          const getEmergencyFoundImg = urlImg => {
            var img = new Image();
            img.src = urlImg;
            img.crossOrigin = 'Anonymous';

            var canvas = document.createElement('canvas'),
              ctx = canvas.getContext('2d');

            canvas.height = img.naturalHeight;
            canvas.width = img.naturalWidth;
            ctx.drawImage(img, 0, 0);

            var b64 = canvas.toDataURL('image/png').replace(/^data:image.+;base64,/, '');
            return b64;
          };
          // document.getElementById(`output${item.id}`).setAttribute('crossOrigin', 'anonymous')

          // console.log(getEmergencyFoundImg(src))

          // document.getElementById(`output${item.id}`).setAttribute('crossOrigin', 'anonymous')
          //           var c = document.createElement('canvas');
          //           var img = document.getElementById(`output${item.id}`);
          //           c.height = img.naturalHeight;
          //           c.width = img.naturalWidth;
          //           var ctx = c.getContext('2d');

          //           ctx.drawImage(img, 0, 0, c.width, c.height);
          //           var base64String = c.toDataURL('image/jpeg');
          // console.log('base: ',base64String)


          // function toDataURL(src, callback){
          //   var image = new Image();

          //   image.onload = function(){
          //     var canvas = document.createElement('canvas');
          //     var context = canvas.getContext('2d');
          //     canvas.height = this.naturalHeight;
          //     canvas.width = this.naturalWidth;
          //     context.drawImage(this, 0, 0);
          //     var dataURL = canvas.toDataURL('image/jpeg');
          //     callback(dataURL);
          //   };
          //   image.src = src;
          // }
          //     toDataURL(`https://ec-chatbot-test.com/${item.img_value.url}`, function(dataURL){
          //       alert(dataURL);      
          //   })

          // function toDataURL(url, callback) {
          //   var httpRequest = new XMLHttpRequest();

          //   httpRequest.onload = function () {
          //     var fileReader = new FileReader();
          //     fileReader.onloadend = function () {
          //       callback(fileReader.result);
          //     }
          //     fileReader.readAsDataURL(httpRequest.response);
          //   };
          //   httpRequest.open('GET', url);
          //   httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencode');
          //   httpRequest.setRequestHeader( 'Access-Control-Allow-Origin', '*');
          //   httpRequest.responseType = 'blob';
          //   httpRequest.send();
          // }
          // toDataURL(`https://ec-chatbot-test.com/${item.img_value.url}`, function (dataUrl) {
          //   console.log('Result in string:', dataUrl)
          // })





          // console.log(encrypt(item.img_value.url))

          // console.log(document.getElementById(`imgDataNum${item.id}`).value)
          // document.getElementById(`imgDataNum${item.id}`).value = encrypt(item.img_value.url)
          // document.getElementById(`imgNum${item.id}`).addEventListener('change', (e) => loadFile(e))
          // document.getElementById(`btnDelImg${item.id}`).addEventListener('click', () => deleteImgCB(item.id))

          var element1 = document.getElementById(`outputOV${item.id}`)
          if (typeof (element1) != 'undefined' && element1 != null) {
            // Exists.
            document.getElementById(`outputOV${item.id}`).src = `https://ec-chatbot-test.com${item.img_value.url}`
          } else if (element1 === null) {
            var abc = document.createElement(`div`)
            document.getElementById('logUserDiv').appendChild(abc)
            abc.innerHTML =
              `
              <div style="width: 100%; padding: 10px; margin:5px; display:block; float: right; border-radius: 10px">
              <img id="outputOV${item.id}" style="max-height: 200px; display: block; margin:5px; max-width: 65%; float:right" src="${`https://ec-chatbot-test.com${item.img_value.url}`}">
               </div> 
              `
            // document.getElementById(`msgOVI${item.id}`).value = item.message_value

          }

        } else if (item.message_type == "img_msg") {
          var abc = document.createElement("div")
          document.getElementById("div_custom").appendChild(abc)
          abc.innerHTML =
            `<div id="chatbot_image_msg${item.id}" style="border-radius: 20px; margin-top: 20px; background-color: rgb(244, 243, 239); padding: 40px; ">
            <div><textarea name="imgMsgKey${item.id}" style="display:none" class="mgsChatbot" id="imgMgsCustomKey${item.id}" placeholder="キーワード入力..." type="text" rows="3"></textarea></div><br />
          <input id="imgMsgNumSaved${item.id}" type="file" accept="image/*" /> <br /><br />
          <input id="imgValueMsgNumSaved${item.id}" name="imgValueMsgChatbot${item.id}" type=hidden /> <br /><br />
          <div style=" text-align: center" }}>
            <img id="outputImgMsgSaved${item.id}" style=" max-height: 200px; max-width: 40%" }} />
          </div>
          <div style="text-align: center">
          <textarea class="mgsChatbot" id="imgMgsCustomSaved${item.id}" name="imgMsgValueChatbot${item.id}" placeholder="返事入力..." type="text" rows="3"></textarea>
          </div>
          <div id="btnDelImgMsg${item.id}" style="float:right;">
              <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
              font-weight:800">削除</button>
            </div>
            <div id="btnUpImgMsg${item.id}" style="float:right;">
              <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
              font-weight:800">更新</button>
            </div>
        </div>`
          document.getElementById(`imgMgsCustomKey${item.id}`).value = item.received_message
          document.getElementById(`imgMgsCustomSaved${item.id}`).value = item.message_value
          document.getElementById(`outputImgMsgSaved${item.id}`).src = `https://ec-chatbot-test.com${item.img_value.url}`


          // document.getElementById(`imgMsgNum${item.id}`).addEventListener('change', (e) => loadFileImgMsg(e))
          document.getElementById(`imgMgsCustomSaved${item.id}`).addEventListener('change', (e) => imgMsgOVSaved(e.target.value, item.id))
          // document.getElementById(`imgMsgNum${item.id}`).addEventListener('change', () => { document.getElementById(`btnDelImgMsg${item.id}`).style.display = 'block' })
          // document.getElementById(`imgMgsCustom${item.id}`).addEventListener('change', () => { document.getElementById(`btnDelImgMsg${item.id}`).style.display = 'block' })
          document.getElementById(`imgMsgNumSaved${item.id}`).addEventListener('change', (e) => loadFileImgMsgSaved(e, item.id))
          document.getElementById(`btnDelImgMsg${item.id}`).addEventListener('click', (event) => {
            event.preventDefault()
            api.delete(`/api/v1/message_managements/messages/${item.id}`).then(res => {
              console.log(res)
              setTimeout(() => {
                setIsOpenNoti(true)
                setMsgNoti("削除しました。")
              }, 1500)
              setTimeout(function () {
                setIsOpenNoti(false)
              }, 2000);
              getBagMsg(id, id)
            }).catch(error => {
              console.log(error)
            })
          })

          document.getElementById(`btnUpImgMsg${item.id}`).addEventListener('click', (event) => {
            event.preventDefault()
            var upd = {
              message: { message_value: document.getElementById(`imgMgsCustomSaved${item.id}`).value, message_type: "img_msg", img_value: document.getElementById(`imgValueMsgNumSaved${item.id}`).value }
            }

            api.patch(`/api/v1/message_managements/messages/${item.id}`, upd).then(res => {
              // alert("Delete Successfully")
              console.log(res)
              setTimeout(() => {
                setIsOpenNoti(true)
                setMsgNoti("更新しました。")
              }, 1500)
              setTimeout(function () {
                setIsOpenNoti(false)
              }, 2000);
              getBagMsg(id, id)
            }).catch(error => {
              console.log(error)
            })
          })

          var element1 = document.getElementById(`imgMsgOVI${item.id}`)
          var element2 = document.getElementById(`outputImgMsgOV${item.id}`)

          if ((typeof (element1) != 'undefined' && element1 != null) || (typeof (element2) != 'undefined' && element2 != null)) {
            // Exists.
            document.getElementById(`imgMsgOVI${item.id}`).value = item.message_value
            document.getElementById(`outputImgMsgOV${item.id}`).src = `https://ec-chatbot-test.com${item.img_value.url}`
          } else if (element1 === null) {
            var abc = document.createElement(`div`)
            document.getElementById('logUserDiv').appendChild(abc)
            abc.innerHTML =
              `
              <div id="ovMsg${item.id}" style="width: 100%; background-color: #51cbce; padding: 10px; margin:5px; display:block; float: right; border-radius: 10px">
                <textarea type="text" id="imgMsgOVI${item.id}" style="width:90%; text-align: right; background-color: #51cbce; border: none; overflow-y:auto" readonly/>
               </div> 
              `
            var abc1 = document.createElement(`div`)
            document.getElementById('logUserDiv').appendChild(abc1)
            abc1.innerHTML = `<br /><img id="outputImgMsgOV${item.id}" style="max-height: 200px; display: block; margin:5px; max-width: 65%; float:right" src="${`https://ec-chatbot-test.com${item.img_value.url}`}">`
            document.getElementById(`imgMsgOVI${item.id}`).value = item.message_value

          }
        } else if (item.message_type == "past_post") {
          // alert ("PP roi")
          var abc = document.createElement("div")
          document.getElementById("div_custom").appendChild(abc)
          abc.innerHTML =
            `<div id="chatbot_pp${item.id}" style="border-radius: 20px; text-align:center; margin-top: 20px; background-color: rgb(244, 243, 239); padding: 40px; ">
            
            <div style="width:100%">
            <img id="imgUpPP${item.id}" src="${item.preview_past_post_url}" style="margin: auto; max-height:200px; max-width:200px" /></div>

          <br />
          <div id="btnDeletePP${item.id}" style="float:right;">
              <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
              font-weight:800">削除</button>
            </div>
            <div id="btnUpdatePP${item.id}" style="float:right; display:none">
              <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
              font-weight:800">更新</button>
            </div>
            <div id="btnChangePP${item.id}" style="float:right;">
              <button style="width:110px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
              font-weight:800">変更</button>
            </div>
        </div>`

          //paste to above
          // <input id="imgMsgNumSaved${item.id}" type="file" accept="image/*" /> <br /><br />
          //   <input id="imgValueMsgNumSaved${item.id}" name="imgValueMsgChatbot${item.id}" type=hidden /> <br /><br />
          //   <div style=" text-align: center" }}>
          //     <img id="outputImgMsgSaved${item.id}" style=" max-height: 200px; max-width: 40%" }} />
          //   </div> 

          // document.getElementById(`ppCustomSaved${item.id}`).value = item.message_value

          document.getElementById(`btnDeletePP${item.id}`).addEventListener('click', (event) => {
            event.preventDefault()
            api.delete(`/api/v1/message_managements/messages/${item.id}`).then(res => {
              console.log(res)
              setTimeout(() => {
                setIsOpenNoti(true)
                setMsgNoti("削除しました。")
              }, 1500)
              setTimeout(function () {
                setIsOpenNoti(false)
              }, 2000);
              getBagMsg(id, id)
            }).catch(error => {
              console.log(error)
            })
          })

          // document.getElementById(`btnUpdatePP${item.id}`).addEventListener('click', () => {
          //   var update = { message: { message_value: urlUpdatePastPost, message_type: "past_post", img_value: "" } }
          //   api.patch(`/api/v1/message_managements/messages/${item.id}`, update).then(res => {
          //     console.log(res)
          //   }).catch(error => {
          //     console.log(error)
          //   })
          // })


          // var element1 = document.getElementById(`ppOVI${item.id}`)

          // if (typeof (element1) != 'undefined' && element1 != null) {
          var abc = document.createElement(`div`)
          document.getElementById('logUserDiv').appendChild(abc)
          abc.innerHTML =
            `<br/>
            <div style="width: 100%; padding: 10px; margin:5px; display:block; float: right; border-radius: 10px">
                <img id="PPUpOV${item.id}" src="${item.preview_past_post_url}" style="max-width:100px; max-height:100px; float:right" />
               </div> 
            
              `
          // document.getElementById(`PPUpOV${item.id}`).style.display = "none"



          document.getElementById(`btnChangePP${item.id}`).addEventListener('click', (event) => {
            event.preventDefault()
            setIdPPUP(item.id)
            selectPastPostUp()
            // document.getElementById(`PPUpOV${item.id}`).style.display = "block"
            // document.getElementById(`imgUpPP${item.id}`).style.display = "block"
            document.getElementById(`btnUpdatePP${item.id}`).style.display = "block"
            document.getElementById(`btnChangePP${item.id}`).style.display = "none"
            // document.getElementById(`ppCustomSavedOvi${item.id}`).style.display = "none"
            // if (document.getElementById(`lbOvPP${item.id}}`) !== null) {

            // } //
            // document.getElementById(`PPUpOV${item.id}`).url = urlUpdatePastPost
            // document.getElementById(`imgUpPP${item.id}`).style.display="block"
            // document.getElementById(`imgUpPP${item.id}`).src = urlUpdatePastPost


          })


          // }
          // document.getElementById(`ppCustomSaved${item.id}`).addEventListener('click', () => {
          //   setIdPPUP(item.id)
          //   selectPastPostUp()
          //   // document.getElementById(`PPUpOV${item.id}`).style.display = "block"
          //   // document.getElementById(`imgUpPP${item.id}`).style.display = "block"
          //   document.getElementById(`btnUpdatePP${item.id}`).style.display = "block"
          //   document.getElementById(`PPUpOV${item.id}`).style.display = "none"
          //   // document.getElementById(`ppCustomSavedOvi${item.id}`).style.display = "none"
          //   // if (document.getElementById(`lbOvPP${item.id}}`) !== null) {

          //   // } //
          //   // document.getElementById(`PPUpOV${item.id}`).url = urlUpdatePastPost
          //   // document.getElementById(`imgUpPP${item.id}`).style.display="block"
          //   // document.getElementById(`imgUpPP${item.id}`).src = urlUpdatePastPost


          // })

        }


        // document.getElementById(`outputImgMsgSaved${item.id}`).src = `https://ec-chatbot-test.com/${item.img_value.url}`


        // bagMsg.forEach((item) => {

        // })
      })
      // var bagItem = []
      // for (var i = 0; i < bagMsg.length; i++) {
      //   bagItem.push(res.data.data[i].id)
      //   // 
      // }
      // console.log(bagMsg)
    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })
  }

  const [idReloadMsgBag, setIdReloadMsgBag] = useState()
  const [idReloadMsgBagFromGetMSG, setIdReloadMsgBagFromGetMSG] = useState()
  const [idMsgBagRename, setIdMsgBagRename] = useState()
  const [idMsgBagCopy, setIdMsgBagCopy] = useState()
  const [idMsgBagDelete, setIdMsgBagDelete] = useState()

  let clicked = false; //global variable

  function prevent_double_click() {
    clicked = true;
    setTimeout(function () {
      clicked = false;
    }, 1000);
  }

  function getMSGPV(event, idIn) {

    event.preventDefault()

    document.getElementById(`btn_a_tag${idIn}`).disabled = true

    console.log("mul click")
    getMessage(idIn)
    setTimeout(() => {
      document.getElementById(`btn_a_tag${idIn}`).disabled = false
    }, 500)
    // document.getElementById("a_tag").setAttribute('disabled', 'disabled')
  }

  function getMessage(idIn) {
    setIdReloadMsgBag(idIn)    // console.log(idList)
    var path = window.location.pathname;
    api.get(`/api/v1/message_managements/message_groups/${idIn}`).then(res => {
      var bag = []
      var idMsgbag = []
      // console.log('message: ', res.data.data)
      for (var i = 0; i < res.data.data.message_bags.length; i++) {
        bag.push(res.data.data.message_bags[i].bag_name)
        idMsgbag.push(res.data.data.message_bags[i].id)
      }
      // console.log("idMsgbag: ", idMsgbag)
      setMessageBag(res.data.data)
      const ulTag = document.createElement('ul');
      ulTag.setAttribute('id', `msgBag${idIn}`);
      // bag.forEach(item => {
      for (var i = 0; i < bag.length; i++) {
        var divbig = document.createElement('div');
        // divbig.setAttribute("id", `divbig_${idIn}_id${idMsgbag[i]}`);
        var lidiv = document.createElement('div');
        lidiv.setAttribute("id", `msg_group_div${idIn}_id${idMsgbag[i]}`);

        const liTag = document.createElement('li');
        liTag.setAttribute("id", `msg_group${idIn}_id${idMsgbag[i]}`);

        liTag.innerHTML = bag[i];
        liTag.style.width = '80%'
        liTag.style.fontSize = '15px'
        lidiv.innerHTML = '<i class="nc-icon nc-bullet-list-67" /> <br />';
        lidiv.style.width = '20%'
        lidiv.style.textAlign = "right"
        divbig.innerHTML = `<div id="divbig_${idIn}_id${idMsgbag[i]}"></div>`
        ulTag.appendChild(divbig);
        divbig.appendChild(liTag);
        divbig.appendChild(lidiv)
        divbig.style.display = 'flex'
        divbig.style.margin = 'auto'
        divbig.style.width = '100%'



      }
      if (document.getElementById(`liMesBag${idIn}`).outerHTML === `<li id="liMesBag${idIn}"></li>`) {
        document.getElementById(`liMesBag${idIn}`).appendChild(ulTag);
      }
      idMsgbag.forEach((idd) => {
        console.log(idd) 
          
        var abc = document.createElement('div')
        abc.setAttribute('id', `msgBag_item_${idIn}_${idd}`)

        // console.log("setBagId: ", idd)
        document.getElementById(`msg_group${idIn}_id${idd}`).addEventListener('click', (e) => {
          e.preventDefault()
          
          setIdReloadMsgBagFromGetMSG(idd)
          getBagMsg(idIn, idd)
          setBagId(idd)
        })
        document.getElementById(`msg_group_div${idIn}_id${idd}`).addEventListener('click', (event) => {
          event.preventDefault()
          //Rename, Delete, Cancel uncomment code below

          const list = document.getElementById(`msg_group${idIn}_id${idd}`);
          while (list.hasChildNodes()) {
            list.removeChild(list.firstChild);
          }
          for (var i = 0; i < bag.length; i++) {
            document.getElementById(`msg_group${idIn}_id${idd}`).innerHTML = bag[i]
          }
          
          document.getElementById(`msg_group${idIn}_id${idd}`).appendChild(abc)
          abc.innerHTML = `<div id="itemMsg_${idIn}_${idd}">
            <div class="dropdown-content">
              <button id="renameBtn${idIn}_${idd}" style="border:none; border-radius:10px; background-color: #66615b; color:white; font-size:13px">名前変更</button>
              <button id="copyBtn${idIn}_${idd}" style="border:none; border-radius:10px; background-color: #66615b; color:white; font-size:13px">コピー</button>
              <button id="deleteBtn${idIn}_${idd}" style="border:none; border-radius:10px; background-color: #66615b; color:white; font-size:13px">削除</button>
              <button id="cancelBtn${idIn}_${idd}" style="border:none; border-radius:10px; background-color: #66615b; color:white; font-size:13px">キャンセル</button>
            </div>
          </div>`
          document.getElementById(`msgBag_item_${idIn}_${idd}`).removeAttribute('hidden')
          document.getElementById(`renameBtn${idIn}_${idd}`).addEventListener('click', (event) => {
            event.preventDefault()
            setIdMsgBagRename(idd)
            setIsOpenMsgBagRename(true)
          })
          document.getElementById(`copyBtn${idIn}_${idd}`).addEventListener('click', (event) => {
            event.preventDefault()
            setIdMsgBagCopy(idd)
            setIsOpenMsgBagCopy(true)
          })

          document.getElementById(`cancelBtn${idIn}_${idd}`).addEventListener('click', (event) => {
            event.preventDefault()
            document.getElementById(`msgBag_item_${idIn}_${idd}`).setAttribute("hidden", true)
          })
          document.getElementById(`deleteBtn${idIn}_${idd}`).addEventListener('click', (event) => {
            event.preventDefault()
            setIdMsgBagDelete(idd)
            setIsOpenMsgBagDelete(true)
          })
        }

        )

      })
      // for (var i = 0; i < bag.length; i++) {
      //   var abc = document.createElement('div')
      //   console.log("bbb: ", bag.length)
      //     console.log(idIn,': ', idMsgbag[i])
      //   document.getElementById(`msg_group${idIn}_id${idMsgbag[i]}`).addEventListener('click', ()=> {
      //     console.log(`abc${idMsgbag[i-1]}`)
      //     document.getElementById(`msg_group${idIn}_id${idMsgbag[i]}`).appendChild(abc)
      //     abc.innerHTML = `<div class="dropdown">
      //     <button class="dropbtn">Dropdown</button>
      //     <div class="dropdown-content">
      //       <a href="#">Link 1</a>
      //       <a href="#">Link 2</a>
      //       <a href="#">Link 3</a>
      //     </div>
      //   </div>`
      //   })
      // }
      // setIdmsgB(`mgsBBB${id}`)
    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })

    // document.getElementById('itemBag').style.display = "block"
  }

  function reloadMsgBag() {

    var idIn = idReloadMsgBag
    console.log("id reload: ", idIn)
    var path = window.location.pathname;
    api.get(`/api/v1/message_managements/message_groups/${idIn}`).then(res => {
      console.log("lay dc r")
      var bag = []
      var idMsgbag = []
      // console.log('message: ', res.data.data)
      for (var i = 0; i < res.data.data.message_bags.length; i++) {
        bag.push(res.data.data.message_bags[i].bag_name)
        idMsgbag.push(res.data.data.message_bags[i].id)
      }
      // console.log("idMsgbag: ", idMsgbag)
      setMessageBag(res.data.data)
      const ulTag = document.getElementById(`msgBag${idIn}`)
      // ulTag.setAttribute('id', `msgBag${idIn}`);
      // bag.forEach(item => {
      ulTag.innerHTML = ""
      for (var i = 0; i < bag.length; i++) {
        var divbig = document.createElement('div');
        // divbig.setAttribute("id", `divbig_${idIn}_id${idMsgbag[i]}`);
        var lidiv = document.createElement('div');
        lidiv.setAttribute("id", `msg_group_div${idIn}_id${idMsgbag[i]}`);

        const liTag = document.createElement('li');
        liTag.setAttribute("id", `msg_group${idIn}_id${idMsgbag[i]}`);

        liTag.innerHTML = bag[i];
        liTag.style.width = '80%'
        liTag.style.fontSize = '15px'
        lidiv.innerHTML = '<i class="nc-icon nc-bullet-list-67" /> <br />';
        lidiv.style.width = '20%'
        lidiv.style.textAlign = "right"
        divbig.innerHTML = `<div id="divbig_${idIn}_id${idMsgbag[i]}"></div>`

        ulTag.appendChild(divbig);
        divbig.appendChild(liTag);
        divbig.appendChild(lidiv)
        divbig.style.display = 'flex'
        divbig.style.margin = 'auto'
        divbig.style.width = '100%'



      }
      if (document.getElementById(`liMesBag${idIn}`).outerHTML === `<li id="liMesBag${idIn}"></li>`) {
        document.getElementById(`liMesBag${idIn}`).innerHTML = ""
        document.getElementById(`liMesBag${idIn}`).appendChild(ulTag);
      }
      idMsgbag.forEach((idd) => {
        console.log(idd)
        var abc = document.createElement('div')
        abc.setAttribute('id', `msgBag_item_${idIn}_${idd}`)

        // console.log("setBagId: ", idd)
        document.getElementById(`msg_group${idIn}_id${idd}`).addEventListener('click', () => {
          getBagMsg(idIn, idd)
          setBagId(idd)
        })
        document.getElementById(`msg_group_div${idIn}_id${idd}`).addEventListener('click', () => {

          //Rename, Delete, Cancel uncomment code below

          document.getElementById(`msg_group${idIn}_id${idd}`).appendChild(abc)
          abc.innerHTML = `<div id="itemMsg_${idIn}_${idd}">
            <div class="dropdown-content">
              <button id="renameBtn${idIn}_${idd}" style="border:none; border-radius:10px; background-color: #66615b; color:white; font-size:13px">名前変更</button>
              <button id="copyBtn${idIn}_${idd}" style="border:none; border-radius:10px; background-color: #66615b; color:white; font-size:13px">コピー</button>
              <button id="deleteBtn${idIn}_${idd}" style="border:none; border-radius:10px; background-color: #66615b; color:white; font-size:13px">削除</button>
              <button id="cancelBtn${idIn}_${idd}" style="border:none; border-radius:10px; background-color: #66615b; color:white; font-size:13px">キャンセル</button>
            </div>
          </div>`
          document.getElementById(`msgBag_item_${idIn}_${idd}`).removeAttribute('hidden')
          document.getElementById(`renameBtn${idIn}_${idd}`).addEventListener('click', (event) => {
            event.preventDefault()
            setIdMsgBagRename(idd)
            setIsOpenMsgBagRename(true)
          })
          document.getElementById(`copyBtn${idIn}_${idd}`).addEventListener('click', (event) => {
            event.preventDefault()
            setIdMsgBagCopy(idd)
            setIsOpenMsgBagCopy(true)
          })

          document.getElementById(`cancelBtn${idIn}_${idd}`).addEventListener('click', (event) => {
            event.preventDefault()
            document.getElementById(`msgBag_item_${idIn}_${idd}`).setAttribute("hidden", true)
          })
          document.getElementById(`deleteBtn${idIn}_${idd}`).addEventListener('click', (event) => {
            event.preventDefault()
            setIdMsgBagDelete(idd)
            setIsOpenMsgBagDelete(true)
          })
        }

        )

      })
      // for (var i = 0; i < bag.length; i++) {
      //   var abc = document.createElement('div')
      //   console.log("bbb: ", bag.length)
      //     console.log(idIn,': ', idMsgbag[i])
      //   document.getElementById(`msg_group${idIn}_id${idMsgbag[i]}`).addEventListener('click', ()=> {
      //     console.log(`abc${idMsgbag[i-1]}`)
      //     document.getElementById(`msg_group${idIn}_id${idMsgbag[i]}`).appendChild(abc)
      //     abc.innerHTML = `<div class="dropdown">
      //     <button class="dropbtn">Dropdown</button>
      //     <div class="dropdown-content">
      //       <a href="#">Link 1</a>
      //       <a href="#">Link 2</a>
      //       <a href="#">Link 3</a>
      //     </div>
      //   </div>`
      //   })
      // }
      // setIdmsgB(`mgsBBB${id}`)
    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })

    // document.getElementById('itemBag').style.display = "block"
  }

  function displayOption() {
    console.log('displayOption')
  }


  const [isOpenAddChatbot, setIsOpenAddChatbot] = useState(false)
  const [isOpenAddMsgBag, setIsOpenAddMsgBag] = useState(false)
  const [isOpenRenameMsgBag, setIsOpenRenameMsgBag] = useState(false)
  const [isOpenCopyMsgBag, setIsOpenCopyMsgBag] = useState(false)
  const [isOpenDeleteMsgBag, setIsOpenDeleteMsgBag] = useState(false)

  const [isOpenMsgBagRename, setIsOpenMsgBagRename] = useState(false)
  const [isOpenMsgBagCopy, setIsOpenMsgBagCopy] = useState(false)
  const [isOpenMsgBagDelete, setIsOpenMsgBagDelete] = useState(false)

  const [nameChatbot, setNameChatbot] = useState()
  const [temp, setTemp] = useState()
  const [idImg, setImg] = useState()
  const [imgCBNum, setImgCBNum] = useState(0)
  const [msgCBNum, setMsgCBNum] = useState(0)
  const [ppCBNum, setPpCBNum] = useState(0)
  const [imgMsgCBNum, setImgMsgCBNum] = useState(0)

  // console.log(messageGroup[0].group[0].name)

  function addChatbot() {
    var value = document.getElementById("new_chatbot").value.trim()
    if (value !== "") {
      //Call API, add new chatbot
      alert("ok")
    } else {
      utils.checkFieldAdd(value, "Chatbot")
    }
  }

  //Call to API rename chatbot
  function renameChatbot(name, id) {
    setIsOpenAddChatbot(true)
    // alert(name)
    // alert(id)
  }

  //Call to API delete chatbot
  function deleteChatbot(data) {
    alert(data)
  }

  // function setChatMessageValue(id, value) {
  //   const arr = [...chatbotMessage]
  //   arr[id - 1] = { ...arr[id - 1], msg: value }
  //   setChatbotMessage(arr)
  //   // setChatbotMessage[0].msg("abc")
  //   console.log(chatbotMessage[0].msg)
  // }



  var usersDiv = [];

  function getBaseUrl(id) {
    var file = document.querySelector(`#imgNum${id}`)['files'][0];
    var reader = new FileReader();
    var baseString;
    reader.onloadend = function () {
      baseString = reader.result;
      document.getElementById(`imgDataNum${id}`).value = baseString
    };
    reader.readAsDataURL(file);
  }
  function getBaseUrlSaved(id) {
    var file = document.querySelector(`#imgNumSaved${id}`)['files'][0];
    var reader = new FileReader();
    var baseString;
    reader.onloadend = function () {
      baseString = reader.result;
      document.getElementById(`imgDataNumSaved${id}`).value = baseString
    };
    reader.readAsDataURL(file);
  }

  function getBaseUrlDis(id, value) {
    // var file = document.querySelector(`#imgNum${id}`)['files'][0];
    var reader = new FileReader();
    var baseString;
    reader.onloadend = function () {
      baseString = reader.result;
      document.getElementById(`imgDataNum${id}`).value = baseString
    };
    reader.readAsDataURL(value);
  }


  function getBaseUrlImgMsg(id) {
    var file = document.querySelector(`#imgMsgNum${id}`)['files'][0];
    var reader = new FileReader();
    var baseString;
    reader.onloadend = function () {
      baseString = reader.result;
      document.getElementById(`imgValueMsgNum${id}`).value = baseString
    };
    reader.readAsDataURL(file);
  }

  //loadFileImgMsg

  function getBaseUrlImgMsgSaved(id) {
    var file = document.querySelector(`#imgMsgNumSaved${id}`)['files'][0];
    var reader = new FileReader();
    var baseString;
    reader.onloadend = function () {
      baseString = reader.result;
      document.getElementById(`imgValueMsgNumSaved${id}`).value = baseString
    };
    reader.readAsDataURL(file);
  }

  function loadFile(event) {
    var num = parseInt(imgCBNum) + 1
    getBaseUrl(num)
    var output = document.getElementById(`output${num}`);
    var imgUrl = URL.createObjectURL(event.target.files[0]);
    output.src = imgUrl
    setTemp(imgUrl)
    output.onload = function () {
      URL.revokeObjectURL(output.src) // free memory
    }
    var element = document.getElementById(`outputOV${num}`);
    // console.log(element)
    if (typeof (element) != 'undefined' && element != null) {
      // Exists.
      var output2 = document.getElementById(`outputOV${num}`);
      // console.log("output2", output2)
      output2.src = imgUrl
    } else if (element === null) {
      var abc = document.createElement(`div`)
      // console.log("div_num: ", num)
      document.getElementById('logUserDiv').appendChild(abc)
      abc.innerHTML = `<img id="outputOV${num}" style= "max-height: 200px; display: block; margin:5px; max-width: 65%; float:right" /> `
      var output2 = document.getElementById(`outputOV${num}`);
      output2.src = imgUrl
    }
    setImgCBNum(num)
  };

  function loadFileSaved(event, id) {
    // var num = parseInt(id) + 1
    getBaseUrlSaved(id)
    var output = document.getElementById(`output${id}`);
    var imgUrl = URL.createObjectURL(event.target.files[0]);
    output.src = imgUrl
    setTemp(imgUrl)
    output.onload = function () {
      URL.revokeObjectURL(output.src) // free memory
    }
    var element = document.getElementById(`outputOV${id}`);
    // console.log(element)
    if (typeof (element) != 'undefined' && element != null) {
      // Exists.
      var output2 = document.getElementById(`outputOV${id}`);
      // console.log("output2", output2)
      output2.src = imgUrl
    } else if (element === null) {
      var abc = document.createElement(`div`)
      // console.log("div_num: ", id)
      document.getElementById('logUserDiv').appendChild(abc)
      abc.innerHTML = `<img id="outputOV${id}" style= "max-height: 200px; display: block; margin:5px; max-width: 65%; float:right" /> `
      var output2 = document.getElementById(`outputOV${id}`);
      output2.src = imgUrl
    }
    setImgCBNum(id)
  };

  function loadFileImgMsg(event) {
    var num = parseInt(imgMsgCBNum) + 1
    getBaseUrlImgMsg(num)
    var output = document.getElementById(`outputImgMsg${num}`);
    var imgUrl = URL.createObjectURL(event.target.files[0]);
    output.src = imgUrl
    setTemp(imgUrl)
    output.onload = function () {
      URL.revokeObjectURL(output.src) // free memory
    }

    var element = document.getElementById(`outputImgMsgOV${num}`);
    // console.log(element)
    if (typeof (element) != 'undefined' && element != null) {
      // Exists.
      var output2 = document.getElementById(`outputImgMsgOV${num}`);
      output2.src = imgUrl
    } else if (element === null) {
      var abc = document.createElement(`div`)
      // console.log("div_num: ", num)
      document.getElementById('logUserDiv').appendChild(abc)
      abc.innerHTML = `<img id="outputImgMsgOV${num}" style= "max-height: 200px; display: block; margin:5px; max-width: 65%; float:right" /> `
      var output2 = document.getElementById(`outputImgMsgOV${num}`);
      output2.src = imgUrl
    }
    setImgMsgCBNum(num)
  };
  //loadFileImgMsg
  function loadFileImgMsgSaved(event, id) {
    // var num = parseInt(imgMsgCBNum) + 1
    getBaseUrlImgMsgSaved(id)
    var output = document.getElementById(`outputImgMsgSaved${id}`);
    var imgUrl = URL.createObjectURL(event.target.files[0]);
    output.src = imgUrl
    setTemp(imgUrl)
    output.onload = function () {
      URL.revokeObjectURL(output.src) // free memory
    }

    var element = document.getElementById(`outputImgMsgOV${id}`);
    // console.log(element)
    if (typeof (element) != 'undefined' && element != null) {
      // Exists.
      var output2 = document.getElementById(`outputImgMsgOV${id}`);
      output2.src = imgUrl
    } else if (element === null) {
      var abc = document.createElement(`div`)
      document.getElementById('logUserDiv').appendChild(abc)
      abc.innerHTML = `<img id="outputImgMsgOV${id}" style= "max-height: 200px; display: block; margin:5px; max-width: 65%; float:right" /> `
      var output2 = document.getElementById(`outputImgMsgOV${id}`);
      output2.src = imgUrl
    }
    setImgMsgCBNum(id)
  };

  function imgMsgOV(msg) {

    var num = parseInt(imgMsgCBNum) + 1
    // console.log("imgMsgOV: ", num)
    var element = document.getElementById(`imgMsgOVI${num}`)
    // console.log(element)
    if (typeof (element) != 'undefined' && element != null) {
      // Exists.
      document.getElementById(`imgMsgOVI${num}`).value = msg
    } else if (element === null) {
      var abc = document.createElement(`div`)
      document.getElementById('logUserDiv').appendChild(abc)
      abc.innerHTML =
        `<div id="ovMsgCB${num}" style="width: 100%; background-color: #51cbce; padding: 10px; margin:5px; display:block; float: right; border-radius: 10px">
      <textarea type="text" id="imgMsgOVI${num}" style=" width: 70% ;text-align: right; background-color: #51cbce; border: none" readonly/>
      </div> `
      document.getElementById(`imgMsgOVI${num}`).value = msg;
      setImgMsgCBNum(num)
    }
  }
  //imgMgsCustomSaved

  function imgMsgOVSaved(msg, id) {

    var num = parseInt(imgMsgCBNum) + 1
    // console.log("imgMsgOV: ", id)
    var element = document.getElementById(`imgMsgOVI${id}`)
    // console.log(element)
    if (typeof (element) != 'undefined' && element != null) {
      // Exists.
      document.getElementById(`imgMsgOVI${id}`).value = msg
    } else if (element === null) {
      var abc = document.createElement(`div`)
      document.getElementById('logUserDiv').appendChild(abc)
      abc.innerHTML =
        `<div id="ovMsgCB${id}" style="width: 100%; background-color: #51cbce; padding: 10px; margin:5px; display:block; float: right; border-radius: 10px">
      <textarea type="text" id="imgMsgOVI${id}" style=" width: 70% ;text-align: right; background-color: #51cbce; border: none" readonly/>
      </div> `
      document.getElementById(`imgMsgOVI${id}`).value = msg;
      setImgMsgCBNum(id)
    }
  }
  function ppOV(url) {

    var num = parseInt(ppCBNum) + 1
    var element = document.getElementById(`ppOVI${num}`)
    // console.log(element)
    if (typeof (element) != 'undefined' && element != null) {
      // Exists.
      document.getElementById(`ppOVI${num}`).src = url
    } else if (element === null) {
      var abc = document.createElement(`div`)
      document.getElementById('logUserDiv').appendChild(abc)
      abc.innerHTML =
        `<div id="ovPPCB${num}" style="width: 100%; padding: 10px; margin:5px; display:block; float: right; border-radius: 10px">
      <img id="ppOVI${num}" style="max-height:100px; max-width:100px" />
      </div> `
      document.getElementById(`ppOVI${num}`).src = url
      setPpCBNum(num)
    }
  }

  function imgOVkey(msg) {
    // console.log(msg)
    var num = parseInt(msgCBNum) + 1

    var element = document.getElementById(`imgOVIKey${num}`)
    // console.log(element)
    if (typeof (element) != 'undefined' && element != null) {
      // Exists.
      document.getElementById(`imgOVIKey${num}`).value = msg
    } else if (element === null) {
      var abc = document.createElement(`div`)
      document.getElementById('logUserDiv').appendChild(abc)
      abc.innerHTML =
        `
        <div id="ovImgKey${num}" style="width: 70%; background-color: #51cbce; padding: 10px; float:left; margin:5px; display:block; border-radius: 10px">
      <input type="text" id="imgOVIKey${num}" style="background-color: #51cbce; border: none" readonly/>
      </div>`
      document.getElementById(`imgOVIKey${num}`).value = msg;
      document.getElementById(`imgCustomKey${num}`).value = msg;
    }
    // setMsgCBNum(num)
  }


  function msgOV(msg) {
    // console.log(msg)
    var num = parseInt(msgCBNum) + 1

    var element = document.getElementById(`msgOVI${num}`)
    // console.log(element)
    if (typeof (element) != 'undefined' && element != null) {
      // Exists.
      document.getElementById(`msgOVI${num}`).value = msg
    } else if (element === null) {
      var abc = document.createElement(`div`)
      document.getElementById('logUserDiv').appendChild(abc)
      abc.innerHTML =
        `<div id="ovMsg${num}" style="width: 70%; background-color: #51cbce; padding: 10px; margin:5px; display:block; float: right; border-radius: 10px">
      <input type="text" id="msgOVI${num}" style=" width: 70%; text-align: right; background-color: #51cbce; border: none" readonly/>
      </div> `
      document.getElementById(`msgOVI${num}`).value = msg;
      document.getElementById(`mgsCustom${num}`).value = msg;
    }
    setMsgCBNum(num)
  }

  function msgOVSaved(msg, id) {
    // console.log(msg)
    var num = parseInt(msgCBNum) + 1

    var element = document.getElementById(`msgOVI${id}`)
    // console.log(element)
    if (typeof (element) != 'undefined' && element != null) {
      // Exists.
      document.getElementById(`msgOVI${id}`).value = msg
    } else if (element === null) {
      var abc = document.createElement(`div`)
      document.getElementById('logUserDiv').appendChild(abc)
      abc.innerHTML =
        `<div id="ovMsg${id}" style="width: 70%; background-color: #51cbce; padding: 10px; margin:5px; display:block; float: right; border-radius: 10px">
      <input type="text" id="msgOVI${id}" style=" width: 70%; text-align: right; background-color: #51cbce; border: none" readonly/>
      </div> `
      document.getElementById(`msgOVI${id}`).value = msg;
      document.getElementById(`mgsCustomSaved${id}`).value = msg;
    }
    setMsgCBNum(id)
  }

  function msgOVkey(msg) {
    // console.log(msg)
    var num = parseInt(msgCBNum) + 1

    var element = document.getElementById(`msgOVIKey${num}`)
    // console.log(element)
    if (typeof (element) != 'undefined' && element != null) {
      // Exists.
      document.getElementById(`msgOVIKey${num}`).value = msg
    } else if (element === null) {
      var abc = document.createElement(`div`)
      document.getElementById('logUserDiv').appendChild(abc)
      abc.innerHTML =
        `
        <div id="ovMsgKey${num}" style="width: 70%; background-color: #51cbce; padding: 10px; float:left; margin:5px; display:block; border-radius: 10px">
      <input type="text" id="msgOVIKey${num}" style="width: 70%; background-color: #51cbce; border: none" readonly/>
      </div>`
      document.getElementById(`msgOVIKey${num}`).value = msg;
      document.getElementById(`mgsCustomKey${num}`).value = msg;
    }
    // setMsgCBNum(num)
  }

  function imgMsgOVkey(msg) {
    // console.log(msg)
    var num = parseInt(msgCBNum) + 1

    var element = document.getElementById(`imgMsgOVIKey${num}`)
    // console.log(element)
    if (typeof (element) != 'undefined' && element != null) {
      // Exists.
      document.getElementById(`imgMsgOVIKey${num}`).value = msg
    } else if (element === null) {
      var abc = document.createElement(`div`)
      document.getElementById('logUserDiv').appendChild(abc)
      abc.innerHTML =
        `
        <div id="ovImgMsgKey${num}" style="width: 70%; background-color: #51cbce; padding: 10px; float:left; margin:5px; display:block; border-radius: 10px">
      <input type="text" id="imgMsgOVIKey${num}" style=" width: 70%; background-color: #51cbce; border: none" readonly/>
      </div>`
      document.getElementById(`imgMsgOVIKey${num}`).value = msg;
      document.getElementById(`imgMgsCustomKey${num}`).value = msg;
    }
    // setMsgCBNum(num)
  }

  const [idSC, setIdSC] = useState(1)
  function addImgChatbot() {
    var numIndex = parseInt(imgCBNum) + 1
    var abc = document.createElement("div")
    document.getElementById("div_custom").appendChild(abc)
    abc.innerHTML =
      `<div id="chatbot_image${numIndex}" style="border-radius: 20px; margin-top: 20px; display:block; background-color: rgb(244, 243, 239); padding: 40px; ">
      
    <input id="imgNum${numIndex}" name="imageChatbot" type="file" accept="image/*" />
    <input id="imgDataNum${numIndex}" name="imgchatbot${numIndex}" type=hidden /> <br /><br />
    <div style=" text-align: center" }}>
      <img id="output${numIndex}" style=" max-height: 200px; max-width: 40%" }} />
    </div>
    <div id="choice${numIndex}">
    
    </div>
    
    <div id="msgChoice${idSC}">
      <div style="display: flex">
        <div id="singleChoice${idSC}" style=" padding:5px">
          <button style="background-color:#FFFFFF; border: 1px solid #51cbce; border-radius:10px">Single choice</button>
        </div>
        <div id="threeChoice${idSC}" style=" padding:5px">
          <button style="background-color:#FFFFFF; border: 1px solid #51cbce; border-radius:10px">Three choice</button>
        </div>
        <div id="freeInput${idSC}" style=" padding:5px">
          <button style="background-color:#FFFFFF; border: 1px solid #51cbce; border-radius:10px">Free input</button>
        </div>
      </div>
    </div>
    </br>
    <div style=" border-radius:10px; background-color:white; width:200px; text-align:center">
      <div id="choiceOption${idSC}" style="text-align:center">
      
      </div>
      <div id="choiceThree${idSC}" style="display:none;border-radius:10px"></div>
    </div>
    <div id="btnDelImg${numIndex}" style="float:right;">
        <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
        font-weight:800">削除</button>
      </div>
      <div id="btnAddEachImg${numIndex}" style="float:right; display:block">
      <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
      font-weight:800">追加</button>
    </div>
  </div>`
    // document.getElementById(`btnDelImg${numIndex}`).style.display='none'
    document.getElementById(`imgNum${numIndex}`).addEventListener('change', (e) => loadFile(e))
    document.getElementById(`singleChoice${idSC}`).addEventListener('click', (event) => {
      event.preventDefault()
      setIsAddOpenSingleChoice(true)
    })
    document.getElementById(`threeChoice${idSC}`).addEventListener('click', (event) => {
      event.preventDefault()
      setIsAddOpenThreeChoice(true)
    })
    document.getElementById(`freeInput${idSC}`).addEventListener('click', (event) => {
      event.preventDefault()
      setIsAddOpenFreeInput(true)
    }) //setIsAddOpenFreeInput
    // document.getElementById(`imgNum${numIndex}`).addEventListener('change', () => { document.getElementById(`btnDelImg${numIndex}`).style.display = 'block' })
    document.getElementById(`btnDelImg${numIndex}`).addEventListener('click', () => deleteImgCB(numIndex))
    document.getElementById(`btnAddEachImg${numIndex}`).addEventListener('click', (event) => {
      event.preventDefault()
      // console.log(bagId)

      // document.getElementById("underlineSCNextMsg")

      var add
      if (document.getElementById(`bagAddSC${idSC}`) != null || document.getElementById(`groupAddSC${idSC}`) != null || document.getElementById(`titleAddSC${idSC}`) != null) {
        var titlea = document.getElementById(`titleAddSC${idSC}`).value
        var group = document.getElementById(`groupAddSC${idSC}`).value
        var group_name = document.getElementById(`groupNameAddSC${idSC}`).value
        var bag_name = document.getElementById(`bagNameAddSC${idSC}`).value
        var bag = document.getElementById(`bagAddSC${idSC}`).value
        var type = document.getElementById(`typeAddSC${idSC}`).value
        var web = document.getElementById(`webAddSC${idSC}`).value
        var lbl = document.getElementById(`lblAddSC${idSC}_${bagAddSC}`).value
        console.log("lbl: ", lbl)
        var listLbl = lbl.substring(2, lbl.length).split(", ")
        var lastListLBL = []
        for (var i = 0; i < listLbl.length; i++) {
          lastListLBL.push({ label_name: listLbl[i] })
        }
        if (type == "mess") {
          add = {
            message: {
              message_bag_id: bagId,
              message_value: "", message_type: "img",
              img_value: document.getElementById(`imgDataNum${numIndex}`).value,
              message_buttons: [
                { button_type: "mess", title: titlea, message_bag_id: `${bag}`, message_button_labels: lastListLBL }
              ]
            },

          }
        } else if (type == "web_url") {
          add = {
            message: {
              message_bag_id: bagId,
              message_value: "", message_type: "img",
              img_value: document.getElementById(`imgDataNum${numIndex}`).value,
              message_buttons: [
                { button_type: "web_url", title: titlea, content: web, message_button_labels: lastListLBL }
              ]
            },

          }
        }
      } else if (document.getElementById(`bagAddTC${idSC}_${totalItemTC}`) != null || document.getElementById(`groupAddTC${numIndex}_${totalItemTC}`) != null || document.getElementById(`titleAddTC${idSC}_${totalItemTC}`) != null) {
        var message_buttons = []
        // console.log("totalItemTC: ", totalItemTC)
        var totalTCItem = document.getElementById(`totalItemTC${idSC}`).value


        console.log("mb ne: ", totalTCItem)
        for (var i = 1; i <= totalTCItem; i++) {

          var titlea = document.getElementById(`titleAddTC${idSC}_${i}`).value
          var group = document.getElementById(`groupAddTC${idSC}_${i}`).value
          var group_name = document.getElementById(`groupNameAddTC${idSC}_${i}`).value
          var bag_name = document.getElementById(`bagNameAddTC${idSC}_${i}`).value
          var bag = document.getElementById(`bagAddTC${idSC}_${i}`).value
          var type = document.getElementById(`typeAddTC${idSC}_${i}`).value
          var web = document.getElementById(`webAddTC${idSC}_${i}`).value
          var lbl = document.getElementById(`lblAddTCItem${idSC}_${i}`).value

          // console.log("lbl ne: ", lbl.substring(2, lbl.length))
          var listLbl = lbl.substring(2, lbl.length).split(", ")
          var lastListLBL = []
          for (var j = 0; j < listLbl.length; j++) {
            lastListLBL.push({ label_name: listLbl[j] })
          }
          if (type == "mess") {

            // add = {
            //   message: { message_bag_id: bagId, message_value: "", message_type: "img", img_value: document.getElementById(`imgDataNum${numIndex}`).value },
            //   message_button: [
            //     { button_type: "mess", title: titlea, content: `+message_bag_id_${bag}` }
            //   ]
            // }

            message_buttons.push({ button_type: "mess", title: titlea, message_bag_id: `${bag}`, message_button_labels: lastListLBL })
          } else if (type == "web_url") {
            // add = {
            //   message: { message_bag_id: bagId, message_value: "", message_type: "img", img_value: document.getElementById(`imgDataNum${numIndex}`).value },
            //   message_button: [
            //     { button_type: "web_url", title: titlea, content: web }
            //   ]
            // }

            message_buttons.push({ button_type: "web_url", title: titlea, content: web, message_button_labels: lastListLBL })
          }
        }
        add = {
          message: {
            message_bag_id: bagId,
            message_value: "", message_type: "img",
            img_value: document.getElementById(`imgDataNum${numIndex}`).value,
            message_buttons
          },


        }
      } else if (document.getElementById(`formatCheckSelect${idSC}`).value != null || document.getElementById(`formatCheckMSG${idSC}`).value != null) {
        // var group = document.getElementById(`groupAddFI${idSC}`).value
        // var bag = document.getElementById(`bagAddFI${idSC}`).value
        var lbl = document.getElementById(`lblAddFI${idSC}_${bagAddSC}`).value
        var formatCheckSelect = document.getElementById(`formatCheckSelect${idSC}`).value
        var formatCheckMSG = document.getElementById(`formatCheckMSG${idSC}`).value
        console.log("lbl: ", lbl)

        var listLbl = lbl.substring(2, lbl.length).split(", ")
        var lastListLBL = []
        for (var i = 0; i < listLbl.length; i++) {
          lastListLBL.push({ label_name: listLbl[i] })
        }
        add = {
          message: {
            message_bag_id: bagId,
            message_value: "", message_type: "img",
            img_value: document.getElementById(`imgDataNum${numIndex}`).value,
            free_input: {
              message_bag_id: `1`,
              free_input_labels: lastListLBL,
              format_check: formatCheckSelect, //nhan 3 gia tri "no_validate", "email", "phone_number" 
              format_check_message: formatCheckMSG
            }
          },
          // message_button: [
          //   { button_type: "format", title: '', content: `+message_bag_id_${bag}`, label: lastListLBL, format: formatCheckSelect, format_msg: formatCheckMSG }
          // ],
          // free_input: {
          //   message_bag_id: `${bag}`,
          //   free_input_labels: lastListLBL,
          //   format_check: formatCheckSelect, //nhan 3 gia tri "no_validate", "email", "phone_number" 
          //   format_check_message: formatCheckMSG
          // }
        }
      }
      else {
        add = {
          message: { message_bag_id: bagId, message_value: "", message_type: "img", img_value: document.getElementById(`imgDataNum${numIndex}`).value }
        }
      }

      console.log(add)
      setIdSC(idSC + 1)
      setTotalItemTC(1)

      ///Uncomment below to add

      api.post(`/api/v1/message_managements/messages`, add).then(res => {
        console.log("add ne: ", res)
        setTimeout(() => {
          setIsOpenNoti(true)
          setMsgNoti("追加しました。")
        }, 1500)

        setTimeout(function () {
          setIsOpenNoti(true)
        }, 2000);
        // reloadMessMsgBag()
        getBagMsg(idReloadMsgBagFromGetMSG, idReloadMsgBagFromGetMSG)
      }).catch(error => {
        console.log(error)
        // if (error.response.data.code === 3) {
        //     requestNewToken(path)
        // }
      })



    })
    // document.getElementById(`imgCustomKey${numIndex}`).addEventListener('change', (e) => imgOVkey(e.target.value))
  }

  function addMsgChatbot() {
    var id = idForReloadMsgBag
    // var idIn
    if (idForReloadMsgBag === undefined) {
      id = idReloadMsgBagFromGetMSG
    } else {
      id = idForReloadMsgBag
    }
    var numIndex = parseInt(msgCBNum) + 1
    // setIdSC(idSC + 1)
    var abc = document.createElement("div")
    document.getElementById("div_custom").appendChild(abc)
    abc.innerHTML =
      `<div id="chatbot_message${numIndex}" style=" border-radius: 20px; display:block; background-color: #f4f3ef; padding: 40px; margin-top: 20px; text-align: center" >
    
    <div><textarea name="messagesVa${numIndex}" class="mgsChatbot" id="mgsCustom${numIndex}" placeholder="返事入力..." type="text" rows="3"></textarea></div>
    <div  id="msgChoice${idSC}">
      <div style="display: flex">
        <div id="singleChoice${idSC}" style=" padding:5px">
          <button style="background-color:#FFFFFF; border: 1px solid #51cbce; border-radius:10px">Single choice</button>
        </div>
        <div id="threeChoice${idSC}" style=" padding:5px">
          <button style="background-color:#FFFFFF; border: 1px solid #51cbce; border-radius:10px">Three choice</button>
        </div>
        <div id="freeInput${idSC}" style=" padding:5px">
          <button style="background-color:#FFFFFF; border: 1px solid #51cbce; border-radius:10px">Free input</button>
        </div>
      </div>
    </div>
    </br>
    <div style=" border-radius:10px; background-color:white; width:200px; text-align:center">
      <div id="choiceOption${idSC}" style="text-align:center">
      
      </div>
      <div id="choiceThree${idSC}" style="display:none;border-radius:10px"></div>
    </div>
    <div id="btnDelMsg${numIndex}" style="float:right; display:block">
        <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
        font-weight:800">削除</button>
      </div>
      <div id="btnAddEachMsg${numIndex}" style="float:right; display:block">
      <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
      font-weight:800">追加</button>
    </div>
    </div>`
    document.getElementById(`singleChoice${idSC}`).addEventListener('click', (event) => {
      event.preventDefault()
      setIsAddOpenSingleChoice(true)
    })
    document.getElementById(`threeChoice${idSC}`).addEventListener('click', (event) => {
      event.preventDefault()
      setIsAddOpenThreeChoice(true)
    })
    document.getElementById(`freeInput${idSC}`).addEventListener('click', (event) => {
      event.preventDefault()
      setIsAddOpenFreeInput(true)
    })
    document.getElementById(`btnAddEachMsg${numIndex}`).addEventListener('click', (event) => {
      event.preventDefault()
      var element = document.getElementById(`mgsCustom${numIndex}`).value
      // alert(bagId)
      // var add = {
      //   message: { message_bag_id: bagId, message_value: element, message_type: "msg", img_value: "" }
      // }
      var add
      if (document.getElementById(`bagAddSC${idSC}`) != null || document.getElementById(`groupAddSC${idSC}`) != null || document.getElementById(`titleAddSC${idSC}`) != null) {
        var titlea = document.getElementById(`titleAddSC${idSC}`).value
        var group = document.getElementById(`groupAddSC${idSC}`).value
        var group_name = document.getElementById(`groupNameAddSC${idSC}`).value
        var bag_name = document.getElementById(`bagNameAddSC${idSC}`).value
        var bag = document.getElementById(`bagAddSC${idSC}`).value
        var type = document.getElementById(`typeAddSC${idSC}`).value
        var web = document.getElementById(`webAddSC${idSC}`).value
        var lbl = document.getElementById(`lblAddSC${idSC}_${bagAddSC}`).value
        console.log("lbl: ", lbl)
        var listLbl = lbl.substring(2, lbl.length).split(", ")
        var lastListLBL = []
        for (var i = 0; i < listLbl.length; i++) {
          lastListLBL.push({ label_name: listLbl[i] })
        }
        if (type == "mess") {
          add = {
            message: {
              message_bag_id: bagId,
              message_value: element,
              message_type: "msg",
              img_value: "",
              message_buttons: [
                { button_type: "mess", title: titlea, message_bag_id: `${bag}`, message_button_labels: lastListLBL }
              ]
            }

          }
        } else if (type == "web_url") {
          add = {
            message: {
              message_bag_id: bagId,
              message_value: element,
              message_type: "msg",
              img_value: "",
              message_buttons: [
                { button_type: "web_url", title: titlea, content: web, message_button_labels: lastListLBL }
              ]
            }

          }
        }
      } else if (document.getElementById(`bagAddTC${idSC}_${totalItemTC}`) != null || document.getElementById(`groupAddTC${numIndex}_${totalItemTC}`) != null || document.getElementById(`titleAddTC${idSC}_${totalItemTC}`) != null) {
        var message_buttons = []
        // console.log("totalItemTC: ", totalItemTC)
        var totalTCItem = document.getElementById(`totalItemTC${idSC}`).value


        console.log("mb ne: ", totalTCItem)
        for (var i = 1; i <= totalTCItem; i++) {

          var titlea = document.getElementById(`titleAddTC${idSC}_${i}`).value
          var group = document.getElementById(`groupAddTC${idSC}_${i}`).value
          var group_name = document.getElementById(`groupNameAddTC${idSC}_${i}`).value
          var bag_name = document.getElementById(`bagNameAddTC${idSC}_${i}`).value
          var bag = document.getElementById(`bagAddTC${idSC}_${i}`).value
          var type = document.getElementById(`typeAddTC${idSC}_${i}`).value
          var web = document.getElementById(`webAddTC${idSC}_${i}`).value
          var lbl = document.getElementById(`lblAddTCItem${idSC}_${i}`).value
          // console.log("lbl ne: ", lbl.substring(2, lbl.length))
          var listLbl = lbl.substring(2, lbl.length).split(", ")
          var lastListLBL = []
          for (var j = 0; j < listLbl.length; j++) {
            lastListLBL.push({ label_name: listLbl[j] })
          }
          if (type == "mess") {

            // add = {
            //   message: { message_bag_id: bagId, message_value: "", message_type: "img", img_value: document.getElementById(`imgDataNum${numIndex}`).value },
            //   message_button: [
            //     { button_type: "mess", title: titlea, content: `+message_bag_id_${bag}` }
            //   ]
            // }

            message_buttons.push({ button_type: "mess", title: titlea, message_bag_id: `${bag}`, message_button_labels: lastListLBL })
          } else if (type == "web_url") {
            // add = {
            //   message: { message_bag_id: bagId, message_value: "", message_type: "img", img_value: document.getElementById(`imgDataNum${numIndex}`).value },
            //   message_button: [
            //     { button_type: "web_url", title: titlea, content: web }
            //   ]
            // }

            message_buttons.push({ button_type: "web_url", title: titlea, content: web, message_button_labels: lastListLBL })
          }
        }
        add = {
          message: {
            message_bag_id: bagId,
            message_value: element,
            message_type: "msg",
            img_value: "",
            message_buttons
          },

        }
      } else if (document.getElementById(`formatCheckSelect${idSC}`) != null) {
        // var group = document.getElementById(`groupAddFI${idSC}`).value
        // var bag = document.getElementById(`bagAddFI${idSC}`).value
        var lbl = document.getElementById(`lblAddFI${idSC}_${bagAddSC}`).value
        var formatCheckSelect = document.getElementById(`formatCheckSelect${idSC}`).value
        var formatCheckMSG = document.getElementById(`formatCheckMSG${idSC}`).value
        console.log("lbl: ", lbl)
        var listLbl = lbl.substring(2, lbl.length).split(", ")
        var lastListLBL = []
        for (var i = 0; i < listLbl.length; i++) {
          lastListLBL.push({ label_name: listLbl[i] })
        }
        add = {
          message: {
            message_bag_id: bagId,
            message_value: element,
            message_type: "msg",
            img_value: "",
            free_input: {
              message_bag_id: `1`,
              free_input_labels: lastListLBL,
              format_check: formatCheckSelect, //nhan 3 gia tri "no_validate", "email", "phone_number" 
              format_check_message: formatCheckMSG
            }
          },
          // message_button: [
          //   { button_type: "format", title: '', content: `+message_bag_id_${bag}`, label: listLbl, format: formatCheckSelect, format_msg: formatCheckMSG }
          // ]
        }
      }
      else {
        add = {
          message: { message_bag_id: bagId, message_value: element, message_type: "msg", img_value: "" }
        }
      }

      console.log(add)



      api.post(`/api/v1/message_managements/messages`, add).then(res => {
        // alert("Add Successfully")
        console.log(res)
        setIdSC(idSC + 1)
        setTotalItemTC(1)
        setTimeout(() => {
          setIsOpenNoti(true)
          setMsgNoti("追加しました。")
        }, 1500)

        setTimeout(function () {
          setIsOpenNoti(false)
        }, 2000);
        // reloadMessMsgBag()
        getBagMsg(idReloadMsgBagFromGetMSG, idReloadMsgBagFromGetMSG)
        // getBagMsg(id, id)

      }).catch(error => {
        console.log(error)
      })
    })
    document.getElementById(`mgsCustom${numIndex}`).addEventListener('change', (e) => msgOV(e.target.value))
    // document.getElementById(`mgsCustom${numIndex}`).addEventListener('change', () => { document.getElementById(`btnDelMsg${numIndex}`).style.display = 'block' })
    document.getElementById(`btnDelMsg${numIndex}`).addEventListener('click', () => deleteMsgCB(numIndex))
  }

  function addPPChatbot(url, id) {
    setIsOpenSelectPastPost(false)
    var numIndex = parseInt(ppCBNum) + 1
    // setPpCBNum(numIndex)
    var abc = document.createElement("div")
    document.getElementById("div_custom").appendChild(abc)
    abc.innerHTML =
      `<div id="chatbot_pp${numIndex}" style=" border-radius: 20px; display:block; background-color: #f4f3ef; padding: 40px; margin-top: 20px; text-align: center" >
     <div>
     <img style="max-width:200px; max-height:200px" src=${url} />
     <input name="pp_value${numIndex}" value=${id} type=hidden />
   </div>

   <div  id="msgChoice${idSC}">
      <div style="display: flex">
        <div id="singleChoice${idSC}" style=" padding:5px">
          <button style="background-color:#FFFFFF; border: 1px solid #51cbce; border-radius:10px">Single choice</button>
        </div>
        <div id="threeChoice${idSC}" style=" padding:5px">
          <button style="background-color:#FFFFFF; border: 1px solid #51cbce; border-radius:10px">Three choice</button>
        </div>
        <div id="freeInput${idSC}" style=" padding:5px">
          <button style="background-color:#FFFFFF; border: 1px solid #51cbce; border-radius:10px">Free input</button>
        </div>
      </div>
    </div>
    </br>
    <div style=" border-radius:10px; background-color:white; width:200px; text-align:center">
      <div id="choiceOption${idSC}" style="text-align:center">
      
      </div>
      <div id="choiceThree${idSC}" style="display:none;border-radius:10px"></div>
    </div>

   <div id="btnDelPP${numIndex}" style="float:right; display:block">
        <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
        font-weight:800">削除</button>
      </div>
      <div id="btnAddPP${numIndex}" style="float:right; display:block">
        <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
        font-weight:800">追加</button>
      </div>
    
    </div>
    `
    // document.getElementById(`ppCustom${numIndex}`).addEventListener('change', (e) => msgOV(e.target.value))
    ppOV(url)
    // document.getElementById(`mgsCustom${numIndex}`).addEventListener('change', () => { document.getElementById(`btnDelMsg${numIndex}`).style.display = 'block' })
    document.getElementById(`btnDelPP${numIndex}`).addEventListener('click', () => deletePPCB(numIndex))
    document.getElementById(`singleChoice${idSC}`).addEventListener('click', (event) => {
      event.preventDefault()
      setIsAddOpenSingleChoice(true)
    })
    document.getElementById(`threeChoice${idSC}`).addEventListener('click', (event) => {
      event.preventDefault()
      setIsAddOpenThreeChoice(true)
    })
    document.getElementById(`freeInput${idSC}`).addEventListener('click', (event) => {
      event.preventDefault()
      setIsAddOpenFreeInput(true)
    })
    document.getElementById(`btnAddPP${numIndex}`).addEventListener('click', (event) => {
      event.preventDefault()
      // var add = {
      //   message: { message_bag_id: bagId, message_value: id.toString(), message_type: "past_post", img_value: "", preview_past_post_url: url }
      // }

      var add
      if (document.getElementById(`bagAddSC${idSC}`) != null || document.getElementById(`groupAddSC${idSC}`) != null || document.getElementById(`titleAddSC${idSC}`) != null) {
        var titlea = document.getElementById(`titleAddSC${idSC}`).value
        var group = document.getElementById(`groupAddSC${idSC}`).value
        var group_name = document.getElementById(`groupNameAddSC${idSC}`).value
        var bag_name = document.getElementById(`bagNameAddSC${idSC}`).value
        var bag = document.getElementById(`bagAddSC${idSC}`).value
        var type = document.getElementById(`typeAddSC${idSC}`).value
        var web = document.getElementById(`webAddSC${idSC}`).value
        var lbl = document.getElementById(`lblAddSC${idSC}_${bagAddSC}`).value
        console.log("lbl: ", lbl)
        var listLbl = lbl.substring(2, lbl.length).split(", ")
        var lastListLBL = []
        for (var i = 0; i < listLbl.length; i++) {
          lastListLBL.push({ label_name: listLbl[i] })
        }
        if (type == "mess") {
          add = {
            message: {
              message_bag_id: bagId,
              message_value: id.toString(),
              message_type: "past_post",
              img_value: "",
              preview_past_post_url: url,
              message_buttons: [
                { button_type: "mess", title: titlea, message_bag_id: `${bag}`, message_button_labels: lastListLBL }
              ]
            }
          }
        } else if (type == "web_url") {
          add = {
            message: {
              message_bag_id: bagId,
              message_value: id.toString(),
              message_type: "past_post",
              img_value: "",
              preview_past_post_url: url,
              message_buttons: [
                { button_type: "web_url", title: titlea, content: web, message_button_labels: lastListLBL }
              ]
            }
          }
        }
      } else if (document.getElementById(`bagAddTC${idSC}_${totalItemTC}`) != null || document.getElementById(`groupAddTC${numIndex}_${totalItemTC}`) != null || document.getElementById(`titleAddTC${idSC}_${totalItemTC}`) != null) {
        var message_buttons = []
        // console.log("totalItemTC: ", totalItemTC)
        var totalTCItem = document.getElementById(`totalItemTC${idSC}`).value


        console.log("mb ne: ", totalTCItem)
        for (var i = 1; i <= totalTCItem; i++) {

          var titlea = document.getElementById(`titleAddTC${idSC}_${i}`).value
          var group = document.getElementById(`groupAddTC${idSC}_${i}`).value
          var group_name = document.getElementById(`groupNameAddTC${idSC}_${i}`).value
          var bag_name = document.getElementById(`bagNameAddTC${idSC}_${i}`).value
          var bag = document.getElementById(`bagAddTC${idSC}_${i}`).value
          var type = document.getElementById(`typeAddTC${idSC}_${i}`).value
          var web = document.getElementById(`webAddTC${idSC}_${i}`).value
          var lbl = document.getElementById(`lblAddTCItem${idSC}_${i}`).value
          // console.log("lbl ne: ", lbl.substring(2, lbl.length))
          var listLbl = lbl.substring(2, lbl.length).split(", ")
          var lastListLBL = []
          for (var j = 0; j < listLbl.length; j++) {
            lastListLBL.push({ label_name: listLbl[j] })
          }
          if (type == "mess") {

            // add = {
            //   message: { message_bag_id: bagId, message_value: "", message_type: "img", img_value: document.getElementById(`imgDataNum${numIndex}`).value },
            //   message_button: [
            //     { button_type: "mess", title: titlea, content: `+message_bag_id_${bag}` }
            //   ]
            // }

            message_buttons.push({ button_type: "mess", title: titlea, message_bag_id: `${bag}`, message_button_labels: lastListLBL })
          } else if (type == "web_url") {
            // add = {
            //   message: { message_bag_id: bagId, message_value: "", message_type: "img", img_value: document.getElementById(`imgDataNum${numIndex}`).value },
            //   message_button: [
            //     { button_type: "web_url", title: titlea, content: web }
            //   ]
            // }

            message_buttons.push({ button_type: "web_url", title: titlea, content: web, message_button_labels: lastListLBL })
          }
        }
        add = {
          message: {
            message_bag_id: bagId,
            message_value: id.toString(),
            message_type: "past_post",
            img_value: "",
            preview_past_post_url: url,
            message_buttons
          }
        }
      } else if (document.getElementById(`bagAddFI${idSC}`) != null || document.getElementById(`groupAddFI${idSC}_${totalItemTC}`) != null) {
        // var group = document.getElementById(`groupAddFI${idSC}`).value
        // var bag = document.getElementById(`bagAddFI${idSC}`).value
        var lbl = document.getElementById(`lblAddFI${idSC}_${bagAddSC}`).value
        var formatCheckSelect = document.getElementById(`formatCheckSelect${idSC}`).value
        var formatCheckMSG = document.getElementById(`formatCheckMSG${idSC}`).value
        console.log("lbl: ", lbl)
        var listLbl = lbl.substring(2, lbl.length).split(", ")
        var lastListLBL = []
        for (var i = 0; i < listLbl.length; i++) {
          lastListLBL.push({ label_name: listLbl[i] })
        }

        add = {
          message: {
            message_bag_id: bagId,
            message_value: id.toString(),
            message_type: "past_post",
            img_value: "",
            preview_past_post_url: url,
            free_input: {
              message_bag_id: `1`,
              free_input_labels: lastListLBL,
              format_check: formatCheckSelect, //nhan 3 gia tri "no_validate", "email", "phone_number" 
              format_check_message: formatCheckMSG
            }
          }
        }
      }
      else {
        add = {
          message: { message_bag_id: bagId, message_value: id.toString(), message_type: "past_post", img_value: "", preview_past_post_url: url }
        }
      }

      console.log(add)





      api.post(`/api/v1/message_managements/messages`, add).then(res => {
        console.log(res)
        setIdSC(idSC + 1)
        setTotalItemTC(1)
        setTimeout(() => {
          setIsOpenNoti(true)
          setMsgNoti("追加しました。")
        }, 1500)

        setTimeout(function () {
          setIsOpenNoti(false)
        }, 2000);
        // reloadMessMsgBag()
        getBagMsg(idReloadMsgBagFromGetMSG, idReloadMsgBagFromGetMSG)
      }).catch(error => {
        console.log(error)
        // if (error.response.data.code === 3) {
        //     requestNewToken(path)
        // }
      })
    })
  }

  const [idUpdatePastPost, setIdUpdatePastPost] = useState()
  const [urlUpdatePastPost, setURLUpdatePastPost] = useState()
  const [totalItemPP, setTotalItemPP] = useState()
  const [updateItemPP, setUpdateItemPP] = useState()
  const [bagUpPP, setBagUpPP] = useState()
  function upPP(ppurl, id) {

    // if(document.getElementById(`lbOvPP${idPPUP}`)!== null){
    //   document.getElementById(`lbOvPP${idPPUP}`).style.display = "none"
    // document.getElementById(`ppCustomSavedOvi${idPPUP}`).style.display = "none"
    // }
    // document.getElementById(`imgUpPP${idPPUP}`).style.display = "block"

    // document.getElementById(`imgUpPP${idPPUP}`).style.display = "block"

    document.getElementById(`imgUpPP${idPPUP}`).src = ppurl
    document.getElementById(`PPUpOV${idPPUP}`).src = ppurl
    // setIdUpdatePastPost(id)
    // setURLUpdatePastPost(ppurl)



    setIsOpenSelectPastPostUp(false)
    document.getElementById(`btnUpdatePP${idPPUP}`).addEventListener('click', (event) => {
      event.preventDefault()
      document.getElementById(`btnUpdatePP${idPPUP}`).style.display = "none"
      document.getElementById(`btnChangePP${idPPUP}`).style.display = "block"



      // var update = { message: { message_value: id, message_type: "past_post", img_value: "", preview_past_post_url: ppurl } }


      var add
      if (document.getElementById(`bagAddSC${idPPUP}`) != null || document.getElementById(`groupAddSC${idPPUP}`) != null || document.getElementById(`titleAddSC${idPPUP}`) != null) {
        var titlea = document.getElementById(`titleAddSC${idPPUP}`).value
        var groupva = document.getElementById(`groupAddSC${idPPUP}`).value
        var group_name = document.getElementById(`groupNameAddSC${idPPUP}`).value
        var bag_name = document.getElementById(`groupAddSC${idPPUP}`).value
        var bag = document.getElementById(`bagNameAddSC${idPPUP}`).value
        var type = document.getElementById(`typeAddSC${idPPUP}`).value
        var web = document.getElementById(`webAddSC${idPPUP}`).value
        var lbl = document.getElementById(`lblAddSC${idPPUP}_${bagAddSC}`).value
        console.log("lbl: ", lbl)
        var listLbl = lbl.substring(2, lbl.length).split(", ")
        var lastListLBL = []
        for (var i = 0; i < listLbl.length; i++) {
          lastListLBL.push({ label_name: listLbl[i] })
        }
        if (type == "mess") {
          add = {
            message: {
              message_bag_id: bagUpPP,
              message_value: id,
              message_type: "past_post",
              img_value: "",
              preview_past_post_url: ppurl,
              message_buttons: [
                { button_type: "mess", title: titlea, message_bag_id: `${bag}`, message_button_labels: lastListLBL }
              ]
            }

          }
        } else if (type == "web_url") {
          add = {
            message: {
              message_bag_id: bagUpPP,
              message_value: id,
              message_type: "past_post",
              img_value: "",
              preview_past_post_url: ppurl,
              message_buttons: [
                { button_type: "web_url", title: titlea, content: web, message_button_labels: lastListLBL }
              ]
            }

          }
        }
      } else if (document.getElementById(`titleAddTC${idPPUP}_${totalItemTC}`) != null) {
        var message_buttons = []
        console.log("totalItemTC: ", totalItemTC)
        var totalTCItem = document.getElementById(`totalItemTC${idPPUP}`).value

        console.log("mb ne: ", totalTCItem)
        for (var i = 1; i <= totalTCItem; i++) {

          var titlea = document.getElementById(`titleAddTC${idPPUP}_${i}`).value
          var groupva = document.getElementById(`groupAddTC${idPPUP}_${i}`).value
          var group_name = document.getElementById(`groupNameAddTC${idPPUP}_${i}`).value
          var bag_name = document.getElementById(`bagNameAddTC${idPPUP}_${i}`).value
          var bag = document.getElementById(`bagAddTC${idPPUP}_${i}`).value
          var type = document.getElementById(`typeAddTC${idPPUP}_${i}`).value
          var web = document.getElementById(`webAddTC${idPPUP}_${i}`).value
          var lbl = document.getElementById(`lblAddTCItem${idPPUP}_${i}`).value
          // console.log("lbl ne: ", lbl.substring(2, lbl.length))
          var listLbl = lbl.substring(2, lbl.length).split(", ")
          var lastListLBL = []
          for (var j = 0; j < listLbl.length; j++) {
            lastListLBL.push({ label_name: listLbl[j] })
          }
          if (type == "mess") {

            // add = {
            //   message: { message_bag_id: bagId, message_value: "", message_type: "img", img_value: document.getElementById(`imgDataNum${numIndex}`).value },
            //   message_button: [
            //     { button_type: "mess", title: titlea, content: `+message_bag_id_${bag}` }
            //   ]
            // }

            message_buttons.push({ button_type: "mess", title: titlea, message_bag_id: `${bag}`, message_button_labels: lastListLBL })
          } else if (type == "web_url") {
            // add = {
            //   message: { message_bag_id: bagId, message_value: "", message_type: "img", img_value: document.getElementById(`imgDataNum${numIndex}`).value },
            //   message_button: [
            //     { button_type: "web_url", title: titlea, content: web }
            //   ]
            // }

            message_buttons.push({ button_type: "web_url", title: titlea, content: web, message_button_labels: lastListLBL })
          }
        }
        add = {
          message: {
            message_bag_id: bagUpPP,
            message_value: id,
            message_type: "past_post",
            img_value: "",
            preview_past_post_url: ppurl,
            message_buttons
          },

        }
      } else if (document.getElementById(`formatCheckSelect${idPPUP}`) != null) {
        // var group = document.getElementById(`groupAddFI${idSC}`).value
        // var bag = document.getElementById(`bagAddFI${idSC}`).value
        var lbl = document.getElementById(`lblAddFI${idPPUP}_${bagAddSC}`).value
        var formatCheckSelect = document.getElementById(`formatCheckSelect${idPPUP}`).value
        var formatCheckMSG = document.getElementById(`formatCheckMSG${idPPUP}`).value
        console.log("lbl: ", lbl)
        var listLbl = lbl.substring(2, lbl.length).split(", ")
        var lastListLBL = []
        for (var i = 0; i < listLbl.length; i++) {
          lastListLBL.push({ label_name: listLbl[i] })
        }
        add = {
          message: {
            message_bag_id: "1",
            message_value: id,
            message_type: "past_post",
            img_value: "",
            preview_past_post_url: ppurl,
            free_input: {
              message_bag_id: `1`,
              free_input_labels: lastListLBL,
              format_check: formatCheckSelect, //nhan 3 gia tri "no_validate", "email", "phone_number" 
              format_check_message: formatCheckMSG
            }
          },
          // message_button: [
          //   { button_type: "format", title: '', content: `+message_bag_id_${bag}`, label: listLbl, format: formatCheckSelect, format_msg: formatCheckMSG }
          // ]
        }
      }
      else {
        add = {
          message: { message_value: id, message_type: "past_post", img_value: "", preview_past_post_url: ppurl }
        }
      }

      console.log(add)

      setTotalItemTC(1)


      api.patch(`/api/v1/message_managements/messages/${idPPUP}`, add).then(res => {
        console.log(res)

        setTimeout(() => {
          setIsOpenNoti(true)
          setMsgNoti("更新しました。")
        }, 1500)

        setTimeout(function () {
          setIsOpenNoti(false)
        }, 2000);
        // getBagMsg(id, id)
        getBagMsg(idReloadMsgBagFromGetMSG, idReloadMsgBagFromGetMSG)
      }).catch(error => {
        console.log(error)
      })


      // api.patch(`/api/v1/message_managements/messages/${idPPUP}`, update).then(res => {
      //   console.log("Update post response: ", res)


      //   setTimeout(() => {
      //     setIsOpenNoti(true)
      //     setMsgNoti("更新しました。")
      //   }, 1500)
      //   setTimeout(function () {
      //     setIsOpenNoti(false)
      //   }, 2000);

      //   getBagMsg(idForReloadMsgBag, idForReloadMsgBag)
      // }).catch(error => {
      //   console.log(error)
      // })
    })
  }

  function addImgMsgChatbot() {
    var numIndex = parseInt(imgMsgCBNum) + 1

    var abc = document.createElement("div")
    document.getElementById("div_custom").appendChild(abc)
    abc.innerHTML =
      `<div id="chatbot_image_msg${numIndex}" style="border-radius: 20px; margin-top: 20px; background-color: rgb(244, 243, 239); padding: 40px; ">
     
    <input id="imgMsgNum${numIndex}" type="file" accept="image/*" /> <br /><br />
    <input id="imgValueMsgNum${numIndex}" name="imgValueMsgChatbot${numIndex}" type=hidden /> <br /><br />
    <div style=" text-align: center" }}>
      <img id="outputImgMsg${numIndex}" style=" max-height: 200px; max-width: 40%" }} />
    </div>
    <div style="text-align: center">
    <textarea class="mgsChatbot" id="imgMgsCustom${numIndex}" name="imgMsgValueChatbot${numIndex}" placeholder="返事入力..." type="text" rows="3"></textarea>
    </div>

    <div  id="msgChoice${idSC}">
      <div style="display: flex">
        <div id="singleChoice${idSC}" style=" padding:5px">
          <button style="background-color:#FFFFFF; border: 1px solid #51cbce; border-radius:10px">Single choice</button>
        </div>
        <div id="threeChoice${idSC}" style=" padding:5px">
          <button style="background-color:#FFFFFF; border: 1px solid #51cbce; border-radius:10px">Three choice</button>
        </div>
        <div id="freeInput${idSC}" style=" padding:5px">
          <button style="background-color:#FFFFFF; border: 1px solid #51cbce; border-radius:10px">Free input</button>
        </div>
      </div>
    </div>
    </br>
    <div style=" border-radius:10px; background-color:white; width:200px; text-align:center">
      <div id="choiceOption${idSC}" style="text-align:center">
      
      </div>
      <div id="choiceThree${idSC}" style="display:none;border-radius:10px"></div>
    </div>

    <div id="btnDelImgMsg${numIndex}" style="float:right; display:block">
        <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
        font-weight:800">削除</button>
      </div>
      <div id="btnAddImgMsg${numIndex}" style="float:right; display:block">
        <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
        font-weight:800">追加</button>
      </div>
  </div>`

    // console.log(document.getElementById(`outputImgMsg${numIndex}`))
    document.getElementById(`imgMsgNum${numIndex}`).addEventListener('change', (e) => loadFileImgMsg(e))
    document.getElementById(`imgMgsCustom${numIndex}`).addEventListener('change', (e) => imgMsgOV(e.target.value))

    document.getElementById(`singleChoice${idSC}`).addEventListener('click', (event) => {
      event.preventDefault()
      setIsAddOpenSingleChoice(true)
    })
    document.getElementById(`threeChoice${idSC}`).addEventListener('click', (event) => {
      event.preventDefault()
      setIsAddOpenThreeChoice(true)
    })
    document.getElementById(`freeInput${idSC}`).addEventListener('click', (event) => {
      event.preventDefault()
      setIsAddOpenFreeInput(true)
    })
    // document.getElementById(`imgMsgNum${numIndex}`).addEventListener('change', () => { document.getElementById(`btnDelImgMsg${numIndex}`).style.display = 'block' })
    // document.getElementById(`imgMgsCustom${numIndex}`).addEventListener('change', () => { document.getElementById(`btnDelImgMsg${numIndex}`).style.display = 'block' })
    document.getElementById(`btnDelImgMsg${numIndex}`).addEventListener('click', () => deleteImgMsgCB(numIndex))
    document.getElementById(`btnAddImgMsg${numIndex}`).addEventListener('click', (event) => {
      event.preventDefault()
      // var add = {
      //   message: { message_bag_id: bagId, message_value: document.getElementById(`imgMgsCustom${numIndex}`).value, message_type: "img_msg", img_value: document.getElementById(`imgValueMsgNum${numIndex}`).value }
      // }

      var add
      if (document.getElementById(`bagAddSC${idSC}`) != null || document.getElementById(`groupAddSC${idSC}`) != null || document.getElementById(`titleAddSC${idSC}`) != null) {
        var titlea = document.getElementById(`titleAddSC${idSC}`).value
        var group = document.getElementById(`groupAddSC${idSC}`).value
        var group_name = document.getElementById(`groupNameAddSC${idSC}`).value
        var bag_name = document.getElementById(`bagNameAddSC${idSC}`).value
        var bag = document.getElementById(`bagAddSC${idSC}`).value
        var type = document.getElementById(`typeAddSC${idSC}`).value
        var web = document.getElementById(`webAddSC${idSC}`).value
        var lbl = document.getElementById(`lblAddSC${idSC}_${bagAddSC}`).value
        console.log("lbl: ", lbl)
        var listLbl = lbl.substring(2, lbl.length).split(", ")
        var lastListLBL = []
        for (var i = 0; i < listLbl.length; i++) {
          lastListLBL.push({ label_name: listLbl[i] })
        }
        if (type == "mess") {
          add = {
            message: {
              message_bag_id: bagId,
              message_value: document.getElementById(`imgMgsCustom${numIndex}`).value,
              message_type: "img_msg",
              img_value: document.getElementById(`imgValueMsgNum${numIndex}`).value,
              message_buttons: [
                { button_type: "mess", title: titlea, message_bag_id: `${bag}`, message_button_labels: lastListLBL }
              ]
            },
          }
        } else if (type == "web_url") {
          add = {
            message: {
              message_bag_id: bagId,
              message_value: document.getElementById(`imgMgsCustom${numIndex}`).value,
              message_type: "img_msg",
              img_value: document.getElementById(`imgValueMsgNum${numIndex}`).value.Button,
              message_buttons: [
                { button_type: "web_url", title: titlea, content: web, message_button_labels: lastListLBL }
              ]
            }
          }
        }
      } else if (document.getElementById(`bagAddTC${idSC}_${totalItemTC}`) != null || document.getElementById(`groupAddTC${numIndex}_${totalItemTC}`) != null || document.getElementById(`titleAddTC${idSC}_${totalItemTC}`) != null) {
        var message_buttons = []
        // console.log("totalItemTC: ", totalItemTC)
        var totalTCItem = document.getElementById(`totalItemTC${idSC}`).value


        console.log("mb ne: ", totalTCItem)
        for (var i = 1; i <= totalTCItem; i++) {

          var titlea = document.getElementById(`titleAddTC${idSC}_${i}`).value
          var group = document.getElementById(`groupAddTC${idSC}_${i}`).value
          var group_name = document.getElementById(`groupNameAddTC${idSC}_${i}`).value
          var bag_name = document.getElementById(`bagNameAddTC${idSC}_${i}`).value
          var bag = document.getElementById(`bagAddTC${idSC}_${i}`).value
          var type = document.getElementById(`typeAddTC${idSC}_${i}`).value
          var web = document.getElementById(`webAddTC${idSC}_${i}`).value
          var lbl = document.getElementById(`lblAddTCItem${idSC}_${i}`).value
          // console.log("lbl ne: ", lbl.substring(2, lbl.length))
          var listLbl = lbl.substring(2, lbl.length).split(", ")
          var lastListLBL = []
          for (var j = 0; j < listLbl.length; j++) {
            lastListLBL.push({ label_name: listLbl[j] })
          }
          if (type == "mess") {

            // add = {
            //   message: { message_bag_id: bagId, message_value: "", message_type: "img", img_value: document.getElementById(`imgDataNum${numIndex}`).value },
            //   message_button: [
            //     { button_type: "mess", title: titlea, content: `+message_bag_id_${bag}` }
            //   ]
            // }

            message_buttons.push({ button_type: "mess", title: titlea, message_bag_id: `${bag}`, message_button_labels: lastListLBL })
          } else if (type == "web_url") {
            // add = {
            //   message: { message_bag_id: bagId, message_value: "", message_type: "img", img_value: document.getElementById(`imgDataNum${numIndex}`).value },
            //   message_button: [
            //     { button_type: "web_url", title: titlea, content: web }
            //   ]
            // }

            message_buttons.push({ button_type: "web_url", title: titlea, content: web, message_button_labels: lastListLBL })
          }
        }
        add = {
          message: {
            message_bag_id: bagId,
            message_value: document.getElementById(`imgMgsCustom${numIndex}`).value,
            message_type: "img_msg",
            img_value: document.getElementById(`imgValueMsgNum${numIndex}`).value,
            message_buttons
          },

        }
      } else if (document.getElementById(`bagAddFI${idSC}`) != null || document.getElementById(`groupAddFI${idSC}_${totalItemTC}`) != null) {
        // var group = document.getElementById(`groupAddFI${idSC}`).value
        // var bag = document.getElementById(`bagAddFI${idSC}`).value
        var lbl = document.getElementById(`lblAddFI${idSC}_${bagAddSC}`).value
        var formatCheckSelect = document.getElementById(`formatCheckSelect${idSC}`).value
        var formatCheckMSG = document.getElementById(`formatCheckMSG${idSC}`).value
        console.log("lbl: ", lbl)
        var listLbl = lbl.substring(2, lbl.length).split(", ")
        var lastListLBL = []
        for (var i = 0; i < listLbl.length; i++) {
          lastListLBL.push({ label_name: listLbl[i] })
        }
        add = {
          message: {
            message_bag_id: bagId,
            message_value: document.getElementById(`imgMgsCustom${numIndex}`).value,
            message_type: "img_msg",
            img_value: document.getElementById(`imgValueMsgNum${numIndex}`).value,

            free_input: {
              message_bag_id: `1`,
              free_input_labels: lastListLBL,
              format_check: formatCheckSelect, //nhan 3 gia tri "no_validate", "email", "phone_number" 
              format_check_message: formatCheckMSG
            }
          }
        }
      }
      else {
        add = {
          message: { message_bag_id: bagId, message_value: document.getElementById(`imgMgsCustom${numIndex}`).value, message_type: "img_msg", img_value: document.getElementById(`imgValueMsgNum${numIndex}`).value }
        }
      }

      console.log(add)

      setIdSC(idSC + 1)
      setTotalItemTC(1)

      api.post(`/api/v1/message_managements/messages`, add).then(res => {
        console.log(res)
        setIdSC(idSC + 1)
        setTotalItemTC(1)
        setIsOpenNoti(true)
        setTimeout(() => {
          setMsgNoti("追加しました。")
        }, 1500)

        setTimeout(function () {
          setIsOpenNoti(false)
        }, 2000);
        // reloadMessMsgBag()
        getBagMsg(idReloadMsgBagFromGetMSG, idReloadMsgBagFromGetMSG)
      }).catch(error => {
        console.log(error)
        // if (error.response.data.code === 3) {
        //     requestNewToken(path)
        // }
      })

    })


  }


  function deleteImgCB(idDelete) {
    var element = document.getElementById(`chatbot_image${idDelete}`)
    var elementOV = document.getElementById(`outputOV${idDelete}`)
    if (elementOV !== null) {
      elementOV.remove()
    }
    element.remove()
  }

  function deleteMsgCB(idDelete) {
    var element = document.getElementById(`chatbot_message${idDelete}`)
    var elementOV = document.getElementById(`ovMsg${idDelete}`)
    element.remove()
    if (elementOV !== null) {
      elementOV.remove()
    }
  }
  function deleteSavedMsgCB(idDelete) {

  }

  function deletePPCB(idDelete) {
    var element = document.getElementById(`chatbot_pp${idDelete}`)
    var elementOV = document.getElementById(`ovPPCB${idDelete}`)
    element.remove()
    if (elementOV !== null) {
      elementOV.remove()
    }
  }

  function deleteImgMsgCB(idDelete) {
    // console.log('id delete: ', idDelete)
    var element = document.getElementById(`chatbot_image_msg${idDelete}`)
    var elementMsgOV = document.getElementById(`ovMsgCB${idDelete}`)
    var elementImgOV = document.getElementById(`outputImgMsgOV${idDelete}`)
    if (elementImgOV !== null) {
      elementImgOV.remove()
    }
    if (elementMsgOV !== null) {
      elementMsgOV.remove()
    }
    element.remove()
  }
  function deleteSavedImgMsg(idDelete) {
    alert('id delete: ', idDelete)
    api.delete(`/api/v1/message_managements/messages/${idDelete}`).then(res => {
      alert('deleted')
    }).catch(error => {
      console.log(error)
    })
    // var element = document.getElementById(`chatbot_image_msg${idDelete}`)
    // var elementMsgOV = document.getElementById(`ovMsgCB${idDelete}`)
    // var elementImgOV = document.getElementById(`outputImgMsgOV${idDelete}`)
    // if (elementImgOV !== null) {
    //   elementImgOV.remove()
    // }
    // if (elementMsgOV !== null) {
    //   elementMsgOV.remove()
    // }
    // element.remove()
  }

  // function getBaseUrl() {
  //   var file = document.querySelector('input[type=file]')['files'][0];
  //   var reader = new FileReader();
  //   var baseString;
  //   reader.onloadend = function () {
  //     baseString = reader.result;
  //     setInputImage(baseString)
  //   };
  //   reader.readAsDataURL(file);
  // }


  function addScript() {
    var path = window.location.pathname;
    // var elements = document.getElementById("scriptForm").elements;
    // var obj = {};
    // var key = {}
    // var value = {}
    // for (var i = 0; i < elements.length - 1; i++) {
    //   var item = elements.item(i);
    //   obj[item.name] = item.value;
    //   if (item.name.includes('messageKey')) {
    //     key[item.name] = item.value
    //   } else if(item.name.includes('messages')) {
    //     if (value[item.name] !== '') {
    //       value[item.name] = item.value
    //     }else{
    //       console.log('ojas')
    //       delete value[item.name]
    //     }
    //   }
    // }
    // var script = { key, value }

    // console.log(script)


    var elements = document.getElementById("scriptForm").elements;
    var obj = {};
    var key = []
    var value = []
    var img_value = []
    var pp = []
    var type = []
    for (var i = 0; i < elements.length - 1; i++) { //pp_value
      var item = elements.item(i);
      // obj[item.name] = item.value;

      if (item.name.includes(`messagesVa`)) {
        // value.push({[item.name]: item.value})
        value.push(item.value)
        img_value.push('')
        type.push('msg')
      } else if (item.name.includes(`imgchatbot`)) {
        // key.push({[item.name]: item.value})
        // key.push('imgchatbot')
        img_value.push(item.value)
        value.push('')
        type.push('img')
        // obj.key =[]
      } else if (item.name.includes(`imgValueMsgChatbot`)) {

        img_value.push(item.value)
        for (var i = 0; i < elements.length - 1; i++) {
          var items = elements.item(i);
          if (items.name.includes(`imgMsgValueChatbot`)) {
            value.push(items.value)
            alert("imgValueMsgChatbot")
          }
        }
        // value.push(item.value)
        type.push('img_msg')
      } else if (item.name.includes(`pp_value`)) {
        value.push(item.value)
        img_value.push('')
        type.push('past_post')
      }
      // else if (item.name.includes(`imgMsgValueChatbot`)) {
      //   value.push(item.value)
      // }


      // if (item.name.includes(`Key`)) {
      //   if (item.name.includes(`messageKey`)) {
      //     // key.push({[item.name]: item.value})
      //     key.push(item.value)
      //     type.push('msg')
      //     // obj.key =[]
      //   } else if (item.name.includes(`imgKey`)) {
      //     // key.push({[item.name]: item.value})
      //     key.push(item.value)
      //     type.push('img')
      //     // obj.key =[]
      //   } else if (item.name.includes(`imgMsgKey`)) {
      //     key.push(item.value)
      //     type.push('img_msg')
      //   }
      // }
      // else {
      //   if (item.name.includes(`messagesVa`)) {
      //     // value.push({[item.name]: item.value})
      //     value.push(item.value)
      //     img_value.push('')
      //   } else if (item.name.includes(`imgchatbot`)) {
      //     // key.push({[item.name]: item.value})
      //     // key.push('imgchatbot')
      //     img_value.push(item.value)
      //     value.push('')
      //     // obj.key =[]
      //   } else if (item.name.includes(`imgValueMsgChatbot`)) {
      //     img_value.push(item.value)
      //   } else if (item.name.includes(`imgMsgValueChatbot`)) {
      //     value.push(item.value)
      //   }
      // }
    }
    // console.log("value: ", value)
    // console.log("img_value: ", img_value)
    value.forEach((ele, index) => {
      // var type
      // if(key[index].includes('imgchatbot')){
      //   type = 'img'
      // }else {
      //   type = 'msg'
      // }

      //old ele
      // obj[ele] = { "message_bag_id": bagId, message_type: type[index], received_message: key[index], message_value: value[index], img_value: img_value[index] }
      //new ele
      obj[ele] = { "message_bag_id": bagId, message_type: type[index], message_value: value[index], img_value: img_value[index] }

    })
    var script = { messages: Object.values(obj) }

    // console.log(JSON.stringify(script))
    var newScript = JSON.stringify(script)
    // console.log(newScript)



    api.post(`/api/v1/message_managements/messages`, script).then(res => {
      console.log("message_managements/messages: ", res)
      setTimeout(() => {
        setMsgNoti("メッセージを追加しました。")
      }, 1500)
      setIsOpenNoti(true)
    }).catch(error => {
      alert(error)
      console.log(error)
      if (error.response.data.code === 3) {
        requestNewToken(path)
      }
    })

    // bo comment doan tren

  }
  var itemGroup = groupList
  var itemBbag = messageBag

  function addChatBot() {
    var path = window.location.pathname;
    var newCB = document.getElementById("new_chatbot").value
    if (utils.checkFieldAdd(newCB, "Chatbot") == true) {
      var newCBAdd = { message_group: { group_name: newCB } }
      api.post(`/api/v1/message_managements/message_groups`, newCBAdd).then(res => {
        refreshMsgGroup()
        setIsOpenAddChatbot(false)
        setMsgNoti("メッセージグループを追加しました。")
        setIsOpenNoti(true)
        setTimeout(() => {
          setIsOpenNoti(false)
        }, 2500)
      }).catch(error => {
        alert(error)
        console.log(error)
        if (error.response.data.code === 3) {
          requestNewToken(path)
        }
      })
    }

  }

  function addMsgBagPop(id) {
    setIsOpenAddMsgBag(true)
    setIdMsgGr(id)
  }
  function renameMsgBagPop(id) {
    setIsOpenRenameMsgBag(true)
    setIdRenameMsgGr(id)
  }
  function copyMsgBagPop(id) {
    setIsOpenCopyMsgBag(true)
    setIdCopyMsgGr(id)
  }
  function deleteMsgBagPop(id) {
    setIsOpenDeleteMsgBag(true)
    setIdDeleteMsgGr(id)
  }

  function addMagBag() {
    var path = window.location.pathname;
    var newBag = document.getElementById("new_bag").value
    if (utils.checkFieldAdd(newBag, "MsgBag") == true) {
      var newBagAdd = { message_bag: { message_group_id: idMsgGr, bag_name: newBag } }
      api.post(`/api/v1/message_managements/message_bags`, newBagAdd).then(res => {
        setIsOpenAddMsgBag(false)
        console.log(res)

        setMsgNoti("メッセージ袋を追加しました。")
        setIsOpenNoti(true)
        setTimeout(() => {
          setIsOpenNoti(false)
          reloadMsgBag()
        }, 1500)
      }).catch(error => {
        alert(error)
        console.log(error)
        if (error.response.data.code === 3) {
          requestNewToken(path)
        }
      })
    }
  }

  function renameMagBag() {
    var path = window.location.pathname;
    var newBag = document.getElementById("rename_bag").value
    if (utils.checkFieldAdd(newBag, "MsgBag") == true) {
      var newBagAdd = { message_group: { group_name: newBag } }
      api.patch(`/api/v1/message_managements/message_groups/${idMsgRenameGr}`, newBagAdd).then(res => {
        setIsOpenRenameMsgBag(false)
        console.log(res)
        setMsgNoti("更新しました。")
        setIsOpenNoti(true)
        setTimeout(() => {
          setIsOpenNoti(false)
        }, 1500)
        // setTimeout(() => {
        //   window.location.reload()
        // }, 1500)
        refreshMsgGroup()
      }).catch(error => {
        alert(error)
        console.log(error)
      })
    }
  }

  function renameMessageBag() {
    var path = window.location.pathname;
    var newBag = document.getElementById("rename_bag_inside").value
    if (utils.checkFieldAdd(newBag, "MsgBag") == true) {
      var newBagAdd = { message_bag: { bag_name: newBag } }

      api.patch(`/api/v1/message_managements/message_bags/${idMsgBagRename}`, newBagAdd).then(res => {
        setIsOpenMsgBagRename(false)
        console.log("message_group_id rename ne: ", res.data.data.message_group_id)
        setMsgNoti("更新しました。")
        setIsOpenNoti(true)
        setTimeout(() => {
          setIsOpenNoti(false)
        }, 1500)
        // setTimeout(() => {
        //   window.location.reload()
        // }, 1500)
        reloadMsgBag()
        getBagMsg(idMsgBagRename, idMsgBagRename)
      }).catch(error => {
        alert(error)
        console.log(error)
      })
    }
  }


  function copyMagBag() {
    // alert(idMsgCopyGr)
    api.post(`/api/v1/message_managements/message_groups/${idMsgCopyGr}/copy`).then(res => {
      setIsOpenCopyMsgBag(false)
      console.log(res)
      setMsgNoti("グループをコピーしました。")
      setIsOpenNoti(true)
      setTimeout(() => {
        setIsOpenNoti(false)
      }, 1500)
      refreshMsgGroup()
      // setTimeout(() => {
      //   window.location.reload()
      // }, 1500)

    }).catch(error => {
      console.log(error)
    })
  }
  //copyMessageBag

  function copyMessageBag() {
    // alert(idMsgCopyGr)
    api.post(`/api/v1/message_managements/message_bags/${idMsgBagCopy}/copy`).then(res => {
      setIsOpenMsgBagCopy(false)
      console.log(res)
      setMsgNoti("メッセージ袋をコピーしました。")
      setIsOpenNoti(true)
      setTimeout(() => {
        setIsOpenNoti(false)
      }, 1500)
      reloadMsgBag()
      // setTimeout(() => {
      //   window.location.reload()
      // }, 1500)

    }).catch(error => {
      console.log(error)
    })
  }

  function deleteMagBag() {
    api.delete(`/api/v1/message_managements/message_groups/${idMsgDeleteGr}`).then(res => {
      setIsOpenDeleteMsgBag(false)
      if (res.data.code == 2) {
        setMsgNoti("グループは利用中のため、削除できません！")
        setIsOpenNoti(true)
        setTimeout(() => {
          setIsOpenNoti(false)
        }, 1500)
      } else {
        setMsgNoti("メッセージグループを削除しました。")
        setIsOpenNoti(true)
        setTimeout(() => {
          setIsOpenNoti(false)
        }, 1500)
        refreshMsgGroup()()
      }


      // setTimeout(() => {
      //   window.location.reload()
      // }, 1500)

    }).catch(error => {
      console.log(error)
    })
  }
  //deleteMessageBag

  function deleteMessageBag() {
    api.delete(`/api/v1/message_managements/message_bags/${idMsgBagDelete}`).then(res => {
      setIsOpenMsgBagDelete(false)
      if (res.data.code == 2) {
        setMsgNoti("メッセージ袋は利用中のため、削除できません！")
        setIsOpenNoti(true)
        setTimeout(() => {
          setIsOpenNoti(false)
        }, 1500)
      } else {
        setMsgNoti("メッセージ袋を削除しました。")
        setIsOpenNoti(true)
        setTimeout(() => {
          setIsOpenNoti(false)
        }, 1500)
        reloadMsgBag()
      }

      // setTimeout(() => {
      //   window.location.reload()
      // }, 1500)

    }).catch(error => {
      console.log(error)
    })
  }

  var page_access_token = Cookies.get("page_access_token")
  var ig_id = Cookies.get("ig_id")
  const [idPastPost, setIdPastPost] = useState([])
  const [pastPostList, setPastPostList] = useState([])
  const [indexPP, setIndexPP] = useState()
  async function getPastPost() {
    const getPastPost = await axios.get(`https://graph.facebook.com/v14.0/${ig_id}/media?access_token=${page_access_token}`).then(res => {
      return res.data.data

    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })
    console.log(getPastPost)
    var past_post = []
    for (var i = 0; i < getPastPost.length; i++) {
      await axios.get(`https://graph.facebook.com/v14.0/${getPastPost[i].id}?fields=id,media_type,media_url,username,timestamp&access_token=${page_access_token}`).then(res => {
        // console.log(res)
        past_post.push(res.data)

      }).catch(error => {
        console.log(error)
      })
    }

    setPastPostList(past_post)
    setIndexPP(past_post.length)

  }

  function selectPastPost() {
    getPastPost()
    setTimeout(() => {
      setIsOpenSelectPastPost(true)
      // console.log("getPP: ", pastPostList)
    }, 1500)
  }

  function selectPastPostUp() {
    getPastPost()
    setTimeout(() => {
      setIsOpenSelectPastPostUp(true)
      // console.log("getPP: ", pastPostList)
    }, 1500)
  }

  function removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for (i = L; i >= 0; i--) {
      selectElement.remove(i);
    }
  }

  function selectGroupNextMSG(value) {
    if (value != "") {
      document.getElementById("grBagSC").style.display = "none"
      document.getElementById("grBagSC").innerHTML = ""
    }
    api.get(`/api/v1/message_managements/message_groups/${value}`).then(res => {
      // console.log(res.data.data.message_bags)
      // setListBag(res.data.data.message_bags)
      var group = document.getElementById(`listNextMSGBagSC`)
      removeOptions(group)
      for (var i = 0; i < res.data.data.message_bags.length; i++) {
        var option = document.createElement("option");
        option.value = res.data.data.message_bags[i].id;
        option.text = res.data.data.message_bags[i].bag_name;
        group.add(option)

      }
      // const myOpts = document.getElementById(`listReplyBag`).options
      // console.log('myOpts: ', myOpts)
      // for (var i = 0; i < myOpts.length; i++) {
      //   if (i > 0) {
      //     if (myOpts[i].value == myOpts[i - 1].value) {
      //       // alert('same')
      //       myOpts.remove(i);
      //     }
      //   }
      // }
      // console.log(group)
    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })
  }

  function selectGroupNextMSGTC(value) {
    if (value != "") {
      document.getElementById("grBagTC").style.display = "none"
      document.getElementById("grBagTC").innerHTML = ""
    }
    api.get(`/api/v1/message_managements/message_groups/${value}`).then(res => {
      // console.log(res.data.data.message_bags)
      // setListBag(res.data.data.message_bags)
      var group = document.getElementById(`listNextMSGBagTC`)
      removeOptions(group)
      for (var i = 0; i < res.data.data.message_bags.length; i++) {
        var option = document.createElement("option");
        option.value = res.data.data.message_bags[i].id;
        option.text = res.data.data.message_bags[i].bag_name;
        group.add(option)

      }
      // const myOpts = document.getElementById(`listReplyBag`).options
      // console.log('myOpts: ', myOpts)
      // for (var i = 0; i < myOpts.length; i++) {
      //   if (i > 0) {
      //     if (myOpts[i].value == myOpts[i - 1].value) {
      //       // alert('same')
      //       myOpts.remove(i);
      //     }
      //   }
      // }
      // console.log(group)
    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })
  }

  function selectGroupNextMSGFI(value) {
    api.get(`/api/v1/message_managements/message_groups/${value}`).then(res => {
      // console.log(res.data.data.message_bags)
      // setListBag(res.data.data.message_bags)
      var group = document.getElementById(`listNextMSGBagFI`)
      removeOptions(group)
      for (var i = 0; i < res.data.data.message_bags.length; i++) {
        var option = document.createElement("option");
        option.value = res.data.data.message_bags[i].id;
        option.text = res.data.data.message_bags[i].bag_name;
        group.add(option)

      }
      // const myOpts = document.getElementById(`listReplyBag`).options
      // console.log('myOpts: ', myOpts)
      // for (var i = 0; i < myOpts.length; i++) {
      //   if (i > 0) {
      //     if (myOpts[i].value == myOpts[i - 1].value) {
      //       // alert('same')
      //       myOpts.remove(i);
      //     }
      //   }
      // }
      // console.log(group)
    }).catch(error => {
      console.log(error)
      // if (error.response.data.code === 3) {
      //   requestNewToken(path)
      // }
    })
  }



  function selectBagNextMSG(val) {
    alert(val)
  }

  function selectBagNextMSGTC(val) {
    alert(val)
  }
  function selectBagNextMSGFI(val) {
    alert(val)
  }
  function displaySCNextMSG() {
    document.getElementById("underlineSCNextMsg").style.display = "block"
    document.getElementById("underlineSCWebsite").style.display = "none"
    document.getElementById("nextMessageSC").style.display = "block"
    document.getElementById("websiteURLSC").style.display = "none"
  }

  function displayTCNextMSG() {
    document.getElementById("underlineTCNextMsg").style.display = "block"
    document.getElementById("underlineTCWebsite").style.display = "none"
    document.getElementById("nextMessageTC").style.display = "block"
    document.getElementById("websiteURLTC").style.display = "none"
  }

  function displaySCWebsite() {
    document.getElementById("underlineSCNextMsg").style.display = "none"
    document.getElementById("underlineSCWebsite").style.display = "block"
    document.getElementById("nextMessageSC").style.display = "none"
    document.getElementById("websiteURLSC").style.display = "block"
  }
  function displayTCWebsite() {
    document.getElementById("underlineTCNextMsg").style.display = "none"
    document.getElementById("underlineTCWebsite").style.display = "block"
    document.getElementById("nextMessageTC").style.display = "none"
    document.getElementById("websiteURLTC").style.display = "block"
  }

  const [labelInputSCNum, setLabelInputSCNum] = useState(1)
  const [labelInputSCAll, setLabelInputSCAll] = useState("")
  function checkInputedLabelSC(event, value) {
    // document.getElementById("labelLSC").addEventListener("keypress", (event)=>{
    // event.preventDefault()
    if (event.key === "Enter") {
      setLabelInputSCAll(`${labelInputSCAll}, ${value}`)
      event.preventDefault()
      // alert("entered")
      var labelInputed = document.createElement('div')
      labelInputed.setAttribute('id', `spLabelInputed${labelInputSCNum}`)
      labelInputed.innerHTML = `
        <div style="margin:0px 5px 0px 0px; border-radius:5px; background-color:#e0e0e0; display:flex"><span>${value}</span>&ensp; <span id="deletelabelSC${labelInputSCNum}">X</span></div>
        `

      document.getElementById('labelLSCInputed').appendChild(labelInputed)
      document.getElementById(`deletelabelSC${labelInputSCNum}`).addEventListener('click', () => {
        var element = document.getElementById(`spLabelInputed${labelInputSCNum}`);
        element.parentNode.removeChild(element);
        if (document.getElementById("labelLSCInputed").innerHTML == "") {
          document.getElementById("labeltoCheckInputLabelSC").style.display = "block"
        } else {
          document.getElementById("labeltoCheckInputLabelSC").style.display = "none"

        }
      })
      if (document.getElementById("labelLSCInputed").innerHTML == "") {
        document.getElementById("labeltoCheckInputLabelSC").style.display = "block"
      } else {
        document.getElementById("labeltoCheckInputLabelSC").style.display = "none"

      }
      document.getElementById("labelLSC").value = ""
      setLabelInputSCNum(labelInputSCNum + 1)
    }

    // })
  }

  function selectFormatCheck(value) {
    if (value == "email" || value == "phone_number") {
      document.getElementById("formatCheckFI").style.display = "block"
    } else {
      document.getElementById("formatCheckFI").style.display = "none"
    }
  }
  const [labelInputTCNum, setLabelInputTCNum] = useState(1)
  const [labelInputTCAll, setLabelInputTCAll] = useState("")
  function checkInputedLabelTC(event, value) {
    // document.getElementById("labelLSC").addEventListener("keypress", (event)=>{
    // event.preventDefault()
    var lblValue = ""
    if (event.key === "Enter") {
      setLabelInputTCAll(`${labelInputTCAll}, ${value}`)
      // document.getElementById("lblTCAddALL").value = lblValue
      event.preventDefault()
      // alert("entered")
      var labelInputed = document.createElement('div')
      labelInputed.setAttribute('id', `spLabelInputed${labelInputTCNum}TC`)
      labelInputed.innerHTML = `
        <div style="margin:0px 5px 0px 0px; border-radius:5px; background-color:#e0e0e0; display:flex"><span>${value}</span>&ensp; <span id="deletelabelSC${labelInputTCNum}TC">X</span></div>
        `

      document.getElementById('labelLTCInputed').appendChild(labelInputed)
      document.getElementById(`deletelabelSC${labelInputTCNum}TC`).addEventListener('click', () => {
        var element = document.getElementById(`spLabelInputed${labelInputTCNum}TC`);
        element.parentNode.removeChild(element);
        if (document.getElementById("labelLTCInputed").innerHTML == "") {
          document.getElementById("labeltoCheckInputLabelTC").style.display = "block"
        } else {
          document.getElementById("labeltoCheckInputLabelTC").style.display = "none"

        }
      })
      if (document.getElementById("labelLTCInputed").innerHTML == "") {
        document.getElementById("labeltoCheckInputLabelTC").style.display = "block"
      } else {
        document.getElementById("labeltoCheckInputLabelTC").style.display = "none"

      }
      document.getElementById("labelLTC").value = ""
      setLabelInputTCNum(labelInputTCNum + 1)
    }

    // })
  }

  const [labelInputFINum, setLabelInputFINum] = useState(1)

  const [labelInputFIAll, setLabelInputFIAll] = useState("")
  function checkInputedLabelFI(event, value) {
    // document.getElementById("labelLSC").addEventListener("keypress", (event)=>{
    // event.preventDefault()
    if (event.key === "Enter") {
      setLabelInputFIAll(`${labelInputFIAll}, ${value}`)
      event.preventDefault()
      // alert("entered")
      var labelInputed = document.createElement('div')
      labelInputed.setAttribute('id', `spLabelInputed${labelInputFINum}FI`)
      labelInputed.innerHTML = `
        <div style="margin:0px 5px 0px 0px; border-radius:5px; background-color:#e0e0e0; display:flex"><span>${value}</span>&ensp; <span id="deletelabelSC${labelInputFINum}FI">X</span></div>
        `

      document.getElementById('labelLFIInputed').appendChild(labelInputed)
      document.getElementById(`deletelabelSC${labelInputFINum}FI`).addEventListener('click', () => {
        var element = document.getElementById(`spLabelInputed${labelInputFINum}FI`);
        element.parentNode.removeChild(element);
        if (document.getElementById("labelLFIInputed").innerHTML == "") {
          document.getElementById("labeltoCheckInputLabelFI").style.display = "block"
        } else {
          document.getElementById("labeltoCheckInputLabelFI").style.display = "none"

        }
      })
      if (document.getElementById("labelLFIInputed").innerHTML == "") {
        document.getElementById("labeltoCheckInputLabelFI").style.display = "block"
      } else {
        document.getElementById("labeltoCheckInputLabelFI").style.display = "none"

      }
      document.getElementById("labelLFI").value = ""
      setLabelInputFINum(labelInputFINum + 1)
    }

    // })
  }
  function checkInputTitleSC() {
    var title = document.getElementById("titleNextMSG").value
    if (title == "") {
      document.getElementById("titleSC").style.display = "block"
    } else {
      document.getElementById("titleSC").style.display = "none"
    }
  }
  function checkInputTitleTC() {
    var title = document.getElementById("titleNextMSGTC").value
    if (title == "") {
      document.getElementById("titleTC").style.display = "block"
    } else {
      document.getElementById("titleTC").style.display = "none"
    }
  }

  const [titleAddSC, setTitleAddSC] = useState("")
  const [groupAddSC, setGroupAddSC] = useState()
  const [bagAddSC, setBagAddSC] = useState(1)
  function saveSC() {
    var title = document.getElementById("titleNextMSG").value
    var web_url = document.getElementById("websiteSC").value
    var web = document.getElementById("underlineSCWebsite")
    var group = document.getElementById('listNextMSGGroupSC')
    var bag = document.getElementById('listNextMSGBagSC')
    var lblas = document.getElementById(`lblSCAddALL_${bagAddSC}`).value
    console.log(`lblas: `, lblas)
    var type = ""
    if (title == "") {
      document.getElementById("titleSC").style.display = "block"
    } else {
      document.getElementById("titleSC").style.display = "none"
    }
    if (web.style.display == 'none') {

      if (group.value == "") {
        document.getElementById("grBagSC").style.display = "block"
        document.getElementById("grBagSC").innerHTML = "Please choose group"
      } else {
        if (bag.value == "") {
          document.getElementById("grBagSC").style.display = "block"
          document.getElementById("grBagSC").innerHTML = "Please choose bag"
        } else {
          document.getElementById("grBagSC").style.display = "none"
          document.getElementById("grBagSC").innerHTML = ""
        }
      }
      console.log(group, bag)
      type = "mess"
    } else {

      type = "web_url"
      if (web_url == "") {
        document.getElementById("webSC").style.display = "block"
      } else {
        document.getElementById("webSC").style.display = "none"
      }
    }
    if (title != "" && group != "") {
      // setTitleAddSC(title)
      // setGroupAddSC(group.value)
      // setBagAddSC(bag.value)
      var abc = document.createElement("div")
      document.getElementById(`choiceOption${idSC}`).appendChild(abc)
      abc.innerHTML =
        `
      <div style="border:none; border-radius:10px; background-color:white; width:200px; text-align:center">
        <div style="padding:10px 5px 0px 5px">${title}</div>
        <input id="titleAddSC${idSC}" hidden type=text value="${title}" />
        <input id="typeAddSC${idSC}" hidden type=text value="${type}" />
        <input id="webAddSC${idSC}" hidden type=text value="${web_url}" />
        <div style="padding:0px 5px 10px 5px">${group.options[group.selectedIndex].text}/${bag.options[bag.selectedIndex].text}</div>
        <input id="groupAddSC${idSC}" hidden type=text value="${group.value}" />
        <input id="groupNameAddSC${idSC}" hidden type=text value="${group.options[group.selectedIndex].text}" />
        <input id="bagNameAddSC${idSC}" hidden type=text value="${bag.options[bag.selectedIndex].text}" />
        <input id="bagAddSC${idSC}" hidden type=text value="${bag.value}" />
        <input id="lblAddSC${idSC}_${bagAddSC}" hidden type=text value="${lblas}" />
      </div>
      `
      document.getElementById(`msgChoice${idSC}`).style.display = "none"
      setIsAddOpenSingleChoice(false)
      setLabelInputSCAll("")

    }
  }

  function updateMsgSC(id) {
    setIdUpdateItemMsg(id)
    setIsUpdateOpenSingleChoice(true)
  }
  function updateMsgTC(id) {
    setIdUpdateItemMsg(id)
    setIsUpdateOpenThreeChoice(true)
  }

  function updateMsgFI(id) {
    setIdUpdateItemMsg(id)
    setIsUpdateOpenFreeInput(true)
  }

  function saveUpSC() {
    var title = document.getElementById("titleNextMSG").value
    var web_url = document.getElementById("websiteSC").value
    var web = document.getElementById("underlineSCWebsite")
    var group = document.getElementById('listNextMSGGroupSC')
    var bag = document.getElementById('listNextMSGBagSC')
    var lblas = document.getElementById(`lblSCAddALL_${bagAddSC}`).value
    console.log(`lblas: `, lblas)
    var type = ""
    if (title == "") {
      document.getElementById("titleSC").style.display = "block"
    } else {
      document.getElementById("titleSC").style.display = "none"
    }
    if (web.style.display == 'none') {

      if (group.value == "") {
        document.getElementById("grBagSC").style.display = "block"
        document.getElementById("grBagSC").innerHTML = "Please choose group"
      } else {
        if (bag.value == "") {
          document.getElementById("grBagSC").style.display = "block"
          document.getElementById("grBagSC").innerHTML = "Please choose bag"
        } else {
          document.getElementById("grBagSC").style.display = "none"
          document.getElementById("grBagSC").innerHTML = ""
        }
      }
      console.log(group, bag)
      type = "mess"
    } else {

      type = "web_url"
      if (web_url == "") {
        document.getElementById("webSC").style.display = "block"
      } else {
        document.getElementById("webSC").style.display = "none"
      }
    }
    if (title != "" && group != "") {
      // setTitleAddSC(title)
      // setGroupAddSC(group.value)
      // setBagAddSC(bag.value)
      var abc = document.createElement("div")
      document.getElementById(`choiceOption${idUpdateItemMsg}`).appendChild(abc)
      abc.innerHTML =
        `
      <div style="border:none; border-radius:10px; background-color:white; width:200px; text-align:center">
        <div style="padding:10px 5px 0px 5px">${title}</div>
        <input id="titleAddSC${idUpdateItemMsg}" hidden type=text value="${title}" />
        <input id="typeAddSC${idUpdateItemMsg}" hidden type=text value="${type}" />
        <input id="webAddSC${idUpdateItemMsg}" hidden type=text value="${web_url}" />
        <div style="padding:0px 5px 10px 5px">${group.options[group.selectedIndex].text}/${bag.options[bag.selectedIndex].text}</div>
        <input id="groupAddSC${idUpdateItemMsg}" hidden type=text value="${group.value}" />
        <input id="groupNameAddSC${idUpdateItemMsg}" hidden type=text value="${group.options[group.selectedIndex].text}" />
        <input id="bagNameAddSC${idUpdateItemMsg}" hidden type=text value="${bag.options[bag.selectedIndex].text}" />
        <input id="bagAddSC${idUpdateItemMsg}" hidden type=text value="${bag.value}" />
        <input id="lblAddSC${idUpdateItemMsg}_${bagAddSC}" hidden type=text value="${lblas}" />
      </div>
      `
      document.getElementById(`msgChoice${idUpdateItemMsg}`).style.display = "none"
      setIsUpdateOpenSingleChoice(false)
      setLabelInputSCAll("")

    }
  }

  const [idUpdateItemMsg, setIdUpdateItemMsg] = useState()
  const [titleAddTC, setTitleAddTC] = useState("")
  const [groupAddTC, setGroupAddTC] = useState([])
  const [bagAddTC, setBagAddTCC] = useState([])
  const [totalItemTC, setTotalItemTC] = useState(1)
  function saveTC() {
    var title = document.getElementById("titleNextMSGTC").value
    var web_url = document.getElementById("websiteTC").value
    var web = document.getElementById("underlineTCWebsite")
    var group = document.getElementById('listNextMSGGroupTC')
    var bag = document.getElementById('listNextMSGBagTC')
    var lbl = document.getElementById(`lblTCAddALL_${totalItemTC}`).value

    console.log("labAddTC: ", lbl)
    var type = ""
    if (title == "") {
      document.getElementById("titleTC").style.display = "block"
    } else {
      document.getElementById("titleTC").style.display = "none"
    }
    if (web.style.display == 'none') {

      if (group.value == "") {
        document.getElementById("grBagTC").style.display = "block"
        document.getElementById("grBagTC").innerHTML = "Please choose group"
      } else {
        if (bag.value == "") {
          document.getElementById("grBagTC").style.display = "block"
          document.getElementById("grBagTC").innerHTML = "Please choose bag"
        } else {
          document.getElementById("grBagTC").style.display = "none"
          document.getElementById("grBagTC").innerHTML = ""
        }
      }
      console.log(group, bag)
      type = "mess"
    } else {

      type = "web_url"
      if (web_url == "") {
        document.getElementById("webTC").style.display = "block"
      } else {
        document.getElementById("webTC").style.display = "none"
      }
    }
    if (title != "" && group != "") {
      var abc = document.createElement("div")
      document.getElementById(`choiceOption${idSC}`).appendChild(abc)
      if (type == "mess") {
        abc.innerHTML =
          `
          <div id="itemTC${idSC}_${totalItemTC}" style="border-bottom:1px solid black; margin:auto; width:90%; overflow:hidden; text-align:center">
            <div style="padding:10px 5px 0px 5px">${title}</div>
            <input id="titleAddTC${idSC}_${totalItemTC}" hidden type=text value="${title}" />
            <input id="typeAddTC${idSC}_${totalItemTC}" hidden type=text value="${type}" />
            <input id="webAddTC${idSC}_${totalItemTC}" hidden type=text value="${web_url}" />
            <div style="padding:0px 5px 10px 5px">${group.options[group.selectedIndex].text}/${bag.options[bag.selectedIndex].text}</div>
            <input id="groupAddTC${idSC}_${totalItemTC}" hidden type=text value="${group.value}" />
            <input id="groupNameAddTC${idSC}_${totalItemTC}" hidden type=text value="${group.options[group.selectedIndex].text}" />
            <input id="bagNameAddTC${idSC}_${totalItemTC}" hidden type=text value="${bag.options[bag.selectedIndex].text}" />
            <input id="bagAddTC${idSC}_${totalItemTC}" hidden type=text value="${bag.value}" />
            <input id="lblAddTCItem${idSC}_${totalItemTC}" hidden type=text value="${lbl}" />
          </div>
          `
        console.log("lbl add ne: ", lbl)
      } else if (type == "web_url") {
        abc.innerHTML =
          `
          <div id="itemTC${idSC}_${totalItemTC}" style="border-bottom:1px solid black; margin:auto; width:200px ; overflow:hidden; text-align:center">
            <div style="padding:10px 5px 0px 5px">${title}</div>
            <input id="titleAddTC${idSC}_${totalItemTC}" hidden type=text value="${title}" />
            <input id="typeAddTC${idSC}_${totalItemTC}" hidden type=text value="${type}" />
            <input id="webAddTC${idSC}_${totalItemTC}" hidden type=text value="${web_url}" />
            <div style="padding:0px 5px 10px 5px">Website: ${web_url}</div>
            <input id="groupAddTC${idSC}_${totalItemTC}" hidden type=text value="${group.value}" />
            <input id="groupNameAddTC${idSC}_${totalItemTC}" hidden type=text value="${group.options[group.selectedIndex].text}" />
            <input id="bagNameAddTC${idSC}_${totalItemTC}" hidden type=text value="${bag.options[bag.selectedIndex].text}" />
            <input id="bagAddTC${idSC}_${totalItemTC}" hidden type=text value="${bag.value}" />
            <input id="lblAddTCItem${idSC}_${totalItemTC}" hidden type=text value="${lbl}" />
          </div>
          `
      }
      // setTitleAddSC(title)
      // setGroupAddSC(group.value)
      // setBagAddSC(bag.value)
      if (totalItemTC == 3) {
        document.getElementById(`itemTC${idSC}_${totalItemTC}`).style.border = "none"
      }

      document.getElementById(`msgChoice${idSC}`).style.display = "none"
      document.getElementById(`choiceThree${idSC}`).innerHTML =
        `
        <div>
          <button style="background-color:white; border:none; border-radius:10px" id="tCAddItem${idSC}">Add an option</button>
          <input id="totalItemTC${idSC}" type="number" value=${totalItemTC} hidden />
        </div>
      `
      if (totalItemTC <= 2) {
        document.getElementById(`choiceThree${idSC}`).style.display = "block"
      } else {
        document.getElementById(`choiceThree${idSC}`).style.display = "none"
      }
      document.getElementById(`tCAddItem${idSC}`).addEventListener('click', (e) => {
        e.preventDefault()
        setIsAddOpenThreeChoice(true)
        setTotalItemTC(totalItemTC + 1)
      })
      setIsAddOpenThreeChoice(false)
      setLabelInputTCAll("")
    }
  }

  function saveUpTC() {
    var title = document.getElementById("titleNextMSGTC").value
    var web_url = document.getElementById("websiteTC").value
    var web = document.getElementById("underlineTCWebsite")
    var group = document.getElementById('listNextMSGGroupTC')
    var bag = document.getElementById('listNextMSGBagTC')
    var lbl = document.getElementById(`lblTCAddALL_${totalItemTC}`).value

    console.log("labAddTC: ", lbl)
    var type = ""
    if (title == "") {
      document.getElementById("titleTC").style.display = "block"
    } else {
      document.getElementById("titleTC").style.display = "none"
    }
    if (web.style.display == 'none') {

      if (group.value == "") {
        document.getElementById("grBagTC").style.display = "block"
        document.getElementById("grBagTC").innerHTML = "Please choose group"
      } else {
        if (bag.value == "") {
          document.getElementById("grBagTC").style.display = "block"
          document.getElementById("grBagTC").innerHTML = "Please choose bag"
        } else {
          document.getElementById("grBagTC").style.display = "none"
          document.getElementById("grBagTC").innerHTML = ""
        }
      }
      console.log(group, bag)
      type = "mess"
    } else {

      type = "web_url"
      if (web_url == "") {
        document.getElementById("webTC").style.display = "block"
      } else {
        document.getElementById("webTC").style.display = "none"
      }
    }
    if (title != "" && group != "") {
      var abc = document.createElement("div")
      document.getElementById(`choiceOption${idUpdateItemMsg}`).appendChild(abc)
      if (type == "mess") {
        abc.innerHTML =
          `
          <div id="itemTC${idUpdateItemMsg}_${totalItemTC}" style="border-bottom:1px solid black; margin:auto; width:90%; text-align:center">
            <div style="padding:10px 5px 0px 5px">${title}</div>
            <input id="titleAddTC${idUpdateItemMsg}_${totalItemTC}" hidden type=text value="${title}" />
            <input id="typeAddTC${idUpdateItemMsg}_${totalItemTC}" hidden type=text value=${type} />
            <input id="webAddTC${idUpdateItemMsg}_${totalItemTC}" hidden type=text value=${web_url} />
            <div style="padding:0px 5px 10px 5px">${group.options[group.selectedIndex].text}/${bag.options[bag.selectedIndex].text}</div>
            <input id="groupAddTC${idUpdateItemMsg}_${totalItemTC}" hidden type=text value=${group.value} />
            <input id="groupNameAddTC${idUpdateItemMsg}_${totalItemTC}" hidden type=text value="${group.options[group.selectedIndex].text}" />
            <input id="bagNameAddTC${idUpdateItemMsg}_${totalItemTC}" hidden type=text value="${bag.options[bag.selectedIndex].text}" />
            <input id="bagAddTC${idUpdateItemMsg}_${totalItemTC}" hidden type=text value=${bag.value} />
            <input id="lblAddTCItem${idUpdateItemMsg}_${totalItemTC}" hidden type=text value="${lbl}" />
          </div>
          `
        console.log("lbl add ne: ", lbl)
      } else if (type == "web_url") {
        abc.innerHTML =
          `
          <div id="itemTC${idUpdateItemMsg}_${totalItemTC}" style="border-bottom:1px solid black; margin:auto; width:200px ; text-align:center">
            <div style="padding:10px 5px 0px 5px">${title}</div>
            <input id="titleAddTC${idUpdateItemMsg}_${totalItemTC}" hidden type=text value="${title}" />
            <input id="typeAddTC${idUpdateItemMsg}_${totalItemTC}" hidden type=text value="${type}" />
            <input id="webAddTC${idUpdateItemMsg}_${totalItemTC}" hidden type=text value="${web_url}" />
            <div style="padding:0px 5px 10px 5px">Website: ${web_url}</div>
            <input id="groupAddTC${idUpdateItemMsg}_${totalItemTC}" hidden type=text value="${group.value}" />
            <input id="groupNameAddTC${idUpdateItemMsg}_${totalItemTC}" hidden type=text value="${group.options[group.selectedIndex].text}" />
            <input id="bagNameAddTC${idUpdateItemMsg}_${totalItemTC}" hidden type=text value="${bag.options[bag.selectedIndex].text}" />
            <input id="bagAddTC${idUpdateItemMsg}_${totalItemTC}" hidden type=text value="${bag.value}" />
            <input id="bagAddTC${idUpdateItemMsg}_${totalItemTC}" hidden type=text value="${bag.value}" />
            <input id="lblAddTCItem${idUpdateItemMsg}_${totalItemTC}" hidden type=text value="${lbl}" />
          </div>
          `
      }
      // setTitleAddSC(title)
      // setGroupAddSC(group.value)
      // setBagAddSC(bag.value)
      if (totalItemTC == 3) {
        document.getElementById(`itemTC${idUpdateItemMsg}_${totalItemTC}`).style.border = "none"
      }

      document.getElementById(`msgChoice${idUpdateItemMsg}`).style.display = "none"
      document.getElementById(`choiceThree${idUpdateItemMsg}`).innerHTML =
        `
        <div>
          <button style="background-color:white; border:none; border-radius:10px" id="tCAddItem${idUpdateItemMsg}">Add an option</button>
          <input id="totalItemTC${idUpdateItemMsg}" type="number" value=${totalItemTC} hidden />
        </div>
      `
      if (totalItemTC <= 2) {
        document.getElementById(`choiceThree${idUpdateItemMsg}`).style.display = "block"
      } else {
        document.getElementById(`choiceThree${idUpdateItemMsg}`).style.display = "none"
      }
      document.getElementById(`tCAddItem${idUpdateItemMsg}`).addEventListener('click', (e) => {
        e.preventDefault()
        setIsUpdateOpenThreeChoice(true)
        setTotalItemTC(totalItemTC + 1)
      })
      setIsUpdateOpenThreeChoice(false)
      setLabelInputTCAll("")
    }
  }


  function saveUpFI() {
    // var group = document.getElementById('listNextMSGGroupFI')
    // var bag = document.getElementById('listNextMSGBagFI')
    var formatCheckSelect = document.getElementById('formatCheckSelect')
    var lblas = document.getElementById(`labelLFIAll_${labelInputFINum}`).value
    var formatcheck = document.getElementById('formatCheckFIValue').value
    console.log(`lblas: `, formatCheckSelect.value)


    // if (group.value == "") {
    //   document.getElementById("grBagFI").style.display = "block"
    //   document.getElementById("grBagFI").innerHTML = "Please choose group"
    // } else {
    //   if (bag.value == "") {
    //     document.getElementById("grBagFI").style.display = "block"
    //     document.getElementById("grBagFI").innerHTML = "Please choose bag"
    //   } else {
    //     document.getElementById("grBagFI").style.display = "none"
    //     document.getElementById("grBagFI").innerHTML = ""
    //   }
    // }

    if (formatCheckSelect != "") {
      // setTitleAddSC(title)
      // setGroupAddSC(group.value)
      // setBagAddSC(bag.value)
      var abc = document.createElement("div")
      document.getElementById(`choiceOption${idUpdateItemMsg}`).appendChild(abc)
      abc.innerHTML =
        `
      <div style="border:none; border-radius:10px; background-color:white; width:max-content; text-align:center">
        <div style="padding:0px 5px 10px 5px">Format check: ${formatCheckSelect.value == "email" ? "Email" : (formatCheckSelect.value == "phone_number" ? "Phone Number" : "No Validate")}</div>

        <input id="lblAddFI${idUpdateItemMsg}_${bagAddSC}" hidden type=text value="${lblas}" />
        <input id="formatCheckSelect${idUpdateItemMsg}" hidden type=text value="${formatCheckSelect.value}" />
        <input id="formatCheckMSG${idUpdateItemMsg}" hidden type=text value="${formatcheck}" />
      </div>
      `

      // <input id="groupAddFI${idSC}" hidden type=text value=${group.value} />
      // <input id="bagAddFI${idSC}" hidden type=text value=${bag.value} />


      document.getElementById(`msgChoice${idUpdateItemMsg}`).style.display = "none"
      setIsUpdateOpenFreeInput(false)
      setLabelInputFIAll("")
    }
  }

  function saveFI() {
    // var group = document.getElementById('listNextMSGGroupFI')
    // var bag = document.getElementById('listNextMSGBagFI')
    var formatCheckSelect = document.getElementById('formatCheckSelect')
    var lblas = document.getElementById(`labelLFIAll_${labelInputFINum}`).value
    var formatcheck = document.getElementById('formatCheckFIValue').value
    console.log(`lblas: `, formatCheckSelect.value)


    // if (group.value == "") {
    //   document.getElementById("grBagFI").style.display = "block"
    //   document.getElementById("grBagFI").innerHTML = "Please choose group"
    // } else {
    //   if (bag.value == "") {
    //     document.getElementById("grBagFI").style.display = "block"
    //     document.getElementById("grBagFI").innerHTML = "Please choose bag"
    //   } else {
    //     document.getElementById("grBagFI").style.display = "none"
    //     document.getElementById("grBagFI").innerHTML = ""
    //   }
    // }

    if (formatCheckSelect != "") {
      // setTitleAddSC(title)
      // setGroupAddSC(group.value)
      // setBagAddSC(bag.value)
      var abc = document.createElement("div")
      document.getElementById(`choiceOption${idSC}`).appendChild(abc)
      abc.innerHTML =
        `
      <div style="border:none; border-radius:10px; background-color:white; width:max-content; text-align:center">
        <div style="padding:0px 5px 10px 5px">Format check: ${formatCheckSelect.value == "email" ? "Email" : (formatCheckSelect.value == "phone_number" ? "Phone Number" : "No Validate")}</div>

        <input id="lblAddFI${idSC}_${bagAddSC}" hidden type=text value="${lblas}" />
        <input id="formatCheckSelect${idSC}" hidden type=text value=${formatCheckSelect.value} />
        <input id="formatCheckMSG${idSC}" hidden type=text value="${(formatcheck)}" />
      </div>
      `

      // <input id="groupAddFI${idSC}" hidden type=text value=${group.value} />
      // <input id="bagAddFI${idSC}" hidden type=text value=${bag.value} />


      document.getElementById(`msgChoice${idSC}`).style.display = "none"
      setIsAddOpenFreeInput(false)
      setLabelInputFIAll("")
    }
  }




  function checkFieldAddGroup(value) {
    if (value === '') {
      document.getElementById(`newChatbotErrMsg`).style.display = 'block'
      document.getElementById(`newChatbotErrMsg`).innerHTML = `This field cannot be empty`
      document.getElementById(`btnAddGroup`).disabled = true


    } else if (value.length > 30) {
      document.getElementById(`newChatbotErrMsg`).style.display = 'block'
      document.getElementById(`newChatbotErrMsg`).innerHTML = `Maximum 30 characters`
      document.getElementById(`btnAddGroup`).disabled = true
    } else {
      document.getElementById(`newChatbotErrMsg`).style.display = 'none'
      document.getElementById(`newChatbotErrMsg`).innerHTML = ""
      document.getElementById(`btnAddGroup`).disabled = false
      return true
    }
  }

  function checkFieldAddBag(value) {
    if (value === '') {
      document.getElementById(`newMsgBagErrMsg`).style.display = 'block'
      document.getElementById(`newMsgBagErrMsg`).innerHTML = `This field cannot be empty`
      document.getElementById(`btnAddBag`).disabled = true


    } else if (value.length > 30) {
      document.getElementById(`newMsgBagErrMsg`).style.display = 'block'
      document.getElementById(`newMsgBagErrMsg`).innerHTML = `Maximum 30 characters`
      document.getElementById(`btnAddBag`).disabled = true
    } else {
      document.getElementById(`newMsgBagErrMsg`).style.display = 'none'
      document.getElementById(`newMsgBagErrMsg`).innerHTML = ""
      document.getElementById(`btnAddBag`).disabled = false
      return true
    }
  }


  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardBody>
                <Row>
                  <Col md="6">
                    <Card className="card-plain">
                      <CardBody style={{ width: "100%" }}>
                        <div style={{ display: "flex", width: "200%" }}>
                          <div style={{ width: "35%" }}>
                            <h5 id="jjjj">メッセージグループ</h5>
                            <div>
                              <Button style={{ fontSize: "10px", marginTop: "-4%", padding: "10px" }} onClick={() => setIsOpenAddChatbot(true)}>グループ追加</Button><br />
                              <Nav className="sidebar-wrapper">
                                <ul style={{ listStyleType: "none", width: "100%" }}>
                                  {itemGroup.map((data, key) => {
                                    return (
                                      <li style={{ marginLeft: "-30px", display: "flex" }} key={key}>
                                        <Nav id="nav_option" style={{ width: "90%" }}>
                                          <i className="nc-icon nc-bell-55" style={{ color: "black" }} />
                                          <div id="a_tag" style={{ fontSize: "15px", width: "60%" }}>&nbsp;&nbsp;<button id={`btn_a_tag${data.id}`} onClick={(event) => getMSGPV(event, data.id)} style={{ border: "none", backgroundColor: "white" }}>{data.group_name}</button></div>
                                          <Button style={{ height: '30px', width: "8%", padding: '0', margin: "0px 0px 0px 0px", backgroundColor: "#FFFFFF" }}
                                            onClick={() => addMsgBagPop(data.id)}><i className="nc-icon nc-simple-add nc-3x" style={{ color: "black" }} /></Button>
                                          <Button style={{ height: '30px', width: "8%", padding: '0', margin: "0px 0px 0px 0px", backgroundColor: "#FFFFFF" }}
                                            onClick={() => copyMsgBagPop(data.id)}><i className="nc-icon nc-tag-content nc-3x" style={{ color: "black" }} /></Button>
                                          <Button style={{ height: '30px', width: "8%", padding: '0', margin: "0px 0px 0px 0px", backgroundColor: "#FFFFFF" }}
                                            onClick={() => renameMsgBagPop(data.id)}><i className="nc-icon nc-single-copy-04 nc-3x" style={{ color: "black" }} /></Button>
                                          <Button style={{ height: '30px', width: "8%", padding: '0', margin: "0px 0px 0px 0px", backgroundColor: "#FFFFFF" }}
                                            onClick={() => deleteMsgBagPop(data.id)}><i className="nc-icon nc-box nc-3x" style={{ color: "black" }} /></Button>
                                          <ul id="ulMesBag" style={{ listStyleType: "none", width: "200%", marginLeft: "-10%" }}>
                                            <li id="liMesBag">
                                              {/* <Nav id="itemBag" >
                                                {itemBbag.message_bags && itemBbag.message_bags.map((datagroup, key2) => {
                                                  return (
                                                    <ul key={key2} style={{ listStyleType: "none", width: "150%", marginLeft: "-70px" }}>
                                                      <br />
                                                      <li key={key2}>
                                                        <div style={{ display: "flex" }}>
                                                          <i className="nc-icon nc-bell-55" style={{ color: "black" }} />
                                                          <p id="a_tag" href="">&nbsp;&nbsp;{datagroup.bag_name}</p>
                                                          <DropdownButton id="dropdown-basic-button" title={<i className="nc-icon nc-bullet-list-67" style={{ color: "black", float: "right" }} />}>
                                                            <Dropdown.Item onClick={() => renameChatbot(datagroup.bag_name, datagroup.id)}>Rename</Dropdown.Item>
                                                            <Dropdown.Item onClick={() => deleteChatbot(datagroup.id)}>Delete</Dropdown.Item>
                                                          </DropdownButton>
                                                        </div>
                                                      </li>
                                                    </ul>
                                                  )
                                                })}
                                              </Nav> */}
                                            </li>
                                            <br />
                                          </ul>
                                        </Nav>

                                      </li>
                                    )
                                  })}
                                </ul>
                              </Nav>
                            </div>
                          </div>
                          <div style={{ width: "50%" }} id="abczyz">
                            <h5>メッセージ内容</h5>
                            {/* <div> */}
                            <h6>メッセージタイプ</h6>
                            <div style={{ display: "flex" }}>
                              <button style={{ width: "100px", height: "80px", backgroundColor: "#f4f3ef", borderRadius: "20px", textAlign: "center", marginLeft: "10px" }}
                                onClick={() => addImgChatbot()}>
                                <i className="nc-icon nc-image" style={{ color: "black", fontSize: "20px", fontWeight: "100", paddingTop: "5px", paddingBottom: "10px" }} /><br />
                                画像
                              </button>
                              <button style={{ width: "100px", height: "80px", backgroundColor: "#f4f3ef", borderRadius: "20px", textAlign: "center", marginLeft: "10px" }}
                                onClick={() => addMsgChatbot()}>
                                <i className="nc-icon nc-chat-33" style={{ color: "black", fontSize: "20px", fontWeight: "100", paddingTop: "5px", paddingBottom: "10px" }} /><br />
                                テキスト
                              </button>
                              <button style={{ width: "100px", height: "80px", backgroundColor: "#f4f3ef", borderRadius: "20px", textAlign: "center", marginLeft: "10px" }}
                                onClick={() => addImgMsgChatbot()}>
                                <i className="nc-icon nc-single-copy-04" style={{ color: "black", fontSize: "20px", fontWeight: "100", paddingTop: "5px", paddingBottom: "10px" }} /><br />
                                画像＋テキスト
                              </button>
                              <button style={{ width: "100px", height: "80px", backgroundColor: "#f4f3ef", borderRadius: "20px", textAlign: "center", marginLeft: "10px" }}
                                onClick={() => selectPastPost()}>
                                <i className="nc-icon nc-box" style={{ color: "black", fontSize: "20px", fontWeight: "100", paddingTop: "5px", paddingBottom: "10px" }} /><br />
                                過去の投稿
                              </button>
                              <button style={{ width: "100px", height: "80px", backgroundColor: "#f4f3ef", borderRadius: "20px", textAlign: "center", marginLeft: "10px" }}>
                                <i className="nc-icon nc-layout-11" style={{ color: "black", fontSize: "20px", fontWeight: "100", paddingTop: "5px", paddingBottom: "10px" }} /><br />
                                プロファイルメッセージ
                              </button>
                            </div>
                            <div id="custom" style={{ paddingTop: "50px" }}>
                              <h6>メッセージ内容
                              </h6>
                              {/* <ChatbotImage /> */}
                              <form id="scriptForm" style={{ height: "100%" }}>
                                <div id="div_custom">
                                  {/* <div id="chatbot_image" style={{ borderRadius: "20px", marginTop: "20px", backgroundColor: "#f4f3ef", padding: "20px" }}>
                                
                                  <input type="file" accept="image/*" onChange={(e) => loadFile(e)} /> <br /><br />
                                  <div style={{ textAlign: "center" }}>
                                    <img id="output" style={{ maxHeight: "200px", maxWidth: "40%" }} />
                                  </div>
                                </div> */}

                                  {/* <div id="chatbot_message" style={{ borderRadius: "20px", backgroundColor: "#f4f3ef", padding: "20px", marginTop: "20px", textAlign: "center" }}>
                                <textarea name='message' id="mgsCustom" placeholder="Please input message..." type="text" style={{ width: "50%", bacgroundColor: "#51cbce", borderRadius: "10px" }} rows={3} /> 
                                </div> */}

                                </div>
                              </form>
                              {/* <Button style={{ float: "right" }} id="btnAddScript" onClick={addScript}> 保存</Button> */}
                            </div>
                            {/* </div> */}
                          </div>
                          <div style={{ width: "25%" }}>
                            <h5>サンプル</h5>

                            <div id="logUserDiv" style={{ overflowY: "auto", height: "70%", maxHeight: "600px", maxWidth: "300px", minHeight: "300px", width: "90%", border: "2px solid black", display: 'block', borderRadius: "3%", marginLeft: "15%", padding: "5%", textAlign: "right" }}>
                              {/* {usersDiv} */}
                              {/* <div style={{width:"70%", backgroundColor:"red", padding:"10px", float:"right", borderRadius:"10px"}}>
                                <input type="text" name="" id="msgOVI" value="asasdsd" style={{textAlign:"right", backgroundColor:"red",border:"none"}}readonly/>
                              </div> */}
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <ModalShort open={isOpenAddChatbot} onClose={() => setIsOpenAddChatbot(false)}>
          <div style={{ width: "300px", textAlign: "center", color: "#51cbce" }}>
            <h4>グループ名入力</h4>
            <label style={{ width: "100%" }}>
              <input id="new_chatbot" style={{ width: "100%" }} onChange={(e) => checkFieldAddGroup(e.target.value)} name="chatbot_name"></input>
              <label id="newChatbotErrMsg" style={{ display: 'none', color: "red" }}></label>
            </label><br />
            <Button id="btnAddGroup" onClick={() => addChatBot()}>グループ追加</Button>
          </div>
        </ModalShort>
        <ModalShort open={isOpenAddMsgBag} onClose={() => setIsOpenAddMsgBag(false)}>
          <div style={{ width: "300px", textAlign: "center", color: "#51cbce" }}>
            <h4>メッセージ袋名入力</h4>
            <label style={{ width: "100%" }}>
              <input id="new_bag" style={{ width: "100%" }} onChange={(e) => checkFieldAddBag(e.target.value)} name="chatbot_name"></input>
              <label id="newMsgBagErrMsg" style={{ display: 'none', color: "red" }}></label>
            </label><br />
            <Button id="btnAddBag" onClick={() => addMagBag()}>メッセージ袋追加</Button>
          </div>
        </ModalShort>
        <ModalShort open={isOpenRenameMsgBag} onClose={() => setIsOpenRenameMsgBag(false)}>
          <div style={{ width: "300px", textAlign: "center", color: "#51cbce" }}>
            <h4>メッセージグループ名変更</h4>
            <label style={{ width: "100%" }}>
              <input id="rename_bag" style={{ width: "100%" }} onBlur={(e) => utils.checkFieldAdd(e.target.value, "MsgBag")} name="chatbot_name"></input>
              <label id="newMsgBagErrMsg" style={{ display: 'none', color: "red" }}></label>
            </label><br />
            <Button onClick={() => renameMagBag()}>変更</Button>
          </div>
        </ModalShort>
        <ModalShort open={isOpenCopyMsgBag} onClose={() => setIsOpenCopyMsgBag(false)}>
          <div style={{ width: "300px", textAlign: "center", color: "#51cbce" }}>
            <h4>メッセージグループをコピーしますか。</h4>
            <Button onClick={() => copyMagBag()}>はい</Button>
            <Button onClick={() => setIsOpenCopyMsgBag(false)}>いいえ</Button>
          </div>
        </ModalShort>
        <ModalShort open={isOpenDeleteMsgBag} onClose={() => setIsOpenDeleteMsgBag(false)}>
          <div style={{ width: "300px", textAlign: "center", color: "#51cbce" }}>
            <h4>メッセージグループを削除しますか。</h4>
            <Button onClick={() => deleteMagBag()}>はい</Button>
            <Button onClick={() => setIsOpenDeleteMsgBag(false)}>いいえ</Button>
          </div>
        </ModalShort>
        <ModalShort open={isOpenMsgBagRename} onClose={() => setIsOpenMsgBagRename(false)}>
          <div style={{ width: "300px", textAlign: "center", color: "#51cbce" }}>
            <h4>メッセージ袋名変更</h4>
            <label style={{ width: "100%" }}>
              <input id="rename_bag_inside" style={{ width: "100%" }} onBlur={(e) => utils.checkFieldAdd(e.target.value, "MsgBag")} name="chatbot_bag_name"></input>
              <label id="newMsgBagErrMsg" style={{ display: 'none', color: "red" }}></label>
            </label><br />
            <Button onClick={() => renameMessageBag()}>変更</Button>
          </div>
        </ModalShort>
        <ModalShort open={isOpenMsgBagCopy} onClose={() => setIsOpenMsgBagCopy(false)}>
          <div style={{ width: "300px", textAlign: "center", color: "#51cbce" }}>
            <h4>メッセージ袋をコピーしますか。</h4>
            <Button onClick={() => copyMessageBag()}>はい</Button>
            <Button onClick={() => setIsOpenMsgBagCopy(false)}>いいえ</Button>
          </div>
        </ModalShort>
        <ModalShort open={isOpenMsgBagDelete} onClose={() => setIsOpenMsgBagDelete(false)}>
          <div style={{ width: "300px", textAlign: "center", color: "#51cbce" }}>
            <h4>メッセージ袋を削除しますか。</h4>
            <Button onClick={() => deleteMessageBag()}>はい</Button>
            <Button onClick={() => setIsOpenMsgBagDelete(false)}>いいえ</Button>
          </div>
        </ModalShort>
        <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
          <div style={{ width: "300px", textAlign: "center", color: "#51cbce" }}>
            <h4>{msgNoti}</h4>
          </div>
        </ModalNoti>
        <Modal open={isOpenSelectPastPost} onClose={() => setIsOpenSelectPastPost(false)}>
          <div style={{ width: "700px", textAlign: "center", color: "#51cbce" }}>
            <h4>過去の投稿選択</h4>
            <div className="grid-container">
              {pastPostList.map((pp, i) => (
                <div onClick={() => addPPChatbot(pp.media_url, pp.id)} className="grid-item" style={{ width: "200px" }} key={i}>
                  <img style={{ height: "100px" }} src={pp.media_url}></img>
                </div>
              ))}
            </div>

          </div>
        </Modal>
        <Modal open={isOpenSelectPastPostUp} onClose={() => setIsOpenSelectPastPostUp(false)}>
          <div style={{ width: "700px", textAlign: "center", color: "#51cbce" }}>
            <h4>過去の投稿選択</h4>
            <div className="grid-container">
              {pastPostList.map((pp, i) => (
                <div onClick={() => upPP(pp.media_url, pp.id)} className="grid-item" style={{ width: "200px" }} key={i}>
                  <img style={{ height: "100px" }} src={pp.media_url}></img>
                </div>
              ))}
            </div>

          </div>
        </Modal>
        {/* *******************************Single choice */}
        <ModalShort open={isAddOpenSingleChoice} onClose={() => setIsAddOpenSingleChoice(false)}>
          <div style={{ width: "600px", height: "370px" }}>
            <div style={{ padding: "15px", width: "100%" }}>
              <input id="titleNextMSG" style={{ width: "100%", border: "1px solid gray", borderRadius: "10px" }} onChange={() => checkInputTitleSC()} placeholder="Title..."></input>
              <label id="titleSC" style={{ color: "red", display: "none" }}>Please input title</label>
            </div><br />
            <span style={{ padding: "15px" }}>Destination</span>
            <br />
            <div style={{ display: "flex", width: "100%" }}>
              <div onClick={() => displaySCNextMSG()} style={{ width: "45%", margin: "auto" }}>
                <div><span style={{ float: "right", fontSize: "18px", fontWeight: "500" }}>Next message</span></div>
              </div>
              <div onClick={() => displaySCWebsite()} style={{ width: "45%", margin: "auto" }}><span style={{ float: "left", fontSize: "18px", fontWeight: "500" }}>Website</span></div>
            </div>
            <div style={{ display: "flex", width: "100%" }}>
              <div style={{ width: "45%", margin: "auto" }}>
                <div id="underlineSCNextMsg" style={{ height: "2px", width: "45%", backgroundColor: "black", float: "right" }}></div>
              </div>
              <div style={{ width: "45%", margin: "auto" }}>
                <div id="underlineSCWebsite" style={{ height: "2px", width: "45%", backgroundColor: "black", display: "none" }}></div>
              </div>
            </div>
            <br />
            <div id={`nextMessageSC`} style={{ textAlign: "center" }}>
              <select id="listNextMSGGroupSC" style={{ width: "30%" }} defaultValue={""} onChange={(e) => selectGroupNextMSG(e.target.value)} className="new-faq-q-so1" name="reply_group">
                <option value="" disabled hidden>メッセージグループ選択 ...</option>
                {groupList?.map((group, i) => {
                  return (
                    <option key={i} value={group.id}>
                      {group.group_name}
                    </option>
                  )
                })}
              </select>
              <select id={`listNextMSGBagSC`} style={{ width: "30%" }} defaultValue={""} onChange={(e) => selectBagNextMSG(e.target.value)} className="new-faq-q-so1" name="reply_bag">
                <option value="" disabled hidden>{ }</option>
              </select>
            </div>
            <label id="grBagSC" style={{ color: "red", display: "none", width: "100%", textAlign: "center" }}></label>
            <div id={`websiteURLSC`} style={{ padding: "15px", display: "none" }}>
              <input id="websiteSC" style={{ width: "100%", border: "1px solid gray", borderRadius: "10px" }}></input>
              <label id="webSC" style={{ color: "red", display: "none" }}>Please input web</label>
            </div>
            <br />
            <span>Label</span>
            <div id={`labelSC`} style={{ padding: "15px 15px 0px 15px", display: "none", display: "flex" }}>
              <div id="labelLSCInputed" style={{ display: "flex" }}></div>
              <input id="labelLSC" onKeyPress={(e) => checkInputedLabelSC(e, e.target.value)} style={{ width: "100%", border: "none" }}></input>
              <input id={`lblSCAddALL_${bagAddSC}`} defaultValue={labelInputSCAll} type="text" hidden></input>
            </div>
            <div id="underlineSCWebsite" style={{ height: "1px", width: "100%", backgroundColor: "black" }}></div>
            <label id="labeltoCheckInputLabelSC">Enter label to add</label>
            <br />
            <div style={{ width: "100%", textAlign: "center" }}><Button onClick={() => saveSC()}>Save</Button></div>
          </div>
        </ModalShort>
        {/* ********************************Update Single choice */}
        <ModalShort open={isUpdateOpenSingleChoice} onClose={() => setIsUpdateOpenSingleChoice(false)}>
          <div style={{ width: "600px", height: "370px" }}>
            <div style={{ padding: "15px", width: "100%" }}>
              <input id="titleNextMSG" style={{ width: "100%", border: "1px solid gray", borderRadius: "10px" }} onChange={() => checkInputTitleSC()} placeholder="Title..."></input>
              <label id="titleSC" style={{ color: "red", display: "none" }}>Please input title</label>
            </div><br />
            <span style={{ padding: "15px" }}>Destination</span>
            <br />
            <div style={{ display: "flex", width: "100%" }}>
              <div onClick={() => displaySCNextMSG()} style={{ width: "45%", margin: "auto" }}>
                <div><span style={{ float: "right", fontSize: "18px", fontWeight: "500" }}>Next message</span></div>
              </div>
              <div onClick={() => displaySCWebsite()} style={{ width: "45%", margin: "auto" }}><span style={{ float: "left", fontSize: "18px", fontWeight: "500" }}>Website</span></div>
            </div>
            <div style={{ display: "flex", width: "100%" }}>
              <div style={{ width: "45%", margin: "auto" }}>
                <div id="underlineSCNextMsg" style={{ height: "2px", width: "45%", backgroundColor: "black", float: "right" }}></div>
              </div>
              <div style={{ width: "45%", margin: "auto" }}>
                <div id="underlineSCWebsite" style={{ height: "2px", width: "45%", backgroundColor: "black", display: "none" }}></div>
              </div>
            </div>
            <br />
            <div id={`nextMessageSC`} style={{ textAlign: "center" }}>
              <select id="listNextMSGGroupSC" style={{ width: "30%" }} defaultValue={""} onChange={(e) => selectGroupNextMSG(e.target.value)} className="new-faq-q-so1" name="reply_group">
                <option value="" disabled hidden>メッセージグループ選択 ...</option>
                {groupList?.map((group, i) => {
                  return (
                    <option key={i} value={group.id}>
                      {group.group_name}
                    </option>
                  )
                })}
              </select>
              <select id={`listNextMSGBagSC`} style={{ width: "30%" }} defaultValue={""} onChange={(e) => selectBagNextMSG(e.target.value)} className="new-faq-q-so1" name="reply_bag">
                <option value="" disabled hidden>{ }</option>
              </select>
            </div>
            <label id="grBagSC" style={{ color: "red", display: "none", width: "100%", textAlign: "center" }}></label>
            <div id={`websiteURLSC`} style={{ padding: "15px", display: "none" }}>
              <input id="websiteSC" style={{ width: "100%", border: "1px solid gray", borderRadius: "10px" }}></input>
              <label id="webSC" style={{ color: "red", display: "none" }}>Please input web</label>
            </div>
            <br />
            <span>Label</span>
            <div id={`labelSC`} style={{ padding: "15px 15px 0px 15px", display: "none", display: "flex" }}>
              <div id="labelLSCInputed" style={{ display: "flex" }}></div>
              <input id="labelLSC" onKeyPress={(e) => checkInputedLabelSC(e, e.target.value)} style={{ width: "100%", border: "none" }}></input>
              <input id={`lblSCAddALL_${bagAddSC}`} defaultValue={labelInputSCAll} type="text" hidden></input>
            </div>
            <div id="underlineSCWebsite" style={{ height: "1px", width: "100%", backgroundColor: "black" }}></div>
            <label id="labeltoCheckInputLabelSC">Enter label to add</label>
            <br />
            <div style={{ width: "100%", textAlign: "center" }}><Button onClick={() => saveUpSC()}>Save</Button></div>
          </div>
        </ModalShort>
        {/* Three Choice ********************************/}
        <ModalShort open={isAddOpenThreeChoice} onClose={() => setIsAddOpenThreeChoice(false)}>
          <div style={{ width: "600px", height: "370px" }}>
            <div style={{ padding: "15px", width: "100%" }}>
              <input id="titleNextMSGTC" style={{ width: "100%", border: "1px solid gray", borderRadius: "10px" }} onChange={() => checkInputTitleTC()} placeholder="Title..."></input>
              <label id="titleTC" style={{ color: "red", display: "none" }}>Please input title</label>
            </div><br />
            <span style={{ padding: "15px" }}>Destination</span>
            <br />
            <div style={{ display: "flex", width: "100%" }}>
              <div onClick={() => displayTCNextMSG()} style={{ width: "45%", margin: "auto" }}>
                <div><span style={{ float: "right", fontSize: "18px", fontWeight: "500" }}>Next message</span></div>
              </div>
              <div onClick={() => displayTCWebsite()} style={{ width: "45%", margin: "auto" }}><span style={{ float: "left", fontSize: "18px", fontWeight: "500" }}>Website</span></div>
            </div>
            <div style={{ display: "flex", width: "100%" }}>
              <div style={{ width: "45%", margin: "auto" }}>
                <div id="underlineTCNextMsg" style={{ height: "2px", width: "45%", backgroundColor: "black", float: "right", display: "block" }}></div>
              </div>
              <div style={{ width: "45%", margin: "auto" }}>
                <div id="underlineTCWebsite" style={{ height: "2px", width: "45%", backgroundColor: "black", display: "none" }}></div>
              </div>
            </div>
            <br />
            <div id={`nextMessageTC`} style={{ textAlign: "center" }}>
              <select id="listNextMSGGroupTC" style={{ width: "30%" }} defaultValue={""} onChange={(e) => selectGroupNextMSGTC(e.target.value)} className="new-faq-q-so1" name="reply_group">
                <option value="" disabled hidden>メッセージグループ選択 ...</option>
                {groupList?.map((group, i) => {
                  return (
                    <option key={i} value={group.id}>
                      {group.group_name}
                    </option>
                  )
                })}
              </select>
              <select id={`listNextMSGBagTC`} style={{ width: "30%" }} defaultValue={""} onChange={(e) => selectBagNextMSGTC(e.target.value)} className="new-faq-q-so1" name="reply_bag">
                <option value="" disabled hidden>{ }</option>
              </select>
            </div>
            <label id="grBagTC" style={{ color: "red", display: "none", width: "100%", textAlign: "center" }}></label>
            <div id={`websiteURLTC`} style={{ padding: "15px", display: "none" }}>
              <input id="websiteTC" style={{ width: "100%", border: "1px solid gray", borderRadius: "10px" }}></input>
              <label id="webTC" style={{ color: "red", display: "none" }}>Please input web</label>
            </div>
            <br />
            <span>Label</span>
            <div id={`labelSC`} style={{ padding: "15px 15px 0px 15px", display: "none", display: "flex" }}>
              <div id="labelLTCInputed" style={{ display: "flex" }}></div>
              <input id="labelLTC" onKeyPress={(e) => checkInputedLabelTC(e, e.target.value)} style={{ width: "100%", border: "none" }}></input>
              <input id={`lblTCAddALL_${totalItemTC}`} defaultValue={labelInputTCAll} type="text" hidden></input>
            </div>
            <div id="underlineTCWebsite" style={{ height: "1px", width: "100%", backgroundColor: "black" }}></div>
            <label id="labeltoCheckInputLabelTC">Enter label to add</label>
            <br />
            <div style={{ width: "100%", textAlign: "center" }}><Button onClick={() => saveTC()}>Save</Button></div>
          </div>
        </ModalShort>
        {/* ***********************************Update Three choice */}
        <ModalShort open={isUpdateOpenThreeChoice} onClose={() => setIsUpdateOpenThreeChoice(false)}>
          <div style={{ width: "600px", height: "370px" }}>
            <div style={{ padding: "15px", width: "100%" }}>
              <input id="titleNextMSGTC" style={{ width: "100%", border: "1px solid gray", borderRadius: "10px" }} onChange={() => checkInputTitleTC()} placeholder="Title..."></input>
              <label id="titleTC" style={{ color: "red", display: "none" }}>Please input title</label>
            </div><br />
            <span style={{ padding: "15px" }}>Destination</span>
            <br />
            <div style={{ display: "flex", width: "100%" }}>
              <div onClick={() => displayTCNextMSG()} style={{ width: "45%", margin: "auto" }}>
                <div><span style={{ float: "right", fontSize: "18px", fontWeight: "500" }}>Next message</span></div>
              </div>
              <div onClick={() => displayTCWebsite()} style={{ width: "45%", margin: "auto" }}><span style={{ float: "left", fontSize: "18px", fontWeight: "500" }}>Website</span></div>
            </div>
            <div style={{ display: "flex", width: "100%" }}>
              <div style={{ width: "45%", margin: "auto" }}>
                <div id="underlineTCNextMsg" style={{ height: "2px", width: "45%", backgroundColor: "black", float: "right", display: "block" }}></div>
              </div>
              <div style={{ width: "45%", margin: "auto" }}>
                <div id="underlineTCWebsite" style={{ height: "2px", width: "45%", backgroundColor: "black", display: "none" }}></div>
              </div>
            </div>
            <br />
            <div id={`nextMessageTC`} style={{ textAlign: "center" }}>
              <select id="listNextMSGGroupTC" style={{ width: "30%" }} defaultValue={""} onChange={(e) => selectGroupNextMSGTC(e.target.value)} className="new-faq-q-so1" name="reply_group">
                <option value="" disabled hidden>メッセージグループ選択 ...</option>
                {groupList?.map((group, i) => {
                  return (
                    <option key={i} value={group.id}>
                      {group.group_name}
                    </option>
                  )
                })}
              </select>
              <select id={`listNextMSGBagTC`} style={{ width: "30%" }} defaultValue={""} onChange={(e) => selectBagNextMSGTC(e.target.value)} className="new-faq-q-so1" name="reply_bag">
                <option value="" disabled hidden>{ }</option>
              </select>
            </div>
            <label id="grBagTC" style={{ color: "red", display: "none", width: "100%", textAlign: "center" }}></label>
            <div id={`websiteURLTC`} style={{ padding: "15px", display: "none" }}>
              <input id="websiteTC" style={{ width: "100%", border: "1px solid gray", borderRadius: "10px" }}></input>
              <label id="webTC" style={{ color: "red", display: "none" }}>Please input web</label>
            </div>
            <br />
            <span>Label</span>
            <div id={`labelSC`} style={{ padding: "15px 15px 0px 15px", display: "none", display: "flex" }}>
              <div id="labelLTCInputed" style={{ display: "flex" }}></div>
              <input id="labelLTC" onKeyPress={(e) => checkInputedLabelTC(e, e.target.value)} style={{ width: "100%", border: "none" }}></input>
              <input id={`lblTCAddALL_${totalItemTC}`} defaultValue={labelInputTCAll} type="text" hidden></input>
            </div>
            <div id="underlineTCWebsite" style={{ height: "1px", width: "100%", backgroundColor: "black" }}></div>
            <label id="labeltoCheckInputLabelTC">Enter label to add</label>
            <br />
            <div style={{ width: "100%", textAlign: "center" }}><Button onClick={() => saveUpTC()}>Save</Button></div>
          </div>
        </ModalShort>
        {/* Free Input *********************************************** */}
        <ModalShort open={isAddOpenFreeInput} onClose={() => setIsAddOpenFreeInput(false)}>
          <div style={{ width: "600px", height: "370px" }}>

            {/* <span style={{ padding: "15 0px 15px 0px" }}>Transitive Destination</span>
            <br />
            <div id={`nextMessageFI`} style={{ textAlign: "center" }}>
              <select id="listNextMSGGroupFI" style={{ width: "30%" }} defaultValue={""} onChange={(e) => selectGroupNextMSGFI(e.target.value)} className="new-faq-q-so1" name="reply_group">
                <option value="" disabled hidden>メッセージグループ選択 ...</option>
                {groupList?.map((group, i) => {
                  return (
                    <option key={i} value={group.id}>
                      {group.group_name}
                    </option>
                  )
                })}
              </select>
              <select id={`listNextMSGBagFI`} style={{ width: "30%" }} defaultValue={""} onChange={(e) => selectBagNextMSGFI(e.target.value)} className="new-faq-q-so1" name="reply_bag">
                <option value="" disabled hidden>{ }</option>
              </select>
            </div> */}
            <label id="grBagFI" style={{ color: "red", display: "none", width: "100%", textAlign: "center" }}></label>
            <div id={`websiteURLFI`} style={{ padding: "15px", display: "none" }}>
              <input id="websiteFI" style={{ width: "100%", border: "1px solid gray", borderRadius: "10px" }}></input>
            </div>
            <br />
            <span>Label</span>
            <div id={`labelSC`} style={{ padding: "15px 15px 0px 15px", display: "flex" }}>
              <div id="labelLFIInputed" style={{ display: "flex" }}></div>
              <input id="labelLFI" onKeyPress={(e) => checkInputedLabelFI(e, e.target.value)} style={{ width: "100%", border: "none" }}></input>
              <input id={`labelLFIAll_${labelInputFINum}`} defaultValue={labelInputFIAll} type="text" hidden></input>
            </div>
            <div id="underlineFIWebsite" style={{ height: "1px", width: "100%", backgroundColor: "black" }}></div>
            <label id="labeltoCheckInputLabelFI">Enter label to add</label>
            <br />
            <span>Format Check</span>
            <div id={`formatCheck`} style={{ padding: "15px 15px 0px 15px", display: "none", display: "flex" }}>
              <div style={{ display: "flex" }}></div>
              <select id="formatCheckSelect" style={{ width: "95%" }} defaultValue={"none"} onChange={(e) => selectFormatCheck(e.target.value)} className="new-faq-q-so1" name="format_check">
                <option value="no_validate">No Validation</option>
                <option value="email">Email Address</option>
                <option value="phone_number">Phone Number</option>
              </select>
            </div>
            <div id="formatCheckFI" style={{ display: "none", padding: "0px 15px 0px 15px", textAlign: "center" }}>
              <label style={{ width: "100%", textAlign: "center" }}>Input error format message</label>
              <input id="formatCheckFIValue" style={{ width: "95%", margin: "auto", marginLeft: "-5px", border: "1px solid black", borderRadius: "10px" }} type="text"></input>
            </div>
            <div style={{ width: "100%", textAlign: "center" }}><Button onClick={() => saveFI()}>Save</Button></div>
          </div>
        </ModalShort>
        {/* Update Free Input *********************************************** */}
        <ModalShort open={isUpdateOpenFreeInput} onClose={() => setIsUpdateOpenFreeInput(false)}>
          <div style={{ width: "600px", height: "370px" }}>

            {/* <span style={{ padding: "15 0px 15px 0px" }}>Transitive Destination</span>
            <br />
            <div id={`nextMessageFI`} style={{ textAlign: "center" }}>
              <select id="listNextMSGGroupFI" style={{ width: "30%" }} defaultValue={""} onChange={(e) => selectGroupNextMSGFI(e.target.value)} className="new-faq-q-so1" name="reply_group">
                <option value="" disabled hidden>メッセージグループ選択 ...</option>
                {groupList?.map((group, i) => {
                  return (
                    <option key={i} value={group.id}>
                      {group.group_name}
                    </option>
                  )
                })}
              </select>
              <select id={`listNextMSGBagFI`} style={{ width: "30%" }} defaultValue={""} onChange={(e) => selectBagNextMSGFI(e.target.value)} className="new-faq-q-so1" name="reply_bag">
                <option value="" disabled hidden>{ }</option>
              </select>
            </div> */}
            <label id="grBagFI" style={{ color: "red", display: "none", width: "100%", textAlign: "center" }}></label>
            <div id={`websiteURLFI`} style={{ padding: "15px", display: "none" }}>
              <input id="websiteFI" style={{ width: "100%", border: "1px solid gray", borderRadius: "10px" }}></input>
            </div>
            <br />
            <span>Label</span>
            <div id={`labelSC`} style={{ padding: "15px 15px 0px 15px", display: "flex" }}>
              <div id="labelLFIInputed" style={{ display: "flex" }}></div>
              <input id="labelLFI" onKeyPress={(e) => checkInputedLabelFI(e, e.target.value)} style={{ width: "100%", border: "none" }}></input>
              <input id={`labelLFIAll_${labelInputFINum}`} defaultValue={labelInputFIAll} type="text" hidden></input>
            </div>
            <div id="underlineFIWebsite" style={{ height: "1px", width: "100%", backgroundColor: "black" }}></div>
            <label id="labeltoCheckInputLabelFI">Enter label to add</label>
            <br />
            <span>Format Check</span>
            <div id={`formatCheck`} style={{ padding: "15px 15px 0px 15px", display: "none", display: "flex" }}>
              <div style={{ display: "flex" }}></div>
              <select id="formatCheckSelect" style={{ width: "95%" }} defaultValue={"none"} onChange={(e) => selectFormatCheck(e.target.value)} className="new-faq-q-so1" name="format_check">
                <option value="no_validate">No Validation</option>
                <option value="email">Email Address</option>
                <option value="phone_number">Phone Number</option>
              </select>
            </div>
            <div id="formatCheckFI" style={{ display: "none", padding: "0px 15px 0px 15px", textAlign: "center" }}>
              <label style={{ width: "100%", textAlign: "center" }}>Input error format message</label>
              <input id="formatCheckFIValue" style={{ width: "95%", margin: "auto", marginLeft: "-5px", border: "1px solid black", borderRadius: "10px" }} type="text"></input>
            </div>
            <div style={{ width: "100%", textAlign: "center" }}><Button onClick={() => saveUpFI()}>Save</Button></div>
          </div>
        </ModalShort>
      </div>
    </>
  );
}

export default Chatbot;
