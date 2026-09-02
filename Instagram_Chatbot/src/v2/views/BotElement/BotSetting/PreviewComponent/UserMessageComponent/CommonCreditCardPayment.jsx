import React from 'react';
import PropTypes from 'prop-types';
import "v2/assets/css/bot/preview-chat-bot.css";
import {
  EMPTY_INPUT_VALUE,
  MESSAGE_CONTENT_TYPES,
  REQUIRED_FIELD_LABEL,
  dataPaymentMethod as cardBrands,
  dataMonth as cardExpiredMonthOptions
} from "../Constants";
import InputCustom from "v2/components/BotMessages/InputCustom";
import InputNum from "v2/components/BotMessages/InputNum";
import SelectCustom from "v2/components/BotMessages/SelectCustom";
import cvcIcon from "assets/img/cvc-icon.png";
import { moveToNext } from "v2/views/BotElement/BotSetting/PreviewComponent/Utils";

import moment from "moment";

const CARD_NUMBER_LABEL = "カード番号";
const CARD_HOLDER_LABEL = "カード名義";
const CARD_EXPIRY_LABEL = "有効期限";
const CARD_CVC_LABEL = "CVC";
const CVC_PATTERN = /^[0-9]{0,4}$/;
const EXPIRY_TYPE_YM = "ym";

const CommonCreditCardPayment = ({ content, messageIndex, contentIndex, onChangeValue, errors, disabled, isDisplayError = true }) => {
  if (content.type !== MESSAGE_CONTENT_TYPES.CREDIT_CARD_PAYMENT && content.type !== MESSAGE_CONTENT_TYPES.CARD_PAYMENT_RADIO_BUTTON) return null;

  const creditCardPayment = content.type === MESSAGE_CONTENT_TYPES.CREDIT_CARD_PAYMENT ? content.credit_card_payment : content.card_payment_radio_button;

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
            {REQUIRED_FIELD_LABEL}
          </span>
        )}
      </div>
    );
  };

  const renderCardBrand = () => {
    if (creditCardPayment.payment_method.length === 0) return null;

    return (
      <div className="credit-card-bank-row">
        {creditCardPayment.payment_method.map((itemPayment, index) => {
          return (
            <div key={index} className="ss-img-list-bank credit-card-bank-thumb">
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
            classLabel="w-100-percent"
            id="sp_credit_card_payment"
            label={CARD_NUMBER_LABEL}
            type="number"
            onKeyPress={(e) => {
              if (e.target.value.length >= 16) e.preventDefault();
            }}
            disabled={disabled}
            onPaste={(e) => {
              e.preventDefault();
              const value = e.clipboardData
                .getData('text')
                .replace(/[^0-9]/g, '')
                .slice(0, 16);
              onChangeValue(
                contentIndex,
                content.type,
                value,
                'card_number'
              );
            }}
            className="w-100-flush"
            value={creditCardPayment.card_number || EMPTY_INPUT_VALUE}
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
        <div className="w-100-percent">{CARD_NUMBER_LABEL}</div>
        <div
          className="ss-user-setting__item-select-bottom-wrapper-flex ss-user-setting-card-number-separate-type w-100-percent"
        >
          <InputNum
            max={9999}
            controls={false}
            disabled={disabled}
            maxLength={4}
            className="ss-user-setting-input-limit-character m-l-0"
            value={creditCardPayment.card_number1 || EMPTY_INPUT_VALUE}
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
            disabled={disabled}
            maxLength={4}
            className="ss-user-setting-input-limit-character m-l-7"
            value={creditCardPayment.card_number2 || EMPTY_INPUT_VALUE}
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
            disabled={disabled}
            maxLength={4}
            className="ss-user-setting-input-limit-character m-l-7"
            value={creditCardPayment.card_number3 || EMPTY_INPUT_VALUE}
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
            disabled={disabled}
            maxLength={4}
            className="ss-user-setting-input-limit-character m-l-7"
            value={creditCardPayment.card_number4 || EMPTY_INPUT_VALUE}
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
    if (creditCardPayment.separate_name === true) {
      return (
        <div className="ss-user-setting__item-bottom">
          <div className="w-100-percent">{CARD_HOLDER_LABEL}</div>
          <div className="ss-user-setting__item-select-bottom-wrapper-flex w-100-percent">
            <InputCustom
              classLabel="w-100-percent"
              label={EMPTY_INPUT_VALUE}
              inline={false}
              disabled={disabled}
              value={creditCardPayment.card_holder1 || EMPTY_INPUT_VALUE}
              placeholder={creditCardPayment.card_holder_placeholder1 || EMPTY_INPUT_VALUE}
              onChange={(value) =>
                onChangeValue(
                  contentIndex,
                  content.type,
                  value,
                  "card_holder1"
                )
              }
            />
            <InputCustom
              classLabel="w-100-percent"
              className="m-l-7"
              label={EMPTY_INPUT_VALUE}
              inline={false}
              disabled={disabled}
              value={creditCardPayment.card_holder2 || EMPTY_INPUT_VALUE}
              placeholder={creditCardPayment.card_holder_placeholder2 || EMPTY_INPUT_VALUE}
              onChange={(value) =>
                onChangeValue(
                  contentIndex,
                  content.type,
                  value,
                  "card_holder2"
                )
              }
            />
          </div>
        </div>
      );
    }

    return (
      <div className="ss-user-setting__item-bottom">
        <InputCustom
          classLabel="w-100-percent"
          label={CARD_HOLDER_LABEL}
          inline={false}
          disabled={disabled}
          value={creditCardPayment.card_holder || EMPTY_INPUT_VALUE}
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
      <div className="credit-card-expire-row">
        <SelectCustom className="w-33-percent" value={creditCardPayment.year} disabled={disabled} placeholder={creditCardPayment.year_placeholder} data={cardExpiredYearOptions} onChange={(value) => onChangeValue(contentIndex, content.type, value, "year")} />
        <SelectCustom className="w-33-percent m-l-10" value={creditCardPayment.month} placeholder={creditCardPayment.month_placeholder} data={cardExpiredMonthOptions} disabled={disabled} onChange={(value) => onChangeValue(contentIndex, content.type, value, "month")} />
      </div>
    );
  };

  const renderExpirationDateMy = () => {
    return (
      <div className="credit-card-expire-row">
        <SelectCustom className="w-33-percent" value={creditCardPayment.month} placeholder={creditCardPayment.month_placeholder} data={cardExpiredMonthOptions} disabled={disabled} onChange={(value) => onChangeValue(contentIndex, content.type, value, "month")} />
        <SelectCustom className="w-33-percent m-l-10" value={creditCardPayment.year} disabled={disabled} placeholder={creditCardPayment.year_placeholder} data={cardExpiredYearOptions} onChange={(value) => onChangeValue(contentIndex, content.type, value, "year")} />
      </div>
    );
  };

  const renderExpirationDate = () => {
    const expirationForm = creditCardPayment.type_date_of_expiry === EXPIRY_TYPE_YM ? renderExpirationDateYm() : renderExpirationDateMy();

    return (
      <div className="ss-user-setting__item-bottom">
        <div className="w-100-percent">{CARD_EXPIRY_LABEL}</div>
        {expirationForm}
      </div>
    );
  };

  const renderCvc = () => {
    if (creditCardPayment.is_hide_cvc) return null;
    const cvcLabel = (
      <span className="f-weight-400">
        {CARD_CVC_LABEL} <img className="w-8-percent" src={cvcIcon} alt="" />
      </span>
    );

    return (
      <div className="ss-user-setting__item-bottom d-block">
        <InputCustom
          className="ss-user-setting-input-limit-character w-33-percent m-l-0"
          disabled={disabled}
          value={creditCardPayment.cvc || EMPTY_INPUT_VALUE}
          onChange={(value) => {
            if (CVC_PATTERN.test(value)) {
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
    if (!isDisplayError || !errors?.[errorKey]) return null;

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

CommonCreditCardPayment.propTypes = {
  content: PropTypes.object,
  messageIndex: PropTypes.number,
  contentIndex: PropTypes.number,
  onChangeValue: PropTypes.func,
  errors: PropTypes.object,
  disabled: PropTypes.bool,
  isDisplayError: PropTypes.bool,
};

export default CommonCreditCardPayment;
