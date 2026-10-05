import React from 'react';
import PropTypes from 'prop-types';
import { baseUserMessageComponentPropTypes } from './userMessageComponentPropTypes';
import "v2/assets/css/bot/preview-chat-bot.css";
import { MESSAGE_CONTENT_TYPES } from "v2/views/Preview/PreviewComponent/Constants";
import CommonAddress from "./CommonAddress";

const ZipCodeAddress = ({ content, prefecturesList, messageIndexRender, messageIndex, contentIndex, messageContent, onChangeValue, onChangeErrors, errors, disabled, onOpen }) => {
  if (content.type !== MESSAGE_CONTENT_TYPES.ZIP_CODE_ADDRESS) return <></>;

  return (
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
    />
  );
};

ZipCodeAddress.propTypes = {
  ...baseUserMessageComponentPropTypes,
  prefecturesList: PropTypes.array,
  messageIndexRender: PropTypes.number,
  messageContent: PropTypes.array,
  onChangeErrors: PropTypes.func,
  onOpen: PropTypes.func,
};

export default ZipCodeAddress;
