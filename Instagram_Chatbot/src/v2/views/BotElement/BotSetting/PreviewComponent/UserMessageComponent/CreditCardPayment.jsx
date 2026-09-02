import React from "react";
import "v2/assets/css/bot/preview-chat-bot.css";
import {
  MESSAGE_CONTENT_TYPES,
  dataPaymentMethod as cardBrands,
  dataMonth as cardExpiredMonthOptions
} from "../Constants";
import InputCustom from "views/BotElement/BotSetting/ScenarioSetting/scenarioComon/InputCustom";
import InputNum from "views/BotElement/BotSetting/ScenarioSetting/scenarioComon/InputNum";
import SelectCustom from "views/BotElement/BotSetting/ScenarioSetting/scenarioComon/SelectCustom";
import cvcIcon from "assets/img/cvc-icon.png";
import { moveToNext } from "views/BotElement/BotSetting/PreviewComponent/Utils";

import moment from "moment";

export default function CreditCardPayment({ content, messageIndex, contentIndex, onChangeValue, errors, disabled }) {
  if (!content || content.type !== MESSAGE_CONTENT_TYPES.CREDIT_CARD_PAYMENT) return null;

  const creditCardPayment = content.credit_card_payment;

  const cardExpiredYearOptions =  Array.from({ length: 10 }, (_, i) => {
    return {
      key: moment().add(i, "years").format("YY"),
      value: moment().add(i, "years").format("YY"),
    };
  });

  const renderTitle = () => {
    if (!creditCardPayment.title_require && !creditCardPayment.require) return null;

    return (
      <div className="ss-message__content--user-pull_down-top m-b-0">
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
    );
  };

  const renderCardBrand = () => {
    if (creditCardPayment.payment_method.length === 0) return null;

    return (
      <div style={{ display: "flex", justifyContent: "flex-start", margin: "5px 0px" }}>
        {creditCardPayment.payment_method.map((itemPayment, index) => {
          return (
            <div key={index} className="ss-img-list-bank" style={{ width: `${15.6667}%`, marginRight: "1%" }}>
              {cardBrands.find((item) => item.key === itemPayment).value}
            </div>
          );
        })}
      </div>
    );
  };

  const renderCardNumber = () => {
    if (creditCardPayment.separate_type === false ) {
      return (
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
                  contentIndex,
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
            value={creditCardPayment.card_number || ""}
            placeholder={creditCardPayment.card_number_placeholder}
            onChange={(value) =>
              onChangeValue(
                contentIndex,
                content.type,
                value,
                "card_number"
              )
            }
          />
        </div>
      );
    }

    return (
      <div className="ss-user-setting__item-bottom">
        <div className="w-100-percent">カード番号</div>
        <div
          className="ss-user-setting__item-select-bottom-wrapper-flex ss-user-setting-card-number-separate-type w-100-percent"
        >
          <InputNum
            max={9999}
            controls={false}
            style={{ marginLeft: "0px" }}
            disabled={disabled}
            maxLength={4}
            className="ss-user-setting-input-limit-character"
            value={creditCardPayment.card_number1 || ""}
            placeholder={creditCardPayment.card_number_placeholder1}
            onChange={(value) => {
              onChangeValue(
                contentIndex,
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
            value={creditCardPayment.card_number2 || ""}
            placeholder={creditCardPayment.card_number_placeholder2}
            onChange={(value) => {
              onChangeValue(
                contentIndex,
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
            value={creditCardPayment.card_number3 || ""}
            placeholder={creditCardPayment.card_number_placeholder3}
            onChange={(value) => {
              onChangeValue(
                contentIndex,
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
            value={creditCardPayment.card_number4 || ""}
            placeholder={creditCardPayment.card_number_placeholder4}
            onChange={(value) =>
              onChangeValue(
                contentIndex,
                content.type,
                value,
                "card_number4"
              )
            }
          />
        </div>
      </div>
    );
  };

  const renderCardHolder = () => {
    if (creditCardPayment.is_hide_card_name === true) return null;

    return (
      <div className="ss-user-setting__item-bottom">
        <InputCustom
          styleLabel={{ width: "100%" }}
          label="カード名義"
          inline={false}
          disabled={disabled}
          value={creditCardPayment.card_holder || ""}
          placeholder={creditCardPayment.card_holder_placeholder}
          onChange={(value) =>
            onChangeValue(
              contentIndex,
              content.type,
              value,
              "card_holder"
            )
          }
        />
      </div>
    );
  };

  const renderExpirationDateYm = () => {
    return (
      <div style={{ display: "flex", width: "100%" }}>
        <SelectCustom style={{ width: "33%" }} value={creditCardPayment.year} disabled={disabled} placeholder={creditCardPayment.year_placeholder} data={cardExpiredYearOptions} onChange={(value) => onChangeValue(contentIndex, content.type, value, "year")} />
        <SelectCustom style={{ width: "33%", marginLeft: "10px" }} value={creditCardPayment.month} placeholder={creditCardPayment.month_placeholder} data={cardExpiredMonthOptions} disabled={disabled} onChange={(value) => onChangeValue(contentIndex, content.type, value, "month")} />
      </div>
    );
  };

  const renderExpirationDateMy = () => {
    return (
      <div style={{ display: "flex", width: "100%" }}>
        <SelectCustom style={{ width: "33%" }} value={creditCardPayment.month} placeholder={creditCardPayment.month_placeholder} data={cardExpiredMonthOptions} disabled={disabled} onChange={(value) => onChangeValue(contentIndex, content.type, value, "month")} />
        <SelectCustom style={{ width: "33%", marginLeft: "10px" }} value={creditCardPayment.year} disabled={disabled} placeholder={creditCardPayment.year_placeholder} data={cardExpiredYearOptions} onChange={(value) => onChangeValue(contentIndex, content.type, value, "year")} />
      </div>
    );
  };

  const renderExpirationDate = () => {
    const expirationForm = creditCardPayment.type_date_of_expiry === "ym" ? renderExpirationDateYm() : renderExpirationDateMy();

    return (
      <div className="ss-user-setting__item-bottom">
        <div className="w-100-percent">有効期限</div>
        {expirationForm}
      </div>
    );
  };

  const renderCvc = () => {
    if (creditCardPayment.is_hide_cvc) return null;
    const cvcLabel = (
      <span className="f-weight-400">
        CVC <img className="w-8-percent" src={cvcIcon} alt="" />
      </span>
    );

    return (
      <div className="ss-user-setting__item-bottom d-block">
        <InputCustom
          className="ss-user-setting-input-limit-character"
          disabled={disabled}
          style={{ marginLeft: "0px", width: "33%" }}
          value={creditCardPayment.cvc || ""}
          onChange={(value) => {
            if (/^[0-9]{0,4}$/.test(value)) {
              onChangeValue(contentIndex, content.type, value, "cvc")
            }
          }}
          label={cvcLabel}
          placeholder={creditCardPayment.cvc_placeholder}
        />
      </div>
    );
  };

  const errorKey = `message${messageIndex}_content${contentIndex}_${content.type}`;

  const renderErrorMessage = () => {
    if (!errors?.[errorKey]) return null;

    return (
      <div className="validation-error-message">
        {errors?.[errorKey]}
      </div>
    );
  };

  return (
    <div className="m-b-10">
      {renderTitle()}
      {renderCardBrand()}
      {renderCardNumber()}
      {renderCardHolder()}
      {renderExpirationDate()}
      {renderCvc()}
      {renderErrorMessage()}
    </div>
  );
};