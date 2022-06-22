import React, { useState } from "react";
import { Dropdown, DropdownButton, Nav, NavLink } from "react-bootstrap";
import NotificationAlert from "react-notification-alert";
import {
  UncontrolledAlert,
  Alert,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  NavbarBrand,
} from "reactstrap";
import api from '../api/api-management'
import requestNewToken from "api/request-new-token";
import ModalShort from "./Popup/ModalShort";
import * as utils from './../JS/client.js'
import ChatbotOption from "./ChatbotElement/ChatbotOption.jsx";
import ModalNoti from "./Popup/ModalNoti";

function Chatbot() {
  const [groupList, setGroupList] = useState([])
  const [messageBag, setMessageBag] = useState([])
  const [idMsgB, setIdmsgB] = useState()
  const [isOpenNoti, setIsOpenNoti] = useState()
  const [msgNoti, setMsgNoti] = useState()
  const [idList, setIdList] = useState([])
  const [idMsgGr, setIdMsgGr] = useState()

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



  ///bo comment ben tren

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

  function getBagMsg(group, id) {//
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
      setMsgCBNum(bagMsg[bagMsg.length - 1].id)
      setImgCBNum(bagMsg[bagMsg.length - 1].id)
      setImgCBNum(bagMsg[bagMsg.length - 1].id)
      bagMsg.forEach((item) => {
        if (item.message_type == "msg") {
          var abc = document.createElement("div")
          document.getElementById("div_custom").appendChild(abc)
          abc.innerHTML =
            `<div id="chatbot_message${item.id}" style=" border-radius: 20px; display:block; background-color: #f4f3ef; padding: 40px; margin-top: 20px; text-align: center" >
              <div><textarea name="messageKey${item.id}" class="mgsChatbot" id="mgsCustomKey${item.id}" placeholder="Please input key..." type="text" rows="3"></textarea></div><br />
              <div><textarea name="messagesVa${item.id}" class="mgsChatbot" id="mgsCustom${item.id}" placeholder="Please input answer message..." type="text" rows="3"></textarea></div>
              <div id="btnDelMsg${item.id}" style="float:right; display:none">
              <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
                font-weight:800">Delete</button>
              </div>
            </div>`
          document.getElementById(`mgsCustomKey${item.id}`).textContent = item.received_message
          document.getElementById(`mgsCustom${item.id}`).textContent = item.message_value

          document.getElementById(`mgsCustom${item.id}`).addEventListener('change', (e) => msgOV(e.target.value))
          document.getElementById(`mgsCustomKey${item.id}`).addEventListener('change', (e) => msgOVkey(e.target.value))
          document.getElementById(`mgsCustom${item.id}`).addEventListener('change', () => { document.getElementById(`btnDelMsg${item.id}`).style.display = 'block' })
          document.getElementById(`btnDelMsg${item.id}`).addEventListener('click', () => deleteMsgCB(item.id))


          var element2 = document.getElementById(`msgOVIKey${item.id}`)
          if (typeof (element2) != 'undefined' && element2 != null) {
            // Exists.
            document.getElementById(`msgOVIKey${item.id}`).value = item.received_message
          } else if (element2 === null) {
            var abc = document.createElement(`div`)
            document.getElementById('logUserDiv').appendChild(abc)
            abc.innerHTML =
              `<div id="ovMsgKey${item.id}" style="width: 70%; background-color: #51cbce; padding: 10px; float:left; margin:5px; display:block; border-radius: 10px">
                <input type="text" id="msgOVIKey${item.id}" style="background-color: #51cbce; border: none" readonly/>
               </div>`
            document.getElementById(`msgOVIKey${item.id}`).value = item.received_message;
          }

          var element1 = document.getElementById(`msgOVI${item.id}`)
          if (typeof (element1) != 'undefined' && element1 != null) {
            // Exists.
            document.getElementById(`msgOVI${item.id}`).value = item.message_value
          } else if (element1 === null) {
            var abc = document.createElement(`div`)
            document.getElementById('logUserDiv').appendChild(abc)
            abc.innerHTML =
              `<div id="ovMsg${item.id}" style="width: 70%; background-color: #51cbce; padding: 10px; margin:5px; display:block; float: right; border-radius: 10px">
                <input type="text" id="msgOVI${item.id}" style="text-align: right; background-color: #51cbce; border: none" readonly/>
               </div> `
            document.getElementById(`msgOVI${item.id}`).value = item.message_value

          }
        } else if (item.message_type == "img") {
          var abc = document.createElement("div")
          document.getElementById("div_custom").appendChild(abc)
          abc.innerHTML =
            `<div id="chatbot_image${item.id}" style="border-radius: 20px; margin-top: 20px; display:block; background-color: rgb(244, 243, 239); padding: 40px; ">
            <div><textarea name="imgKey${item.id}" class="mgsChatbot" id="imgCustomKey${item.id}" placeholder="Please input key..." type="text" rows="3"></textarea></div><br />
          <input id="imgNum${item.id}" name="imageChatbot" type="file" accept="image/*" />
          <input id="imgDataNum${item.id}" name="imgchatbot${item.id}" type=hidden /> <br /><br />
          <div style=" text-align: center" }}>
            <img id="output${item.id}" style=" max-height: 200px; max-width: 40%" }} />
          </div>
          <div id="btnDelImg${item.id}" style="float:right;">
              <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
              font-weight:800">Delete</button>
            </div>
        </div>`
          document.getElementById(`imgNum${item.id}`).addEventListener('change', (e) => loadFile(e))
          document.getElementById(`btnDelImg${item.id}`).addEventListener('click', () => deleteImgCB(item.id))

        }


        // bagMsg.forEach((item) => {

        // })
      })
      // var bagItem = []
      // for (var i = 0; i < bagMsg.length; i++) {
      //   bagItem.push(res.data.data[i].id)
      //   // 
      // }
      console.log(bagMsg)
    }).catch(error => {
      console.log(error)
      if (error.response.data.code === 3) {
        requestNewToken(path)
      }
    })
  }

  function getMessage(idIn) {
    console.log(idList)
    var path = window.location.pathname;
    api.get(`/api/v1/message_managements/message_groups/${idIn}`).then(res => {
      var bag = []
      var idMsgbag = []
      console.log('message: ', res.data.data)
      for (var i = 0; i < res.data.data.message_bags.length; i++) {
        bag.push(res.data.data.message_bags[i].bag_name)
        idMsgbag.push(res.data.data.message_bags[i].id)
      }
      console.log("idMsgbag: ", idMsgbag)
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
        var abc = document.createElement('div')
        abc.setAttribute('id', `msgBag_item_${idIn}_${idd}`)
        document.getElementById(`msg_group${idIn}_id${idd}`).addEventListener('click', () => { getBagMsg(idIn, idd) })
        document.getElementById(`msg_group_div${idIn}_id${idd}`).addEventListener('click', () => {
          document.getElementById(`msg_group${idIn}_id${idd}`).appendChild(abc)
          abc.innerHTML = `<div id="itemMsg_${idIn}_${idd}">
            <div class="dropdown-content">
              <button style="border:none; border-radius:10px; background-color: #66615b; color:white; font-size:13px">Rename</button>
              <button style="border:none; border-radius:10px; background-color: #66615b; color:white; font-size:13px">Delete</button>
              <button id="cancelBtn${idIn}_${idd}" style="border:none; border-radius:10px; background-color: #66615b; color:white; font-size:13px">Cancel</button>
            </div>
          </div>`
          document.getElementById(`msgBag_item_${idIn}_${idd}`).removeAttribute('hidden')

          document.getElementById(`cancelBtn${idIn}_${idd}`).addEventListener('click', () => {
            document.getElementById(`msgBag_item_${idIn}_${idd}`).setAttribute("hidden", true)
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

  const [nameChatbot, setNameChatbot] = useState()
  const [temp, setTemp] = useState()
  const [idImg, setImg] = useState()
  const [imgCBNum, setImgCBNum] = useState(0)
  const [msgCBNum, setMsgCBNum] = useState(0)
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
    console.log(element)
    if (typeof (element) != 'undefined' && element != null) {
      // Exists.
      var output2 = document.getElementById(`outputOV${num}`);
      console.log("output2", output2)
      output2.src = imgUrl
    } else if (element === null) {
      var abc = document.createElement(`div`)
      console.log("div_num: ", num)
      document.getElementById('logUserDiv').appendChild(abc)
      abc.innerHTML = `<img id="outputOV${num}" style= "max-height: 200px; display: block; margin:5px; max-width: 65%; float:right" /> `
      var output2 = document.getElementById(`outputOV${num}`);
      output2.src = imgUrl
    }
    setImgCBNum(num)
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
    console.log(element)
    if (typeof (element) != 'undefined' && element != null) {
      // Exists.
      var output2 = document.getElementById(`outputImgMsgOV${num}`);
      output2.src = imgUrl
    } else if (element === null) {
      var abc = document.createElement(`div`)
      console.log("div_num: ", num)
      document.getElementById('logUserDiv').appendChild(abc)
      abc.innerHTML = `<img id="outputImgMsgOV${num}" style= "max-height: 200px; display: block; margin:5px; max-width: 65%; float:right" /> `
      var output2 = document.getElementById(`outputImgMsgOV${num}`);
      output2.src = imgUrl
    }
    setImgMsgCBNum(num)
  };

  function imgMsgOV(msg) {

    var num = parseInt(imgMsgCBNum) + 1
    console.log("imgMsgOV: ", num)
    var element = document.getElementById(`imgMsgOVI${num}`)
    console.log(element)
    if (typeof (element) != 'undefined' && element != null) {
      // Exists.
      document.getElementById(`imgMsgOVI${num}`).value = msg
    } else if (element === null) {
      var abc = document.createElement(`div`)
      document.getElementById('logUserDiv').appendChild(abc)
      abc.innerHTML =
        `<div id="ovMsgCB${num}" style="width: 70%; background-color: #51cbce; padding: 10px; margin:5px; display:block; float: right; border-radius: 10px">
      <input type="text" id="imgMsgOVI${num}" style="text-align: right; background-color: #51cbce; border: none" readonly/>
      </div> `
      document.getElementById(`imgMsgOVI${num}`).value = msg;
      setImgMsgCBNum(num)
    }
  }

  function msgOV(msg) {
    console.log(msg)
    var num = parseInt(msgCBNum) + 1

    var element = document.getElementById(`msgOVI${num}`)
    console.log(element)
    if (typeof (element) != 'undefined' && element != null) {
      // Exists.
      document.getElementById(`msgOVI${num}`).value = msg
    } else if (element === null) {
      var abc = document.createElement(`div`)
      document.getElementById('logUserDiv').appendChild(abc)
      abc.innerHTML =
        `<div id="ovMsg${num}" style="width: 70%; background-color: #51cbce; padding: 10px; margin:5px; display:block; float: right; border-radius: 10px">
      <input type="text" id="msgOVI${num}" style="text-align: right; background-color: #51cbce; border: none" readonly/>
      </div> `
      document.getElementById(`msgOVI${num}`).value = msg;
      document.getElementById(`mgsCustom${num}`).value = msg;
    }
    setMsgCBNum(num)
  }

  function msgOVkey(msg) {
    console.log(msg)
    var num = parseInt(msgCBNum) + 1

    var element = document.getElementById(`msgOVIKey${num}`)
    console.log(element)
    if (typeof (element) != 'undefined' && element != null) {
      // Exists.
      document.getElementById(`msgOVIKey${num}`).value = msg
    } else if (element === null) {
      var abc = document.createElement(`div`)
      document.getElementById('logUserDiv').appendChild(abc)
      abc.innerHTML =
        `
        <div id="ovMsgKey${num}" style="width: 70%; background-color: #51cbce; padding: 10px; float:left; margin:5px; display:block; border-radius: 10px">
      <input type="text" id="msgOVIKey${num}" style="background-color: #51cbce; border: none" readonly/>
      </div>`
      document.getElementById(`msgOVIKey${num}`).value = msg;
      document.getElementById(`mgsCustomKey${num}`).value = msg;
    }
    setMsgCBNum(num)
  }


  function addImgChatbot() {
    var numIndex = parseInt(imgCBNum) + 1
    var abc = document.createElement("div")
    document.getElementById("div_custom").appendChild(abc)
    abc.innerHTML =
      `<div id="chatbot_image${numIndex}" style="border-radius: 20px; margin-top: 20px; display:block; background-color: rgb(244, 243, 239); padding: 40px; ">
      <div><textarea name="imgKey${numIndex}" class="mgsChatbot" id="imgCustomKey${numIndex}" placeholder="Please input key..." type="text" rows="3"></textarea></div><br />
    <input id="imgNum${numIndex}" name="imageChatbot" type="file" accept="image/*" />
    <input id="imgDataNum${numIndex}" name="imgchatbot${numIndex}" type=hidden /> <br /><br />
    <div style=" text-align: center" }}>
      <img id="output${numIndex}" style=" max-height: 200px; max-width: 40%" }} />
    </div>
    <div id="btnDelImg${numIndex}" style="float:right;">
        <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
        font-weight:800">Delete</button>
      </div>
  </div>`
    // document.getElementById(`btnDelImg${numIndex}`).style.display='none'
    document.getElementById(`imgNum${numIndex}`).addEventListener('change', (e) => loadFile(e))
    // document.getElementById(`imgNum${numIndex}`).addEventListener('change', () => { document.getElementById(`btnDelImg${numIndex}`).style.display = 'block' })
    document.getElementById(`btnDelImg${numIndex}`).addEventListener('click', () => deleteImgCB(numIndex))
  }

  function addMsgChatbot() {
    var numIndex = parseInt(msgCBNum) + 1
    var abc = document.createElement("div")
    document.getElementById("div_custom").appendChild(abc)
    abc.innerHTML =
      `<div id="chatbot_message${numIndex}" style=" border-radius: 20px; display:block; background-color: #f4f3ef; padding: 40px; margin-top: 20px; text-align: center" >
    <div><textarea name="messageKey${numIndex}" class="mgsChatbot" id="mgsCustomKey${numIndex}" placeholder="Please input key..." type="text" rows="3"></textarea></div><br />
    <div><textarea name="messagesVa${numIndex}" class="mgsChatbot" id="mgsCustom${numIndex}" placeholder="Please input answer message..." type="text" rows="3"></textarea></div>
    <div id="btnDelMsg${numIndex}" style="float:right; display:none">
        <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
        font-weight:800">Delete</button>
      </div>
    </div>`
    document.getElementById(`mgsCustom${numIndex}`).addEventListener('change', (e) => msgOV(e.target.value))
    document.getElementById(`mgsCustomKey${numIndex}`).addEventListener('change', (e) => msgOVkey(e.target.value))
    document.getElementById(`mgsCustom${numIndex}`).addEventListener('change', () => { document.getElementById(`btnDelMsg${numIndex}`).style.display = 'block' })
    document.getElementById(`btnDelMsg${numIndex}`).addEventListener('click', () => deleteMsgCB(numIndex))

  }

  function addImgMsgChatbot() {
    var numIndex = parseInt(imgMsgCBNum) + 1
    var abc = document.createElement("div")
    document.getElementById("div_custom").appendChild(abc)
    abc.innerHTML =
      `<div id="chatbot_image_msg${numIndex}" style="border-radius: 20px; margin-top: 20px; background-color: rgb(244, 243, 239); padding: 40px; ">
      <div><textarea name="imgMsgKey${numIndex}" class="mgsChatbot" id="imgMgsCustomKey${numIndex}" placeholder="Please input key..." type="text" rows="3"></textarea></div><br />
    <input id="imgMsgNum${numIndex}" type="file" accept="image/*" /> <br /><br />
    <input id="imgValueMsgNum${numIndex}" name="imgValueMsgChatbot${numIndex}" type=hidden /> <br /><br />
    <div style=" text-align: center" }}>
      <img id="outputImgMsg${numIndex}" style=" max-height: 200px; max-width: 40%" }} />
    </div>
    <div style="text-align: center">
    <textarea class="mgsChatbot" id="imgMgsCustom${numIndex}" name="imgMsgValueChatbot${numIndex}" placeholder="Please input message..." type="text" rows="3"></textarea>
    </div>
    <div id="btnDelImgMsg${numIndex}" style="float:right; display:none">
        <button style="width:75px; border-radius:10px; background-color: #f17e5d; border: none; color: #fff;
        font-weight:800">Delete</button>
      </div>
  </div>`

    console.log(document.getElementById(`outputImgMsg${numIndex}`))
    document.getElementById(`imgMsgNum${numIndex}`).addEventListener('change', (e) => loadFileImgMsg(e))
    document.getElementById(`imgMgsCustom${numIndex}`).addEventListener('change', (e) => imgMsgOV(e.target.value))
    document.getElementById(`imgMsgNum${numIndex}`).addEventListener('change', () => { document.getElementById(`btnDelImgMsg${numIndex}`).style.display = 'block' })
    document.getElementById(`imgMgsCustom${numIndex}`).addEventListener('change', () => { document.getElementById(`btnDelImgMsg${numIndex}`).style.display = 'block' })
    document.getElementById(`btnDelImgMsg${numIndex}`).addEventListener('click', () => deleteImgMsgCB(numIndex))
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
    elementOV.remove()
  }

  function deleteImgMsgCB(idDelete) {
    console.log('id delete: ', idDelete)
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
    var type = []
    for (var i = 0; i < elements.length - 1; i++) {
      var item = elements.item(i);
      // obj[item.name] = item.value;
      if (item.name.includes(`Key`)) {
        if (item.name.includes(`messageKey`)) {
          // key.push({[item.name]: item.value})
          key.push(item.value)
          type.push('msg')
          // obj.key =[]
        } else if (item.name.includes(`imgKey`)) {
          // key.push({[item.name]: item.value})
          key.push(item.value)
          type.push('img')
          // obj.key =[]
        } else if (item.name.includes(`imgMsgKey`)) {
          key.push(item.value)
          type.push('img_msg')
        }
      }

      // else if(item.name.includes(`imgchatbot`)){
      //   value.push(item.value)

      // }
      else {
        if (item.name.includes(`messagesVa`)) {
          // value.push({[item.name]: item.value})
          value.push(item.value)
          img_value.push('')
        } else if (item.name.includes(`imgchatbot`)) {
          // key.push({[item.name]: item.value})
          // key.push('imgchatbot')
          img_value.push(item.value)
          value.push('')
          // obj.key =[]
        } else if (item.name.includes(`imgValueMsgChatbot`)) {
          img_value.push(item.value)
        } else if (item.name.includes(`imgMsgValueChatbot`)) {
          value.push(item.value)
        }

      }
    }
    console.log(obj)
    key.forEach((ele, index) => {
      // var type
      // if(key[index].includes('imgchatbot')){
      //   type = 'img'
      // }else {
      //   type = 'msg'
      // }
      obj[ele] = { "message_bag_id": "1", message_type: type[index], received_message: key[index], message_value: value[index], img_value: img_value[index] }
    })
    var script = { messages: Object.values(obj) }

    // console.log(JSON.stringify(script))
    var newScript = JSON.stringify(script)
    console.log(newScript)



    api.post(`/api/v1/message_managements/messages`, script).then(res => {
      setMsgNoti("メッセージを追加しました。")
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
        setMsgNoti("Add new chatbot successfully")
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

  function addMagBag() {
    var path = window.location.pathname;
    var newBag = document.getElementById("new_bag").value
    if (utils.checkFieldAdd(newBag, "MsgBag") == true) {
      var newBagAdd = { message_bag: { message_group_id: idMsgGr, bag_name: newBag } }
      api.post(`/api/v1/message_managements/message_bags`, newBagAdd).then(res => {
        setIsOpenAddMsgBag(false)
        setMsgNoti("Add new bag successfully")
        setIsOpenNoti(true)
        setTimeout(() => {
          setIsOpenNoti(false)
          window.location.reload()
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
                            <h5 id="jjjj">Chatbot-management</h5>
                            <div>
                              <Button style={{ fontSize: "10px", marginTop: "-5%" }} onClick={() => setIsOpenAddChatbot(true)}>Add Chatbot</Button><br />
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
                                        <Button style={{ height: '30px', width: "10%", padding: '0', margin: "0px 10px 0px 0px", backgroundColor: "#838383" }}
                                          onClick={() => addMsgBagPop(data.id)}><i className="nc-icon nc-simple-add" style={{ color: "black" }} /></Button>
                                      </li>
                                    )
                                  })}
                                </ul>
                              </Nav>
                            </div>
                          </div>
                          <div style={{ width: "55%" }} id="abczyz">
                            <h5>Design Chatbot</h5>
                            {/* <div> */}
                            <h6>Option</h6>
                            <div style={{ display: "flex" }}>
                              <button style={{ width: "100px", height: "80px", backgroundColor: "#f4f3ef", borderRadius: "20px", textAlign: "center", marginLeft: "10px" }}
                                onClick={() => addImgChatbot()}>
                                <i className="nc-icon nc-image" style={{ color: "black", fontSize: "20px", fontWeight: "100", paddingTop: "5px", paddingBottom: "10px" }} /><br />
                                Image
                              </button>
                              <button style={{ width: "100px", height: "80px", backgroundColor: "#f4f3ef", borderRadius: "20px", textAlign: "center", marginLeft: "10px" }}
                                onClick={() => addMsgChatbot()}>
                                <i className="nc-icon nc-chat-33" style={{ color: "black", fontSize: "20px", fontWeight: "100", paddingTop: "5px", paddingBottom: "10px" }} /><br />
                                Message
                              </button>
                              <button style={{ width: "100px", height: "80px", backgroundColor: "#f4f3ef", borderRadius: "20px", textAlign: "center", marginLeft: "10px" }}
                                onClick={() => addImgMsgChatbot()}>
                                <i className="nc-icon nc-single-copy-04" style={{ color: "black", fontSize: "20px", fontWeight: "100", paddingTop: "5px", paddingBottom: "10px" }} /><br />
                                Image Message
                              </button>
                              <button style={{ width: "100px", height: "80px", backgroundColor: "#f4f3ef", borderRadius: "20px", textAlign: "center", marginLeft: "10px" }}>
                                <i className="nc-icon nc-box" style={{ color: "black", fontSize: "20px", fontWeight: "100", paddingTop: "5px", paddingBottom: "10px" }} /><br />
                                Past posts
                              </button>
                              <button style={{ width: "100px", height: "80px", backgroundColor: "#f4f3ef", borderRadius: "20px", textAlign: "center", marginLeft: "10px" }}>
                                <i className="nc-icon nc-layout-11" style={{ color: "black", fontSize: "20px", fontWeight: "100", paddingTop: "5px", paddingBottom: "10px" }} /><br />
                                Profile message
                              </button>
                            </div>
                            <div id="custom" style={{ paddingTop: "50px" }}>
                              <h6>Custom</h6>
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
                              <Button style={{ float: "right" }} id="btnAddScript" onClick={addScript}> Add script</Button>
                            </div>
                            {/* </div> */}
                          </div>
                          <div style={{ width: "25%" }}>
                            <h5>Overview</h5>

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
            <h4>Enter chatbot name</h4>
            <label style={{ width: "100%" }}>
              <input id="new_chatbot" style={{ width: "100%" }} onBlur={(e) => utils.checkFieldAdd(e.target.value, "Chatbot")} name="chatbot_name"></input>
              <label id="newChatbotErrMsg" style={{ display: 'none', color: "red" }}></label>
            </label><br />
            <Button onClick={() => addChatBot()}>Add Chatbot Group</Button>
          </div>
        </ModalShort>
        <ModalShort open={isOpenAddMsgBag} onClose={() => setIsOpenAddMsgBag(false)}>
          <div style={{ width: "300px", textAlign: "center", color: "#51cbce" }}>
            <h4>Enter message bag name</h4>
            <label style={{ width: "100%" }}>
              <input id="new_bag" style={{ width: "100%" }} onBlur={(e) => utils.checkFieldAdd(e.target.value, "MsgBag")} name="chatbot_name"></input>
              <label id="newMsgBagErrMsg" style={{ display: 'none', color: "red" }}></label>
            </label><br />
            <Button onClick={() => addMagBag()}>Add Message Bag</Button>
          </div>
        </ModalShort>
        <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
          <div style={{ width: "300px", textAlign: "center", color: "#51cbce" }}>
            <h4>{msgNoti}</h4>
          </div>
        </ModalNoti>
      </div>
    </>
  );
}

export default Chatbot;
