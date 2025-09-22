import React, { useEffect, useState } from "react";
import "../../../../assets/css/bot/preview-chat-bot.css";
import api from "../../../../api/api-management";
import InputCustom from "../ScenarioSetting/scenarioComon/InputCustom";
import ModalNoti from "../../../Popup/ModalNoti";
import { CHATBOT_ACTIONS, MESSAGE_CONTENT_TYPES, SCAN_REGEX } from "../PreviewComponent/Constants";
import {
  Checkbox as AntdCheckbox,
  Radio,
  Slider} from "antd";
import moment from "moment";
import InputNum from "../ScenarioSetting/scenarioComon/InputNum";
import { tokenExpired } from "api/tokenExpired";
import { SHORTEN_URL } from "variables/constants";
import locale from "antd/es/date-picker/locale/ja_JP";
import "moment/locale/zh-cn";
import SubmitButton from "./UserMessageComponent/SubmitButton";
import { convertTextJapaneseByApi } from "utils/japaneseConverter";
import Image from "./UserMessageComponent/Image";
import TextInput from "./UserMessageComponent/TextInput";
import Label from "./UserMessageComponent/Label";
import TextArea from "./UserMessageComponent/TextArea";
import RadioButton from "./UserMessageComponent/RadioButton";
import Checkbox from "./UserMessageComponent/Checkbox";
import PullDown from "./UserMessageComponent/PullDown";
import ZipCodeAddress from "./UserMessageComponent/ZipCodeAddress";
import Attachment from "./UserMessageComponent/Attachment";
import ShippingAddress from "./UserMessageComponent/ShippingAddress";
import ProductPurchaseSelectOption from "./UserMessageComponent/ProductPurchaseSelectOption";
import Calendar from "./UserMessageComponent/Calendar";
import AgreeTerm from "./UserMessageComponent/AgreeTerm";
import CreditCardPayment from "./UserMessageComponent/CreditCardPayment";
import CardPaymentRadioButton from "./UserMessageComponent/CardPaymentRadioButton";
import { isUserMessage } from "./Utils";

const UserMessage = ({
  message,
  messageContentProps,
  onChangeValue,
  disabled = false,
  indexMessageRender,
  errorsProps,
  indexMessage,
  captcha,
  onClickNext,
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
  if (!isUserMessage(message)) return null;

  // UserMesssage sẽ có những nhiệm vụ:
  //   + Check xem content thuộc dạng nào và render ra component tương ứng
  //   + Sau khi mà render xong UserMessage thì sẽ validate cho phần tương ứng như vậy
  //   + Hiển thị errorsMessage tương ứng cho content đó nếu validate có lỗi

  const [messageContent, setMessageContent] = useState(messageContentProps);
  const [errors, setErrors] = useState(errorsProps);
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [messageNoti, setMessageNoti] = useState("");

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
      case MESSAGE_CONTENT_TYPES.PULL_DOWN:
        return <PullDown
          content={content}
          disabled={disabled}
          onChangeValue={onChangeValue}
          errors={errors}
          indexContent={indexContent}
          indexMessage={indexMessage}
          prefecturesList={prefecturesList}
          lpOptionData={lpOptionData}
          postMessageToParent={postMessageToParent}
        />;
      case MESSAGE_CONTENT_TYPES.ZIP_CODE_ADDRESS:
        return <ZipCodeAddress
          content={content}
          prefecturesList={prefecturesList}
          indexMessageRender={indexMessageRender}
          indexMessage={indexMessage}
          indexContent={indexContent}
          messageContent={messageContent}
          onChangeValue={onChangeValue}
          onChangeErrors={onChangeErrors}
          errors={errors}
          disabled={disabled}
          onOpen={onOpen}
        />;
      case MESSAGE_CONTENT_TYPES.SHIPPING_ADDRESS:
        return <ShippingAddress
          content={content}
          prefecturesList={prefecturesList}
          indexMessageRender={indexMessageRender}
          indexMessage={indexMessage}
          indexContent={indexContent}
          messageContent={messageContent}
          onChangeValue={onChangeValue}
          onChangeErrors={onChangeErrors}
          errors={errors}
          disabled={disabled}
          onOpen={onOpen}
        />;
      case MESSAGE_CONTENT_TYPES.PRODUCT_PURCHASE_SELECT_OPTION:
        return <ProductPurchaseSelectOption
          content={content}
          indexMessage={indexMessage}
          indexContent={indexContent}
          onChangeValue={onChangeValue}
          errors={errors}
        />;
      case MESSAGE_CONTENT_TYPES.ATTACHMENT:
        return <Attachment
          content={content}
          indexMessage={indexMessage}
          indexContent={indexContent}
          onChangeValue={onChangeValue}
          onChangeErrors={onChangeErrors}
          errors={errors}
          disabled={disabled}
        />;
      case MESSAGE_CONTENT_TYPES.CALENDAR:
        return <Calendar
          content={content}
          indexMessage={indexMessage}
          indexContent={indexContent}
          onChangeValue={onChangeValue}
          errors={errors}
          disabled={disabled}
          locale={locale}
        />;
      case MESSAGE_CONTENT_TYPES.AGREE_TERM:
        return <AgreeTerm
          content={content}
          indexMessage={indexMessage}
          indexContent={indexContent}
          onChangeValue={onChangeValue}
          errors={errors}
          disabled={disabled}
        />;
      case MESSAGE_CONTENT_TYPES.CREDIT_CARD_PAYMENT:
        return <CreditCardPayment
          content={content}
          indexMessage={indexMessage}
          indexContent={indexContent}
          onChangeValue={onChangeValue}
          errors={errors}
          disabled={disabled}
        />;
      case MESSAGE_CONTENT_TYPES.CARD_PAYMENT_RADIO_BUTTON:
        return <CardPaymentRadioButton
          content={content}
          indexMessage={indexMessage}
          indexContent={indexContent}
          onChangeValue={onChangeValue}
          errors={errors}
          disabled={disabled}
        />;
      case MESSAGE_CONTENT_TYPES.SUBMIT_BUTTON:
        return <SubmitButton
          content={content}
          submitErrorMessage={submitErrorMessage}
          onClickNext={onClickNext}
          isProcessing={isProcessing}
        />;
      case MESSAGE_CONTENT_TYPES.LABEL_NO_TRANSITION:
        return (
          <div className="m-b-10">
            {content.label_no_transition.value}
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="ss-user-message__content-wrapper">
      {messageContent?.map((content, indexContent) => {
        let carousel = content.carousel;
        let capture = content.capture;
        let productPurchase = content.product_purchase;
        let productPurchaseRadioButton = content.product_purchase_radio_button;

        if (content.type == 'textarea' && content.textarea && content.textarea.invalid_input && content.textarea.invalid_input.content) {
          content.textarea.invalid_input.content = replaceVariable(content.textarea.invalid_input.content);
        }

        return (
          <React.Fragment key={indexContent}>
            { renderContent(content, indexContent) }

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