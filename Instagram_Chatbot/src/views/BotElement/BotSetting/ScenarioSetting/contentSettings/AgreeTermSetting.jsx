import React from 'react';
import { MDBIcon } from 'mdbreact';
import { Tooltip } from '@mui/material';
import InputCustom from '../scenarioComon/InputCustom';
import SelectCustom from '../scenarioComon/SelectCustom';
import CheckboxCustom from '../scenarioComon/CheckboxCustom';
import InputDouble from '../scenarioComon/InputDouble';
import { dropDownTitle, agreeTermType } from '../constants/scenarioFormConstants';

const AgreeTermSetting = ({
  content,
  indexMessageSelect,
  indexContent,
  dataMessages,
  setDataMessages,
  onChangeValueMessageContent,
  isUseFukushashiki,
  handleRemoveItemContent,
  handleAddItemAgreeTerm,
}) => {
  const agreeTerm = content.agree_term;
  return (
    <>
      {content.type === 'agree_term' && (
        <React.Fragment>
          <div className="ss-user-setting__item-bottom">
            <CheckboxCustom
              label="ログイン済み時に表示しない"
              onChange={(value) => {
                dataMessages[indexMessageSelect].not_display_when_logged_in = value;
                setDataMessages([...dataMessages]);
              }}
              value={dataMessages[indexMessageSelect].not_display_when_logged_in}
            />
            <CheckboxCustom
              label="エラー発生の時に表示しない"
              onChange={(value) => {
                dataMessages[indexMessageSelect].not_display_when_have_error = value;
                setDataMessages([...dataMessages]);
              }}
              value={dataMessages[indexMessageSelect].not_display_when_have_error}
            />
            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
              <SelectCustom
                style={{ width: '49%' }}
                value={agreeTerm?.title_require}
                data={dropDownTitle}
                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title_require')}
              />
              <SelectCustom
                style={{ width: '49%' }}
                allowClear={false}
                value={agreeTerm?.type}
                data={agreeTermType}
                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type')}
              />
            </div>
          </div>
          {/* agreeTerm: withTitle = true */}
          {agreeTerm.title_require === true &&
            <div className="ss-user-setting__item-bottom">
              <InputCustom
                placeholder="タイトル"
                value={agreeTerm.title}
                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title')}
              />
            </div>
          }
          {/* agreeTerm: type = detail_content */}
          {agreeTerm.type === 'detail_content' &&
            <div className="ss-user-setting__item-bottom">
              <textarea
                style={{ width: '90%' }}
                className="ss-user-setting-item-textarea-label ss-input-value"
                placeholder="テキスト"
                rows="5"
                value={agreeTerm.detail_content.content}
                onChange={e => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, e.target.value, 'detail_content', 'content')}
              ></textarea>
            </div>
          }
          {/* agreeTerm: type = post_link_only */}
          {agreeTerm.type === 'post_link_only' &&
            <React.Fragment>
              {
                Array.isArray(agreeTerm.post_link_only) &&
                agreeTerm.post_link_only.map((agreeTermItem, indexAgree, array) => {
                  return (
                    <div key={indexAgree} className="ss-user-setting__item-bottom">
                      <div className="ss-user-setting-item-radio-button-drag" style={{ width: '87%' }}>
                        <div style={{ marginBottom: '10px', width: '100%', backgroundColor: '#F8F9FA', padding: '5px' }}>
                          <InputCustom
                            icon={array.length >= 2 ? "times-circle" : ""}
                            classIcon="ss-plus-circle-option-icon-times"
                            onClickIcon={() => handleRemoveItemContent(indexMessageSelect, indexContent, content.type, agreeTerm.type, indexAgree)}
                            style={{ width: '94%', marginBottom: '10px', display: 'inline' }}
                            placeholder="コメント"
                            value={agreeTermItem.title_comment}
                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, agreeTerm.type, indexAgree, 'title_comment')}
                          />
                          <InputDouble
                            classCustom="ss-user-setting-custom-double-input"
                            onChange={(value, name) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, agreeTerm.type, indexAgree, name === 'left' ? 'title' : 'urls')}
                            valueLeft={agreeTermItem.title}
                            valueRight={agreeTermItem.urls}
                            placeholder={['タイトル', 'URLs']}
                          />
                          <InputCustom
                            style={{ width: '100%', marginBottom: '10px' }}
                            placeholder="コメント"
                            value={agreeTermItem.url_comment}
                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, agreeTerm.type, indexAgree, 'url_comment')}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })
              }
              <div className="ss-user-setting__item-bottom" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <MDBIcon
                  fas
                  icon="plus-circle"
                  className="ss-plus-circle-option-icon"
                  onClick={() => handleAddItemAgreeTerm(indexMessageSelect, indexContent, content.type, agreeTerm.type)}
                />
              </div>
              
            </React.Fragment>
          }
          <div className="ss-user-setting__item-bottom">
            <CheckboxCustom
              className="ss-user-setting__item-custom-input-checkbox"
              styleSpan={{ width: '100%' }}
              disabled
              label={
                <InputCustom
                  maxLength={Number.MAX_SAFE_INTEGER}
                  placeholder="テキスト"
                  style={{ width: '100%', color: '#252422' }}
                  value={agreeTerm.term}
                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'term')}
                />
              }
              onChange={value => console.log(value)}
              value={false}
            />
          </div>
          {isUseFukushashiki && <div className='ss-user-setting__item-row' style={{ display: 'flex', gap: '10px', marginLeft: '34px',width:'90%' }}>
            <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                  <div style={{ width: '20%' }}>
                    <SelectCustom
                      id="title"
                      style={{ width: '100%' }}
                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['fukushashiki_search_mode']}
                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'fukushashiki_search_mode', value)}
                      data={[
                        { key: 1, value: 'id' },
                        { key: 2, value: 'css_selector' },
                        { key: 3, value: 'xpath' }
                      ]}
                      keyValue="key"
                      placeholder="複写先要素の取得方法をお選びください"
                    />
                  </div>
            </Tooltip>
            <Tooltip title={{
                        1: '複写先要素のIDを入力ください',
                        2: '複写先要素のcss_selectorを入力ください',
                        3: '複写先要素のxPathを入力ください',
                      }[
                        dataMessages[indexMessageSelect]?.message_content[indexContent]?.['fukushashiki_search_mode']
                      ] || ''} placement="top">
                  <div style={{ flex: '80%' }}>
                    <InputCustom
                      styleLabel={{ width: '100%' }}
                      style={{ width: '100%' }}
                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'fukushashiki_search_value', value)}
                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['fukushashiki_search_value']}
                      placeholder={{
                        1: '複写先要素のIDを入力ください',
                        2: '複写先要素のcss_selectorを入力ください',
                        3: '複写先要素のxPathを入力ください',
                      }[
                        dataMessages[indexMessageSelect]?.message_content[indexContent]?.['fukushashiki_search_mode']
                      ] || ''}
                    />
                  </div>
            </Tooltip>
                </div>}
        </React.Fragment>
      )}
    </>
  );
};

export default AgreeTermSetting;
