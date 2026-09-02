/* cSpell: disable */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import InputCustom from 'v2/views/BotElement/BotSetting/ScenarioSetting/scenarioComon/InputCustom';
import api from 'v2/api/api-management';
import {
  REQUIRED_LABEL,
  ZIP_SEARCH_LABEL,
  LABEL_POST_CODE,
  LABEL_PREFECTURE,
  LABEL_MUNICIPALITY,
  LABEL_ADDRESS,
  LABEL_BUILDING,
  ZIP_ADDRESS_API_PATH,
  ZIP_QUERY_PARAM,
  API_SUCCESS_CODE,
  NUMBER_REGEXP,
  REQUIRE_ALL_ITEMS,
  REQUIRE_FLAG,
} from './constants';


import { focusInput } from './helpers';

const ZipCodeAddressContent = ({
  content,
  indexContent,
  indexMessage,
  disabled,
  errors,
  onChangeValue,
  onOpen,
}) => {
  const addressWrapRef = useRef(null);
  const zipRightWrapRef = useRef(null);
  const zipCodeAddress = content.zip_code_address;
  if (!zipCodeAddress) {
    return null;
  }

  return (
                  <div className="chat-log-um-block" >
                    <div
                      className={`chat-log-um-zip-search ${!disabled ? 'chat-log-um-zip-search--active' : 'chat-log-um-zip-search--disabled'}`}
                    >
                      <span
                        className={!disabled ? 'chat-log-um-pointer' : undefined}
                        onClick={() => {
                          if (disabled !== true) onOpen(true, indexContent);
                        }}
                      >
                        {ZIP_SEARCH_LABEL}
                      </span>
                    </div>
                    {(zipCodeAddress.title_require ||
                      zipCodeAddress.isCheckRequire) && (
                      <div
                        className="ss-message__content--user-pull_down-top chat-log-um-mb-0"
                    
                      >
                        {zipCodeAddress.title_require && (
                          <span className="ss-message__content--user-pull_down-title">
                            {zipCodeAddress.title}
                          </span>
                        )}
                        {(zipCodeAddress.isCheckRequire === REQUIRE_ALL_ITEMS ||
                          zipCodeAddress.isCheckRequire === REQUIRE_FLAG) && (
                          <span className="ss-message__content--user-text-input-required">
                            {REQUIRED_LABEL}
                          </span>
                        )}
                      </div>
                    )}
                    {zipCodeAddress.post_code !== undefined && (
                      <div className="ss-user-setting__item-bottom">
                        <div
                          className="chat-log-um-micro-label-mb5" 
                        >
                          {LABEL_POST_CODE}
                        </div>
                        {zipCodeAddress.split_postal_code !== true ? (
                          <InputCustom
                            type="number"
                            placeholder={zipCodeAddress.post_code}
                            disabled={true}
                            // controls={false}
                            // className="ss-user-setting-input-limit-character"
                            // maxLength={7}
                            onKeyPress={(e) => {
                              if (e.target.value.length >= 7) e.preventDefault();
                            }}
                            containerClassName="chat-log-um-field-full chat-log-um-ml-0" 
                            onChange={async (value) => {
                              onChangeValue(
                                indexContent,
                                content.type,
                                value,
                                "value_post_code"
                              );
                              if ((value + "").length === 7) {
                                api
                                  .get(
                                    `${ZIP_ADDRESS_API_PATH}?${ZIP_QUERY_PARAM}=${value}`
                                  )
                                  .then((res) => {
                                    if (res.data && res.data.code === API_SUCCESS_CODE) {
                                      onChangeValue(
                                        indexContent,
                                        content.type,
                                        res.data.data.prefecture_name,
                                        "value_prefecture"
                                      );
                                      onChangeValue(
                                        indexContent,
                                        content.type,
                                        `${res.data.data.city_name}${res.data.data.town_name}`,
                                        "value_municipality"
                                      );
                                      focusInput(addressWrapRef);
                                    }
                                  })
                                  .catch(() => {});
                              }
                            }}
                            value={zipCodeAddress.value_post_code}
                          />
                        ) : (
                          <div
                            className="chat-log-um-split-full" 
                          >
                            <InputCustom
                              type="number"
                              placeholder={zipCodeAddress.post_code_left}
                              disabled={true}
                              containerClassName="chat-log-um-field-half" 
                              onKeyPress={(e) => {
                                if (e.target.value.length >= 3) e.preventDefault();
                              }}
                              onChange={async (value) => {
                                if (!NUMBER_REGEXP.test(value)) return;
                                if ((value + "").length === 3) {
                                  focusInput(zipRightWrapRef);
                                }
                                onChangeValue(
                                  indexContent,
                                  content.type,
                                  value,
                                  "value_post_code_left"
                                );
                                if (
                                  (value + "").length === 3 &&
                                  zipCodeAddress.value_post_code_right &&
                                  (zipCodeAddress.value_post_code_right + "")
                                    .length === 4
                                ) {
                                  api
                                    .get(
                                      `${ZIP_ADDRESS_API_PATH}?${ZIP_QUERY_PARAM}=${value}${zipCodeAddress.value_post_code_right}`
                                    )
                                    .then((res) => {
                                      if (res.data && res.data.code === API_SUCCESS_CODE) {
                                        onChangeValue(
                                          indexContent,
                                          content.type,
                                          res.data.data.prefecture_name,
                                          "value_prefecture"
                                        );
                                        onChangeValue(
                                          indexContent,
                                          content.type,
                                          `${res.data.data.city_name}${res.data.data.town_name}`,
                                          "value_municipality"
                                        );
                                        focusInput(addressWrapRef);
                                      }
                                    })
                                    .catch(() => {});
                                } else if (
                                  (value + "").length !== 0 ||
                                  (zipCodeAddress.value_post_code_right + "")
                                    .length !== 0
                                ) {
                                } else {
                                }
                              }}
                              value={zipCodeAddress.value_post_code_left}
                            />
                            <div ref={zipRightWrapRef} className="chat-log-um-field-half">
                            <InputCustom
                              type="number"
                              placeholder={zipCodeAddress.post_code_right}
                              disabled={true}
                              containerClassName="chat-log-um-field-full"
                              onKeyPress={(e) => {
                                if (e.target.value.length >= 4) e.preventDefault();
                              }}
                              onChange={async (value) => {
                                if (!NUMBER_REGEXP.test(value)) return;
                                onChangeValue(
                                  indexContent,
                                  content.type,
                                  value,
                                  "value_post_code_right"
                                );
                                if (
                                  (value + "").length === 4 &&
                                  zipCodeAddress.value_post_code_left &&
                                  (zipCodeAddress.value_post_code_left + "")
                                    .length === 3
                                ) {
                                  api
                                    .get(
                                      `${ZIP_ADDRESS_API_PATH}?${ZIP_QUERY_PARAM}=${zipCodeAddress.value_post_code_left}${value}`
                                    )
                                    .then((res) => {
                                      if (res.data && res.data.code === API_SUCCESS_CODE) {
                                        onChangeValue(
                                          indexContent,
                                          content.type,
                                          res.data.data.prefecture_name,
                                          "value_prefecture"
                                        );
                                        onChangeValue(
                                          indexContent,
                                          content.type,
                                          `${res.data.data.city_name}${res.data.data.town_name}`,
                                          "value_municipality"
                                        );
                                        focusInput(addressWrapRef);
                                      } else {
                                      }
                                    })
                                    .catch(() => {});
                                }
                              }}
                              value={zipCodeAddress.value_post_code_right}
                            />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {zipCodeAddress.prefecture !== undefined && (
                      <div className="ss-user-setting__item-bottom">
                        <div
                          className="chat-log-um-micro-label" 
                        >
                          {LABEL_PREFECTURE}
                        </div>

                        <InputCustom
                          placeholder={zipCodeAddress.prefecture}
                          disabled={true}
                          containerClassName="chat-log-um-field-full" 
                          onChange={(value) =>
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              "value_prefecture"
                            )
                          }
                          value={zipCodeAddress.value_prefecture}
                        />
                      </div>
                    )}
                    {zipCodeAddress.municipality !== undefined && (
                      <div className="ss-user-setting__item-bottom">
                        <div
                          className="chat-log-um-micro-label" 
                        >
                          {LABEL_MUNICIPALITY}
                        </div>
                        <InputCustom
                          placeholder={zipCodeAddress.municipality}
                          disabled={true}
                          containerClassName="chat-log-um-field-full" 
                          onChange={(value) =>
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              "value_municipality"
                            )
                          }
                          value={zipCodeAddress.value_municipality}
                        />
                      </div>
                    )}
                    {zipCodeAddress.address !== undefined && (
                      <div className="ss-user-setting__item-bottom">
                        <div
                          className="chat-log-um-micro-label" 
                        >
                          {LABEL_ADDRESS}
                        </div>
                        <div ref={addressWrapRef}>
                        <InputCustom
                          placeholder={zipCodeAddress.address}
                          disabled={true}
                          containerClassName="chat-log-um-field-full"
                          onChange={(value) =>
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              "value_address"
                            )
                          }
                          value={zipCodeAddress.value_address}
                        />
                        </div>
                      </div>
                    )}
                    {zipCodeAddress.building_name !== undefined && (
                      <div className="ss-user-setting__item-bottom">
                        <div
                          className="chat-log-um-micro-label" 
                        >
                          {LABEL_BUILDING}
                        </div>
                        <InputCustom
                          placeholder={zipCodeAddress.building_name}
                          id="ss-user-input-building"
                          disabled={true}
                          containerClassName="chat-log-um-field-full" 
                          onChange={(value) =>
                            onChangeValue(
                              indexContent,
                              content.type,
                              value,
                              "value_building_name"
                            )
                          }
                          value={zipCodeAddress.value_building_name}
                        />
                      </div>
                    )}
                    {errors?.[
                      `message${indexMessage}_content${indexContent}_${content.type}`
                    ] && (
                      <div className="chat-log-um-error" >
                        {
                          errors?.[
                            `message${indexMessage}_content${indexContent}_${content.type}`
                          ]
                        }
                      </div>
                    )}
                  </div>
  );
};

ZipCodeAddressContent.propTypes = {
  content: PropTypes.object,
  indexContent: PropTypes.number,
  indexMessage: PropTypes.number,
  disabled: PropTypes.bool,
  errors: PropTypes.object,
  onChangeValue: PropTypes.func,
  onOpen: PropTypes.func,
};

export default ZipCodeAddressContent;
