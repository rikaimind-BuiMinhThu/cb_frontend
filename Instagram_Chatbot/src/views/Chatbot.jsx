
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
import ModalShort from "./Popup/ModalShort";
import * as utils from './../JS/client.js'
import ChatbotOption from "./ChatbotElement/ChatbotOption.jsx";

function Chatbot() {

  const [isOpenAddChatbot, setIsOpenAddChatbot] = useState(false)

  const [nameChatbot, setNameChatbot] = useState()
  const [temp, setTemp] = useState()
  const [idImg, setImg] = useState()
  const [chatbotMessage, setChatbotMessage] = useState([
    {
      id: 1,
      msg: "message 1"
    },
    {
      id: 2,
      msg: "message 2"
    },
    {
      id: 3,
      msg: "message 3"
    }
  ])
  const [data, setData] = useState([
    {
      id: 1,
      name: "chatbot 1"
    },
    {
      id: 2,
      name: "chatbot 2"
    },
    {
      id: 3,
      name: "chatbot 3"
    },
  ])
  const [data2, setData2] = useState([
    {
      id: 1,
      name: "Group 2 chatbot 21"
    },
    {
      id: 2,
      name: "Group 2 chatbot 22"
    },
    {
      id: 3,
      name: "Group 2 chatbot 23"
    },
  ])
  const [data3, setData3] = useState([
    {
      id: 1,
      name: "Group 3 chatbot 31"
    },
    {
      id: 2,
      name: "Group 3 chatbot 32"
    },
    {
      id: 3,
      name: "Group 3 chatbot 33"
    },
  ])

  const [messageGroup, setMessageGroup] = useState([
    {
      id: 1,
      name: "Group 1",
      group: [{
        id: 1,
        name: "Group 1 chatbot 1"
      },
      {
        id: 2,
        name: "Group 1 chatbot 2"
      },
      {
        id: 3,
        name: "Group 1 chatbot 3"
      },]
    },
    {
      id: 2,
      name: "Group 2",
      group: data2
    },
    {
      id: 3,
      name: "Group 3",
      group: data3
    },
  ])

  const [imgCBNum, setImgCBNum] = useState(0)
  const [msgCBNum, setMsgCBNum] = useState(0)
  const [imgMsgCBNum, setImgMsgCBNum] = useState(0)

  console.log(messageGroup[0].group[0].name)

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
    alert(name)
  }

  //Call to API delete chatbot
  function deleteChatbot(data) {
    alert(data)
  }

  function setChatMessageValue(id, value) {
    const arr = [...chatbotMessage]
    arr[id - 1] = { ...arr[id - 1], msg: value }
    setChatbotMessage(arr)
    // setChatbotMessage[0].msg("abc")
    console.log(chatbotMessage[0].msg)
  }



  var usersDiv = [];


  function loadFile(event) {
    var num = parseInt(imgCBNum) + 1
    console.log("numIn: ", num)
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
    var num = parseInt(imgCBNum) + 1
    console.log("numIn: ", num)
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

  function imgMsgOV(msg){
    console.log(msg)
    var num = parseInt(msgCBNum) + 1

    var element = document.getElementById(`imgMsgOVI${num}`)
    console.log(element)
    if (typeof (element) != 'undefined' && element != null) {
      // Exists.
      document.getElementById(`imgMsgOVI${num}`).value=msg
    } else if (element === null) {
      var abc = document.createElement(`div`)
      document.getElementById('logUserDiv').appendChild(abc)
      abc.innerHTML = 
      `<div id="ovMsg${msgCBNum}" style="width: 70%; background-color: #51cbce; padding: 10px; margin:5px; display:block; float: right; border-radius: 10px">
      <input type="text" name="" id="imgMsgOVI${num}" style="text-align: right; background-color: #51cbce; border: none" readonly/>
      </div> `
      document.getElementById(`imgMsgOVI${num}`).value=msg;
      setMsgCBNum(num)
    }
  }

  function msgOV(msg){
    console.log(msg)
    var num = parseInt(msgCBNum) + 1

    var element = document.getElementById(`msgOVI${num}`)
    console.log(element)
    if (typeof (element) != 'undefined' && element != null) {
      // Exists.
      document.getElementById(`msgOVI${num}`).value=msg
    } else if (element === null) {
      var abc = document.createElement(`div`)
      document.getElementById('logUserDiv').appendChild(abc)
      abc.innerHTML = 
      `<div id="ovMsg${msgCBNum}" style="width: 70%; background-color: #51cbce; padding: 10px; margin:5px; display:block; float: right; border-radius: 10px">
      <input type="text" name="" id="msgOVI${num}" style="text-align: right; background-color: #51cbce; border: none" readonly/>
      </div> `
      document.getElementById(`msgOVI${num}`).value=msg;
      setMsgCBNum(num)
    }
  }

  function addImgChatbot() {
    var numIndex = parseInt(imgCBNum) + 1
    var abc = document.createElement("div")
    document.getElementById("div_custom").appendChild(abc)
    abc.innerHTML =
      `<div id="chatbot_image${numIndex}" style="border-radius: 20px; margin-top: 20px; background-color: rgb(244, 243, 239); padding: 20px; ">
    <input id="imgNum${numIndex}" type="file" accept="image/*" /> <br /><br />
    <div style=" text-align: center" }}>
      <img id="output${numIndex}" style=" max-height: 200px; max-width: 40%" }} />
    </div>
  </div>`
    document.getElementById(`imgNum${numIndex}`).addEventListener('change', (e) => loadFile(e))
  }

  function addMsgChatbot() {
    var numIndex = parseInt(msgCBNum) + 1
    var abc = document.createElement("div")
    document.getElementById("div_custom").appendChild(abc)
    abc.innerHTML =
      `<div id="chatbot_message" style=" border-radius: 20px; background-color: #f4f3ef; padding: 20px; margin-top: 20px; text-align: center" >
    <textarea name="message" class="mgsChatbot" id="mgsCustom${numIndex}" placeholder="Please input message..." type="text" rows="3"></textarea>
    </div>`
    document.getElementById(`mgsCustom${numIndex}`).addEventListener('change', (e) => msgOV(e.target.value))

  }

  function addImgMsgChatbot(){
    var numIndex = parseInt(imgMsgCBNum) + 1
    var abc = document.createElement("div")
    document.getElementById("div_custom").appendChild(abc)
    abc.innerHTML =
      `<div id="chatbot_image_msg${numIndex}" style="border-radius: 20px; margin-top: 20px; background-color: rgb(244, 243, 239); padding: 20px; ">
    <input id="imgMsgNum${numIndex}" type="file" accept="image/*" /> <br /><br />
    <div style=" text-align: center" }}>
      <img id="outputImgMsg${numIndex}" style=" max-height: 200px; max-width: 40%" }} />
    </div>
    <div style="text-align: center">
    <textarea name="message" class="mgsChatbot" id="imgMgsCustom${numIndex}" placeholder="Please input message..." type="text" rows="3"></textarea>
    </div>
  </div>`
    document.getElementById(`imgMsgNum${numIndex}`).addEventListener('change', (e) => loadFileImgMsg(e))
    document.getElementById(`imgMgsCustom${numIndex}`).addEventListener('change', (e) => imgMsgOV(e.target.value))
  }


  // function overViewImg(){
  //   // return(temp)  
  // }

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
                          <div style={{ width: "20%" }}>
                            <h5 id="jjjj">Chatbot-management</h5>
                            <div>
                              <Button style={{ fontSize: "10px", marginTop: "-5%" }} onClick={() => setIsOpenAddChatbot(true)}>Add Chatbot</Button><br />
                              <Nav className="sidebar-wrapper">
                                <ul style={{ listStyleType: "none", width: "100%" }}>
                                  {messageGroup.map((data, key) => {
                                    return (
                                      <li style={{ marginLeft: "-30px" }} key={key}>
                                        <Nav id="nav_option">
                                          <i className="nc-icon nc-bell-55" style={{ color: "black" }} />
                                          <a id="a_tag" href="">&nbsp;&nbsp;{data.name}</a>
                                          <ul style={{ listStyleType: "none", width: "100%" }}>
                                            <li>
                                              <Nav id="nav_option">
                                                {messageGroup[key].group.map((datagroup, key) => {
                                                  return (
                                                    <ul style={{ listStyleType: "none", width: "150%", marginLeft: "-70px" }}>
                                                      <br />
                                                      <li key={key}>
                                                        <div style={{ display: "flex" }}>
                                                          <i className="nc-icon nc-bell-55" style={{ color: "black" }} />
                                                          <a id="a_tag" href="">&nbsp;&nbsp;{datagroup.name}</a>
                                                          <DropdownButton id="dropdown-basic-button" title={<i className="nc-icon nc-bullet-list-67" style={{ color: "black", float: "right" }} />}>
                                                            <Dropdown.Item onClick={() => renameChatbot(datagroup.name, datagroup.id)}>Rename</Dropdown.Item>
                                                            <Dropdown.Item onClick={() => deleteChatbot(datagroup.id)}>Delete</Dropdown.Item>
                                                          </DropdownButton>
                                                        </div>
                                                      </li>
                                                    </ul>
                                                  )
                                                })}
                                              </Nav>
                                            </li>
                                            <br /><br /><br />
                                          </ul>
                                        </Nav>
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
                            </div>
                            {/* </div> */}
                          </div>
                          <div style={{ width: "25%" }}>
                            <h5>Overview</h5>
                            <div id="logUserDiv" style={{ overflowY:"auto", height: "70%", maxHeight: "600px", maxWidth: "300px", minHeight: "300px", width: "90%", border: "2px solid black", display:'block', borderRadius: "3%", marginLeft: "15%", padding: "5%", textAlign: "right" }}>
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
            <Button style={{ backgroundColor: "#51cbce" }} onClick={addChatbot}>Add</Button>
          </div>
        </ModalShort>
      </div>
    </>
  );
}

export default Chatbot;
