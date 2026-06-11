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

const CheckboxSetting = ({
  indexMessageSelect,
  indexContent,
  content,
  checkbox,
  numberMaxLength,
  dataMessages,
  setDataMessages,
  onChangeValueMessageContent,
  renderRootFaqOption,
  dataInputVar,
  setIsOpenAddVariable,
  isUseFukushashiki,
  handleDragEndRadioCheckbox,
  handleRemoveItemContent,
  handleAddItemRadioCheckbox,
  setIsOpenFileReference,
  setVarFileReference,
  setAcceptFile,
}) => {
  return (
                                                    <React.Fragment>
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
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'is_save_input_content')}
                                                          value={checkbox.is_save_input_content}
                                                        />
                                                        {checkbox.is_save_input_content &&
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                style={{ width: '100%', marginRight: '10px' }}
                                                                id="title"
                                                                value={checkbox?.save_input_content}
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
                                                          value={checkbox.require}
                                                        />
                                                      </div>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                          <SelectCustom
                                                            id="title"
                                                            style={{ width: '49%' }}
                                                            value={checkbox?.title_require}
                                                            data={dropDownTitle}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title_require')}
                                                          />
                                                          <SelectCustom
                                                            id="type"
                                                            allowClear={false}
                                                            style={{ width: '49%' }}
                                                            value={checkbox?.type}
                                                            data={typeCheckbox}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type')}
                                                          />
                                                        </div>
                                                      </div>
                                                      {/* checkbox: withTitle = true */}
                                                      {checkbox.title_require === true &&
                                                        <div className="ss-user-setting__item-bottom">
                                                          <InputCustom
                                                            placeholder="タイトル"
                                                            value={checkbox.title}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title')}
                                                          />
                                                        </div>
                                                      }
                                                      {(checkbox.type !== 'consume_api_response') && (
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-text_input-top">
                                                            <CheckboxCustom
                                                              label="全項目チェック"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'all_item_checked')}
                                                              value={checkbox.all_item_checked}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom-flex-start">
                                                            <span className="ss-user-setting-label">選択数制限</span>
                                                            <InputNum
                                                              placeholder="0000"
                                                              className="ss-user-setting-input-limit-character"
                                                              max={checkbox.selection_limit_to}
                                                              min={0}
                                                              disabled={!checkbox.require}
                                                              value={checkbox.selection_limit_from}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'selection_limit_from')}
                                                            />
                                                            <span style={{ fontSize: '30px', marginLeft: '10px', opacity: '0.4' }}>~</span>
                                                            <InputNum
                                                              placeholder="0000"
                                                              className="ss-user-setting-input-limit-character"
                                                              min={checkbox.selection_limit_from || 0}
                                                              max={numberMaxLength}
                                                              value={checkbox.selection_limit_to}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'selection_limit_to')}
                                                            />
                                                          </div>
                                                        </React.Fragment>
                                                      )}
                                                      {isUseFukushashiki && (
                                                        <div className="ss-user-setting__item-bottom">
                                                          <div style={{ width: '5%' }}>

                                                          </div>
                                                          <div style={{ width: '90%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                              <div style={{ flexBasis: '30%', maxWidth: '30%' }}>
                                                                <SelectCustom
                                                                  id="title"
                                                                  style={{ width: '100%' }}
                                                                  value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['checkedValue_fukushashiki_search_mode']}
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'checkedValue_fukushashiki_search_mode', value)}
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
                                                            <div style={{ flexBasis: '70%', maxWidth: '70%' }}>
                                                              <InputCustom
                                                                styleLabel={{ width: '100%' }}
                                                                maxLength={250}
                                                                useFukushashiki={true}
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'checkedValue_fukushashiki_search_value', value)}
                                                                value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['checkedValue_fukushashiki_search_value']}
                                                                placeholder={{
                                                                  1: '複写先要素のIDを入力ください',
                                                                  2: '複写先要素のcss_selectorを入力ください',
                                                                  3: '複写先要素のxPathを入力ください',
                                                                }[
                                                                  dataMessages[indexMessageSelect]?.message_content[indexContent]?.['checkedValue_fukushashiki_search_mode']
                                                                ] || ''}
                                                              />
                                                            </div>
                                                          </div>
                                                          <div style={{ width: '5%' }}>
                                                          </div>
                                                        </div>
                                                      )}
                                                      {/* checkbox: type = consume_api_response */}
                                                      {(checkbox.type === 'consume_api_response') && (
                                                        <div className="ss-user-setting__item-bottom">
                                                          <SelectCustom
                                                            id="range"
                                                            value={checkbox.consume_api_response}
                                                            data={dataConsumeApiResponse}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'checkbox', value, 'consume_api_response')}
                                                            keyValue="key"
                                                          />
                                                        </div>
                                                      )}
                                                      {/* checkbox: type != consume_api_response */}
                                                      {checkbox.type !== 'consume_api_response' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <DragDropContext onDragEnd={result => handleDragEndRadioCheckbox(result, content.id, content.type, checkbox.type)}>
                                                              <Droppable droppableId='checkbox-items'>
                                                                {(providedChild) => {
                                                                  // let arrMap;
                                                                  // if(radioButton.type === 'default') {
                                                                  //   arrMap
                                                                  // }
                                                                  return <div className="ss-user-setting-item-checkbox-button-drag" {...providedChild.droppableProps} ref={providedChild.innerRef}>
                                                                    {
                                                                      Array.isArray(checkbox?.[checkbox.type]) && checkbox?.[checkbox.type]
                                                                        .map((itemCheckbox, indexCheckbox, array) => {
                                                                          return (
                                                                            <Draggable draggable={true} key={itemCheckbox.id} draggableId={itemCheckbox.id + ''} index={indexCheckbox}>
                                                                              {(providedChild) => (
                                                                                <div {...providedChild.draggableProps} {...providedChild.dragHandleProps} ref={providedChild.innerRef} >
                                                                                  {(checkbox.type === 'default') &&
                                                                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', width: '100%', backgroundColor: '#F8F9FA', padding: '5px' }}>
                                                                                      <MDBIcon fas icon="grip-horizontal" style={{ marginRight: '10px' }} />
                                                                                      <InputDouble
                                                                                        classCustom="ss-user-radio-custom-class"
                                                                                        icon={array.length >= 2 ? "times-circle" : ""}
                                                                                        onChange={(value, name) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, checkbox.type, indexCheckbox, name === 'left' ? 'text' : 'value')}
                                                                                        valueLeft={checkbox[checkbox.type][indexCheckbox].text}
                                                                                        valueRight={checkbox[checkbox.type][indexCheckbox].value}
                                                                                        placeholder={['テキスト', '値']}
                                                                                        classIcon="ss-plus-circle-option-icon-times"
                                                                                        onClickIcon={() => handleRemoveItemContent(indexMessageSelect, indexContent, content.type, checkbox.type, indexCheckbox)}
                                                                                      />
                                                                                    </div>
                                                                                  }
                                                                                  {checkbox.type === 'checkbox_img' &&
                                                                                    <div style={{ display: 'flex', marginBottom: '10px', backgroundColor: 'rgb(248, 249, 250)', position: 'relative' }}>
                                                                                      <React.Fragment>
                                                                                        <MDBIcon fas icon="grip-horizontal" style={{ marginRight: '10px', display: 'flex', alignItems: 'center', marginRight: '5px', marginLeft: '10px' }} />
                                                                                        <div className="ss-user-setting-payment-radio-container ss-user-setting-payment-radio-container-img"
                                                                                        >
                                                                                          {itemCheckbox.contents.map((itemContentCheckbox, indexContentCheckbox, arrContent) => {
                                                                                            return <React.Fragment key={indexContentCheckbox}>
                                                                                              <div style={{ width: arrContent.length > 1 ? `${(100 / arrContent.length) - 1}%` : '100%', padding: '5px' }}>
                                                                                                <div className="ss-user-setting__item-bottom" style={{ flexWrap: 'nowrap' }}>
                                                                                                  <InputCustom
                                                                                                    style={{ width: '92%' }}
                                                                                                    placeholder="ファイルのURL"
                                                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'checkbox_img', indexCheckbox, 'contents', indexContentCheckbox, 'file_url')}
                                                                                                    value={itemContentCheckbox.file_url}
                                                                                                  />
                                                                                                  <MDBIcon onClick={() => {
                                                                                                    setIsOpenFileReference(true)
                                                                                                    setAcceptFile(['image']);
                                                                                                    setVarFileReference({ indexContent, contentType: content.type, subContentType: 'checkbox_img', indexSubContentType: indexCheckbox, childSubContentType: 'contents', indexChildSubContentType: indexContentCheckbox, img: 'file_url' })
                                                                                                  }}
                                                                                                    fas icon="paperclip"
                                                                                                    style={{ marginLeft: '10px', backgroundColor: '#fff', borderRadius: '50%', padding: '6px' }}
                                                                                                  />
                                                                                                </div>
                                                                                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                                                                  <InputDouble
                                                                                                    placeholder={["テキスト", "値"]}
                                                                                                    valueLeft={itemContentCheckbox.text}
                                                                                                    valueRight={itemContentCheckbox.value}
                                                                                                    onChange={(value, name) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'checkbox_img', indexCheckbox, 'contents', indexContentCheckbox, name === 'left' ? 'text' : 'value')}
                                                                                                  />
                                                                                                </div>
                                                                                              </div>
                                                                                            </React.Fragment>
                                                                                          })}
                                                                                        </div>
                                                                                        <div className="ss-user-setting-plus-minus-icon" style={{ display: 'flex', alignItems: 'center' }}>
                                                                                          <div>
                                                                                            {itemCheckbox.contents.length < 3 &&
                                                                                              <div style={{ color: '#327AED' }}
                                                                                                onClick={() => {
                                                                                                  let arrMess = [...dataMessages[indexMessageSelect].message_content[indexContent][content.type].checkbox_img[indexCheckbox].contents];
                                                                                                  let idMax;
                                                                                                  if (arrMess.length !== 0) {
                                                                                                    idMax = Math.max(...arrMess.map(item => item.id)) + 1;
                                                                                                  } else {
                                                                                                    idMax = 1;
                                                                                                  }
                                                                                                  dataMessages[indexMessageSelect].message_content[indexContent][content.type].checkbox_img[indexCheckbox].contents.push({
                                                                                                    id: idMax
                                                                                                  });
                                                                                                  setDataMessages([...dataMessages]);
                                                                                                }}
                                                                                              >+</div>
                                                                                            }
                                                                                            {itemCheckbox.contents.length > 1 &&
                                                                                              <div style={{ color: '#FA8464' }}
                                                                                                onClick={() => {
                                                                                                  dataMessages[indexMessageSelect].message_content[indexContent][content.type].checkbox_img[indexCheckbox].contents.pop();
                                                                                                  setDataMessages([...dataMessages]);
                                                                                                }}
                                                                                              >-</div>
                                                                                            }
                                                                                          </div>
                                                                                        </div>
                                                                                        {array.length > 1 &&
                                                                                          <div className="ss-user-setting-payment-radio-times-icons">
                                                                                            <MDBIcon fas icon="times-circle"
                                                                                              onClick={() => handleRemoveItemContent(indexMessageSelect, indexContent, content.type, checkbox.type, indexCheckbox)} />
                                                                                          </div>
                                                                                        }
                                                                                      </React.Fragment>
                                                                                    </div>
                                                                                  }
                                                                                </div>
                                                                              )}
                                                                            </Draggable>
                                                                          )
                                                                        })
                                                                    }
                                                                    {providedChild.placeholder}
                                                                  </div>
                                                                }}
                                                              </Droppable>
                                                            </DragDropContext>
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                            <MDBIcon
                                                              fas
                                                              icon="plus-circle"
                                                              className="ss-plus-circle-option-icon"
                                                              onClick={() => handleAddItemRadioCheckbox(indexMessageSelect, indexContent, content.type, checkbox.type)}
                                                            />
                                                          </div>
                                                        </React.Fragment>
                                                      }
                                                    </React.Fragment>
  );
};

export default CheckboxSetting;
