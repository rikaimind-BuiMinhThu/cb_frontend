import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import api from 'api/api-management';
import Modal from "./Popup/Modal";
import ModalNoti from "./Popup/ModalNoti";
import "./Popup/modal.css";
import * as utils from "../JS/client.js";
import "../assets/css/general.css";
import { Card, CardHeader, CardBody, Table, Row, Col } from "reactstrap";
import { Button } from "react-bootstrap";
import { Pagination } from "@material-ui/lab";
import ModalShort from "./Popup/ModalShort";
import { tokenExpired } from "v2/api/tokenExpired";
import { MDBIcon } from "mdbreact";

function PlanManagement() {
  const [dataList, setDataList] = useState([]);

  //Update, Detail
  const [planId, setPlanId] = useState();
  const [price, setPrice] = useState();
  const [description, setDescription] = useState();
  const [name, setName] = useState();
  const [code, setCode] = useState();
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);

  const [msgNoti, setMsgNoti] = useState();
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
    api
      .get(`/api/v1/managements/plans`)
      .then((res) => {
        console.log("list plan: ", res.data);
        setDataList(res.data.data);
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }, []);

  function reloadListClient() {
    // var path = window.location.pathname;
    api
      .get(`/api/v1/managements/plans`)
      .then((res) => {
        setDataList(res.data.data);
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
        setCode(data.code);

        setIsOpenUpdate(true);
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
  }

  function updatePlan() {
    var price = document.getElementById("price").value;

    if (checkInputNumber(price) && price >= 0) {
      var elements = document.getElementById("updateForm").elements;
      var obj = {};
      for (var i = 0; i < elements.length; i++) {
        var item = elements.item(i);
        obj[item.name] = item.value;
      }
      api
        .patch(`/api/v1/managements/plans/${planId}`, obj)
        .then((res) => {
          reloadListClient();
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

  function showNotification(message) {
    setMsgNoti(message);
    setIsOpenNoti(true);
    setTimeout(() => {
      setMsgNoti("");
      setIsOpenNoti(false);
    }, 2000);
  }
  function checkInputNumber(value) {
    var numRe = /^\d+$/;
    if (value === "" || value === undefined) {
      document.getElementById(`newClientプラン価格ErrMsg`).style.display =
        "block";
      document.getElementById(
        `newClientプラン価格ErrMsg`
      ).innerHTML = `プラン価格 を入力してください。`;
      return false;
    } else {
      if (value < 0) {
        document.getElementById("newClientプラン価格ErrMsg").style.display =
          "block";
        document.getElementById("newClientプラン価格ErrMsg").innerHTML =
          "正数を入力してください。";
        return false;
      }

      if (numRe.test(value) === false) {
        document.getElementById(`newClientプラン価格ErrMsg`).style.display =
          "block";
        document.getElementById(
          `newClientプラン価格ErrMsg`
        ).innerHTML = `プラン価格 は整数の必要です。`;
        return false;
      }
      if (numRe.test(value) === true) {
        document.getElementById(`newClientプラン価格ErrMsg`).style.display =
          "none";
        document.getElementById(`newClientプラン価格ErrMsg`).innerHTML = "";
        return true;
      }
    }
  }
  return (
    <>
      <div className="content">
        <Row id="screenAll">
          <Col md="12">
            <Card>
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
                            <td colSpan={2}>{item.price} {item.code === 4 ? ' / CV': ''}</td>
                            <td colSpan={5}>{item.description}</td>
                            <td colSpan={2}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <div
                                  style={{
                                    marginTop: "5px",
                                    marginRight: "20px",
                                    fontSize: "1.5em",
                                  }}
                                >
                                  <MDBIcon
                                    far
                                    icon="edit"
                                    onClick={() => updateClientUser(item)}
                                  />
                                </div>
                              </div>
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

        <Modal open={isOpenUpdate} onClose={() => setIsOpenUpdate(false)}>
          <div style={{ width: "100%", minHeight: "500px" }}>
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
                  プラン価格 {code === 4 ? ' / CV  ' : ''}<span className="span-require">*必須</span>
                  <input
                    className={"input-field"}
                    onBlur={(e) => checkInputNumber(e.target.value)}
                    type="number"
                    id="price"
                    name="price"
                    defaultValue={price}
                    style={{content:""}}
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
      </div>
    </>
  );
}

export default PlanManagement;
