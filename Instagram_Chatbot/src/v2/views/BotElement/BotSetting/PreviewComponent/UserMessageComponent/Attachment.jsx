import React from "react";
import "v2/assets/css/bot/preview-chat-bot.css";
import { Button } from "reactstrap";
import { MDBIcon } from "mdbreact";
import { MESSAGE_CONTENT_TYPES } from "../Constants";
import InputCustom from "v2/views/BotElement/BotSetting/ScenarioSetting/scenarioComon/InputCustom";

export default function Attachment({ content, messageIndex, contentIndex, onChangeValue, onChangeErrors, errors, disabled }) {
  if (!content || content.type !== MESSAGE_CONTENT_TYPES.ATTACHMENT) return null;

  const attachingFile = content.attaching_file;
  if (!attachingFile) return;

  const errorKey = `message${messageIndex}_content${contentIndex}_${content.type}`;

  const changeErrorMessage = (message) => {
    onChangeErrors(errorKey, message);
  };

  const clearErrorMessage = () => {
    onChangeErrors(errorKey, "");
  };

  const onClickUploadFile = () => {
    document.getElementById("ss-bot-file-upload-preview").click();
  }

  const getBaseUrl = (event, contentIndex) => {
    var file = event.target.files[0];
    const type = file.name.slice(file.name.lastIndexOf(".") + 1);
    if (attachingFile.file_type.length > 0 && !attachingFile.file_type.includes(type.toLowerCase())) {
      return changeErrorMessage(`ファイルには${attachingFile.file_type.join(", ")}タイプのファイルを指定してください。`);
    }
    if (file.size / 1024 / 1024 >= 2) {
      return changeErrorMessage("ファイルサイズは2MB以下です。");
    }

    clearErrorMessage();
    onChangeValue(contentIndex, "attaching_file", file.name, "value");
    onChangeValue(contentIndex, "attaching_file", URL.createObjectURL(file), "linkFile");
  };

  const renderRequireLabel = () => {
    if (!attachingFile.require) return;
    
    return (
      <div className="ss-message__content--user-attaching_file-top">
        <span className="ss-message__content--user-text-input-required">
          ※必須
        </span>
      </div>
    );
  };

  const renderAttachmentUploadForm = () => {
    return (
      <div className="ss-message__content--user-attaching_file">
        <div style={{ position: "relative" }}>
          <InputCustom
            value={attachingFile.value || "未選択"}
            disabled={true}
          />
          <MDBIcon
            fas
            icon="times-circle"
            className={`ss-message-custom-icon-times ${disabled && "ss-message-custom-icon-times-disabled"}`}
            onClick={() => {
              if (!disabled) {
                onChangeValue(contentIndex, content.type, "", "value");
              }
            }}
          />
        </div>
        <input
          type="file"
          id="ss-bot-file-upload-preview"
          name="bot-file-upload"
          hidden
          onChange={(e) => getBaseUrl(e, contentIndex)}
        />
        <Button
          id={`sp-button-upload-${contentIndex}`}
          className="ss-message__content--attaching_file-button-upload"
          disabled={disabled}
          onClick={onClickUploadFile}
        >
          ファイルを選択
        </Button>
      </div>
    );
  };

  const renderErrorMessage = () => {
    if (!errors?.[errorKey]) return;
    
    return (
      <div className="validation-error-message">
        {errors?.[errorKey]}
      </div>
    );
  };

  return (
    <div className="m-b-10">
      {renderRequireLabel()}
      {renderAttachmentUploadForm()}
      {renderErrorMessage()}
    </div>
  );
};
