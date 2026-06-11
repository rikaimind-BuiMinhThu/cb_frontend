import React from 'react';
import { Button } from 'reactstrap';
import { MDBIcon } from 'mdbreact';
import { Tooltip } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Checkbox } from 'antd';
import CheckboxCustom from '../scenarioComon/CheckboxCustom';
import SelectCustom from '../scenarioComon/SelectCustom';
import InputNum from '../scenarioComon/InputNum';
import InputDouble from '../scenarioComon/InputDouble';
import InputCustom from '../scenarioComon/InputCustom';
import OptionGenderConfig from '../OptionGenderConfig';
import { renderFukushashikiSetting } from '../ScenarioUtils';
import { LABELS } from '../../PreviewComponent/Constants';
import {
  dropDownTitle,
  convertTextType,
  type as textInputTypeOptions,
  typeTextarea,
  typeRadio,
  typeCheckbox,
  rangeText,
  hyphenPhoneNumber,
  dataConsumeApiResponse,
  dataTypePullDown,
  dataHourFixed,
  dataMinutesFixed,
  dataEveryMinuteFixed,
  dataYearFixed,
  dataMonthFixed,
  dataDayFixed,
} from '../constants/scenarioFormConstants';

const TextareaSetting = ({
  indexMessageSelect,
  indexContent,
  content,
  textarea,
  dataMessages,
  setDataMessages,
  onChangeValueMessageContent,
  renderRootFaqOption,
  dataInputVar,
  setIsOpenAddVariable,
  isUseFukushashiki,
}) => {
  return (
                                                    <React.Fragment>
                                                      {/* textarea: type = text */}
                                                      {textarea.type === 'text_input' && (
                                                        <div className="ss-user-setting__item-text_input-top">
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
                                                          {renderRootFaqOption()}
                                                          <CheckboxCustom
                                                            label="入力された内容を変数に保存する。"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'textarea', value, 'is_save_input_content')}
                                                            value={textarea.is_save_input_content}
                                                          />
                                                          {textarea.is_save_input_content &&
                                                            <div className="ss-user-setting__item-bottom">
                                                              <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                                <SelectCustom
                                                                  style={{ width: '100%', marginRight: '10px' }}
                                                                  id="title"
                                                                  value={textarea?.save_input_content}
                                                                  data={dataInputVar}
                                                                  keyValue="variable_name"
                                                                  nameValue="variable_name"
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'save_input_content')}
                                                                />
                                                                <Button style={{ margin: '0px', lineHeight: '0px' }} className="ss-user-setting__select-btn-add" onClick={() => setIsOpenAddVariable(true)}>追加</Button>
                                                              </div>
                                                            </div>
                                                          }
                                                          <CheckboxCustom
                                                            label="必須"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'require')}
                                                            value={textarea.require}
                                                          />
                                                        </div>
                                                      )}
                                                      <div className="ss-user-setting__item-bottom">
                                                        <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                          <SelectCustom
                                                            id="title"
                                                            style={{ width: '49%' }}
                                                            value={textarea?.title_require}
                                                            data={dropDownTitle}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title_require')}
                                                            keyValue="key"
                                                          />
                                                          <SelectCustom
                                                            id="type"
                                                            allowClear={false}
                                                            style={{ width: '49%' }}
                                                            value={textarea.type}
                                                            data={typeTextarea}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type')}
                                                            keyValue="key"
                                                          />
                                                        </div>
                                                      </div>
                                                      {/* textarea: withTitle = true */}
                                                      {textarea.title_require === true &&
                                                        <div className="ss-user-setting__item-bottom">
                                                          <InputCustom
                                                            placeholder="タイトル"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title')}
                                                            value={textarea?.title}
                                                          />
                                                        </div>
                                                      }
                                                      {/* textarea: type = text_input */}
                                                      {textarea.type === 'text_input' && (
                                                        <div className="ss-user-setting__item-bottom-flex-start">
                                                          <span className="ss-user-setting-label">字数制限</span>
                                                          <InputNum
                                                            placeholder="0000"
                                                            className="ss-user-setting-input-limit-character"
                                                            max={textarea.text_input?.character_limit_to}
                                                            min={0}
                                                            value={textarea.text_input?.character_limit_from}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textarea.type, 'character_limit_from')}
                                                          />
                                                          <span style={{ fontSize: '30px', marginLeft: '10px', opacity: '0.4' }}>~</span>
                                                          <InputNum
                                                            placeholder="0000"
                                                            className="ss-user-setting-input-limit-character"
                                                            min={textarea.text_input?.character_limit_from || 0}
                                                            value={textarea.text_input?.character_limit_to}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textarea.type, 'character_limit_to')}
                                                          />
                                                        </div>
                                                      )}
                                                      {/* textarea: type = text_input || invalid_input */}
                                                      {/* text_input: type = textarea  ADD_FUKU*/}
                                                      {(textarea.type === 'text_input' || textarea.type === 'invalid_input') && (
                                                        <div className="ss-user-setting__item-bottom">
                                                          <textarea
                                                            style={{ width: '90%' }}
                                                            className="ss-user-setting-item-textarea-label ss-input-value"
                                                            placeholder="プレースホルダ"
                                                            rows="5"
                                                            value={textarea[textarea.type]?.content}
                                                            onChange={e => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, e.target.value, textarea.type, 'content')}
                                                          ></textarea>
                                                        </div>
                                                      )}
                                                      {isUseFukushashiki && (
                                                            <div className='ss-user-setting__item-bottom' style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                              <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                <div style={{ flexBasis: '22%', maxWidth: '22%' }}>
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
                                                              <div style={{ flexBasis: '67%', maxWidth: '67%' }}>
                                                                <InputCustom
                                                                  styleLabel={{ width: '100%' }}
                                                                  maxLength={250}
                                                                  useFukushashiki={true}
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
                                                            </div>
                                                          )}
                                                      {/* textarea: type = consume_api_response */}
                                                      {(textarea.type === 'consume_api_response') && (
                                                        <div className="ss-user-setting__item-bottom">
                                                          <SelectCustom
                                                            id="range"
                                                            value={textarea.consume_api_response}
                                                            data={dataConsumeApiResponse}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textarea.type, 'consume_api_response')}
                                                            keyValue="key"
                                                          />
                                                        </div>
                                                      )}
                                                    </React.Fragment>
  );
};

export default TextareaSetting;
