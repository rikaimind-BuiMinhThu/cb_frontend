import React from "react";
import "assets/css/bot/preview-chat-bot.css";
import { MESSAGE_CONTENT_TYPES } from "views/BotElement/BotSetting/PreviewComponent/Constants";
import { Radio } from "antd";
import CommonAddress from "./CommonAddress";

import InputCustom from "views/BotElement/BotSetting/ScenarioSetting/scenarioComon/InputCustom";

export default function ShippingAddress({ content, prefecturesList, indexMessageRender, indexMessage, indexContent, messageContent, onChangeValue, onChangeErrors, errors, disabled, onOpen }) {
  if (content.type !== MESSAGE_CONTENT_TYPES.SHIPPING_ADDRESS) return <></>;

  const shippingAddress = content.shipping_address;
  if (!shippingAddress) return;

  const renderRadioContents = () => {
    if (!shippingAddress.radio_contents) return;
    return (
      <Radio.Group
        className="f-size-14 w-100-percent"
        disabled={disabled}
        value={shippingAddress.value_initial_selection}
      >
        {
          shippingAddress.radio_contents.map((itemPayment, indexPayment) => {
            return (
              <Radio
                value={itemPayment.value}
                key={indexPayment}
                className="ss-message__content--user-shipping-address-radio-content"
                onChange={() => {
                  const value = shippingAddress.value_initial_selection !== itemPayment.value ? itemPayment.value : "";
                  onChangeValue(
                    indexContent,
                    content.type,
                    value,
                    "value_initial_selection"
                  );

                  const isDisplayCardPayment = shippingAddress.card_linked_setting.includes(value);
                  onChangeValue(
                    indexContent,
                    content.type,
                    isDisplayCardPayment,
                    "is_display_card_payment"
                  );

                  // if (messageContent.length === 1) onClickNext();
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
            ※必須
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
          名前
        </div>
        <div className="ss-message__content--user-chat-container">
          <InputCustom
            disabled={disabled}
            placeholder={shippingAddress.text?.placeholderLeft}
            className="w-49-percent m-b-0"
            onChange={(value) =>
              onChangeValue(
                indexContent,
                content.type,
                value,
                "value_name_left"
              )
            }
            value={shippingAddress.text?.name_valueLeft}
          />
          <InputCustom
            disabled={disabled}
            placeholder={shippingAddress.text?.placeholderRight}
            className="w-49-percent"
            onChange={(value) =>
              onChangeValue(
                indexContent,
                content.type,
                value,
                "value_name_right"
              )
            }
            value={shippingAddress.text?.name_valueRight}
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
          フリガナ
        </div>
        <div className="ss-message__content--user-chat-container">
          <InputCustom
            disabled={disabled}
            placeholder={shippingAddress.text?.placeholderLeft}
            className="w-49-percent m-b-0"
            onChange={(value) =>
              onChangeValue(
                indexContent,
                content.type,
                value,
                "value_kana_left"
              )
            }
            value={shippingAddress.text?.kana_name_valueLeft}
          />
          <InputCustom
            disabled={disabled}
            placeholder={shippingAddress.text?.placeholderRight}
            className="w-49-percent"
            onChange={(value) =>
              onChangeValue(
                indexContent,
                content.type,
                value,
                "value_kana_right"
              )
            }
            value={shippingAddress.text?.kana_name_valueRight}
          />
        </div>
      </React.Fragment>
    );
  };

  const renderCardLinkSetting = () => {
    if (shippingAddress.card_linked_setting.length === 0 || !shippingAddress.card_linked_setting.includes(shippingAddress.value_initial_selection)) return;
    return (
      <React.Fragment>
        {renderTitle()}
        {renderName()}
        {renderKanaName()}
        <CommonAddress
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
        />
      </React.Fragment>
    );
  };

  return (
    <div className="m-b-10">
      <>
        <div className="ss-message__content--user-shipping-address-title">
          お届け先住所
        </div>
        {renderRadioContents()}
      </>
      {renderCardLinkSetting()}
    </div>
  )
};