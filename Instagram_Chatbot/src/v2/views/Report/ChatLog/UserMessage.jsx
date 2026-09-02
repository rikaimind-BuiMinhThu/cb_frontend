/* cSpell: disable */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import 'v2/assets/css/bot/chat-log.css';
import {
  CALENDAR_TYPE,
  CHECKBOX_TYPE,
  CONTENT_TYPE,
  CARD_PAYMENT_RADIO_TYPE,
} from './userMessage/constants';
import {
  findFirstEnabledDate,
  findFirstEnabledRange,
  handleDisableDateCalendar,
  handleDisableEndDateCalendar,
  replaceVariable,
  shouldHideNextButton,
} from './userMessage/helpers';
import TextInputContent from './userMessage/TextInputContent';
import ImageContent from './userMessage/ImageContent';
import LabelContent from './userMessage/LabelContent';
import TextareaContent from './userMessage/TextareaContent';
import RadioButtonContent from './userMessage/RadioButtonContent';
import CheckboxContent from './userMessage/CheckboxContent';
import PullDownContent from './userMessage/PullDownContent';
import ZipCodeAddressContent from './userMessage/ZipCodeAddressContent';
import AttachingFileContent from './userMessage/AttachingFileContent';
import CalendarContent from './userMessage/CalendarContent';
import AgreeTermContent from './userMessage/AgreeTermContent';
import CarouselContent from './userMessage/CarouselContent';
import CreditCardPaymentContent from './userMessage/CreditCardPaymentContent';
import CaptureContent from './userMessage/CaptureContent';
import ProductPurchaseContent from './userMessage/ProductPurchaseContent';
import ProductPurchaseRadioButtonContent from './userMessage/ProductPurchaseRadioButtonContent';
import SliderContent from './userMessage/SliderContent';
import CardPaymentRadioButtonContent from './userMessage/CardPaymentRadioButtonContent';
import LabelNoTransitionContent from './userMessage/LabelNoTransitionContent';
import ButtonSubmitContent from './userMessage/ButtonSubmitContent';
import ContactFormContent from './userMessage/ContactFormContent';

const UserMessage = ({
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
}) => {
  const [messageContent, setMessageContent] = useState(messageContentProps);
  const [errors, setErrors] = useState(errorsProps);

  useEffect(() => {
    if (messageContent.length === 1) {
      const message = messageContent[0];
      displayButtonNext(!shouldHideNextButton(message));
    } else {
      displayButtonNext(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot; prop callback identity is unstable
  }, []);

  useEffect(() => {
    setErrors(errorsProps);
  }, [errorsProps]);

  useEffect(() => {
    setMessageContent(messageContentProps);
  }, [messageContentProps]);

  useEffect(() => {
    messageContent.forEach((content, indexContent) => {
      if (content.type === CONTENT_TYPE.CALENDAR) {
        const calendar = content.calendar;
        if (calendar.initial_selection && calendar.type !== CALENDAR_TYPE.START_END_DATE) {
          onChangeValue(
            indexContent,
            content.type,
            findFirstEnabledDate(calendar),
            'date_select',
          );
        } else if (
          calendar.initial_selection
          && calendar.type === CALENDAR_TYPE.START_END_DATE
        ) {
          const range = findFirstEnabledRange(calendar);
          calendar.start_date_select = range.start_date_select;
          calendar.end_date_select = range.end_date_select;
        }
      } else if (content.type === CONTENT_TYPE.CHECKBOX) {
        const checkbox = content.checkbox;
        if (checkbox.all_item_checked && checkbox.type !== CHECKBOX_TYPE.CHECKBOX_IMG) {
          checkbox[checkbox.type].forEach((item) => {
            checkbox.checkedValue.push(item.id);
          });
          onChangeValue(
            indexContent,
            content.type,
            checkbox.checkedValue,
            'checkedValue',
          );
        } else if (
          checkbox.all_item_checked
          && checkbox.type === CHECKBOX_TYPE.CHECKBOX_IMG
        ) {
          checkbox[checkbox.type].forEach((item) => {
            item.contents.forEach((itemContent) => {
              checkbox.initial_selection_picture.push(
                `${item.id}-${itemContent.id}`,
              );
            });
          });
          onChangeValue(
            indexContent,
            content.type,
            checkbox.initial_selection_picture,
            'initial_selection_picture',
          );
        }
      } else if (content.type === CONTENT_TYPE.RADIO_BUTTON) {
        const radioButton = content.radio_button;
        if (radioButton.initial_selection) {
          onChangeValue(
            indexContent,
            content.type,
            radioButton.initial_selection,
            'initial_selection',
          );
        }
      } else if (content.type === CONTENT_TYPE.CARD_PAYMENT_RADIO_BUTTON) {
        const cardPaymentRadioButton = content.card_payment_radio_button;
        if (
          cardPaymentRadioButton.type !== CARD_PAYMENT_RADIO_TYPE.PICTURE_RADIO
          && cardPaymentRadioButton.initial_selection
        ) {
          onChangeValue(
            indexContent,
            content.type,
            cardPaymentRadioButton.initial_selection,
            'initial_selection',
          );
        } else if (cardPaymentRadioButton.initial_selection_picture) {
          onChangeValue(
            indexContent,
            content.type,
            cardPaymentRadioButton.initial_selection_picture,
            'initial_selection_picture',
          );
        }
      } else if (content.type === CONTENT_TYPE.PRODUCT_PURCHASE) {
        const productPurchase = content.product_purchase;
        onChangeValue(
          indexContent,
          content.type,
          productPurchase.initial_selection,
          'initial_selection',
        );
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps -- init-once; prop callback identity is unstable
  }, []);

  const renderContent = (content, indexContent) => {
    const sharedProps = {
      content,
      indexContent,
      indexMessage,
      disabled,
      errors,
      onChangeValue,
      onClickNext,
      messageContentLength: messageContent.length,
      onOpen,
      dataPrefectures,
      displayButtonNext,
      captcha,
      handleDisableDateCalendar,
      handleDisableEndDateCalendar,
      variables,
    };

    switch (content.type) {
      case CONTENT_TYPE.TEXT_INPUT:
        return <TextInputContent {...sharedProps} />;
      case CONTENT_TYPE.IMAGE:
        return <ImageContent {...sharedProps} />;
      case CONTENT_TYPE.LABEL:
        return <LabelContent {...sharedProps} />;
      case CONTENT_TYPE.TEXTAREA:
        return <TextareaContent {...sharedProps} />;
      case CONTENT_TYPE.RADIO_BUTTON:
        return <RadioButtonContent {...sharedProps} />;
      case CONTENT_TYPE.CHECKBOX:
        return <CheckboxContent {...sharedProps} />;
      case CONTENT_TYPE.PULL_DOWN:
        return <PullDownContent {...sharedProps} />;
      case CONTENT_TYPE.ZIP_CODE_ADDRESS:
        return <ZipCodeAddressContent {...sharedProps} />;
      case CONTENT_TYPE.ATTACHING_FILE:
        return <AttachingFileContent {...sharedProps} />;
      case CONTENT_TYPE.CALENDAR:
        return <CalendarContent {...sharedProps} />;
      case CONTENT_TYPE.AGREE_TERM:
        return <AgreeTermContent {...sharedProps} />;
      case CONTENT_TYPE.CAROUSEL:
        return <CarouselContent {...sharedProps} />;
      case CONTENT_TYPE.CREDIT_CARD_PAYMENT:
        return <CreditCardPaymentContent {...sharedProps} />;
      case CONTENT_TYPE.CAPTURE:
        return <CaptureContent {...sharedProps} />;
      case CONTENT_TYPE.PRODUCT_PURCHASE:
        return <ProductPurchaseContent {...sharedProps} />;
      case CONTENT_TYPE.PRODUCT_PURCHASE_RADIO_BUTTON:
        return <ProductPurchaseRadioButtonContent {...sharedProps} />;
      case CONTENT_TYPE.SLIDER:
        return <SliderContent {...sharedProps} />;
      case CONTENT_TYPE.CARD_PAYMENT_RADIO_BUTTON:
        return <CardPaymentRadioButtonContent {...sharedProps} />;
      case CONTENT_TYPE.LABEL_NO_TRANSITION:
        return <LabelNoTransitionContent {...sharedProps} />;
      case CONTENT_TYPE.BUTTON_SUBMIT:
        return <ButtonSubmitContent {...sharedProps} />;
      case CONTENT_TYPE.CONTACT_FORM:
        return <ContactFormContent {...sharedProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="ss-user-message__content-wrapper">
      {messageContent?.map((content, indexContent) => {
        const nextContent = (
          content.type === CONTENT_TYPE.TEXTAREA
          && content.textarea?.invalid_input?.content
        ) ? {
          ...content,
          textarea: {
            ...content.textarea,
            invalid_input: {
              ...content.textarea.invalid_input,
              content: replaceVariable(
                content.textarea.invalid_input.content,
                variables,
              ),
            },
          },
        } : content;
        return (
          <React.Fragment key={nextContent.id ?? indexContent}>
            {renderContent(nextContent, indexContent)}
          </React.Fragment>
        );
      })}
    </div>
  );
};

UserMessage.propTypes = {
  messageContentProps: PropTypes.array,
  onChangeValue: PropTypes.func,
  disabled: PropTypes.bool,
  errorsProps: PropTypes.object,
  indexMessage: PropTypes.number,
  captcha: PropTypes.array,
  onClickNext: PropTypes.func,
  displayButtonNext: PropTypes.func,
  onOpen: PropTypes.func,
  dataPrefectures: PropTypes.array,
  variables: PropTypes.array,
};

export default UserMessage;
