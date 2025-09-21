import React from "react";
import "assets/css/bot/preview-chat-bot.css";
import { MESSAGE_CONTENT_TYPES } from "views/BotElement/BotSetting/PreviewComponent/Constants";
import CommonAddress from "./CommonAddress";

export default function ZipCodeAddress({ content, prefecturesList, indexMessageRender, indexMessage, indexContent, messageContent, onChangeValue, onChangeErrors, errors, disabled, onOpen }) {
  if (content.type !== MESSAGE_CONTENT_TYPES.ZIP_CODE_ADDRESS) return <></>;

  return (
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
  )
};