/* cSpell: disable */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import InputCustom from 'v2/components/BotMessages/InputCustom';
import { MDBIcon } from 'mdbreact';
import { Button } from 'reactstrap';
import {
  REQUIRED_LABEL,
  FILE_UNSELECTED,
  LABEL_SELECT_FILE,
  CONTENT_TYPE,
} from './constants';


const AttachingFileContent = ({
  content,
  indexContent,
  indexMessage,
  disabled,
  errors,
  onChangeValue,
}) => {
  const fileInputRef = useRef(null);
  const botUploadFile = () => {
    fileInputRef.current?.click();
  };
  const getBaseUrl = (event) => {
    const file = event.target.files[0];
    const urlFile = URL.createObjectURL(file);
    onChangeValue(indexContent, CONTENT_TYPE.ATTACHING_FILE, file.name, 'value');
    onChangeValue(indexContent, CONTENT_TYPE.ATTACHING_FILE, urlFile, 'linkFile');
  };
  const attachingFile = content.attaching_file;
  if (!attachingFile) {
    return null;
  }

  return (
                  <div className="chat-log-um-block" >
                    {attachingFile.require && (
                      <div className="ss-message__content--user-attaching_file-top">
                        {attachingFile.require === true && (
                          <span className="ss-message__content--user-text-input-required">
                            {REQUIRED_LABEL}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="ss-message__content--user-attaching_file">
                      <div className="chat-log-um-relative" >
                        <InputCustom
                          value={attachingFile.value || FILE_UNSELECTED}
                          disabled={true}
                        />
                        <MDBIcon
                          fas
                          icon="times-circle"
                          className={`ss-message-custom-icon-times ${
                            disabled && "ss-message-custom-icon-times-disabled"
                          }`}
                          onClick={() => {
                            if (!disabled) {
                              onChangeValue(
                                indexContent,
                                content.type,
                                "",
                                "value"
                              );
                            }
                          }}
                        />
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        name="bot-file-upload"
                        hidden
                        onChange={(e) => getBaseUrl(e)}
                      />
                      <Button
                        id={`sp-button-upload-${indexContent}`}
                        className="ss-message__content--user-attaching_file-btn chat-log-um-upload-btn"
                    
                        disabled={true}
                        onClick={botUploadFile}
                      >
                        {LABEL_SELECT_FILE}
                      </Button>
                    </div>
                    {errors?.[
                      `message${indexMessage}_content${indexContent}_${content.type}`
                    ] && (
                      <div className="chat-log-um-error" >
                        {
                          errors?.[
                            `message${indexMessage}_content${indexContent}_${content.type}`
                          ]
                        }
                      </div>
                    )}
                  </div>
  );
};

AttachingFileContent.propTypes = {
  content: PropTypes.object,
  indexContent: PropTypes.number,
  indexMessage: PropTypes.number,
  disabled: PropTypes.bool,
  errors: PropTypes.object,
  onChangeValue: PropTypes.func,
};

export default AttachingFileContent;
