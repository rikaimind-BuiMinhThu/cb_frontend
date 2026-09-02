import React from 'react';
import InputCustom from '../scenarioCommon/InputCustom';
import CheckboxCustom from '../scenarioCommon/CheckboxCustom';
import SelectCustom from '../scenarioCommon/SelectCustom';
import { MESSAGE_CONTENT_TYPES } from 'v2/views/BotElement/BotSetting/PreviewComponent/Constants';
import { renderFukushashikiSetting } from '../ScenarioUtils';
import {
  PULL_DOWN_LABELS,
  SETTING_LABELS,
  SETTING_PLACEHOLDERS,
} from '../constants/scenarioSettingLabels';

export const createRenderLPIntegrationOptionSetting = ({ onChangeValueMessageContent }) => {
  const renderLPIntegrationOptionSetting = ({ indexMessageSelect, indexContent, content, pullDown }) => {
    if (pullDown.type !== 'lp_integration_option') return null;
    return (
      <React.Fragment>
        <CheckboxCustom
          label={SETTING_LABELS.displayTextOnRight}
          onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'with_suffix')}
          value={pullDown.with_suffix}
        />
        {pullDown.with_suffix && (
          <div className="ss-user-setting__item-bottom">
            <InputCustom
              placeholder={SETTING_LABELS.suffixText}
              onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'lp_integration_option_text')}
              value={pullDown.lp_integration_option_text}
            />
          </div>
        )}
        <CheckboxCustom
          label={SETTING_LABELS.clearEmptyOption}
          onChange={(value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'dont_display_empty_option')}
          value={pullDown.dont_display_empty_option}
        />
        {renderFukushashikiSetting({
          mode: pullDown.lp_element_search_mode,
          inputValue: pullDown.lp_element_search_value,
          onModeChange: (value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'lp_element_search_mode'),
          onInputChange: (value) => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'lp_element_search_value'),
        })}
      </React.Fragment>
    );
  };
  return renderLPIntegrationOptionSetting;
};

export const createRenderLPIntegrationOptionPreview = ({ dataPrefectures }) => {
  const renderLPIntegrationOptionPreview = (pullDown) => {
    if (pullDown.type !== 'lp_integration_option') return null;

    return (
      <div className="ss-lp-integration-preview">
        <SelectCustom
          data={dataPrefectures}
          placeholder={PULL_DOWN_LABELS.selectPlaceholder}
          className={pullDown.with_suffix ? 'ss-select--70' : 'ss-select--full'}
        />
        {pullDown.with_suffix && (
          <label className="ss-lp-integration-preview__suffix">
            {pullDown.lp_integration_option_text}
          </label>
        )}
      </div>
    );
  };
  return renderLPIntegrationOptionPreview;
};

export const createRenderTextInputPasswordConfirmationPreview = () => {
  const renderTextInputPasswordConfirmationPreview = (textInput) => {
    if (textInput.type !== 'password_confirmation') return null;

    return (
      <React.Fragment>
        <input
          className="ss-message__content--user-text-input ss-input-value"
          readOnly
          disabled
          placeholder={textInput[textInput.type].password}
        />
        <input
          className="ss-message__content--user-text-input ss-input-value"
          readOnly
          placeholder={textInput[textInput.type].confirm_password}
          disabled
        />
      </React.Fragment>
    );
  };
  return renderTextInputPasswordConfirmationPreview;
};

export const createRenderPreviewPulldownfromJs = () => {
  const renderPreviewPulldownfromJs = (pullDown) => {
    if (pullDown.type !== MESSAGE_CONTENT_TYPES.PULLDOWN.FROM_JS) return null;

    return (
      <SelectCustom
        data={[]}
        placeholder={PULL_DOWN_LABELS.selectPlaceholder}
        className="ss-select--full"
      />
    );
  };
  return renderPreviewPulldownfromJs;
};

export const createRenderDetailSettingPulldownFromJs = ({ onChangeValueMessageContent }) => {
  const renderDetailSettingPulldownFromJs = ({ indexMessageSelect, indexContent, content, pullDown }) => {
    if (pullDown.type !== MESSAGE_CONTENT_TYPES.PULLDOWN.FROM_JS) return null;

    return (
      <React.Fragment>
        <div>
          <div className="ss-user-setting__item-bottom ss-field-label--section ss-renderer-pulldown-from-js__jscode-label">
            {SETTING_LABELS.jscode}
          </div>
          <div className="ss-user-setting__item-bottom">
            <textarea
              className="ss-user-setting-item-textarea-label ss-input-value ss-textarea--full"
              placeholder={SETTING_PLACEHOLDERS.textarea}
              rows="10"
              value={pullDown.from_js_result_code}
              onChange={(e) => onChangeValueMessageContent(
                indexMessageSelect,
                indexContent,
                content.type,
                e.target.value,
                'from_js_result_code',
              )}
            />
          </div>
        </div>
        {renderFukushashikiSetting({
          mode: pullDown.from_js_result_target_search_mode,
          inputValue: pullDown.from_js_result_target_search_value,
          onModeChange: (value) => onChangeValueMessageContent(
            indexMessageSelect,
            indexContent,
            content.type,
            value,
            'from_js_result_target_search_mode',
          ),
          onInputChange: (value) => onChangeValueMessageContent(
            indexMessageSelect,
            indexContent,
            content.type,
            value,
            'from_js_result_target_search_value',
          ),
          rowClassName: 'ss-renderer-pulldown-from-js__target-row',
        })}
      </React.Fragment>
    );
  };
  return renderDetailSettingPulldownFromJs;
};
