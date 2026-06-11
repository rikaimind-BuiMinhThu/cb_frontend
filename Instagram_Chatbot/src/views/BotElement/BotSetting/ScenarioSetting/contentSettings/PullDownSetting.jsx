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

const PullDownSetting = ({
  indexMessageSelect,
  indexContent,
  content,
  pullDown,
  dataMessages,
  setDataMessages,
  onChangeValueMessageContent,
  renderRootFaqOption,
  dataInputVar,
  setIsOpenAddVariable,
  isUseFukushashiki,
  handleDragEndPullDown,
  handleRemoveItemCustomizePullDown,
  handleAddItemCustomizePullDown,
  onChangeTimePullDown,
  dataHour,
  dataMinutes,
  dataEveryMinute,
  dataYear,
  dataMonth,
  dataDay,
  dataPrefectures,
  dataCity,
  renderLPIntegrationOptionSetting,
  renderDetailSettingPulldownFromJs,
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
                                                          value={pullDown.is_save_input_content}
                                                        />
                                                        {pullDown.is_save_input_content &&
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                style={{ width: '100%', marginRight: '10px' }}
                                                                id="title"
                                                                value={pullDown?.save_input_content}
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
                                                          value={pullDown.require}
                                                        />
                                                      </div>
                                                      <div className="ss-user-setting__item-bottom">
                                                        <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                          <SelectCustom
                                                            id="title"
                                                            style={{ width: '49%' }}
                                                            value={pullDown?.title_require}
                                                            data={dropDownTitle}
                                                            placeholder="タイトル"
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title_require')}
                                                          />
                                                          <SelectCustom
                                                            id="type"
                                                            allowClear={false}
                                                            style={{ width: '49%' }}
                                                            value={pullDown?.type}
                                                            placeholder="type"
                                                            data={dataTypePullDown}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type')}
                                                          />
                                                        </div>
                                                      </div>
                                                      {/* pull_down: withTitle = true */}
                                                      {pullDown.title_require === true &&
                                                        <div className="ss-user-setting__item-bottom">
                                                          <InputCustom
                                                            placeholder="タイトル"
                                                            value={pullDown.title}
                                                            onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'title')}
                                                          />
                                                        </div>
                                                      }
                                                      {/* pull_down: type = customization */}
                                                      {pullDown.type === 'customization' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <InputCustom
                                                              icon={pullDown[pullDown.type]?.is_comment ? "times-circle" : "plus-circle"}
                                                              onClickIcon={() => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, !pullDown[pullDown.type]?.is_comment, pullDown.type, 'is_comment')}
                                                              style={{ width: '84%', marginBottom: '10px' }}
                                                              placeholder="コメント"
                                                              classIcon="ss-user-times-icon-custom"
                                                              value={pullDown[pullDown.type]?.title_comment || ''}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'title_comment')}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div style={{ backgroundColor: '#F8F9FA', width: '90%', padding: '5px' }} >
                                                              <InputCustom
                                                                label="デフォルトオプション"
                                                                style={{ width: '60%', marginBottom: '10px', marginLeft: '10px' }}
                                                                placeholder="コメント"
                                                                value={pullDown[pullDown.type]?.display_unselected}
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'display_unselected')}
                                                              />
                                                              <DragDropContext onDragEnd={result => handleDragEndPullDown(result, content.id, content.type, pullDown.type, pullDown[pullDown.type]?.is_comment ? 'options_with_comment' : 'options_without_comment')}>
                                                                <Droppable droppableId='customize-pull-down'>
                                                                  {(providedChild) => {
                                                                    let isComment = pullDown[pullDown.type]?.is_comment;
                                                                    let arrOptions = isComment ? pullDown[pullDown.type]?.options_with_comment : pullDown[pullDown.type]?.options_without_comment;
                                                                    return <div className="ss-user-setting-item-pull-down-drag" {...providedChild.droppableProps} ref={providedChild.innerRef}>
                                                                      {
                                                                        Array.isArray(arrOptions) && arrOptions
                                                                          .map((itemPullDown, indexPullDown, array) => {
                                                                            return (
                                                                              <Draggable draggable={true} key={itemPullDown.id} draggableId={itemPullDown.id + ''} index={indexPullDown}>
                                                                                {(providedChild) => (
                                                                                  <div
                                                                                    {...providedChild.draggableProps}
                                                                                    {...providedChild.dragHandleProps}
                                                                                    ref={providedChild.innerRef}
                                                                                  >
                                                                                    <div style={{ width: '100%', backgroundColor: '#F8F9FA', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                                      <MDBIcon fas icon="grip-horizontal" />
                                                                                      <InputDouble
                                                                                        style={array.length === 1 && !pullDown[pullDown.type]?.is_comment ? { width: '95%' } : {}}
                                                                                        classCustom={isComment ? "ss-user-setting-custom-double-input-custom" : ""}
                                                                                        onChange={(value, name) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, isComment ? 'options_with_comment' : 'options_without_comment', indexPullDown, name === 'left' ? 'text' : 'value')}
                                                                                        valueLeft={itemPullDown.text}
                                                                                        valueRight={itemPullDown.value}
                                                                                        placeholder={['テキスト', '値']}
                                                                                      />
                                                                                      {pullDown[pullDown.type]?.is_comment === true &&
                                                                                        <React.Fragment>
                                                                                          <span>~</span>
                                                                                          <InputDouble
                                                                                            classCustom="ss-user-setting-custom-double-input-custom"
                                                                                            onChange={(value, name) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, isComment ? 'options_with_comment' : 'options_without_comment', indexPullDown, name === 'left' ? 'text2' : 'value2')}
                                                                                            valueLeft={itemPullDown.text2}
                                                                                            valueRight={itemPullDown.value2}
                                                                                            placeholder={['テキスト', '値']}
                                                                                          />
                                                                                        </React.Fragment>
                                                                                      }
                                                                                      {array.length >= 2 &&
                                                                                        <MDBIcon
                                                                                          fas
                                                                                          style={{ fontSize: '25px' }}
                                                                                          icon="times-circle"
                                                                                          onClick={(e) => handleRemoveItemCustomizePullDown(indexMessageSelect, indexContent, content.type, pullDown.type, isComment ? 'options_with_comment' : 'options_without_comment', indexPullDown)}
                                                                                        />
                                                                                      }
                                                                                    </div>
                                                                                    <CheckboxCustom
                                                                                      label="初期選択設定"
                                                                                      onChange={() => {
                                                                                        if (pullDown.initial_selection !== itemPullDown.value) {
                                                                                          onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, itemPullDown.value, 'initial_selection');
                                                                                        } else { 
                                                                                          onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, "", 'initial_selection'); }
                                                                                      }}
                                                                                      value={pullDown.initial_selection ? pullDown.initial_selection === itemPullDown.value : false}
                                                                                    />
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
                                                              <div className="ss-user-setting__item-bottom" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                <MDBIcon
                                                                  fas
                                                                  icon="plus-circle"
                                                                  className="ss-plus-circle-option-icon"
                                                                  onClick={() => handleAddItemCustomizePullDown(indexMessageSelect, indexContent, content.type, pullDown.type, pullDown[pullDown.type]?.is_comment ? 'options_with_comment' : 'options_without_comment')}
                                                                />
                                                              </div>
                                                            </div>
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <InputCustom
                                                              style={{ width: '90%', marginBottom: '10px' }}
                                                              placeholder="コメント"
                                                              value={pullDown[pullDown.type]?.comment}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'comment')}
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
                                                      {/* pull_down: type = time_hm */}
                                                      {pullDown.type === 'time_hm' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom-flex-start">
                                                            <span className="ss-user-setting-label" style={{ marginRight: '10px' }}>範囲設定</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              value={pullDown?.[pullDown.type]?.start_at}
                                                              placeholder="開始時"
                                                              data={dataHourFixed.filter(item => parseInt(item.value) <= parseInt(pullDown[pullDown.type].end_at || "23"))}
                                                              onChange={value => onChangeTimePullDown(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'start_at', 'dataHour')}
                                                            />
                                                            <span style={{ fontSize: '30px', marginLeft: '10px', marginRight: '10px', opacity: '0.4' }}>~</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              placeholder="終了時"
                                                              value={pullDown?.[pullDown.type]?.end_at}
                                                              data={dataHourFixed.filter(item => parseInt(item.value) > parseInt(pullDown[pullDown.type].start_at || "0"))}
                                                              onChange={value => onChangeTimePullDown(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'end_at', 'dataHour')}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                style={{ width: '24%' }}
                                                                value={pullDown?.[pullDown.type]?.time}
                                                                data={dataHour}
                                                                placeholder="時"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'time')}
                                                              />
                                                              <SelectCustom
                                                                style={{ width: '24%' }}
                                                                value={pullDown?.[pullDown.type]?.minute}
                                                                data={dataMinutes}
                                                                placeholder="分"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'minute')}
                                                              />
                                                              <SelectCustom
                                                                style={{ width: '24%' }}
                                                                value={pullDown?.[pullDown.type]?.every_minute}
                                                                data={dataEveryMinute}
                                                                placeholder="分刻み"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'every_minute')}
                                                              />
                                                              <InputCustom
                                                                style={{ width: '24%' }}
                                                                placeholder="コメント"
                                                                value={pullDown[pullDown.type]?.comment}
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'comment')}
                                                              />
                                                            </div>
                                                          </div>
                                                          {isUseFukushashiki && (
                                                            <>
                                                              <div className='ss-user-setting__item-bottom' style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                  <div style={{ flexBasis: '22%', maxWidth: '22%' }}>
                                                                    <SelectCustom
                                                                      id="title"
                                                                      style={{ width: '100%' }}
                                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueHour_fukushashiki_search_mode']}
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'valueHour_fukushashiki_search_mode', value)}
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
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'valueHour_fukushashiki_search_value', value)}
                                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueHour_fukushashiki_search_value']}
                                                                    placeholder={{
                                                                      1: '複写先要素のIDを入力ください',
                                                                      2: '複写先要素のcss_selectorを入力ください',
                                                                      3: '複写先要素のxPathを入力ください',
                                                                    }[
                                                                      dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueHour_fukushashiki_search_mode']
                                                                    ] || ''}
                                                                  />
                                                                </div>
                                                              </div>
                                                              <div className='ss-user-setting__item-bottom' style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <div style={{ flexBasis: '22%', maxWidth: '22%' }}>
                                                                  <SelectCustom
                                                                    id="title"
                                                                    style={{ width: '100%' }}
                                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueMinute_fukushashiki_search_mode']}
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'valueMinute_fukushashiki_search_mode', value)}
                                                                    data={[
                                                                      { key: 1, value: 'id' },
                                                                      { key: 2, value: 'css_selector' },
                                                                      { key: 3, value: 'xpath' }
                                                                    ]}
                                                                    keyValue="key"
                                                                    placeholder="複写先要素の取得方法をお選びください"
                                                                  />
                                                                </div>
                                                                <div style={{ flexBasis: '67%', maxWidth: '67%' }}>
                                                                  <InputCustom
                                                                    styleLabel={{ width: '100%' }}
                                                                    maxLength={250}
                                                                    useFukushashiki={true}
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'valueMinute_fukushashiki_search_value', value)}
                                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueMinute_fukushashiki_search_value']}
                                                                    placeholder={{
                                                                      1: '複写先要素のIDを入力ください',
                                                                      2: '複写先要素のcss_selectorを入力ください',
                                                                      3: '複写先要素のxPathを入力ください',
                                                                    }[
                                                                      dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueMinute_fukushashiki_search_mode']
                                                                    ] || ''}
                                                                  />
                                                                </div>
                                                              </div>
                                                            </>
                                                          )}
                                                        </React.Fragment>
                                                      }
                                                      {/* pull_down: type = date_ymd */}
                                                      {pullDown.type === 'date_ymd' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom-flex-start">
                                                            <span className="ss-user-setting-label" style={{ marginRight: '10px' }}>範囲設定</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              value={pullDown?.[pullDown.type]?.start_year}
                                                              placeholder="開始年"
                                                              data={dataYearFixed.filter(item => parseInt(item.value) < parseInt(pullDown[pullDown.type].end_year || "2072"))}
                                                              onChange={value => onChangeTimePullDown(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'start_year', 'dataYear')}
                                                            />
                                                            <span style={{ fontSize: '30px', marginLeft: '10px', marginRight: '10px', opacity: '0.4' }}>~</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              placeholder="終了年"
                                                              value={pullDown?.[pullDown.type]?.end_year}
                                                              data={dataYearFixed.filter(item => parseInt(item.value) > parseInt(pullDown[pullDown.type].start_year || "1935"))}
                                                              onChange={value => onChangeTimePullDown(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'end_year', 'dataYear')}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                style={{ width: '24%' }}
                                                                value={pullDown?.[pullDown.type]?.year}
                                                                data={dataYear}
                                                                placeholder="年"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'year')}
                                                              />
                                                              <SelectCustom
                                                                style={{ width: '24%' }}
                                                                value={pullDown?.[pullDown.type]?.month}
                                                                data={dataMonth}
                                                                placeholder="月"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'month')}
                                                              />
                                                              <SelectCustom
                                                                style={{ width: '24%' }}
                                                                value={pullDown?.[pullDown.type]?.day}
                                                                data={dataDay}
                                                                placeholder="日"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'day')}
                                                              />
                                                              <InputCustom
                                                                style={{ width: '24%' }}
                                                                placeholder="コメント"
                                                                value={pullDown[pullDown.type]?.comment}
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'comment')}
                                                              />
                                                            </div>
                                                          </div>
                                                          {isUseFukushashiki && (
                                                            <>
                                                              <div className='ss-user-setting__item-bottom' style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <Tooltip title="複写先要素の取得方法をお選びください" placement="top">

                                                                  <div style={{ flexBasis: '22%', maxWidth: '22%' }}>
                                                                    <SelectCustom
                                                                      id="title"
                                                                      style={{ width: '100%' }}
                                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueYear_fukushashiki_search_mode']}
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'valueYear_fukushashiki_search_mode', value)}
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
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'valueYear_fukushashiki_search_value', value)}
                                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueYear_fukushashiki_search_value']}
                                                                    placeholder={{
                                                                      1: '複写先要素のIDを入力ください',
                                                                      2: '複写先要素のcss_selectorを入力ください',
                                                                      3: '複写先要素のxPathを入力ください',
                                                                    }[
                                                                      dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueYear_fukushashiki_search_mode']
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
                                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueMonth_fukushashiki_search_mode']}
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'valueMonth_fukushashiki_search_mode', value)}
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
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'valueMonth_fukushashiki_search_value', value)}
                                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueMonth_fukushashiki_search_value']}
                                                                    placeholder={{
                                                                      1: '複写先要素のIDを入力ください',
                                                                      2: '複写先要素のcss_selectorを入力ください',
                                                                      3: '複写先要素のxPathを入力ください',
                                                                    }[
                                                                      dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueMonth_fukushashiki_search_mode']
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
                                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueDay_fukushashiki_search_mode']}
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'valueDay_fukushashiki_search_mode', value)}
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
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'valueDay_fukushashiki_search_value', value)}
                                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueDay_fukushashiki_search_value']}
                                                                    placeholder={{
                                                                      1: '複写先要素のIDを入力ください',
                                                                      2: '複写先要素のcss_selectorを入力ください',
                                                                      3: '複写先要素のxPathを入力ください',
                                                                    }[
                                                                      dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueDay_fukushashiki_search_mode']
                                                                    ] || ''}
                                                                  />
                                                                </div>
                                                              </div>
                                                            </>
                                                          )}
                                                        </React.Fragment>
                                                      }
                                                      {/* pull_down: type = date_md */}
                                                      {pullDown.type === 'date_md' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                style={{ width: '32%' }}
                                                                value={pullDown?.[pullDown.type]?.month}
                                                                data={dataMonthFixed}
                                                                placeholder="月"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'month')}
                                                              />
                                                              <SelectCustom
                                                                style={{ width: '32%' }}
                                                                value={pullDown?.[pullDown.type].day}
                                                                data={dataDayFixed}
                                                                placeholder="日"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'day')}
                                                              />
                                                              <InputCustom
                                                                style={{ width: '32%' }}
                                                                placeholder="コメント"
                                                                value={pullDown[pullDown.type]?.comment}
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'comment')}
                                                              />
                                                            </div>
                                                          </div>
                                                          {isUseFukushashiki && (
                                                            <>
                                                              <div className='ss-user-setting__item-bottom' style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                  <div style={{ flexBasis: '22%', maxWidth: '22%' }}>
                                                                    <SelectCustom
                                                                      id="title"
                                                                      style={{ width: '100%' }}
                                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueMonth_fukushashiki_search_mode']}
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'valueMonth_fukushashiki_search_mode', value)}
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
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'valueMonth_fukushashiki_search_value', value)}
                                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueMonth_fukushashiki_search_value']}
                                                                    placeholder={{
                                                                      1: '複写先要素のIDを入力ください',
                                                                      2: '複写先要素のcss_selectorを入力ください',
                                                                      3: '複写先要素のxPathを入力ください',
                                                                    }[
                                                                      dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueMonth_fukushashiki_search_mode']
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
                                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueDay_fukushashiki_search_mode']}
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'valueDay_fukushashiki_search_mode', value)}
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
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'valueDay_fukushashiki_search_value', value)}
                                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueDay_fukushashiki_search_value']}
                                                                    placeholder={{
                                                                      1: '複写先要素のIDを入力ください',
                                                                      2: '複写先要素のcss_selectorを入力ください',
                                                                      3: '複写先要素のxPathを入力ください',
                                                                    }[
                                                                      dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueDay_fukushashiki_search_mode']
                                                                    ] || ''}
                                                                  />
                                                                </div>
                                                              </div>
                                                            </>
                                                          )}
                                                        </React.Fragment>
                                                      }
                                                      {/* pull_down: type = date_ym */}
                                                      {pullDown.type === 'date_ym' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom-flex-start">
                                                            <span className="ss-user-setting-label" style={{ marginRight: '10px' }}>範囲設定</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              value={pullDown?.[pullDown.type]?.start_year}
                                                              placeholder="開始年"
                                                              data={dataYearFixed.filter(item => parseInt(item.value) < parseInt(pullDown[pullDown.type].end_year || "2072"))}
                                                              onChange={value => onChangeTimePullDown(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'start_year', 'dataYear')}
                                                            />
                                                            <span style={{ fontSize: '30px', marginLeft: '10px', marginRight: '10px', opacity: '0.4' }}>~</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              placeholder="終了年"
                                                              value={pullDown?.[pullDown.type]?.end_year}
                                                              data={dataYearFixed.filter(item => parseInt(item.value) > parseInt(pullDown[pullDown.type].start_year || "1935"))}
                                                              onChange={value => onChangeTimePullDown(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'end_year', 'dataYear')}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                style={{ width: '32%' }}
                                                                value={pullDown?.[pullDown.type]?.year}
                                                                data={dataYear}
                                                                placeholder="年"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'year')}
                                                              />
                                                              <SelectCustom
                                                                style={{ width: '32%' }}
                                                                value={pullDown?.[pullDown.type]?.month}
                                                                data={dataMonth}
                                                                placeholder="月"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'month')}
                                                              />
                                                              <InputCustom
                                                                style={{ width: '32%' }}
                                                                placeholder="コメント"
                                                                value={pullDown[pullDown.type].comment}
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'comment')}
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
                                                                        value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueYear_fukushashiki_search_mode']}
                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'valueYear_fukushashiki_search_mode', value)}
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
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'valueYear_fukushashiki_search_value', value)}
                                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueYear_fukushashiki_search_value']}
                                                                      placeholder={{
                                                                        1: '複写先要素のIDを入力ください',
                                                                        2: '複写先要素のcss_selectorを入力ください',
                                                                        3: '複写先要素のxPathを入力ください',
                                                                      }[
                                                                        dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueYear_fukushashiki_search_mode']
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
                                                                        value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueMonth_fukushashiki_search_mode']}
                                                                        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'valueMonth_fukushashiki_search_mode', value)}
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
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'valueMonth_fukushashiki_search_value', value)}
                                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueMonth_fukushashiki_search_value']}
                                                                      placeholder={{
                                                                        1: '複写先要素のIDを入力ください',
                                                                        2: '複写先要素のcss_selectorを入力ください',
                                                                        3: '複写先要素のxPathを入力ください',
                                                                      }[
                                                                        dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueMonth_fukushashiki_search_mode']
                                                                      ] || ''}
                                                                    />
                                                                  </div>
                                                                </div>
                                                              </>
                                                            )}
                                                          </div>
                                                        </React.Fragment>
                                                      }
                                                      {/* pull_down: type = date_ymd_hm */}
                                                      {pullDown.type === 'date_ymd_hm' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                style={{ width: '32%' }}
                                                                value={pullDown?.[pullDown.type]?.year}
                                                                data={[{ key: '2022', value: '2022' }, { key: '2023', value: '2023' }]}
                                                                placeholder="年"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'year')}
                                                              />
                                                              <SelectCustom
                                                                style={{ width: '32%' }}
                                                                value={pullDown?.[pullDown.type]?.month}
                                                                data={dataMonthFixed}
                                                                placeholder="月"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'month')}
                                                              />
                                                              <SelectCustom
                                                                style={{ width: '32%' }}
                                                                value={pullDown?.[pullDown.type]?.day}
                                                                data={dataDayFixed}
                                                                placeholder="日"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'day')}
                                                              />
                                                            </div>
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom-flex-start">
                                                            <span className="ss-user-setting-label" style={{ marginRight: '10px' }}>範囲設定</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              value={pullDown?.[pullDown.type]?.start_at}
                                                              placeholder="開始時"
                                                              data={dataHourFixed.filter(item => parseInt(item.value) <= parseInt(pullDown[pullDown.type].end_at || "23"))}
                                                              onChange={value => onChangeTimePullDown(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'start_at', 'dataHour')}

                                                            />
                                                            <span style={{ fontSize: '30px', marginLeft: '10px', marginRight: '10px', opacity: '0.4' }}>~</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              placeholder="終了時"
                                                              value={pullDown?.[pullDown.type]?.end_at}
                                                              data={dataHourFixed.filter(item => parseInt(item.value) > parseInt(pullDown[pullDown.type].start_at || "0"))}
                                                              onChange={value => onChangeTimePullDown(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'end_at', 'dataHour')}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex">
                                                              <SelectCustom
                                                                style={{ width: '24%' }}
                                                                value={pullDown?.[pullDown.type]?.time}
                                                                data={dataHour}
                                                                placeholder="時"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'time')}
                                                              />
                                                              <SelectCustom
                                                                style={{ width: '24%' }}
                                                                value={pullDown?.[pullDown.type]?.minute}
                                                                data={dataMinutes}
                                                                placeholder="分"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'minute')}
                                                              />
                                                              <SelectCustom
                                                                style={{ width: '24%' }}
                                                                value={pullDown?.[pullDown.type]?.every_minute}
                                                                data={dataEveryMinute}
                                                                placeholder="分刻み"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'every_minute')}
                                                              />
                                                              <InputCustom
                                                                style={{ width: '24%' }}
                                                                placeholder="コメント"
                                                                value={pullDown[pullDown.type]?.comment}
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'comment')}
                                                              />
                                                            </div>
                                                          </div>
                                                        </React.Fragment>
                                                      }
                                                      {/* pull_down: type = dob_ymd */}
                                                      {pullDown.type === 'dob_ymd' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom-flex-start">
                                                            <span className="ss-user-setting-label" style={{ marginRight: '10px' }}>範囲設定</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              value={pullDown?.[pullDown.type]?.start_year}
                                                              placeholder="開始年"
                                                              data={dataYearFixed.filter(item => parseInt(item.value) < parseInt(pullDown[pullDown.type].end_year || "2072"))}
                                                              onChange={value => onChangeTimePullDown(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'start_year', 'dataYear')}
                                                            />
                                                            <span style={{ fontSize: '30px', marginLeft: '10px', marginRight: '10px', opacity: '0.4' }}>~</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              placeholder="終了年"
                                                              value={pullDown?.[pullDown.type]?.end_year}
                                                              data={dataYearFixed.filter(item => parseInt(item.value) > parseInt(pullDown[pullDown.type].start_year || "1935"))}
                                                              onChange={value => onChangeTimePullDown(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'end_year', 'dataYear')}
                                                            />
                                                            <SelectCustom
                                                              style={{ width: '29%', marginLeft: '10%' }}
                                                              placeholder="ソート"
                                                              value={pullDown?.[pullDown.type]?.sort}
                                                              data={[
                                                                { key: 'asc', value: '昇順' },
                                                                { key: 'desc', value: '降順' }
                                                              ]}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'sort')}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom" style={{ justifyContent: 'flex-start', padding: '0px 31px' }}>
                                                            <span style={{ marginBottom: '-10px', color: 'grey' }}>※初期選択の生年月日</span>
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom" style={{ justifyContent: 'flex-start', padding: '0px 31px', alignItems: 'center' }}>
                                                            <div className='ss-user-setting-checkbox-custom_css' style={{ display: 'flex', alignItems: 'center' }}>
                                                              <input
                                                                type="checkbox"
                                                                className="ss-user-setting-checkbox-custom"
                                                                onChange={(e) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, e.target.checked, pullDown.type, 'is_hide_day')}
                                                                checked={pullDown?.[pullDown.type]?.is_hide_day || false}
                                                              />
                                                              <label style={{ whiteSpace: "nowrap", wordBreak: "normal", color: 'grey' }}>日を非表示にする</label>
                                                            </div>
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex" style={{ flexWrap: 'wrap' }}>
                                                              <SelectCustom
                                                                style={{ width: '32%' }}
                                                                value={pullDown?.[pullDown.type]?.year}
                                                                data={dataYearFixed}
                                                                placeholder="年"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'year')}
                                                              />
                                                              <SelectCustom
                                                                style={{ width: '32%' }}
                                                                value={pullDown?.[pullDown.type]?.month}
                                                                data={dataMonthFixed}
                                                                placeholder="月"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'month')}
                                                              />
                                                              <SelectCustom
                                                                style={{ width: '32%' }}
                                                                value={pullDown?.[pullDown.type]?.day}
                                                                data={dataDayFixed}
                                                                placeholder="日"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'day')}
                                                              />
                                                              <InputCustom
                                                                style={{ width: '32%', marginTop: '10px' }}
                                                                placeholder="コメント"
                                                                value={pullDown[pullDown.type]?.comment}
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'comment')}
                                                              />
                                                            </div>
                                                          </div>
                                                          {isUseFukushashiki && (
                                                            <>
                                                              <div className='ss-user-setting__item-bottom' style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                  <div style={{ flexBasis: '22%', maxWidth: '22%' }}>
                                                                    <SelectCustom
                                                                      id="title"
                                                                      style={{ width: '100%' }}
                                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueYear_fukushashiki_search_mode']}
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'valueYear_fukushashiki_search_mode', value)}
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
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'valueYear_fukushashiki_search_value', value)}
                                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueYear_fukushashiki_search_value']}
                                                                    placeholder={{
                                                                      1: '複写先要素のIDを入力ください',
                                                                      2: '複写先要素のcss_selectorを入力ください',
                                                                      3: '複写先要素のxPathを入力ください',
                                                                    }[
                                                                      dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueYear_fukushashiki_search_mode']
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
                                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueMonth_fukushashiki_search_mode']}
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'valueMonth_fukushashiki_search_mode', value)}
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
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'valueMonth_fukushashiki_search_value', value)}
                                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueMonth_fukushashiki_search_value']}
                                                                    placeholder={{
                                                                      1: '複写先要素のIDを入力ください',
                                                                      2: '複写先要素のcss_selectorを入力ください',
                                                                      3: '複写先要素のxPathを入力ください',
                                                                    }[
                                                                      dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueMonth_fukushashiki_search_mode']
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
                                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueDay_fukushashiki_search_mode']}
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'valueDay_fukushashiki_search_mode', value)}
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
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'valueDay_fukushashiki_search_value', value)}
                                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueDay_fukushashiki_search_value']}
                                                                    placeholder={{
                                                                      1: '複写先要素のIDを入力ください',
                                                                      2: '複写先要素のcss_selectorを入力ください',
                                                                      3: '複写先要素のxPathを入力ください',
                                                                    }[
                                                                      dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueDay_fukushashiki_search_mode']
                                                                    ] || ''}
                                                                  />
                                                                </div>
                                                              </div>
                                                            </>
                                                          )}
                                                        </React.Fragment>
                                                      }
                                                      {/* pull_down: type = dob_ym */}
                                                      {pullDown.type === 'dob_ym' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom-flex-start">
                                                            <span className="ss-user-setting-label" style={{ marginRight: '10px' }}>範囲設定</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              value={pullDown?.[pullDown.type]?.start_year}
                                                              placeholder="開始年"
                                                              data={dataYearFixed.filter(item => parseInt(item.value) < parseInt(pullDown[pullDown.type].end_year || "2072"))}
                                                              onChange={value => onChangeTimePullDown(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'start_year', 'dataYear')}
                                                            />
                                                            <span style={{ fontSize: '30px', marginLeft: '10px', marginRight: '10px', opacity: '0.4' }}>~</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              placeholder="終了年"
                                                              value={pullDown?.[pullDown.type]?.end_year}
                                                              data={dataYearFixed.filter(item => parseInt(item.value) > parseInt(pullDown[pullDown.type].start_year || "1935"))}
                                                              onChange={value => onChangeTimePullDown(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'end_year', 'dataYear')}
                                                            />
                                                            <SelectCustom
                                                              style={{ width: '29%', marginLeft: '10%' }}
                                                              placeholder="ソート"
                                                              value={pullDown?.[pullDown.type]?.sort}
                                                              data={[
                                                                { key: 'asc', value: '昇順' },
                                                                { key: 'desc', value: '降順' }
                                                              ]}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'sort')}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom" style={{ justifyContent: 'flex-start', padding: '0px 31px' }}>
                                                            <span style={{ marginBottom: '-10px', color: 'grey' }}>※初期選択の生年月日</span>
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex" style={{ flexWrap: 'wrap' }}>
                                                              <SelectCustom
                                                                style={{ width: '32%' }}
                                                                value={pullDown?.[pullDown.type]?.year}
                                                                data={dataYear}
                                                                placeholder="年"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'year')}
                                                              />
                                                              <SelectCustom
                                                                style={{ width: '32%' }}
                                                                value={pullDown?.[pullDown.type]?.month}
                                                                data={dataMonth}
                                                                placeholder="月"
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'month')}
                                                              />
                                                              <InputCustom
                                                                style={{ width: '32%' }}
                                                                placeholder="コメント"
                                                                value={pullDown[pullDown.type]?.comment}
                                                                onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'comment')}
                                                              />
                                                            </div>
                                                          </div>
                                                          {isUseFukushashiki && (
                                                            <>
                                                              <div className='ss-user-setting__item-bottom' style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
                                                                  <div style={{ flexBasis: '22%', maxWidth: '22%' }}>
                                                                    <SelectCustom
                                                                      id="title"
                                                                      style={{ width: '100%' }}
                                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueYear_fukushashiki_search_mode']}
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'valueYear_fukushashiki_search_mode', value)}
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
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'valueYear_fukushashiki_search_value', value)}
                                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueYear_fukushashiki_search_value']}
                                                                    placeholder={{
                                                                      1: '複写先要素のIDを入力ください',
                                                                      2: '複写先要素のcss_selectorを入力ください',
                                                                      3: '複写先要素のxPathを入力ください',
                                                                    }[
                                                                      dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueYear_fukushashiki_search_mode']
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
                                                                      value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueMonth_fukushashiki_search_mode']}
                                                                      onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'valueMonth_fukushashiki_search_mode', value)}
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
                                                                    onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, 'valueMonth_fukushashiki_search_value', value)}
                                                                    value={dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueMonth_fukushashiki_search_value']}
                                                                    placeholder={{
                                                                      1: '複写先要素のIDを入力ください',
                                                                      2: '複写先要素のcss_selectorを入力ください',
                                                                      3: '複写先要素のxPathを入力ください',
                                                                    }[
                                                                      dataMessages[indexMessageSelect]?.message_content[indexContent]?.['valueMonth_fukushashiki_search_mode']
                                                                    ] || ''}
                                                                  />
                                                                </div>
                                                              </div>
                                                            </>
                                                          )}
                                                        </React.Fragment>
                                                      }
                                                      {/* pull_down: type = timezone_from_to */}
                                                      {pullDown.type === 'timezone_from_to' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom-flex-start">
                                                            <span className="ss-user-setting-label" style={{ marginRight: '10px' }}>範囲設定</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              value={pullDown?.[pullDown.type]?.start_at}
                                                              placeholder="開始時"
                                                              data={dataHourFixed.filter(item => parseInt(item.value) <= parseInt(pullDown[pullDown.type].end_at || "23"))}
                                                              onChange={value => onChangeTimePullDown(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'start_at', 'dataHour')}
                                                            />
                                                            <span style={{ fontSize: '30px', marginLeft: '10px', marginRight: '10px', opacity: '0.4' }}>~</span>
                                                            <SelectCustom
                                                              style={{ width: '18%' }}
                                                              placeholder="終了時"
                                                              value={pullDown?.[pullDown.type]?.end_at}
                                                              data={dataHourFixed.filter(item => parseInt(item.value) > parseInt(pullDown[pullDown.type].start_at || "0"))}
                                                              onChange={value => onChangeTimePullDown(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'end_at', 'dataHour')}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom" style={{ flexWrap: 'nowrap' }}>
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex" style={{ alignItems: 'center' }}>
                                                              <div className="ss-user-setting__item-select-bottom-wrapper-flex" style={{ flexWrap: 'wrap', width: '46%' }}>
                                                                <SelectCustom
                                                                  style={{ width: '48%' }}
                                                                  value={pullDown?.[pullDown.type]?.hour_start_at}
                                                                  data={dataHour}
                                                                  placeholder="時"
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'hour_start_at')}
                                                                />
                                                                <SelectCustom
                                                                  style={{ width: '48%' }}
                                                                  value={pullDown?.[pullDown.type]?.minute_start_at}
                                                                  data={dataMinutes}
                                                                  placeholder="分"
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'minute_start_at')}
                                                                />
                                                                <SelectCustom
                                                                  style={{ width: '48%', marginTop: '10px' }}
                                                                  value={pullDown?.[pullDown.type]?.every_minute_start_at}
                                                                  data={dataEveryMinute}
                                                                  placeholder="分刻み"
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'every_minute_start_at')}
                                                                />
                                                              </div>
                                                              <span>~</span>
                                                              <div className="ss-user-setting__item-select-bottom-wrapper-flex" style={{ flexWrap: 'wrap', width: '46%' }}>
                                                                <SelectCustom
                                                                  style={{ width: '48%' }}
                                                                  value={pullDown?.[pullDown.type]?.hour_end_at}
                                                                  data={dataHour}
                                                                  placeholder="時"
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'hour_end_at')}
                                                                />
                                                                <SelectCustom
                                                                  style={{ width: '48%' }}
                                                                  value={pullDown?.[pullDown.type]?.minute_end_at}
                                                                  data={dataMinutes}
                                                                  placeholder="分"
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'minute_end_at')}
                                                                />
                                                                <SelectCustom
                                                                  style={{ width: '48%', marginTop: '10px' }}
                                                                  value={pullDown?.[pullDown.type]?.every_minute_end_at}
                                                                  data={dataEveryMinute}
                                                                  placeholder="分刻み"
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'every_minute_end_at')}
                                                                />
                                                              </div>
                                                            </div>
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <InputCustom
                                                              style={{ width: '90%' }}
                                                              placeholder="コメント"
                                                              value={pullDown[pullDown.type]?.comment}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'comment')}
                                                            />
                                                          </div>
                                                        </React.Fragment>
                                                      }
                                                      {/* pull_down: type = period_from_to */}
                                                      {pullDown.type === 'period_from_to' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom" style={{ flexWrap: 'nowrap' }}>
                                                            <div className="ss-user-setting__item-select-bottom-wrapper-flex" style={{ alignItems: 'center' }}>
                                                              <div className="ss-user-setting__item-select-bottom-wrapper-flex" style={{ flexWrap: 'wrap', width: '46%' }}>
                                                                <SelectCustom
                                                                  style={{ width: '48%' }}
                                                                  value={pullDown?.[pullDown.type]?.year_start_at}
                                                                  data={dataYear}
                                                                  placeholder="年"
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'year_start_at')}
                                                                />
                                                                <SelectCustom
                                                                  style={{ width: '48%' }}
                                                                  value={pullDown?.[pullDown.type]?.month_start_at}
                                                                  data={dataMonth}
                                                                  placeholder="月"
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'month_start_at')}
                                                                />
                                                                <SelectCustom
                                                                  style={{ width: '48%', marginTop: '10px' }}
                                                                  value={pullDown?.[pullDown.type]?.day_start_at}
                                                                  data={dataDay}
                                                                  placeholder="日"
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'day_start_at')}
                                                                />
                                                              </div>
                                                              <span>~</span>
                                                              <div className="ss-user-setting__item-select-bottom-wrapper-flex" style={{ flexWrap: 'wrap', width: '46%' }}>
                                                                <SelectCustom
                                                                  style={{ width: '48%' }}
                                                                  value={pullDown?.[pullDown.type]?.year_end_at}
                                                                  data={dataYear}
                                                                  placeholder="年"
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'year_end_at')}
                                                                />
                                                                <SelectCustom
                                                                  style={{ width: '48%' }}
                                                                  value={pullDown?.[pullDown.type]?.month_end_at}
                                                                  data={dataMonth}
                                                                  placeholder="月"
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'month_end_at')}
                                                                />
                                                                <SelectCustom
                                                                  style={{ width: '48%', marginTop: '10px' }}
                                                                  value={pullDown?.[pullDown.type]?.day_end_at}
                                                                  data={dataDay}
                                                                  placeholder="日"
                                                                  onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'day_end_at')}
                                                                />
                                                              </div>
                                                            </div>
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <InputCustom
                                                              style={{ width: '90%' }}
                                                              placeholder="コメント"
                                                              value={pullDown[pullDown.type]?.comment}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'comment')}
                                                            />
                                                          </div>
                                                        </React.Fragment>
                                                      }
                                                      {/* pull_down: type = prefectures */}
                                                      {pullDown.type === 'prefectures' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom">
                                                            {dataPrefectures &&
                                                              dataPrefectures.map((item, index) => {
                                                                return (
                                                                  <InputDouble
                                                                    classCustom={"ss-user-setting-double-input-custom"}
                                                                    disabled
                                                                    // onChange={(value, name) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, isComment ? 'options_with_comment' : 'options_without_comment', indexPullDown, name === 'left' ? 'text' : 'value')}
                                                                    valueLeft={item.name}
                                                                    valueRight={index < 9 ? `0${index + 1}` : `${index + 1}`}
                                                                    rightWidth={{ width: '50%' }}
                                                                  // placeholder={['テキスト', 'value']}
                                                                  />
                                                                )
                                                              })
                                                            }
                                                          </div>
                                                        </React.Fragment>
                                                      }
                                                      {/* pull_down: type = up_to_municipality */}
                                                      {pullDown.type === 'up_to_municipality' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <InputCustom
                                                              style={{ width: '90%' }}
                                                              placeholder="コメント"
                                                              value={pullDown[pullDown.type]?.prefecture_comment}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'prefecture_comment')}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <SelectCustom
                                                              style={{ width: '42%' }}
                                                              value={pullDown?.[pullDown.type]?.prefecture_test}
                                                              placeholder="都道府県を選択"
                                                              data={dataPrefectures}
                                                              keyValue="name"
                                                              nameValue="name"
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'prefecture_test')}
                                                            />
                                                            <span style={{ fontSize: '30px', marginLeft: '10px', marginRight: '10px', opacity: '0.4' }}>~</span>
                                                            <SelectCustom
                                                              style={{ width: '42%' }}
                                                              placeholder="市区町村を選択"
                                                              value={pullDown?.[pullDown.type]?.city_test}
                                                              data={[]}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'city_test')}
                                                            />
                                                          </div>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <InputCustom
                                                              style={{ width: '90%' }}
                                                              placeholder="コメント"
                                                              value={pullDown[pullDown.type]?.city_comment}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type, 'city_comment')}
                                                            />
                                                          </div>
                                                        </React.Fragment>
                                                      }
                                                      {/* pull_down: type = comsume_api_response */}
                                                      {pullDown.type === 'comsume_api_response' &&
                                                        <React.Fragment>
                                                          <div className="ss-user-setting__item-bottom">
                                                            <SelectCustom
                                                              style={{ width: '90%' }}
                                                              value={pullDown?.[pullDown.type]}
                                                              placeholder="Select api"
                                                              data={dataConsumeApiResponse}
                                                              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, pullDown.type)}
                                                            />
                                                          </div>
                                                        </React.Fragment>
                                                      }
                                                      {/* pull_down: type = lp_integration_option */}
                                                      {renderLPIntegrationOptionSetting({ indexMessageSelect, indexContent, content, pullDown })}

                                                      {/* pull_down: type = from_js_result */}
                                                      {renderDetailSettingPulldownFromJs({
                                                        indexContent: indexContent,
                                                        content: content,
                                                        indexMessageSelect: indexMessageSelect,
                                                        pullDown: pullDown
                                                      })}

                                                    </React.Fragment>
  );
};

export default PullDownSetting;
