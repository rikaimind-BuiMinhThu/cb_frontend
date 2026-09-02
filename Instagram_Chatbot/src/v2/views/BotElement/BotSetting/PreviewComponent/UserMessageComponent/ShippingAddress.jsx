import React from "react";
import "v2/assets/css/bot/preview-chat-bot.css";
import { EMPTY_INPUT_VALUE, MESSAGE_CONTENT_TYPES, REQUIRED_FIELD_LABEL } from "v2/views/BotElement/BotSetting/PreviewComponent/Constants";
import { Radio } from "antd";
import CommonAddress from "./CommonAddress";

import InputCustom from "v2/views/BotElement/BotSetting/ScenarioSetting/scenarioComon/InputCustom";

const SHIPPING_NAME_LABEL = "名前";
const SHIPPING_KANA_NAME_LABEL = "フリガナ";
const SHIPPING_ADDRESS_LABEL = "お届け先住所";

const ShippingAddress = ({ content, prefecturesList, messageIndexRender, messageIndex, contentIndex, messageContent, onChangeValue, onChangeErrors, errors, disabled, onOpen }) => {
  if (content.type !== MESSAGE_CONTENT_TYPES.SHIPPING_ADDRESS) return <></>;

  const shippingAddress = content.shipping_address;
  if (!shippingAddress) return;

  const renderRadioContents = () => {
    if (!shippingAddress.radio_contents) return;
    return (
      <Radio.Group
        className="f-size-14 w-100-percent"
        disabled={disabled}
        value={shippingAddress.value_initial_selection || EMPTY_INPUT_VALUE}
      >
        {
          shippingAddress.radio_contents.map((itemPayment, indexPayment) => {
            return (
              <Radio
                value={itemPayment.value || EMPTY_INPUT_VALUE}
                key={indexPayment}
                className="ss-message__content--user-shipping-address-radio-content"
                onChange={() => {
                  const value = shippingAddress.value_initial_selection !== itemPayment.value ? itemPayment.value : EMPTY_INPUT_VALUE;
                  onChangeValue(
                    contentIndex,
                    content.type,
                    value,
                    "value_initial_selection"
                  );

                  const isDisplayCardPayment = shippingAddress.card_linked_setting.includes(value);
                  onChangeValue(
                    contentIndex,
                    content.type,
                    isDisplayCardPayment,
                    "is_display_card_payment"
                  );
                }}
              >
                {itemPayment.text}
              </Radio>
            );
          })
        }
      </Radio.Group>
    );
  };

  const renderTitle = () => {
    if (!shippingAddress.title_require || !shippingAddress.require) return;
    return (
      <div className="ss-message__content--user-text-input-top m-b-0">
        {shippingAddress.title_require && (
          <span className="ss-message__content--user-text-input-title">
            {shippingAddress.title}
          </span>
        )}
        {shippingAddress.require === true && (
          <span className="ss-message__content--user-text-input-required">
            {REQUIRED_FIELD_LABEL}
          </span>
        )}
      </div>
    );
  };

  const renderName = () => {
    if (shippingAddress.name === undefined) return;
    return (
      <React.Fragment>
        <div className="ss-message__content--user-shipping-address-title">
          {SHIPPING_NAME_LABEL}
        </div>
        <div className="ss-message__content--user-chat-container">
          <InputCustom
            disabled={disabled}
            placeholder={shippingAddress.text?.placeholderLeft}
            className="w-49-percent m-b-0"
            onChange={(value) =>
              onChangeValue(
                contentIndex,
                content.type,
                value,
                "value_name_left"
              )
            }
            value={shippingAddress.text?.name_valueLeft || EMPTY_INPUT_VALUE}
          />
          <InputCustom
            disabled={disabled}
            placeholder={shippingAddress.text?.placeholderRight}
            className="w-49-percent"
            onChange={(value) =>
              onChangeValue(
                contentIndex,
                content.type,
                value,
                "value_name_right"
              )
            }
            value={shippingAddress.text?.name_valueRight || EMPTY_INPUT_VALUE}
          />
        </div>
      </React.Fragment>
    );
  };

  const renderKanaName = () => {
    if (shippingAddress.kana_name === undefined) return;
    return (
      <React.Fragment>
        <div className="ss-message__content--user-shipping-address-title">
          {SHIPPING_KANA_NAME_LABEL}
        </div>
        <div className="ss-message__content--user-chat-container">
          <InputCustom
            disabled={disabled}
            placeholder={shippingAddress.text?.placeholderLeft}
            className="w-49-percent m-b-0"
            onChange={(value) =>
              onChangeValue(
                contentIndex,
                content.type,
                value,
                "value_kana_left"
              )
            }
            value={shippingAddress.text?.kana_name_valueLeft || EMPTY_INPUT_VALUE}
          />
          <InputCustom
            disabled={disabled}
            placeholder={shippingAddress.text?.placeholderRight}
            className="w-49-percent"
            onChange={(value) =>
              onChangeValue(
                contentIndex,
                content.type,
                value,
                "value_kana_right"
              )
            }
            value={shippingAddress.text?.kana_name_valueRight || EMPTY_INPUT_VALUE}
          />
        </div>
      </React.Fragment>
    );
  };

  const renderCardLinkSetting = () => {
    const {
      card_linked_setting: cardLinkedSetting,
      value_initial_selection: valueInitialSelection
    } = shippingAddress;
    if (cardLinkedSetting.length === 0 || !cardLinkedSetting.includes(valueInitialSelection)) return;
    return (
      <React.Fragment>
        {renderTitle()}
        {renderName()}
        {renderKanaName()}
        <CommonAddress
          content={content}
          prefecturesList={prefecturesList}
          messageIndexRender={messageIndexRender}
          messageIndex={messageIndex}
          contentIndex={contentIndex}
          messageContent={messageContent}
          onChangeValue={onChangeValue}
          onChangeErrors={onChangeErrors}
          errors={errors}
          disabled={disabled}
          onOpen={onOpen}
          isDisplayError={false}
        />
      </React.Fragment>
    );
  };

  return (
    <div className="m-b-10">
      <>
        <div className="ss-message__content--user-shipping-address-title">
          {SHIPPING_ADDRESS_LABEL}
        </div>
        {renderRadioContents()}
      </>
      {renderCardLinkSetting()}
    </div>
  );
};

export default ShippingAddress;
