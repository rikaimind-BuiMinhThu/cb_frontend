import React, { useState } from 'react'
import { Button, Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap'
import ava from "./Popup/ava.png";
import insta_img from "./Popup/instagram.jpeg";
import tag_icon from "./Popup/tag_icon.jpeg";
import ModalDetail from "./Popup/ModalDetail";
import "../assets/css/general.css";

import api from '../api/api-management'

import ModalShort from './Popup/ModalShort';
function CRM() {
  const [isOpenDetailUser, setIsOpenDetailUser] = useState(false)

  const [isOpenAddTable, setIsOpenAddTable] = useState(false)
  const [isOpenAddLabel, setIsOpenAddLabel] = useState(false)

  const [listInstagramUser, setListInstagramUser] = useState([])

  React.useEffect(() => {
    // var path = window.location.pathname;
    api.get(`/api/v1/managements/instagram_users`).then(res => {
      console.log("instagram_users: ",res.data.data.instagram_users)
      setListInstagramUser(res.data.data.instagram_users)
    }).catch(error => {
      console.log(error)
    })
  }, [])

  const [instagramUser, setInstagramUser] = useState()
  const [labelinstagramUser, setLabelInstagramUser] = useState([])
  const [historyinstagramUser, setHistoryInstagramUser] = useState([])
  function detailUser(id) {
    setIsOpenDetailUser(true)
    api.get(`/api/v1/managements/instagram_users/${id}`).then(res => {
      console.log("detail instagram_users: ",res.data.data)
      setInstagramUser(res.data.data.instagram_users)
      setLabelInstagramUser(res.data.data.labels)
      var listHistory = []
      var historyLe
      if (res.data.data.message_histories.length < 10) {
        historyLe = res.data.data.message_histories.length
      } else {
        historyLe = 10
      }
      for (var i = 0; i < historyLe; i++) {
        listHistory.push(res.data.data.message_histories[i])
      }
      setHistoryInstagramUser(listHistory)
    }).catch(error => {
      console.log(error)
    })
  }

  var timel = [
    { time: "31/07 17:42", action: "access page", content: "access to page" },
    { time: "31/07 17:42", action: "send message", content: "hi" },
    { time: "31/07 17:42", action: "send message", content: "hello" },
    { time: "31/07 17:42", action: "send message", content: "welcome" },
    { time: "31/07 17:42", action: "send message", content: "morning" },
    { time: "31/07 17:42", action: "send message", content: "afternoon" },
  ]
  var label = ["label1", "label2", "label3", "label4", "label7"]

  var table =
    { title: ["breakfast", "lunch", "dinner", "video web"], value: ["bread", "chicken", "rice", "youtube"] }
  var tableList = []
  for (var i = 0; i < table.title.length; i++) {
    var itemTable = { title: table.title[i], value: table.value[i] }
    tableList.push(itemTable)
  }
  console.log(tableList.length, "length")
  function addTableItem() {
    if (tableList.length == 4) {
      document.getElementById("AddTableButton").style.display = "none"
    }
    setIsOpenAddTable(false)
  }
  function addLabel() {
    var label = document.getElementById("newLabel").value
    checkInputLabel(label)
    if(checkInputLabel(label) == true){
      alert("oke nhe")
    }else{
      alert(" nhe")
    }
  }

  function checkInputLabel(value){
    if(value == ""){
      document.getElementById("newLabelErrMsg").style.display = "block"
      document.getElementById("newLabelErrMsg").innerHTML = "This field cannot be empty"
      document.getElementById("btnAddLbl").disabled = true
    }else if(value.length >20){
      document.getElementById("newLabelErrMsg").style.display = "block"
      document.getElementById("newLabelErrMsg").innerHTML = "Maximum 20 character"
      document.getElementById("btnAddLbl").disabled = true
    }else{
      document.getElementById("newLabelErrMsg").style.display = "none"
      document.getElementById("newLabelErrMsg").innerHTML = ""
      document.getElementById("btnAddLbl").disabled = false
      return true
    }
  }

  

  function checkInputItemTitle(value){
    if(value == ""){
      document.getElementById("newItemTitleErrMsg").style.display = "block"
      document.getElementById("newItemTitleErrMsg").innerHTML = "This field cannot be empty"
      document.getElementById("btnAddItem").disabled = true
    }else if(value.length >20){
      document.getElementById("newItemTitleErrMsg").style.display = "block"
      document.getElementById("newItemTitleErrMsg").innerHTML = "Maximum 20 character"
      document.getElementById("btnAddItem").disabled = true
    }else{
      document.getElementById("newItemTitleErrMsg").style.display = "none"
      document.getElementById("newItemTitleErrMsg").innerHTML = ""
      document.getElementById("btnAddItem").disabled = false
      return true
    }
  }

  function checkInputItemValue(value){
    if(value == ""){
      document.getElementById("newItemValueErrMsg").style.display = "block"
      document.getElementById("newItemValueErrMsg").innerHTML = "This field cannot be empty"
      document.getElementById("btnAddItem").disabled = true
    }else if(value.length >20){
      document.getElementById("newItemValueErrMsg").style.display = "block"
      document.getElementById("newItemValueErrMsg").innerHTML = "Maximum 20 character"
      document.getElementById("btnAddItem").disabled = true
    }else{
      document.getElementById("newItemValueErrMsg").style.display = "none"
      document.getElementById("newItemValueErrMsg").innerHTML = ""
      document.getElementById("btnAddItem").disabled = false
      return true
    }
  }

  return (
    <>
      <div className='content'>
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <h3>Instagram User</h3>
              </CardHeader>
              <CardBody>
                <Table style={{ textAlign: "center", tableLayout: "fixed", overflow: "hidden" }}>
                  <thead className="text-primary">
                    <tr>
                      <th>Username</th>
                      <th>Name</th>
                      <th>Followed Business</th>
                      <th>Followed by Business</th>
                      <th>Created at</th>
                      <th>Updated at</th>
                      <th>View Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listInstagramUser.map((item) => (
                      <tr key={item.id}>
                        <td>{item.username}</td>
                        <td>{item.full_name}</td>
                        <td>{item.is_user_follow_business == true ? "Followed" : "Not followed"}</td>
                        <td>{item.is_business_follow_user == true ? "Followed" : "Not followed"}</td>
                        <td>{((item.created_at).slice(0, 16)).replace("T", " ").replaceAll("-", "/")}</td>
                        <td>{((item.updated_at).slice(0, 16)).replace("T", " ").replaceAll("-", "/")}</td>
                        <td><Button style={{ backgroundColor: "#51cbcd" }} onClick={() => detailUser(item.id)}>Deail</Button></td>
                      </tr>
                    ))}
                    {/* <tr>
                      <td>nghia.hoang</td>
                      <td>nghia.hoang@rikai.technology</td>
                      <td>012345678</td>
                      <td><Button style={{ backgroundColor: "#51cbcd" }} onClick={() => detailUser()}>Deail</Button></td>
                    </tr>
                    <tr>
                      <td>dung.bui</td>
                      <td>dung.bui@rikai.technology</td>
                      <td>012345678</td>
                      <td><Button style={{ backgroundColor: "#51cbcd" }} onClick={() => detailUser()}>Deail</Button></td>
                    </tr>
                    <tr>
                      <td>quan.le</td>
                      <td>quan.le@rikai.technology</td>
                      <td>012345678</td>
                      <td><Button style={{ backgroundColor: "#51cbcd" }} onClick={() => detailUser()}>Deail</Button></td>
                    </tr> */}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <ModalDetail open={isOpenDetailUser} onClose={() => setIsOpenDetailUser(false)}>
          <div style={{ width: "400", height: "100%", textAlign: "center", padding: "0", color:"#5f6368" }}>
            <div style={{ display: "flex", width: "100%", height: "100%" }}>
              <div style={{ width: "25% ", height: "100%", paddingBottom: "2.5%" }}>
                <div style={{ borderRight: "1px solid #dddddd", height: "100%" }}>
                  <div style={{ width: "100% ", height: "30%" }}>
                    {/* <img src={ava} style={{ objectFit: "cover", borderRadius: "50%", width: "150px", height: "150px" }}></img> */}
                  </div>
                  {/* <div style={{ width: "100%", position: "relative" }}>
                    <div style={{ height: "3px", width: "75%", position: "absolute", margin: "35px 12.5% 0% 12.5%", backgroundColor: "gray" }}></div>
                    <div style={{ width: "100%", display: "grid", marginLeft: "-2%", position: "absolute", gridTemplateColumns: "auto auto auto auto", textAlign: "center" }}>
                      <div style={{ paddingLeft: "0%" }}><span>電話番号</span>
                        <div style={{ width: "35px", height: "35px", margin: "auto", backgroundColor: "gray", borderRadius: "50%", display: "table" }}><span style={{ verticalAlign: "middle", display: "table-cell" }}>1</span></div>
                      </div>
                      <div style={{ paddingLeft: "0%" }}><span>メール</span>
                        <div style={{ width: "35px", height: "35px", margin: "auto", backgroundColor: "gray", borderRadius: "50%", display: "table" }}><span style={{ verticalAlign: "middle", display: "table-cell" }}>2</span></div>
                      </div>
                      <div style={{ paddingLeft: "0%" }}><span>タグ</span>
                        <div style={{ width: "35px", height: "35px", margin: "auto", backgroundColor: "gray", borderRadius: "50%", display: "table" }}><span style={{ verticalAlign: "middle", display: "table-cell" }}>3</span></div>
                      </div>
                      <div style={{ paddingLeft: "0%" }}><span>顧客データ</span>
                        <div style={{ width: "35px", height: "35px", margin: "auto", backgroundColor: "gray", borderRadius: "50%", display: "table" }}><span style={{ verticalAlign: "middle", display: "table-cell" }}>4</span></div>
                      </div>
                    </div>

                  </div> */}
                  <div style={{ textAlign: "left", marginLeft:"15px" }}>
                    <div style={{marginTop:"15px"}}>
                      <span>Email: </span>
                    </div>
                    <div style={{marginTop:"15px"}}>
                      <span>Phone: </span>
                    </div>
                    <div style={{marginTop:"15px"}}>
                      <span>Followed Business: {instagramUser !== undefined ? (instagramUser.is_user_follow_business == true ? "Yes" : "No") : ""}</span>
                    </div>
                    <div style={{marginTop:"15px"}}>
                      <span>Followed by Business: {instagramUser !== undefined ? (instagramUser.is_business_follow_user == true ? "Yes" : "No") : ""}</span>
                    </div>
                    <div style={{marginTop:"15px"}}>
                      <span>Start using Chatbot: {instagramUser !== undefined ? (((instagramUser.created_at).slice(0, 16)).replace("T", " ").replaceAll("-", "/")) : ""} </span>
                    </div>
                    <div style={{marginTop:"15px"}}>
                      <span>Last using Chatbot: {instagramUser !== undefined ? (((instagramUser.updated_at).slice(0, 16)).replace("T", " ").replaceAll("-", "/")) : ""}</span>
                    </div>
                  </div>

                </div>

              </div>
              <div style={{ width: "70%", height: "100%", display: "flex", paddingBottom: "2.5%" }}>
                <div style={{ width: "60%", height: "100%", borderRight: "1px solid #dddddd", paddingLeft: "5px" }}>
                  <br />
                  <div style={{ display: "flex", marginLeft: "4%" }}>
                    <h5>{instagramUser !== undefined ? instagramUser.username : ""}</h5>&ensp;&ensp;<img src={insta_img} style={{ width: "30px", height: "30px" }}></img>
                  </div>

                  <div style={{ display: "flex", marginLeft: "4%", flexWrap: "wrap" }}>
                    <img src={tag_icon} style={{ width: "30px", height: "30px", marginTop: "10px" }}></img>
                    {labelinstagramUser.map((item) => (
                      <div key={item} style={{ marginTop: "15px" }}>&ensp;<span style={{ backgroundColor: "#1ba2b8", color: "white", borderRadius: "5px", padding: "5px 10px 5px 10px" }}>{item}</span></div>
                    ))}
                    <div style={{ marginTop: "17px" }} onClick={() => { setIsOpenAddLabel(true) }}>&ensp;<span style={{ backgroundColor: "#1ba2b8", color: "white", borderRadius: "5px", padding: "7px 10px 3px 10px" }}>
                      <i className='nc-icon nc-simple-add' style={{ fontWeight: "800" }}></i></span></div>
                  </div>
                  <br />
                  <br />
                  <div style={{ textAlign: "left" }}>
                    <span style={{ fontWeight: "700", fontSize: "18px", marginLeft: "4%", color:"#5f6368" }}>顧客 一夕</span>
                    <div style={{ width: "90%", marginLeft: "4%", height: "1px", backgroundColor: "#e4e4e4" }}></div>
                    <br />

                    <div className="grid-container-crm">

                      {tableList.map((item) => (
                        <div key={item.title} className="grid-item-crm" style={{ display: "flex" }}>
                          <div style={{ width: "50%", borderRight: "1px solid #e4e4e4" }}>{item.title}</div>
                          <div style={{ width: "50%" }}>{item.value}</div>
                        </div>
                      ))}
                      <div id="AddTableButton" className="grid-item-crm" style={{ color: "#5f6368" }}><button style={{ width: "100%", height: "100%", border: "none", backgroundColor: "white", color:"#5f6368" }}
                        onClick={() => { setIsOpenAddTable(true) }}>＋ 一夕追加 </button> </div>
                    </div>
                  </div>
                </div>
                <div style={{ width: "40%", height: "100%" }}>
                  <br /><br />
                  {historyinstagramUser.map((item) => (
                    <div key={item.created_at} style={{ display: "flex", paddingTop: "10px", paddingLeft: "0px", marginLeft: "3px", paddingBottom: "10px" }}>
                      <span style={{ minWidth: "80px", borderRight: "1px solid #e4e4e4" }}>{((item.created_at).slice(5, 16)).replace("T", " ").replace("-", "/")}</span>

                      {/* <span style={{ width: "73px" }}>{((item.created_at).slice(5,16)).replace("T"," ").replace("-","/")}</span> */}
                      {/* <span>&ensp;{item.action}:&ensp;{item.usage_type}</span> */}
                      <span style={{}}>&ensp;{item.usage_type == "dm_received" ? "Sent" : "Received"}:&ensp;{item.content}</span>

                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ModalDetail>
        <ModalShort open={isOpenAddTable} onClose={() => setIsOpenAddTable(false)}>
          <div style={{ width: "300px", textAlign: "center", color: "#51cbce" }}>
            <h4>Add item Table</h4>
            <label style={{ width: "100%" }}>Title</label>
            <input id="newItemTitle" style={{ width: "100%" }} onChange={(e)=> checkInputItemTitle(e.target.value)} name="item_table_title"></input>
            <label id="newItemTitleErrMsg" style={{ display: 'none', color: "red" }}></label>
            <label style={{ width: "100%" }}>Value</label>
            <input id="newItemValue" style={{ width: "100%" }} onChange={(e)=> checkInputItemValue(e.target.value)} name="item_table_value"></input>
            <label id="newItemValueErrMsg" style={{ display: 'none', color: "red" }}></label>
            {/* <label id="newMsgBagErrMsg" style={{ display: 'none', color: "red" }}></label> */}
            <br />
            <Button id="btnAddItem" onClick={() => addTableItem()}>Add</Button>
          </div>
        </ModalShort>
        <ModalShort open={isOpenAddLabel} onClose={() => setIsOpenAddLabel(false)}>
          <div style={{ width: "300px", textAlign: "center", color: "#51cbce" }}>
            <h4>Add Label</h4>
            <input id="newLabel" style={{ width: "100%" }} onChange={(e)=> checkInputLabel(e.target.value)} name="item_label"></input>
            <label id="newLabelErrMsg" style={{ display: 'none', color: "red" }}></label>
            <br />
            <Button id="btnAddLbl" onClick={() => addLabel()}>Add</Button>
          </div>
        </ModalShort>
      </div>
    </>
  )
}

export default CRM