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
  const [bagId, setBagId] = useState()
  var [customDiv, setCustomDiv] = useState([])

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

  function reloadGroup(){
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
      var liMesBag = document.createElement('li')
      liMesBag.setAttribute('id', liMesBag)
      document.getElementById('ulMesBag').appendChild(liMesBag)
      setIdList(idli)
      // console.log(idli)
      setGroupList(res.data.data)
      setTimeout(() => {
        var i = idli.length - 1
        document.getElementById('liMesBag').id = `liMesBag${idli[i]}`

      }, 1000)
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
      // console.log("bagMsg: ",res.data.data.messages)
      setMsgCBNum(bagMsg[bagMsg.length - 1].id)
      setImgCBNum(bagMsg[bagMsg.length - 1].id)
      setImgCBNum(bagMsg[bagMsg.length - 1].id)
      bagMsg.forEach((item) => {
        if (item.message_type == "msg") {
          var abc = document.createElement("div")
          document.getElementById("div_custom").appendChild(abc)
          abc.innerHTML =
            `<div id="chatbot_message${item.id}" style=" border-radius: 20px; display:block; background-color: #f4f3ef; padding: 40px; margin-top: 20px; text-align: center" >
              
              <div><textarea name="messagesVa${item.id}" class="mgsChatbot" id="mgsCustomSaved${item.id}" placeholder="返事入力..." type="text" rows="3"></textarea></div>
              <div id="btnDelMsg${item.id}" style="float:right;">
              <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
                font-weight:800">Delete</button>
              </div>
              <div id="btnUpdateMsg${item.id}" style="float:right;">
              <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
                font-weight:800">Update</button>
              </div>
            </div>`
          // document.getElementById(`mgsCustomKey${item.id}`).textContent = item.received_message
          document.getElementById(`mgsCustomSaved${item.id}`).textContent = item.message_value

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
                setMsgNoti("Delete Successfully")
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
            event.preventDefault()
            var upd = { message: { message_value: document.getElementById(`mgsCustomSaved${item.id}`).value, message_type: "msg", img_value: "" } }
            api.patch(`/api/v1/message_managements/messages/${item.id}`, upd).then(res => {
              console.log(res)
              
              setTimeout(() => {
                setIsOpenNoti(true)
                setMsgNoti("Update Successfully")
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
              font-weight:800">Delete</button>
            </div>
            <div id="btnUpdateImg${item.id}" style="float:right;">
              <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
              font-weight:800">Update</button>
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
                setMsgNoti("Delete Successfully")
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
            var upd = {
              message: { message_value: "", message_type: "img", img_value: document.getElementById(`imgDataNumSaved${item.id}`).value }
            }
            api.patch(`/api/v1/message_managements/messages/${item.id}`, upd).then(res => {
              // alert("Delete Successfully")
              console.log(res)
              setTimeout(() => {
                setIsOpenNoti(true)
                setMsgNoti("Update Successfully")
              }, 1500)
              
              setTimeout(function () {
                setIsOpenNoti(false)
              }, 2000);
              getBagMsg(group, id)
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
              font-weight:800">Delete</button>
            </div>
            <div id="btnUpImgMsg${item.id}" style="float:right;">
              <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
              font-weight:800">Update</button>
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
                setMsgNoti("Delete Successfully")
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
            var upd = {
              message: { message_value: document.getElementById(`imgMgsCustomSaved${item.id}`).value, message_type: "img_msg", img_value: document.getElementById(`imgValueMsgNumSaved${item.id}`).value }
            }

            api.patch(`/api/v1/message_managements/messages/${item.id}`, upd).then(res => {
              // alert("Delete Successfully")
              console.log(res)
              setTimeout(() => {
                setIsOpenNoti(true)
                setMsgNoti("Update Successfully")
              }, 1500)
              
              setTimeout(function () {
                setIsOpenNoti(false)
              }, 2000);
              getBagMsg(group, id)
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
              font-weight:800">Delete</button>
            </div>
            <div id="btnUpdatePP${item.id}" style="float:right; display:none">
              <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
              font-weight:800">Update</button>
            </div>
            <div id="btnChangePP${item.id}" style="float:right;">
              <button style="width:110px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
              font-weight:800">Change post</button>
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
                setMsgNoti("Delete Successfully")
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
          var abc = document.createElement("div")
          document.getElementById("div_custom").appendChild(abc)
          abc.innerHTML =
            `<div id="chatbot_message${item.id}" style=" border-radius: 20px; display:block; background-color: #f4f3ef; padding: 40px; margin-top: 20px; text-align: center" >
              
              <div><textarea name="messagesVa${item.id}" class="mgsChatbot" id="mgsCustomSaved${item.id}" placeholder="返事入力..." type="text" rows="3"></textarea></div>
              <div id="btnDelMsg${item.id}" style="float:right;">
              <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
                font-weight:800">Delete</button>
              </div>
              <div id="btnUpdateMsg${item.id}" style="float:right;">
              <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
                font-weight:800">Update</button>
              </div>
            </div>`
          // document.getElementById(`mgsCustomKey${item.id}`).textContent = item.received_message
          document.getElementById(`mgsCustomSaved${item.id}`).textContent = item.message_value

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
                setMsgNoti("Delete Successfully")
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
            event.preventDefault()
            var upd = { message: { message_value: document.getElementById(`mgsCustomSaved${item.id}`).value, message_type: "msg", img_value: "" } }
            api.patch(`/api/v1/message_managements/messages/${item.id}`, upd).then(res => {
              console.log(res)
              setTimeout(() => {
                setIsOpenNoti(true)
                setMsgNoti("Update Successfully")
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
              font-weight:800">Delete</button>
            </div>
            <div id="btnUpdateImg${item.id}" style="float:right;">
              <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
              font-weight:800">Update</button>
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
                setMsgNoti("Delete Successfully")
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
                setMsgNoti("Update Successfully")
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
              font-weight:800">Delete</button>
            </div>
            <div id="btnUpImgMsg${item.id}" style="float:right;">
              <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
              font-weight:800">Update</button>
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
                setMsgNoti("Delete Successfully")
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
                setMsgNoti("Update Successfully")
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
              font-weight:800">Delete</button>
            </div>
            <div id="btnUpdatePP${item.id}" style="float:right; display:none">
              <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
              font-weight:800">Update</button>
            </div>
            <div id="btnChangePP${item.id}" style="float:right;">
              <button style="width:110px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
              font-weight:800">Change post</button>
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
                setMsgNoti("Delete Successfully")
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
        document.getElementById(`msg_group${idIn}_id${idd}`).addEventListener('click', () => {
          setIdReloadMsgBagFromGetMSG(idd)
          getBagMsg(idIn, idd)
          setBagId(idd)
        })
        document.getElementById(`msg_group_div${idIn}_id${idd}`).addEventListener('click', (event) => {
          event.preventDefault()
          //Rename, Delete, Cancel uncomment code below

          document.getElementById(`msg_group${idIn}_id${idd}`).appendChild(abc)
          abc.innerHTML = `<div id="itemMsg_${idIn}_${idd}">
            <div class="dropdown-content">
              <button style="border:none; border-radius:10px; background-color: #66615b; color:white; font-size:13px">Rename</button>
              <button id="deleteBtn${idIn}_${idd}" style="border:none; border-radius:10px; background-color: #66615b; color:white; font-size:13px">Delete</button>
              <button id="cancelBtn${idIn}_${idd}" style="border:none; border-radius:10px; background-color: #66615b; color:white; font-size:13px">Cancel</button>
            </div>
          </div>`
          document.getElementById(`msgBag_item_${idIn}_${idd}`).removeAttribute('hidden')

          document.getElementById(`cancelBtn${idIn}_${idd}`).addEventListener('click', (event) => {
            event.preventDefault()
            document.getElementById(`msgBag_item_${idIn}_${idd}`).setAttribute("hidden", true)
          })
          document.getElementById(`deleteBtn${idIn}_${idd}`).addEventListener('click', (event) => {
            event.preventDefault()
            alert(idd)
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

          // document.getElementById(`msg_group${idIn}_id${idd}`).appendChild(abc)
          // abc.innerHTML = `<div id="itemMsg_${idIn}_${idd}">
          //   <div class="dropdown-content">
          //     <button style="border:none; border-radius:10px; background-color: #66615b; color:white; font-size:13px">Rename</button>
          //     <button id="deleteBtn${idIn}_${idd}" style="border:none; border-radius:10px; background-color: #66615b; color:white; font-size:13px">Delete</button>
          //     <button id="cancelBtn${idIn}_${idd}" style="border:none; border-radius:10px; background-color: #66615b; color:white; font-size:13px">Cancel</button>
          //   </div>
          // </div>`
          // document.getElementById(`msgBag_item_${idIn}_${idd}`).removeAttribute('hidden')

          // document.getElementById(`cancelBtn${idIn}_${idd}`).addEventListener('click', () => {
          //   document.getElementById(`msgBag_item_${idIn}_${idd}`).setAttribute("hidden", true)
          // })
          // document.getElementById(`deleteBtn${idIn}_${idd}`).addEventListener('click', () => {
          // })
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
    <div id="btnDelImg${numIndex}" style="float:right;">
        <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
        font-weight:800">Delete</button>
      </div>
      <div id="btnAddEachImg${numIndex}" style="float:right; display:block">
      <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
      font-weight:800">Add</button>
    </div>
  </div>`
    // document.getElementById(`btnDelImg${numIndex}`).style.display='none'
    document.getElementById(`imgNum${numIndex}`).addEventListener('change', (e) => loadFile(e))
    // document.getElementById(`imgNum${numIndex}`).addEventListener('change', () => { document.getElementById(`btnDelImg${numIndex}`).style.display = 'block' })
    document.getElementById(`btnDelImg${numIndex}`).addEventListener('click', () => deleteImgCB(numIndex))
    document.getElementById(`btnAddEachImg${numIndex}`).addEventListener('click', (event) => {
      event.preventDefault()
      // console.log(bagId)
      var add = {
        message: { message_bag_id: bagId, message_value: "", message_type: "img", img_value: document.getElementById(`imgDataNum${numIndex}`).value }
      }
      api.post(`/api/v1/message_managements/messages`, add).then(res => {
        // console.log(res)
        setTimeout(() => {
          setIsOpenNoti(true)
          setMsgNoti("Add Successfully")
        }, 1500)
        
        setTimeout(function () {
          setIsOpenNoti(true)
        }, 2000);
reloadMessMsgBag()
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
    var numIndex = parseInt(msgCBNum) + 1
    var abc = document.createElement("div")
    document.getElementById("div_custom").appendChild(abc)
    abc.innerHTML =
      `<div id="chatbot_message${numIndex}" style=" border-radius: 20px; display:block; background-color: #f4f3ef; padding: 40px; margin-top: 20px; text-align: center" >
    
    <div><textarea name="messagesVa${numIndex}" class="mgsChatbot" id="mgsCustom${numIndex}" placeholder="返事入力..." type="text" rows="3"></textarea></div>
    <div id="btnDelMsg${numIndex}" style="float:right; display:block">
        <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
        font-weight:800">Delete</button>
      </div>
      <div id="btnAddEachMsg${numIndex}" style="float:right; display:block">
      <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
      font-weight:800">Add</button>
    </div>
    </div>`
    document.getElementById(`btnAddEachMsg${numIndex}`).addEventListener('click', (event) => {
      event.preventDefault()
      var element = document.getElementById(`mgsCustom${numIndex}`).value
      // alert(bagId)
      var add = {
        message: { message_bag_id: bagId, message_value: element, message_type: "msg", img_value: "" }
      }

      api.post(`/api/v1/message_managements/messages`, add).then(res => {
        // alert("Add Successfully")
        console.log(res)
        setTimeout(() => {
          setIsOpenNoti(true)
          setMsgNoti("Add Successfully")
        }, 1500)
        
        setTimeout(function () {
          setIsOpenNoti(false)
        }, 2000);
reloadMessMsgBag()

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
   <div id="btnDelPP${numIndex}" style="float:right; display:block">
        <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
        font-weight:800">Delete</button>
      </div>
      <div id="btnAddPP${numIndex}" style="float:right; display:block">
        <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
        font-weight:800">Add</button>
      </div>
    
    </div>
    `
    // document.getElementById(`ppCustom${numIndex}`).addEventListener('change', (e) => msgOV(e.target.value))
    ppOV(url)
    // document.getElementById(`mgsCustom${numIndex}`).addEventListener('change', () => { document.getElementById(`btnDelMsg${numIndex}`).style.display = 'block' })
    document.getElementById(`btnDelPP${numIndex}`).addEventListener('click', () => deletePPCB(numIndex))
    document.getElementById(`btnAddPP${numIndex}`).addEventListener('click', (event) => {
      event.preventDefault()
      var add = {
        message: { message_bag_id: bagId, message_value: id.toString(), message_type: "past_post", img_value: "", preview_past_post_url: url }
      }
      api.post(`/api/v1/message_managements/messages`, add).then(res => {
        console.log(res)
        setTimeout(() => {
          setIsOpenNoti(true)
          setMsgNoti("Add Successfully")
        }, 1500)
       
        setTimeout(function () {
          setIsOpenNoti(false)
        }, 2000);
         reloadMessMsgBag()
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
      var update = { message: { message_value: id, message_type: "past_post", img_value: "", preview_past_post_url: ppurl } }
      api.patch(`/api/v1/message_managements/messages/${idPPUP}`, update).then(res => {
        console.log("Update post response: ", res)


        setTimeout(() => {
          setIsOpenNoti(true)
          setMsgNoti("Update Successfully")
        }, 1500)
        setTimeout(function () {
          setIsOpenNoti(false)
        }, 2000);

        getBagMsg(idForReloadMsgBag, idForReloadMsgBag)
      }).catch(error => {
        console.log(error)
      })
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
    <div id="btnDelImgMsg${numIndex}" style="float:right; display:block">
        <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
        font-weight:800">Delete</button>
      </div>
      <div id="btnAddImgMsg${numIndex}" style="float:right; display:block">
        <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
        font-weight:800">Add</button>
      </div>
  </div>`

    // console.log(document.getElementById(`outputImgMsg${numIndex}`))
    document.getElementById(`imgMsgNum${numIndex}`).addEventListener('change', (e) => loadFileImgMsg(e))
    document.getElementById(`imgMgsCustom${numIndex}`).addEventListener('change', (e) => imgMsgOV(e.target.value))
    // document.getElementById(`imgMsgNum${numIndex}`).addEventListener('change', () => { document.getElementById(`btnDelImgMsg${numIndex}`).style.display = 'block' })
    // document.getElementById(`imgMgsCustom${numIndex}`).addEventListener('change', () => { document.getElementById(`btnDelImgMsg${numIndex}`).style.display = 'block' })
    document.getElementById(`btnDelImgMsg${numIndex}`).addEventListener('click', () => deleteImgMsgCB(numIndex))
    document.getElementById(`btnAddImgMsg${numIndex}`).addEventListener('click', (event) => {
      event.preventDefault()
      var add = {
        message: { message_bag_id: bagId, message_value: document.getElementById(`imgMgsCustom${numIndex}`).value, message_type: "img_msg", img_value: document.getElementById(`imgValueMsgNum${numIndex}`).value }
      }
      api.post(`/api/v1/message_managements/messages`, add).then(res => {
        console.log(res)
        setIsOpenNoti(true)
        setTimeout(() => {
          setMsgNoti("Add Successfully")
        }, 1500)
        
        setTimeout(function () {
          setIsOpenNoti(false)
        }, 2000);
        reloadMessMsgBag()
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

  function renameMagBag(){
    var path = window.location.pathname;
    var newBag = document.getElementById("rename_bag").value
    if (utils.checkFieldAdd(newBag, "MsgBag") == true) {
      var newBagAdd = { message_group: { group_name: newBag } }
      api.patch(`/api/v1/message_managements/message_groups/${idMsgRenameGr}`, newBagAdd).then(res => {
        setIsOpenRenameMsgBag(false)
        console.log(res)
        setMsgNoti("Update Group name successfully!")
        setIsOpenNoti(true)
        setTimeout(() => {
          setIsOpenNoti(false)
        }, 1500)
        setTimeout(() => {
          window.location.reload()
        }, 1500)
        
      }).catch(error => {
        alert(error)
        console.log(error)
      })
    }
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
    console.log("pp: ", past_post)

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

  function setUpPP() {

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
                          <div style={{ width: "30%" }}>
                            <h5 id="jjjj">メッセージグループ</h5>
                            <div>
                              <Button style={{ fontSize: "10px", marginTop: "-5%" }} onClick={() => setIsOpenAddChatbot(true)}>グループ追加</Button><br />
                              <Nav className="sidebar-wrapper">
                                <ul style={{ listStyleType: "none", width: "100%" }}>
                                  {itemGroup.map((data, key) => {
                                    return (
                                      <li style={{ marginLeft: "-30px", display: "flex" }} key={key}>
                                        <Nav id="nav_option" style={{ width: "90%" }}>
                                          <i className="nc-icon nc-bell-55" style={{ color: "black" }} />
                                          <p id="a_tag" style={{ fontSize: "15px" }} onClick={() => getMessage(data.id)}>&nbsp;&nbsp;{data.group_name}</p>
                                          <ul id="ulMesBag" style={{ listStyleType: "none", width: "100%" }}>
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
                                        <Button style={{ height: '30px', width: "10%", padding: '0', margin: "0px 5px 0px 0px", backgroundColor: "#FFFFFF" }}
                                          onClick={() => addMsgBagPop(data.id)}><i className="nc-icon nc-simple-add nc-3x" style={{ color: "black" }} /></Button>
                                          <Button style={{ height: '30px', width: "10%", padding: '0', margin: "0px 5px 0px 0px", backgroundColor: "#FFFFFF" }}
                                          onClick={() => renameMsgBagPop(data.id)}><i className="nc-icon nc-single-copy-04 nc-3x" style={{ color: "black" }} /></Button>
                                        <Button style={{ height: '30px', width: "10%", padding: '0', margin: "0px 5px 0px 0px", backgroundColor: "#FFFFFF" }}
                                          onClick={() => addMsgBagPop(data.id)}><i className="nc-icon nc-box nc-3x" style={{ color: "black" }} /></Button>
                                      </li>
                                    )
                                  })}
                                </ul>
                              </Nav>
                            </div>
                          </div>
                          <div style={{ width: "55%" }} id="abczyz">
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
              <input id="new_chatbot" style={{ width: "100%" }} onBlur={(e) => utils.checkFieldAdd(e.target.value, "Chatbot")} name="chatbot_name"></input>
              <label id="newChatbotErrMsg" style={{ display: 'none', color: "red" }}></label>
            </label><br />
            <Button onClick={() => addChatBot()}>グループ追加</Button>
          </div>
        </ModalShort>
        <ModalShort open={isOpenAddMsgBag} onClose={() => setIsOpenAddMsgBag(false)}>
          <div style={{ width: "300px", textAlign: "center", color: "#51cbce" }}>
            <h4>メッセージ袋名入力</h4>
            <label style={{ width: "100%" }}>
              <input id="new_bag" style={{ width: "100%" }} onBlur={(e) => utils.checkFieldAdd(e.target.value, "MsgBag")} name="chatbot_name"></input>
              <label id="newMsgBagErrMsg" style={{ display: 'none', color: "red" }}></label>
            </label><br />
            <Button onClick={() => addMagBag()}>メッセージ袋追加</Button>
          </div>
        </ModalShort>
        <ModalShort open={isOpenRenameMsgBag} onClose={() => setIsOpenRenameMsgBag(false)}>
          <div style={{ width: "300px", textAlign: "center", color: "#51cbce" }}>
            <h4>Rename Message Group</h4>
            <label style={{ width: "100%" }}>
              <input id="rename_bag" style={{ width: "100%" }} onBlur={(e) => utils.checkFieldAdd(e.target.value, "MsgBag")} name="chatbot_name"></input>
              <label id="newMsgBagErrMsg" style={{ display: 'none', color: "red" }}></label>
            </label><br />
            <Button onClick={() => renameMagBag()}>Rename</Button>
          </div>
        </ModalShort>
        <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
          <div style={{ width: "300px", textAlign: "center", color: "#51cbce" }}>
            <h4>{msgNoti}</h4>
          </div>
        </ModalNoti>
        <Modal open={isOpenSelectPastPost} onClose={() => setIsOpenSelectPastPost(false)}>
          <div style={{ width: "700px", textAlign: "center", color: "#51cbce" }}>
            <h4>Select past post</h4>
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
            <h4>Select past post</h4>
            <div className="grid-container">
              {pastPostList.map((pp, i) => (
                <div onClick={() => upPP(pp.media_url, pp.id)} className="grid-item" style={{ width: "200px" }} key={i}>
                  <img style={{ height: "100px" }} src={pp.media_url}></img>
                </div>
              ))}
            </div>

          </div>
        </Modal>

      </div>
    </>
  );
}

export default Chatbot;
