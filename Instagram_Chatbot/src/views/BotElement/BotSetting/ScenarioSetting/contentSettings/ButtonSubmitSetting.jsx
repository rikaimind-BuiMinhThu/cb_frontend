import React from 'react';
import { Button } from 'reactstrap';
import { Tooltip } from '@mui/material';
import InputCustom from '../scenarioComon/InputCustom';
import SelectCustom from '../scenarioComon/SelectCustom';
import CheckboxCustom from '../scenarioComon/CheckboxCustom';
import SubmitButtonConfig from '../SubmitButtonConfig';

const ButtonSubmitSetting = ({
  content,
  indexMessageSelect,
  indexContent,
  dataMessages,
  setDataMessages,
  onChangeValueMessageContent,
  renderRootFaqOption,
  dataInputVar,
  setIsOpenAddVariable,
}) => {
  const buttonSubmit = content.button_submit;
  return (
    <>
      {content.type === 'button_submit' &&
        <>
          <div className="ss-user-setting__item-bottom" style={{ marginBottom: '0px', display: 'flex' }}>
            <div style={{ width: '45%' }}>
              <CheckboxCustom
                label="エラーメッセージを表示する"
                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_display_error_message')}
                value={buttonSubmit.is_display_error_message}
              />
            </div>
            <div style={{ width: '45%' }}>
              <CheckboxCustom
                label="JavaScriptの利用"
                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_use_js')}
                value={buttonSubmit.is_use_js}
              />
            </div>
            <div style={{ width: '45%' }}>
              <CheckboxCustom
                label="入力された内容を変数に保存する。"
                  onChange={(value) =>
                    onChangeValueMessageContent(
                      indexMessageSelect,
                      indexContent,
                      content.type,
                      value,
                      "is_save_input_content"
                    )
                  }
                value={buttonSubmit.is_save_input_content}
                isOnChange={false}
              />
            </div>
            <div style={{ width: '45%' }}>
              <CheckboxCustom
                label="確認メッセージ用"
                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'use_for_confirm_order')}
                value={buttonSubmit.use_for_confirm_order}
              />
            </div>
            <div style={{ width: '45%' }}>
              <CheckboxCustom
                label="ログイン済み時に表示しない"
                onChange={(value) => {
                  dataMessages[indexMessageSelect].not_display_when_logged_in = value;
                  setDataMessages([...dataMessages]);
                }}
                value={dataMessages[indexMessageSelect].not_display_when_logged_in}
              />
            </div>
            <div style={{ width: '45%' }}>
              <CheckboxCustom
                label="エラー発生の時に表示しない"
                onChange={(value) => {
                  dataMessages[indexMessageSelect].not_display_when_have_error = value;
                  setDataMessages([...dataMessages]);
                }}
                value={dataMessages[indexMessageSelect].not_display_when_have_error}
              />
            </div>
            <div style={{ width: '45%' }}>
              <CheckboxCustom
                label="確認するのみに表示"
                onChange={(value) => {
                  dataMessages[indexMessageSelect].only_display_when_confirm = value;
                  setDataMessages([...dataMessages]);
                }}
                value={dataMessages[indexMessageSelect].only_display_when_confirm}
              />
            </div>
            {renderRootFaqOption()}
          </div>
          {buttonSubmit.is_save_input_content && (
              <div className="ss-user-setting__item-bottom">
                <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                  <SelectCustom
                    style={{ width: "100%", marginRight: "10px" }}
                    id="title"
                    value={buttonSubmit.save_input_content}
                    data={dataInputVar}
                    keyValue="variable_name"
                    nameValue="variable_name"
                    onChange={(value) =>
                      onChangeValueMessageContent(
                        indexMessageSelect,
                        indexContent,
                        content.type,
                        value,
                        "save_input_content"
                      )
                    }
                  />
                  <Button
                    style={{ margin: "0px", lineHeight: "0px" }}
                    className="ss-user-setting__select-btn-add"
                    onClick={() => setIsOpenAddVariable(true)}
                  >
                    追加
                  </Button>
                </div>
              </div>
            )
          }
          {buttonSubmit.is_display_error_message &&
            <>
              <div className='ss-user-setting__item-bottom' style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                  <div style={{ flexBasis: '26%', maxWidth: '26%' }}>
                    <SelectCustom
                      id="title"
                      label="エラーメッセージ"
                      style={{ width: '100%' }}
                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['error_message_display_element_search_type']}
                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'error_message_display_element_search_type', value)}
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
                <div style={{ flexBasis: '63%', maxWidth: '63%', marginTop: '22px' }}>
                  <InputCustom
                    styleLabel={{ width: '100%' }}
                    maxLength={250}
                    useFukushashiki={true}
                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'error_message_display_element_search_value', value)}
                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['error_message_display_element_search_value']}
                    placeholder={{
                      1: '複写先要素のIDを入力ください',
                      2: '複写先要素のcss_selectorを入力ください',
                      3: '複写先要素のxPathを入力ください',
                    }[
                      dataMessages[indexMessageSelect]?.message_content[indexContent]?.['error_message_display_element_search_type']
                    ] || ''}
                  />
                </div>
              </div>
                                                        </>
                                                      }
                                                      {buttonSubmit.is_use_js &&
                                                        <>
                                                          <div className='ss-user-setting__item-bottom' style={{ width: '18%', fontSize: '14px', fontWeight: '400', marginBottom: '5px' }}>
                                                            jscode
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <textarea
                                                              style={{ width: '90%' }}
                                                              className="ss-user-setting-item-textarea-label ss-input-value"
                                                              placeholder="テキスト"
                                                              rows="8"
                                                              value={buttonSubmit.jscode}
                                                              onChange={e => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, e.target.value, 'jscode')}
                                                            />
                                                          </div>
                                                        </>
                                                      }
                                                      <div className="ss-user-setting__item-text_input-top" style={{ margin: '10px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                        <InputCustom
                                                          className="ss-user-setting-input-overview"
                                                          styleLabel={{ width: '90%' }}
                                                          style={{ width: '90%' }}
                                                          label="IDボタン"
                                                          inline={false}
                                                          placeholder={'IDボタン'}
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'button_submit_id', value)}
                                                          value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['button_submit_id']}
                                                        />
                                                        <InputCustom
                                                          className="ss-user-setting-input-overview"
                                                          styleLabel={{ width: '90%', marginTop: '10px' }}
                                                          style={{ width: '90%' }}
                                                          label="ボタン名称"
                                                          inline={false}
                                                          placeholder={'ボタン名称'}
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'button_submit_name', value)}
                                                          value={content.button_submit_name}
                                                        />
                                                        <SubmitButtonConfig
                                                          content={content}
                                                          onChange={onChangeValueMessageContent}
                                                          indexMessageSelect={indexMessageSelect}
                                                          indexContent={indexContent}
                                                          buttonSubmit={buttonSubmit}
                                                        />
                                                      </div>
                                                    </>}
    </>
  );
};

export default ButtonSubmitSetting;
