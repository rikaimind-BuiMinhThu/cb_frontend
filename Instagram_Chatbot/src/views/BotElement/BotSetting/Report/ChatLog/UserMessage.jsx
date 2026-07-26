/* cSpell: disable */
import moment from "moment";
import React, { useEffect, useState } from "react";
import api from "api/api-management";
import InputCustom from "../../ScenarioSetting/scenarioComon/InputCustom";

import { Checkbox, Radio, Slider, Calendar, Row, Select, Col } from "antd";
import SelectCustom from "../../ScenarioSetting/scenarioComon/SelectCustom";
import { MDBIcon } from "mdbreact";
import { Button } from "reactstrap";
import DatePickerCustom from "../../ScenarioSetting/scenarioComon/DatePickerCustom";

import locale from "antd/es/date-picker/locale/ja_JP";
import CheckboxCustom from "../../ScenarioSetting/scenarioComon/CheckboxCustom";

import american_express from "assets/img/payment-method/american_express.png";
import diner_club from "assets/img/payment-method/diner_club.png";
import discover from "assets/img/payment-method/discover.png";
import jcb from "assets/img/payment-method/jcb.png";
import master_card from "assets/img/payment-method/master_card.png";
import visa from "assets/img/payment-method/visa.png";
import InputNum from "../../ScenarioSetting/scenarioComon/InputNum";
import { REGEXP } from "../../PreviewComponent/Constants";

import cvcIcon from "assets/img/cvc-icon.png";
import ModalNoti from "views/Popup/ModalNoti";
let dataHourFixed = [];
for (let i = 0; i <= 23; i++) {
  if (i < 10) {
    dataHourFixed.push({
      key: `0${i}`,
      value: `0${i}`,
    });
  } else {
    dataHourFixed.push({
      key: i + "",
      value: i + "",
    });
  }
}

let dataMinutes = [];
for (let i = 0; i <= 59; i++) {
  if (i < 10) {
    dataMinutes.push({
      key: `0${i}`,
      value: `0${i}`,
    });
  } else {
    dataMinutes.push({
      key: i + "",
      value: i + "",
    });
  }
}

let dataYearFixed = [];
for (let i = 1935; i <= 2072; i++) {
  dataYearFixed.push({
    key: i + "",
    value: i + "",
  });
}

let dataMonth = [];
for (let i = 1; i <= 12; i++) {
  if (i < 10) {
    dataMonth.push({
      key: `0${i}`,
      value: `0${i}`,
    });
  } else {
    dataMonth.push({
      key: i + "",
      value: i + "",
    });
  }
}

let dataDay = [];
for (let i = 1; i <= 31; i++) {
  if (i < 10) {
    dataDay.push({
      key: `0${i}`,
      value: `0${i}`,
    });
  } else {
    dataDay.push({
      key: i + "",
      value: i + "",
    });
  }
}

let dataPaymentMethod = [
  {
    key: "visa",
    value: <img alt="" src={visa} />,
  },
  {
    key: "jcb",
    value: <img alt="" src={jcb} />,
  },
  {
    key: "master_card",
    value: <img alt="" src={master_card} />,
  },
  {
    key: "american_express",
    value: <img alt="" src={american_express} />,
  },
  {
    key: "diner_club",
    value: <img alt="" src={diner_club} />,
  },
  {
    key: "discover",
    value: <img alt="" src={discover} />,
  },
];
let SCAN_REGEX = /\{\{(.*?)\}\}/g;
export default function UserMessage({
  messageContentProps,
  onChangeValue,
  disabled = false,
  errorsProps,
  indexMessage,
  captcha,
  onClickNext,
  displayButtonNext,
  onOpen,
  dataPrefectures,
  variables,
}) {
  const [dataHour, setDataHour] = useState(dataHourFixed);
  const [dataYear, setDataYear] = useState(dataYearFixed);
  const [dataCity, setDataCity] = useState([]);
  // const [dataPrefectures, setDataPrefectures] = useState([...dataPrefectures]);
  const [messageContent, setMessageContent] = useState(messageContentProps);
  const [errors, setErrors] = useState(errorsProps);

  console.log('messageContent', messageContent);

  function loadCaptcha(indexContent) {
    if (
      document.getElementById(`captcha-${indexMessage}-${indexContent}`) &&
      captcha.length !== 0
    )
      document.getElementById(
        `captcha-${indexMessage}-${indexContent}`
      ).innerHTML =
        captcha.filter(
          (item) =>
            item.index === indexMessage && item.indexContent === indexContent
        )?.[0]?.data || "";
  }

  const stringNullOrEmpty = (string) => {
    if (
      string === undefined ||
      string === null ||
      (string && (string + "")?.trim() === "") ||
      string === ""
    )
      return true;
    return false;
  };

  useEffect(() => {
    if (messageContent.length === 1) {
      let message = messageContent[0];
      if (
        (message.type === "card_payment_radio_button" &&
          stringNullOrEmpty(message?.[message.type]?.initial_selection) &&
          stringNullOrEmpty(
            message?.[message.type]?.initial_selection_picture
          )) ||
        message.type === "product_purchase_radio_button" ||
        (message.type === "card_payment_radio_button" &&
          (message?.[message.type].type !== "picture_radio"
            ? stringNullOrEmpty(message?.[message.type]?.initial_selection) &&
              !message?.[message.type]?.card_linked_setting.includes(
                message?.[message.type]?.initial_selection
              )
            : stringNullOrEmpty(
                message?.[message.type]?.initial_selection_picture
              ) &&
              message?.[message.type]?.card_linked_setting_picture !==
                message?.[message.type]?.initial_selection_picture)) ||
        (message.type === "carousel" && message?.[message.type].require) ||
        (message.type === "radio_button" &&
          !message[message.type].initial_selection)
      ) {
        displayButtonNext(false);
      } else {
        displayButtonNext(true);
      }
    } else {
      displayButtonNext(true);
    }
  }, []);

  useEffect(() => {
    setErrors(errorsProps);
  }, [errorsProps]);

  useEffect(() => {
    setMessageContent(messageContentProps);
  }, [messageContentProps]);

  useEffect(() => {
    messageContent.forEach((content, indexContent) => {
      if (content.type === "calendar") {
        let calendar = content.calendar;
        if (calendar.initial_selection && calendar.type !== "start_end_date") {
          let i = 0;
          let date_select = "";

          date_select = moment().add(i, "days").format("YYYY-MM-DD");
          while (handleDisableDateCalendar(moment().add(i, "days"), calendar)) {
            if (i === 100) {
              date_select = null;
              break;
            }
            date_select = moment()
              .add(i + 1, "days")
              .format("YYYY-MM-DD");
            i++;
          }
          // calendar.date_select = date_select;
          onChangeValue(indexContent, content.type, date_select, "date_select");
        } else if (
          calendar.initial_selection &&
          calendar.type === "start_end_date"
        ) {
          let i = 0;
          calendar.start_date_select = moment();
          calendar.end_date_select = moment().add(1, "days");
          while (handleDisableDateCalendar(moment().add(i, "days"), calendar)) {
            if (i === 100) {
              calendar.start_date_select = null;
              calendar.end_date_select = null;
              break;
            }
            calendar.start_date_select = moment().add(i + 1, "days");
            calendar.end_date_select = moment().add(i + 1, "days");
            i++;
          }
        }
      } else if (content.type === "checkbox") {
        let checkbox = content.checkbox;
        if (checkbox.all_item_checked && checkbox.type !== "checkbox_img") {
          checkbox[checkbox.type].forEach((item) => {
            checkbox.checkedValue.push(item.id);
          });
          onChangeValue(
            indexContent,
            content.type,
            checkbox.checkedValue,
            "checkedValue"
          );
        } else if (
          checkbox.all_item_checked &&
          checkbox.type === "checkbox_img"
        ) {
          checkbox[checkbox.type].forEach((item) => {
            item.contents.forEach((itemContent) => {
              checkbox.initial_selection_picture.push(
                `${item.id}-${itemContent.id}`
              );
            });
          });
          onChangeValue(
            indexContent,
            content.type,
            checkbox.initial_selection_picture,
            "initial_selection_picture"
          );
        }
      } else if (content.type === "radio_button") {
        let radioButton = content.radio_button;
        if (radioButton.initial_selection) {
          onChangeValue(
            indexContent,
            content.type,
            radioButton.initial_selection,
            "initial_selection"
          );
        }
      } else if (content.type === "card_payment_radio_button") {
        let cardPaymentRadioButton = content.card_payment_radio_button;
        if (
          cardPaymentRadioButton.type !== "picture_radio" &&
          cardPaymentRadioButton.initial_selection
        ) {
          onChangeValue(
            indexContent,
            content.type,
            cardPaymentRadioButton.initial_selection,
            "initial_selection"
          );
        } else if (cardPaymentRadioButton.initial_selection_picture) {
          onChangeValue(
            indexContent,
            content.type,
            cardPaymentRadioButton.initial_selection_picture,
            "initial_selection_picture"
          );
        }
      } else if (content.type === "product_purchase") {
        let productPurchase = content.product_purchase;
        onChangeValue(
          indexContent,
          content.type,
          productPurchase.initial_selection,
          "initial_selection"
        );
      }
    });
  }, []);

  function botUploadFile() {
    document.getElementById("ss-bot-file-upload-preview").click();
  }

  function getBaseUrl(event, indexContent) {
    var file = event.target.files[0];
    let urlFile = URL.createObjectURL(file);
    onChangeValue(indexContent, "attaching_file", file.name, "value");
    onChangeValue(indexContent, "attaching_file", urlFile, "linkFile");
    // var baseString;
    // var imgUrl = URL.createObjectURL(event.target.files[0]);
    // if (
    //   file?.type === 'image/png' ||
    //   file?.type === 'image/jpeg' ||
    //   file?.type === 'image/jpg' ||
    //   file?.type === 'image/gif' ||
    //   file?.type === 'image/img'
    // ) {
    //   document.getElementById(`bot-file-upload-img`).style.display = 'block';
    //   document.getElementById(`bot-file-upload-img`).src = imgUrl;
    // } else {
    //   document.getElementById(`bot-file-upload-img`).style.display = 'none';
    //   document.getElementById(`bot-file-upload-img`).src = '';
    // }

    // reader.onloadend = function () {
    //   baseString = reader.result;
    //   // setInputImage(baseString);
    //   // document.getElementById('ss-bot-file-upload-name').innerHTML = event.target.files[0].name;
    //   if (baseString !== undefined || baseString !== '') {
    //     // document.getElementById('newClientImgLogoErrMsg').style.display = 'none';

    //   }

    // };
    // reader.readAsDataURL(file);
  }

  const handleDisableDateCalendar = (current, calendar) => {
    if (
      calendar.end_date ||
      calendar.start_date ||
      calendar?.fixed_date?.length !== 0 ||
      calendar?.non_select_date_time?.length !== 0 ||
      calendar.aggregation_target_period_from ||
      calendar.aggregation_target_period_to ||
      calendar.end_date_select
    ) {
      return (
        moment(current, "YYYY-MM-DD") >=
          moment(calendar.end_date, "YYYY-MM-DD").add(1, "days") ||
        moment(current, "YYYY-MM-DD") <
          moment(calendar.start_date, "YYYY-MM-DD") ||
        (calendar.type === "start_end_date" &&
          moment(current, "YYYY-MM-DD").isSameOrAfter(
            moment(calendar.end_date_select, "YYYY-MM-DD")
          )) ||
        calendar.fixed_date?.find(
          (date) => date === moment(current).format("YYYY-MM-DD")
        ) ||
        moment(current) <
          (calendar.aggregation_target_period_from !== null &&
          calendar.aggregation_target_period_from !== undefined
            ? moment().add(calendar.aggregation_target_period_from - 1, "days")
            : moment(undefined, "YYYY-MM-DD")) ||
        moment(current) >
          (calendar.aggregation_target_period_to
            ? moment().add(calendar.aggregation_target_period_to, "days")
            : moment(undefined, "YYYY-MM-DD")) ||
        calendar.non_select_date_time?.find((type) => {
          if (type === "today") {
            return (
              moment().format("YYYY-MM-DD") ===
              moment(current).format("YYYY-MM-DD")
            );
          } else if (type === "tomorrow") {
            return (
              moment().add(1, "days").format("YYYY-MM-DD") ===
              moment(current).format("YYYY-MM-DD")
            );
          } else if (type === "day_after_tomorrow") {
            return (
              moment().add(2, "days").format("YYYY-MM-DD") ===
              moment(current).format("YYYY-MM-DD")
            );
          } else if (type === "past") {
            return (
              moment(current).format("YYYY-MM-DD") <
              moment().format("YYYY-MM-DD")
            );
          } else if (type === "future") {
            return (
              moment(current).format("YYYY-MM-DD") >
              moment().format("YYYY-MM-DD")
            );
          } else if (type === "moon") {
            return moment(current).day() === 1;
          } else if (type === "fire") {
            return moment(current).day() === 2;
          } else if (type === "water") {
            return moment(current).day() === 3;
          } else if (type === "wood") {
            return moment(current).day() === 4;
          } else if (type === "money") {
            return moment(current).day() === 5;
          } else if (type === "soil") {
            return moment(current).day() === 6;
          } else if (type === "day") {
            return moment(current).day() === 0;
          }
          return false;
        })
      );
    }
  };

  const handleDisableEndDateCalendar = (current, calendar) => {
    if (
      calendar.end_date ||
      calendar.start_date ||
      calendar?.fixed_date?.length !== 0 ||
      calendar?.non_select_date_time?.length !== 0 ||
      calendar.start_date_select ||
      calendar.specified_period_from ||
      calendar.specified_period_to ||
      calendar.aggregation_target_period_from ||
      calendar.aggregation_target_period_to
    ) {
      return (
        moment(current, "YYYY-MM-DD").isSameOrAfter(
          moment(calendar.end_date, "YYYY-MM-DD").add(1, "days")
        ) ||
        moment(current, "YYYY-MM-DD") <
          moment(calendar.start_date, "YYYY-MM-DD") ||
        (calendar.type === "start_end_date" &&
          moment(current, "YYYY-MM-DD").isSameOrBefore(
            moment(calendar.start_date_select, "YYYY-MM-DD")
          )) ||
        calendar.fixed_date?.find(
          (date) => date === moment(current).format("YYYY-MM-DD")
        ) ||
        moment(current) <
          (calendar.aggregation_target_period_from !== null &&
          calendar.aggregation_target_period_from !== undefined
            ? moment().add(calendar.aggregation_target_period_from - 1, "days")
            : moment(undefined, "YYYY-MM-DD")) ||
        moment(current) >
          (calendar.aggregation_target_period_to
            ? moment().add(calendar.aggregation_target_period_to, "days")
            : moment(undefined, "YYYY-MM-DD")) ||
        moment(current, "YYYY-MM-DD") <
          (calendar[calendar.type].specified_period_from
            ? moment(calendar.start_date_select, "YYYY-MM-DD").add(
                calendar[calendar.type].specified_period_from,
                "days"
              )
            : moment(undefined, "YYYY-MM-DD")) ||
        moment(current, "YYYY-MM-DD") >
          (calendar[calendar.type].specified_period_to
            ? moment(calendar.start_date_select, "YYYY-MM-DD").add(
                calendar[calendar.type].specified_period_to,
                "days"
              )
            : moment(undefined, "YYYY-MM-DD")) ||
        calendar.non_select_date_time?.find((type) => {
          if (type === "today") {
            return (
              moment().format("YYYY-MM-DD") ===
              moment(current).format("YYYY-MM-DD")
            );
          } else if (type === "tomorrow") {
            return (
              moment().add(1, "days").format("YYYY-MM-DD") ===
              moment(current).format("YYYY-MM-DD")
            );
          } else if (type === "day_after_tomorrow") {
            return (
              moment().add(2, "days").format("YYYY-MM-DD") ===
              moment(current).format("YYYY-MM-DD")
            );
          } else if (type === "past") {
            return (
              moment(current).format("YYYY-MM-DD") <
              moment().format("YYYY-MM-DD")
            );
          } else if (type === "future") {
            return (
              moment(current).format("YYYY-MM-DD") >
              moment().format("YYYY-MM-DD")
            );
          } else if (type === "moon") {
            return moment(current).day() === 1;
          } else if (type === "fire") {
            return moment(current).day() === 2;
          } else if (type === "water") {
            return moment(current).day() === 3;
          } else if (type === "wood") {
            return moment(current).day() === 4;
          } else if (type === "money") {
            return moment(current).day() === 5;
          } else if (type === "soil") {
            return moment(current).day() === 6;
          } else if (type === "day") {
            return moment(current).day() === 0;
          }
          return false;
        })
      );
    }
  };

  function replaceVariable(content) {
    content = content.replaceAll(SCAN_REGEX, (text, variable) => {
      if (variables.length !== 0) {
        let valueVar = "";
        for (let j = 0; j < variables.length; j++) {
          if (variables[j].variable_name === variable) {
            valueVar = variables[j].default_value;
          }
        }
        return valueVar;
      } else {
        return "";
      }
    });
    return content;
  }

  return (
    <div className="ss-user-message__content-wrapper">
      {messageContent?.map((content, indexContent) => {
        let textInput = content.text_input;
        let label = content.label;
        let textarea = content.textarea;
        let radioButton = content.radio_button;
        let checkbox = content.checkbox;
        let pullDown = content.pull_down;
        let zipCodeAddress = content.zip_code_address;
        let attachingFile = content.attaching_file;
        let calendar = content.calendar;
        let agreeTerm = content.agree_term;
        let carousel = content.carousel;
        let creditCardPayment = content.credit_card_payment;
        let capture = content.capture;
        let productPurchase = content.product_purchase;
        let productPurchaseRadioButton = content.product_purchase_radio_button;
        let slider = content.slider;
        let cardPaymentRadioButton = content.card_payment_radio_button;
        let labelNoTransition = content.label_no_transition;
        let buttonSubmit = content.button_submit;
        let contactForm = content.contact_form;
        if (
          content.type === "textarea" &&
          content.textarea &&
          content.textarea.invalid_input &&
          content.textarea.invalid_input.content
        ) {
          content.textarea.invalid_input.content = replaceVariable(
            content.textarea.invalid_input.content
          );
        }
        console.log('textInput', textInput);

        return (
          <React.Fragment key={indexContent}>
            {/* type == 'text_input' */}
            {content.type === "text_input" && (
              <div style={{ marginBottom: "10px" }}>
                {(textInput.title_require || textInput.require) && (
                  <div
                    className="ss-message__content--user-text-input-top"
                    style={{ marginBottom: "0px" }}
                  >
                    {textInput.title_require && (
                      <span className="ss-message__content--user-text-input-title">
                        {textInput.title}
                      </span>
                    )}
                    {textInput.require === true && (
                      <span className="ss-message__content--user-text-input-required">
                        ※必須
                      </span>
                    )}
                  </div>
                )}
                {textInput.type === "text" &&
                  (textInput.text.isSplitInput ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <InputCustom
                        disabled={true}
                        placeholder={textInput.text?.placeholderLeft}
                        style={{ width: "49%", marginBottom: "0px" }}
                        onChange={(value) =>
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            textInput.type,
                            "valueLeft"
                          )
                        }
                        value={textInput[textInput.type]?.valueLeft}
                      ></InputCustom>
                      <InputCustom
                        disabled={true}
                        placeholder={textInput.text?.placeholderRight}
                        style={{ width: "49%" }}
                        onChange={(value) =>
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            textInput.type,
                            "valueRight"
                          )
                        }
                        value={textInput[textInput.type]?.valueRight}
                      ></InputCustom>
                    </div>
                  ) : (
                    <React.Fragment>
                      <InputCustom
                        disabled={true}
                        style={{ marginBottom: "0px" }}
                        placeholder={textInput[textInput.type]?.placeholderLeft}
                        onChange={(value) =>
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            textInput.type,
                            "value"
                          )
                        }
                        value={textInput[textInput.type]?.value}
                      ></InputCustom>
                      {textInput.text?.placeholderRight && (
                        <span
                          style={{
                            fontWeight: "400",
                            color: "black",
                            fontSize: "12px",
                            marginLeft: "18px",
                          }}
                        >
                          {textInput.text?.placeholderRight}
                        </span>
                      )}
                    </React.Fragment>
                ))}
                {textInput.type === "phone_number" && (
                  <React.Fragment>
                    {textInput.phone_number.withHyphen === false ? (
                      <InputCustom
                        disabled={true}
                        // className="ss-message__content--user-text-input ss-input-value"
                        style={{ marginBottom: "0px" }}
                        placeholder={textInput[textInput.type]?.number}
                        onChange={(value) =>
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            textInput.type,
                            "value"
                          )
                        }
                        value={textInput[textInput.type]?.value}
                      ></InputCustom>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <InputCustom
                          disabled={true}
                          className="ss-message__content--user-text-input ss-input-value"
                          maxLength={3}
                          style={{ marginBottom: "0px", width: "32%" }}
                          placeholder={textInput[textInput.type]?.number1}
                          onChange={(value) => {
                            if (value.length === 3) {
                              document
                                .getElementById(
                                  "ss-user-message-phone_number_2"
                                )
                                .focus();
                              document
                                .getElementById(
                                  "ss-user-message-phone_number_2"
                                )
                                .select();
                            }
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              textInput.type,
                              "value1"
                            );
                          }}
                          value={textInput[textInput.type]?.value1}
                        ></InputCustom>
                        <InputCustom
                          id="ss-user-message-phone_number_2"
                          disabled={true}
                          className="ss-message__content--user-text-input ss-input-value"
                          style={{ marginBottom: "0px", width: "32%" }}
                          maxLength={4}
                          placeholder={textInput[textInput.type]?.number2}
                          onChange={(value) => {
                            if (value.length === 4) {
                              document
                                .getElementById(
                                  "ss-user-message-phone_number_3"
                                )
                                .focus();
                              document
                                .getElementById(
                                  "ss-user-message-phone_number_3"
                                )
                                .select();
                            }
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              textInput.type,
                              "value2"
                            );
                          }}
                          value={textInput[textInput.type]?.value2}
                        ></InputCustom>
                        <InputCustom
                          id="ss-user-message-phone_number_3"
                          disabled={true}
                          // className="ss-message__content--user-text-input ss-input-value"
                          style={{ marginBottom: "0px", width: "32%" }}
                          placeholder={textInput[textInput.type]?.number3}
                          maxLength={4}
                          onChange={(value) =>
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              textInput.type,
                              "value3"
                            )
                          }
                          value={textInput[textInput.type]?.value3}
                        ></InputCustom>
                      </div>
                    )}
                  </React.Fragment>
                )}
                {textInput.type === "password" && (
                  <React.Fragment>
                    <InputCustom
                      disabled={true}
                      type="password"
                      // className="ss-message__content--user-text-input ss-input-value"
                      style={{ marginBottom: "0px" }}
                      placeholder={textInput[textInput.type]?.password}
                      onChange={(value) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          value,
                          textInput.type,
                          "value"
                        )
                      }
                      value={textInput[textInput.type]?.value}
                    ></InputCustom>
                  </React.Fragment>
                )}
                {(textInput.type === "urls" ||
                  textInput.type === "email_address") && (
                  <React.Fragment>
                    <InputCustom
                      disabled={true}
                      // className="ss-message__content--user-text-input ss-input-value"
                      style={{ marginBottom: "0px" }}
                      placeholder={textInput[textInput.type].placeholder}
                      onChange={(value) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          value,
                          textInput.type,
                          "value"
                        )
                      }
                      value={textInput[textInput.type]?.value}
                    ></InputCustom>
                  </React.Fragment>
                )}
                {textInput.type === "email_confirmation" && (
                  <>
                    <InputCustom
                      style={{ marginBottom: "5px" }}
                      disabled={true}
                      placeholder={textInput[textInput.type].cfEmlAdd_email}
                      onChange={(value) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          value,
                          textInput.type,
                          "value"
                        )
                      }
                      value={textInput[textInput.type]?.value}
                    />
                    <InputCustom
                      disabled={true}
                      placeholder={
                        textInput[textInput.type].cfEmlAdd_confirm_email
                      }
                      onChange={(value) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          value,
                          textInput.type,
                          "valueConfirm"
                        )
                      }
                      value={textInput[textInput.type]?.valueConfirm}
                    />
                  </>
                )}
                {textInput.type === "password_confirmation" && (
                  <>
                    <InputCustom
                      style={{ marginBottom: "5px" }}
                      disabled={true}
                      type="password"
                      placeholder={textInput[textInput.type].password}
                      onChange={(value) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          value,
                          textInput.type,
                          "value"
                        )
                      }
                      value={textInput[textInput.type]?.value}
                    />
                    <InputCustom
                      disabled={true}
                      type="password"
                      placeholder={textInput[textInput.type].confirm_password}
                      onChange={(value) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          value,
                          textInput.type,
                          "valueConfirm"
                        )
                      }
                      value={textInput[textInput.type]?.valueConfirm}
                    />
                  </>
                )}
                {errors?.[
                  `message${indexMessage}_content${indexContent}_${content.type}_${textInput.type}`
                ] && (
                  <div style={{ color: "#FF7E00", fontSize: "12px" }}>
                    {
                      errors?.[
                        `message${indexMessage}_content${indexContent}_${content.type}_${textInput.type}`
                      ]
                    }
                  </div>
                )}
              </div>
            )}
            {content.type === 'image' && (
              <img src={content?.image?.imageURL} alt="image" style={{ width: content?.image?.image_width, height: content?.image?.image_height }} />
            )}
            {/* type == 'label' */}
            {content.type === "label" && label.lbl_content && (
              <div style={{ marginBottom: "10px" }}>
                <div className="ss-message__content--user-label-top">
                  <span className="ss-message__content--user-label-title">
                    {label.lbl_content}
                  </span>
                  {label?.require === true && (
                    <span className="ss-message__content--user-required">
                      ※必須
                    </span>
                  )}
                </div>
              </div>
            )}
            {/* type == 'textarea' */}
            {content.type === "textarea" && (
              <div style={{ marginBottom: "10px" }}>
                {(textarea.title_require || textarea.require) && (
                  <div
                    className="ss-message__content--user-textarea-top"
                    style={{ marginBottom: "0px" }}
                  >
                    {textarea.title_require && (
                      <span className="ss-message__content--user-textarea-title">
                        {textarea.title}
                      </span>
                    )}
                    {textarea.require === true &&
                      textarea?.type === "text_input" && (
                        <span className="ss-message__content--user-text-input-required">
                          ※必須
                        </span>
                      )}
                  </div>
                )}
                {(textarea?.type === "text_input" ||
                  textarea?.type === "invalid_input") && (
                  <textarea
                    disabled={disabled || textarea?.type === "invalid_input"}
                    className="ss-message__content--user-textarea ss-input-value"
                    placeholder={textarea[textarea.type]?.content}
                    rows={3}
                    onChange={(e) =>
                      onChangeValue(
                        indexContent,
                        content.type,
                        e.target.value,
                        textarea?.type,
                        "value"
                      )
                    }
                    value={
                      textarea?.type === "invalid_input"
                        ? textarea[textarea.type]?.content
                        : textarea[textarea.type]?.value
                    }
                  ></textarea>
                )}
                {errors?.[
                  `message${indexMessage}_content${indexContent}_${content.type}`
                ] && (
                  <div style={{ color: "#FF7E00", fontSize: "12px" }}>
                    {
                      errors?.[
                        `message${indexMessage}_content${indexContent}_${content.type}`
                      ]
                    }
                  </div>
                )}
              </div>
            )}
            {/* type == 'radio_button' */}
            {content.type === "radio_button" && (
              <div style={{ marginBottom: "10px" }}>
                {(radioButton.title_require || radioButton.require) && (
                  <div
                    className="ss-message__content--user-radio_button-top"
                    style={{ marginBottom: "0px" }}
                  >
                    {radioButton.title_require && (
                      <span className="ss-message__content--user-radio_button-title">
                        {radioButton.title}
                      </span>
                    )}
                    {radioButton.require === true && (
                      <span className="ss-message__content--user-text-input-required">
                        ※必須
                      </span>
                    )}
                  </div>
                )}
                <div className="ss-message__content--user-radio_button-wrapper">
                  {radioButton.type === "default" &&
                    radioButton[radioButton.type].map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="ss-message__content--user-radio_button"
                        >
                          <input
                            disabled={true}
                            type="radio"
                            id="ss-message__content--user-radio_button"
                            checked={radioButton.initial_selection == item.value}
                            onChange={() => {
                              onChangeValue(
                                indexContent,
                                content.type,
                                item.value,
                                "initial_selection"
                              );
                              if (messageContent.length === 1) onClickNext();
                            }}
                          />
                          {item.text && (
                            <label htmlFor="ss-message__content--user-radio_button">
                              {item.text}
                            </label>
                          )}
                        </div>
                      );
                    })}
                  {radioButton.type === "radio_button_img" &&
                    radioButton[radioButton.type].map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="ss-message__content--user-radio_button--radio_button_img"
                        >
                          <input
                            disabled={true}
                            type="radio"
                            name="ss-message__content--user-radio_button--radio_button_img"
                            id="ss-message__content--user-radio_button--radio_button_img"
                            checked={
                              radioButton.initial_selection === item.value
                            }
                            onChange={() => {
                              onChangeValue(
                                indexContent,
                                content.type,
                                item.value,
                                "initial_selection"
                              );
                              if (messageContent.length === 1) onClickNext();
                            }}
                            value={radioButton.initial_selection}
                          />
                          <img src={item.img} alt="" />
                          {item.text && (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              {item.text}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  {radioButton.type === "consume_api_response" && (
                    <>
                      <div className="ss-message__content--user-radio_button">
                        <input
                          type="radio"
                          name="ss-message__content--user-radio_button"
                          id="ss-message__content--user-radio_button"
                        />
                        <label htmlFor="ss-message__content--user-radio_button">
                          ラベル
                        </label>
                      </div>
                      <div className="ss-message__content--user-radio_button">
                        <input
                          type="radio"
                          name="ss-message__content--user-radio_button"
                          id="ss-message__content--user-radio_button"
                        />
                        <label htmlFor="ss-message__content--user-radio_button">
                          ラベル
                        </label>
                      </div>
                    </>
                  )}
                  {radioButton.type === "block_style" &&
                    radioButton[radioButton.type].map((item, index) => {
                      return (
                        item.text && (
                          <div
                            style={{
                              marginBottom: "10px",
                              cursor: "pointer",
                              backgroundColor: radioButton.value
                                ? radioButton.value === item.id
                                  ? "#347AED"
                                  : ""
                                : radioButton.initial_selection === item.id
                                ? "#347AED"
                                : "",
                            }}
                            key={index}
                            className="ss-message__content--user-radio_button--block_style"
                            onClick={() => {
                              onChangeValue(
                                indexContent,
                                content.type,
                                item.id,
                                "initial_selection"
                              );
                              if (messageContent.length === 1) onClickNext();
                            }}
                          >
                            <span>{item.text}</span>
                          </div>
                        )
                      );
                    })}
                </div>
              </div>
            )}
            {/* type == 'checkbox' */}
            {content.type === "checkbox" && (
              <div style={{ marginBottom: "10px" }}>
                {(checkbox.title_require || checkbox.require) && (
                  <div
                    className="ss-message__content--user-checkbox-top"
                    style={{ marginBottom: "0px" }}
                  >
                    {checkbox.title_require && (
                      <span className="ss-message__content--user-checkbox-title">
                        {checkbox.title}
                      </span>
                    )}
                    {checkbox.require === true && (
                      <span className="ss-message__content--user-text-input-required">
                        ※必須
                      </span>
                    )}
                  </div>
                )}
                <div>
                  {checkbox.type === "default" && (
                    <Checkbox.Group
                      style={{ width: "100%" }}
                      disabled={true}
                      onChange={(value) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          value,
                          "checkedValue"
                        )
                      }
                      value={checkbox.checkedValue}
                    >
                      {checkbox[checkbox.type].map((item, index) => {
                        return (
                          <div
                            key={index}
                            className="ss-message__content--user-checkbox"
                          >
                            <Checkbox value={item.id}>
                              <label htmlFor="ss-message__content--user-checkbox">
                                {item.text}
                              </label>
                            </Checkbox>
                          </div>
                        );
                      })}
                    </Checkbox.Group>
                  )}
                  {/* {checkbox.type === 'checkbox_img' && (
                    checkbox[checkbox.type].map((item, index) => {
                      return <div key={index} className="ss-message__content--user-checkbox--checkbox_img" style={{ marginBottom: '10px' }}>
                        <CheckboxCustom
                          disabled={true}
                          onChange={() => onChangeValueCheckbox(indexContent, content.type, item.id, 'checkedValue')}
                          value={checkbox.checkedValue.includes(item.id)}
                          isOnChange={false}
                        />
                        <img
                          src={item.img}
                          alt=""
                        />
                        <div style={{ textAlign: 'center' }}>{item.text}</div>
                      </div>
                    })
                  )} */}
                  {checkbox.type === "checkbox_img" && checkbox[checkbox.type] && (
                    <Checkbox.Group
                      disabled={true}
                      style={{ width: "100%", fontSize: "14px" }}
                      className="ss-user-preview-product-purchase-checkbox-group-type-text_image ss-user-overview-product-purchase-style-width"
                      onChange={(value) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          value,
                          "initial_selection_picture"
                        )
                      }
                      value={checkbox.initial_selection_picture}
                    >
                      {checkbox[checkbox.type].map(
                        (itemCheckboxImg, indexCheckboxImg) => {
                          return (
                            <div
                              key={indexCheckboxImg}
                              style={{ color: "#6789A6", display: "flex" }}
                            >
                              {itemCheckboxImg.contents &&
                                itemCheckboxImg.contents.map(
                                  (itemCheckContent, indexCheckboxContent) => {
                                    return (
                                      <Checkbox
                                        value={`${itemCheckboxImg.id}-${itemCheckContent.id}`}
                                        key={indexCheckboxContent}
                                        style={{ marginRight: "0px" }}
                                      >
                                        <img
                                          alt=""
                                          src={itemCheckContent.file_url}
                                        ></img>
                                        <div
                                          style={{
                                            textAlign: "center",
                                            fontSize: "14px",
                                            color: "#6789A6",
                                            fontWeight: "700",
                                          }}
                                        >
                                          {itemCheckContent.text}
                                        </div>
                                      </Checkbox>
                                    );
                                  }
                                )}
                            </div>
                          );
                        }
                      )}
                    </Checkbox.Group>
                  )}
                  {checkbox.type === "consume_api_response" && (
                    <>
                      <div className="ss-message__content--user-checkbox">
                        <input
                          type="checkbox"
                          name="ss-message__content--user-checkbox"
                          id="ss-message__content--user-checkbox"
                        />
                        <label htmlFor="ss-message__content--user-checkbox">
                          ラベル
                        </label>
                      </div>
                      <div className="ss-message__content--user-checkbox">
                        <input
                          type="checkbox"
                          name="ss-message__content--user-checkbox"
                          id="ss-message__content--user-checkbox"
                        />
                        <label htmlFor="ss-message__content--user-checkbox">
                          ラベル
                        </label>
                      </div>
                    </>
                  )}
                </div>
                {errors?.[
                  `message${indexMessage}_content${indexContent}_${content.type}`
                ] && (
                  <div style={{ color: "#FF7E00", fontSize: "12px" }}>
                    {
                      errors?.[
                        `message${indexMessage}_content${indexContent}_${content.type}`
                      ]
                    }
                  </div>
                )}
              </div>
            )}
            {/* type == 'pull_down' */}
            {content.type === "pull_down" && (
              <div style={{ marginBottom: "10px" }}>
                {(pullDown.title_require || pullDown.require) && (
                  <div
                    className="ss-message__content--user-pull_down-top"
                    style={{ marginBottom: "0px" }}
                  >
                    {pullDown.title_require && (
                      <span className="ss-message__content--user-pull_down-title">
                        {pullDown.title}
                      </span>
                    )}
                    {pullDown.require === true && (
                      <span className="ss-message__content--user-text-input-required">
                        ※必須
                      </span>
                    )}
                  </div>
                )}
                <div className="ss-message__content--user-pull_down-wrapper">
                  {pullDown.type === "customization" && (
                    <>
                      <div className="ss-message__content--user-pull_down--customization">
                        <div
                          className="ss-message__content--user-pull_down-comment"
                          style={{ marginBottom: "4px" }}
                        >
                          <span>{pullDown[pullDown.type].title_comment}</span>
                        </div>
                        <div className="">
                          {pullDown[pullDown.type].is_comment === false ? (
                            <div className="ss-message__content--user-pull_down-col col-12">
                              <SelectCustom
                                disabled={true}
                                data={
                                  pullDown[pullDown.type]
                                    .options_without_comment
                                }
                                keyValue="value"
                                style={{ width: "100%" }}
                                placeholder={
                                  pullDown[pullDown.type].display_unselected
                                }
                                nameValue="text"
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    pullDown.type,
                                    "value"
                                  )
                                }
                                value={pullDown[pullDown.type].value}
                              />
                            </div>
                          ) : (
                            <div
                              className="ss-message__content--user-pull_down-col col-12"
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <SelectCustom
                                disabled={true}
                                data={
                                  pullDown[pullDown.type].options_with_comment
                                }
                                keyValue="value"
                                style={{ width: "49%" }}
                                placeholder={
                                  pullDown[pullDown.type].display_unselected
                                }
                                nameValue="text"
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    pullDown.type,
                                    "valueLeft"
                                  )
                                }
                                value={pullDown[pullDown.type].valueLeft}
                              />
                              <SelectCustom
                                disabled={true}
                                data={
                                  pullDown[pullDown.type].options_with_comment
                                }
                                keyValue="text2"
                                style={{ width: "49%" }}
                                placeholder={
                                  pullDown[pullDown.type].display_unselected
                                }
                                nameValue="text2"
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    pullDown.type,
                                    "valueRight"
                                  )
                                }
                                value={pullDown[pullDown.type].valueRight}
                              />
                            </div>
                          )}
                        </div>
                        <div
                          className="ss-message__content--user-pull_down-comment"
                          style={{ marginTop: "4px" }}
                        >
                          <span>{pullDown[pullDown.type].comment}</span>
                        </div>
                      </div>
                    </>
                  )}
                  {pullDown.type === "time_hm" && (
                    <React.Fragment>
                      <div className="ss-message__content--user-pull_down--time_hm">
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <SelectCustom
                            disabled={true}
                            data={dataHour.filter(
                              (item) =>
                                parseInt(item.value) >=
                                  (parseInt(pullDown[pullDown.type].start_at) ||
                                    "0") &&
                                parseInt(item.value) <=
                                  (parseInt(pullDown[pullDown.type].end_at) ||
                                    "23")
                            )}
                            placeholder="時"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueHour"
                              )
                            }
                            value={pullDown[pullDown.type].valueHour}
                          />
                          <SelectCustom
                            disabled={true}
                            data={dataMinutes}
                            placeholder="分"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueMinute"
                              )
                            }
                            value={pullDown[pullDown.type].valueMinute}
                          />
                          <div
                            className="ss-message__content--user-pull_down-comment"
                            style={{ marginTop: "4px", width: "32%" }}
                          >
                            <span>{pullDown[pullDown.type].comment}</span>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  )}
                  {(pullDown.type === "date_ymd" ||
                    pullDown.type === "dob_ymd") && (
                    <React.Fragment>
                      <div className="ss-message__content--user-pull_down--time_hm">
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                          }}
                        >
                          <SelectCustom
                            disabled={true}
                            data={dataYear.filter(
                              (item) =>
                                parseInt(item.value) >=
                                  (parseInt(
                                    pullDown[pullDown.type].start_year
                                  ) || "1935") &&
                                parseInt(item.value) <=
                                  (parseInt(pullDown[pullDown.type].end_year) ||
                                    "2072")
                            )}
                            placeholder="年"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueYear"
                              )
                            }
                            value={pullDown[pullDown.type].valueYear}
                          />
                          <SelectCustom
                            disabled={true}
                            data={dataMonth}
                            placeholder="月"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueMonth"
                              )
                            }
                            value={pullDown[pullDown.type].valueMonth}
                          />
                          <SelectCustom
                            disabled={true}
                            data={dataDay}
                            placeholder="日"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueDay"
                              )
                            }
                            value={pullDown[pullDown.type].valueDay}
                          />
                          <div
                            className="ss-message__content--user-pull_down-comment"
                            style={{ marginTop: "4px", width: "32%" }}
                          >
                            <span>{pullDown[pullDown.type].comment}</span>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  )}
                  {pullDown.type === "date_md" && (
                    <React.Fragment>
                      <div className="ss-message__content--user-pull_down--time_hm">
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <SelectCustom
                            disabled={true}
                            data={dataMonth}
                            placeholder="月"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueMonth"
                              )
                            }
                            value={pullDown[pullDown.type].valueMonth}
                          />
                          <SelectCustom
                            disabled={true}
                            data={dataDay}
                            placeholder="日"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueDay"
                              )
                            }
                            value={pullDown[pullDown.type].valueDay}
                          />
                          <div
                            className="ss-message__content--user-pull_down-comment"
                            style={{ marginTop: "4px", width: "32%" }}
                          >
                            <span>{pullDown[pullDown.type].comment}</span>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  )}
                  {(pullDown.type === "date_ym" ||
                    pullDown.type === "dob_ym") && (
                    <React.Fragment>
                      <div className="ss-message__content--user-pull_down--time_hm">
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <SelectCustom
                            disabled={true}
                            data={dataYear.filter(
                              (item) =>
                                parseInt(item.value) >=
                                  (parseInt(
                                    pullDown[pullDown.type].start_year
                                  ) || "1935") &&
                                parseInt(item.value) <=
                                  (parseInt(pullDown[pullDown.type].end_year) ||
                                    "2072")
                            )}
                            placeholder="年"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueYear"
                              )
                            }
                            value={pullDown[pullDown.type].valueYear}
                          />
                          <SelectCustom
                            disabled={true}
                            data={dataMonth}
                            placeholder="月"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueMonth"
                              )
                            }
                            value={pullDown[pullDown.type].valueMonth}
                          />
                          <div
                            className="ss-message__content--user-pull_down-comment"
                            style={{ marginTop: "4px", width: "32%" }}
                          >
                            <span>{pullDown[pullDown.type].comment}</span>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  )}
                  {pullDown.type === "date_ymd_hm" && (
                    <React.Fragment>
                      <div className="ss-message__content--user-pull_down--time_hm">
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                          }}
                        >
                          <SelectCustom
                            disabled={true}
                            data={dataYear.filter(
                              (item) =>
                                parseInt(item.value) >=
                                  (parseInt(
                                    pullDown[pullDown.type].start_year
                                  ) || "1935") &&
                                parseInt(item.value) <=
                                  (parseInt(pullDown[pullDown.type].end_year) ||
                                    "2072")
                            )}
                            placeholder="年"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueYear"
                              )
                            }
                            value={pullDown[pullDown.type].valueYear}
                          />
                          <SelectCustom
                            disabled={true}
                            data={dataMonth}
                            placeholder="月"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueMonth"
                              )
                            }
                            value={pullDown[pullDown.type].valueMonth}
                          />
                          <SelectCustom
                            disabled={true}
                            data={dataDay}
                            placeholder="日"
                            style={{ width: "32%", marginBottom: "10px" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueDay"
                              )
                            }
                            value={pullDown[pullDown.type].valueDay}
                          />
                          <SelectCustom
                            disabled={true}
                            data={dataHour.filter(
                              (item) =>
                                parseInt(item.value) >=
                                  (parseInt(pullDown[pullDown.type].start_at) ||
                                    "0") &&
                                parseInt(item.value) <=
                                  (parseInt(pullDown[pullDown.type].end_at) ||
                                    "23")
                            )}
                            placeholder="時"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueHour"
                              )
                            }
                            value={pullDown[pullDown.type].valueHour}
                          />
                          <SelectCustom
                            disabled={true}
                            data={dataMinutes}
                            placeholder="分"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueMinute"
                              )
                            }
                            value={pullDown[pullDown.type].valueMinute}
                          />
                          <div
                            className="ss-message__content--user-pull_down-comment"
                            style={{ marginTop: "4px", width: "32%" }}
                          >
                            <span>{pullDown[pullDown.type].comment}</span>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  )}
                  {pullDown.type === "timezone_from_to" && (
                    <React.Fragment>
                      <div className="ss-message__content--user-pull_down--time_hm">
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <SelectCustom
                            disabled={true}
                            data={dataHour.filter(
                              (item) =>
                                parseInt(item.value) >=
                                  (parseInt(pullDown[pullDown.type].start_at) ||
                                    "0") &&
                                parseInt(item.value) <=
                                  (parseInt(pullDown[pullDown.type].end_at) ||
                                    "23")
                            )}
                            placeholder="時"
                            style={{ width: "49%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueHour1"
                              )
                            }
                            value={pullDown[pullDown.type].valueHour1}
                          />
                          <SelectCustom
                            disabled={true}
                            data={dataMinutes}
                            placeholder="分"
                            style={{ width: "49%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueMinute1"
                              )
                            }
                            value={pullDown[pullDown.type].valueMinute1}
                          />
                        </div>
                        <div style={{ textAlign: "center" }}>~</div>
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <SelectCustom
                            disabled={true}
                            data={dataHour.filter(
                              (item) =>
                                parseInt(item.value) >=
                                  (parseInt(pullDown[pullDown.type].start_at) ||
                                    "0") &&
                                parseInt(item.value) <=
                                  (parseInt(pullDown[pullDown.type].end_at) ||
                                    "23")
                            )}
                            placeholder="時"
                            style={{ width: "49%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueHour2"
                              )
                            }
                            value={pullDown[pullDown.type].valueHour2}
                          />
                          <SelectCustom
                            disabled={true}
                            data={dataMinutes}
                            placeholder="分"
                            style={{ width: "49%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueMinute2"
                              )
                            }
                            value={pullDown[pullDown.type].valueMinute2}
                          />
                        </div>
                        <div
                          className="ss-message__content--user-pull_down-comment"
                          style={{ marginTop: "4px", width: "32%" }}
                        >
                          <span>{pullDown[pullDown.type].comment}</span>
                        </div>
                      </div>
                    </React.Fragment>
                  )}
                  {pullDown.type === "period_from_to" && (
                    <React.Fragment>
                      <div className="ss-message__content--user-pull_down--time_hm">
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <SelectCustom
                            disabled={true}
                            data={dataYear.filter(
                              (item) =>
                                parseInt(item.value) >=
                                  (parseInt(
                                    pullDown[pullDown.type].start_year
                                  ) || "1935") &&
                                parseInt(item.value) <=
                                  (parseInt(pullDown[pullDown.type].end_year) ||
                                    "2072")
                            )}
                            placeholder="年"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueYear1"
                              )
                            }
                            value={pullDown[pullDown.type].valueYear1}
                          />
                          <SelectCustom
                            disabled={true}
                            data={dataMonth}
                            placeholder="月"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueMonth1"
                              )
                            }
                            value={pullDown[pullDown.type].valueMonth1}
                          />
                          <SelectCustom
                            disabled={true}
                            data={dataDay}
                            placeholder="日"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueDay1"
                              )
                            }
                            value={pullDown[pullDown.type].valueDay1}
                          />
                        </div>
                        <div style={{ textAlign: "center" }}>~</div>
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <SelectCustom
                            disabled={true}
                            data={dataYear.filter(
                              (item) =>
                                parseInt(item.value) >=
                                  (parseInt(
                                    pullDown[pullDown.type].start_year
                                  ) || "1935") &&
                                parseInt(item.value) <=
                                  (parseInt(pullDown[pullDown.type].end_year) ||
                                    "2072")
                            )}
                            placeholder="年"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueYear2"
                              )
                            }
                            value={pullDown[pullDown.type].valueYear2}
                          />
                          <SelectCustom
                            disabled={true}
                            data={dataMonth}
                            placeholder="月"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueMonth2"
                              )
                            }
                            value={pullDown[pullDown.type].valueMonth2}
                          />
                          <SelectCustom
                            disabled={true}
                            data={dataDay}
                            placeholder="日"
                            style={{ width: "32%" }}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "valueDay2"
                              )
                            }
                            value={pullDown[pullDown.type].valueDay2}
                          />
                        </div>
                        <div
                          className="ss-message__content--user-pull_down-comment"
                          style={{ marginTop: "4px", width: "32%" }}
                        >
                          <span>{pullDown[pullDown.type].comment}</span>
                        </div>
                      </div>
                    </React.Fragment>
                  )}
                  {pullDown.type === "prefectures" && (
                    <React.Fragment>
                      <SelectCustom
                        disabled={true}
                        data={dataPrefectures}
                        placeholder="選択してください。"
                        style={{ width: "100%" }}
                        keyValue="name"
                        nameValue="name"
                        onChange={(value) =>
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            pullDown.type,
                            "value"
                          )
                        }
                        value={pullDown[pullDown.type]?.value}
                      />
                    </React.Fragment>
                  )}
                  {pullDown.type === "up_to_municipality" && (
                    <div>
                      <div style={{ fontWeight: "400", fontSize: "12px" }}>
                        {pullDown[pullDown.type].prefecture_comment}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <SelectCustom
                          disabled={true}
                          data={dataPrefectures}
                          placeholder="都道府県を選択"
                          style={{ width: "45%" }}
                          keyValue="name"
                          nameValue="name"
                          onChange={async (value) => {
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              pullDown.type,
                              "prefecture"
                            );
                            if (value) {
                              let prefecture_jis_code = dataPrefectures.find(
                                (item) => item.name === value
                              ).prefecture_jis_code;
                              api
                                .get(
                                  `/api/v1/cities?prefecture_jis_code=${prefecture_jis_code}`
                                )
                                .then((res) => {
                                  if (res.data.code === 1) {
                                    setDataCity(res.data.data);
                                  }
                                })
                                .catch((error) => {
                                  console.log(error);
                                });
                            } else {
                              onChangeValue(
                                indexContent,
                                content.type,
                                null,
                                pullDown.type,
                                "city"
                              );
                              setDataCity([]);
                            }
                          }}
                          value={pullDown[pullDown.type].prefecture}
                        />
                        <span>~</span>
                        <SelectCustom
                          disabled={true}
                          data={dataCity}
                          placeholder="市区町村を選択"
                          style={{ width: "45%" }}
                          keyValue="city_name"
                          nameValue="city_name"
                          onChange={(value) =>
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              pullDown.type,
                              "city"
                            )
                          }
                          value={pullDown[pullDown.type].city}
                        />
                      </div>
                      <div style={{ fontWeight: "400", fontSize: "12px" }}>
                        {pullDown[pullDown.type].city_comment}
                      </div>
                    </div>
                  )}
                </div>
                {errors?.[
                  `message${indexMessage}_content${indexContent}_${content.type}_${pullDown.type}`
                ] && (
                  <div style={{ color: "#FF7E00", fontSize: "12px" }}>
                    {
                      errors?.[
                        `message${indexMessage}_content${indexContent}_${content.type}_${pullDown.type}`
                      ]
                    }
                  </div>
                )}
              </div>
            )}
            {/* type == 'zip_code_address' */}
            {content.type === "zip_code_address" && (
              <div style={{ marginBottom: "10px" }}>
                <div
                  style={{
                    marginBottom: "10px",
                    textDecoration: "underline",
                    ...(!disabled ? { color: "#2c76f0" } : { color: "gray" }),
                    textAlign: "right",
                  }}
                >
                  <span
                    style={!disabled ? { cursor: "pointer" } : {}}
                    onClick={() => {
                      if (disabled !== true) onOpen(true, indexContent);
                    }}
                  >
                    〒検索はこちら
                  </span>
                </div>
                {(zipCodeAddress.title_require ||
                  zipCodeAddress.isCheckRequire) && (
                  <div
                    className="ss-message__content--user-pull_down-top"
                    style={{ marginBottom: "0px" }}
                  >
                    {zipCodeAddress.title_require && (
                      <span className="ss-message__content--user-pull_down-title">
                        {zipCodeAddress.title}
                      </span>
                    )}
                    {(zipCodeAddress.isCheckRequire === "all_items_require" ||
                      zipCodeAddress.isCheckRequire === "require") && (
                      <span className="ss-message__content--user-text-input-required">
                        ※必須
                      </span>
                    )}
                  </div>
                )}
                {zipCodeAddress.post_code !== undefined && (
                  <div className="ss-user-setting__item-bottom">
                    <div
                      style={{
                        fontWeight: "400",
                        fontSize: "10px",
                        width: "100%",
                        marginBottom: "5px",
                      }}
                    >
                      郵便番号
                    </div>
                    {zipCodeAddress.split_postal_code !== true ? (
                      <InputCustom
                        type="number"
                        placeholder={zipCodeAddress.post_code}
                        disabled={true}
                        // controls={false}
                        // className="ss-user-setting-input-limit-character"
                        // maxLength={7}
                        onKeyPress={(e) => {
                          if (e.target.value.length >= 7) e.preventDefault();
                        }}
                        style={{ width: "100%", marginLeft: "0px" }}
                        onChange={async (value) => {
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            "value_post_code"
                          );
                          if ((value + "").length === 7) {
                            api
                              .get(
                                `/api/v1/get_address_from_zip_code?zip_code=${value}`
                              )
                              .then((res) => {
                                if (res.data && res.data.code === 1) {
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    res.data.data.prefecture_name,
                                    "value_prefecture"
                                  );
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    `${res.data.data.city_name}${res.data.data.town_name}`,
                                    "value_municipality"
                                  );
                                  document
                                    .getElementById("ss-user-input-address")
                                    .focus();
                                  document
                                    .getElementById("ss-user-input-address")
                                    .select();
                                }
                              })
                              .catch((error) => {
                                console.log(error);
                              });
                          }
                        }}
                        value={zipCodeAddress.value_post_code}
                      />
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <InputCustom
                          type="number"
                          placeholder={zipCodeAddress.post_code_left}
                          disabled={true}
                          style={{ width: "49%" }}
                          onKeyPress={(e) => {
                            if (e.target.value.length >= 3) e.preventDefault();
                          }}
                          onChange={async (value) => {
                            if (!REGEXP.NUMBER.test(value)) return;
                            if ((value + "").length === 3) {
                              document
                                .getElementById("ss-user-post-code-right-input")
                                .focus();
                              document
                                .getElementById("ss-user-post-code-right-input")
                                .select();
                            }
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              "value_post_code_left"
                            );
                            console.log("zipCodeAddress.value_post_code_right", zipCodeAddress.value_post_code_right);
                            console.log("zipCodeAddress.value_post_code_left", zipCodeAddress.value_post_code_left);
                            if (
                              (value + "").length === 3 &&
                              zipCodeAddress.value_post_code_right &&
                              (zipCodeAddress.value_post_code_right + "")
                                .length === 4
                            ) {
                              api
                                .get(
                                  `/api/v1/get_address_from_zip_code?zip_code=${value}${zipCodeAddress.value_post_code_right}`
                                )
                                .then((res) => {
                                  if (res.data && res.data.code === 1) {
                                    onChangeValue(
                                      indexContent,
                                      content.type,
                                      res.data.data.prefecture_name,
                                      "value_prefecture"
                                    );
                                    onChangeValue(
                                      indexContent,
                                      content.type,
                                      `${res.data.data.city_name}${res.data.data.town_name}`,
                                      "value_municipality"
                                    );
                                    document
                                      .getElementById("ss-user-input-address")
                                      .focus();
                                    document
                                      .getElementById("ss-user-input-address")
                                      .select();
                                  }
                                })
                                .catch((error) => {
                                  console.log(error);
                                });
                            } else if (
                              (value + "").length !== 0 ||
                              (zipCodeAddress.value_post_code_right + "")
                                .length !== 0
                            ) {
                            } else {
                            }
                          }}
                          value={zipCodeAddress.value_post_code_left}
                        />
                        <InputCustom
                          type="number"
                          placeholder={zipCodeAddress.post_code_right}
                          disabled={true}
                          id="ss-user-post-code-right-input"
                          style={{ width: "49%" }}
                          onKeyPress={(e) => {
                            if (e.target.value.length >= 4) e.preventDefault();
                          }}
                          onChange={async (value) => {
                            if (!REGEXP.NUMBER.test(value)) return;
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              "value_post_code_right"
                            );
                            if (
                              (value + "").length === 4 &&
                              zipCodeAddress.value_post_code_left &&
                              (zipCodeAddress.value_post_code_left + "")
                                .length === 3
                            ) {
                              console.log("zipCodeAddress.value_post_code_left", zipCodeAddress.value_post_code_left);
                              console.log("zipCodeAddress.value_post_code_right", zipCodeAddress.value_post_code_right);
                              api
                                .get(
                                  `/api/v1/get_address_from_zip_code?zip_code=${zipCodeAddress.value_post_code_left}${value}`
                                )
                                .then((res) => {
                                  if (res.data && res.data.code === 1) {
                                    onChangeValue(
                                      indexContent,
                                      content.type,
                                      res.data.data.prefecture_name,
                                      "value_prefecture"
                                    );
                                    onChangeValue(
                                      indexContent,
                                      content.type,
                                      `${res.data.data.city_name}${res.data.data.town_name}`,
                                      "value_municipality"
                                    );
                                    document
                                      .getElementById("ss-user-input-address")
                                      .focus();
                                    document
                                      .getElementById("ss-user-input-address")
                                      .select();
                                  } else {
                                  }
                                })
                                .catch((error) => {
                                  console.log(error);
                                });
                            }
                          }}
                          value={zipCodeAddress.value_post_code_right}
                        />
                      </div>
                    )}
                  </div>
                )}
                {zipCodeAddress.prefecture !== undefined && (
                  <div className="ss-user-setting__item-bottom">
                    <div
                      style={{
                        fontWeight: "400",
                        fontSize: "10px",
                        width: "100%",
                        marginBottom: "3px",
                      }}
                    >
                      都道府県
                    </div>

                    <InputCustom
                      placeholder={zipCodeAddress.prefecture}
                      disabled={true}
                      style={{ width: "100%" }}
                      onChange={(value) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          value,
                          "value_prefecture"
                        )
                      }
                      value={zipCodeAddress.value_prefecture}
                    />
                  </div>
                )}
                {zipCodeAddress.municipality !== undefined && (
                  <div className="ss-user-setting__item-bottom">
                    <div
                      style={{
                        fontWeight: "400",
                        fontSize: "10px",
                        width: "100%",
                        marginBottom: "3px",
                      }}
                    >
                      市区町村
                    </div>
                    <InputCustom
                      placeholder={zipCodeAddress.municipality}
                      disabled={true}
                      style={{ width: "100%" }}
                      onChange={(value) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          value,
                          "value_municipality"
                        )
                      }
                      value={zipCodeAddress.value_municipality}
                    />
                  </div>
                )}
                {zipCodeAddress.address !== undefined && (
                  <div className="ss-user-setting__item-bottom">
                    <div
                      style={{
                        fontWeight: "400",
                        fontSize: "10px",
                        width: "100%",
                        marginBottom: "3px",
                      }}
                    >
                      番地
                    </div>
                    <InputCustom
                      placeholder={zipCodeAddress.address}
                      id="ss-user-input-address"
                      disabled={true}
                      style={{ width: "100%" }}
                      onChange={(value) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          value,
                          "value_address"
                        )
                      }
                      value={zipCodeAddress.value_address}
                    />
                  </div>
                )}
                {zipCodeAddress.building_name !== undefined && (
                  <div className="ss-user-setting__item-bottom">
                    <div
                      style={{
                        fontWeight: "400",
                        fontSize: "10px",
                        width: "100%",
                        marginBottom: "3px",
                      }}
                    >
                      建物名
                    </div>
                    <InputCustom
                      placeholder={zipCodeAddress.building_name}
                      id="ss-user-input-building"
                      disabled={true}
                      style={{ width: "100%" }}
                      onChange={(value) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          value,
                          "value_building_name"
                        )
                      }
                      value={zipCodeAddress.value_building_name}
                    />
                  </div>
                )}
                {errors?.[
                  `message${indexMessage}_content${indexContent}_${content.type}`
                ] && (
                  <div style={{ color: "#FF7E00", fontSize: "12px" }}>
                    {
                      errors?.[
                        `message${indexMessage}_content${indexContent}_${content.type}`
                      ]
                    }
                  </div>
                )}
              </div>
            )}
            {/* type == 'attaching_file' */}
            {content.type === "attaching_file" && (
              <div style={{ marginBottom: "10px" }}>
                {attachingFile.require && (
                  <div className="ss-message__content--user-attaching_file-top">
                    {attachingFile.require === true && (
                      <span className="ss-message__content--user-text-input-required">
                        ※必須
                      </span>
                    )}
                  </div>
                )}
                <div className="ss-message__content--user-attaching_file">
                  <div style={{ position: "relative" }}>
                    <InputCustom
                      value={attachingFile.value || "未選択"}
                      disabled={true}
                    />
                    <MDBIcon
                      fas
                      icon="times-circle"
                      className={`ss-message-custom-icon-times ${
                        disabled && "ss-message-custom-icon-times-disabled"
                      }`}
                      onClick={() => {
                        if (!disabled) {
                          onChangeValue(
                            indexContent,
                            content.type,
                            "",
                            "value"
                          );
                        }
                      }}
                    />
                  </div>
                  <input
                    type="file"
                    id="ss-bot-file-upload-preview"
                    name="bot-file-upload"
                    hidden
                    onChange={(e) => getBaseUrl(e, indexContent)}
                  />
                  <Button
                    id={`sp-button-upload-${indexContent}`}
                    className="ss-message__content--user-attaching_file-btn"
                    style={{
                      backgroundColor: "#A3B1BF",
                      marginTop: "3px",
                      width: "100%",
                    }}
                    disabled={true}
                    onClick={botUploadFile}
                  >
                    ファイルを選択
                  </Button>
                </div>
                {errors?.[
                  `message${indexMessage}_content${indexContent}_${content.type}`
                ] && (
                  <div style={{ color: "#FF7E00", fontSize: "12px" }}>
                    {
                      errors?.[
                        `message${indexMessage}_content${indexContent}_${content.type}`
                      ]
                    }
                  </div>
                )}
              </div>
            )}
            {/* type == 'calendar' */}
            {content.type === "calendar" && (
              <div style={{ marginBottom: "10px" }}>
                {(calendar.title_require || calendar.require) && (
                  <div
                    className="ss-message__content--user-calender-top"
                    style={{ marginBottom: "0px" }}
                  >
                    {calendar.title_require && (
                      <span className="ss-message__content--user-calender-title">
                        {calendar.title}
                      </span>
                    )}
                    {calendar.require === true && (
                      <span className="ss-message__content--user-text-input-required">
                        ※必須
                      </span>
                    )}
                  </div>
                )}
                {/* calendar: type = 'date_selection' */}
                {calendar.type === "date_selection" && (
                  <React.Fragment>
                    <DatePickerCustom
                      disabled={true}
                      locale={locale}
                      format={"YYYY-MM-DD"}
                      style={{ width: "99%", marginTop: "5px" }}
                      value={
                        calendar.date_select
                          ? moment(calendar.date_select, "YYYY-MM-DD")
                          : null
                      }
                      onChange={(date, dateString) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          dateString,
                          "date_select"
                        )
                      }
                      disabledDate={(current) =>
                        handleDisableDateCalendar(current, calendar)
                      }
                    />
                  </React.Fragment>
                )}
                {/* calendar: type = 'embedded' */}
                {calendar.type === "embedded" && (
                  <React.Fragment>
                    <div
                      className="ss-message__content--user-calender-embedded"
                      style={{ marginTop: "5px" }}
                    >
                      <Calendar
                        // onLoad={
                        //   checkLoadCalendar()
                        // }
                        disabled={true}
                        className="ss-custom-calendar"
                        fullscreen={false}
                        locale={locale}
                        // format={"YYYY-MM-DD"}
                        headerRender={({
                          value,
                          type,
                          onChange,
                          onTypeChange,
                        }) => {
                          const start = 0;
                          const end = 12;
                          const monthOptions = [];
                          value = value ? value : moment();
                          let current = value.clone();
                          const localeData = value.localeData();
                          const months = [];
                          for (let i = 0; i < 12; i++) {
                            current = current.month(i);
                            months.push(localeData.monthsShort(current));
                          }

                          for (let i = start; i < end; i++) {
                            monthOptions.push(
                              <Select.Option
                                key={i}
                                value={i}
                                className="month-item"
                              >
                                {months[i]}
                              </Select.Option>
                            );
                          }

                          const year = value.year();
                          const month = value.month();
                          const options = [];
                          for (let i = year - 50; i < year + 50; i += 1) {
                            options.push(
                              <Select.Option
                                key={i}
                                value={i}
                                className="year-item"
                              >
                                {i}
                              </Select.Option>
                            );
                          }
                          return (
                            <div style={{ padding: 8 }}>
                              <Row gutter={8}>
                                <Col>
                                  <Select
                                    size="small"
                                    dropdownMatchSelectWidth={false}
                                    className="my-year-select"
                                    value={year}
                                    onChange={(newYear) => {
                                      const now = value.clone().year(newYear);
                                      onChange(now);
                                    }}
                                  >
                                    {options}
                                  </Select>
                                </Col>
                                <Col>
                                  <Select
                                    size="small"
                                    dropdownMatchSelectWidth={false}
                                    value={month}
                                    onChange={(newMonth) => {
                                      const now = value.clone().month(newMonth);
                                      onChange(now);
                                    }}
                                  >
                                    {monthOptions}
                                  </Select>
                                </Col>
                                <Col>
                                  <Radio.Group
                                    size="small"
                                    onChange={(e) =>
                                      onTypeChange(e.target.value)
                                    }
                                    value={type}
                                  >
                                    <Radio.Button value="month">
                                      月
                                    </Radio.Button>
                                    <Radio.Button value="year">年</Radio.Button>
                                  </Radio.Group>
                                </Col>
                              </Row>
                            </div>
                          );
                        }}
                        style={{
                          top: "20px",
                          width: "300px",
                          border: "1px solid grey",
                        }}
                        value={
                          calendar.date_select
                            ? moment(calendar.date_select, "YYYY-MM-DD")
                            : null
                        }
                        onChange={(value) =>
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            "date_select"
                          )
                        }
                        disabledDate={(current) =>
                          handleDisableDateCalendar(current, calendar)
                        }
                      />
                    </div>
                  </React.Fragment>
                )}
                {/* calendar: type = 'start_end_date' */}
                {calendar.type === "start_end_date" && (
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <DatePickerCustom
                      disabled={true}
                      style={{ width: "49%", marginTop: "5px" }}
                      disabledDate={(current) =>
                        handleDisableDateCalendar(current, calendar)
                      }
                      value={
                        calendar.start_date_select
                          ? moment(calendar.start_date_select, "YYYY-MM-DD")
                          : null
                      }
                      onChange={(date, dateString) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          dateString,
                          "start_date_select"
                        )
                      }
                    />
                    <DatePickerCustom
                      disabled={true}
                      style={{ width: "49%", marginTop: "5px" }}
                      disabledDate={(current) =>
                        handleDisableEndDateCalendar(current, calendar)
                      }
                      value={
                        calendar.end_date_select
                          ? moment(calendar.end_date_select, "YYYY-MM-DD")
                          : null
                      }
                      onChange={(date, dateString) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          dateString,
                          "end_date_select"
                        )
                      }
                    />
                  </div>
                )}
                {errors?.[
                  `message${indexMessage}_content${indexContent}_${content.type}`
                ] && (
                  <div style={{ color: "#FF7E00", fontSize: "12px" }}>
                    {
                      errors?.[
                        `message${indexMessage}_content${indexContent}_${content.type}`
                      ]
                    }
                  </div>
                )}
              </div>
            )}
            {/* type == 'agree_term' */}
            {content.type === "agree_term" && (
              <div style={{ marginBottom: "10px" }}>
                {/* {(agreeTerm.title_require || agreeTerm.require) && */}
                <div
                  className="ss-message__content--user-agree_to_term-top"
                  style={{ marginBottom: "0px" }}
                >
                  {agreeTerm.title_require && (
                    <span className="ss-message__content--user-agree_to_term-title">
                      {agreeTerm.title}
                    </span>
                  )}
                  <span className="ss-message__content--user-text-input-required">
                    ※必須
                  </span>
                </div>
                {/* } */}
                {/* agreeTerm: type = 'detail_content' */}
                {agreeTerm.type === "detail_content" && (
                  <React.Fragment>
                    <div className="ss-message__content--user-agree_to_term-detail_content">
                      <textarea
                        name="ss-message__content--user-agree_to_term-detail_content"
                        id=""
                        rows={
                          agreeTerm[agreeTerm.type].content?.length > 200
                            ? 8
                            : 5
                        }
                        value={agreeTerm[agreeTerm.type].content}
                        className="ss-input-value"
                        readOnly
                      ></textarea>
                      <CheckboxCustom
                        disabled={true}
                        label={agreeTerm.term}
                        onChange={(value) =>
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            "isAgree"
                          )
                        }
                        value={agreeTerm.isAgree}
                      />
                    </div>
                  </React.Fragment>
                )}
                {/* agreeTerm: type = 'post_link_only' */}
                {agreeTerm.type === "post_link_only" && (
                  <div>
                    {agreeTerm[agreeTerm.type].map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="ss-message__content--user-agree_to_term-post_link_only"
                        >
                          <span style={{ marginRight: "8px" }}>
                            {item.title_comment}
                          </span>
                          <a href={item.urls} target="_blank" rel="noreferrer">
                            {item.title}
                          </a>
                          <span style={{ marginLeft: "8px" }}>
                            {item.url_comment}
                          </span>
                        </div>
                      );
                    })}
                    <CheckboxCustom
                      disabled={true}
                      onChange={(value) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          value,
                          "isAgree"
                        )
                      }
                      value={agreeTerm.isAgree}
                      label={agreeTerm.term}
                    />
                  </div>
                )}
                {errors?.[
                  `message${indexMessage}_content${indexContent}_${content.type}`
                ] && (
                  <div style={{ color: "#FF7E00", fontSize: "12px" }}>
                    {
                      errors?.[
                        `message${indexMessage}_content${indexContent}_${content.type}`
                      ]
                    }
                  </div>
                )}
              </div>
            )}
            {/* type == 'carousel' */}
            {content.type === "carousel" && (
              <div style={{ marginBottom: "10px" }}>
                {(carousel.title_require || carousel.require) && (
                  <div
                    className="ss-message__content--user-pull_down-top"
                    style={{ marginBottom: "0px" }}
                  >
                    {carousel.title_require && (
                      <span className="ss-message__content--user-pull_down-title">
                        {carousel.title}
                      </span>
                    )}
                    {carousel.require && (
                      <span className="ss-message__content--user-text-input-required">
                        ※必須
                      </span>
                    )}
                  </div>
                )}
                {/* carousel: type = 'default' */}
                {carousel.type === "default" && (
                  <div className="sp-carousel-container-preivew">
                    {carousel[carousel.type].contents &&
                      carousel[carousel.type].contents.map(
                        (itemCarousel, indexCarousel) => {
                          return (
                            <div
                              className="sp-carousel-container-block-item"
                              key={indexCarousel}
                            >
                              <div className="sp-carousel-container-block-item-infor">
                                <div className="sp-carousel-preview-img">
                                  <img
                                    alt=""
                                    src={itemCarousel.fileUrl}
                                    style={{ width: "100%" }}
                                  />
                                </div>
                                <div className="sp-carousel-preview-title">
                                  {itemCarousel.title}
                                </div>
                                <div className="sp-carousel-preview-sub-title">
                                  {itemCarousel.subtitle}
                                </div>
                              </div>
                              <div
                                className="sp-carousel-preview-button"
                                style={
                                  carousel.initial_selection === itemCarousel.id
                                    ? { backgroundColor: "white" }
                                    : disabled
                                    ? { backgroundColor: "#B2B0AE" }
                                    : {}
                                }
                                onClick={() => {
                                  if (
                                    carousel.initial_selection !==
                                      itemCarousel.id &&
                                    !disabled
                                  ) {
                                    onChangeValue(
                                      indexContent,
                                      content.type,
                                      itemCarousel.id,
                                      "initial_selection"
                                    );
                                    if (
                                      carousel.require &&
                                      messageContent.length === 1
                                    )
                                      onClickNext();
                                  }
                                }}
                              >
                                {itemCarousel.buttonTitle || "選択"}
                              </div>
                            </div>
                          );
                        }
                      )}
                  </div>
                )}
                {errors?.[
                  `message${indexMessage}_content${indexContent}_${content.type}`
                ] && (
                  <div style={{ color: "#FF7E00", fontSize: "12px" }}>
                    {
                      errors?.[
                        `message${indexMessage}_content${indexContent}_${content.type}`
                      ]
                    }
                  </div>
                )}
              </div>
            )}
            {/* type == 'credit_card_payment' */}
            {content.type === "credit_card_payment" && (
              <div style={{ marginBottom: "10px" }}>
                {(creditCardPayment.title_require ||
                  creditCardPayment.require) && (
                  <div
                    className="ss-message__content--user-pull_down-top"
                    style={{ marginBottom: "0px" }}
                  >
                    {creditCardPayment.title_require && (
                      <span className="ss-message__content--user-pull_down-title">
                        {creditCardPayment.title}
                      </span>
                    )}
                    {creditCardPayment.require && (
                      <span className="ss-message__content--user-text-input-required">
                        ※必須
                      </span>
                    )}
                  </div>
                )}
                {creditCardPayment.payment_method.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      margin: "5px 0px",
                    }}
                  >
                    {creditCardPayment.payment_method.map(
                      (itemPayment, index) => {
                        return (
                          <div
                            key={index}
                            style={{ width: `${15.6667}%`, marginRight: "1%" }}
                            className="ss-img-list-bank"
                          >
                            {
                              dataPaymentMethod.find(
                                (item) => item.key === itemPayment
                              ).value
                            }
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
                {creditCardPayment.separate_type === false ? (
                  <div className="ss-user-setting__item-bottom">
                    <InputCustom
                      styleLabel={{ width: "100%" }}
                      id="sp_credit_card_payment"
                      label="カード番号"
                      type="number"
                      onKeyPress={(e) => {
                        if (e.target.value.length >= 16) e.preventDefault();
                      }}
                      disabled={true}
                      onPaste={(e) => {
                        // Get the pasted value and remove all white space
                        const value = e.clipboardData
                          .getData("text")
                          .replace(/[^0-9]/g, "")
                          .slice(0, 16);
                        setTimeout(() => {
                          document.getElementById(
                            "sp_credit_card_payment"
                          ).value = value;
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            "card_number"
                          );
                        }, 10);
                        // Set the value of the input to the pasted value
                        // return value;
                      }}
                      // max={9999999999999999}
                      style={{ width: "100%", marginLeft: "0px" }}
                      value={creditCardPayment.card_number}
                      placeholder={creditCardPayment.card_number_placeholder}
                      onChange={(value) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          value,
                          "card_number"
                        )
                      }
                    />
                  </div>
                ) : (
                  <div className="ss-user-setting__item-bottom">
                    <div style={{ width: "100%" }}>カード番号</div>
                    <div
                      className="ss-user-setting__item-select-bottom-wrapper-flex ss-user-setting-card-number-separate-type"
                      style={{ width: "100%" }}
                    >
                      <InputNum
                        max={9999}
                        controls={false}
                        style={{ marginLeft: "0px" }}
                        disabled={true}
                        maxLength={4}
                        className="ss-user-setting-input-limit-character"
                        value={creditCardPayment.card_number1}
                        placeholder={creditCardPayment.card_number_placeholder1}
                        onChange={(value) => {
                          if ((value + "").length === 4) {
                            document
                              .getElementById(
                                "ss-user-card-number-radio-input2"
                              )
                              .focus();
                            document
                              .getElementById(
                                "ss-user-card-number-radio-input2"
                              )
                              .select();
                          }
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            "card_number1"
                          );
                        }}
                      />
                      <InputNum
                        max={9999}
                        id="ss-user-card-number-radio-input2"
                        controls={false}
                        style={{ marginLeft: "7px" }}
                        disabled={true}
                        maxLength={4}
                        className="ss-user-setting-input-limit-character"
                        value={creditCardPayment.card_number2}
                        placeholder={creditCardPayment.card_number_placeholder2}
                        onChange={(value) => {
                          if ((value + "").length === 4) {
                            document
                              .getElementById(
                                "ss-user-card-number-radio-input3"
                              )
                              .focus();
                            document
                              .getElementById(
                                "ss-user-card-number-radio-input3"
                              )
                              .select();
                          }
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            "card_number2"
                          );
                        }}
                      />
                      <InputNum
                        id="ss-user-card-number-radio-input3"
                        max={9999}
                        controls={false}
                        style={{ marginLeft: "7px" }}
                        disabled={true}
                        maxLength={4}
                        className="ss-user-setting-input-limit-character"
                        value={creditCardPayment.card_number3}
                        placeholder={creditCardPayment.card_number_placeholder3}
                        onChange={(value) => {
                          if ((value + "").length === 4) {
                            document
                              .getElementById(
                                "ss-user-card-number-radio-input4"
                              )
                              .focus();
                            document
                              .getElementById(
                                "ss-user-card-number-radio-input4"
                              )
                              .select();
                          }
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            "card_number3"
                          );
                        }}
                      />
                      <InputNum
                        id="ss-user-card-number-radio-input4"
                        max={9999}
                        controls={false}
                        style={{ marginLeft: "7px" }}
                        disabled={true}
                        maxLength={4}
                        className="ss-user-setting-input-limit-character"
                        value={creditCardPayment.card_number4}
                        placeholder={creditCardPayment.card_number_placeholder4}
                        onChange={(value) =>
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            "card_number4"
                          )
                        }
                      />
                    </div>
                  </div>
                )}
                {creditCardPayment.is_hide_card_name !== true && (
                  <div className="ss-user-setting__item-bottom">
                    <InputCustom
                      styleLabel={{ width: "100%" }}
                      label="カード名義"
                      inline={false}
                      disabled={true}
                      value={creditCardPayment.card_holder}
                      placeholder={creditCardPayment.card_holder_placeholder}
                      onChange={(value) =>
                        onChangeValue(
                          indexContent,
                          content.type,
                          value,
                          "card_holder"
                        )
                      }
                    />
                  </div>
                )}
                <div className="ss-user-setting__item-bottom">
                  <div style={{ width: "100%" }}>有効期限</div>
                  {creditCardPayment.type_date_of_expiry === "ym" && (
                    <div style={{ display: "flex", width: "100%" }}>
                      <SelectCustom
                        style={{ width: "33%" }}
                        value={creditCardPayment.year}
                        disabled={true}
                        placeholder={creditCardPayment.year_placeholder}
                        data={dataYearFixed.filter(
                          (item) =>
                            item.key >= new Date().getFullYear() &&
                            item.key <= new Date().getFullYear() + 10
                        )}
                        onChange={(value) =>
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            "year"
                          )
                        }
                      />
                      <SelectCustom
                        style={{ width: "33%", marginLeft: "10px" }}
                        value={creditCardPayment.month}
                        placeholder={creditCardPayment.month_placeholder}
                        data={dataMonth}
                        disabled={true}
                        onChange={(value) =>
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            "month"
                          )
                        }
                      />
                    </div>
                  )}
                  {creditCardPayment.type_date_of_expiry === "my" && (
                    <div style={{ display: "flex", width: "100%" }}>
                      <SelectCustom
                        style={{ width: "33%" }}
                        value={creditCardPayment.month}
                        placeholder={creditCardPayment.month_placeholder}
                        data={dataMonth}
                        disabled={true}
                        onChange={(value) =>
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            "month"
                          )
                        }
                      />
                      <SelectCustom
                        style={{ width: "33%", marginLeft: "10px" }}
                        value={creditCardPayment.year}
                        disabled={true}
                        placeholder={creditCardPayment.year_placeholder}
                        data={dataYearFixed.filter(
                          (item) =>
                            item.key >= new Date().getFullYear() &&
                            item.key <= new Date().getFullYear() + 10
                        )}
                        onChange={(value) =>
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            "year"
                          )
                        }
                      />
                    </div>
                  )}
                </div>
                {creditCardPayment.is_hide_cvc !== true && (
                  <div
                    className="ss-user-setting__item-bottom"
                    style={{ display: "block" }}
                  >
                    <InputNum
                      style={{ marginLeft: "0px", width: "33%" }}
                      className="ss-user-setting-input-limit-character"
                      max={9999}
                      maxLength={4}
                      disabled={true}
                      controls={false}
                      label={
                        <span style={{ fontWeight: "400" }}>
                          CVC{" "}
                          <img style={{ width: "8%" }} src={cvcIcon} alt="" />
                        </span>
                      }
                      value={creditCardPayment.cvc}
                      placeholder={creditCardPayment.cvc_placeholder}
                      onChange={(value) =>
                        onChangeValue(indexContent, content.type, value, "cvc")
                      }
                    />
                  </div>
                )}
                {errors?.[
                  `message${indexMessage}_content${indexContent}_${content.type}`
                ] && (
                  <div style={{ color: "#FF7E00", fontSize: "12px" }}>
                    {
                      errors?.[
                        `message${indexMessage}_content${indexContent}_${content.type}`
                      ]
                    }
                  </div>
                )}
              </div>
            )}
            {/* type == 'capture' */}
            {content.type === "capture" && (
              <div style={{ marginBottom: "10px" }}>
                <div
                  className="ss-message__content--user-pull_down-top"
                  style={{ marginBottom: "-5px" }}
                >
                  {capture.title_require && (
                    <span className="ss-message__content--user-pull_down-title">
                      {capture.title}
                    </span>
                  )}
                  <span className="ss-message__content--user-text-input-required">
                    ※必須
                  </span>
                </div>
                <div
                  className="ss-user-setting__item-bottom"
                  style={{ marginBottom: "0px" }}
                >
                  <InputCustom
                    disabled={true}
                    style={{ width: "50%" }}
                    value={capture.value}
                    onChange={(value) =>
                      onChangeValue(indexContent, content.type, value, "value")
                    }
                  />
                  {/* {new DOMParser().parseFromString(capture.img, "text/xml").innerHTML} */}
                  <div
                    id={`captcha-${indexMessage}-${indexContent}`}
                    style={{ width: "50%" }}
                    onLoad={loadCaptcha(indexContent)}
                  ></div>
                </div>
                {errors?.[
                  `message${indexMessage}_content${indexContent}_${content.type}`
                ] && (
                  <div style={{ color: "#FF7E00", fontSize: "12px" }}>
                    {
                      errors?.[
                        `message${indexMessage}_content${indexContent}_${content.type}`
                      ]
                    }
                  </div>
                )}
              </div>
            )}
            {/* type == 'product_purchase' */}
            {content.type === "product_purchase" && (
              <div style={{ marginBottom: "10px" }}>
                {(productPurchase.title_require || productPurchase.require) && (
                  <div
                    className="ss-message__content--user-checkbox-top"
                    style={{ marginBottom: "0px" }}
                  >
                    {productPurchase.title_require && (
                      <span className="ss-message__content--user-checkbox-title">
                        {productPurchase.title}
                      </span>
                    )}
                    {productPurchase.require === true && (
                      <span className="ss-message__content--user-text-input-required">
                        ※必須
                      </span>
                    )}
                  </div>
                )}
                <div>
                  {productPurchase.type === "text_with_thumbnail_image" &&
                    (productPurchase.multiple_item_purchase ? (
                      <React.Fragment>
                        <Checkbox.Group
                          className="ss-user-preivew-product-purchase-checkbox-group ss-user-preivew-product-purchase-style-width"
                          style={{ width: "100%" }}
                          disabled={true}
                          value={productPurchase.initial_selection}
                        >
                          {productPurchase.products.map(
                            (itemProduct, indexProduct) => {
                              return (
                                <div
                                  key={indexProduct}
                                  style={{
                                    padding: "5px",
                                    border: "1px solid #8BC5FF",
                                    marginBottom: "5px",
                                  }}
                                >
                                  <Checkbox
                                    value={itemProduct.id}
                                    style={{ border: "none", padding: "0px" }}
                                    onChange={() => {
                                      let selectArr = [
                                        ...productPurchase.initial_selection,
                                      ];
                                      if (selectArr.includes(itemProduct.id)) {
                                        selectArr = [
                                          ...selectArr.filter(
                                            (item) => item !== itemProduct.id
                                          ),
                                        ];
                                      } else {
                                        selectArr.push(itemProduct.id);
                                      }
                                      onChangeValue(
                                        indexContent,
                                        content.type,
                                        selectArr,
                                        "initial_selection"
                                      );
                                      // onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexProduct, 'price_display_custom')
                                    }}
                                  >
                                    <div className="ss-user-overview-product-purchase-container">
                                      <div className="ss-user-preivew-product-purchase-img">
                                        <img src={itemProduct.img_url} alt="" />
                                      </div>
                                      {(productPurchase.product_name_display ||
                                        productPurchase.price_display ||
                                        productPurchase.product_number_display) && (
                                        <div className="ss-user-preivew-product-purchase-infor">
                                          {productPurchase.product_name_display &&
                                            itemProduct.title && (
                                              <div className="ss-user-overview-product-purchase-infor-title">
                                                {itemProduct.title}
                                              </div>
                                            )}
                                          {productPurchase.product_number_display &&
                                            itemProduct.item_number && (
                                              <div className="ss-user-overview-product-purchase-infor-item-number">
                                                商品番号:{" "}
                                                {itemProduct.item_number}
                                              </div>
                                            )}
                                          {itemProduct.price_display_custom ? (
                                            <div className="ss-user-overview-product-purchase-infor-price">
                                              {itemProduct.price_display_custom}
                                            </div>
                                          ) : (
                                            productPurchase.price_display &&
                                            itemProduct.item_price && (
                                              <div className="ss-user-overview-product-purchase-infor-price">
                                                値段: {itemProduct.item_price}{" "}
                                                円
                                              </div>
                                            )
                                          )}
                                          {(productPurchase.quantity_designation_all ||
                                            itemProduct.is_quantity_designation) &&
                                          itemProduct.quantity_limit ? (
                                            <div className="ss-user-overview-product-purchase-infor-price">
                                              数量：最大
                                              {itemProduct.quantity_limit}個まで
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </Checkbox>
                                  {(productPurchase.quantity_designation_all ||
                                    itemProduct.is_quantity_designation) && (
                                    <div>
                                      <InputNum
                                        className="sp-product-purchase-custom-input-quantity"
                                        style={{
                                          width: "46%",
                                          marginLeft: "177px",
                                        }}
                                        value={itemProduct.quantity_select}
                                        onChange={(value) => {
                                          let selectArr = [
                                            ...productPurchase.initial_selection,
                                          ];
                                          if (
                                            !selectArr.includes(
                                              itemProduct.id
                                            ) &&
                                            value
                                          ) {
                                            selectArr.push(itemProduct.id);
                                            onChangeValue(
                                              indexContent,
                                              content.type,
                                              selectArr,
                                              "initial_selection"
                                            );
                                          }
                                          onChangeValue(
                                            indexContent,
                                            content.type,
                                            value,
                                            "products",
                                            indexProduct,
                                            "quantity_select"
                                          );
                                        }}
                                        controls={false}
                                        min={1}
                                        disabled={true}
                                        max={
                                          itemProduct.quantity_limit ||
                                          Number.MAX_SAFE_INTEGER
                                        }
                                        addonAfter={
                                          <div
                                            style={{
                                              padding: "4px 11px",
                                              cursor: "pointer",
                                            }}
                                            onClick={() => {
                                              if (!disabled) {
                                                if (
                                                  itemProduct.quantity_select <
                                                  (itemProduct.quantity_limit ||
                                                    Number.MAX_SAFE_INTEGER)
                                                ) {
                                                  onChangeValue(
                                                    indexContent,
                                                    content.type,
                                                    itemProduct.quantity_select +
                                                      1,
                                                    "products",
                                                    indexProduct,
                                                    "quantity_select"
                                                  );
                                                }
                                                let selectArr = [
                                                  ...productPurchase.initial_selection,
                                                ];
                                                if (
                                                  !selectArr.includes(
                                                    itemProduct.id
                                                  )
                                                ) {
                                                  selectArr.push(
                                                    itemProduct.id
                                                  );
                                                  onChangeValue(
                                                    indexContent,
                                                    content.type,
                                                    selectArr,
                                                    "initial_selection"
                                                  );
                                                }
                                              }
                                            }}
                                          >
                                            +
                                          </div>
                                        }
                                        addonBefore={
                                          <div
                                            style={{
                                              padding: "4px 11px",
                                              cursor: "pointer",
                                            }}
                                            onClick={() => {
                                              if (!disabled) {
                                                if (
                                                  itemProduct.quantity_select >
                                                  1
                                                ) {
                                                  onChangeValue(
                                                    indexContent,
                                                    content.type,
                                                    itemProduct.quantity_select -
                                                      1,
                                                    "products",
                                                    indexProduct,
                                                    "quantity_select"
                                                  );
                                                }
                                                let selectArr = [
                                                  ...productPurchase.initial_selection,
                                                ];
                                                if (
                                                  !selectArr.includes(
                                                    itemProduct.id
                                                  )
                                                ) {
                                                  selectArr.push(
                                                    itemProduct.id
                                                  );
                                                  onChangeValue(
                                                    indexContent,
                                                    content.type,
                                                    selectArr,
                                                    "initial_selection"
                                                  );
                                                }
                                              }
                                            }}
                                          >
                                            -
                                          </div>
                                        }
                                      />
                                      {errors?.[
                                        `message${indexMessage}_content${indexContent}_${content.type}_${indexProduct}`
                                      ] && (
                                        <div
                                          style={{
                                            color: "#FF7E00",
                                            fontSize: "11px",
                                            width: "46%",
                                            marginLeft: "137px",
                                          }}
                                        >
                                          {
                                            errors?.[
                                              `message${indexMessage}_content${indexContent}_${content.type}_${indexProduct}`
                                            ]
                                          }
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            }
                          )}
                        </Checkbox.Group>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <Radio.Group
                          className="ss-user-preivew-product-purchase-radio-group ss-user-preivew-product-purchase-style-width"
                          style={{ width: "100%" }}
                          disabled={true}
                          value={productPurchase.initial_selection[0]}
                        >
                          {productPurchase.products.map(
                            (itemProduct, indexProduct) => {
                              return (
                                <div
                                  style={{
                                    padding: "5px",
                                    border: "1px solid #8BC5FF",
                                    marginBottom: "5px",
                                  }}
                                  key={indexProduct}
                                >
                                  <Radio
                                    value={itemProduct.id}
                                    style={{ border: "none", padding: "0px" }}
                                    onChange={() => {
                                      let selectArr = [
                                        ...productPurchase.initial_selection,
                                      ];
                                      let dataValue;
                                      if (selectArr.includes(itemProduct.id)) {
                                        dataValue = [];
                                      } else {
                                        dataValue = [itemProduct.id];
                                      }
                                      onChangeValue(
                                        indexContent,
                                        content.type,
                                        dataValue,
                                        "initial_selection"
                                      );
                                    }}
                                  >
                                    <div className="ss-user-overview-product-purchase-container">
                                      <div className="ss-user-preivew-product-purchase-img">
                                        <img alt="" src={itemProduct.img_url} />
                                      </div>
                                      {(productPurchase.product_name_display ||
                                        productPurchase.price_display ||
                                        productPurchase.product_number_display) && (
                                        <div className="ss-user-preivew-product-purchase-infor">
                                          {productPurchase.product_name_display &&
                                            itemProduct.title && (
                                              <div className="ss-user-overview-product-purchase-infor-title">
                                                {itemProduct.title}
                                              </div>
                                            )}
                                          {productPurchase.product_number_display &&
                                            itemProduct.item_number && (
                                              <div className="ss-user-overview-product-purchase-infor-item-number">
                                                商品番号:{" "}
                                                {itemProduct.item_number}
                                              </div>
                                            )}
                                          {itemProduct.price_display_custom ? (
                                            <div className="ss-user-overview-product-purchase-infor-price">
                                              {itemProduct.price_display_custom}
                                            </div>
                                          ) : (
                                            productPurchase.price_display &&
                                            itemProduct.item_price && (
                                              <div className="ss-user-overview-product-purchase-infor-price">
                                                値段: {itemProduct.item_price}{" "}
                                                円
                                              </div>
                                            )
                                          )}
                                          {(productPurchase.quantity_designation_all ||
                                            itemProduct.is_quantity_designation) &&
                                          itemProduct.quantity_limit ? (
                                            <div className="ss-user-overview-product-purchase-infor-price">
                                              数量：最大
                                              {itemProduct.quantity_limit}個まで
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                          {/* {productPurchase.multiple_item_purchase &&
                                      <div className="ss-user-overview-product-purchase-infor-price">
                                        Multiple item purchase
                                      </div>
                                    } */}
                                        </div>
                                      )}
                                    </div>
                                  </Radio>
                                  {(productPurchase.quantity_designation_all ||
                                    itemProduct.is_quantity_designation) && (
                                    <div>
                                      <InputNum
                                        className="sp-product-purchase-custom-input-quantity"
                                        style={{
                                          width: "46%",
                                          marginLeft: "177px",
                                        }}
                                        value={itemProduct.quantity_select}
                                        onChange={(value) => {
                                          let selectArr = [
                                            ...productPurchase.initial_selection,
                                          ];
                                          if (
                                            !selectArr.includes(
                                              itemProduct.id
                                            ) &&
                                            value
                                          ) {
                                            onChangeValue(
                                              indexContent,
                                              content.type,
                                              [itemProduct.id],
                                              "initial_selection"
                                            );
                                          }
                                          onChangeValue(
                                            indexContent,
                                            content.type,
                                            value,
                                            "products",
                                            indexProduct,
                                            "quantity_select"
                                          );
                                        }}
                                        controls={false}
                                        disabled={true}
                                        min={1}
                                        max={
                                          itemProduct.quantity_limit ||
                                          Number.MAX_SAFE_INTEGER
                                        }
                                        addonAfter={
                                          <div
                                            style={{
                                              padding: "4px 11px",
                                              cursor: "pointer",
                                            }}
                                            onClick={() => {
                                              if (!disabled) {
                                                if (
                                                  itemProduct.quantity_select <
                                                  (itemProduct.quantity_limit ||
                                                    Number.MAX_SAFE_INTEGER)
                                                ) {
                                                  onChangeValue(
                                                    indexContent,
                                                    content.type,
                                                    itemProduct.quantity_select +
                                                      1,
                                                    "products",
                                                    indexProduct,
                                                    "quantity_select"
                                                  );
                                                }
                                                let selectArr = [
                                                  ...productPurchase.initial_selection,
                                                ];
                                                if (
                                                  !selectArr.includes(
                                                    itemProduct.id
                                                  )
                                                ) {
                                                  onChangeValue(
                                                    indexContent,
                                                    content.type,
                                                    [itemProduct.id],
                                                    "initial_selection"
                                                  );
                                                }
                                              }
                                            }}
                                          >
                                            +
                                          </div>
                                        }
                                        addonBefore={
                                          <div
                                            style={{
                                              padding: "4px 11px",
                                              cursor: "pointer",
                                            }}
                                            onClick={() => {
                                              if (!disabled) {
                                                if (
                                                  itemProduct.quantity_select >
                                                  1
                                                ) {
                                                  onChangeValue(
                                                    indexContent,
                                                    content.type,
                                                    itemProduct.quantity_select -
                                                      1,
                                                    "products",
                                                    indexProduct,
                                                    "quantity_select"
                                                  );
                                                }
                                                let selectArr = [
                                                  ...productPurchase.initial_selection,
                                                ];
                                                if (
                                                  !selectArr.includes(
                                                    itemProduct.id
                                                  )
                                                ) {
                                                  onChangeValue(
                                                    indexContent,
                                                    content.type,
                                                    [itemProduct.id],
                                                    "initial_selection"
                                                  );
                                                }
                                              }
                                            }}
                                          >
                                            -
                                          </div>
                                        }
                                      />
                                      {errors?.[
                                        `message${indexMessage}_content${indexContent}_${content.type}_${indexProduct}`
                                      ] && (
                                        <div
                                          style={{
                                            color: "#FF7E00",
                                            fontSize: "11px",
                                            width: "46%",
                                            marginLeft: "137px",
                                          }}
                                        >
                                          {
                                            errors?.[
                                              `message${indexMessage}_content${indexContent}_${content.type}_${indexProduct}`
                                            ]
                                          }
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            }
                          )}
                        </Radio.Group>
                      </React.Fragment>
                    ))}
                  {productPurchase.type === "text_with_image" &&
                    (productPurchase.multiple_item_purchase ? (
                      <React.Fragment>
                        <Checkbox.Group
                          className="ss-user-preview-product-purchase-checkbox-group-type-text_image ss-user-preivew-product-purchase-style-width"
                          style={{ width: "100%" }}
                          disabled={true}
                          value={productPurchase.initial_selection}
                        >
                          {productPurchase.products.map(
                            (itemProduct, indexProduct) => {
                              return (
                                <div
                                  key={indexProduct}
                                  style={{
                                    padding: "5px",
                                    border: "1px solid #8BC5FF",
                                    marginBottom: "5px",
                                  }}
                                >
                                  <Checkbox
                                    key={indexProduct}
                                    value={itemProduct.id}
                                    onChange={() => {
                                      let selectArr = [
                                        ...productPurchase.initial_selection,
                                      ];
                                      if (selectArr.includes(itemProduct.id)) {
                                        selectArr = [
                                          ...selectArr.filter(
                                            (item) => item !== itemProduct.id
                                          ),
                                        ];
                                      } else {
                                        selectArr.push(itemProduct.id);
                                      }
                                      onChangeValue(
                                        indexContent,
                                        content.type,
                                        selectArr,
                                        "initial_selection"
                                      );
                                      // onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'products', indexProduct, 'price_display_custom')
                                    }}
                                  >
                                    <div className="ss-user-overview-product-purchase-container-type-text_image">
                                      <div className="ss-user-overview-product-purchase-img-type-text_image">
                                        <img alt="" src={itemProduct.img_url} />
                                      </div>
                                      {(productPurchase.product_name_display ||
                                        productPurchase.price_display ||
                                        productPurchase.product_number_display) && (
                                        <div className="ss-user-overview-product-purchase-infor-type-text_image">
                                          {productPurchase.product_name_display &&
                                          itemProduct.title
                                            ? itemProduct.title
                                            : ""}{" "}
                                          {productPurchase.product_number_display &&
                                          itemProduct.item_number
                                            ? itemProduct.item_number
                                            : ""}{" "}
                                          {itemProduct.price_display_custom
                                            ? itemProduct.price_display_custom
                                            : productPurchase.price_display &&
                                              itemProduct.item_price
                                            ? `${itemProduct.item_price} 円`
                                            : ""}
                                        </div>
                                      )}
                                      {(productPurchase.quantity_designation_all ||
                                        itemProduct.is_quantity_designation) &&
                                      itemProduct.quantity_limit ? (
                                        <div className="ss-user-overview-product-purchase-infor-type-text_image">
                                          数量：最大{itemProduct.quantity_limit}
                                          個まで
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </Checkbox>
                                  {(productPurchase.quantity_designation_all ||
                                    itemProduct.is_quantity_designation) && (
                                    <div>
                                      <InputNum
                                        className="sp-product-purchase-custom-input-quantity"
                                        value={itemProduct.quantity_select}
                                        onChange={(value) => {
                                          let selectArr = [
                                            ...productPurchase.initial_selection,
                                          ];
                                          if (
                                            !selectArr.includes(
                                              itemProduct.id
                                            ) &&
                                            value
                                          ) {
                                            selectArr.push(itemProduct.id);
                                            onChangeValue(
                                              indexContent,
                                              content.type,
                                              selectArr,
                                              "initial_selection"
                                            );
                                          }
                                          onChangeValue(
                                            indexContent,
                                            content.type,
                                            value,
                                            "products",
                                            indexProduct,
                                            "quantity_select"
                                          );
                                        }}
                                        controls={false}
                                        min={1}
                                        disabled={true}
                                        style={{ width: "46%" }}
                                        max={
                                          itemProduct.quantity_limit ||
                                          Number.MAX_SAFE_INTEGER
                                        }
                                        addonAfter={
                                          <div
                                            style={{
                                              padding: "4px 11px",
                                              cursor: "pointer",
                                            }}
                                            onClick={() => {
                                              if (!disabled) {
                                                if (
                                                  itemProduct.quantity_select <
                                                  (itemProduct.quantity_limit ||
                                                    Number.MAX_SAFE_INTEGER)
                                                ) {
                                                  onChangeValue(
                                                    indexContent,
                                                    content.type,
                                                    itemProduct.quantity_select +
                                                      1,
                                                    "products",
                                                    indexProduct,
                                                    "quantity_select"
                                                  );
                                                }
                                                let selectArr = [
                                                  ...productPurchase.initial_selection,
                                                ];
                                                if (
                                                  !selectArr.includes(
                                                    itemProduct.id
                                                  )
                                                ) {
                                                  selectArr.push(
                                                    itemProduct.id
                                                  );
                                                  onChangeValue(
                                                    indexContent,
                                                    content.type,
                                                    selectArr,
                                                    "initial_selection"
                                                  );
                                                }
                                              }
                                            }}
                                          >
                                            +
                                          </div>
                                        }
                                        addonBefore={
                                          <div
                                            style={{
                                              padding: "4px 11px",
                                              cursor: "pointer",
                                            }}
                                            onClick={() => {
                                              if (!disabled) {
                                                if (
                                                  itemProduct.quantity_select >
                                                  1
                                                ) {
                                                  onChangeValue(
                                                    indexContent,
                                                    content.type,
                                                    itemProduct.quantity_select -
                                                      1,
                                                    "products",
                                                    indexProduct,
                                                    "quantity_select"
                                                  );
                                                }
                                                let selectArr = [
                                                  ...productPurchase.initial_selection,
                                                ];
                                                if (
                                                  !selectArr.includes(
                                                    itemProduct.id
                                                  )
                                                ) {
                                                  selectArr.push(
                                                    itemProduct.id
                                                  );
                                                  onChangeValue(
                                                    indexContent,
                                                    content.type,
                                                    selectArr,
                                                    "initial_selection"
                                                  );
                                                }
                                              }
                                            }}
                                          >
                                            -
                                          </div>
                                        }
                                      />
                                      {errors?.[
                                        `message${indexMessage}_content${indexContent}_${content.type}_${indexProduct}`
                                      ] && (
                                        <div
                                          style={{
                                            color: "#FF7E00",
                                            fontSize: "11px",
                                          }}
                                        >
                                          {
                                            errors?.[
                                              `message${indexMessage}_content${indexContent}_${content.type}_${indexProduct}`
                                            ]
                                          }
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            }
                          )}
                        </Checkbox.Group>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <Radio.Group
                          className="ss-user-preview-product-purchase-radio-group-type-text_image ss-user-preivew-product-purchase-style-width"
                          style={{ width: "100%" }}
                          disabled={true}
                          onChange={(e) => {
                            let selectArr = [
                              ...productPurchase.initial_selection,
                            ];
                            let dataValue;
                            if (selectArr.includes(e.target.value)) {
                              dataValue = [];
                            } else {
                              dataValue = [e.target.value];
                            }
                            onChangeValue(
                              indexContent,
                              content.type,
                              dataValue,
                              "initial_selection"
                            );
                          }}
                          value={productPurchase.initial_selection[0]}
                        >
                          {productPurchase.products.map(
                            (itemProduct, indexProduct) => {
                              return (
                                <div
                                  style={{
                                    padding: "5px",
                                    border: "1px solid #8BC5FF",
                                    marginBottom: "5px",
                                  }}
                                  key={indexProduct}
                                >
                                  <Radio
                                    value={itemProduct.id}
                                    key={indexProduct}
                                  >
                                    <div className="ss-user-overview-product-purchase-container-type-text_image">
                                      <div className="ss-user-overview-product-purchase-img-type-text_image">
                                        <img alt="" src={itemProduct.img_url} />
                                      </div>
                                      {(productPurchase.product_name_display ||
                                        productPurchase.price_display ||
                                        productPurchase.product_number_display) && (
                                        <div className="ss-user-overview-product-purchase-infor-type-text_image">
                                          {productPurchase.product_name_display &&
                                          itemProduct.title
                                            ? itemProduct.title
                                            : ""}{" "}
                                          {productPurchase.product_number_display &&
                                          itemProduct.item_number
                                            ? itemProduct.item_number
                                            : ""}{" "}
                                          {itemProduct.price_display_custom
                                            ? itemProduct.price_display_custom
                                            : productPurchase.price_display &&
                                              itemProduct.item_price
                                            ? `${itemProduct.item_price} 円`
                                            : ""}
                                        </div>
                                      )}
                                      {(productPurchase.quantity_designation_all ||
                                        itemProduct.is_quantity_designation) &&
                                      itemProduct.quantity_limit ? (
                                        <div className="ss-user-overview-product-purchase-infor-type-text_image">
                                          数量：最大{itemProduct.quantity_limit}
                                          個まで
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </Radio>
                                  {(productPurchase.quantity_designation_all ||
                                    itemProduct.is_quantity_designation) && (
                                    <div>
                                      <InputNum
                                        className="sp-product-purchase-custom-input-quantity"
                                        style={{ width: "46%" }}
                                        disabled={true}
                                        value={itemProduct.quantity_select}
                                        onChange={(value) => {
                                          let selectArr = [
                                            ...productPurchase.initial_selection,
                                          ];
                                          if (
                                            !selectArr.includes(
                                              itemProduct.id
                                            ) &&
                                            value
                                          ) {
                                            onChangeValue(
                                              indexContent,
                                              content.type,
                                              [itemProduct.id],
                                              "initial_selection"
                                            );
                                          }
                                          onChangeValue(
                                            indexContent,
                                            content.type,
                                            value,
                                            "products",
                                            indexProduct,
                                            "quantity_select"
                                          );
                                        }}
                                        controls={false}
                                        min={1}
                                        max={
                                          itemProduct.quantity_limit ||
                                          Number.MAX_SAFE_INTEGER
                                        }
                                        addonAfter={
                                          <div
                                            style={{
                                              padding: "4px 11px",
                                              cursor: "pointer",
                                            }}
                                            onClick={() => {
                                              if (!disabled) {
                                                if (
                                                  itemProduct.quantity_select <
                                                  (itemProduct.quantity_limit ||
                                                    Number.MAX_SAFE_INTEGER)
                                                ) {
                                                  onChangeValue(
                                                    indexContent,
                                                    content.type,
                                                    itemProduct.quantity_select +
                                                      1,
                                                    "products",
                                                    indexProduct,
                                                    "quantity_select"
                                                  );
                                                }
                                                let selectArr = [
                                                  ...productPurchase.initial_selection,
                                                ];
                                                if (
                                                  !selectArr.includes(
                                                    itemProduct.id
                                                  )
                                                ) {
                                                  onChangeValue(
                                                    indexContent,
                                                    content.type,
                                                    [itemProduct.id],
                                                    "initial_selection"
                                                  );
                                                }
                                              }
                                            }}
                                          >
                                            +
                                          </div>
                                        }
                                        addonBefore={
                                          <div
                                            style={{
                                              padding: "4px 11px",
                                              cursor: "pointer",
                                            }}
                                            onClick={() => {
                                              if (!disabled) {
                                                if (
                                                  itemProduct.quantity_select >
                                                  1
                                                ) {
                                                  onChangeValue(
                                                    indexContent,
                                                    content.type,
                                                    itemProduct.quantity_select -
                                                      1,
                                                    "products",
                                                    indexProduct,
                                                    "quantity_select"
                                                  );
                                                }
                                                let selectArr = [
                                                  ...productPurchase.initial_selection,
                                                ];
                                                if (
                                                  !selectArr.includes(
                                                    itemProduct.id
                                                  )
                                                ) {
                                                  onChangeValue(
                                                    indexContent,
                                                    content.type,
                                                    [itemProduct.id],
                                                    "initial_selection"
                                                  );
                                                }
                                              }
                                            }}
                                          >
                                            -
                                          </div>
                                        }
                                      />
                                      {errors?.[
                                        `message${indexMessage}_content${indexContent}_${content.type}_${indexProduct}`
                                      ] && (
                                        <div
                                          style={{
                                            color: "#FF7E00",
                                            fontSize: "11px",
                                          }}
                                        >
                                          {
                                            errors?.[
                                              `message${indexMessage}_content${indexContent}_${content.type}_${indexProduct}`
                                            ]
                                          }
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            }
                          )}
                        </Radio.Group>
                      </React.Fragment>
                    ))}
                  {productPurchase.type === "consume_api_response" && <></>}
                  {errors?.[
                    `message${indexMessage}_content${indexContent}_${content.type}`
                  ] && (
                    <div style={{ color: "#FF7E00", fontSize: "12px" }}>
                      {
                        errors?.[
                          `message${indexMessage}_content${indexContent}_${content.type}`
                        ]
                      }
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* type == 'product_purchase_radio_button' */}
            {content.type === "product_purchase_radio_button" && (
              <div style={{ marginBottom: "10px" }}>
                {(productPurchaseRadioButton.title_require ||
                  productPurchaseRadioButton.require) && (
                  <div
                    className="ss-message__content--user-checkbox-top"
                    style={{ marginBottom: "0px" }}
                  >
                    {productPurchaseRadioButton.title_require && (
                      <span className="ss-message__content--user-checkbox-title">
                        {productPurchaseRadioButton.title}
                      </span>
                    )}
                    {productPurchaseRadioButton.require === true && (
                      <span className="ss-message__content--user-text-input-required">
                        ※必須
                      </span>
                    )}
                  </div>
                )}
                <div>
                  {productPurchaseRadioButton.type ===
                    "text_with_thumbnail_image" && (
                    <React.Fragment>
                      <Radio.Group
                        className="ss-user-preivew-product-purchase-radio-group ss-user-preivew-product-purchase-style-width"
                        style={{ width: "100%" }}
                        disabled={true}
                        onChange={(value) => {
                          onChangeValue(
                            indexContent,
                            content.type,
                            value.target.value,
                            "initial_selection"
                          );
                          if (messageContent.length === 1) onClickNext();
                        }}
                        value={productPurchaseRadioButton.initial_selection}
                      >
                        {productPurchaseRadioButton.products.map(
                          (itemProduct, indexProduct) => {
                            return (
                              <Radio
                                value={itemProduct.id}
                                key={indexProduct}
                                // onChange={() => {
                                //   let selectArr = [...productPurchaseRadioButton.initial_selection];
                                //   let dataValue;
                                //   if (selectArr.includes(itemProduct.id)) {
                                //     dataValue = [];
                                //   } else {
                                //     dataValue = [itemProduct.id];
                                //   }
                                //   onChangeValue(indexContent, content.type, dataValue, 'initial_selection');
                                //   onClickNext();
                                // }}
                              >
                                <div className="ss-user-overview-product-purchase-container">
                                  <div className="ss-user-preivew-product-purchase-img">
                                    <img alt="" src={itemProduct.img_url} />
                                  </div>
                                  {(productPurchaseRadioButton.product_name_display ||
                                    productPurchaseRadioButton.price_display ||
                                    productPurchaseRadioButton.product_number_display) && (
                                    <div className="ss-user-preivew-product-purchase-infor">
                                      {productPurchaseRadioButton.product_name_display &&
                                        itemProduct.title && (
                                          <div className="ss-user-overview-product-purchase-infor-title">
                                            {itemProduct.title}
                                          </div>
                                        )}
                                      {productPurchaseRadioButton.product_number_display &&
                                        itemProduct.item_number && (
                                          <div className="ss-user-overview-product-purchase-infor-item-number">
                                            商品番号: {itemProduct.item_number}
                                          </div>
                                        )}
                                      {itemProduct.price_display_custom ? (
                                        <div className="ss-user-overview-product-purchase-infor-price">
                                          {itemProduct.price_display_custom}
                                        </div>
                                      ) : (
                                        productPurchaseRadioButton.price_display &&
                                        itemProduct.item_price && (
                                          <div className="ss-user-overview-product-purchase-infor-price">
                                            値段: {itemProduct.item_price} 円
                                          </div>
                                        )
                                      )}
                                      {/* {productPurchaseRadioButton.multiple_item_purchase &&
                                      <div className="ss-user-overview-product-purchase-infor-price">
                                        Multiple item purchase
                                      </div>
                                    } */}
                                    </div>
                                  )}
                                </div>
                              </Radio>
                            );
                          }
                        )}
                      </Radio.Group>
                    </React.Fragment>
                  )}
                  {productPurchaseRadioButton.type === "text_with_image" && (
                    <React.Fragment>
                      <Radio.Group
                        className="ss-user-preview-product-purchase-radio-group-type-text_image ss-user-preivew-product-purchase-style-width"
                        style={{ width: "100%" }}
                        disabled={true}
                        value={productPurchaseRadioButton.initial_selection}
                        onChange={(value) => {
                          onChangeValue(
                            indexContent,
                            content.type,
                            value.target.value,
                            "initial_selection"
                          );
                          if (messageContent.length === 1) onClickNext();
                        }}
                      >
                        {productPurchaseRadioButton.products.map(
                          (itemProduct, indexProduct) => {
                            return (
                              <Radio
                                value={itemProduct.id}
                                key={indexProduct}
                                // onChange={() => {
                                //   let selectArr = [...productPurchaseRadioButton.initial_selection];
                                //   let dataValue;
                                //   if (selectArr.includes(itemProduct.id)) {
                                //     dataValue = [];
                                //   } else {
                                //     dataValue = [itemProduct.id];
                                //   }
                                //   onChangeValue(indexContent, content.type, dataValue, 'initial_selection');
                                //   onClickNext();
                                // }}
                              >
                                <div className="ss-user-overview-product-purchase-container-type-text_image">
                                  <div className="ss-user-overview-product-purchase-img-type-text_image">
                                    <img alt="" src={itemProduct.img_url} />
                                  </div>
                                  {(productPurchaseRadioButton.product_name_display ||
                                    productPurchaseRadioButton.price_display ||
                                    productPurchaseRadioButton.product_number_display) && (
                                    <div className="ss-user-overview-product-purchase-infor-type-text_image">
                                      {productPurchaseRadioButton.product_name_display &&
                                      itemProduct.title
                                        ? itemProduct.title
                                        : ""}{" "}
                                      {productPurchaseRadioButton.product_number_display &&
                                      itemProduct.item_number
                                        ? itemProduct.item_number
                                        : ""}{" "}
                                      {itemProduct.price_display_custom
                                        ? itemProduct.price_display_custom
                                        : productPurchaseRadioButton.price_display &&
                                          itemProduct.item_price
                                        ? `${itemProduct.item_price} 円`
                                        : ""}
                                    </div>
                                  )}
                                </div>
                              </Radio>
                            );
                          }
                        )}
                      </Radio.Group>
                    </React.Fragment>
                  )}
                  {productPurchaseRadioButton.type ===
                    "consume_api_response" && <></>}
                  {errors?.[
                    `message${indexMessage}_content${indexContent}_${content.type}`
                  ] && (
                    <div style={{ color: "#FF7E00", fontSize: "12px" }}>
                      {
                        errors?.[
                          `message${indexMessage}_content${indexContent}_${content.type}`
                        ]
                      }
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* type == 'slider' */}
            {content.type === "slider" && (
              <div style={{ marginBottom: "10px" }}>
                {(slider.title_require || slider.require) && (
                  <div
                    className="ss-message__content--user-checkbox-top"
                    style={{ marginBottom: "0px" }}
                  >
                    {slider.title_require && (
                      <span className="ss-message__content--user-checkbox-title">
                        {slider.title}
                      </span>
                    )}
                    {slider.require === true && (
                      <span className="ss-message__content--user-text-input-required">
                        ※必須
                      </span>
                    )}
                  </div>
                )}
                <div>
                  <Slider
                    disabled={true}
                    value={slider.value}
                    onChange={(value) =>
                      onChangeValue(indexContent, content.type, value, "value")
                    }
                    trackStyle={{ backgroundColor: slider.color || "#2C75F0" }}
                    min={
                      slider.type === "discrete_type"
                        ? parseInt(slider.min_value)
                        : 0
                    }
                    max={
                      slider.type === "discrete_type"
                        ? parseInt(slider.max_value)
                        : 100
                    }
                    dots={slider.type === "discrete_type"}
                    step={slider.type !== "discrete_type" && 0.1}
                    marks={
                      slider.type === "discrete_type"
                        ? {
                            [slider.min_value]: slider.min_label,
                            [slider.max_value]: slider.max_label,
                          }
                        : {
                            0: slider.min_label,
                            100: slider.max_label,
                          }
                    }
                  />
                  {errors?.[
                    `message${indexMessage}_content${indexContent}_${content.type}`
                  ] && (
                    <div style={{ color: "#FF7E00", fontSize: "12px" }}>
                      {
                        errors?.[
                          `message${indexMessage}_content${indexContent}_${content.type}`
                        ]
                      }
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* type == 'card_payment_radio_button' */}
            {content.type === "card_payment_radio_button" && (
              <div style={{ marginBottom: "10px" }}>
                {(cardPaymentRadioButton.title_require ||
                  cardPaymentRadioButton.require) && (
                  <div
                    className="ss-message__content--user-text-input-top"
                    style={{ marginBottom: "0px" }}
                  >
                    {cardPaymentRadioButton.title_require && (
                      <span className="ss-message__content--user-text-input-title">
                        {cardPaymentRadioButton.title}
                      </span>
                    )}
                    {cardPaymentRadioButton.require === true && (
                      <span className="ss-message__content--user-text-input-required">
                        ※必須
                      </span>
                    )}
                  </div>
                )}
                {cardPaymentRadioButton.type === "default" && (
                  <Radio.Group
                    style={{ width: "100%", fontSize: "14px" }}
                    disabled={true}
                    value={cardPaymentRadioButton.initial_selection}
                  >
                    {cardPaymentRadioButton.radio_contents &&
                      cardPaymentRadioButton.radio_contents.map(
                        (itemPayment, indexPayment) => {
                          return (
                            <Radio
                              value={itemPayment.value}
                              key={indexPayment}
                              style={{
                                backgroundColor: "#ECF5FA",
                                marginBottom: "5px",
                                padding: "5px",
                                width: "100%",
                              }}
                              onChange={() => {
                                let dataValue;
                                if (
                                  cardPaymentRadioButton.initial_selection !==
                                  itemPayment.value
                                ) {
                                  dataValue = itemPayment.value;
                                } else {
                                  dataValue = "";
                                }
                                onChangeValue(
                                  indexContent,
                                  content.type,
                                  dataValue,
                                  "initial_selection"
                                );

                                if (
                                  cardPaymentRadioButton.card_linked_setting.includes(
                                    dataValue
                                  )
                                ) {
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    true,
                                    "is_display_card_payment"
                                  );
                                  displayButtonNext(true);
                                } else {
                                  displayButtonNext(false);
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    false,
                                    "is_display_card_payment"
                                  );
                                  if (messageContent.length === 1)
                                    onClickNext();
                                }
                              }}
                            >
                              {itemPayment.text}
                            </Radio>
                          );
                        }
                      )}
                  </Radio.Group>
                )}
                {cardPaymentRadioButton.type === "customized_style" && (
                  <Radio.Group
                    style={{ width: "100%", fontSize: "14px" }}
                    disabled={true}
                    value={cardPaymentRadioButton.initial_selection}
                    buttonStyle="solid"
                  >
                    {cardPaymentRadioButton.radio_contents &&
                      cardPaymentRadioButton.radio_contents.map(
                        (itemPayment, indexPayment) => {
                          return (
                            <Radio.Button
                              value={itemPayment.value}
                              key={indexPayment}
                              style={{
                                marginBottom: "5px",
                                padding: "5px",
                                width: "100%",
                                textAlign: "center",
                                lineHeight: "22px",
                              }}
                              onChange={() => {
                                let dataValue;
                                if (
                                  cardPaymentRadioButton.initial_selection !==
                                  itemPayment.value
                                ) {
                                  dataValue = itemPayment.value;
                                } else {
                                  dataValue = "";
                                }
                                onChangeValue(
                                  indexContent,
                                  content.type,
                                  dataValue,
                                  "initial_selection"
                                );

                                // if (cardPaymentRadioButton.card_linked_setting !== dataValue && messageContent.length === 1) {
                                //   onClickNext();
                                // }
                                if (
                                  cardPaymentRadioButton.card_linked_setting.includes(
                                    dataValue
                                  )
                                ) {
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    true,
                                    "is_display_card_payment"
                                  );
                                  displayButtonNext(true);
                                } else {
                                  displayButtonNext(false);
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    false,
                                    "is_display_card_payment"
                                  );
                                  if (messageContent.length === 1)
                                    onClickNext();
                                }
                              }}
                            >
                              {itemPayment.text}
                            </Radio.Button>
                          );
                        }
                      )}
                  </Radio.Group>
                )}
                {cardPaymentRadioButton.type === "picture_radio" &&
                  cardPaymentRadioButton.radio_contents_img &&
                  cardPaymentRadioButton.radio_contents_img.map(
                    (itemPaymentImg, indexPaymentImg) => {
                      return (
                        <div key={indexPaymentImg} style={{ color: "#6789A6" }}>
                          <Radio.Group
                            disabled={true}
                            style={{
                              width: "100%",
                              fontSize: "14px",
                              display: "flex",
                            }}
                            className="ss-user-preview-product-purchase-radio-group-type-text_image ss-user-overview-product-purchase-style-width"
                            value={
                              cardPaymentRadioButton.initial_selection_picture
                            }
                          >
                            {itemPaymentImg.contents &&
                              itemPaymentImg.contents.map(
                                (itemPaymentContent, indexPaymentContent) => {
                                  return (
                                    <Radio
                                      value={`${itemPaymentImg.id}-${itemPaymentContent.id}`}
                                      key={indexPaymentContent}
                                      style={{ marginRight: "0px" }}
                                      onChange={() => {
                                        let dataValue;
                                        if (
                                          cardPaymentRadioButton.initial_selection_picture !==
                                          `${itemPaymentImg.id}-${itemPaymentContent.id}`
                                        ) {
                                          dataValue = `${itemPaymentImg.id}-${itemPaymentContent.id}`;
                                        } else {
                                          dataValue = "";
                                        }
                                        onChangeValue(
                                          indexContent,
                                          content.type,
                                          dataValue,
                                          "initial_selection_picture"
                                        );
                                        // if (cardPaymentRadioButton.card_linked_setting_picture !== dataValue && messageContent.length === 1) {
                                        //   onClickNext();
                                        // }
                                        if (
                                          cardPaymentRadioButton.card_linked_setting_picture ===
                                          dataValue
                                        ) {
                                          onChangeValue(
                                            indexContent,
                                            content.type,
                                            true,
                                            "is_display_card_payment"
                                          );
                                          displayButtonNext(true);
                                        } else {
                                          displayButtonNext(false);
                                          onChangeValue(
                                            indexContent,
                                            content.type,
                                            false,
                                            "is_display_card_payment"
                                          );
                                          if (messageContent.length === 1)
                                            onClickNext();
                                        }
                                      }}
                                    >
                                      <img
                                        alt=""
                                        src={itemPaymentContent.file_url}
                                      ></img>
                                      <div
                                        style={{
                                          textAlign: "center",
                                          fontSize: "14px",
                                          color: "#6789A6",
                                          fontWeight: "700",
                                        }}
                                      >
                                        {itemPaymentContent.text}
                                      </div>
                                    </Radio>
                                  );
                                }
                              )}
                          </Radio.Group>
                        </div>
                      );
                    }
                  )}
                {(cardPaymentRadioButton.type !== "picture_radio"
                  ? cardPaymentRadioButton.card_linked_setting.length > 0 &&
                    cardPaymentRadioButton.card_linked_setting.includes(
                      cardPaymentRadioButton.initial_selection
                    )
                  : cardPaymentRadioButton.card_linked_setting_picture &&
                    cardPaymentRadioButton.card_linked_setting_picture ===
                      cardPaymentRadioButton.initial_selection_picture) && (
                  <React.Fragment>
                    {cardPaymentRadioButton.payment_method.length !== 0 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          margin: "5px 0px",
                        }}
                      >
                        {cardPaymentRadioButton.payment_method.map(
                          (itemPayment, index) => {
                            return (
                              <div
                                key={index}
                                style={{
                                  width: `${15.6667}%`,
                                  marginRight: "1%",
                                }}
                                className="ss-img-list-bank"
                              >
                                {
                                  dataPaymentMethod.find(
                                    (item) => item.key === itemPayment
                                  ).value
                                }
                              </div>
                            );
                          }
                        )}
                      </div>
                    )}
                    {cardPaymentRadioButton.separate_type === false ? (
                      <div className="ss-user-setting__item-bottom">
                        {/* <InputNum
                          styleLabel={{ width: '100%' }}
                          className="ss-user-setting-input-limit-character"
                          label="カード番号"
                          controls={false}
                          max={Number.MAX_SAFE_INTEGER}
                          maxLength={16}
                          onPaste={e => {
                            // Get the pasted value and remove all white space
                            const value = e.clipboardData.getData('text').replace(/\s/g, '');
                            // Set the value of the input to the pasted value
                            onChangeValue(indexContent, content.type, value, 'card_number');
                            e.target.value = value;
                          }}
                          formatter={(value) => value.replace(/\s/g, "")}
                          parser={(value) => value.replace(/\s/g, "")}
                          disabled={true}
                          style={{ width: '100%', marginLeft: '0px' }}
                          value={cardPaymentRadioButton.card_number}
                          placeholder={cardPaymentRadioButton.card_number_placeholder}
                          onChange={value => onChangeValue(indexContent, content.type, value, 'card_number')}
                        /> */}
                        <InputCustom
                          styleLabel={{ width: "100%" }}
                          id="sp_credit_card_payment"
                          label="カード番号"
                          type="number"
                          onKeyPress={(e) => {
                            if (e.target.value.length >= 16) e.preventDefault();
                          }}
                          disabled={true}
                          onPaste={(e) => {
                            // Get the pasted value and remove all white space
                            const value = e.clipboardData
                              .getData("text")
                              .replace(/[^0-9]/g, "")
                              .slice(0, 16);
                            setTimeout(() => {
                              document.getElementById(
                                "sp_credit_card_payment"
                              ).value = value;
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                "card_number"
                              );
                            }, 10);
                            // Set the value of the input to the pasted value
                            // return value;
                          }}
                          // max={9999999999999999}
                          style={{ width: "100%", marginLeft: "0px" }}
                          value={cardPaymentRadioButton.card_number}
                          placeholder={
                            cardPaymentRadioButton.card_number_placeholder
                          }
                          onChange={(value) =>
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              "card_number"
                            )
                          }
                        />
                      </div>
                    ) : (
                      <div className="ss-user-setting__item-bottom">
                        <div style={{ width: "100%" }}>カード番号</div>
                        <div
                          style={{ width: "100%" }}
                          className="ss-user-setting__item-select-bottom-wrapper-flex ss-user-setting-card-number-separate-type"
                        >
                          <InputNum
                            max={9999}
                            controls={false}
                            style={{ marginLeft: "0px" }}
                            disabled={true}
                            maxLength={4}
                            className="ss-user-setting-input-limit-character"
                            value={cardPaymentRadioButton.card_number1}
                            placeholder={
                              cardPaymentRadioButton.card_number_placeholder1
                            }
                            onChange={(value) => {
                              if ((value + "").length === 4) {
                                document
                                  .getElementById(
                                    "ss-user-card-number-radio-input2"
                                  )
                                  .focus();
                                document
                                  .getElementById(
                                    "ss-user-card-number-radio-input2"
                                  )
                                  .select();
                              }
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                "card_number1"
                              );
                            }}
                          />
                          <InputNum
                            max={9999}
                            id="ss-user-card-number-radio-input2"
                            controls={false}
                            style={{ marginLeft: "7px" }}
                            disabled={true}
                            maxLength={4}
                            className="ss-user-setting-input-limit-character"
                            value={cardPaymentRadioButton.card_number2}
                            placeholder={
                              cardPaymentRadioButton.card_number_placeholder2
                            }
                            onChange={(value) => {
                              if ((value + "").length === 4) {
                                document
                                  .getElementById(
                                    "ss-user-card-number-radio-input3"
                                  )
                                  .focus();
                                document
                                  .getElementById(
                                    "ss-user-card-number-radio-input3"
                                  )
                                  .select();
                              }
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                "card_number2"
                              );
                            }}
                          />
                          <InputNum
                            id="ss-user-card-number-radio-input3"
                            max={9999}
                            controls={false}
                            style={{ marginLeft: "7px" }}
                            disabled={true}
                            maxLength={4}
                            className="ss-user-setting-input-limit-character"
                            value={cardPaymentRadioButton.card_number3}
                            placeholder={
                              cardPaymentRadioButton.card_number_placeholder3
                            }
                            onChange={(value) => {
                              if ((value + "").length === 4) {
                                document
                                  .getElementById(
                                    "ss-user-card-number-radio-input4"
                                  )
                                  .focus();
                                document
                                  .getElementById(
                                    "ss-user-card-number-radio-input4"
                                  )
                                  .select();
                              }
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                "card_number3"
                              );
                            }}
                          />
                          <InputNum
                            id="ss-user-card-number-radio-input4"
                            max={9999}
                            controls={false}
                            style={{ marginLeft: "7px" }}
                            disabled={true}
                            maxLength={4}
                            className="ss-user-setting-input-limit-character"
                            value={cardPaymentRadioButton.card_number4}
                            placeholder={
                              cardPaymentRadioButton.card_number_placeholder4
                            }
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                "card_number4"
                              )
                            }
                          />
                        </div>
                      </div>
                    )}
                    {cardPaymentRadioButton.is_hide_card_name === false && (
                      <div className="ss-user-setting__item-bottom">
                        <InputCustom
                          className="ss-user-setting-input-overview"
                          styleLabel={{ width: "100%" }}
                          label="カード名義"
                          inline={false}
                          disabled={true}
                          value={cardPaymentRadioButton.card_holder}
                          onChange={(value) =>
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              "card_holder"
                            )
                          }
                          placeholder={
                            cardPaymentRadioButton.card_holder_placeholder
                          }
                        />
                      </div>
                    )}
                    <div className="ss-user-setting__item-bottom">
                      <div style={{ width: "100%" }}>有効期限</div>
                      {cardPaymentRadioButton.type_date_of_expiry === "ym" && (
                        <div style={{ display: "flex", width: "100%" }}>
                          <SelectCustom
                            style={{ width: "33%" }}
                            value={cardPaymentRadioButton.year}
                            disabled={true}
                            placeholder={"年"}
                            data={dataYearFixed.filter(
                              (item) =>
                                item.key >= new Date().getFullYear() &&
                                item.key <= new Date().getFullYear() + 10
                            )}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                "year"
                              )
                            }
                          />
                          <SelectCustom
                            style={{ width: "33%", marginLeft: "10px" }}
                            value={cardPaymentRadioButton.month}
                            placeholder={"月"}
                            data={dataMonth}
                            disabled={true}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                "month"
                              )
                            }
                          />
                        </div>
                      )}
                      {cardPaymentRadioButton.type_date_of_expiry === "my" && (
                        <div style={{ display: "flex", width: "100%" }}>
                          <SelectCustom
                            style={{ width: "33%" }}
                            value={cardPaymentRadioButton.month}
                            placeholder={"月"}
                            data={dataMonth}
                            disabled={true}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                "month"
                              )
                            }
                          />
                          <SelectCustom
                            style={{ width: "33%", marginLeft: "10px" }}
                            value={cardPaymentRadioButton.year}
                            disabled={true}
                            placeholder={"年"}
                            data={dataYearFixed.filter(
                              (item) =>
                                item.key >= new Date().getFullYear() &&
                                item.key <= new Date().getFullYear() + 10
                            )}
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                "year"
                              )
                            }
                          />
                        </div>
                      )}
                    </div>
                    {cardPaymentRadioButton.is_hide_cvc === false && (
                      <div
                        className="ss-user-setting__item-bottom"
                        style={{ display: "block" }}
                      >
                        <InputNum
                          style={{ marginLeft: "0px", width: "33%" }}
                          className="ss-user-setting-input-limit-character"
                          max={9999}
                          maxLength={4}
                          disabled={true}
                          controls={false}
                          label={
                            <span style={{ fontWeight: "400" }}>
                              CVC{" "}
                              <img
                                alt=""
                                style={{ width: "8%" }}
                                src={cvcIcon}
                              />
                            </span>
                          }
                          value={cardPaymentRadioButton.cvc}
                          placeholder={cardPaymentRadioButton.cvc_placeholder}
                          onChange={(value) =>
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              "cvc"
                            )
                          }
                        />
                      </div>
                    )}
                    {errors?.[
                      `message${indexMessage}_content${indexContent}_${content.type}`
                    ] && (
                      <div style={{ color: "#FF7E00", fontSize: "12px" }}>
                        {
                          errors?.[
                            `message${indexMessage}_content${indexContent}_${content.type}`
                          ]
                        }
                      </div>
                    )}
                  </React.Fragment>
                )}
              </div>
            )}
            {/* type == 'label_no_transition' */}
            {content.type === "label_no_transition" && (
              <div style={{ marginBottom: "10px" }}>
                {labelNoTransition.value}
              </div>
            )}
            {/* type == 'button_submit' */}
            {content.type === "button_submit" && (
              <div style={{ marginBottom: "10px" }}>
                <div className="ss-user-setting__item-text_input-top">
                  <button style={{ borderRadius: "25px", padding: "5px 10px", fontSize: "16px", fontWeight: "bold"}} disabled id="chatbot-submit-button" className="ss-user-setting__select-btn-add btn btn-secondary">
                    {content.button_submit_name || buttonSubmit?.button_submit_name || "送信"}
                  </button>
                </div>
              </div>
            )}
            {/* type == 'contact_form' */}
            {content.type === "contact_form" && contactForm && (
              <div style={{ marginBottom: "10px", fontSize: "13px" }}>
                <div style={{ fontWeight: "bold", marginBottom: "6px" }}>お問い合わせフォーム</div>
                {contactForm.fields?.name && <div>お名前: {contactForm.fields.name}</div>}
                {contactForm.fields?.email && <div>メールアドレス: {contactForm.fields.email}</div>}
                {contactForm.fields?.phone && <div>電話番号: {contactForm.fields.phone}</div>}
                {contactForm.fields?.inquiry_type && <div>お問い合わせ種別: {contactForm.fields.inquiry_type}</div>}
                {contactForm.fields?.order_number && <div>注文番号: {contactForm.fields.order_number}</div>}
                {contactForm.fields?.product_name && <div>商品名: {contactForm.fields.product_name}</div>}
                {contactForm.fields?.content && <div>お問い合わせ内容: {contactForm.fields.content}</div>}
                <div className="ss-user-setting__item-text_input-top" style={{ marginTop: "8px" }}>
                  <button
                    style={{ borderRadius: "25px", padding: "5px 10px", fontSize: "16px", fontWeight: "bold" }}
                    disabled
                    className="ss-user-setting__select-btn-add btn btn-secondary"
                  >
                    {contactForm.submit_button_name || "送信する"}
                  </button>
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
