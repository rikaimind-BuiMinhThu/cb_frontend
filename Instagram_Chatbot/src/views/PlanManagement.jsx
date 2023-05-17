import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import api from "../api/api-management";
import Modal from "./Popup/Modal";
import ModalNoti from "./Popup/ModalNoti";
import "./Popup/modal.css";
import * as utils from "../JS/client.js";
import "../assets/css/general.css";
import { Card, CardHeader, CardBody, Table, Row, Col } from "reactstrap";
import { Button } from "react-bootstrap";
import { Pagination } from "@material-ui/lab";
import ModalShort from "./Popup/ModalShort";
import { tokenExpired } from "api/tokenExpired";

function PlanManagement() {
  var [dataList, setDataList] = useState([]);
  var [isOpenDeletePlan, setIsOpenDeletePlan] = useState(false);

  var [totalPage, setTotalPage] = useState();
  var [page, setPage] = useState(1);

  //Update, Detail
  var [planId, setPlanId] = useState();
  var [price, setPrice] = useState();
  var [description, setDescription] = useState();
  var [name, setName] = useState();

  var [nameSearch, setNameSearch] = useState("");

  var [msgNoti, setMsgNoti] = useState();
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [isOpenNoti, setIsOpenNoti] = useState(false);

  /**
   * Check the user permissions
   */
  useEffect(() => {
    const userRole = Cookies.get("user_role");
    if (!userRole || userRole !== "admin_deel") {
      window.location.href = "/";
    }
  }, []);

  /**
   * Check the user token
   */
  useEffect(() => {
    if (
      Cookies.get("token") === undefined ||
      Cookies.get("token") == null ||
      Cookies.get("token") === ""
    ) {
      window.location.href = "/";
    }
    if (Cookies.get("is_auth") == "false") {
      window.location.href = "/";
    }
  }, []);

  React.useEffect(() => {
    var paramSearch = { page: page };
    api
      .get(`/api/v1/managements/plans`, paramSearch)
      .then((res) => {
        console.log("list plan: ", res.data);
        if (res.data.data.total !== 0) {
          var totalPage = Math.ceil(res.data.total / 25);
          setTotalPage(totalPage);
          setDataList(res.data.data);
          document
            .getElementById("searchKeyword")
            .addEventListener("keypress", (e) => {
              if (e.key === "Enter") {
                // Cancel the default action, if needed
                e.preventDefault();
                // Trigger the button element with a click
                search();
              }
            });
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }, [page]);

  function search() {
    let searchVal = document.getElementById("searchKeyword").value;
    setNameSearch(searchVal);
    // let path = window.location.pathname;

    api
      .get(`/api/v1/managements/plans?keyword=${searchVal}&page=${1}`)
      .then((res) => {
        let totalPage = Math.ceil(res?.data?.total / 25);

        setDataList(res?.data?.data);
        setPage(1);
        setTotalPage(totalPage);
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }

  function reloadListClient(pgIndex) {
    // var path = window.location.pathname;
    api
      .get(
        `/api/v1/managements/plans?keyword=${nameSearch}&page=${pgIndex}&client_id=`
      )
      .then((res) => {
        var totalPage = Math.ceil(res.data.total / 25);
        if (pgIndex > totalPage) {
          api
            .get(
              `/api/v1/managements/plans?keyword=${nameSearch}&page=${totalPage}&client_id=`
            )
            .then((resp) => {
              setDataList(resp.data.data);
            });
        } else {
          setDataList(res.data.data);
        }
        setTotalPage(totalPage);
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }

  function updateClientUser(item) {
    api
      .get(`/api/v1/managements/plans/${item.id}`)
      .then((res) => {
        var data = res.data.data;
        console.log("detail: ", data);
        setPlanId(data.id);
        setDescription(data.description);
        setPrice(data.price);
        setName(data.name);

        setIsOpenUpdate(true);
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }

  // const [idDeleteClient, setIdDeleteClient] = useState();

  // function deleteClientPopup(id) {
  //   setIsOpenDeletePlan(true);
  //   setIdDeleteClient(id);
  // }

  // function deleteClientUser() {
  //   setIsOpenDeletePlan(false);
  //   api
  //     .delete(`/api/v1/managements/plans/${idDeleteClient}`)
  //     .then((res) => {
  //       reloadListClient(page);
  //       showNotification("削除しました!");
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       if (error.response?.data.code === 0) {
  //         tokenExpired();
  //       }
  //     });
  // }

  function updatePlan() {
    var price = document.getElementById("price").value;

    if (price >= 0) {
      var elements = document.getElementById("updateForm").elements;
      var obj = {};
      for (var i = 0; i < elements.length; i++) {
        var item = elements.item(i);
        obj[item.name] = item.value;
      }
      api
        .patch(`/api/v1/managements/plans/${planId}`, obj)
        .then((res) => {
          reloadListClient(page);
          showNotification("クライアント更新しました!");
          setIsOpenUpdate(false);
        })
        .catch((error) => {
          console.log(error);
          if (error.response?.data.code === 0) {
            tokenExpired();
          }
        });
    } else {
      if (price < 0) {
        document.getElementById("newClientプラン価格ErrMsg").style.display =
          "block";
        document.getElementById("newClientプラン価格ErrMsg").innerHTML =
          "正数を入力してください。";
      }
    }
  }

  // function addPlanPopup() {
  //   setIsOpenAddPlan(true);
  //   //detailUserClient
  // }
  // function addPlan() {
  //   var price = document.getElementById("newPrice").value;
  //   var name = document.getElementById("newName").value;
  //   checkFieldAdd(name, "プラン名称", 50);

  //   if (checkFieldAdd(name, "プラン名称", 50) === true && price >= 0) {
  //     // if (checkFieldAdd(name, 'Name') === true && checkFieldAdd(address, "Address") === true && utils.checkInputNumber(phone, "Phone") === true) {
  //     var elements = document.getElementById("addForm").elements;
  //     var obj = {};
  //     for (var i = 0; i < elements.length - 1; i++) {
  //       var item = elements.item(i);
  //       obj[item.name] = item.value;
  //     }
  //     api
  //       .post(`/api/v1/managements/plans`, obj)
  //       .then((res) => {
  //         if (res.data.code === 1 || res.data.code === "1") {
  //           reloadListClient();
  //           showNotification("クライアント追加しました!");
  //           setIsOpenAddPlan(false);
  //         } else if (res.data?.code === 2 || res.data?.code === "2") {
  //           showNotification(res.data.message);
  //           setIsOpenAddPlan(false);
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         if (error.response?.data.code === 0) {
  //           tokenExpired();
  //         }
  //       });

  //     // }
  //   } else {
  //     if (price < 0) {
  //       document.getElementById("newClientプラン価格ErrMsg").style.display =
  //         "block";
  //       document.getElementById("newClientプラン価格ErrMsg").innerHTML =
  //         "正数を入力してください。";
  //     }
  //   }
  // }

  // function checkFieldAdd(value, field, length) {
  //   if (value === "") {
  //     document.getElementById(`newClient${field}ErrMsg`).style.display =
  //       "block";
  //     document.getElementById(
  //       `newClient${field}ErrMsg`
  //     ).innerHTML = `${field} 入力してください。`;
  //   } else if (value && value.length > length) {
  //     document.getElementById(`newClient${field}ErrMsg`).style.display =
  //       "block";
  //     document.getElementById(
  //       `newClient${field}ErrMsg`
  //     ).innerHTML = `${length}文字以下入力してください。`;
  //   } else {
  //     document.getElementById(`newClient${field}ErrMsg`).style.display = "none";
  //     document.getElementById(`newClient${field}ErrMsg`).innerHTML = "";
  //     return true;
  //   }
  // }

  // function handleChange(event, value) {
  //   console.log("pageIndex: ", value);
  //   setPage(parseInt(value));
  //   reloadListClient(value);
  //   // window.scrollTo({ top: 0, behavior: 'smooth' });
  //   document.querySelector(".main-panel").scrollTop = 0;
  // }
  function showNotification(message) {
    setMsgNoti(message);
    setIsOpenNoti(true);
    setTimeout(() => {
      setMsgNoti("");
      setIsOpenNoti(false);
    }, 2000);
  }

  return (
    <>
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>
                <div
                  className="swap"
                  style={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <input
                      id="searchKeyword"
                      name="searchKeyword"
                      style={{
                        height: "38px",
                        width: "200px",
                        border: "1px solid #dee2e6",
                        paddingTop: "-10px",
                        borderRadius: "3px",
                      }}
                      onChange={(e) => setNameSearch(e.target.value)}
                    ></input>
                    <Button
                      onClick={() => search()}
                      style={{ backgroundColor: "#66615b" }}
                    >
                      検索
                    </Button>
                  </div>
                  {/* <div
                    className="div_right"
                    style={{ float: "right", width: "15%" }}
                  >
                    <Button
                      type="text"
                      onClick={() => addPlanPopup()}
                      style={{ backgroundColor: "#66615b" }}
                    >
                      プラン追加
                    </Button>
                  </div> */}
                </div>
              </CardHeader>
              <CardBody>
                <div style={{ width: "100%", overflowX: "auto" }}>
                  <Table style={{ textAlign: "center", tableLayout: "fixed" }}>
                    <thead className="text-primary">
                      <tr>
                        <th colSpan={1}> ID </th>
                        <th colSpan={2}> プラン名称 </th>
                        <th colSpan={2}> プラン価格 </th>
                        <th colSpan={5}> 説明 </th>
                        <th colSpan={2}> アクション </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataList &&
                        dataList.map((item, index) => (
                          <tr
                            key={index}
                            style={{
                              overflow: "visible",
                              height: "14px",
                              backgroundColor: "white",
                            }}
                          >
                            <td colSpan={1}>{item.id}</td>
                            <td colSpan={2}>{item.name}</td>
                            <td colSpan={2}>{item.price}</td>
                            <td colSpan={5} style={{textAlign:"start"}}>{item.description}</td>
                            <td colSpan={2}>
                              <div style={{ display: "inline-flex" }}>
                                <div onClick={() => updateClientUser(item)}>
                                  <i
                                    className="nc-icon nc-align-center nc-3x"
                                    style={{
                                      fontSize: "30px",
                                      marginTop: "5px",
                                      // marginRight: "30px",
                                    }}
                                  ></i>
                                </div>

                                {/* <div onClick={() => deleteClientPopup(item.id)}>
                                  <i
                                    className="nc-icon nc-box nc-3x"
                                    style={{
                                      fontSize: "30px",
                                      marginTop: "5px",
                                      cursor: "pointer",
                                    }}
                                  ></i>
                                </div> */}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </div>

                {/* <Pagination
                  count={totalPage}
                  variant="outlined"
                  page={page}
                  onChange={handleChange}
                /> */}
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Modal open={isOpenUpdate} onClose={() => setIsOpenUpdate(false)}>
          <div style={{ width: "100%" }}>
            <div style={{ marginTop: "-30px" }}>
              <h4>プラン追加</h4>
              <div
                style={{
                  width: "100%",
                  height: "2px",
                  backgroundColor: "#bbb",
                  marginBottom: "15px",
                }}
              ></div>
              <form id="updateForm" className="swap">
                <label className="label-input">
                  プラン名称 <span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={name}
                    disabled={true}
                  />
                  <label
                    id="newClientプラン名称ErrMsg"
                    className="input-field"
                    style={{
                      display: "none",
                      color: "red",
                      border: "none",
                      padding: "2px",
                    }}
                  ></label>
                </label>{" "}
                <br />
                <br />
                <label className="label-input">
                  プラン価格 <span className="span-require">*必須</span>
                  <input
                    className="input-field"
                    onBlur={(e) =>
                      utils.checkInputNumber(e.target.value, "プラン価格")
                    }
                    type="number"
                    id="price"
                    name="price"
                    defaultValue={price}
                  />
                  <label
                    id="newClientプラン価格ErrMsg"
                    className="input-field"
                    style={{
                      display: "none",
                      color: "red",
                      border: "none",
                      padding: "2px",
                    }}
                  ></label>
                </label>
                <br />
                <br />
                <label className="label-input">
                  説明
                  <textarea
                    className="input-field"
                    // onBlur={(e) => checkFieldAdd(e.target.value, "説明", 500)}
                    id="desc"
                    name="description"
                    defaultValue={description}
                    rows={5}
                  />
                </label>
                <br />
                <br />
                <Button id="btnSubmit" onClick={updatePlan}>
                  更新
                </Button>
              </form>
            </div>
          </div>
        </Modal>

        <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
          <div
            style={{ width: "400px", textAlign: "center", color: "#51cbce" }}
          >
            <span style={{ fontSize: "16px" }}>{msgNoti}</span>
          </div>
        </ModalNoti>
        {/* <ModalShort
          open={isOpenDeletePlan}
          onClose={() => setIsOpenDeletePlan(false)}
        >
          <div
            style={{ width: "400px", textAlign: "center", color: "#51cbce" }}
          >
            <h4>プランを削除してもよろしいですか?</h4>
            <Button onClick={() => deleteClientUser()}>はい</Button>
            <Button onClick={() => setIsOpenDeletePlan(false)}>いいえ</Button>
          </div>
        </ModalShort> */}
      </div>
    </>
  );
}

export default PlanManagement;
