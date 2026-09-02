import React, { useEffect, useState } from 'react';
import 'v2/assets/css/bot/preview-chat-bot.css';
import api from 'v2/api/api-management';
import ModalNoti from './ModalNoti';
import {
  MESSAGE_CONTENT_TYPES,
  PREVIEW_MESSAGE_CONTENT_TYPES,
  SCAN_REGEX,
} from 'v2/views/BotElement/BotSetting/PreviewComponent/Constants';
import moment from 'moment';
import { tokenExpired } from 'v2/api/tokenExpired';
import { SHORTEN_URL } from 'v2/variables/constants';
import locale from 'antd/es/date-picker/locale/ja_JP';
import 'moment/locale/zh-cn';
import SubmitButton from './UserMessageComponent/SubmitButton';
import { convertTextJapaneseByApi } from 'v2/utils/japaneseConverter';
import Image from './UserMessageComponent/Image';
import TextInput from './UserMessageComponent/TextInput';
import Label from './UserMessageComponent/Label';
import TextArea from './UserMessageComponent/TextArea';
import RadioButton from './UserMessageComponent/RadioButton';
import Checkbox from './UserMessageComponent/Checkbox';
import PullDown from './UserMessageComponent/PullDown';
import ZipCodeAddress from './UserMessageComponent/ZipCodeAddress';
import Attachment from './UserMessageComponent/Attachment';
import ShippingAddress from './UserMessageComponent/ShippingAddress';
import ProductPurchaseSelectOption from './UserMessageComponent/ProductPurchaseSelectOption';
import Calendar from './UserMessageComponent/Calendar';
import AgreeTerm from './UserMessageComponent/AgreeTerm';
import CreditCardPayment from './UserMessageComponent/CreditCardPayment';
import CardPaymentRadioButton from './UserMessageComponent/CardPaymentRadioButton';
import ContactForm from './UserMessageComponent/ContactForm';
import Capture from './UserMessageComponent/Capture';
import Carousel from './UserMessageComponent/Carousel';
import ProductPurchase from './UserMessageComponent/ProductPurchase';
import ProductPurchaseRadioButton from './UserMessageComponent/ProductPurchaseRadioButton';
import SliderInput from './UserMessageComponent/Slider';
import { isUserMessage } from './Utils';
import { handleDisableDateCalendar } from 'v2/views/BotElement/BotSetting/ScenarioSetting/utils/scenarioCalendarUtils';

const HISTORY_CLICK_URLS_API = '/api/v1/managements/history_click_urls';
const NOTIFICATION_CLOSE_DELAY_MS = 2000;
const CALENDAR_SEARCH_LIMIT = 100;
const LINK_TARGET_BLANK = '_blank';
const EMPTY_STRING = '';
const CHECKBOX_ITEM_SEPARATOR = '-';
const CALENDAR_TYPE = {
  START_END_DATE: 'start_end_date',
};
const CHECKBOX_TYPE = {
  IMG: 'checkbox_img',
};
const CARD_PAYMENT_TYPE = {
  PICTURE_RADIO: 'picture_radio',
};

const PULL_DOWN_DATE_ATTRS = {
  date_ym: { year: 'valueYear', month: 'valueMonth' },
  dob_ym: { year: 'valueYear', month: 'valueMonth' },
  date_ymd: { year: 'valueYear', month: 'valueMonth', day: 'valueDay' },
  dob_ymd: { year: 'valueYear', month: 'valueMonth', day: 'valueDay' },
  fixed_date: { year: 'valueYear', month: 'valueMonth', day: 'valueDay' },
  date_md: { month: 'valueMonth', day: 'valueDay' },
};

const findAvailableCalendarDate = (calendar) => {
  const dayOffsets = Array.from({ length: CALENDAR_SEARCH_LIMIT + 1 }, (_, offset) => offset);
  const availableOffset = dayOffsets.find(
    (offset) => !handleDisableDateCalendar(moment().add(offset, 'days'), calendar),
  );
  if (availableOffset === undefined) {
    return null;
  }
  return moment().add(availableOffset, 'days').format('YYYY-MM-DD');
};

const UserMessage = ({
  message,
  messageContentProps,
  onChangeValue,
  disabled = false,
  messageIndexRender,
  errorsProps,
  messageIndex,
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
  onRenderCompleted,
  cartSystem = '',
  footer = null,
}) => {
  const [messageContent, setMessageContent] = useState(messageContentProps);
  const [errors, setErrors] = useState(errorsProps);
  const [isOpenNoti, setIsOpenNoti] = useState(false);
  const [messageNoti, setMessageNoti] = useState('');

  const handleOnChangeJpConvertText = (contentIndex, contentType, field, subField) => (value) => {
    onChangeValue(contentIndex, contentType, value, field, subField);

    const nextContent = messageContent[contentIndex + 1];
    if (nextContent) {
      const convertType = messageContent[contentIndex][contentType].convertTextTypeValue;

      convertTextJapaneseByApi(value, convertType).then((textConvertedValue) => {
        onChangeValue(contentIndex + 1, contentType, textConvertedValue, field, subField);
      });
    }
  };

  useEffect(() => {
    setErrors(errorsProps);
  }, [errorsProps]);

  useEffect(() => {
    setMessageContent(messageContentProps);
  }, [messageContentProps]);

  useEffect(() => {
    if (!isUserMessage(message) || !messageContent) return;
    messageContent.forEach((content, contentIndex) => {
      if (content.type === MESSAGE_CONTENT_TYPES.CALENDAR) {
        const calendar = content.calendar;
        if (calendar.initial_selection && calendar.type !== CALENDAR_TYPE.START_END_DATE) {
          onChangeValue(contentIndex, content.type, findAvailableCalendarDate(calendar), 'date_select');
        } else if (calendar.initial_selection && calendar.type === CALENDAR_TYPE.START_END_DATE) {
          const dayOffsets = Array.from({ length: CALENDAR_SEARCH_LIMIT + 1 }, (_, offset) => offset);
          const availableOffset = dayOffsets.find(
            (offset) => !handleDisableDateCalendar(moment().add(offset, 'days'), calendar),
          );
          if (availableOffset === undefined) {
            onChangeValue(contentIndex, content.type, null, 'start_date_select');
            onChangeValue(contentIndex, content.type, null, 'end_date_select');
          } else {
            const selectedDate = moment().add(availableOffset, 'days');
            onChangeValue(contentIndex, content.type, selectedDate, 'start_date_select');
            onChangeValue(contentIndex, content.type, selectedDate, 'end_date_select');
          }
        }
      } else if (content.type === MESSAGE_CONTENT_TYPES.CHECKBOX) {
        const checkbox = content.checkbox;
        if (checkbox.all_item_checked && checkbox.type !== CHECKBOX_TYPE.IMG) {
          const checkedValue = checkbox[checkbox.type].map((item) => item.id);
          onChangeValue(contentIndex, content.type, checkedValue, 'checkedValue');
        } else if (checkbox.all_item_checked && checkbox.type === CHECKBOX_TYPE.IMG) {
          const initialSelectionPicture = checkbox[checkbox.type].flatMap((item) => (
            item.contents.map((itemContent) => `${item.id}${CHECKBOX_ITEM_SEPARATOR}${itemContent.id}`)
          ));
          onChangeValue(
            contentIndex,
            content.type,
            initialSelectionPicture,
            'initial_selection_picture',
          );
        }
      } else if (content.type === MESSAGE_CONTENT_TYPES.RADIO_BUTTON) {
        const radioButton = content.radio_button;
        if (radioButton.initial_selection) {
          onChangeValue(contentIndex, content.type, radioButton.initial_selection, 'initial_selection');
        }
      } else if (content.type === MESSAGE_CONTENT_TYPES.CARD_PAYMENT_RADIO_BUTTON) {
        const cardPaymentRadioButton = content.card_payment_radio_button;
        if (cardPaymentRadioButton.type !== CARD_PAYMENT_TYPE.PICTURE_RADIO && cardPaymentRadioButton.initial_selection) {
          onChangeValue(
            contentIndex,
            content.type,
            cardPaymentRadioButton.initial_selection,
            'initial_selection',
          );
        } else if (cardPaymentRadioButton.initial_selection_picture) {
          onChangeValue(
            contentIndex,
            content.type,
            cardPaymentRadioButton.initial_selection_picture,
            'initial_selection_picture',
          );
        }
      } else if (content.type === MESSAGE_CONTENT_TYPES.SHIPPING_ADDRESS) {
        const shippingAddress = content.shipping_address;
        if (shippingAddress.value_initial_selection) {
          onChangeValue(
            contentIndex,
            content.type,
            shippingAddress.value_initial_selection,
            'value_initial_selection',
          );
        }
      } else if (content.type === PREVIEW_MESSAGE_CONTENT_TYPES.PRODUCT_PURCHASE) {
        const productPurchase = content.product_purchase;
        onChangeValue(
          contentIndex,
          content.type,
          productPurchase.initial_selection,
          'initial_selection',
        );
      } else if (content.type === MESSAGE_CONTENT_TYPES.PULL_DOWN) {
        const pullDown = content.pull_down;
        const attrs = PULL_DOWN_DATE_ATTRS[pullDown.type] || {};
        Object.keys(attrs).forEach((key) => {
          const initValue = pullDown[pullDown.type][key];
          const currentValue = pullDown[pullDown.type][attrs[key]];
          if (!currentValue && initValue) {
            onChangeValue(contentIndex, content.type, initValue, pullDown.type, attrs[key]);
          }
        });
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps -- init-once; prop callback identity is unstable
  }, []);

  useEffect(() => {
    if (!isUserMessage(message)) return;
    if (!messageContent) return;
    if (messageContent.length > 1) return;
    if (messageContent[0].type !== MESSAGE_CONTENT_TYPES.IMAGE) return;

    onRenderCompleted();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- init-once; prop callback identity is unstable
  }, []);

  if (!isUserMessage(message)) return null;

  const handleClickCarousel = (urls, useShortenedUrls) => {
    if (!urls.trim().length) return;

    const data = {
      history_click_url: {
        origin_url: urls,
      },
    };
    api
      .post(`${HISTORY_CLICK_URLS_API}?chatbot_id=${botId}`, data)
      .then((response) => {
        if (response.data.code === 1) {
          const responseMessage = response.data.message;
          const link = document.createElement('a');
          link.href = useShortenedUrls
            ? SHORTEN_URL + responseMessage.shorten_code
            : responseMessage.origin_url;
          link.target = LINK_TARGET_BLANK;
          link.click();
        } else if (response.data.code === 2) {
          setMessageNoti(response.data.message[0]);
          setIsOpenNoti(true);
          setTimeout(() => {
            setIsOpenNoti(false);
            setMessageNoti(EMPTY_STRING);
          }, NOTIFICATION_CLOSE_DELAY_MS);
        }
      })
      .catch((error) => {
        if (error.response?.data.code === 0) {
          tokenExpired();
        }
      });
  };

  const replaceVariable = (contentText) => (
    contentText.replaceAll(SCAN_REGEX, (_text, variable) => {
      if (variables.length === 0) {
        return EMPTY_STRING;
      }
      const matchedVariable = variables.find((entry) => entry.variable_name === variable);
      return matchedVariable ? matchedVariable.default_value : EMPTY_STRING;
    })
  );

  const withReplacedTextAreaContent = (content) => {
    if (
      content.type !== MESSAGE_CONTENT_TYPES.TEXT_AREA
      || !content.textarea?.invalid_input?.content
    ) {
      return content;
    }

    return {
      ...content,
      textarea: {
        ...content.textarea,
        invalid_input: {
          ...content.textarea.invalid_input,
          content: replaceVariable(content.textarea.invalid_input.content),
        },
      },
    };
  };

  const renderContent = (content, contentIndex) => {
    switch (content.type) {
      case MESSAGE_CONTENT_TYPES.IMAGE:
        return <Image content={content} contentIndex={contentIndex} messageIndex={messageIndex} />;
      case MESSAGE_CONTENT_TYPES.TEXT_INPUT:
        return (
          <TextInput
            content={content}
            disabled={disabled}
            handleOnChangeJpConvertText={handleOnChangeJpConvertText}
            contentIndex={contentIndex}
            onChangeValue={onChangeValue}
            errors={errors}
            messageIndex={messageIndex}
          />
        );
      case MESSAGE_CONTENT_TYPES.LABEL:
        return <Label content={content} />;
      case MESSAGE_CONTENT_TYPES.TEXT_AREA:
        return (
          <TextArea
            content={withReplacedTextAreaContent(content)}
            disabled={disabled}
            onChangeValue={onChangeValue}
            errors={errors}
            contentIndex={contentIndex}
            messageIndex={messageIndex}
          />
        );
      case MESSAGE_CONTENT_TYPES.RADIO_BUTTON:
        return (
          <RadioButton
            content={content}
            disabled={disabled}
            onChangeValue={onChangeValue}
            errors={errors}
            contentIndex={contentIndex}
            messageIndex={messageIndex}
            onClickNext={onClickNext}
            notUseButtonNext={message.not_use_button}
          />
        );
      case MESSAGE_CONTENT_TYPES.CHECKBOX:
        return (
          <Checkbox
            content={content}
            disabled={disabled}
            onChangeValue={onChangeValue}
            errors={errors}
            contentIndex={contentIndex}
            messageIndex={messageIndex}
          />
        );
      case MESSAGE_CONTENT_TYPES.PULL_DOWN:
        return (
          <PullDown
            content={content}
            disabled={disabled}
            onChangeValue={onChangeValue}
            errors={errors}
            contentIndex={contentIndex}
            messageIndex={messageIndex}
            prefecturesList={prefecturesList}
            lpOptionData={lpOptionData}
            postMessageToParent={postMessageToParent}
            hidden={message.hidden}
          />
        );
      case MESSAGE_CONTENT_TYPES.ZIP_CODE_ADDRESS:
        return (
          <ZipCodeAddress
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
          />
        );
      case MESSAGE_CONTENT_TYPES.SHIPPING_ADDRESS:
        return (
          <ShippingAddress
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
          />
        );
      case MESSAGE_CONTENT_TYPES.PRODUCT_PURCHASE_SELECT_OPTION:
        return (
          <ProductPurchaseSelectOption
            content={content}
            messageIndex={messageIndex}
            contentIndex={contentIndex}
            onChangeValue={onChangeValue}
            errors={errors}
          />
        );
      case MESSAGE_CONTENT_TYPES.ATTACHMENT:
        return (
          <Attachment
            content={content}
            messageIndex={messageIndex}
            contentIndex={contentIndex}
            onChangeValue={onChangeValue}
            onChangeErrors={onChangeErrors}
            errors={errors}
            disabled={disabled}
          />
        );
      case MESSAGE_CONTENT_TYPES.CALENDAR:
        return (
          <Calendar
            content={content}
            messageIndex={messageIndex}
            contentIndex={contentIndex}
            onChangeValue={onChangeValue}
            errors={errors}
            disabled={disabled}
            locale={locale}
            cartSystem={cartSystem}
          />
        );
      case MESSAGE_CONTENT_TYPES.AGREE_TERM:
        return (
          <AgreeTerm
            content={content}
            messageIndex={messageIndex}
            contentIndex={contentIndex}
            onChangeValue={onChangeValue}
            errors={errors}
            disabled={disabled}
          />
        );
      case MESSAGE_CONTENT_TYPES.CREDIT_CARD_PAYMENT:
        return (
          <CreditCardPayment
            content={content}
            messageIndex={messageIndex}
            contentIndex={contentIndex}
            onChangeValue={onChangeValue}
            errors={errors}
            disabled={disabled}
          />
        );
      case MESSAGE_CONTENT_TYPES.CARD_PAYMENT_RADIO_BUTTON:
        return (
          <CardPaymentRadioButton
            content={content}
            messageIndex={messageIndex}
            contentIndex={contentIndex}
            onChangeValue={onChangeValue}
            errors={errors}
            disabled={disabled}
          />
        );
      case MESSAGE_CONTENT_TYPES.SUBMIT_BUTTON:
        return (
          <SubmitButton
            content={content}
            contentIndex={contentIndex}
            messageIndex={messageIndex}
            message={message}
            submitErrorMessage={submitErrorMessage}
            onChangeValue={onChangeValue}
            onClickNext={onClickNext}
            isProcessing={isProcessing}
          />
        );
      case MESSAGE_CONTENT_TYPES.LABEL_NO_TRANSITION:
        return (
          <div className="m-b-10">
            {content.label_no_transition.value}
          </div>
        );
      case MESSAGE_CONTENT_TYPES.CONTACT_FORM:
        return (
          <ContactForm
            content={content}
            disabled={disabled}
            onChangeValue={onChangeValue}
            onClickNext={onClickNext}
            errors={errors}
            contentIndex={contentIndex}
            messageIndex={messageIndex}
            message={message}
            isProcessing={isProcessing}
          />
        );
      case PREVIEW_MESSAGE_CONTENT_TYPES.CAROUSEL:
        return (
          <Carousel
            content={content}
            messageIndex={messageIndex}
            contentIndex={contentIndex}
            onChangeValue={onChangeValue}
            errors={errors}
            disabled={disabled}
            onCarouselInfoClick={handleClickCarousel}
            postMessageToParent={postMessageToParent}
          />
        );
      case PREVIEW_MESSAGE_CONTENT_TYPES.CAPTURE:
        return (
          <Capture
            content={content}
            messageIndex={messageIndex}
            contentIndex={contentIndex}
            onChangeValue={onChangeValue}
            errors={errors}
            disabled={disabled}
            captcha={captcha}
          />
        );
      case PREVIEW_MESSAGE_CONTENT_TYPES.PRODUCT_PURCHASE:
        return (
          <ProductPurchase
            content={content}
            messageIndex={messageIndex}
            contentIndex={contentIndex}
            onChangeValue={onChangeValue}
            errors={errors}
            disabled={disabled}
          />
        );
      case PREVIEW_MESSAGE_CONTENT_TYPES.PRODUCT_PURCHASE_RADIO_BUTTON:
        return (
          <ProductPurchaseRadioButton
            content={content}
            messageIndex={messageIndex}
            contentIndex={contentIndex}
            onChangeValue={onChangeValue}
            errors={errors}
            disabled={disabled}
          />
        );
      case PREVIEW_MESSAGE_CONTENT_TYPES.SLIDER:
        return (
          <SliderInput
            content={content}
            messageIndex={messageIndex}
            contentIndex={contentIndex}
            onChangeValue={onChangeValue}
            errors={errors}
            disabled={disabled}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="ss-user-message__content-wrapper">
      {messageContent?.map((content, contentIndex) => (
        <React.Fragment key={contentIndex}>
          {renderContent(content, contentIndex)}
        </React.Fragment>
      ))}
      {footer}
      <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
        <div className="preview-modal-noti-body">
          <span className="preview-modal-noti-text">{messageNoti}</span>
        </div>
      </ModalNoti>
    </div>
  );
};

export default UserMessage;
