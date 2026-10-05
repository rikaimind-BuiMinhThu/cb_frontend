/* cSpell: disable */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SelectCustom from 'v2/components/BotMessages/SelectCustom';
import api from 'v2/api/api-management';
import {
  REQUIRED_LABEL,
  PLACEHOLDER_HOUR,
  PLACEHOLDER_MINUTE,
  PLACEHOLDER_YEAR,
  PLACEHOLDER_MONTH,
  PLACEHOLDER_DAY,
  PLACEHOLDER_SELECT,
  PLACEHOLDER_PREFECTURE,
  PLACEHOLDER_CITY,
  RANGE_SEPARATOR,
  YEAR_START_DEFAULT,
  CITIES_API_PATH,
  CITIES_QUERY_PARAM,
  API_SUCCESS_CODE,
  DATA_HOUR_FIXED,
  DATA_MINUTES,
  DATA_YEAR_FIXED,
  DATA_MONTH,
  DATA_DAY,
  PULL_DOWN_TYPE,
  HOUR_START_DEFAULT,
  HOUR_END_DEFAULT,
  YEAR_END_DEFAULT,
} from './constants';


const PullDownContent = ({
  content,
  indexContent,
  indexMessage,
  disabled,
  errors,
  onChangeValue,
  dataPrefectures,
}) => {
  const [dataCity, setDataCity] = useState([]);
  const pullDown = content.pull_down;
  if (!pullDown) {
    return null;
  }

  return (
                  <div className="chat-log-um-block" >
                    {(pullDown.title_require || pullDown.require) && (
                      <div
                        className="ss-message__content--user-pull_down-top chat-log-um-mb-0"
                    
                      >
                        {pullDown.title_require && (
                          <span className="ss-message__content--user-pull_down-title">
                            {pullDown.title}
                          </span>
                        )}
                        {pullDown.require === true && (
                          <span className="ss-message__content--user-text-input-required">
                            {REQUIRED_LABEL}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="ss-message__content--user-pull_down-wrapper">
                      {pullDown.type === PULL_DOWN_TYPE.CUSTOMIZATION && (
                        <>
                          <div className="ss-message__content--user-pull_down--customization">
                            <div
                              className="ss-message__content--user-pull_down-comment chat-log-um-mb-4"
                          
                            >
                              <span>{pullDown[pullDown.type].title_comment}</span>
                            </div>
                            <div className="">
                              {pullDown[pullDown.type].is_comment === false ? (
                                <div className="ss-message__content--user-pull_down-col col-12">
                                  <SelectCustom
                                    disabled={true}
                                    data={
                                      pullDown[pullDown.type]
                                        .options_without_comment
                                    }
                                    keyValue="value"
                                    className="chat-log-um-field-full" 
                                    placeholder={
                                      pullDown[pullDown.type].display_unselected
                                    }
                                    nameValue="text"
                                    onChange={(value) =>
                                      onChangeValue(
                                        indexContent,
                                        content.type,
                                        value,
                                        pullDown.type,
                                        "value"
                                      )
                                    }
                                    value={pullDown[pullDown.type].value}
                                  />
                                </div>
                              ) : (
                                <div
                                  className="ss-message__content--user-pull_down-col col-12 chat-log-um-split"
                              
                                >
                                  <SelectCustom
                                    disabled={true}
                                    data={
                                      pullDown[pullDown.type].options_with_comment
                                    }
                                    keyValue="value"
                                    className="chat-log-um-field-half" 
                                    placeholder={
                                      pullDown[pullDown.type].display_unselected
                                    }
                                    nameValue="text"
                                    onChange={(value) =>
                                      onChangeValue(
                                        indexContent,
                                        content.type,
                                        value,
                                        pullDown.type,
                                        "valueLeft"
                                      )
                                    }
                                    value={pullDown[pullDown.type].valueLeft}
                                  />
                                  <SelectCustom
                                    disabled={true}
                                    data={
                                      pullDown[pullDown.type].options_with_comment
                                    }
                                    keyValue="text2"
                                    className="chat-log-um-field-half" 
                                    placeholder={
                                      pullDown[pullDown.type].display_unselected
                                    }
                                    nameValue="text2"
                                    onChange={(value) =>
                                      onChangeValue(
                                        indexContent,
                                        content.type,
                                        value,
                                        pullDown.type,
                                        "valueRight"
                                      )
                                    }
                                    value={pullDown[pullDown.type].valueRight}
                                  />
                                </div>
                              )}
                            </div>
                            <div
                              className="ss-message__content--user-pull_down-comment chat-log-um-mt-4"
                          
                            >
                              <span>{pullDown[pullDown.type].comment}</span>
                            </div>
                          </div>
                        </>
                      )}
                      {pullDown.type === PULL_DOWN_TYPE.TIME_HM && (
                        <React.Fragment>
                          <div className="ss-message__content--user-pull_down--time_hm">
                            <div
                              className=" chat-log-um-split"
                          
                            >
                              <SelectCustom
                                disabled={true}
                                data={DATA_HOUR_FIXED.filter(
                                  (item) =>
                                    parseInt(item.value) >=
                                      (parseInt(pullDown[pullDown.type].start_at) ||
                                        HOUR_START_DEFAULT) &&
                                    parseInt(item.value) <=
                                      (parseInt(pullDown[pullDown.type].end_at) ||
                                        HOUR_END_DEFAULT)
                                )}
                                placeholder={PLACEHOLDER_HOUR}
                                className="chat-log-um-field-third" 
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    pullDown.type,
                                    "valueHour"
                                  )
                                }
                                value={pullDown[pullDown.type].valueHour}
                              />
                              <SelectCustom
                                disabled={true}
                                data={DATA_MINUTES}
                                placeholder={PLACEHOLDER_MINUTE}
                                className="chat-log-um-field-third" 
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    pullDown.type,
                                    "valueMinute"
                                  )
                                }
                                value={pullDown[pullDown.type].valueMinute}
                              />
                              <div
                                className="ss-message__content--user-pull_down-comment chat-log-um-field-third-mt"
                            
                              >
                                <span>{pullDown[pullDown.type].comment}</span>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      )}
                      {(pullDown.type === PULL_DOWN_TYPE.DATE_YMD ||
                        pullDown.type === PULL_DOWN_TYPE.DOB_YMD) && (
                        <React.Fragment>
                          <div className="ss-message__content--user-pull_down--time_hm">
                            <div
                              className=" chat-log-um-split-wrap"
                          
                            >
                              <SelectCustom
                                disabled={true}
                                data={DATA_YEAR_FIXED.filter(
                                  (item) =>
                                    parseInt(item.value) >=
                                      (parseInt(
                                        pullDown[pullDown.type].start_year
                                      ) || YEAR_START_DEFAULT) &&
                                    parseInt(item.value) <=
                                      (parseInt(pullDown[pullDown.type].end_year) ||
                                        YEAR_END_DEFAULT)
                                )}
                                placeholder={PLACEHOLDER_YEAR}
                                className="chat-log-um-field-third" 
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    pullDown.type,
                                    "valueYear"
                                  )
                                }
                                value={pullDown[pullDown.type].valueYear}
                              />
                              <SelectCustom
                                disabled={true}
                                data={DATA_MONTH}
                                placeholder={PLACEHOLDER_MONTH}
                                className="chat-log-um-field-third" 
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    pullDown.type,
                                    "valueMonth"
                                  )
                                }
                                value={pullDown[pullDown.type].valueMonth}
                              />
                              <SelectCustom
                                disabled={true}
                                data={DATA_DAY}
                                placeholder={PLACEHOLDER_DAY}
                                className="chat-log-um-field-third" 
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    pullDown.type,
                                    "valueDay"
                                  )
                                }
                                value={pullDown[pullDown.type].valueDay}
                              />
                              <div
                                className="ss-message__content--user-pull_down-comment chat-log-um-field-third-mt"
                            
                              >
                                <span>{pullDown[pullDown.type].comment}</span>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      )}
                      {pullDown.type === PULL_DOWN_TYPE.DATE_MD && (
                        <React.Fragment>
                          <div className="ss-message__content--user-pull_down--time_hm">
                            <div
                              className=" chat-log-um-split"
                          
                            >
                              <SelectCustom
                                disabled={true}
                                data={DATA_MONTH}
                                placeholder={PLACEHOLDER_MONTH}
                                className="chat-log-um-field-third" 
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    pullDown.type,
                                    "valueMonth"
                                  )
                                }
                                value={pullDown[pullDown.type].valueMonth}
                              />
                              <SelectCustom
                                disabled={true}
                                data={DATA_DAY}
                                placeholder={PLACEHOLDER_DAY}
                                className="chat-log-um-field-third" 
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    pullDown.type,
                                    "valueDay"
                                  )
                                }
                                value={pullDown[pullDown.type].valueDay}
                              />
                              <div
                                className="ss-message__content--user-pull_down-comment chat-log-um-field-third-mt"
                            
                              >
                                <span>{pullDown[pullDown.type].comment}</span>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      )}
                      {(pullDown.type === PULL_DOWN_TYPE.DATE_YM ||
                        pullDown.type === PULL_DOWN_TYPE.DOB_YM) && (
                        <React.Fragment>
                          <div className="ss-message__content--user-pull_down--time_hm">
                            <div
                              className=" chat-log-um-split"
                          
                            >
                              <SelectCustom
                                disabled={true}
                                data={DATA_YEAR_FIXED.filter(
                                  (item) =>
                                    parseInt(item.value) >=
                                      (parseInt(
                                        pullDown[pullDown.type].start_year
                                      ) || YEAR_START_DEFAULT) &&
                                    parseInt(item.value) <=
                                      (parseInt(pullDown[pullDown.type].end_year) ||
                                        YEAR_END_DEFAULT)
                                )}
                                placeholder={PLACEHOLDER_YEAR}
                                className="chat-log-um-field-third" 
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    pullDown.type,
                                    "valueYear"
                                  )
                                }
                                value={pullDown[pullDown.type].valueYear}
                              />
                              <SelectCustom
                                disabled={true}
                                data={DATA_MONTH}
                                placeholder={PLACEHOLDER_MONTH}
                                className="chat-log-um-field-third" 
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    pullDown.type,
                                    "valueMonth"
                                  )
                                }
                                value={pullDown[pullDown.type].valueMonth}
                              />
                              <div
                                className="ss-message__content--user-pull_down-comment chat-log-um-field-third-mt"
                            
                              >
                                <span>{pullDown[pullDown.type].comment}</span>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      )}
                      {pullDown.type === PULL_DOWN_TYPE.DATE_YMD_HM && (
                        <React.Fragment>
                          <div className="ss-message__content--user-pull_down--time_hm">
                            <div
                              className=" chat-log-um-split-wrap"
                          
                            >
                              <SelectCustom
                                disabled={true}
                                data={DATA_YEAR_FIXED.filter(
                                  (item) =>
                                    parseInt(item.value) >=
                                      (parseInt(
                                        pullDown[pullDown.type].start_year
                                      ) || YEAR_START_DEFAULT) &&
                                    parseInt(item.value) <=
                                      (parseInt(pullDown[pullDown.type].end_year) ||
                                        YEAR_END_DEFAULT)
                                )}
                                placeholder={PLACEHOLDER_YEAR}
                                className="chat-log-um-field-third" 
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    pullDown.type,
                                    "valueYear"
                                  )
                                }
                                value={pullDown[pullDown.type].valueYear}
                              />
                              <SelectCustom
                                disabled={true}
                                data={DATA_MONTH}
                                placeholder={PLACEHOLDER_MONTH}
                                className="chat-log-um-field-third" 
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    pullDown.type,
                                    "valueMonth"
                                  )
                                }
                                value={pullDown[pullDown.type].valueMonth}
                              />
                              <SelectCustom
                                disabled={true}
                                data={DATA_DAY}
                                placeholder={PLACEHOLDER_DAY}
                                className="chat-log-um-field-third-mb" 
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    pullDown.type,
                                    "valueDay"
                                  )
                                }
                                value={pullDown[pullDown.type].valueDay}
                              />
                              <SelectCustom
                                disabled={true}
                                data={DATA_HOUR_FIXED.filter(
                                  (item) =>
                                    parseInt(item.value) >=
                                      (parseInt(pullDown[pullDown.type].start_at) ||
                                        HOUR_START_DEFAULT) &&
                                    parseInt(item.value) <=
                                      (parseInt(pullDown[pullDown.type].end_at) ||
                                        HOUR_END_DEFAULT)
                                )}
                                placeholder={PLACEHOLDER_HOUR}
                                className="chat-log-um-field-third" 
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    pullDown.type,
                                    "valueHour"
                                  )
                                }
                                value={pullDown[pullDown.type].valueHour}
                              />
                              <SelectCustom
                                disabled={true}
                                data={DATA_MINUTES}
                                placeholder={PLACEHOLDER_MINUTE}
                                className="chat-log-um-field-third" 
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    pullDown.type,
                                    "valueMinute"
                                  )
                                }
                                value={pullDown[pullDown.type].valueMinute}
                              />
                              <div
                                className="ss-message__content--user-pull_down-comment chat-log-um-field-third-mt"
                            
                              >
                                <span>{pullDown[pullDown.type].comment}</span>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      )}
                      {pullDown.type === PULL_DOWN_TYPE.TIMEZONE_FROM_TO && (
                        <React.Fragment>
                          <div className="ss-message__content--user-pull_down--time_hm">
                            <div
                              className=" chat-log-um-split"
                          
                            >
                              <SelectCustom
                                disabled={true}
                                data={DATA_HOUR_FIXED.filter(
                                  (item) =>
                                    parseInt(item.value) >=
                                      (parseInt(pullDown[pullDown.type].start_at) ||
                                        HOUR_START_DEFAULT) &&
                                    parseInt(item.value) <=
                                      (parseInt(pullDown[pullDown.type].end_at) ||
                                        HOUR_END_DEFAULT)
                                )}
                                placeholder={PLACEHOLDER_HOUR}
                                className="chat-log-um-field-half" 
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    pullDown.type,
                                    "valueHour1"
                                  )
                                }
                                value={pullDown[pullDown.type].valueHour1}
                              />
                              <SelectCustom
                                disabled={true}
                                data={DATA_MINUTES}
                                placeholder={PLACEHOLDER_MINUTE}
                                className="chat-log-um-field-half" 
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    pullDown.type,
                                    "valueMinute1"
                                  )
                                }
                                value={pullDown[pullDown.type].valueMinute1}
                              />
                            </div>
                            <div className="chat-log-um-center" >{RANGE_SEPARATOR}</div>
                            <div
                              className=" chat-log-um-split"
                          
                            >
                              <SelectCustom
                                disabled={true}
                                data={DATA_HOUR_FIXED.filter(
                                  (item) =>
                                    parseInt(item.value) >=
                                      (parseInt(pullDown[pullDown.type].start_at) ||
                                        HOUR_START_DEFAULT) &&
                                    parseInt(item.value) <=
                                      (parseInt(pullDown[pullDown.type].end_at) ||
                                        HOUR_END_DEFAULT)
                                )}
                                placeholder={PLACEHOLDER_HOUR}
                                className="chat-log-um-field-half" 
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    pullDown.type,
                                    "valueHour2"
                                  )
                                }
                                value={pullDown[pullDown.type].valueHour2}
                              />
                              <SelectCustom
                                disabled={true}
                                data={DATA_MINUTES}
                                placeholder={PLACEHOLDER_MINUTE}
                                className="chat-log-um-field-half" 
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    pullDown.type,
                                    "valueMinute2"
                                  )
                                }
                                value={pullDown[pullDown.type].valueMinute2}
                              />
                            </div>
                            <div
                              className="ss-message__content--user-pull_down-comment chat-log-um-field-third-mt"
                          
                            >
                              <span>{pullDown[pullDown.type].comment}</span>
                            </div>
                          </div>
                        </React.Fragment>
                      )}
                      {pullDown.type === PULL_DOWN_TYPE.PERIOD_FROM_TO && (
                        <React.Fragment>
                          <div className="ss-message__content--user-pull_down--time_hm">
                            <div
                              className=" chat-log-um-split"
                          
                            >
                              <SelectCustom
                                disabled={true}
                                data={DATA_YEAR_FIXED.filter(
                                  (item) =>
                                    parseInt(item.value) >=
                                      (parseInt(
                                        pullDown[pullDown.type].start_year
                                      ) || YEAR_START_DEFAULT) &&
                                    parseInt(item.value) <=
                                      (parseInt(pullDown[pullDown.type].end_year) ||
                                        YEAR_END_DEFAULT)
                                )}
                                placeholder={PLACEHOLDER_YEAR}
                                className="chat-log-um-field-third" 
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    pullDown.type,
                                    "valueYear1"
                                  )
                                }
                                value={pullDown[pullDown.type].valueYear1}
                              />
                              <SelectCustom
                                disabled={true}
                                data={DATA_MONTH}
                                placeholder={PLACEHOLDER_MONTH}
                                className="chat-log-um-field-third" 
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    pullDown.type,
                                    "valueMonth1"
                                  )
                                }
                                value={pullDown[pullDown.type].valueMonth1}
                              />
                              <SelectCustom
                                disabled={true}
                                data={DATA_DAY}
                                placeholder={PLACEHOLDER_DAY}
                                className="chat-log-um-field-third" 
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    pullDown.type,
                                    "valueDay1"
                                  )
                                }
                                value={pullDown[pullDown.type].valueDay1}
                              />
                            </div>
                            <div className="chat-log-um-center" >{RANGE_SEPARATOR}</div>
                            <div
                              className=" chat-log-um-split"
                          
                            >
                              <SelectCustom
                                disabled={true}
                                data={DATA_YEAR_FIXED.filter(
                                  (item) =>
                                    parseInt(item.value) >=
                                      (parseInt(
                                        pullDown[pullDown.type].start_year
                                      ) || YEAR_START_DEFAULT) &&
                                    parseInt(item.value) <=
                                      (parseInt(pullDown[pullDown.type].end_year) ||
                                        YEAR_END_DEFAULT)
                                )}
                                placeholder={PLACEHOLDER_YEAR}
                                className="chat-log-um-field-third" 
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    pullDown.type,
                                    "valueYear2"
                                  )
                                }
                                value={pullDown[pullDown.type].valueYear2}
                              />
                              <SelectCustom
                                disabled={true}
                                data={DATA_MONTH}
                                placeholder={PLACEHOLDER_MONTH}
                                className="chat-log-um-field-third" 
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    pullDown.type,
                                    "valueMonth2"
                                  )
                                }
                                value={pullDown[pullDown.type].valueMonth2}
                              />
                              <SelectCustom
                                disabled={true}
                                data={DATA_DAY}
                                placeholder={PLACEHOLDER_DAY}
                                className="chat-log-um-field-third" 
                                onChange={(value) =>
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    value,
                                    pullDown.type,
                                    "valueDay2"
                                  )
                                }
                                value={pullDown[pullDown.type].valueDay2}
                              />
                            </div>
                            <div
                              className="ss-message__content--user-pull_down-comment chat-log-um-field-third-mt"
                          
                            >
                              <span>{pullDown[pullDown.type].comment}</span>
                            </div>
                          </div>
                        </React.Fragment>
                      )}
                      {pullDown.type === PULL_DOWN_TYPE.PREFECTURES && (
                        <React.Fragment>
                          <SelectCustom
                            disabled={true}
                            data={dataPrefectures}
                            placeholder={PLACEHOLDER_SELECT}
                            className="chat-log-um-field-full" 
                            keyValue="name"
                            nameValue="name"
                            onChange={(value) =>
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                pullDown.type,
                                "value"
                              )
                            }
                            value={pullDown[pullDown.type]?.value}
                          />
                        </React.Fragment>
                      )}
                      {pullDown.type === PULL_DOWN_TYPE.UP_TO_MUNICIPALITY && (
                        <div>
                          <div className="chat-log-um-caption" >
                            {pullDown[pullDown.type].prefecture_comment}
                          </div>
                          <div
                            className="chat-log-um-split" 
                          >
                            <SelectCustom
                              disabled={true}
                              data={dataPrefectures}
                              placeholder={PLACEHOLDER_PREFECTURE}
                              className="chat-log-um-field-45" 
                              keyValue="name"
                              nameValue="name"
                              onChange={async (value) => {
                                onChangeValue(
                                  indexContent,
                                  content.type,
                                  value,
                                  pullDown.type,
                                  "prefecture"
                                );
                                if (value) {
                                  const prefecture_jis_code = dataPrefectures.find(
                                    (item) => item.name === value
                                  ).prefecture_jis_code;
                                  api
                                    .get(
                                      `${CITIES_API_PATH}?${CITIES_QUERY_PARAM}=${prefecture_jis_code}`
                                    )
                                    .then((res) => {
                                      if (res.data.code === API_SUCCESS_CODE) {
                                        setDataCity(res.data.data);
                                      }
                                    })
                                    .catch(() => {});
                                } else {
                                  onChangeValue(
                                    indexContent,
                                    content.type,
                                    null,
                                    pullDown.type,
                                    "city"
                                  );
                                  setDataCity([]);
                                }
                              }}
                              value={pullDown[pullDown.type].prefecture}
                            />
                            <span>{RANGE_SEPARATOR}</span>
                            <SelectCustom
                              disabled={true}
                              data={dataCity}
                              placeholder={PLACEHOLDER_CITY}
                              className="chat-log-um-field-45" 
                              keyValue="city_name"
                              nameValue="city_name"
                              onChange={(value) =>
                                onChangeValue(
                                  indexContent,
                                  content.type,
                                  value,
                                  pullDown.type,
                                  "city"
                                )
                              }
                              value={pullDown[pullDown.type].city}
                            />
                          </div>
                          <div className="chat-log-um-caption" >
                            {pullDown[pullDown.type].city_comment}
                          </div>
                        </div>
                      )}
                    </div>
                    {errors?.[
                      `message${indexMessage}_content${indexContent}_${content.type}_${pullDown.type}`
                    ] && (
                      <div className="chat-log-um-error" >
                        {
                          errors?.[
                            `message${indexMessage}_content${indexContent}_${content.type}_${pullDown.type}`
                          ]
                        }
                      </div>
                    )}
                  </div>
  );
};

PullDownContent.propTypes = {
  content: PropTypes.object,
  indexContent: PropTypes.number,
  indexMessage: PropTypes.number,
  disabled: PropTypes.bool,
  errors: PropTypes.object,
  onChangeValue: PropTypes.func,
  dataPrefectures: PropTypes.array,
};

export default PullDownContent;
