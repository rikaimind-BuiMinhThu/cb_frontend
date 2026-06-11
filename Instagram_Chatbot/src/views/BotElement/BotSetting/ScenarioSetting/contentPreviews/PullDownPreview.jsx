import React from 'react';
import { Checkbox } from 'antd';
import SelectCustom from '../scenarioComon/SelectCustom';

const PullDownPreview = ({
  pullDown,
  dataHour,
  dataMinutes,
  dataYear,
  dataMonth,
  dataDay,
  dataPrefectures,
  dataCity,
  renderPreviewPulldownfromJs,
}) => (
                                                            <div style={{ marginBottom: '10px' }}>
                                                              {(pullDown.title_require || pullDown.require) &&
                                                                <div className="ss-message__content--user-pull_down-top" style={{ marginBottom: '0px' }}>
                                                                  {pullDown.title_require &&
                                                                    <span className="ss-message__content--user-pull_down-title">
                                                                      {pullDown.title}
                                                                    </span>
                                                                  }
                                                                  {pullDown.require === true &&
                                                                    <span className="ss-message__content--user-text-input-required">
                                                                      ※必須
                                                                    </span>
                                                                  }
                                                                </div>
                                                              }
                                                              <div className="ss-message__content--user-pull_down-wrapper">
                                                                {pullDown.type === 'customization' && (
                                                                  <>
                                                                    <div className="ss-message__content--user-pull_down--customization">
                                                                      <div
                                                                        className="ss-message__content--user-pull_down-comment"
                                                                        style={{ marginBottom: '4px' }}
                                                                      >
                                                                        <span>{pullDown[pullDown.type].title_comment}</span>
                                                                      </div>
                                                                      <div className="">
                                                                        {
                                                                          pullDown[pullDown.type].is_comment === false ?
                                                                            <div className="ss-message__content--user-pull_down-col col-12" style={{ padding: '0' }}>
                                                                              <SelectCustom
                                                                                data={pullDown[pullDown.type].options_without_comment}
                                                                                keyValue="値"
                                                                                style={{ width: '100%' }}
                                                                                placeholder={pullDown[pullDown.type].display_unselected}
                                                                                nameValue="text"
                                                                              />
                                                                            </div> :
                                                                            <div className="ss-message__content--user-pull_down-col col-12" style={{ display: 'flex', justifyContent: 'space-between', padding: '0' }}>
                                                                              <SelectCustom
                                                                                data={pullDown[pullDown.type].options_with_comment}
                                                                                keyValue="値"
                                                                                style={{ width: '49%' }}
                                                                                placeholder={pullDown[pullDown.type].display_unselected}
                                                                                nameValue="text"
                                                                              />
                                                                              <SelectCustom
                                                                                data={pullDown[pullDown.type].options_with_comment}
                                                                                keyValue="value2"
                                                                                style={{ width: '49%' }}
                                                                                placeholder={pullDown[pullDown.type].display_unselected}
                                                                                nameValue="text2"
                                                                              />
                                                                            </div>
                                                                        }
                                                                      </div>
                                                                      <div
                                                                        className="ss-message__content--user-pull_down-comment"
                                                                        style={{ marginTop: '4px' }}
                                                                      >
                                                                        <span>{pullDown[pullDown.type].comment}</span>
                                                                      </div>
                                                                    </div>
                                                                  </>
                                                                )}
                                                                {(pullDown.type === 'time_hm') && (
                                                                  <React.Fragment>
                                                                    <div className="ss-message__content--user-pull_down--time_hm">
                                                                      <div className="" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                        <SelectCustom
                                                                          data={dataHour}
                                                                          placeholder="時"
                                                                          style={{ width: '32%' }}
                                                                        />
                                                                        <SelectCustom
                                                                          data={dataMinutes}
                                                                          placeholder="分"
                                                                          style={{ width: '32%' }}
                                                                        />
                                                                        <div
                                                                          className="ss-message__content--user-pull_down-comment"
                                                                          style={{ marginTop: '4px', width: '32%' }}
                                                                        >
                                                                          <span>{pullDown[pullDown.type].comment}</span>
                                                                        </div>
                                                                      </div>
                                                                    </div>
                                                                  </React.Fragment>
                                                                )}
                                                                {(pullDown.type === 'date_ymd' ||
                                                                  pullDown.type === 'dob_ymd') && (
                                                                    <React.Fragment>
                                                                      <div className="ss-message__content--user-pull_down--time_hm">
                                                                        <div className="" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                                                          <SelectCustom
                                                                            data={dataYear}
                                                                            placeholder="年"
                                                                            style={{ width: '32%' }}
                                                                          />
                                                                          <SelectCustom
                                                                            data={dataMonth}
                                                                            placeholder="月"
                                                                            style={{ width: '32%' }}
                                                                          />
                                                                          {!(pullDown.type === 'dob_ymd' && pullDown?.[pullDown.type]?.is_hide_day) && (
                                                                          <SelectCustom
                                                                            data={dataDay}
                                                                            placeholder="日"
                                                                            style={{ width: '32%' }}
                                                                          />
                                                                          )}
                                                                          <div
                                                                            className="ss-message__content--user-pull_down-comment"
                                                                            style={{ marginTop: '4px', width: '32%' }}
                                                                          >
                                                                            <span>{pullDown[pullDown.type].comment}</span>
                                                                          </div>
                                                                        </div>
                                                                      </div>
                                                                    </React.Fragment>
                                                                  )}
                                                                {(pullDown.type === 'date_md') && (
                                                                  <React.Fragment>
                                                                    <div className="ss-message__content--user-pull_down--time_hm">
                                                                      <div className="" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                        <SelectCustom
                                                                          data={dataMonth}
                                                                          placeholder="月"
                                                                          style={{ width: '32%' }}
                                                                        />
                                                                        <SelectCustom
                                                                          data={dataDay}
                                                                          placeholder="日"
                                                                          style={{ width: '32%' }}
                                                                        />
                                                                        <div
                                                                          className="ss-message__content--user-pull_down-comment"
                                                                          style={{ marginTop: '4px', width: '32%' }}
                                                                        >
                                                                          <span>{pullDown[pullDown.type].comment}</span>
                                                                        </div>
                                                                      </div>
                                                                    </div>
                                                                  </React.Fragment>
                                                                )}
                                                                {(pullDown.type === 'date_ym' ||
                                                                  pullDown.type === 'dob_ym') && (
                                                                    <React.Fragment>
                                                                      <div className="ss-message__content--user-pull_down--time_hm">
                                                                        <div className="" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                          <SelectCustom
                                                                            data={dataYear}
                                                                            placeholder="年"
                                                                            style={{ width: '32%' }}
                                                                          />
                                                                          <SelectCustom
                                                                            data={dataMonth}
                                                                            placeholder="月"
                                                                            style={{ width: '32%' }}
                                                                          />
                                                                          <div
                                                                            className="ss-message__content--user-pull_down-comment"
                                                                            style={{ marginTop: '4px', width: '32%' }}
                                                                          >
                                                                            <span>{pullDown[pullDown.type].comment}</span>
                                                                          </div>
                                                                        </div>
                                                                      </div>
                                                                    </React.Fragment>
                                                                  )}
                                                                {(pullDown.type === 'date_ymd_hm') && (
                                                                  <React.Fragment>
                                                                    <div className="ss-message__content--user-pull_down--time_hm">
                                                                      <div className="" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                                                        <SelectCustom
                                                                          data={dataYear}
                                                                          placeholder="年"
                                                                          style={{ width: '32%' }}
                                                                        />
                                                                        <SelectCustom
                                                                          data={dataMonth}
                                                                          placeholder="月"
                                                                          style={{ width: '32%' }}
                                                                        />
                                                                        <SelectCustom
                                                                          data={dataDay}
                                                                          placeholder="日"
                                                                          style={{ width: '32%', marginBottom: '10px' }}
                                                                        />
                                                                        <SelectCustom
                                                                          data={dataHour}
                                                                          placeholder="時"
                                                                          style={{ width: '32%' }}
                                                                        />
                                                                        <SelectCustom
                                                                          data={dataMinutes}
                                                                          placeholder="分"
                                                                          style={{ width: '32%' }}
                                                                        />
                                                                        <div
                                                                          className="ss-message__content--user-pull_down-comment"
                                                                          style={{ marginTop: '4px', width: '32%' }}
                                                                        >
                                                                          <span>{pullDown[pullDown.type].comment}</span>
                                                                        </div>
                                                                      </div>
                                                                    </div>
                                                                  </React.Fragment>
                                                                )}
                                                                {pullDown.type === 'timezone_from_to' && (
                                                                  <React.Fragment>
                                                                    <div className="ss-message__content--user-pull_down--time_hm">
                                                                      <div className="" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                        <SelectCustom
                                                                          data={dataHour}
                                                                          placeholder="時"
                                                                          style={{ width: '49%' }}
                                                                        />
                                                                        <SelectCustom
                                                                          data={dataMinutes}
                                                                          placeholder="分"
                                                                          style={{ width: '49%' }}
                                                                        />
                                                                      </div>
                                                                      <div style={{ textAlign: 'center' }}>~</div>
                                                                      <div className="" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                        <SelectCustom
                                                                          data={dataHour}
                                                                          placeholder="時"
                                                                          style={{ width: '49%' }}
                                                                        />
                                                                        <SelectCustom
                                                                          data={dataMinutes}
                                                                          placeholder="分"
                                                                          style={{ width: '49%' }}
                                                                        />
                                                                      </div>
                                                                      <div
                                                                        className="ss-message__content--user-pull_down-comment"
                                                                        style={{ marginTop: '4px', width: '32%' }}
                                                                      >
                                                                        <span>{pullDown[pullDown.type].comment}</span>
                                                                      </div>
                                                                    </div>
                                                                  </React.Fragment>
                                                                )}
                                                                {pullDown.type === 'period_from_to' && (
                                                                  <React.Fragment>
                                                                    <div className="ss-message__content--user-pull_down--time_hm">
                                                                      <div className="" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                        <SelectCustom
                                                                          data={dataYear}
                                                                          placeholder="年"
                                                                          style={{ width: '32%' }}
                                                                        />
                                                                        <SelectCustom
                                                                          data={dataMonth}
                                                                          placeholder="月"
                                                                          style={{ width: '32%' }}
                                                                        />
                                                                        <SelectCustom
                                                                          data={dataDay}
                                                                          placeholder="日"
                                                                          style={{ width: '32%' }}
                                                                        />
                                                                      </div>
                                                                      <div style={{ textAlign: 'center' }}>~</div>
                                                                      <div className="" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                        <SelectCustom
                                                                          data={dataYear}
                                                                          placeholder="年"
                                                                          style={{ width: '32%' }}
                                                                        />
                                                                        <SelectCustom
                                                                          data={dataMonth}
                                                                          placeholder="月"
                                                                          style={{ width: '32%' }}
                                                                        />
                                                                        <SelectCustom
                                                                          data={dataDay}
                                                                          placeholder="日"
                                                                          style={{ width: '32%' }}
                                                                        />
                                                                      </div>
                                                                      <div
                                                                        className="ss-message__content--user-pull_down-comment"
                                                                        style={{ marginTop: '4px', width: '32%' }}
                                                                      >
                                                                        <span>{pullDown[pullDown.type].comment}</span>
                                                                      </div>
                                                                    </div>
                                                                  </React.Fragment>
                                                                )}
                                                                {pullDown.type === 'prefectures' && (
                                                                  <React.Fragment>
                                                                    <SelectCustom
                                                                      data={dataPrefectures}
                                                                      placeholder="選択してください。"
                                                                      style={{ width: '100%' }}
                                                                      keyValue="prefecture_jis_code"
                                                                      nameValue="name"
                                                                    />
                                                                  </React.Fragment>
                                                                )}
                                                                {renderLPIntegrationOptionPreview(pullDown)}
                                                                {renderPreviewPulldownfromJs(pullDown)}
                                                                {pullDown.type === 'up_to_municipality' && (
                                                                  <div>
                                                                    <div style={{ fontWeight: '400', fontSize: '12px' }}>{pullDown[pullDown.type].prefecture_comment}</div>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                      <SelectCustom
                                                                        data={dataPrefectures}
                                                                        placeholder="都道府県を選択"
                                                                        style={{ width: '45%' }}
                                                                        keyValue="prefecture_jis_code"
                                                                        nameValue="name"
                                                                      />
                                                                      <span>~</span>
                                                                      <SelectCustom
                                                                        data={dataCity}
                                                                        placeholder="市区町村を選択"
                                                                        style={{ width: '45%' }}
                                                                        keyValue="id"
                                                                        nameValue="name"
                                                                      />
                                                                    </div>
                                                                    <div style={{ fontWeight: '400', fontSize: '12px' }}>{pullDown[pullDown.type].city_comment}</div>
                                                                  </div>
                                                                )}
                                                              </div>
                                                            </div>
);

export default PullDownPreview;
