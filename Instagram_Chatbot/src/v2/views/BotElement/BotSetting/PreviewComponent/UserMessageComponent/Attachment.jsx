import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import 'v2/assets/css/bot/preview-chat-bot.css';
import { Button } from 'reactstrap';
import { MDBIcon } from 'mdbreact';
import { EMPTY_INPUT_VALUE, MESSAGE_CONTENT_TYPES, REQUIRED_FIELD_LABEL } from '../Constants';
import InputCustom from 'v2/components/BotMessages/InputCustom';

const UNSELECTED_FILE_LABEL = '未選択';
const SELECT_FILE_BUTTON_LABEL = 'ファイルを選択';
const FILE_SIZE_ERROR_MESSAGE = 'ファイルサイズは2MB以下です。';
const MAX_FILE_SIZE_MB = 2;
const FILE_TYPE_ERROR_PREFIX = 'ファイルには';
const FILE_TYPE_ERROR_SUFFIX = 'タイプのファイルを指定してください。';

const buildFileTypeErrorMessage = (fileTypes) =>
  `${FILE_TYPE_ERROR_PREFIX}${fileTypes.join(', ')}${FILE_TYPE_ERROR_SUFFIX}`;

const Attachment = ({ content, messageIndex, contentIndex, onChangeValue, onChangeErrors, errors, disabled }) => {
  const fileInputRef = useRef(null);

  if (!content || content.type !== MESSAGE_CONTENT_TYPES.ATTACHMENT) return null;

  const attachingFile = content.attaching_file;
  if (!attachingFile) return null;

  const errorKey = `message${messageIndex}_content${contentIndex}_${content.type}`;

  const changeErrorMessage = (message) => {
    onChangeErrors(errorKey, message);
  };

  const clearErrorMessage = () => {
    onChangeErrors(errorKey, EMPTY_INPUT_VALUE);
  };

  const onClickUploadFile = () => {
    fileInputRef.current?.click();
  };

  const getBaseUrl = (event) => {
    const file = event.target.files[0];
    const type = file.name.slice(file.name.lastIndexOf('.') + 1);
    if (attachingFile.file_type.length > 0 && !attachingFile.file_type.includes(type.toLowerCase())) {
      return changeErrorMessage(buildFileTypeErrorMessage(attachingFile.file_type));
    }
    if (file.size / 1024 / 1024 >= MAX_FILE_SIZE_MB) {
      return changeErrorMessage(FILE_SIZE_ERROR_MESSAGE);
    }

    clearErrorMessage();
    onChangeValue(contentIndex, 'attaching_file', file.name, 'value');
    onChangeValue(contentIndex, 'attaching_file', URL.createObjectURL(file), 'linkFile');
  };

  const renderRequireLabel = () => {
    if (!attachingFile.require) return null;

    return (
      <div className="ss-message__content--user-attaching_file-top">
        <span className="ss-message__content--user-text-input-required">
          {REQUIRED_FIELD_LABEL}
        </span>
      </div>
    );
  };

  const renderAttachmentUploadForm = () => (
    <div className="ss-message__content--user-attaching_file">
      <div className="attachment-relative">
        <InputCustom
          value={attachingFile.value || UNSELECTED_FILE_LABEL}
          disabled={true}
        />
        <MDBIcon
          fas
          icon="times-circle"
          className={`ss-message-custom-icon-times ${disabled && 'ss-message-custom-icon-times-disabled'}`}
          onClick={() => {
            if (!disabled) {
              onChangeValue(contentIndex, content.type, EMPTY_INPUT_VALUE, 'value');
            }
          }}
        />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        name="bot-file-upload"
        hidden
        onChange={getBaseUrl}
      />
      <Button
        id={`sp-button-upload-${contentIndex}`}
        className="ss-message__content--attaching_file-button-upload"
        disabled={disabled}
        onClick={onClickUploadFile}
      >
        {SELECT_FILE_BUTTON_LABEL}
      </Button>
    </div>
  );

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
      {renderRequireLabel()}
      {renderAttachmentUploadForm()}
      {renderErrorMessage()}
    </div>
  );
};

Attachment.propTypes = {
  content: PropTypes.object,
  messageIndex: PropTypes.number,
  contentIndex: PropTypes.number,
  onChangeValue: PropTypes.func,
  onChangeErrors: PropTypes.func,
  errors: PropTypes.object,
  disabled: PropTypes.bool,
};

export default Attachment;
