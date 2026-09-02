import React from "react";
import "v2/assets/css/bot/preview-chat-bot.css";
import { MESSAGE_CONTENT_TYPES } from "v2/views/BotElement/BotSetting/PreviewComponent/Constants";
import CommonCreditCardPayment from "./CommonCreditCardPayment";
import { Radio } from "antd";
import {
  getPaymentGroupStyle,
  getPaymentOptionImage,
  getPaymentOptionStyle,
  normalizePaymentConfig,
} from "v2/views/BotElement/BotSetting/ScenarioSetting/utils/paymentStyleUtils";

const renderOptionLabel = (itemPayment, isSelected, displayStyle) => {
  const image = getPaymentOptionImage(itemPayment, isSelected);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      {image && (
        <img
          src={image}
          alt=""
          style={{ width: '24px', height: '24px', objectFit: 'contain' }}
        />
      )}
      <span>{itemPayment.text}</span>
    </span>
  );
};

export default function CardPaymentRadioButton({ content, messageIndex, contentIndex, onChangeValue, errors, disabled }) {
  if (!content || content.type !== MESSAGE_CONTENT_TYPES.CARD_PAYMENT_RADIO_BUTTON) return null;

  const cardPaymentRadioButton = content.card_payment_radio_button;
  const { layout, display_style: displayStyle } = normalizePaymentConfig(cardPaymentRadioButton);
  const groupStyle = getPaymentGroupStyle(layout);

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
            ※必須
          </span>
        )}
      </div>
    );
  };

  const renderRadioContent = () => {
    switch (cardPaymentRadioButton.type) {
      case "default":
        return renderDefaultRadioContent();
      case "customized_style":
        return renderCustomizedStyleRadioContent();
      case "picture_radio":
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
    )
  };

  const renderDefaultRadioContent = () => {
    if (!cardPaymentRadioButton.radio_contents) return null;

    return (
      <Radio.Group
        style={{ ...groupStyle, fontSize: "14px" }}
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
                  className="ss-message__content--user-card-payment-radio-content"
                  style={getPaymentOptionStyle(isSelected, displayStyle)}
                  onChange={onRadioChange}
                >
                  {renderOptionLabel(itemPayment, isSelected, displayStyle)}
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
        className="ss-message__content--user-card-payment-radio-container"
        style={groupStyle}
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
                  className="ss-message__content--user-card-payment-radio-customized-style"
                  style={getPaymentOptionStyle(isSelected, displayStyle)}
                  onChange={onRadioChange}
                >
                  {renderOptionLabel(itemPayment, isSelected, displayStyle)}
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
        <div key={indexPaymentImg} style={{ color: "#6789A6" }}>
          <Radio.Group
            disabled={disabled}
            className="ss-message__content--user-card-payment-radio-group-type-text_image"
            style={groupStyle}
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
                      className="m-r-0"
                      style={getPaymentOptionStyle(isSelected, displayStyle)}
                      onChange={() => {
                        const value = cardPaymentRadioButton.initial_selection_picture !== optionValue ? optionValue : "";
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
    const value = cardPaymentRadioButton.initial_selection !== itemPayment.value ? itemPayment.value : "";
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
    const isPictureRadio = cardPaymentRadioButton.type === "picture_radio";
    let isSelectLinkedCard = false;
    
    if (isPictureRadio) {
      const {card_linked_setting_picture, initial_selection_picture} = cardPaymentRadioButton;
      isSelectLinkedCard = !!card_linked_setting_picture && card_linked_setting_picture === initial_selection_picture;
    } else {
      const {card_linked_setting, initial_selection} = cardPaymentRadioButton;
      isSelectLinkedCard = card_linked_setting.length > 0 && card_linked_setting.includes(initial_selection);
    }

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
