import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import ThemePreviewShell from './ThemePreviewShell';

const PREVIEW_SCOPE_ID = 'theme-customize-preview';
const SAMPLE_ERROR_MESSAGE = '入力内容に誤りがあります。ご確認ください。';

const PreviewUserMessage = ({ children }) => (
  <div className="sp-body-user-side">
    <div className="sp-body-user-side-messages">
      <div className="ss-user-message__content-wrapper">
        {children}
      </div>
    </div>
  </div>
);

PreviewUserMessage.propTypes = {
  children: PropTypes.node.isRequired,
};

const ThemeCustomizePreview = ({
  themeSettings,
  mainColor,
  title,
  subtitle,
}) => (
  <ThemePreviewShell
    scopeId={PREVIEW_SCOPE_ID}
    themeSettings={themeSettings}
    mainColor={mainColor}
    title={title}
    subtitle={subtitle}
    processLabel="1 / 3"
    processPercent={33}
    errorPreviewText={SAMPLE_ERROR_MESSAGE}
  >
    <div className="sp-body-bot-side">
      <div className="sp-body-bot-side-messages">
        <div className="ss-bot-message">
          <div className="ss-bot-message__content-wrapper theme-customize-preview__bot-bubble">
            ボットからのメッセージです
          </div>
        </div>
      </div>
    </div>

    <PreviewUserMessage>
      ユーザーのメッセージです
    </PreviewUserMessage>

    <PreviewUserMessage>
      <div className="theme-customize-preview__field-group">
        <input
          type="text"
          readOnly
          placeholder="テキスト入力（非フォーカス）"
          className="theme-customize-preview__field"
        />
        <input
          type="text"
          readOnly
          placeholder="テキスト入力（フォーカス）"
          className="theme-customize-preview__field theme-preview--field-focus"
        />
      </div>
    </PreviewUserMessage>

    <PreviewUserMessage>
      <div className="theme-customize-preview__field-group">
        <select className="theme-customize-preview__field" defaultValue="">
          <option value="" disabled>プルダウン（非フォーカス）</option>
          <option value="1">選択肢 1</option>
        </select>
        <select
          className="theme-customize-preview__field theme-preview--field-focus"
          defaultValue="1"
        >
          <option value="1">プルダウン（フォーカス）</option>
        </select>
      </div>
    </PreviewUserMessage>

    <PreviewUserMessage>
      <div className="theme-customize-preview__checkbox-group">
        <Checkbox>未チェック</Checkbox>
        <Checkbox defaultChecked>チェック済み</Checkbox>
      </div>
    </PreviewUserMessage>

    <PreviewUserMessage>
      <div className="theme-customize-preview__radio-group ss-message__content--user-radio_button-wrapper">
        <div className="ss-message__content--user-radio_button theme-customize-preview__radio-default">
          <input type="radio" name="theme-preview-radio-default" id="theme-preview-radio-default-1" readOnly />
          <label htmlFor="theme-preview-radio-default-1">未選択</label>
        </div>
        <div className="ss-message__content--user-radio_button theme-customize-preview__radio-default theme-customize-preview__radio-default--selected ss-message__content--user-radio_button--selected">
          <input type="radio" name="theme-preview-radio-default" id="theme-preview-radio-default-2" defaultChecked readOnly />
          <label htmlFor="theme-preview-radio-default-2">選択済み</label>
        </div>
      </div>
    </PreviewUserMessage>

    <PreviewUserMessage>
      <div className="theme-customize-preview__radio-group ss-message__content--user-radio_button-wrapper">
        <div className="ss-message__content--user-radio_button-img-grid" style={{ gap: '5px', width: '100%' }}>
          <div
            className="ss-message__content--user-radio_button--radio_button_img theme-customize-preview__radio-img"
            style={{ flexBasis: '48%', maxWidth: '48%', width: '48%', padding: 0 }}
          >
            <input type="radio" className="ss-radio-button-img-input--hidden" name="theme-preview-radio-img" id="theme-preview-radio-img-1" readOnly tabIndex={-1} aria-hidden="true" />
            <div className="theme-customize-preview__radio-img-placeholder" />
          </div>
          <div
            className="ss-message__content--user-radio_button--radio_button_img theme-customize-preview__radio-img theme-customize-preview__radio-img--selected ss-message__content--user-radio_button--selected"
            style={{ flexBasis: '48%', maxWidth: '48%', width: '48%', padding: 0 }}
          >
            <input type="radio" className="ss-radio-button-img-input--hidden" name="theme-preview-radio-img" id="theme-preview-radio-img-2" defaultChecked readOnly tabIndex={-1} aria-hidden="true" />
            <div className="theme-customize-preview__radio-img-placeholder" />
          </div>
        </div>
      </div>
    </PreviewUserMessage>

    <PreviewUserMessage>
      <div className="theme-customize-preview__button-group">
        <button type="button" className="btn btn-new-bot">通常</button>
        <button type="button" className="btn btn-new-bot theme-preview--btn-pressed">押下</button>
        <button type="button" className="btn btn-new-bot" disabled>無効</button>
      </div>
    </PreviewUserMessage>
  </ThemePreviewShell>
);

ThemeCustomizePreview.propTypes = {
  themeSettings: PropTypes.object.isRequired,
  mainColor: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

ThemeCustomizePreview.defaultProps = {
  mainColor: '#327AED',
  title: '',
  subtitle: '',
};

export default ThemeCustomizePreview;
