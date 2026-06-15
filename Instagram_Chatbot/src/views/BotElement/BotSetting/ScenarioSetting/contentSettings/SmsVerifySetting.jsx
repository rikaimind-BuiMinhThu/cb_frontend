import React from 'react';
import InputCustom from '../scenarioComon/InputCustom';
import SelectCustom from '../scenarioComon/SelectCustom';
import { dropDownTitle } from '../constants/scenarioFormConstants';

const SmsVerifySetting = ({
  content,
  indexMessageSelect,
  indexContent,
  onChangeValueMessageContent,
}) => {
  const smsVerify = content.sms_verify;
  return (
    <>
      {content.type === 'sms_verify' && (
          <React.Fragment>
            <div className="ss-user-setting__item-bottom">
              <div
                  className="ss-user-setting__item-select-bottom-wrapper-flex">
                <SelectCustom
                    id="title"
                    style={{width: '49%'}}
                    value={smsVerify.title_require}
                    data={dropDownTitle}
                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title_require')}
                    keyValue="key"
                />
              </div>
            </div>
            {/* smsVerify: withTitle = true */}
            {smsVerify?.title_require === true &&
                <div className="ss-user-setting__item-bottom">
                  <InputCustom
                      placeholder="タイトル"
                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title')}
                      value={smsVerify.title}
                  />
                </div>
            }
          </React.Fragment>
      )}
    </>
  );
};

export default SmsVerifySetting;
