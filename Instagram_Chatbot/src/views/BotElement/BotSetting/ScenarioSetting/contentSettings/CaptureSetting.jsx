import React from 'react';
import InputCustom from '../scenarioComon/InputCustom';
import SelectCustom from '../scenarioComon/SelectCustom';
import InputNum from '../scenarioComon/InputNum';
import { dropDownTitle } from '../constants/scenarioFormConstants';

const CaptureSetting = ({
  content,
  indexMessageSelect,
  indexContent,
  onChangeValueMessageContent,
}) => {
  const capture = content.capture;
  return (
    <>
      {content.type === 'capture' && (
        <React.Fragment>
          <div className="ss-user-setting__item-bottom">
            <SelectCustom
              // style={{ width: '90%' }}
              value={capture.title_require}
              data={dropDownTitle}
              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title_require')}
            />
          </div>
          {/* capture: withTitle = true */}
          {capture?.title_require === true &&
            <div className="ss-user-setting__item-bottom">
              <InputCustom
                placeholder="タイトル"
                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title')}
                value={capture.title}
              />
            </div>
          }
          <div className="ss-user-setting__item-bottom">
            <div style={{ display: 'flex', width: '90%', justifyContent: 'space-between' }}>
              <div style={{ width: '32%' }}>
                <div>タイプ</div>
                <SelectCustom
                  placeholder="type"
                  style={{ width: '100%' }}
                  value={capture.type}
                  data={[
                    { key: '0123456789', value: '数字' }, { key: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', value: '英数字' }, { key: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', value: 'アルファベットのみ' }
                  ]}
                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type')}
                />
              </div>
              <div style={{ width: '32%' }}>
                <div>長さ</div>
                <InputNum
                  className="ss-user-setting-input-limit-character"
                  style={{ width: '100%', marginLeft: '0px' }}
                  min={1}
                  max={9999}
                  value={capture.length}
                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'length')}
                />
              </div>
              <div style={{ width: '32%' }}>
                <div>色</div>
                <SelectCustom
                  placeholder="色"
                  style={{ width: '100%' }}
                  value={capture.colour}
                  data={[{ key: true, value: 'あり' }, { key: false, value: '無し' }]}
                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'colour')}
                />
              </div>
            </div>
          </div>
          <div className="ss-user-setting__item-bottom">
            <div style={{ width: '90%' }}>
              <img style={{ width: '35%' }} src={`https://svg-captcha-nodejs.vercel.app/captchapreview?size=${capture.length}${capture.colour ? "&color=true" : ""}&charPreset=${capture.type}`} />
            </div>
          </div>
        </React.Fragment>
      )}
    </>
  );
};

export default CaptureSetting;
