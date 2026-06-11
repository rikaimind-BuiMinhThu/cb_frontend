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

const RadioButtonSetting = ({
  indexMessageSelect,
  indexContent,
  content,
  radioButton,
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
                                                          value={radioButton.is_save_input_content}
                                                        />
                                                        {radioButton.is_save_input_content &&
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                style={{ width: '100%', marginRight: '10px' }}
                                                                id="title"
                                                                value={radioButton?.save_input_content}
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
                                                          label={LABELS.GENDER_OPTIONS.CHECKBOX_USE_AS_GENDER}
                                                          onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'use_as_gender')}
                                                          value={!!radioButton.use_as_gender}
                                                        />
                                                        <CheckboxCustom
                                                          label="必須"
                                                          onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'require')}
                                                          value={radioButton.require}
                                                        />
                                                      </div>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                          <SelectCustom
                                                            id="title"
                                                            style={{ width: '49%' }}
                                                            value={radioButton?.title_require}
                                                            data={dropDownTitle}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title_require')}
                                                          />
                                                          <SelectCustom
                                                            id="type"
                                                            allowClear={false}
                                                            style={{ width: '49%' }}
                                                            value={radioButton?.type}
                                                            data={typeRadio}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type')}
                                                          />
                                                        </div>
                                                      </div>
                                                      {/* radioButton: withTitle = true */}
                                                      {radioButton.title_require === true &&
                                                        <div className="ss-user-setting__item-bottom">
                                                          <InputCustom
                                                            placeholder="タイトル"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title')}
                                                            value={radioButton?.title}
                                                          />
                                                        </div>
                                                      }
                                                      {/* radioButton: type = consume_api_response */}
                                                      {(radioButton.type === 'consume_api_response') && (
                                                        <div className="ss-user-setting__item-bottom">
                                                          <SelectCustom
                                                            id="range"
                                                            value={radioButton.consume_api_response}
                                                            data={dataConsumeApiResponse}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'consume_api_response')}
                                                            keyValue="key"
                                                          />
                                                        </div>
                                                      )}
                                                      {isUseFukushashiki && (
                                                        <React.Fragment>
                                                              <div className="ss-user-setting__item-bottom">
                                                                <div style={{ width: '5%' }}>

                                                                </div>
                                                                <div style={{ width: '90%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                  <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                    <div style={{ flexBasis: '30%', maxWidth: '30%' }}>
                                                                      <SelectCustom
                                                                        id="title"
                                                                        style={{ width: '100%' }}
                                                                        value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['initial_selection_fukushashiki_search_mode']}
                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'initial_selection_fukushashiki_search_mode', value)}
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
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'initial_selection_fukushashiki_search_value', value)}
                                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['initial_selection_fukushashiki_search_value']}
                                                                      placeholder={{
                                                                        1: '複写先要素のIDを入力ください',
                                                                        2: '複写先要素のcss_selectorを入力ください',
                                                                        3: '複写先要素のxPathを入力ください',
                                                                      }[
                                                                        dataMessages[indexMessageSelect]?.message_content[indexContent]?.['initial_selection_fukushashiki_search_mode']
                                                                      ] || ''}
                                                                    />
                                                                  </div>
                                                                </div>
                                                                <div style={{ width: '5%' }}>
                                                                </div>
                                                              </div>
                                                              {!!radioButton.use_as_gender && <div style={{ width: '100%', padding: "0 5% 10px" }}>
                                                                <SelectCustom 
                                                                  data={[{ key: LABELS.GENDER_OPTIONS.VERTICAL, value: 'vertical' }, { key: LABELS.GENDER_OPTIONS.HORIZONTAL, value: 'horizontal' }]}
                                                                  value={radioButton?.gender_display_type}
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'gender_display_type')}
                                                                  keyValue="value"
                                                                  nameValue="key"
                                                                  label={LABELS.GENDER_OPTIONS.LABEL_GENDER_DISPLAY_TYPE}
                                                                  style={{ width: '100%' }}
                                                                />
                                                              </div>}
                                                        </React.Fragment>
                                                            )}
                                                      {/* radioButton: type != consume_api_response */}
                                                      {radioButton.type !== 'consume_api_response' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <DragDropContext onDragEnd={result => handleDragEndRadioCheckbox(result, content.id, content.type, radioButton.type)}>
                                                              <Droppable droppableId='radio-items'>
                                                                {(providedChild) => {

                                                                  return <div className="ss-user-setting-item-radio-button-drag" {...providedChild.droppableProps} ref={providedChild.innerRef} style={{ width: '90%' }}>
                                                                    {
                                                                      Array.isArray(radioButton?.[radioButton.type]) && radioButton?.[radioButton.type]
                                                                        .map((itemRadio, indexRadio, array) => {
                                                                          return (
                                                                            <Draggable draggable={true} key={itemRadio.id} draggableId={itemRadio.id + ''} index={indexRadio}>
                                                                              {(providedChild) => (
                                                                                <div {...providedChild.draggableProps} {...providedChild.dragHandleProps} ref={providedChild.innerRef}>
                                                                                  <div style={{ marginBottom: '10px', width: '100%', backgroundColor: '#F8F9FA', padding: '5px' }}>
                                                                                    {radioButton.type === 'radio_button_img' &&
                                                                                      <React.Fragment>
                                                                                        <div className="ss-user-setting__item-bottom">
                                                                                          <MDBIcon fas icon="grip-horizontal" style={{ marginRight: '10px' }} />
                                                                                          <InputCustom
                                                                                            style={{ width: '86%' }}
                                                                                            placeholder="ファイルのURL"
                                                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, radioButton.type, indexRadio, 'img')}
                                                                                            value={itemRadio.img}
                                                                                          />
                                                                                          <MDBIcon onClick={() => {
                                                                                            setIsOpenFileReference(true);
                                                                                            setVarFileReference({ indexContent, contentType: content.type, subContentType: radioButton.type, indexSubContent: indexRadio, img: 'img' });
                                                                                            setAcceptFile(['image']);
                                                                                          }}
                                                                                            fas icon="paperclip"
                                                                                            style={{ marginLeft: '10px', backgroundColor: '#fff', borderRadius: '50%', padding: '6px' }}
                                                                                          />
                                                                                        </div>
                                                                                        <InputDouble
                                                                                          classCustom="ss-user-radio-custom-class"
                                                                                          onChange={(value, name) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, radioButton.type, indexRadio, name === 'left' ? 'text' : 'value')}
                                                                                          onClickIcon={() => handleRemoveItemContent(indexMessageSelect, indexContent, content.type, radioButton.type, indexRadio)}
                                                                                          icon={array.length >= 2 ? "times-circle" : ""}
                                                                                          placeholder={['タイトル', '値']}
                                                                                          classIcon="ss-plus-circle-option-icon-times"
                                                                                          valueLeft={itemRadio.text}
                                                                                          valueRight={itemRadio.value}
                                                                                        />
                                                                                        <CheckboxCustom
                                                                                          label="初期選択設定"
                                                                                          onChange={() => {
                                                                                            if (radioButton.initial_selection !== itemRadio.value) {
                                                                                              onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, itemRadio.value, 'initial_selection');
                                                                                            } else {
                                                                                              onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, "", 'initial_selection');
                                                                                            }
                                                                                          }}
                                                                                          value={radioButton.initial_selection === itemRadio.value}
                                                                                          isOnChange={false}
                                                                                        />
                                                                                      </React.Fragment>
                                                                                    }
                                                                                    {(radioButton.type === 'default') &&
                                                                                      <React.Fragment>
                                                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                          <MDBIcon fas icon="grip-horizontal" style={{ marginRight: '10px' }} />
                                                                                          <InputDouble
                                                                                            classCustom="ss-user-radio-custom-class"
                                                                                            icon={array.length >= 2 ? "times-circle" : ""}
                                                                                            onChange={(value, name) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, radioButton.type, indexRadio, name === 'left' ? 'text' : 'value')}
                                                                                            valueLeft={itemRadio.text}
                                                                                            valueRight={itemRadio.value}
                                                                                            placeholder={['タイトル', '値']}
                                                                                            classIcon="ss-plus-circle-option-icon-times"
                                                                                            onClickIcon={() => handleRemoveItemContent(indexMessageSelect, indexContent, content.type, radioButton.type, indexRadio)}
                                                                                          />
                                                                                        </div>
                                                                                        <CheckboxCustom
                                                                                          label="初期選択設定"
                                                                                          onChange={() => {
                                                                                            if (radioButton.initial_selection !== itemRadio.value) {
                                                                                              onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, itemRadio.value, 'initial_selection');
                                                                                            } else {
                                                                                              onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, "", 'initial_selection');
                                                                                            }
                                                                                          }}
                                                                                          value={radioButton.initial_selection === itemRadio.value}
                                                                                          isOnChange={false}
                                                                                        />
                                                                                        {
                                                                                          radioButton.use_as_gender && (
                                                                                            <OptionGenderConfig
                                                                                              value={itemRadio.preset_config}
                                                                                              onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, radioButton.type, indexRadio, 'preset_config')}
                                                                                            />
                                                                                          )
                                                                                        }
                                                                                      </React.Fragment>
                                                                                    }
                                                                                    {(radioButton.type === 'block_style') &&
                                                                                      <React.Fragment>
                                                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                          <MDBIcon fas icon="grip-horizontal" style={{ marginRight: '10px' }} />
                                                                                          <InputDouble
                                                                                            classCustom="ss-user-radio-custom-class"
                                                                                            icon={array.length >= 2 ? "times-circle" : ""}
                                                                                            onChange={(value, name) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, radioButton.type, indexRadio, name === 'left' ? 'text' : 'value')}
                                                                                            valueLeft={itemRadio.text}
                                                                                            valueRight={itemRadio.value}
                                                                                            placeholder={['タイトル', '値']}
                                                                                            classIcon="ss-plus-circle-option-icon-times"
                                                                                            onClickIcon={() => handleRemoveItemContent(indexMessageSelect, indexContent, content.type, radioButton.type, indexRadio)}
                                                                                          />
                                                                                        </div>
                                                                                        <CheckboxCustom
                                                                                          label="初期選択設定"
                                                                                          onChange={() => {
                                                                                            if (radioButton.initial_selection !== itemRadio.value) {
                                                                                              onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, itemRadio.value, 'initial_selection');
                                                                                            } else {
                                                                                              onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, "", 'initial_selection');
                                                                                            }
                                                                                          }}
                                                                                          value={radioButton.initial_selection === itemRadio.value}
                                                                                          isOnChange={false}
                                                                                        />
                                                                                      </React.Fragment>
                                                                                    }
                                                                                  </div>
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
                                                              onClick={() => handleAddItemRadioCheckbox(indexMessageSelect, indexContent, content.type, radioButton.type)}
                                                            />
                                                          </div>
                                                        </React.Fragment>
                                                      }
                                                    </React.Fragment>
  );
};

export default RadioButtonSetting;
