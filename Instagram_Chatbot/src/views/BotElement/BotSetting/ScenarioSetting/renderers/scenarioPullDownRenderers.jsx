import React from 'react';
import { Tooltip } from '@mui/material';
import InputCustom from '../scenarioComon/InputCustom';
import CheckboxCustom from '../scenarioComon/CheckboxCustom';
import SelectCustom from '../scenarioComon/SelectCustom';
import { MESSAGE_CONTENT_TYPES } from '../../PreviewComponent/Constants';
import { renderFukushashikiSetting } from '../ScenarioUtils';

export const createRenderLPIntegrationOptionSetting = ({ onChangeValueMessageContent }) => ({ indexMessageSelect, indexContent, content, pullDown }) => {
  if (pullDown.type !== 'lp_integration_option') return null;
  return (
    <React.Fragment>
      <CheckboxCustom
        label="文言を右に表示する"
        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'with_suffix')}
        value={pullDown.with_suffix}
      />
      {
        pullDown.with_suffix && (
          <div className="ss-user-setting__item-bottom">
            <InputCustom
              placeholder="文言"
              onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'lp_integration_option_text')}
              value={pullDown.lp_integration_option_text}
            />
          </div>
        )
      }
      <CheckboxCustom
        label="空なオプション解除"
        onChange={value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'dont_display_empty_option')}
        value={pullDown.dont_display_empty_option}
      />
      {
        renderFukushashikiSetting({
          mode: pullDown.lp_element_search_mode,
          inputValue: pullDown.lp_element_search_value,
          onModeChange: value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'lp_element_search_mode'),
          onInputChange: value => onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'lp_element_search_value'),
        })
      }
    </React.Fragment>
  );
};

export const createRenderLPIntegrationOptionPreview = ({ dataPrefectures }) => (pullDown) => {
  if (pullDown.type !== 'lp_integration_option') return null;
  const selectWidth = pullDown.with_suffix ? '70%' : '100%';

  return (
    <React.Fragment>
      <SelectCustom
        data={dataPrefectures}
        placeholder="選択してください。"
        style={{ width: selectWidth }}
      />
      {
        pullDown.with_suffix && (
          <label style={{ width: '30%' }}>{pullDown.lp_integration_option_text}</label>
        )
      }
    </React.Fragment>
  );
};

export const createRenderTextInputPasswordConfirmationPreview = () => (textInput) => {
  if (textInput.type !== 'password_confirmation') return null;

  return (
    <React.Fragment>
      <input
        className="ss-message__content--user-text-input ss-input-value"
        readOnly
        disabled
        placeholder={textInput[textInput.type].password}
      ></input>
      <input
        className="ss-message__content--user-text-input ss-input-value"
        readOnly
        placeholder={textInput[textInput.type].confirm_password}
        disabled
      ></input>
    </React.Fragment>
  );
};

export const createRenderPreviewPulldownfromJs = () => (pullDown) => {
  if (pullDown.type !== MESSAGE_CONTENT_TYPES.PULLDOWN.FROM_JS) return null;

  return (
    <React.Fragment>
      <SelectCustom
        data={[]}
        placeholder="選択してください。"
        style={{ width: '100%' }}
      />
    </React.Fragment>
  );
};

export const createRenderDetailSettingPulldownFromJs = ({ onChangeValueMessageContent }) => ({ indexMessageSelect, indexContent, content, pullDown }) => {
  if (pullDown.type !== MESSAGE_CONTENT_TYPES.PULLDOWN.FROM_JS) return null;

  return (
    <React.Fragment>
      <div>
        <div
          className='ss-user-setting__item-bottom'
          style={{ width: '18%', fontSize: '14px', fontWeight: '400', marginBottom: '5px' }}
        >
          jscode
        </div>
        <div className='ss-user-setting__item-bottom'>
          <textarea
            style={{ width: '90%' }}
            className='ss-user-setting-item-textarea-label ss-input-value'
            placeholder='テキスト'
            rows='10'
            value={pullDown.from_js_result_code}
            onChange={(e) =>
              onChangeValueMessageContent(
                indexMessageSelect,
                indexContent,
                content.type,
                e.target.value,
                'from_js_result_code'
              )
            }
          />
        </div>
      </div>
      <div
        className='ss-user-setting__item-row'
        style={{ display: 'flex', gap: '10px', marginLeft: '35px', width: '90%' }}
      >
        <Tooltip title='複写先要素の取得方法をお選びください' placement='top'>
          <div style={{ width: '25%' }}>
            <SelectCustom
              id='title'
              style={{ width: '100%' }}
              value={pullDown.from_js_result_target_search_mode}
              onChange={(value) =>
                onChangeValueMessageContent(
                  indexMessageSelect,
                  indexContent,
                  content.type,
                  value,
                  'from_js_result_target_search_mode'
                )
              }
              data={[
                { key: 1, value: 'id' },
                { key: 2, value: 'css_selector' },
                { key: 3, value: 'xpath' },
              ]}
              keyValue='key'
              placeholder='複写先要素の取得方法をお選びください'
            />
          </div>
        </Tooltip>
        <Tooltip
          title={
            {
              1: '複写先要素のIDを入力ください',
              2: '複写先要素のcss_selectorを入力ください',
              3: '複写先要素のxPathを入力ください',
            }[pullDown[pullDown.type]?.from_js_result_target_search_mode] || ''
          }
          placement='top'
        >
          <div style={{ flex: '75%' }}>
            <InputCustom
              styleLabel={{ width: '100%' }}
              style={{ width: '100%' }}
              onChange={(value) =>
                onChangeValueMessageContent(
                  indexMessageSelect,
                  indexContent,
                  content.type,
                  value,
                  'from_js_result_target_search_value'
                )
              }
              value={pullDown.from_js_result_target_search_value}
              placeholder={
                {
                  1: '複写先要素のIDを入力ください',
                  2: '複写先要素のcss_selectorを入力ください',
                  3: '複写先要素のxPathを入力ください',
                }[pullDown[pullDown.type]?.from_js_result_target_search_mode] || ''
              }
            />
          </div>
        </Tooltip>
      </div>
    </React.Fragment>
  );
};
