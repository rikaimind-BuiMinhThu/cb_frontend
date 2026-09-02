import React from 'react';
import { baseUserMessageComponentPropTypes } from './userMessageComponentPropTypes';
import "v2/assets/css/bot/preview-chat-bot.css";
import { EMPTY_INPUT_VALUE, MESSAGE_CONTENT_TYPES, REQUIRED_FIELD_LABEL } from "v2/views/Preview/PreviewComponent/Constants";
import CommonCreditCardPayment from "./CommonCreditCardPayment";
import { Radio } from "antd";
import {
  getPaymentOptionImage,
  normalizePaymentConfig,
} from "v2/views/ScenarioSetting/utils/paymentStyleUtils";

const CARD_PAYMENT_TYPES = {
  DEFAULT: "default",
  CUSTOMIZED_STYLE: "customized_style",
  PICTURE_RADIO: "picture_radio",
};
const PAYMENT_GROUP_CLASS = {
  horizontal: "payment-group-row",
  vertical: "payment-group-column",
};

const getPaymentOptionVarStyle = (isSelected, displayStyle = {}) => {
  const backgroundColor = isSelected
    ? displayStyle.selected_bg_color
    : displayStyle.unselected_bg_color;
  const borderColor = isSelected
    ? displayStyle.selected_border_color
    : displayStyle.unselected_border_color;

  return {
    ...(backgroundColor ? { "--payment-option-bg": backgroundColor } : {}),
    ...(borderColor ? { "--payment-option-border": borderColor } : {}),
  };
};

const renderOptionLabel = (itemPayment, isSelected) => {
  const image = getPaymentOptionImage(itemPayment, isSelected);
  return (
    <span className="preview-inline-center">
      {image && (
        <img
          src={image}
          alt=""
          className="preview-icon-24"
        />
      )}
      <span>{itemPayment.text}</span>
    </span>
  );
};

const CardPaymentRadioButton = ({ content, messageIndex, contentIndex, onChangeValue, errors, disabled }) => {
  if (!content || content.type !== MESSAGE_CONTENT_TYPES.CARD_PAYMENT_RADIO_BUTTON) return null;

  const cardPaymentRadioButton = content.card_payment_radio_button;
  const { layout, display_style: displayStyle } = normalizePaymentConfig(cardPaymentRadioButton);
  const groupClassName = PAYMENT_GROUP_CLASS[layout] || PAYMENT_GROUP_CLASS.vertical;

  const renderTitle = () => {
    if (!cardPaymentRadioButton.title_require && !cardPaymentRadioButton.require) return null;

    return (
      <div className="ss-message__content--user-text-input-top m-b-0">
        {cardPaymentRadioButton.title_require && (
          <span className="ss-message__content--user-text-input-title">
            {cardPaymentRadioButton.title}
          </span>
        )}
        {cardPaymentRadioButton.require === true && (
          <span className="ss-message__content--user-text-input-required">
            {REQUIRED_FIELD_LABEL}
          </span>
        )}
      </div>
    );
  };

  const renderRadioContent = () => {
    switch (cardPaymentRadioButton.type) {
      case CARD_PAYMENT_TYPES.DEFAULT:
        return renderDefaultRadioContent();
      case CARD_PAYMENT_TYPES.CUSTOMIZED_STYLE:
        return renderCustomizedStyleRadioContent();
      case CARD_PAYMENT_TYPES.PICTURE_RADIO:
        return renderPictureRadioContent();
      default:
        return null;
    }
  };

  const renderDescriptionPayment = () => {
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
    );
  };

  const renderDefaultRadioContent = () => {
    if (!cardPaymentRadioButton.radio_contents) return null;

    return (
      <Radio.Group
        className={`${groupClassName} radio-group-font-14`}
        disabled={disabled}
        value={cardPaymentRadioButton.initial_selection}
      >
        {
          cardPaymentRadioButton.radio_contents.map(
            (itemPayment, indexPayment) => {
              const isSelected = cardPaymentRadioButton.initial_selection === itemPayment.value;
              return (
                <Radio
                  value={itemPayment.value}
                  key={indexPayment}
                  className="ss-message__content--user-card-payment-radio-content payment-option"
                  style={getPaymentOptionVarStyle(isSelected, displayStyle)}
                  onChange={onRadioChange}
                >
                  {renderOptionLabel(itemPayment, isSelected)}
                </Radio>
              );
            }
          )}
        {renderDescriptionPayment(cardPaymentRadioButton)}
      </Radio.Group>
    );
  };

  const renderCustomizedStyleRadioContent = () => {
    if (!cardPaymentRadioButton.radio_contents) return null;

    return (
      <Radio.Group
        className={`ss-message__content--user-card-payment-radio-container ${groupClassName}`}
        disabled={disabled}
        value={cardPaymentRadioButton.initial_selection}
        buttonStyle="solid"
      >
        {
          cardPaymentRadioButton.radio_contents.map(
            (itemPayment, indexPayment) => {
              const isSelected = cardPaymentRadioButton.initial_selection === itemPayment.value;
              return (
                <Radio.Button
                  value={itemPayment.value}
                  key={indexPayment}
                  className="ss-message__content--user-card-payment-radio-customized-style payment-option"
                  style={getPaymentOptionVarStyle(isSelected, displayStyle)}
                  onChange={onRadioChange}
                >
                  {renderOptionLabel(itemPayment, isSelected)}
                </Radio.Button>
              );
            }
          )}
      </Radio.Group>
    );
  };

  const renderPictureRadioContent = () => {
    if (!cardPaymentRadioButton.radio_contents_img) return null;

    return cardPaymentRadioButton.radio_contents_img.map((itemPaymentImg, indexPaymentImg) => {
      return (
        <div key={indexPaymentImg} className="card-payment-img-label">
          <Radio.Group
            disabled={disabled}
            className={`ss-message__content--user-card-payment-radio-group-type-text_image ${groupClassName}`}
            value={cardPaymentRadioButton.initial_selection_picture}
          >
            {itemPaymentImg.contents &&
              itemPaymentImg.contents.map(
                (itemPaymentContent, indexPaymentContent) => {
                  const optionValue = `${itemPaymentImg.id}-${itemPaymentContent.id}`;
                  const isSelected = cardPaymentRadioButton.initial_selection_picture === optionValue;
                  const matchedRadio = cardPaymentRadioButton.radio_contents?.find(
                    (item) => item.value === itemPaymentContent.value
                      || item.text === itemPaymentContent.text,
                  );
                  const stateImage = matchedRadio
                    ? getPaymentOptionImage(matchedRadio, isSelected)
                    : null;

                  return (
                    <Radio
                      value={optionValue}
                      key={indexPaymentContent}
                      className="m-r-0 payment-option"
                      style={getPaymentOptionVarStyle(isSelected, displayStyle)}
                      onChange={() => {
                        const value = cardPaymentRadioButton.initial_selection_picture !== optionValue ? optionValue : EMPTY_INPUT_VALUE;
                        const isDisplayCardPayment = cardPaymentRadioButton.card_linked_setting_picture === value;

                        onChangeValue(
                          contentIndex,
                          content.type,
                          isDisplayCardPayment,
                          "is_display_card_payment"
                        );

                        onChangeValue(
                          contentIndex,
                          content.type,
                          value,
                          "initial_selection_picture"
                        );
                      }}
                    >
                      <img src={stateImage || itemPaymentContent.file_url} alt="" />
                      <div className="ss-message__content--user-card-payment-radio-group-type-text_image-text">
                        {itemPaymentContent.text}
                      </div>
                    </Radio>
                  );
                }
              )}
          </Radio.Group>
        </div>
      );
    });
  };

  const onRadioChange = (e) => {
    const itemPayment = e.target;
    const value = cardPaymentRadioButton.initial_selection !== itemPayment.value ? itemPayment.value : EMPTY_INPUT_VALUE;
    const isDisplayCardPayment = cardPaymentRadioButton.card_linked_setting.includes(value);

    onChangeValue(
      contentIndex,
      content.type,
      isDisplayCardPayment,
      "is_display_card_payment"
    );

    onChangeValue(
      contentIndex,
      content.type,
      value,
      "initial_selection"
    );
  };

  const renderCreditCardPayment = () => {
    const isPictureRadio = cardPaymentRadioButton.type === CARD_PAYMENT_TYPES.PICTURE_RADIO;
    const isSelectLinkedCard = isPictureRadio
      ? !!cardPaymentRadioButton.card_linked_setting_picture
        && cardPaymentRadioButton.card_linked_setting_picture === cardPaymentRadioButton.initial_selection_picture
      : cardPaymentRadioButton.card_linked_setting.length > 0
        && cardPaymentRadioButton.card_linked_setting.includes(cardPaymentRadioButton.initial_selection);

    if (!isSelectLinkedCard) return null;

    return (
      <CommonCreditCardPayment content={content}
        messageIndex={messageIndex}
        contentIndex={contentIndex}
        onChangeValue={onChangeValue}
        errors={errors}
        isDisplayError={false}
        disabled={disabled} />
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
      {renderRadioContent()}
      {renderCreditCardPayment()}
      {renderErrorMessage()}
    </div>
  );
};

CardPaymentRadioButton.propTypes = {
  ...baseUserMessageComponentPropTypes,
};

export default CardPaymentRadioButton;
