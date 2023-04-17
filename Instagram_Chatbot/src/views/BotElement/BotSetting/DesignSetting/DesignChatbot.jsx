import { Card, CardHeader, CardBody, Table, Row, Col } from "reactstrap";
import "./../../../../assets/css/bot/bot-setting.css";
// icons
import IconManDefault from "./../../../../assets/img/bot-icon/man1_new.png";
import IconWomenDefault from "./../../../../assets/img/bot-icon/women1_new.png";
import IconWomen4 from "./../../../../assets/img/bot-icon/women4_new.png";
import IconWomen5 from "./../../../../assets/img/bot-icon/women5_new.png";
import IconWomen6 from "./../../../../assets/img/bot-icon/women6_new.png";
import IconWomen7 from "./../../../../assets/img/bot-icon/women7_new.png";
import IconWomen8 from "./../../../../assets/img/bot-icon/women8_new.png";
import IconWomen9 from "./../../../../assets/img/bot-icon/women9_new.png";
import IconWomen10 from "./../../../../assets/img/bot-icon/women10_new.png";
import IconWomen11 from "./../../../../assets/img/bot-icon/women11_new.png";
import React, { useEffect, useState } from "react";
import "./../../../../assets/css/bot/add-bot.css";
import api from "./../../../../api/api-management";
import ModalNoti from "./../../../../views/Popup/ModalNoti";
import { Link } from "react-router-dom";
import { tokenExpired } from "api/tokenExpired";
import Cookies from "js-cookie";
import { MDBIcon } from "mdbreact";
import { any } from "prop-types";

const colors = [
  "#327AED",
  "#26B197",
  "#fC7E02",
  "#F6CA21",
  "#F16FAA",
  "#8C66D9",
  "#7C8290",
  "#D8E2EF",
];

const images = [
  IconManDefault,
  IconWomenDefault,
  IconWomen4,
  IconWomen5,
  IconWomen6,
  IconWomen7,
  IconWomen8,
  IconWomen9,
  IconWomen10,
  IconWomen11,
];
function DesignChatbot() {
  const [tabmenu, setTabmenu] = useState(1);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [designType, setDesignType] = useState("flat");
  const [botImage, setBotImage] = useState(IconManDefault);
  const [botName, setBotName] = useState("");
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [msgNoti, setMsgNoti] = useState("");
  const [isOpenPreview, setIsOpenPreview] = useState(false);
  const [mainColor, setMainColor] = useState("#327AED");
  const [botId, setBotId] = useState(Cookies.get("bot_id"));
  const [buttonTypePc, setButtonTypePc] = useState(1);
  const [positionPc, setPositionPc] = useState(1);
  const [widthPc, setWidthPc] = useState(460);
  const [heightPc, setHeightPc] = useState(700);
  const [rightPcTitle, setRightPcTitle] = useState("");
  const [positionSp, setPositionSp] = useState(1);
  const [buttonTypeSp, setButtonTypeSp] = useState(1);
  const [rightMarginPc, setRightMarginPc] = useState(10);
  const [bottomMarginPc, setBottomMarginPc] = useState(10);
  const [displayType, setDisplayType] = useState(1);
  const [rightSpTitle, setRightSpTitle] = useState("");
  const [rightMarginSp, setRightMarginSp] = useState(10);
  const [bottomMarginSp, setBottomMarginSp] = useState(10);
  const [a, setA] = useState("");
  const [c, setC] = useState("");



  // design type: handle click
  const designTypeClick = (e) => {
    let value = "";
    if (e.target.innerText === "ポップ") {
      value = "pop";
    } else if (e.target.innerText === "フラット") {
      value = "flat";
    } else if (e.target.innerText === "マテリアル") {
      value = "material";
    }
    setDesignType(value);
    const typeActive = document.querySelector(".design-types .type.active");
    typeActive.classList.remove("active");
    if (e.target.localName !== "div") {
      e.target.offsetParent.classList.add("active");
    } else {
      e.target.classList.add("active");
    }
  };
  // color: handle click
  const handleColorClick = (index, color) => {
    setMainColor(color);
    document
      .querySelector(".main-colors .color.active")
      .classList.remove("active");
    document
      .querySelector(`.main-colors .color.color-${index}`)
      .classList.add("active");
  };

  // icon: handle click
  const handleIconClick = (index, imageDefault) => {
    document.querySelector(".icons .icon.active").classList.remove("active");
    document
      .querySelector(`.icons .icon.icon-${index}`)
      .classList.add("active");
    if (!imageDefault.includes("image/png;base64")) {
      toDataURL(imageDefault).then((dataUrl) => {
        setBotImage(dataUrl);
      });
    } else {
      setBotImage(imageDefault);
    }
  };

  // get base url image add
  const getBaseUrlAdd = () => {
    const file = document.getElementById("bot_image")?.files[0];
    if (
      file?.type === "image/png" ||
      file?.type === "image/jpeg" ||
      file?.type === "image/jpg"
    ) {
      let reader = new FileReader();
      let baseString;
      reader.onloadend = function () {
        baseString = reader.result;
        setBotImage(baseString);
        if (baseString !== undefined || baseString !== "") {
          document.querySelector(".error-message.bot-image").style.display =
            "none";
        }
      };
      reader.readAsDataURL(file);
      return true;
    } else {
      setBotImage("");
      document.querySelector(".error-message.bot-image").innerHTML =
        "画像を選択してください。";
      document.querySelector(".error-message.bot-image").style.display =
        "block";
      return false;
    }
  };

  const [defaultIcon, setDefaultIcon] = useState("");

  const toDataURL = (url) =>
    fetch(url)
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );
  // set defal icon

  //set main color
  useEffect(() => {
    const mainColorsList = [
      "blue",
      "green",
      "orange",
      "yellow",
      "pink",
      "purple",
      "black",
      "white",
    ];

    const index = mainColorsList.indexOf(mainColor);

    if (index !== -1) {
      document
        .querySelector(".main-colors .color.active")
        .classList.remove("active");
      document
        .querySelector(`.main-colors .color.color-${index}`)
        .classList.add("active");
    }
  }, [mainColor]);
  //get chat bot information
  useEffect(() => {
    api.get(`/api/v1/managements/chatbots/${botId}`).then((response) => {
      if (response.data.data) {
        const result = JSON.parse(response.data.data?.design_settings);
        setDisplayType(result?.display_type);
        setWidthPc(result?.width_pc);
        setHeightPc(result?.height_pc);
        setPositionPc(result?.position_pc);
        setRightPcTitle(result?.right_position_pc_title);
        setButtonTypePc(result?.button_type_pc);
        setRightMarginPc(result?.right_margin_pc);
        setBottomMarginPc(result?.bottom_margin_pc);
        setPositionSp(result?.position_sp);
        setButtonTypeSp(result?.button_type_sp);
        setRightSpTitle(
          JSON.parse(response.data.data?.design_settings)
            ?.right_position_sp_title
        );
        setRightMarginSp(result?.right_margin_sp);
        setBottomMarginSp(result?.bottom_margin_sp);
        setBotName(response.data.data?.bot_name);
        setTitle(response.data.data?.title);
        setSubtitle(response.data.data?.subtitle);
        setDesignType(response.data.data?.design_type);
        setMainColor(response.data.data?.main_color);
        setBotImage(response.data.data?.icon?.url);
      } else {
        setIsOpenNoti(true);
        // setMessageNoti('シナリオがありません。');
        setTimeout(() => {
          setIsOpenNoti(false);
          // setMessageNoti('');
        }, 2000);
      }
    });
    document
      .querySelector(".main-colors .color.color-0")
      .classList.add("active");
    document.querySelector(".icons .icon.icon-0").classList.add("active");
    setBotId(Cookies.get("bot_id"));
  }, []);
  // update bot chat
  const addUpdateBotChat = () => {
    if (title && subtitle && botName) {
      let iconBot = "";
      if (botImage === "") {
        iconBot = IconManDefault;
      } else {
        iconBot = botImage;
      }
      let main_color = {
        blue: "#327AED",
        green: "#26B197",
        orange: "#fC7E02",
        yellow: "#F6CA21",
        pink: "#F16FAA",
        purple: "#8C66D9",
        black: "#7C8290",
        white: "#D8E2EF",
      };
      var color;
      Object.entries(main_color).forEach(([key, val]) => {
        if (mainColor === val) {
          color = key;
        }
      });
      var bot = {
        chatbot: {
          title: title,
          subtitle: subtitle,
          design_type: designType,
          main_color: color,
          // icon: !iconBot.includes('image/png;base64') ? defaultIcon : iconBot,
          icon: iconBot,
          bot_name: botName,
        },
      };

      api
        .put(`api/v1/managements/chatbots/${botId}`, bot)
        .then((res) => {
          if (res.data.code === 1 || res.data.code === "1") {
            Cookies.set("bot_id", res.data.data.id);
            Cookies.set("bot_type", "bot");
            setMsgNoti("ボットを正常に保存されました！");
            setIsOpenNoti(true);
            setTimeout(() => {
              setMsgNoti("");
              setIsOpenNoti(false);
            }, 1500);
          } else if (res.data?.code === 2 || res.data?.code === "2") {
            setMsgNoti(res.data.message);
            setIsOpenNoti(true);
          }
        })
        .catch((error) => {
          if (error.response?.data.code === 0) {
            tokenExpired();
          }
        });
    } else {
      if (!title) {
        document.querySelector(".error-message.title").innerHTML =
          "タイトルは、必ず指定してください。";
        document.querySelector(".error-message.title").style.display = "block";
      }
      if (!subtitle) {
        document.querySelector(".error-message.subtile").innerHTML =
          "サブタイトルは、必ず指定ください。";
        document.querySelector(".error-message.subtile").style.display =
          "block";
      }
      if (!botName) {
        document.querySelector(".error-message.bot-name").innerHTML =
          "ボット名は、必ず指定してください。";
        document.querySelector(".error-message.bot-name").style.display =
          "block";
      }
    }
  };
  //update design setting
  const updateDesignSetting = () => {
    if (widthPc) {
      let iconBot = "";
      if (botImage === "") {
        iconBot = IconManDefault;
      } else {
        iconBot = botImage;
      }
      let main_color = {
        blue: "#327AED",
        green: "#26B197",
        orange: "#fC7E02",
        yellow: "#F6CA21",
        pink: "#F16FAA",
        purple: "#8C66D9",
        black: "#7C8290",
        white: "#D8E2EF",
      };
      var color;
      Object.entries(main_color).forEach(([key, val]) => {
        if (mainColor === val) {
          color = key;
        }
      });
      var settings = {
        design_settings: {
          display_type: displayType,
          width_pc: widthPc,
          height_pc: heightPc,
          position_pc: positionPc,
          button_type_pc: buttonTypePc,
          right_position_pc_title: rightPcTitle,
          right_margin_pc: rightMarginPc,
          bottom_margin_pc: bottomMarginPc,
          position_sp: positionSp,
          button_type_sp: buttonTypeSp,
          right_position_sp_title: rightSpTitle,
          right_margin_sp: rightMarginSp,
          bottom_margin_sp: bottomMarginSp,
        },
      };

      api
        .post(`api/v1/managements/chatbots/${botId}/design_settings`, settings)
        .then((res) => {
          if (res.data.code === 1 || res.data.code === "1") {
            setMsgNoti("ボットを正常に保存されました！");
            setIsOpenNoti(true);
            setTimeout(() => {
              setMsgNoti("");
              setIsOpenNoti(false);

              // window.location.href = "/admin/design-setting";
            }, 1500);
          } else if (res.data?.code === 2 || res.data?.code === "2") {
            setMsgNoti(res.data.message);
            setIsOpenNoti(true);
          }
        })
        .catch((error) => {
          if (error.response?.data.code === 0) {
            tokenExpired();
          }
        });
    } else {
    }
  };
  // handle preview
  const handlePreview = () => {
    if (title && subtitle) {
      document.getElementById("sp-container").style.height = "620px";
      document.getElementById("sp-header").style.position = "static";
      document.getElementById("sp-header").style.borderBottomLeftRadius = "0px";
      document.getElementById("sp-header").style.borderBottomRightRadius =
        "0px";
      document.getElementById("sp-body").style.display = "block";
      setIsOpenPreview(true);
    } else {
      if (!title) {
        document.querySelector(".error-message.title").innerHTML =
          "タイトルは、必ず指定してください。";
        document.querySelector(".error-message.title").style.display = "block";
      }
      if (!subtitle) {
        document.querySelector(".error-message.subtile").innerHTML =
          "サブタイトルは、必ず指定ください。";
        document.querySelector(".error-message.subtile").style.display =
          "block";
      }
    }
  };

  // handle toggle preview
  const handleTogglePreview = () => {
    if (document.getElementById("sp-body").style.display === "none") {
      document.getElementById("sp-container").style.height = "620px";
      document.getElementById("sp-header").style.position = "static";
      document.getElementById("sp-header").style.borderBottomLeftRadius = "0px";
      document.getElementById("sp-header").style.borderBottomRightRadius =
        "0px";
      document.getElementById("sp-body").style.display = "block";
    } else {
      document.getElementById("sp-container").style.height = "0px";
      document.getElementById("sp-body").style.display = "none";
      document.getElementById("sp-header").style.borderBottomLeftRadius =
        "25px";
      document.getElementById("sp-header").style.borderBottomRightRadius =
        "25px";
      document.getElementById("sp-header").style.position = "absolute";
      document.getElementById("sp-header").style.bottom = "13px";
    }
  };
  return (
    <div className="content">
      <div>
        <Row id="screenAll">
          <Col md="12">
            <Card>
              <CardHeader>
                <button
                  onClick={() => setTabmenu(1)}
                  style={{
                    color: tabmenu === 1 ? "#4DBEB6" : "#9B9B9B",
                    backgroundColor: tabmenu === 1 ? "#fff" : "#F4F3EF",
                    boxShadow:
                      tabmenu === 2
                        ? "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px"
                        : "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
                  }}
                  className="tab-menu"
                >
                  基本情報
                </button>
                <button
                  onClick={() => setTabmenu(2)}
                  style={{
                    color: tabmenu === 2 ? "#4DBEB6" : "#9B9B9B",
                    backgroundColor: tabmenu === 2 ? "#fff" : "#F4F3EF",
                    boxShadow:
                      tabmenu === 1
                        ? "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px"
                        : "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
                  }}
                  className="tab-menu"
                >
                  デザインカスタマイズ
                </button>
              </CardHeader>
              {tabmenu === 1 && (
                <div style={{ height: "100%" }}>
                  <CardHeader>
                    <h4 style={{ margin: "10px 0" }}>ボット設定</h4>
                  </CardHeader>
                  <CardBody>
                    <form action="">
                      <div className="add-bot-container">
                        <div className="bot-left">
                          <div className="field-add-bot">
                            <div className="add-bot_field-container">
                              <span className="label-field">
                                タイトル <span style={{ color: "red" }}>*</span>
                              </span>
                              <input
                                type="text"
                                name="title"
                                className="input-field"
                                defaultValue={title}
                                placeholder="Service name, etc. (e.g. BOTCHAN)"
                                onChange={(e) => {
                                  setTitle(e.target.value);
                                  document.querySelector(
                                    ".error-message.title"
                                  ).style.display = "none";
                                }}
                              />
                            </div>
                            <span className="error-message title"></span>
                          </div>
                          <div className="field-add-bot">
                            <div className="add-bot_field-container">
                              <span className="label-field">
                                サブタイトル{" "}
                                <span style={{ color: "red" }}>*</span>
                              </span>
                              <input
                                type="text"
                                className="input-field"
                                defaultValue={subtitle}
                                placeholder="Purpose of the form (e.g. information request form)"
                                onChange={(e) => {
                                  setSubtitle(e.target.value);
                                  document.querySelector(
                                    ".error-message.subtile"
                                  ).style.display = "none";
                                }}
                              />
                            </div>
                            <span className="error-message subtile"></span>
                          </div>
                          <div className="field-add-bot">
                            <div className="add-bot_field-container">
                              <span className="label-field">
                                デザインタイプ
                              </span>
                              <div className="design-types">
                                <div
                                  className={
                                    designType === "pop"
                                      ? "type active"
                                      : "type"
                                  }
                                  onClick={(e) => designTypeClick(e)}
                                >
                                  <span>ポップ</span>
                                </div>
                                <div
                                  className={
                                    designType === "flat"
                                      ? "type active"
                                      : "type"
                                  }
                                  onClick={(e) => designTypeClick(e)}
                                >
                                  <span>フラット</span>
                                </div>
                                <div
                                  className={
                                    designType === "material"
                                      ? "type active"
                                      : "type"
                                  }
                                  onClick={(e) => designTypeClick(e)}
                                >
                                  <span>マテリアル</span>
                                </div>
                              </div>
                            </div>
                            <span className="error-message design-types"></span>
                          </div>
                          <div className="field-add-bot">
                            <div className="add-bot_field-container">
                              <span className="label-field">メインカラー</span>
                              <div className="main-colors">
                                {colors.map((color, index) => (
                                  <div
                                    key={index}
                                    className={`color color-${index}`}
                                    onClick={() =>
                                      handleColorClick(index, color)
                                    }
                                  >
                                    <span
                                      style={{ backgroundColor: color }}
                                    ></span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <span className="error-message main-colors"></span>
                          </div>
                          <div className="btn-wrapper">
                            <button
                              type="button"
                              className="btn btn-preview"
                              onClick={handlePreview}
                            >
                              プレビュー
                            </button>
                          </div>
                        </div>
                        <div className="bot-right">
                          <div>
                            <div className="field-add-bot">
                              <div className="add-bot_field-container">
                                <span className={"label-field"}>アイコン</span>
                                <div className="icons">
                                  {images.map((icon, index) => (
                                    <div
                                      key={index}
                                      className={`icon icon-${index}`}
                                      onClick={() => {
                                        toDataURL(icon).then((dataUrl) => {
                                          console.log(dataUrl);
                                        });
                                        handleIconClick(index, icon);
                                      }}
                                    >
                                      <img src={icon} alt="" />
                                    </div>
                                  ))}
                                </div>
                                <div className="add-icon">
                                  <span>+</span>
                                  <input
                                    type="file"
                                    id="bot_image"
                                    onChange={getBaseUrlAdd}
                                    name="bot_image"
                                    accept="image/png, image/jpeg"
                                  />
                                </div>
                              </div>
                              <span className="error-message bot-image"></span>
                            </div>
                            {botImage && (
                              <div className="field-add-bot">
                                <div className="image-show">
                                  <img src={botImage} alt="" />
                                </div>
                              </div>
                            )}
                            <div className="field-add-bot">
                              <div className="add-bot_field-container">
                                <span className="label-field">
                                  ボット名称{" "}
                                  <span style={{ color: "red" }}>*</span>
                                </span>
                                <input
                                  type="text"
                                  name="title"
                                  defaultValue={botName}
                                  className="input-field"
                                  placeholder="サンプルボット..."
                                  onChange={(e) => {
                                    setBotName(e.target.value);
                                    document.querySelector(
                                      ".error-message.bot-name"
                                    ).style.display = "none";
                                  }}
                                />
                              </div>
                              <span className="subtitle-field">
                                ※EC-CHAT管理用の名称です。ボット内で表示されることはありません。
                              </span>
                              <span className="error-message bot-name"></span>
                            </div>
                          </div>
                          <div className="btn-wrapper">
                            <button
                              type="button"
                              className="btn btn-new-bot"
                              onClick={addUpdateBotChat}
                            >
                              保存
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </CardBody>
                </div>
              )}
              {tabmenu === 2 && (
                <div>
                  <form action="POST">
                    <div style={{ width: "100%" }}>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          padding: "0 40px",
                        }}
                      >
                        {/* Pc */}
                        <div
                          style={{
                            width: "50%",
                            borderRight: "1px solid #ddd",
                          }}
                        >
                          <CardHeader>
                            <h4 style={{ margin: "10px 0" }}>PC</h4>
                          </CardHeader>
                          <CardBody style={{}}>
                            <div className="add-bot-container">
                              <div className="bot-haft">
                                <div className="field-add-bot">
                                  <div className="add-bot_field-container">
                                    <span className="label-field">
                                      表示タイプ{" "}
                                    </span>
                                    <div
                                      style={{ display: "flex", width: "100%" }}
                                    >
                                      <select
                                        style={{
                                          height: "40px",
                                          width: "100%",
                                          border: "1px solid #333",
                                          borderRadius: "5px",
                                          padding: "0 15px",
                                        }}
                                        value={displayType}
                                        onChange={(e) =>
                                          setDisplayType(e.target.value)
                                        }
                                      >
                                        <option value={1}>リロード</option>
                                        <option value={2}>非表示</option>
                                      </select>
                                    </div>
                                  </div>
                                  <span className="error-message subtile"></span>
                                </div>
                                <div className="field-add-bot">
                                  <div className="add-bot_field-container">
                                    <span className="label-field">サイズ </span>
                                    <div
                                      style={{
                                        display: "flex",
                                        width: "100%",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <input
                                        type="number"
                                        name="width_pc"
                                        className="input-setting2"
                                        defaultValue={widthPc}
                                        placeholder="幅"
                                        onChange={(e) => {
                                          setWidthPc(e.target.value);
                                          // document.querySelector(
                                          //   ".error-message.widthPc"
                                          // ).style.display = "none";
                                        }}
                                      />
                                      <input
                                        type="number"
                                        name="height_pc"
                                        className="input-setting2"
                                        placeholder="高さ"
                                        defaultValue={heightPc}
                                        onChange={(e) => {
                                          setHeightPc(e.target.value);
                                          // document.querySelector(
                                          //   ".error-message.title"
                                          // ).style.display = "none";
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="field-add-bot">
                                  <div className="add-bot_field-container">
                                    <span className="label-field">
                                      設置場所{" "}
                                    </span>
                                    <div
                                      style={{ display: "flex", width: "100%" }}
                                    >
                                      <select
                                        style={{
                                          height: "40px",
                                          width: "100%",
                                          border: "1px solid #333",
                                          borderRadius: "5px",
                                          padding: "0 15px",
                                        }}
                                        value={positionPc}
                                        onChange={(e) =>
                                          setPositionPc(e.target.value)
                                        }
                                      >
                                        <option value={1}>底辺に設置</option>
                                        <option value={2}>右辺に設置</option>
                                      </select>
                                    </div>
                                  </div>
                                  <span className="error-message subtile"></span>
                                </div>

                                {positionPc === "2" && (
                                  <div className="field-add-bot">
                                    <div className="add-bot_field-container">
                                      <span className="label-field">
                                        右のタイトル{" "}
                                      </span>
                                      <div
                                        style={{
                                          display: "flex",
                                          width: "100%",
                                        }}
                                      >
                                        <input
                                          type="text"
                                          name="right_position_pc_title"
                                          className="input-setting"
                                          placeholder="タイトル"
                                          defaultValue={rightPcTitle}
                                          onChange={(e) => {
                                            setRightPcTitle(e.target.value);
                                            // document.querySelector(
                                            //   ".error-message.title"
                                            // ).style.display = "none";
                                          }}
                                        />
                                      </div>
                                    </div>
                                    <span className="error-message subtile"></span>
                                  </div>
                                )}

                                <div className="field-add-bot">
                                  <div className="add-bot_field-container">
                                    <span className="label-field">
                                      ボタン内容{" "}
                                    </span>
                                    <div
                                      style={{ display: "flex", width: "100%" }}
                                    >
                                      <select
                                        style={{
                                          height: "40px",
                                          width: "100%",
                                          border: "1px solid #333",
                                          borderRadius: "5px",
                                          padding: "0 15px",
                                        }}
                                        value={buttonTypePc}
                                        onChange={(e) =>
                                          setButtonTypePc(e.target.value)
                                        }
                                      >
                                        <option value={1}>
                                          ボタンとタイトル
                                        </option>
                                        <option value={2}>ボタンのみ</option>
                                      </select>
                                    </div>
                                  </div>
                                  <span className="error-message subtile"></span>
                                </div>
                                <div className="field-add-bot">
                                  <div className="add-bot_field-container">
                                    <span className="label-field">
                                      右マージン{" "}
                                    </span>
                                    <div
                                      style={{ display: "flex", width: "100%" }}
                                    >
                                      <input
                                        type="number"
                                        name="right_margin_pc"
                                        defaultValue={rightMarginPc}
                                        className="input-setting"
                                        placeholder="右マージン"
                                        onChange={(e) => {
                                          setRightMarginPc(e.target.value);
                                          // document.querySelector(
                                          //   ".error-message.title"
                                          // ).style.display = "none";
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <span className="error-message subtile"></span>
                                </div>
                                <div className="field-add-bot">
                                  <div className="add-bot_field-container">
                                    <span className="label-field">
                                      下マージン{" "}
                                    </span>
                                    <div
                                      style={{ display: "flex", width: "100%" }}
                                    >
                                      <input
                                        type="number"
                                        name="bottom_margin_pc"
                                        defaultValue={bottomMarginPc}
                                        className="input-setting"
                                        placeholder="下マージン"
                                        onChange={(e) => {
                                          setBottomMarginPc(e.target.value);
                                          // document.querySelector(
                                          //   ".error-message.title"
                                          // ).style.display = "none";
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <span className="error-message subtile"></span>
                                </div>
                              </div>
                            </div>
                          </CardBody>
                        </div>

                        {/* SmartPhone */}
                        <div style={{ width: "50%" }}>
                          <CardHeader>
                            <h4 style={{ margin: "10px 0" }}>スマートフォン</h4>
                          </CardHeader>
                          <CardBody>
                            <div className="add-bot-container">
                              <div className="bot-haft">
                                {/* <div className="field-add-bot">
                                <div className="add-bot_field-container">
                                  <span className="label-field">表示タイプ </span>
                                  <div 
                                    style={{ display: "flex", width: "100%" }}
                                  > 
                                    <select
                                      style={{
                                        height: "40px",
                                        width: "100%",
                                        border: "1px solid #333",
                                        borderRadius: "5px",
                                        padding: "0 15px",
                                      }}
                                      value={positionPc}
                                      onChange={(e) =>
                                        setDisplayTypeSp(e.target.value)
                                      }
                                    >
                                      <option value={1}>リロード</option>
                                      <option value={2}>非表示</option>
                                    </select>
                                  </div>
                                </div>
                                <span className="error-message subtile"></span>
                              </div>  */}

                                <div className="field-add-bot">
                                  <div className="add-bot_field-container">
                                    <span className="label-field">
                                      設置場所{" "}
                                    </span>
                                    <div
                                      style={{ display: "flex", width: "100%" }}
                                    >
                                      <select
                                        style={{
                                          height: "40px",
                                          width: "100%",
                                          border: "1px solid #333",
                                          borderRadius: "5px",
                                          padding: "0 15px",
                                        }}
                                        value={positionSp}
                                        onChange={(e) =>
                                          setPositionSp(e.target.value)
                                        }
                                      >
                                        <option value={1}>底辺に設置</option>
                                        <option value={2}>右辺に設置</option>
                                      </select>
                                    </div>
                                  </div>
                                  <span className="error-message subtile"></span>
                                </div>

                                {positionSp === "2" && (
                                  <div className="field-add-bot">
                                    <div className="add-bot_field-container">
                                      <span className="label-field">
                                        タイトル{" "}
                                      </span>
                                      <div
                                        style={{
                                          display: "flex",
                                          width: "100%",
                                        }}
                                      >
                                        <input
                                          type="text"
                                          name="right_position_sp_title"
                                          className="input-setting"
                                          defaultValue={rightSpTitle}
                                          placeholder="タイトル"
                                          onChange={(e) => {
                                            setRightSpTitle(e.target.value);
                                            // document.querySelector(
                                            //   ".error-message.title"
                                            // ).style.display = "none";
                                          }}
                                        />
                                      </div>
                                    </div>
                                    <span className="error-message subtile"></span>
                                  </div>
                                )}

                                <div className="field-add-bot">
                                  <div className="add-bot_field-container">
                                    <span className="label-field">
                                      ボタン内容{" "}
                                    </span>
                                    <div
                                      style={{ display: "flex", width: "100%" }}
                                    >
                                      <select
                                        style={{
                                          height: "40px",
                                          width: "100%",
                                          border: "1px solid #333",
                                          borderRadius: "5px",
                                          padding: "0 15px",
                                        }}
                                        value={buttonTypeSp}
                                        onChange={(e) =>
                                          setButtonTypeSp(e.target.value)
                                        }
                                      >
                                        <option value={1}>
                                          ボタンとタイトル
                                        </option>
                                        <option value={2}>ボタンのみ</option>
                                      </select>
                                    </div>
                                  </div>
                                  <span className="error-message subtile"></span>
                                </div>
                                <div className="field-add-bot">
                                  <div className="add-bot_field-container">
                                    <span className="label-field">
                                      右マージン{" "}
                                    </span>
                                    <div
                                      style={{ display: "flex", width: "100%" }}
                                    >
                                      <input
                                        type="number"
                                        name="right_margin_sp"
                                        defaultValue={rightMarginSp}
                                        className="input-setting"
                                        placeholder="右マージン"
                                        onChange={(e) => {
                                          setRightMarginSp(e.target.value);
                                          // document.querySelector(
                                          //   ".error-message.title"
                                          // ).style.display = "none";
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <span className="error-message subtile"></span>
                                </div>
                                <div className="field-add-bot">
                                  <div className="add-bot_field-container">
                                    <span className="label-field">
                                      下マージン{" "}
                                    </span>
                                    <div
                                      style={{ display: "flex", width: "100%" }}
                                    >
                                      <input
                                        type="number"
                                        name="bottom_margin_sp"
                                        defaultValue={bottomMarginSp}
                                        className="input-setting"
                                        placeholder="下マージン"
                                        onChange={(e) => {
                                          setBottomMarginSp(e.target.value);
                                          // document.querySelector(
                                          //   ".error-message.title"
                                          // ).style.display = "none";
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <span className="error-message subtile"></span>
                                </div>
                              </div>
                            </div>
                          </CardBody>
                        </div>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          marginTop: "40px",
                          padding: "0 20px",
                        }}
                      >
                        <div className="btn-wrapper">
                          <button
                            type="button"
                            className="btn btn-preview"
                            onClick={updateDesignSetting}
                          >
                            保存2
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </Card>
          </Col>
        </Row>
        {/* preview */}
        <div
          id="sp-container"
          className="sp-container"
          style={{ display: !isOpenPreview && "none" }}
        >
          <div
            id="sp-header"
            style={{ backgroundColor: mainColor }}
            className="sp-header"
            onClick={handleTogglePreview}
          >
            <div className="sp-header-left">
              <div className="sp-header-left-avatar sp-avatar">
                <img src={botImage} alt="" />
              </div>
              <div className="sp-header-left-label">
                <div className="sp-header-left-label-sub-title">{subtitle}</div>
                <div className="sp-header-left-label-title">{title}</div>
              </div>
            </div>
            <div className="sp-header-right">
              <div className="sp-header-right-arrow">
                {isOpenPreview ? (
                  <MDBIcon fas icon="chevron-down" />
                ) : (
                  <MDBIcon fas icon="chevron-up" />
                )}
              </div>
            </div>
          </div>
          <div id="sp-body" className="sp-body"></div>
        </div>
        {/* end preview */}
        <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
          <div
            style={{ width: "300px", textAlign: "center", color: "#51cbce" }}
          >
            <span style={{ fontSize: "16px" }}>{msgNoti}</span>
          </div>
        </ModalNoti>
        <Link to={"/admin/scenario-list"}>
          <button style={{ display: "none" }}>SCL</button>
        </Link>
      </div>
    </div>
  );
}

export default DesignChatbot;
{
  /* <div
                      style={{
                        width: "100%",
                        padding: "0 50px",
                      }}
                    >
                      <div className="field-add-bot">
                                <div className="add-bot_field-container">
                                  <span className="label-field">サイズ </span>
                                  <div
                                    style={{
                                      display: "flex",
                                      width: "100%",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    
                                    <input
                                      type="number"
                                      name="width_pc"
                                      className="input-setting2"
                                      placeholder="幅"
                                      onChange={(e) => {
                                        setWidthPc(e.target.value);
                                        // document.querySelector(
                                        //   ".error-message.widthPc"
                                        // ).style.display = "none";
                                      }}
                                    />
                                    <input
                                      type="number"
                                      name="height_pc"
                                      className="input-setting2"
                                      placeholder="高さ"
                                      onChange={(e) => {
                                        setHeightPc(e.target.value);
                                        // document.querySelector(
                                        //   ".error-message.title"
                                        // ).style.display = "none";
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                    </div> */
}
