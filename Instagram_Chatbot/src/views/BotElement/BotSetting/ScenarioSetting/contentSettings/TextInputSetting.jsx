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
import UserContentCommonOptions from './shared/UserContentCommonOptions';
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

const TextInputSetting = ({
  indexMessageSelect,
  indexContent,
  content,
  textInput,
  dataMessages,
  setDataMessages,
  onChangeValueMessageContent,
  renderRootFaqOption,
  dataInputVar,
  setIsOpenAddVariable,
  isUseFukushashiki,
}) => {
  return (
                                                    <>
                                                      <UserContentCommonOptions
                                                        contentType="text_input"
                                                        contentData={textInput}
                                                        indexMessageSelect={indexMessageSelect}
                                                        indexContent={indexContent}
                                                        dataMessages={dataMessages}
                                                        setDataMessages={setDataMessages}
                                                        onChangeValueMessageContent={onChangeValueMessageContent}
                                                        renderRootFaqOption={renderRootFaqOption}
                                                        dataInputVar={dataInputVar}
                                                        setIsOpenAddVariable={setIsOpenAddVariable}
                                                      />
                                                      <div className="ss-text-input-setting">
                                                      <div className="ss-user-setting__item-bottom">
                                                        <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                          <SelectCustom
                                                            id="title"
                                                            value={textInput.title_require}
                                                            data={dropDownTitle}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title_require')}
                                                            keyValue="key"
                                                          />
                                                          <SelectCustom
                                                            id="type"
                                                            allowClear={false}
                                                            value={textInput.type}
                                                            data={textInputTypeOptions}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type')}
                                                            keyValue="key"
                                                          />
                                                        </div>
                                                      </div>
                                                      {/* text_input: withTitle = true */}
                                                      {textInput?.title_require === true &&
                                                        <div className="ss-user-setting__item-bottom">
                                                          <InputCustom
                                                            placeholder="タイトル"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title')}
                                                            value={textInput.title}
                                                          />
                                                        </div>
                                                      }
                                                      {/* text_input: type = text  ADD_FUKU*/}
                                                      {textInput.type === 'text' && (
                                                        <React.Fragment>
                                                          <div className="ss-user-setting-option-row">
                                                            <CheckboxCustom
                                                              label="文字を自動変換する"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'isUseConvertText')}
                                                              value={textInput.isUseConvertText}
                                                            />
                                                            {textInput.isUseConvertText && (
                                                              <div className="ss-user-setting-option-row__controls">
                                                                <SelectCustom
                                                                  id="convertTextTypeSelect"
                                                                  allowClear={false}
                                                                  value={textInput.convertTextTypeValue}
                                                                  data={convertTextType}
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'convertTextTypeValue')}
                                                                  keyValue="key"
                                                                  placeholder="Select Convert Text Type"
                                                                />
                                                                {textInput.text.isSplitInput ? (
                                                                  <>
                                                                    <InputCustom
                                                                      placeholder="セル1受信点ID"
                                                                      styleLabel={{ width: '100%' }}
                                                                      maxLength={250}
                                                                      useFukushashiki={true}
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'convertTextDestination1', value)}
                                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['convertTextDestination1']}
                                                                    />
                                                                    <InputCustom
                                                                      placeholder="セル2受信点ID"
                                                                      styleLabel={{ width: '100%' }}
                                                                      maxLength={250}
                                                                      useFukushashiki={true}
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'convertTextDestination2', value)}
                                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['convertTextDestination2']}
                                                                    />
                                                                  </>
                                                                ) : (
                                                                  <InputCustom
                                                                    placeholder="受信反射ポイントIDを入力してください"
                                                                    styleLabel={{ width: '100%' }}
                                                                    maxLength={250}
                                                                    useFukushashiki={true}
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'convertTextDestination', value)}
                                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['convertTextDestination']}
                                                                  />
                                                                )}
                                                              </div>
                                                            )}
                                                          </div>
                                                          <div className="ss-user-setting-option-row">
                                                            <CheckboxCustom
                                                              label="IDのカスタマイズ"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'isCustomID')}
                                                              value={textInput.isCustomID}
                                                            />
                                                            {textInput.isCustomID && (
                                                              <div className="ss-user-setting-option-row__controls">
                                                                {textInput.text.isSplitInput ? (
                                                                  <>
                                                                    <InputCustom
                                                                      placeholder="セル 1 のオプション ID"
                                                                      styleLabel={{ width: '100%' }}
                                                                      maxLength={250}
                                                                      useFukushashiki={true}
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'customId1', value)}
                                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['customId1']}
                                                                    />
                                                                    <InputCustom
                                                                      placeholder="セル 2 のオプション ID"
                                                                      styleLabel={{ width: '100%' }}
                                                                      maxLength={250}
                                                                      useFukushashiki={true}
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'customId2', value)}
                                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['customId2']}
                                                                    />
                                                                  </>
                                                                ) : (
                                                                  <InputCustom
                                                                    placeholder="オプションIDを入力してください"
                                                                    styleLabel={{ width: '100%' }}
                                                                    maxLength={250}
                                                                    useFukushashiki={true}
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'customId', value)}
                                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['customId']}
                                                                  />
                                                                )}
                                                              </div>
                                                            )}
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <SelectCustom
                                                              id="range"
                                                              value={textInput?.text?.range || 'no_input'}
                                                              data={rangeText}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'range')}
                                                              keyValue="key"
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom-flex-start">
                                                            <span className="ss-user-setting-label">字数制限</span>
                                                            <InputNum
                                                              placeholder="0000"
                                                              className="ss-user-setting-input-limit-character"
                                                              max={textInput[textInput.type]?.character_limit_to}
                                                              min={0}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'character_limit_from')}
                                                              value={textInput[textInput.type]?.character_limit_from}
                                                            />
                                                            <span style={{ fontSize: '30px', marginLeft: '10px', opacity: '0.4' }}>~</span>
                                                            <InputNum
                                                              placeholder="0000"
                                                              className="ss-user-setting-input-limit-character"
                                                              min={textInput[textInput.type]?.character_limit_from || 0}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'character_limit_to')}
                                                              value={textInput[textInput.type]?.character_limit_to}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <InputDouble
                                                              rightWidth={'50%'}
                                                              icon={textInput[textInput.type]?.isSplitInput ? "minus-circle" : "plus-circle"}
                                                              valueLeft={textInput[textInput.type]?.placeholderLeft}
                                                              valueRight={textInput[textInput.type]?.placeholderRight}
                                                              onChange={(value, name) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, name === 'left' ? 'placeholderLeft' : 'placeholderRight')}
                                                              onClickIcon={() => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, !textInput[textInput.type]?.isSplitInput, textInput.type, 'isSplitInput')}
                                                              placeholder={['プレースホルダ', 'プレースホルダ']}
                                                            />
                                                          </div>
                                                          {isUseFukushashiki && textInput.text.isSplitInput && (
                                                            <>
                                                              <div className="ss-text-input-setting__fukushashiki-row ss-user-setting__item-bottom">
                                                                <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                  <div className="ss-text-input-setting__fukushashiki-row__mode">
                                                                    <SelectCustom
                                                                      id="left-fukushashiki-mode"
                                                                      style={{ width: '100%' }}
                                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['left_fukushashiki_search_mode']}
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'left_fukushashiki_search_mode', value)}
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
                                                                <div className="ss-text-input-setting__fukushashiki-row__value">
                                                                  <InputCustom
                                                                    styleLabel={{ width: '100%' }}
                                                                    maxLength={250}
                                                                    useFukushashiki={true}
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'left_fukushashiki_search_value', value)}
                                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['left_fukushashiki_search_value']}
                                                                    placeholder={{
                                                                      1: '複写先要素のIDを入力ください',
                                                                      2: '複写先要素のcss_selectorを入力ください',
                                                                      3: '複写先要素のxPathを入力ください',
                                                                    }[
                                                                      dataMessages[indexMessageSelect]?.message_content[indexContent]?.['left_fukushashiki_search_mode']
                                                                    ] || ''}
                                                                  />
                                                                </div>
                                                              </div>
                                                              <div className="ss-text-input-setting__fukushashiki-row ss-user-setting__item-bottom">
                                                                <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                  <div className="ss-text-input-setting__fukushashiki-row__mode">
                                                                    <SelectCustom
                                                                      id="right-fukushashiki-mode"
                                                                      style={{ width: '100%' }}
                                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['right_fukushashiki_search_mode']}
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'right_fukushashiki_search_mode', value)}
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
                                                                <div className="ss-text-input-setting__fukushashiki-row__value">
                                                                  <InputCustom
                                                                    styleLabel={{ width: '100%' }}
                                                                    maxLength={250}
                                                                    useFukushashiki={true}
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'right_fukushashiki_search_value', value)}
                                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['right_fukushashiki_search_value']}
                                                                    placeholder={{
                                                                      1: '複写先要素のIDを入力ください',
                                                                      2: '複写先要素のcss_selectorを入力ください',
                                                                      3: '複写先要素のxPathを入力ください',
                                                                    }[
                                                                      dataMessages[indexMessageSelect]?.message_content[indexContent]?.['right_fukushashiki_search_mode']
                                                                    ] || ''}
                                                                  />
                                                                </div>
                                                              </div>
                                                            </>
                                                          )}
                                                          {isUseFukushashiki && !textInput.text.isSplitInput && (
                                                            <div className="ss-text-input-setting__fukushashiki-row ss-user-setting__item-bottom">
                                                              <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                <div className="ss-text-input-setting__fukushashiki-row__mode">
                                                                  <SelectCustom
                                                                    id="fukushashiki-mode"
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
                                                              <div className="ss-text-input-setting__fukushashiki-row__value">
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
                                                        </React.Fragment>
                                                      )}
                                                      {/* text_input: type = urls */}
                                                      {textInput.type === 'urls' &&
                                                        <>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <InputCustom
                                                              placeholder="プレースホルダ"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'placeholder')}
                                                              value={textInput[textInput.type]?.placeholder}
                                                            />
                                                          </div>
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
                                                        </>
                                                      }
                                                      {/* text_input: type = email_address */}
                                                      {textInput.type === 'email_address' &&
                                                        <>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <InputCustom
                                                              placeholder="プレースホルダ"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'placeholder')}
                                                              value={textInput[textInput.type].placeholder}
                                                            />
                                                          </div>
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
                                                        </>
                                                      }
                                                      {/* text_input: type = email_confirmation */}
                                                      {textInput.type === 'email_confirmation' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <InputCustom
                                                              placeholder="プレースホルダ"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'cfEmlAdd_email')}
                                                              value={textInput[textInput.type]?.cfEmlAdd_email || ''}
                                                            />
                                                          </div>
                                                          {isUseFukushashiki && (
                                                            <div className='ss-user-setting__item-bottom' style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                              <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                <div style={{ flexBasis: '22%', maxWidth: '22%' }}>
                                                                  <SelectCustom
                                                                    id="title"
                                                                    style={{ width: '100%' }}
                                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['value_fukushashiki_search_mode']}
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'value_fukushashiki_search_mode', value)}
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
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'value_fukushashiki_search_value', value)}
                                                                  value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['value_fukushashiki_search_value']}
                                                                  placeholder={{
                                                                    1: '複写先要素のIDを入力ください',
                                                                    2: '複写先要素のcss_selectorを入力ください',
                                                                    3: '複写先要素のxPathを入力ください',
                                                                  }[
                                                                    dataMessages[indexMessageSelect]?.message_content[indexContent]?.['value_fukushashiki_search_mode']
                                                                  ] || ''}
                                                                />
                                                              </div>
                                                            </div>
                                                          )}
                                                          <div className="ss-user-setting__item-bottom">
                                                            <InputCustom
                                                              placeholder="プレースホルダ"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'cfEmlAdd_confirm_email')}
                                                              value={textInput[textInput.type]?.cfEmlAdd_confirm_email || ''}
                                                            />
                                                          </div>
                                                          {isUseFukushashiki && (
                                                            <div className='ss-user-setting__item-bottom' style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                              <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                <div style={{ flexBasis: '22%', maxWidth: '22%' }}>
                                                                  <SelectCustom
                                                                    id="title"
                                                                    style={{ width: '100%' }}
                                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueConfirm_fukushashiki_search_mode']}
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'valueConfirm_fukushashiki_search_mode', value)}
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
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'valueConfirm_fukushashiki_search_value', value)}
                                                                  value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueConfirm_fukushashiki_search_value']}
                                                                  placeholder={{
                                                                    1: '複写先要素のIDを入力ください',
                                                                    2: '複写先要素のcss_selectorを入力ください',
                                                                    3: '複写先要素のxPathを入力ください',
                                                                  }[
                                                                    dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueConfirm_fukushashiki_search_mode']
                                                                  ] || ''}
                                                                />
                                                              </div>
                                                            </div>
                                                          )}
                                                        </React.Fragment>
                                                      }
                                                      {/* text_input: type = phone_number */}
                                                      {textInput.type === 'phone_number' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <SelectCustom
                                                              id="range"
                                                              value={textInput.phone_number?.withHyphen || false}
                                                              data={hyphenPhoneNumber}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'withHyphen')}
                                                              keyValue="key"
                                                            />
                                                          </div>
                                                          {textInput?.phone_number?.withHyphen === true && isUseFukushashiki && (
                                                            <div className="ss-user-setting__item-bottom">
                                                              <CheckboxCustom
                                                                label="先頭の0は削除しない（「0000」などもそのままLPへ反映）"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'disable_remove_leading_zero')}
                                                                value={textInput.phone_number?.disable_remove_leading_zero || false}
                                                              />
                                                            </div>
                                                          )}
                                                          {/* phone_number: isWithHyphens = true */}
                                                          {textInput?.phone_number?.withHyphen === true &&
                                                            <React.Fragment>
                                                              <div className="ss-user-setting__item-bottom">
                                                                <div className="ss-user-setting__item-select-bottom-wrapper ss-user-setting-phone-number-hyphens">
                                                                  <InputCustom
                                                                    placeholder="プレースホルダ"
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'number1')}
                                                                    value={textInput[textInput.type]?.number1}
                                                                  />
                                                                  <span style={{ fontSize: '20px' }}>-</span>
                                                                  <InputCustom
                                                                    placeholder="プレースホルダ"
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'number2')}
                                                                    value={textInput[textInput.type]?.number2}
                                                                  />
                                                                  <span style={{ fontSize: '20px' }}>-</span>
                                                                  <InputCustom
                                                                    placeholder="プレースホルダ"
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'number3')}
                                                                    value={textInput[textInput.type]?.number3}
                                                                  />

                                                                </div>
                                                                {isUseFukushashiki && (
                                                                  <>
                                                                    <div className='ss-user-setting__item-bottom' style={{ width: '100%', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                      <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                        <div style={{ flexBasis: '22%', maxWidth: '22%' }}>
                                                                          <SelectCustom
                                                                            id="title"
                                                                            style={{ width: '100%' }}
                                                                            value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['value1_fukushashiki_search_mode']}
                                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'value1_fukushashiki_search_mode', value)}
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
                                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'value1_fukushashiki_search_value', value)}
                                                                          value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['value1_fukushashiki_search_value']}
                                                                          placeholder={{
                                                                            1: '複写先要素のIDを入力ください',
                                                                            2: '複写先要素のcss_selectorを入力ください',
                                                                            3: '複写先要素のxPathを入力ください',
                                                                          }[
                                                                            dataMessages[indexMessageSelect]?.message_content[indexContent]?.['value1_fukushashiki_search_mode']
                                                                          ] || ''}
                                                                        />
                                                                      </div>
                                                                    </div>
                                                                    <div className='ss-user-setting__item-bottom' style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                      <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                        <div style={{ flexBasis: '22%', maxWidth: '22%' }}>
                                                                          <SelectCustom
                                                                            id="title"
                                                                            style={{ width: '100%' }}
                                                                            value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['value2_fukushashiki_search_mode']}
                                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'value2_fukushashiki_search_mode', value)}
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
                                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'value2_fukushashiki_search_value', value)}
                                                                          value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['value2_fukushashiki_search_value']}
                                                                          placeholder={{
                                                                            1: '複写先要素のIDを入力ください',
                                                                            2: '複写先要素のcss_selectorを入力ください',
                                                                            3: '複写先要素のxPathを入力ください',
                                                                          }[
                                                                            dataMessages[indexMessageSelect]?.message_content[indexContent]?.['value2_fukushashiki_search_mode']
                                                                          ] || ''}
                                                                        />
                                                                      </div>
                                                                    </div>
                                                                    <div className='ss-user-setting__item-bottom' style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                      <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                        <div style={{ flexBasis: '22%', maxWidth: '22%' }}>
                                                                          <SelectCustom
                                                                            id="title"
                                                                            style={{ width: '100%' }}
                                                                            value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['value3_fukushashiki_search_mode']}
                                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'value3_fukushashiki_search_mode', value)}
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
                                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'value3_fukushashiki_search_value', value)}
                                                                          value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['value3_fukushashiki_search_value']}
                                                                          placeholder={{
                                                                            1: '複写先要素のIDを入力ください',
                                                                            2: '複写先要素のcss_selectorを入力ください',
                                                                            3: '複写先要素のxPathを入力ください',
                                                                          }[
                                                                            dataMessages[indexMessageSelect]?.message_content[indexContent]?.['value3_fukushashiki_search_mode']
                                                                          ] || ''}
                                                                        />
                                                                      </div>
                                                                    </div>
                                                                  </>
                                                                )}
                                                              </div>
                                                            </React.Fragment>
                                                          }
                                                          {/* phone_number: isWithHyphens = false */}
                                                          {textInput?.phone_number?.withHyphen === false &&
                                                            <React.Fragment>
                                                              <div className="ss-user-setting__item-bottom">
                                                                <InputCustom
                                                                  placeholder="プレースホルダ"
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'number')}
                                                                  value={textInput[textInput.type]?.number}
                                                                />
                                                              </div>
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
                                                            </React.Fragment>
                                                          }
                                                        </React.Fragment>
                                                      }
                                                      {/* text_input: type = password || password_confirmation */}
                                                      {(textInput.type === 'password' || textInput.type === 'password_confirmation') && (
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom-flex-start">
                                                            <span className="ss-user-setting-label">字数制限</span>
                                                            <InputNum
                                                              placeholder="0000"
                                                              className="ss-user-setting-input-limit-character"
                                                              max={textInput[textInput.type]?.character_limit_to}
                                                              min={0}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'character_limit_from')}
                                                              value={textInput[textInput.type]?.character_limit_from}
                                                            />
                                                            <span style={{ fontSize: '30px', marginLeft: '10px', opacity: '0.4' }}>~</span>
                                                            <InputNum
                                                              placeholder="0000"
                                                              className="ss-user-setting-input-limit-character"
                                                              min={textInput[textInput.type]?.character_limit_from || 0}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'character_limit_to')}
                                                              value={textInput[textInput.type]?.character_limit_to}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting-item-use-character">
                                                            <CheckboxCustom
                                                              label="特殊文字を許可する"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'allow_special_chars')}
                                                              value={textInput[textInput.type]?.allow_special_chars}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper ss-input-text-comment">
                                                              <InputCustom
                                                                style={{ width: '100%' }}
                                                                placeholder="プレースホルダ"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'password')}
                                                                value={textInput[textInput.type]?.password}
                                                              />
                                                            </div>
                                                          </div>
                                                          {isUseFukushashiki && (
                                                              renderFukushashikiSetting({
                                                                mode: dataMessages[indexMessageSelect]?.message_content[indexContent]?.['fukushashiki_search_mode'],
                                                                inputValue: dataMessages[indexMessageSelect]?.message_content[indexContent]?.['fukushashiki_search_value'],
                                                                onModeChange: value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'fukushashiki_search_mode', value),
                                                                onInputChange: value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'fukushashiki_search_value', value),
                                                                rowClassName: 'ss-user-setting__item-bottom',
                                                                rowStyle: { width: '100%', alignItems: 'center', gap: '8px', marginLeft: 0, marginBottom: '10px' },
                                                              })
                                                            )
                                                          }
                                                          {/* text_input: type = password_confirmation */}
                                                          {(textInput.type === 'password_confirmation') && (
                                                            <div className="ss-user-setting__item-bottom">
                                                              <div className="ss-user-setting__item-select-bottom-wrapper ss-input-text-comment">
                                                                <InputCustom
                                                                  style={{ width: '100%' }}
                                                                  placeholder="プレースホルダ"
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, textInput.type, 'confirm_password')}
                                                                  value={textInput[textInput.type]?.confirm_password}
                                                                />
                                                              </div>
                                                            </div>
                                                          )}
                                                          {isUseFukushashiki && textInput.type === 'password_confirmation' && (
                                                            renderFukushashikiSetting({
                                                              mode: dataMessages[indexMessageSelect]?.message_content[indexContent]?.['confirm_fukushashiki_search_mode'],
                                                              inputValue: dataMessages[indexMessageSelect]?.message_content[indexContent]?.['confirm_fukushashiki_search_value'],
                                                              onModeChange: value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'confirm_fukushashiki_search_mode', value),
                                                              onInputChange: value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'confirm_fukushashiki_search_value', value),
                                                              rowStyle: { width: '100%', alignItems: 'center', gap: '8px', marginLeft: 0 },
                                                            })
                                                          )}
                                                        </React.Fragment>
                                                      )}
                                                      </div>
                                                    </>
  );
};

export default TextInputSetting;
