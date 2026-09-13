import React, { useState } from 'react';
import PropTypes from 'prop-types';
import 'v2/assets/css/bot/preview-chat-bot.css';
import {
  MESSAGE_CONTENT_TYPES,
  dataHourFixed as HOUR_DEFAULT_OPTIONS,
  dataMinutes as MINUTES_DEFAULT_OPTIONS,
  dataYearFixed as YEAR_DEFAULT_OPTIONS,
  dataMonth as MONTH_DEFAULT_OPTIONS,
  dataDay as DAY_DEFAULT_OPTIONS,
  CRAWL_ELEMENT_TYPES,
  REQUIRED_FIELD_LABEL,
  EMPTY_INPUT_VALUE,
  PULL_DOWN_PLACEHOLDERS,
} from "v2/views/Preview/PreviewComponent/Constants";
import { getCitiesByPrefecture } from "v2/views/Preview/PreviewComponent/Utils";
import { tokenExpired } from "v2/api/tokenExpired";
import LPIntegrationOptionPullDown from "v2/views/ScenarioSetting/scenarioCommon/LPIntegrationOptionPullDown";
import SelectCustom from "v2/components/BotMessages/SelectCustom";

const PullDown = ({ content, errors, contentIndex, messageIndex, disabled, onChangeValue, prefecturesList, lpOptionData, postMessageToParent, hidden }) => {
  const [cityOptions, setCityOptions] = useState([]);

  if (content.type !== MESSAGE_CONTENT_TYPES.PULL_DOWN) return null;

  const pullDown = content.pull_down;
  if (!pullDown) return null;

  const hourOptions = HOUR_DEFAULT_OPTIONS.filter(
    (item) =>
      parseInt(item.value) >=
      (parseInt(pullDown[pullDown.type].start_at) ||
        "0") &&
      parseInt(item.value) <=
      (parseInt(pullDown[pullDown.type].end_at) || "23")
  );

  const yearOptions = YEAR_DEFAULT_OPTIONS.filter(
    (item) =>
      parseInt(item.value) >=
      (parseInt(pullDown[pullDown.type].start_year) ||
        "1935") &&
      parseInt(item.value) <=
      (parseInt(pullDown[pullDown.type].end_year) || "2072")
  );

  const renderYearSelect = (additionalProps = {}) => {
    const valueKey = additionalProps.valueKey || "valueYear";
    const className = additionalProps.className || "w-32-percent";
    return (
      <SelectCustom
        disabled={disabled}
        data={yearOptions}
        placeholder={PULL_DOWN_PLACEHOLDERS.YEAR}
        className={className}
        onChange={(value) =>
          onChangeValue(
            contentIndex,
            content.type,
            value,
            pullDown.type,
            valueKey
          )
        }
        value={pullDown[pullDown.type][valueKey] || EMPTY_INPUT_VALUE}
      />
    );
  };

  const renderMonthSelect = (additionalProps = {}) => {
    const valueKey = additionalProps.valueKey || "valueMonth";
    const className = additionalProps.className || "w-32-percent";
    return (
      <SelectCustom
        disabled={disabled}
        data={MONTH_DEFAULT_OPTIONS}
        placeholder={PULL_DOWN_PLACEHOLDERS.MONTH}
        className={className}
        onChange={(value) =>
          onChangeValue(
            contentIndex,
            content.type,
            value,
            pullDown.type,
            valueKey
          )
        }
        value={pullDown[pullDown.type][valueKey] || EMPTY_INPUT_VALUE}
      />
    );
  };

  const renderDaySelect = (additionalProps = {}) => {
    const valueKey = additionalProps.valueKey || "valueDay";
    const className = additionalProps.className || "w-32-percent";
    return (
      <SelectCustom
        disabled={disabled}
        data={DAY_DEFAULT_OPTIONS}
        placeholder={PULL_DOWN_PLACEHOLDERS.DAY}
        className={className}
        onChange={(value) =>
          onChangeValue(
            contentIndex,
            content.type,
            value,
            pullDown.type,
            valueKey
          )
        }
        value={pullDown[pullDown.type][valueKey] || EMPTY_INPUT_VALUE}
      />
    );
  };

  const renderHourSelect = (additionalProps = {}) => {
    const valueKey = additionalProps.valueKey || "valueHour";
    return (
      <SelectCustom
        disabled={disabled}
        data={hourOptions}
        placeholder={PULL_DOWN_PLACEHOLDERS.HOUR}
        className={`w-32-percent ${additionalProps.className}`}
        onChange={(value) =>
          onChangeValue(
            contentIndex,
            content.type,
            value,
            pullDown.type,
            valueKey
          )
        }
        value={pullDown[pullDown.type][valueKey] || EMPTY_INPUT_VALUE}
      />
    );
  };

  const renderMinuteSelect = (additionalProps = {}) => {
    const valueKey = additionalProps.valueKey || "valueMinute";
    return (
      <SelectCustom
        disabled={disabled}
        data={MINUTES_DEFAULT_OPTIONS}
        className={`w-32-percent ${additionalProps.className}`}
        onChange={(value) =>
          onChangeValue(
            contentIndex,
            content.type,
            value,
            pullDown.type,
            valueKey
          )
        }
        value={pullDown[pullDown.type][valueKey] || EMPTY_INPUT_VALUE}
      />
    );
  };

  const renderTitle = () => {
    if (!pullDown.title_require && !pullDown.require) return null;

    const title = pullDown.title_require && (
      <span className="ss-message__content--user-pull_down-title">{pullDown.title}</span>
    );

    const requiredLabel = pullDown.require === true && (
      <span className="ss-message__content--user-text-input-required">
        {REQUIRED_FIELD_LABEL}
      </span>
    );

    return (
      <div className="ss-message__content--user-pull_down-top m-b-0">
        {title}
        {requiredLabel}
      </div>
    );
  };

  const renderContent = () => {
    switch (pullDown.type) {
      case "customization":
        return renderCustomization();
      case "time_hm":
        return renderTimeHm();
      case "date_ymd":
      case "dob_ymd":
        return renderDateYmd();
      case "date_md":
        return renderDateMd();
      case "date_ym":
      case "dob_ym":
        return renderDateYm();
      case "date_ymd_hm":
        return renderDateYmdHm();
      case "timezone_from_to":
        return renderTimezoneFromTo();
      case "period_from_to":
        return renderPeriodFromTo();
      case "prefectures":
        return renderPrefectures();
      case "lp_integration_option":
        return renderLpIntegrationOption();
      case "from_js_result":
        return renderFromJsResult();
      case "up_to_municipality":
        return renderUpToMunicipality();
      case "consume_api_response":
        return renderConsumeApiResponse();
      default:
        return null;
    }
  };

  const renderComment = () => {
    return (
      <div className="ss-message__content--user-pull_down-comment m-b-4">
        <span>{pullDown[pullDown.type].comment}</span>
      </div>
    );
  };
  
  const renderCustomization = () => {
    const titleComment = (
      <div className="ss-message__content--user-pull_down-comment m-b-4">
        <span>{pullDown[pullDown.type].title_comment}</span>
      </div>
    );

    const contentWithoutComment = (
      <div className="ss-message__content--user-pull_down-col col-12">
        <SelectCustom
          disabled={disabled}
          data={
            pullDown[pullDown.type]
              .options_without_comment
          }
          keyValue="value"
          className="w-100-percent"
          placeholder={
            pullDown[pullDown.type].display_unselected
          }
          nameValue="text"
          onChange={(value) =>
            onChangeValue(
              contentIndex,
              content.type,
              value,
              pullDown.type,
              "value"
            )
          }
          value={pullDown[pullDown.type].value || pullDown.initial_selection || EMPTY_INPUT_VALUE}
        />
      </div>
    );

    const contentWithComment = (
      <div
        className="ss-message__content--user-pull_down-col col-12 ss-message__content--user-chat-container"
      >
        <SelectCustom
          disabled={disabled}
          data={
            pullDown[pullDown.type].options_with_comment
          }
          keyValue="value"
          className="w-49-percent"
          placeholder={
            pullDown[pullDown.type].display_unselected
          }
          nameValue="text"
          onChange={(value) =>
            onChangeValue(
              contentIndex,
              content.type,
              value,
              pullDown.type,
              "valueLeft"
            )
          }
          value={pullDown[pullDown.type].valueLeft || EMPTY_INPUT_VALUE}
        />
        <SelectCustom
          disabled={disabled}
          data={
            pullDown[pullDown.type].options_with_comment
          }
          keyValue="text2"
          className="w-49-percent"
          placeholder={
            pullDown[pullDown.type].display_unselected
          }
          nameValue="text2"
          onChange={(value) =>
            onChangeValue(
              contentIndex,
              content.type,
              value,
              pullDown.type,
              "valueRight"
            )
          }
          value={pullDown[pullDown.type].valueRight || EMPTY_INPUT_VALUE}
        />
      </div>
    );

    return (
      <div className="ss-message__content--user-pull_down--customization">
        {titleComment}
        <div>
          {pullDown[pullDown.type].is_comment === false ? contentWithoutComment : contentWithComment}
        </div>
        {renderComment()}
      </div>
    );
  };

  const renderTimeHm = () => {
    return (
      <React.Fragment>
        <div className="ss-message__content--user-pull_down--time_hm">
          <div className="ss-message__content--user-chat-container">
            <SelectCustom
              disabled={disabled}
              data={hourOptions}
              placeholder={PULL_DOWN_PLACEHOLDERS.HOUR}
              className="w-32-percent"
              onChange={(value) =>
                onChangeValue(
                  contentIndex,
                  content.type,
                  value,
                  pullDown.type,
                  "valueHour"
                )
              }
              value={pullDown[pullDown.type].valueHour || EMPTY_INPUT_VALUE}
            />
            <SelectCustom
              disabled={disabled}
              data={MINUTES_DEFAULT_OPTIONS}
              placeholder={PULL_DOWN_PLACEHOLDERS.MINUTE}
              className="w-32-percent"
              onChange={(value) =>
                onChangeValue(
                  contentIndex,
                  content.type,
                  value,
                  pullDown.type,
                  "valueMinute"
                )
              }
              value={pullDown[pullDown.type].valueMinute}
            />
            {renderComment()}
          </div>
        </div>
      </React.Fragment>
    );
  };

  const renderDateYmd = () => {
    const isHideDay = pullDown.type === "dob_ymd" && pullDown?.[pullDown.type]?.is_hide_day;
    const widthClass = isHideDay ? "w-49-percent" : "w-32-percent";
    return (
      <React.Fragment>
        <div className="ss-message__content--user-pull_down--time_hm">
          <div className="ss-message__content--user-chat-container flex-wrap">
            {renderYearSelect({ className: widthClass })}
            {renderMonthSelect({ className: widthClass })}
            {!isHideDay && renderDaySelect()}
            {renderComment()}
          </div>
        </div>
      </React.Fragment>
    );
  };
  
  const renderDateMd = () => {
    return (
      <React.Fragment>
        <div className="ss-message__content--user-pull_down--time_hm">
          <div className="ss-message__content--user-chat-container">
            {renderMonthSelect()}
            {renderDaySelect()}
            {renderComment()}
          </div>
        </div>
      </React.Fragment>
    );
  };

  const renderDateYm = () => {
    return (
      <React.Fragment>
        <div className="ss-message__content--user-pull_down--time_hm">
          <div className="ss-message__content--user-chat-container">
            {renderYearSelect()}
            {renderMonthSelect()}
            {renderComment()}
          </div>
        </div>
      </React.Fragment>
    );
  };

  const renderDateYmdHm = () => {
    return (
      <React.Fragment>
        <div className="ss-message__content--user-pull_down--time_hm">
          <div className="ss-message__content--user-chat-container">
            {renderYearSelect()}
            {renderMonthSelect()}
            {renderDaySelect()}
            {renderHourSelect()}
            {renderMinuteSelect()}
            {renderComment()}
          </div>
        </div>
      </React.Fragment>
    );
  };

  const renderTimezoneFromTo = () => {
    return (
      <React.Fragment>
        <div className="ss-message__content--user-pull_down--time_hm">
          <div className="ss-message__content--user-chat-container">
            {renderHourSelect({ valueKey: "valueHour1" })}
            {renderMinuteSelect({ valueKey: "valueMinute1" })}
            <div className="text-center">~</div>
            {renderHourSelect({ valueKey: "valueHour2" })}
            {renderMinuteSelect({ valueKey: "valueMinute2" })}
            {renderComment()}
          </div>
        </div>
      </React.Fragment>
    );
  };

  const renderPeriodFromTo = () => {
    return (
      <React.Fragment>
        <div className="ss-message__content--user-pull_down--time_hm">
          <div className="ss-message__content--user-chat-container">
            {renderYearSelect({ valueKey: "valueYear1" })}
            {renderMonthSelect({ valueKey: "valueMonth1" })}
            {renderDaySelect({ valueKey: "valueDay1" })}
            <div className="text-center">~</div>
            {renderYearSelect({ valueKey: "valueYear2" })}
            {renderMonthSelect({ valueKey: "valueMonth2" })}
            {renderDaySelect({ valueKey: "valueDay2" })}
            {renderComment()}
          </div>
        </div>
      </React.Fragment>
    );
  };

  const renderPrefectures = () => {
    return (
      <React.Fragment>
        <SelectCustom
          disabled={disabled}
          data={prefecturesList}
          placeholder={PULL_DOWN_PLACEHOLDERS.SELECT}
          className="w-100-percent"
          keyValue="id"
          nameValue="name"
          onChange={(value) =>
            onChangeValue(
              contentIndex,
              content.type,
              value,
              pullDown.type,
              "value"
            )
          }
          value={pullDown[pullDown.type]?.value}
        />
      </React.Fragment>
    );
  };

  const renderLpIntegrationOption = () => {
    return (
      <LPIntegrationOptionPullDown
        search_element_type={pullDown.lp_element_search_mode}
        search_element_value={pullDown.lp_element_search_value}
        disabled={disabled}
        pullDown={pullDown}
        data={lpOptionData[pullDown.lp_element_search_value]}
        postMessageToParent={postMessageToParent}
        keyValue="value"
        nameValue="text"
        hidden={hidden}
        onChange={(value) =>
          onChangeValue(
            contentIndex,
            content.type,
            value,
            pullDown.type,
            "value"
          )
        }
      />
    );
  };

  const renderFromJsResult = () => {
    return (
      <LPIntegrationOptionPullDown
        targetElementType={CRAWL_ELEMENT_TYPES.FROM_JS}
        search_element_type={pullDown.from_js_result_target_search_mode}
        search_element_value={pullDown.from_js_result_target_search_value}
        jsCode={pullDown.from_js_result_code}
        disabled={disabled}
        pullDown={pullDown}
        data={lpOptionData[pullDown.from_js_result_target_search_value]}
        postMessageToParent={postMessageToParent}
        onChange={(value) =>
          onChangeValue(contentIndex, content.type, value, pullDown.type, 'value')
        }
        nameValue='text'
        keyValue='value'
      />
    );
  };

  const renderUpToMunicipality = () => {
    return (
      <div>
        <div className="f-weight-400 f-size-12" >
          {pullDown[pullDown.type].prefecture_comment}
        </div>
        <div className="ss-message__content--user-chat-container">
          <SelectCustom
            disabled={disabled}
            data={prefecturesList}
            placeholder={PULL_DOWN_PLACEHOLDERS.PREFECTURE}
            className="w-45-percent"
            keyValue="id"
            nameValue="name"
            onChange={async (value) => {
              onChangeValue(
                contentIndex,
                content.type,
                value,
                pullDown.type,
                "prefecture"
              );
              if (value) {
                const selectedPrefecture = prefecturesList.find((item) => item.id === value);
                const prefectureJisCode = selectedPrefecture?.prefecture_jis_code;
                getCitiesByPrefecture(prefectureJisCode).then((res) => {
                  if (res.data.code !== 1) return;
                  setCityOptions(res.data.data);
                })
                .catch((error) => {
                  if (error.response?.data.code === 0) {
                    tokenExpired();
                  }
                });
              } else {
                onChangeValue(
                  contentIndex,
                  content.type,
                  null,
                  pullDown.type,
                  "city"
                );
                setCityOptions([]);
              }
            }}
            value={pullDown[pullDown.type].prefecture}
          />
          <span>~</span>
          <SelectCustom
            disabled={disabled}
            data={cityOptions}
            placeholder={PULL_DOWN_PLACEHOLDERS.CITY}
            className="w-45-percent"
            keyValue="city_name"
            nameValue="city_name"
            onChange={(value) =>
              onChangeValue(
                contentIndex,
                content.type,
                value,
                pullDown.type,
                "city"
              )
            }
            value={pullDown[pullDown.type].city}
          />
        </div>
        <div className="f-weight-400 f-size-12">
          {pullDown[pullDown.type].city_comment}
        </div>
      </div>
    );
  };

  const renderConsumeApiResponse = () => {
    throw new Error("Not implemented");
  };

  const renderErrorMessage = () => {
    const errorKey = `message${messageIndex}_content${contentIndex}_${content.type}_${pullDown.type}`;
    if (!errors?.[errorKey]) return null;

    return (
      <div className="validation-error-message">
        {errors?.[errorKey]}
        </div>
    );
  };

  return (
    <div className="m-b-10">
      {renderTitle()}
      {renderContent()}
      {renderErrorMessage()}
    </div>
  );
};

PullDown.propTypes = {
  content: PropTypes.object,
  errors: PropTypes.object,
  contentIndex: PropTypes.number,
  messageIndex: PropTypes.number,
  disabled: PropTypes.bool,
  onChangeValue: PropTypes.func,
  prefecturesList: PropTypes.array,
  lpOptionData: PropTypes.object,
  postMessageToParent: PropTypes.func,
  hidden: PropTypes.bool,
};

export default PullDown;
