import React from "react";
import "assets/css/bot/preview-chat-bot.css";
import { MESSAGE_CONTENT_TYPES } from "views/BotElement/BotSetting/PreviewComponent/Constants";
import CommonCreditCardPayment from "./CommonCreditCardPayment";
import { Radio } from "antd";

export default function CardPaymentRadioButton({ content, indexMessage, contentIndex, onChangeValue, errors, disabled }) {
  if (!content || content.type !== MESSAGE_CONTENT_TYPES.CARD_PAYMENT_RADIO_BUTTON) return null;

  const cardPaymentRadioButton = content.card_payment_radio_button;

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
        style={{ width: "100%", fontSize: "14px" }}
        disabled={disabled}
        value={cardPaymentRadioButton.initial_selection}
      >
        {
          cardPaymentRadioButton.radio_contents.map(
            (itemPayment, indexPayment) => {
              return (
                <Radio
                  value={itemPayment.value}
                  key={indexPayment}
                  className="ss-message__content--user-card-payment-radio-content"
                  onChange={onRadioChange}
                >
                  {itemPayment.text}
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
        disabled={disabled}
        value={cardPaymentRadioButton.initial_selection}
        buttonStyle="solid"
      >
        {
          cardPaymentRadioButton.radio_contents.map(
            (itemPayment, indexPayment) => {
              return (
                <Radio.Button
                  value={itemPayment.value}
                  key={indexPayment}
                  className="ss-message__content--user-card-payment-radio-customized-style"
                  onChange={onRadioChange}
                >
                  {itemPayment.text}                             
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
            value={cardPaymentRadioButton.initial_selection_picture}
          >
            {itemPaymentImg.contents &&
              itemPaymentImg.contents.map(
                (itemPaymentContent, indexPaymentContent) => {
                  return (
                    <Radio
                      value={`${itemPaymentImg.id}-${itemPaymentContent.id}`}
                      key={indexPaymentContent}
                      className="m-r-0"
                      onChange={() => {
                        const value = cardPaymentRadioButton.initial_selection_picture !== `${itemPaymentImg.id}-${itemPaymentContent.id}` ? `${itemPaymentImg.id}-${itemPaymentContent.id}` : "";
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
                      <img src={itemPaymentContent.file_url} />
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

    // displayButtonNext(true);
    // if (messageContent.length === 1) onClickNext();

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
      <CommonCreditCardPayment content={content} indexMessage={indexMessage} contentIndex={contentIndex} onChangeValue={onChangeValue} errors={errors} disabled={disabled} />
    );
  };

  const errorKey = `message${indexMessage}_content${contentIndex}_${content.type}`;

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