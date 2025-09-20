import React, { useEffect, useState } from "react";
import "../../../../assets/css/bot/preview-chat-bot.css";
import api from "../../../../api/api-management";
import Cookies from "js-cookie";
import { MDBIcon } from "mdbreact";
import SelectCustom from "../ScenarioSetting/scenarioComon/SelectCustom";
import LPIntegrationOptionPullDown from "../ScenarioSetting/scenarioComon/LPIntegrationOptionPullDown";
import CheckboxCustom from "../ScenarioSetting/scenarioComon/CheckboxCustom";
import InputCustom from "../ScenarioSetting/scenarioComon/InputCustom";
import { Button } from "reactstrap";
import ModalNoti from "../../../Popup/ModalNoti";
import { CHATBOT_ACTIONS, CRAWL_ELEMENT_TYPES, MESSAGE_CONTENT_TYPES, REGEXP, RENDER_CHATBOT_CONFIG, SCAN_REGEX } from "../PreviewComponent/Constants";
import {
  Checkbox as AntdCheckbox,
  Radio,
  Slider,
  Calendar,
  Row,
  Select,
  Col
} from "antd";
import moment from "moment";
import cvcIcon from "assets/img/cvc-icon.png";
import DatePickerCustom from "../ScenarioSetting/scenarioComon/DatePickerCustom";
import InputNum from "../ScenarioSetting/scenarioComon/InputNum";
import { tokenExpired } from "api/tokenExpired";
import { SHORTEN_URL } from "variables/constants";
import locale from "antd/es/date-picker/locale/ja_JP";
import "moment/locale/zh-cn";
import { dataHourFixed, dataMinutes, dataYearFixed, dataMonth, dataDay, dataPaymentMethod, installmentOptions, NUMBER_REGEX } from "./Constants";
import { stringNullOrEmpty } from "./Utils";
import SubmitButton from "./UserMessageComponent/SubmitButton";
import { convertTextJapaneseByApi } from "utils/japaneseConverter";
import OptionGender from "./UserMessageComponent/OptionGender";
import Image from "./UserMessageComponent/Image";
import TextInput from "./UserMessageComponent/TextInput";
import Label from "./UserMessageComponent/Label";
import TextArea from "./UserMessageComponent/TextArea";
import RadioButton from "./UserMessageComponent/RadioButton";
import Checkbox from "./UserMessageComponent/Checkbox";
import { moveToNext } from "./Utils";

const UserMessage = ({
  messageContentProps,
  onChangeValue,
  disabled = false,
  indexMessageRender,
  errorsProps,
  indexMessage,
  captcha,
  onClickNext,
  displayButtonNext,
  onOpen,
  onChangeErrors,
  prefecturesList,
  variables,
  lpOptionData = {},
  submitErrorMessage = '',
  postMessageToParent,
  botId,
  isProcessing = false,
}) => {

  // UserMesssage sẽ có những nhiệm vụ:
  //   + Check xem content thuộc dạng nào và render ra component tương ứng
  //   + Sau khi mà render xong UserMessage thì sẽ validate cho phần tương ứng như vậy
  //   + Hiển thị errorsMessage tương ứng cho content đó nếu validate có lỗi

  const [dataHour, setDataHour] = useState(dataHourFixed);
  const [dataYear, setDataYear] = useState(dataYearFixed);
  const [dataCity, setDataCity] = useState([]);
  // const [prefecturesList, setprefecturesList] = useState([...prefecturesList]);
  const [startDate, setStartDate] = useState(new Date());
  const [messageContent, setMessageContent] = useState(messageContentProps);
  const [errors, setErrors] = useState(errorsProps);
  const [checked, setChecked] = useState([]);
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [messageNoti, setMessageNoti] = useState("");

  const getPrefectureIdCodeFromName = (name) => {
    return prefecturesList.find((prefecture) => prefecture.name === name)?.id;
  }
  
  const cardExpiredYearOptions =  Array.from({ length: 10 }, (_, i) => {
    return {
      key: moment().add(i, "years").format("YY"),
      value: moment().add(i, "years").format("YY"),
    };
  });

  const getLPOptionData = (search_element_value) => {
    return lpOptionData[search_element_value];
  }

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

  const renderDescriptionPayment = (cardPaymentRadioButton) => {
    const foundItem = cardPaymentRadioButton.radio_contents.find(
      (item) =>
        cardPaymentRadioButton.initial_selection === item.value &&
        item.isUsedHTMLDescription &&
        item.descriptionContent.length > 0
    );
    if (!foundItem) return null;
    return (
      <div
        key={foundItem.value}
        dangerouslySetInnerHTML={{ __html: foundItem.descriptionContent }}
      />
    )
  };

  const buttonNextStatus = (indexMessage) => {
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
            !message?.[message.type]?.card_linked_setting.includes(message?.[message.type]?.initial_selection)
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
  }

  const handleOnChangeJpConvertText = (indexContent, contentType, type, subFiled) => (value) => {
    onChangeValue(indexContent, contentType, value, type, subFiled);

    const nextContent = messageContent[indexContent + 1];
    if (nextContent) {
      const convertType = messageContent[indexContent][contentType].convertTextTypeValue;

      convertTextJapaneseByApi(value, convertType).then((textConvertedValue) => {
        onChangeValue(indexContent + 1, contentType, textConvertedValue, type, subFiled);
      });
    }
  }

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
      } else if (content.type === "shipping_address") {
        let shippingAddress = content.shipping_address;
        if (shippingAddress.value_initial_selection) {
          onChangeValue(
            indexContent,
            content.type,
            shippingAddress.value_initial_selection,
            "value_initial_selection"
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
      } else if (content.type === "pull_down") {
        let pullDown = content.pull_down;
        let attrs = {};
        if (pullDown.type === "date_ym" || pullDown.type === "dob_ym") {
          attrs = {year: "valueYear", month: "valueMonth"};
        } else if (pullDown.type === "date_ymd" || pullDown.type === "dob_ymd" || pullDown.type === "fixed_date"
        ) {
          attrs = {year: "valueYear", month: "valueMonth", day: "valueDay"};
        } else if (pullDown.type === "date_md") {
          attrs = {month: "valueMonth", day: "valueDay"};
        }
        Object.keys(attrs).forEach((key) => {
          const initValue = pullDown[pullDown.type][key];
          const currentValue = pullDown[pullDown.type][attrs[key]];
          if (!currentValue && initValue) {
            onChangeValue(indexContent, content.type, initValue, pullDown.type, attrs[key]);
          }
        });
      }
    });
  }, []);

  function botUploadFile() {
    document.getElementById("ss-bot-file-upload-preview").click();
  }

  function getBaseUrl(event, indexContent) {
    var file = event.target.files[0];
    const type = file.name.slice(file.name.lastIndexOf(".") + 1);
    if (
      messageContent[indexContent].attaching_file.file_type.length > 0 &&
      !messageContent[indexContent].attaching_file.file_type.includes(
        type.toLowerCase()
      )
    ) {
      onChangeErrors(
        `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
        `ファイルには${messageContent[
          indexContent
        ].attaching_file.file_type.join(
          ", "
        )}タイプのファイルを指定してください。`
      );
      return;
    } else if (file.size / 1024 / 1024 >= 2) {
      onChangeErrors(
        `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
        "ファイルサイズは2MB以下です。"
      );
      return;
    } else {
      onChangeErrors(
        `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
        ""
      );
    }
    // if (file?.type === 'image/png' || file?.type === 'image/jpeg') {
    // var reader = new FileReader(file);

    // messageContent[indexContent].attaching_file.value = file.name;
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
        })
      );
    }
  };

  const handleClickCarousel = (urls, use_shortened_urls) => {
    if (!urls.trim().length) return;

    let data = {
      history_click_url: {
        origin_url: urls,
      },
    };
    api
      .post(`/api/v1/managements/history_click_urls?chatbot_id=${botId}`, data)
      .then((response) => {
        if (response.data.code === 1) {
          let message = response.data.message;
          let link = document.createElement("a");
          link.href = use_shortened_urls
            ? SHORTEN_URL + message.shorten_code
            : message.origin_url;
          link.target = "_blank";
          link.click();
        } else if (response.data.code === 2) {
          setMessageNoti(response.data.message[0]);
          setIsOpenNoti(true);
          setTimeout(() => {
            setIsOpenNoti(false);
            setMessageNoti(``);
          }, 2000);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
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
    })
    return content;
  }

  function renderPulldownfromJs({ disabled, pullDown, indexContent, content }) {
    if (pullDown?.type !== MESSAGE_CONTENT_TYPES.PULLDOWN.FROM_JS) return null;

    return (
      <LPIntegrationOptionPullDown
        targetElementType={CRAWL_ELEMENT_TYPES.FROM_JS}
        search_element_type={pullDown.from_js_result_target_search_mode}
        search_element_value={pullDown.from_js_result_target_search_value}
        jsCode={pullDown.from_js_result_code}
        disabled={disabled}
        pullDown={pullDown}
        data={getLPOptionData(pullDown.from_js_result_target_search_value)}
        postMessageToParent={postMessageToParent}
        onChange={(value) =>
          onChangeValue(indexContent, content.type, value, pullDown.type, 'value')
        }
        nameValue='text'
        keyValue='value'
      />
    );
  }

  const renderAddressField = (address, indexContent, content) => {
    if (address.compact_municipality_and_address || address.compact_municipality_and_address_and_building_name) return;
    if (address.address === undefined) return;
    return (
      <div className="ss-user-setting__item-bottom">
        <div
          style={{
            fontWeight: "400",
            fontSize: "12px",
            width: "100%",
            marginBottom: "3px",
          }}
        >
          {
            address.address_label && address.address_label.trim() !== ""
              ? address.address_label
              : '番地'
          }
        </div>
        <InputCustom
          placeholder={address.address}
          id={`ss-user-input-address${indexContent}`}
          disabled={disabled}
          style={{ width: "100%" }}
          onChange={(value) =>
            onChangeValue(
              indexContent,
              content.type,
              value,
              "value_address"
            )
          }
          value={address.value_address}
          clearable={true}
        />
      </div>
    )
  }

  const renderContent = (content, indexContent) => {
    switch (content.type) {
      case MESSAGE_CONTENT_TYPES.IMAGE:
        return <Image content={content} />;
      case MESSAGE_CONTENT_TYPES.TEXT_INPUT:
        return <TextInput
          content={content}
          disabled={disabled}
          handleOnChangeJpConvertText={handleOnChangeJpConvertText}
          indexContent={indexContent}
          onChangeValue={onChangeValue}
          errors={errors}
          indexMessage={indexMessage}
        />;
      case MESSAGE_CONTENT_TYPES.LABEL:
        return <Label content={content} />;
      case MESSAGE_CONTENT_TYPES.TEXT_AREA:
        return <TextArea
          content={content}
          disabled={disabled}
          onChangeValue={onChangeValue}
          errors={errors}
          indexContent={indexContent}
          indexMessage={indexMessage}
        />;
      case MESSAGE_CONTENT_TYPES.RADIO_BUTTON:
        return <RadioButton
          content={content}
          disabled={disabled}
          onChangeValue={onChangeValue}
          errors={errors}
          indexContent={indexContent}
          indexMessage={indexMessage}
        />;
      case MESSAGE_CONTENT_TYPES.CHECKBOX:
        return <Checkbox
          content={content}
          disabled={disabled}
          onChangeValue={onChangeValue}
          errors={errors}
          indexContent={indexContent}
          indexMessage={indexMessage}
        />;
      default:
        return null;
    }
  }

  return (
    <div className="ss-user-message__content-wrapper">
      {messageContent?.map((content, indexContent) => {
        let textInput = content.text_input;
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
        let productPurchaseSelectOption = content.product_purchase_select_option;
        let slider = content.slider;
        let cardPaymentRadioButton = content.card_payment_radio_button;
        let shippingAddress = content.shipping_address;
        let labelNoTransition = content.label_no_transition;

        if (content.type == 'textarea' && content.textarea && content.textarea.invalid_input && content.textarea.invalid_input.content) {
          content.textarea.invalid_input.content = replaceVariable(content.textarea.invalid_input.content);
        }

        return (
          <React.Fragment key={indexContent}>
            { renderContent(content, indexContent) }

            {/* type == 'shipping_address' */}
            {
              content.type === "shipping_address" && (

                <div style={{ marginBottom: "10px" }}>
                  {
                    <>
                      <div
                        style={{
                          fontWeight: "400",
                          fontSize: "12px",
                          color: 'black',
                          width: "100%",
                          marginBottom: "5px",
                        }}
                      >
                        お届け先住所
                      </div>
                      <Radio.Group
                        style={{ width: "100%", fontSize: "14px" }}
                        disabled={disabled}
                        value={shippingAddress.value_initial_selection}
                      >
                        {shippingAddress.radio_contents &&
                          shippingAddress.radio_contents.map(
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
                                      shippingAddress.value_initial_selection !==
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
                                      "value_initial_selection"
                                    );

                                    if (
                                      shippingAddress.card_linked_setting.includes(dataValue)
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
                                      // if (messageContent.length === 1) onClickNext();
                                    }
                                  }}
                                >
                                  {itemPayment.text}
                                </Radio>
                              );
                            }
                          )}
                      </Radio.Group>
                    </>
                  }
                  {(shippingAddress.card_linked_setting.length > 0 && shippingAddress.card_linked_setting.includes(shippingAddress.value_initial_selection)) &&
                    <React.Fragment>
                      {(shippingAddress.title_require || shippingAddress.require) && (
                        <div
                          className="ss-message__content--user-text-input-top"
                          style={{ marginBottom: "0px" }}
                        >
                          {shippingAddress.title_require && (
                            <span className="ss-message__content--user-text-input-title">
                              {shippingAddress.title}
                            </span>
                          )}
                          {shippingAddress.require === true && (
                            <span className="ss-message__content--user-text-input-required">
                              ※必須
                            </span>
                          )}
                        </div>
                      )}
                      {shippingAddress.name !== undefined && (
                        <React.Fragment>
                          <div
                            style={{
                              fontWeight: "400",
                              fontSize: "12px",
                              color: 'black',
                              width: "100%",
                              marginBottom: "5px",
                            }}
                          >
                            お名前
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <InputCustom
                              disabled={disabled}
                              placeholder={shippingAddress.text?.placeholderLeft}
                              style={{ width: "49%", marginBottom: "0px" }}
                              onChange={(value) =>
                                onChangeValue(
                                  indexContent,
                                  content.type,
                                  value,
                                  "value_name_left"
                                )
                              }
                              value={shippingAddress.text?.name_valueLeft}
                            ></InputCustom>
                            <InputCustom
                              disabled={disabled}
                              placeholder={shippingAddress.text?.placeholderRight}
                              style={{ width: "49%" }}
                              onChange={(value) =>
                                onChangeValue(
                                  indexContent,
                                  content.type,
                                  value,
                                  "value_name_right"
                                )
                              }
                              value={shippingAddress.text?.name_valueRight}
                            ></InputCustom>
                          </div>
                        </React.Fragment>
                      )}
                      {shippingAddress.kana_name !== undefined &&
                        <>
                          <div
                            style={{
                              fontWeight: "400",
                              fontSize: "12px",
                              width: "100%",
                              marginBottom: "5px",
                              marginTop: "5px"
                            }}
                          >
                            フリガナ
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <InputCustom
                              disabled={disabled}
                              placeholder={shippingAddress.text?.placeholderLeft}
                              style={{ width: "49%", marginBottom: "0px" }}
                              onChange={(value) =>
                                onChangeValue(
                                  indexContent,
                                  content.type,
                                  value,
                                  "value_kana_left"
                                )
                              }
                              value={shippingAddress.text?.kana_name_valueLeft}
                            ></InputCustom>
                            <InputCustom
                              disabled={disabled}
                              placeholder={shippingAddress.text?.placeholderRight}
                              style={{ width: "49%" }}
                              onChange={(value) =>
                                onChangeValue(
                                  indexContent,
                                  content.type,
                                  value,
                                  "value_kana_right"
                                )
                              }
                              value={shippingAddress.text?.kana_name_valueRight}
                            ></InputCustom>
                          </div>
                        </>
                      }
                      <div style={{ marginBottom: "10px" }}>
                        <div
                          style={{
                            marginTop: '5px',
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
                        {(shippingAddress.title_require ||
                          shippingAddress.isCheckRequire) && (
                            <div
                              className="ss-message__content--user-pull_down-top"
                              style={{ marginBottom: "0px" }}
                            >
                              {shippingAddress.title_require && (
                                <span className="ss-message__content--user-pull_down-title">
                                  {shippingAddress.title}
                                </span>
                              )}
                              {(shippingAddress.isCheckRequire === "all_items_require" ||
                                shippingAddress.isCheckRequire === "require") && (
                                  <span className="ss-message__content--user-text-input-required">
                                    ※必須
                                  </span>
                                )}
                            </div>
                          )}
                        {shippingAddress.post_code !== undefined && (
                          <div className="ss-user-setting__item-bottom">
                            <div
                              style={{
                                fontWeight: "400",
                                fontSize: "12px",
                                width: "100%",
                                marginBottom: "5px",
                              }}
                            >
                              郵便番号
                            </div>
                            {shippingAddress.split_postal_code !== true ? (
                              <InputCustom
                                type="tel"
                                inputMode="numeric"
                                placeholder={shippingAddress.post_code}
                                disabled={disabled}
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
                                          if (shippingAddress.compact_municipality_and_address) {
                                            onChangeValue(
                                              indexContent,
                                              content.type,
                                              `${res.data.data.city_name}${res.data.data.town_name}`,
                                              "value_municipality"
                                            );
                                          } else if (shippingAddress.compact_municipality_and_address_and_building_name) {
                                            onChangeValue(
                                              indexContent,
                                              content.type,
                                              `${res.data.data.city_name}${res.data.data.town_name}${res.data.data.building_name}`.replace('undefined', ''),
                                              "value_municipality"
                                            );
                                          } else {
                                            onChangeValue(
                                              indexContent,
                                              content.type,
                                              res.data.data.city_name,
                                              "value_municipality"
                                            );
                                            onChangeValue(
                                              indexContent,
                                              content.type,
                                              res.data.data.town_name,
                                              "value_address"
                                            );
                                          }
                                          onChangeErrors(
                                            `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                            ""
                                          );
                                          moveToNext("ss-user-input-address2");
                                        } else {
                                          onChangeErrors(
                                            `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                            "無効な郵便番号です。"
                                          );
                                        }
                                      })
                                      .catch((error) => {
                                        onChangeErrors(
                                          `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                          "無効な郵便番号です。"
                                        );
                                        if (error.response?.data.code === 0) {
                                          tokenExpired();
                                        }
                                      });
                                  } else if ((value + "").length !== 0) {
                                    onChangeErrors(
                                      `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                      "無効な郵便番号です。"
                                    );
                                  } else {
                                    onChangeErrors(
                                      `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                      ""
                                    );
                                  }
                                }}
                                value={shippingAddress.value_post_code}
                                clearable={true}
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
                                  placeholder={shippingAddress.post_code_left}
                                  disabled={disabled}
                                  style={{ width: "49%" }}
                                  onKeyPress={(e) => {
                                    if (e.target.value.length >= 3) e.preventDefault();
                                  }}
                                  clearable={true}
                                  onChange={async (value) => {
                                    if (value && !NUMBER_REGEX.test(value)) return;
                                    onChangeValue(
                                      indexContent,
                                      content.type,
                                      value,
                                      "value_post_code_left"
                                    );
                                    if ((value + "").length === 3) {
                                      moveToNext("ss-user-post-code-right-input2");
                                    }
                                    if (
                                      (value + "").length === 3 &&
                                      shippingAddress.value_post_code_right &&
                                      (shippingAddress.value_post_code_right + "")
                                        .length === 4
                                    ) {
                                      api
                                        .get(
                                          `/api/v1/get_address_from_zip_code?zip_code=${value}${shippingAddress.value_post_code_right}`
                                        )
                                        .then((res) => {
                                          if (res.data && res.data.code === 1) {
                                            onChangeValue(
                                              indexContent,
                                              content.type,
                                              res.data.data.prefecture_name,
                                              "value_prefecture"
                                            );
                                            if (shippingAddress.compact_municipality_and_address) {
                                              onChangeValue(
                                                indexContent,
                                                content.type,
                                                `${res.data.data.city_name}${res.data.data.town_name}`,
                                                "value_municipality"
                                              );
                                            } else if (shippingAddress.compact_municipality_and_address_and_building_name) {
                                              onChangeValue(
                                                indexContent,
                                                content.type,
                                                `${res.data.data.city_name}${res.data.data.town_name}${res.data.data.building_name}`.replace('undefined', ''),
                                                "value_municipality"
                                              );
                                            } else {
                                              onChangeValue(
                                                indexContent,
                                                content.type,
                                                res.data.data.city_name,
                                                "value_municipality"
                                              );
                                              onChangeValue(
                                                indexContent,
                                                content.type,
                                                res.data.data.town_name,
                                                "value_address"
                                              );
                                            }
                                            onChangeErrors(
                                              `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                              ""
                                            );
                                            moveToNext("ss-user-input-address2");
                                          } else {
                                            onChangeErrors(
                                              `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                              "無効な郵便番号です。"
                                            );
                                          }
                                        })
                                        .catch((error) => {
                                          onChangeErrors(
                                            `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                            "無効な郵便番号です。"
                                          );
                                          if (error.response?.data.code === 0) {
                                            tokenExpired();
                                          }
                                        });
                                    } else if (
                                      (value + "").length !== 0 ||
                                      (shippingAddress.value_post_code_right + "")
                                        .length !== 0
                                    ) {
                                      onChangeErrors(
                                        `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                        "無効な郵便番号です。"
                                      );
                                    } else {
                                      onChangeErrors(
                                        `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                        ""
                                      );
                                    }
                                  }}
                                  value={shippingAddress.value_post_code_left}
                                />
                                <InputCustom
                                  type="number"
                                  placeholder={shippingAddress.post_code_right}
                                  disabled={disabled}
                                  id="ss-user-post-code-right-input2"
                                  style={{ width: "49%" }}
                                  onKeyPress={(e) => {
                                    if (e.target.value.length >= 4) e.preventDefault();
                                  }}
                                  clearable={true}
                                  onChange={async (value) => {
                                    if (value && !NUMBER_REGEX.test(value)) return;
                                    onChangeValue(
                                      indexContent,
                                      content.type,
                                      value,
                                      "value_post_code_right"
                                    );
                                    if (
                                      (value + "").length === 4 &&
                                      shippingAddress.value_post_code_left &&
                                      (shippingAddress.value_post_code_left + "")
                                        .length === 3
                                    ) {
                                      api
                                        .get(
                                          `/api/v1/get_address_from_zip_code?zip_code=${shippingAddress.value_post_code_left}${value}`
                                        )
                                        .then((res) => {
                                          if (res.data && res.data.code === 1) {
                                            onChangeValue(
                                              indexContent,
                                              content.type,
                                              res.data.data.prefecture_name,
                                              "value_prefecture"
                                            );
                                            if (shippingAddress.compact_municipality_and_address) {
                                              onChangeValue(
                                                indexContent,
                                                content.type,
                                                `${res.data.data.city_name}${res.data.data.town_name}`,
                                                "value_municipality"
                                              );
                                            } else if (shippingAddress.compact_municipality_and_address_and_building_name) {
                                              onChangeValue(
                                                indexContent,
                                                content.type,
                                                `${res.data.data.city_name}${res.data.data.town_name}${res.data.data.building_name}`.replace('undefined', ''),
                                                "value_municipality"
                                              );
                                            } else {
                                              onChangeValue(
                                                indexContent,
                                                content.type,
                                                res.data.data.city_name,
                                                "value_municipality"
                                              );
                                              onChangeValue(
                                                indexContent,
                                                content.type,
                                                res.data.data.town_name,
                                                "value_address"
                                              );
                                            }
                                            onChangeErrors(
                                              `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                              ""
                                            );
                                            moveToNext("ss-user-input-address2");
                                          } else {
                                            onChangeErrors(
                                              `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                              "無効な郵便番号です。"
                                            );
                                          }
                                        })
                                        .catch((error) => {
                                          onChangeErrors(
                                            `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                            "無効な郵便番号です。"
                                          );
                                          if (error.response?.data.code === 0) {
                                            tokenExpired();
                                          }
                                        });
                                    } else if (
                                      (value + "").length !== 0 ||
                                      (shippingAddress.value_post_code_left + "")
                                        .length !== 0
                                    ) {
                                      onChangeErrors(
                                        `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                        "無効な郵便番号です。"
                                      );
                                    } else {
                                      onChangeErrors(
                                        `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                        ""
                                      );
                                    }
                                  }}
                                  value={shippingAddress.value_post_code_right}
                                />
                              </div>
                            )}
                          </div>
                        )}
                        {shippingAddress.prefecture !== undefined && (
                          <div className="ss-user-setting__item-bottom">
                            <div
                              style={{
                                fontWeight: "400",
                                fontSize: "12px",
                                width: "100%",
                                marginBottom: "3px",
                              }}
                            >
                              都道府県
                            </div>
                            {shippingAddress.is_use_dropdown ? (
                              <SelectCustom
                                style={{ width: "100%" }}
                                value={shippingAddress?.value_prefecture}
                                data={prefecturesList}
                                keyValue="id"
                                nameValue="name"
                                placeholder={shippingAddress.prefecture}
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    "value_prefecture"
                                  )
                                }
                              />
                            ) : (
                              <InputCustom
                                placeholder={shippingAddress.prefecture}
                                disabled={disabled}
                                style={{ width: "100%" }}
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    "value_prefecture"
                                  )
                                }
                                value={shippingAddress.value_prefecture}
                                clearable={true}
                              />
                            )}
                          </div>
                        )}
                        {shippingAddress.municipality !== undefined && (
                          <div className="ss-user-setting__item-bottom">
                            <div
                              style={{
                                fontWeight: "400",
                                fontSize: "12px",
                                width: "100%",
                                marginBottom: "3px",
                              }}
                            >
                              市区町村
                            </div>
                            <InputCustom
                              placeholder={shippingAddress.municipality}
                              disabled={disabled}
                              style={{ width: "100%" }}
                              onChange={(value) =>
                                onChangeValue(
                                  indexContent,
                                  content.type,
                                  value,
                                  "value_municipality"
                                )
                              }
                              value={shippingAddress.value_municipality}
                              clearable={true}
                            />
                          </div>
                        )}
                        {shippingAddress.address !== undefined && (
                          <div className="ss-user-setting__item-bottom">
                            <div
                              style={{
                                fontWeight: "400",
                                fontSize: "12px",
                                width: "100%",
                                marginBottom: "3px",
                              }}
                            >
                              丁目・番地等
                            </div>
                            <InputCustom
                              placeholder={shippingAddress.address}
                              id="ss-user-input-address2"
                              disabled={disabled}
                              style={{ width: "100%" }}
                              onChange={(value) =>
                                onChangeValue(
                                  indexContent,
                                  content.type,
                                  value,
                                  "value_address"
                                )
                              }
                              value={shippingAddress.value_address}
                              clearable={true}
                            />
                          </div>
                        )}
                        {shippingAddress.building_name !== undefined && (
                          <div className="ss-user-setting__item-bottom">
                            <div
                              style={{
                                fontWeight: "400",
                                fontSize: "12px",
                                width: "100%",
                                marginBottom: "3px",
                              }}
                            >
                              建物名
                            </div>
                            <InputCustom
                              placeholder={shippingAddress.building_name}
                              id="ss-user-input-building"
                              disabled={disabled}
                              style={{ width: "100%" }}
                              clearable={true}
                              onChange={(value) => {
                                onChangeValue(
                                  indexContent,
                                  content.type,
                                  value,
                                  "value_building_name"
                                );

                              }
                              }
                              value={shippingAddress.value_building_name}
                            />
                          </div>
                        )}
                        {
                          shippingAddress.number !== undefined &&
                          <React.Fragment>
                            {shippingAddress.withHyphen === false ? (
                              <>
                                <div
                                  style={{
                                    fontWeight: "400",
                                    fontSize: "12px",
                                    width: "100%",
                                    marginBottom: "5px",
                                  }}
                                >
                                  電話番号
                                </div>
                                <InputCustom
                                  disabled={disabled}
                                  // className="ss-message__content--user-text-input ss-input-value"
                                  style={{ marginBottom: "0px" }}
                                  placeholder={shippingAddress.text?.number_placeholder}
                                  onChange={(value) =>
                                    onChangeValue(
                                      indexContent,
                                      content.type,
                                      value,
                                      "value_number"
                                    )
                                  }
                                  value={shippingAddress.value_number}
                                  clearable={true}
                                ></InputCustom>
                              </>
                            ) : (
                              <>
                                <div
                                  style={{
                                    fontWeight: "400",
                                    fontSize: "12px",
                                    width: "100%",
                                    marginBottom: "5px",
                                  }}
                                >
                                  電話番号
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <InputCustom
                                    disabled={disabled}
                                    className="ss-message__content--user-text-input ss-input-value"
                                    maxLength={3}
                                    style={{ marginBottom: "0px", width: "32%" }}
                                    placeholder={shippingAddress.text?.number1_placeholder}
                                    onChange={(value) => {
                                      onChangeValue(
                                        indexContent,
                                        content.type,
                                        value,
                                        "value_number1"
                                      );
                                      if (value.length === 3) {
                                        moveToNext("ss-user-message-phone_number_22");
                                      }
                                    }}
                                    value={shippingAddress.value_number1}
                                    clearable={true}
                                  ></InputCustom>
                                  <InputCustom
                                    id="ss-user-message-phone_number_22"
                                    disabled={disabled}
                                    className="ss-message__content--user-text-input ss-input-value"
                                    style={{ marginBottom: "0px", width: "32%" }}
                                    maxLength={4}
                                    placeholder={shippingAddress.text?.number2_placeholder}
                                    onChange={(value) => {
                                      onChangeValue(
                                        indexContent,
                                        content.type,
                                        value,
                                        "value_number2"
                                      );
                                      if (value.length === 4) {
                                        moveToNext("ss-user-message-phone_number_33");
                                      }
                                    }}
                                    value={shippingAddress.value_number2}
                                    clearable={true}
                                  ></InputCustom>
                                  <InputCustom
                                    id="ss-user-message-phone_number_33"
                                    disabled={disabled}
                                    // className="ss-message__content--user-text-input ss-input-value"
                                    style={{ marginBottom: "0px", width: "32%" }}
                                    placeholder={shippingAddress.text?.number3_placeholder}
                                    maxLength={4}
                                    onChange={(value) =>
                                      onChangeValue(
                                        indexContent,
                                        content.type,
                                        value,
                                        "value_number3"
                                      )
                                    }
                                    value={shippingAddress.value_number3}
                                    clearable={true}
                                  ></InputCustom>
                                </div>
                              </>
                            )}
                          </React.Fragment>
                        }
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
                    </React.Fragment>
                  }
                </div>
              )
            }

            {/* type == 'product_purchase_select_option */}
            {
              content.type === 'product_purchase_select_option' &&
              <div style={{ marginBottom: '10px' }}>
                {(productPurchaseSelectOption.title_require || productPurchaseSelectOption.require) &&
                  <div className="ss-message__content--user-pull_down-top"
                    style={{ marginBottom: '0px' }}>
                    {productPurchaseSelectOption.title_require &&
                      <span className="ss-message__content--user-pull_down-title">
                        {productPurchaseSelectOption.title}
                      </span>
                    }
                    {productPurchaseSelectOption.require === true &&
                      <span className="ss-message__content--user-text-input-required">
                        ※必須
                      </span>
                    }
                  </div>
                }
                <div className="ss-message__content--user-pull_down-wrapper">
                  {productPurchaseSelectOption.type === 'text_with_thumbnail_image' && (
                    <>
                      <div className="ss-message__content--user-pull_down--customization">
                        <div className="">
                          <div className="ss-message__content--user-pull_down-col col-12"
                            style={{ padding: '0' }}>
                            <SelectCustom
                              showSearch={false}
                              data={productPurchaseSelectOption.products}
                              style={{ width: '100%' }}
                              placeholder={productPurchaseSelectOption.display_unselected}
                              keyValue="productVariantId"
                              nameValue="title"
                              onChange={(value) => onChangeValue(indexContent, content.type, value, 'value')}
                              value={productPurchaseSelectOption.value}
                            />
                          </div>
                        </div>
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
            }
            {/* type == 'pull_down' */}
            {content.type === "pull_down" && (
              <div style={{ marginBottom: "10px" }}>
                <div className="ss-message__content--user-pull_down-wrapper">
                  
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
                    marginBottom: "5px",
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
                        fontSize: "12px",
                        width: "100%",
                        marginBottom: "5px",
                      }}
                    >
                      {
                        zipCodeAddress.post_code_label && zipCodeAddress.post_code_label.trim() !== ""
                          ? zipCodeAddress.post_code_label
                          : '郵便番号'
                      }
                    </div>
                    {zipCodeAddress.split_postal_code !== true ? (
                      <InputCustom
                        type="tel"
                        inputMode="numeric"
                        placeholder={zipCodeAddress.post_code}
                        disabled={disabled}
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
                                    zipCodeAddress.is_use_dropdown ? getPrefectureIdCodeFromName(res.data.data.prefecture_name) : res.data.data.prefecture_name,
                                    "value_prefecture"
                                  );
                                  if (zipCodeAddress.compact_municipality_and_address) {
                                    onChangeValue(
                                      indexContent,
                                      content.type,
                                      `${res.data.data.city_name}${res.data.data.town_name}`,
                                      "value_municipality"
                                    );
                                  } else if (zipCodeAddress.compact_municipality_and_address_and_building_name) {
                                    onChangeValue(
                                      indexContent,
                                      content.type,
                                      `${res.data.data.city_name}${res.data.data.town_name}${res.data.data.building_name}`.replace('undefined', ''),
                                      "value_municipality"
                                    );
                                  } else {
                                    onChangeValue(
                                      indexContent,
                                      content.type,
                                      res.data.data.city_name,
                                      "value_municipality"
                                    );
                                    onChangeValue(
                                      indexContent,
                                      content.type,
                                      res.data.data.town_name,
                                      "value_address"
                                    );
                                  }
                                  onChangeErrors(
                                    `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                    ""
                                  );
                                  moveToNext(`ss-user-input-address${indexContent}`);
                                } else {
                                  onChangeErrors(
                                    `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                    "無効な郵便番号です。"
                                  );
                                }
                              })
                              .catch((error) => {
                                onChangeErrors(
                                  `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                  "無効な郵便番号です。"
                                );
                                if (error.response?.data.code === 0) {
                                  tokenExpired();
                                }
                              });
                          } else if ((value + "").length !== 0) {
                            onChangeErrors(
                              `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                              "無効な郵便番号です。"
                            );
                          } else {
                            onChangeErrors(
                              `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                              ""
                            );
                          }
                        }}
                        value={zipCodeAddress.value_post_code}
                        clearable={true}
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
                          type="tel"
                          inputMode="numeric"
                          placeholder={zipCodeAddress.post_code_left}
                          disabled={disabled}
                          style={{ width: "49%" }}
                          onKeyPress={(e) => {
                            if (e.target.value.length >= 3) e.preventDefault();
                          }}
                          onChange={async (value) => {
                            if (value && !NUMBER_REGEX.test(value)) return;
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              "value_post_code_left"
                            );
                            if ((value + "").length === 3) {
                              moveToNext(`ss-user-post-code-right-input${indexContent}`);
                            }
                            
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
                                      zipCodeAddress.is_use_dropdown ? getPrefectureIdCodeFromName(res.data.data.prefecture_name) : res.data.data.prefecture_name,
                                      "value_prefecture"
                                    );
                                    if (zipCodeAddress.compact_municipality_and_address) {
                                      onChangeValue(
                                        indexContent,
                                        content.type,
                                        `${res.data.data.city_name}${res.data.data.town_name}`,
                                        "value_municipality"
                                      );
                                    } else if (zipCodeAddress.compact_municipality_and_address_and_building_name) {
                                      onChangeValue(
                                        indexContent,
                                        content.type,
                                        `${res.data.data.city_name}${res.data.data.town_name}${res.data.data.building_name}`.replace('undefined', ''),
                                        "value_municipality"
                                      );
                                    } else {
                                      onChangeValue(
                                        indexContent,
                                        content.type,
                                        res.data.data.city_name,
                                        "value_municipality"
                                      );
                                      onChangeValue(
                                        indexContent,
                                        content.type,
                                        res.data.data.town_name,
                                        "value_address"
                                      );
                                    }
                                    onChangeErrors(
                                      `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                      ""
                                    );
                                    moveToNext(`ss-user-input-address${indexContent}`);
                                  } else {
                                    onChangeErrors(
                                      `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                      "無効な郵便番号です。"
                                    );
                                  }
                                })
                                .catch((error) => {
                                  onChangeErrors(
                                    `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                    "無効な郵便番号です。"
                                  );
                                  if (error.response?.data.code === 0) {
                                    tokenExpired();
                                  }
                                });
                            } else if (
                              (value + "").length !== 0 ||
                              (zipCodeAddress.value_post_code_right + "")
                                .length !== 0
                            ) {
                              onChangeErrors(
                                `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                "無効な郵便番号です。"
                              );
                            } else {
                              onChangeErrors(
                                `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                ""
                              );
                            }
                          }}
                          value={zipCodeAddress.value_post_code_left}
                          clearable={true}
                        />
                        <InputCustom
                          type="tel"
                          inputMode="numeric"
                          placeholder={zipCodeAddress.post_code_right}
                          disabled={disabled}
                          id={`ss-user-post-code-right-input${indexContent}`}
                          style={{ width: "49%" }}
                          onKeyPress={(e) => {
                            if (e.target.value.length >= 4) e.preventDefault();
                          }}
                          onChange={async (value) => {
                            if (value && !NUMBER_REGEX.test(value)) return;
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
                              api
                                .get(
                                  `/api/v1/get_address_from_zip_code?zip_code=${zipCodeAddress.value_post_code_left}${value}`
                                )
                                .then((res) => {
                                  if (res.data && res.data.code === 1) {
                                    onChangeValue(
                                      indexContent,
                                      content.type,
                                      zipCodeAddress.is_use_dropdown ? getPrefectureIdCodeFromName(res.data.data.prefecture_name) : res.data.data.prefecture_name,
                                      "value_prefecture"
                                    );
                                    if (zipCodeAddress.compact_municipality_and_address) {
                                      onChangeValue(
                                        indexContent,
                                        content.type,
                                        `${res.data.data.city_name}${res.data.data.town_name}`,
                                        "value_municipality"
                                      );
                                    } else if (zipCodeAddress.compact_municipality_and_address_and_building_name) {
                                      onChangeValue(
                                        indexContent,
                                        content.type,
                                        `${res.data.data.city_name}${res.data.data.town_name}${res.data.data.building_name}`.replace('undefined', ''),
                                        "value_municipality"
                                      );
                                    } else {
                                      onChangeValue(
                                        indexContent,
                                        content.type,
                                        res.data.data.city_name,
                                        "value_municipality"
                                      );
                                      onChangeValue(
                                        indexContent,
                                        content.type,
                                        res.data.data.town_name,
                                        "value_address"
                                      );
                                    }
                                    onChangeErrors(
                                      `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                      ""
                                    );
                                    moveToNext(`ss-user-input-address${indexContent}`);
                                  } else {
                                    onChangeErrors(
                                      `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                      "無効な郵便番号です。"
                                    );
                                  }
                                })
                                .catch((error) => {
                                  onChangeErrors(
                                    `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                    "無効な郵便番号です。"
                                  );
                                  if (error.response?.data.code === 0) {
                                    tokenExpired();
                                  }
                                });
                            } else if (
                              (value + "").length !== 0 ||
                              (zipCodeAddress.value_post_code_left + "")
                                .length !== 0
                            ) {
                              onChangeErrors(
                                `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                "無効な郵便番号です。"
                              );
                            } else {
                              onChangeErrors(
                                `message${indexMessageRender}_content${indexContent}_${messageContent[indexContent].type}`,
                                ""
                              );
                            }
                          }}
                          value={zipCodeAddress.value_post_code_right}
                          clearable={true}
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
                        fontSize: "12px",
                        width: "100%",
                        marginBottom: "3px",
                      }}
                    >
                      {
                        zipCodeAddress.prefecture_label && zipCodeAddress.prefecture_label.trim() !== ""
                          ? zipCodeAddress.prefecture_label
                          : '都道府県'
                      }
                    </div>
                    {zipCodeAddress.is_use_dropdown ? (
                      <SelectCustom
                        style={{ width: "100%" }}
                        value={zipCodeAddress?.value_prefecture}
                        data={prefecturesList}
                        keyValue="id"
                        nameValue="name"
                        placeholder={zipCodeAddress.prefecture}
                        onChange={(value) =>
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            "value_prefecture"
                          )
                        }
                      />
                    ) : (
                      <InputCustom
                        placeholder={zipCodeAddress.prefecture}
                        disabled={disabled}
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
                        clearable={true}
                      />
                    )}
                  </div>
                )}
                {zipCodeAddress.municipality !== undefined && (
                  <div className="ss-user-setting__item-bottom">
                    <div
                      style={{
                        fontWeight: "400",
                        fontSize: "12px",
                        width: "100%",
                        marginBottom: "3px",
                      }}
                    >
                      {
                        zipCodeAddress.municipality_label && zipCodeAddress.municipality_label.trim() !== ""
                          ? zipCodeAddress.municipality_label
                          : '市区町村'
                      }
                    </div>
                    <InputCustom
                      placeholder={zipCodeAddress.municipality}
                      disabled={disabled}
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
                      clearable={true}
                    />
                  </div>
                )}
                {renderAddressField(zipCodeAddress, indexContent, content)}
                {zipCodeAddress.building_name !== undefined && (
                  <div className="ss-user-setting__item-bottom">
                    <div
                      style={{
                        fontWeight: "400",
                        fontSize: "12px",
                        width: "100%",
                        marginBottom: "3px",
                      }}
                    >
                      {
                        zipCodeAddress.building_name_label && zipCodeAddress.building_name_label.trim() !== ""
                          ? zipCodeAddress.building_name_label
                          : '建物名'
                      }
                    </div>
                    <InputCustom
                      placeholder={zipCodeAddress.building_name}
                      id="ss-user-input-building"
                      disabled={disabled}
                      style={{ width: "100%" }}
                      onChange={(value) => {
                        onChangeValue(
                          indexContent,
                          content.type,
                          value,
                          "value_building_name"
                        );
                      }}
                      value={zipCodeAddress.value_building_name}
                      clearable={true}
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
                      className={`ss-message-custom-icon-times ${disabled && "ss-message-custom-icon-times-disabled"
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
                    disabled={disabled}
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
                      disabled={disabled}
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
                        disabled={disabled}
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
                      disabled={disabled}
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
                      disabled={disabled}
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
                        disabled={disabled}
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
                      disabled={disabled}
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
                              <div
                                className="sp-carousel-container-block-item-infor"
                                onClick={() =>
                                  handleClickCarousel(
                                    itemCarousel.urls,
                                    carousel.use_shortened_urls
                                  )
                                }
                              >
                                <div className="sp-carousel-preview-img">
                                  <img
                                    src={itemCarousel.fileUrl}
                                    style={{ width: "100%" }}
                                  />
                                </div>
                                <div className="sp-carousel-preview-title_holder">
                                  <div className="sp-carousel-preview-title">
                                    {itemCarousel.title}
                                  </div>
                                  <div className="sp-carousel-preview-sub-title">
                                    {itemCarousel.subtitle}
                                  </div>
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
                                  if (carousel.is_use_js == true && carousel.jscode?.length > 0) {
                                    postMessageToParent({
                                      action: CHATBOT_ACTIONS.EXCUTE_JS,
                                      actionData: carousel.jscode,
                                      is_use_js: true
                                    });
                                  }
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
                                    // if (
                                    //   carousel.require &&
                                    //   messageContent.length === 1
                                    // )
                                    //   onClickNext();
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
                      disabled={disabled}
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
                        disabled={disabled}
                        maxLength={4}
                        className="ss-user-setting-input-limit-character"
                        value={creditCardPayment.card_number1}
                        placeholder={creditCardPayment.card_number_placeholder1}
                        onChange={(value) => {
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            "card_number1"
                          );
                          if ((value + "").length === 4) {
                            moveToNext("ss-user-card-number-radio-input2");
                          }
                        }}
                      />
                      <InputNum
                        max={9999}
                        id="ss-user-card-number-radio-input2"
                        controls={false}
                        style={{ marginLeft: "7px" }}
                        disabled={disabled}
                        maxLength={4}
                        className="ss-user-setting-input-limit-character"
                        value={creditCardPayment.card_number2}
                        placeholder={creditCardPayment.card_number_placeholder2}
                        onChange={(value) => {
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            "card_number2"
                          );
                          if ((value + "").length === 4) {
                            moveToNext("ss-user-card-number-radio-input3");
                          }
                        }}
                      />
                      <InputNum
                        id="ss-user-card-number-radio-input3"
                        max={9999}
                        controls={false}
                        style={{ marginLeft: "7px" }}
                        disabled={disabled}
                        maxLength={4}
                        className="ss-user-setting-input-limit-character"
                        value={creditCardPayment.card_number3}
                        placeholder={creditCardPayment.card_number_placeholder3}
                        onChange={(value) => {
                          onChangeValue(
                            indexContent,
                            content.type,
                            value,
                            "card_number3"
                          );
                          if ((value + "").length === 4) {
                            moveToNext("ss-user-card-number-radio-input4");
                          }
                        }}
                      />
                      <InputNum
                        id="ss-user-card-number-radio-input4"
                        max={9999}
                        controls={false}
                        style={{ marginLeft: "7px" }}
                        disabled={disabled}
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
                      disabled={disabled}
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
                        disabled={disabled}
                        placeholder={creditCardPayment.year_placeholder}
                        data={cardExpiredYearOptions}
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
                        disabled={disabled}
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
                        disabled={disabled}
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
                        disabled={disabled}
                        placeholder={creditCardPayment.year_placeholder}
                        data={cardExpiredYearOptions}
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
                    <InputCustom
                      className="ss-user-setting-input-limit-character"
                      disabled={disabled}
                      style={{ marginLeft: "0px", width: "33%" }}
                      value={creditCardPayment.cvc}
                      onChange={(value) => {
                        if (/^[0-9]{0,4}$/.test(value)) {
                          onChangeValue(indexContent, content.type, value, "cvc")
                        }
                      }}
                      label={
                        <span style={{ fontWeight: "400" }}>
                          CVC <img style={{ width: "8%" }} src={cvcIcon} />
                        </span>
                      }
                      placeholder={creditCardPayment.cvc_placeholder}
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
                    disabled={disabled}
                    style={{ width: "50%" }}
                    value={capture.value}
                    onChange={(value) =>
                      onChangeValue(indexContent, content.type, value, "value")
                    }
                  />
                  {/* {new DOMParser().parseFromString(capture.img, "text/xml").innerHTML} */}
                  <div
                    id={`captcha-${indexMessageRender}-${indexContent}`}
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
                        <AntdCheckbox.Group
                          className="ss-user-preivew-product-purchase-checkbox-group ss-user-preivew-product-purchase-style-width"
                          style={{ width: "100%" }}
                          disabled={disabled}
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
                                  <AntdCheckbox
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
                                    }}
                                  >
                                    <div className="ss-user-overview-product-purchase-container">
                                      <div className="ss-user-preivew-product-purchase-img">
                                        <img src={itemProduct.img_url} />
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
                                  </AntdCheckbox>
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
                                          disabled={disabled}
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
                        </AntdCheckbox.Group>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <Radio.Group
                          className="ss-user-preivew-product-purchase-radio-group ss-user-preivew-product-purchase-style-width"
                          style={{ width: "100%" }}
                          disabled={disabled}
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
                                        <img src={itemProduct.img_url} />
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
                                          disabled={disabled}
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
                        <AntdCheckbox.Group
                          className="ss-user-preview-product-purchase-checkbox-group-type-text_image ss-user-preivew-product-purchase-style-width"
                          style={{ width: "100%" }}
                          disabled={disabled}
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
                                  <AntdCheckbox
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
                                        <img src={itemProduct.img_url} />
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
                                  </AntdCheckbox>
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
                                          disabled={disabled}
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
                        </AntdCheckbox.Group>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <Radio.Group
                          className="ss-user-preview-product-purchase-radio-group-type-text_image ss-user-preivew-product-purchase-style-width"
                          style={{ width: "100%" }}
                          disabled={disabled}
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
                                        <img src={itemProduct.img_url} />
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
                                          disabled={disabled}
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
                          disabled={disabled}
                          onChange={(value) => {
                            onChangeValue(
                              indexContent,
                              content.type,
                              value.target.value,
                              "initial_selection"
                            );
                            // if (messageContent.length === 1) onClickNext();
                          }}
                          value={productPurchaseRadioButton.initial_selection}
                        >
                          {productPurchaseRadioButton.products.map(
                            (itemProduct, indexProduct) => {
                              return (
                                <Radio
                                  value={itemProduct.id}
                                  key={indexProduct}
                                >
                                  <div className="ss-user-overview-product-purchase-container">
                                    <div className="ss-user-preivew-product-purchase-img">
                                      <img src={itemProduct.img_url} />
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
                        disabled={disabled}
                        value={productPurchaseRadioButton.initial_selection}
                        onChange={(value) => {
                          onChangeValue(
                            indexContent,
                            content.type,
                            value.target.value,
                            "initial_selection"
                          );
                          // if (messageContent.length === 1) onClickNext();
                        }}
                      >
                        {productPurchaseRadioButton.products.map(
                          (itemProduct, indexProduct) => {
                            return (
                              <Radio
                                value={itemProduct.id}
                                key={indexProduct}
                              >
                                <div className="ss-user-overview-product-purchase-container-type-text_image">
                                  <div className="ss-user-overview-product-purchase-img-type-text_image">
                                    <img src={itemProduct.img_url} />
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
                    disabled={disabled}
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
                    disabled={disabled}
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

                                if (
                                  cardPaymentRadioButton.card_linked_setting.includes(dataValue)
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
                                  // if (messageContent.length === 1) onClickNext();
                                }
                                onChangeValue(
                                  indexContent,
                                  content.type,
                                  dataValue,
                                  "initial_selection"
                                );
                              }}
                            >
                              {itemPayment.text}
                            </Radio>
                          );
                        }
                      )}
                    {renderDescriptionPayment(cardPaymentRadioButton)}
                  </Radio.Group>
                )}
                {cardPaymentRadioButton.type === "customized_style" && (
                  <Radio.Group
                    style={{ width: "100%", fontSize: "14px" }}
                    disabled={disabled}
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

                                if (
                                  cardPaymentRadioButton.card_linked_setting.includes(dataValue)
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
                                  // if (messageContent.length === 1) onClickNext();
                                }
                                onChangeValue(
                                  indexContent,
                                  content.type,
                                  dataValue,
                                  "initial_selection"
                                );
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
                            disabled={disabled}
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
                                          // if (messageContent.length === 1) onClickNext();
                                        }
                                        onChangeValue(
                                          indexContent,
                                          content.type,
                                          dataValue,
                                          "initial_selection_picture"
                                        );
                                      }}
                                    >
                                      <img
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
                  cardPaymentRadioButton.card_linked_setting.includes(cardPaymentRadioButton.initial_selection)
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
                              disabled={disabled}
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
                            disabled={disabled}
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
                              disabled={disabled}
                              maxLength={4}
                              className="ss-user-setting-input-limit-character"
                              value={cardPaymentRadioButton.card_number1}
                              placeholder={
                                cardPaymentRadioButton.card_number_placeholder1
                              }
                              onChange={(value) => {
                                onChangeValue(
                                  indexContent,
                                  content.type,
                                  value,
                                  "card_number1"
                                );
                                if ((value + "").length === 4) {
                                  moveToNext("ss-user-card-number-radio-input2");
                                }
                              }}
                            />
                            <InputNum
                              max={9999}
                              id="ss-user-card-number-radio-input2"
                              controls={false}
                              style={{ marginLeft: "7px" }}
                              disabled={disabled}
                              maxLength={4}
                              className="ss-user-setting-input-limit-character"
                              value={cardPaymentRadioButton.card_number2}
                              placeholder={
                                cardPaymentRadioButton.card_number_placeholder2
                              }
                              onChange={(value) => {
                                onChangeValue(
                                  indexContent,
                                  content.type,
                                  value,
                                  "card_number2"
                                );
                                if ((value + "").length === 4) {
                                  moveToNext("ss-user-card-number-radio-input3");
                                }
                              }}
                            />
                            <InputNum
                              id="ss-user-card-number-radio-input3"
                              max={9999}
                              controls={false}
                              style={{ marginLeft: "7px" }}
                              disabled={disabled}
                              maxLength={4}
                              className="ss-user-setting-input-limit-character"
                              value={cardPaymentRadioButton.card_number3}
                              placeholder={
                                cardPaymentRadioButton.card_number_placeholder3
                              }
                              onChange={(value) => {
                                onChangeValue(
                                  indexContent,
                                  content.type,
                                  value,
                                  "card_number3"
                                );
                                if ((value + "").length === 4) {
                                  moveToNext("ss-user-card-number-radio-input4");
                                }
                              }}
                            />
                            <InputNum
                              id="ss-user-card-number-radio-input4"
                              max={9999}
                              controls={false}
                              style={{ marginLeft: "7px" }}
                              disabled={disabled}
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
                        cardPaymentRadioButton.separate_name === false ?
                          <div className="ss-user-setting__item-bottom">
                            <InputCustom
                              className="ss-user-setting-input-overview"
                              styleLabel={{ width: "100%" }}
                              label="カード名義"
                              inline={false}
                              disabled={disabled}
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
                          </div> :
                          <>
                            <div className="ss-user-setting__item-bottom">
                              <div style={{ width: "100%" }}>カード名義</div>
                              <div style={{ display: 'flex', width: '100%', gap: '10px' }}>
                                <InputCustom
                                  className="ss-user-setting-input-overview"
                                  inline={false}
                                  disabled={disabled}
                                  value={cardPaymentRadioButton.card_holder1}
                                  onChange={(value) =>
                                    onChangeValue(
                                      indexContent,
                                      content.type,
                                      value,
                                      "card_holder1"
                                    )
                                  }
                                  placeholder={cardPaymentRadioButton.card_holder_placeholder1}
                                />
                                <InputCustom
                                  className="ss-user-setting-input-overview"
                                  styleLabel={{ width: "100%" }}
                                  inline={false}
                                  disabled={disabled}
                                  value={cardPaymentRadioButton.card_holder2}
                                  onChange={(value) =>
                                    onChangeValue(
                                      indexContent,
                                      content.type,
                                      value,
                                      "card_holder2"
                                    )
                                  }
                                  placeholder={cardPaymentRadioButton.card_holder_placeholder2}
                                />
                              </div>
                            </div>
                          </>
                      )}
                      {Array.isArray(cardPaymentRadioButton.is_use_installment) &&
                        cardPaymentRadioButton.is_use_installment.length > 0 && (
                          cardPaymentRadioButton.is_use_installment
                            .filter(installmentValue => installmentValue === cardPaymentRadioButton.initial_selection)
                            .map((installmentValue, index) => (
                              <div className="ss-user-setting__item-bottom" key={index} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                                <div style={{ width: '100%' }}>お支払い回数</div>
                                <SelectCustom
                                  style={{ width: '33%', textAlign: 'left' }}
                                  value={cardPaymentRadioButton.installment}
                                  disabled={disabled}
                                  placeholder={"--"}
                                  data={installmentOptions}
                                  onChange={value => onChangeValue(indexContent, content.type, value, 'installment')}
                                />
                              </div>
                            ))
                        )}
                      <div className="ss-user-setting__item-bottom">
                        <div style={{ width: "100%" }}>有効期限</div>
                        {cardPaymentRadioButton.type_date_of_expiry === "ym" && (
                          <div style={{ display: "flex", width: "100%" }}>
                            <SelectCustom
                              style={{ width: "33%" }}
                              value={cardPaymentRadioButton.year}
                              disabled={disabled}
                              placeholder={"年"}
                              data={cardExpiredYearOptions}
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
                              disabled={disabled}
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
                              disabled={disabled}
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
                              disabled={disabled}
                              placeholder={"年"}
                              data={cardExpiredYearOptions}
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
                          <InputCustom
                            className="ss-user-setting-input-limit-character"
                            disabled={disabled}
                            style={{ marginLeft: "0px", width: "33%" }}
                            value={cardPaymentRadioButton.cvc}
                            onChange={(value) => {
                              if (/^[0-9]{0,4}$/.test(value)) {
                                onChangeValue(indexContent, content.type, value, "cvc")
                              }
                            }}
                            label={
                              <span style={{ fontWeight: "400" }}>
                                CVC <img style={{ width: "8%" }} src={cvcIcon} />
                              </span>
                            }
                            placeholder={cardPaymentRadioButton.cvc_placeholder}
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
            {/* user: type = 'button_submit' */}
            <SubmitButton
              display={content.type === 'button_submit'}
              content={content}
              submitErrorMessage={submitErrorMessage}
              onClickNext={onClickNext}
              isProcessing={isProcessing}
            /> 
            {/* type == 'label_no_transition' */}
            {content.type === "label_no_transition" && (
              <div style={{ marginBottom: "10px" }}>
                {labelNoTransition.value}
              </div>
            )}
          </React.Fragment>
        );
      })}
      <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
        <div style={{ width: "300px", textAlign: "center", color: "#51cbce" }}>
          <span style={{ fontSize: "16px" }}>{messageNoti}</span>
        </div>
      </ModalNoti>
    </div>
  );
};

export default UserMessage;