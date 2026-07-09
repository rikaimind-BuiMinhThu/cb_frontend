import React from 'react';
import PropTypes from 'prop-types';
import ThemePreviewShell from './ThemePreviewShell';
import PreviewRegion from './PreviewRegion';

const PREVIEW_SCOPE_ID = 'theme-customize-preview';
const SAMPLE_ERROR_MESSAGE = '入力内容に誤りがあります。ご確認ください。';

const PreviewUserMessage = ({ children, sectionId, activeSectionId, onSectionSelect, className }) => (
  <div className="sp-body-user-side">
    <div className="sp-body-user-side-messages">
      <div className="ss-user-message__content-wrapper">
        <PreviewRegion
          sectionId={sectionId}
          activeSectionId={activeSectionId}
          onSectionSelect={onSectionSelect}
          className={className}
        >
          {children}
        </PreviewRegion>
      </div>
    </div>
  </div>
);

PreviewUserMessage.propTypes = {
  children: PropTypes.node.isRequired,
  sectionId: PropTypes.string.isRequired,
  activeSectionId: PropTypes.string,
  onSectionSelect: PropTypes.func,
  className: PropTypes.string,
};

PreviewUserMessage.defaultProps = {
  activeSectionId: '',
  onSectionSelect: null,
  className: '',
};

const ThemeCustomizePreview = ({
  themeSettings,
  mainColor,
  title,
  subtitle,
  activeSectionId,
  onSectionSelect,
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
    activeSectionId={activeSectionId}
    onSectionSelect={onSectionSelect}
  >
    <div className="sp-body-bot-side">
      <div className="sp-body-bot-side-messages">
        <PreviewRegion
          sectionId="messages"
          activeSectionId={activeSectionId}
          onSectionSelect={onSectionSelect}
          className="theme-preview-region--bot-message"
        >
          <div className="ss-bot-message">
            <div className="ss-bot-message__content-wrapper theme-customize-preview__bot-bubble">
              ボットからのメッセージです
            </div>
          </div>
        </PreviewRegion>
      </div>
    </div>

    <PreviewUserMessage
      sectionId="messages"
      activeSectionId={activeSectionId}
      onSectionSelect={onSectionSelect}
      className="theme-preview-region--user-message"
    >
      ユーザーのメッセージです
    </PreviewUserMessage>

    <PreviewUserMessage
      sectionId="messages"
      activeSectionId={activeSectionId}
      onSectionSelect={onSectionSelect}
    >
      <div className="ss-message__content--user-label-top">
        <span className="ss-message__content--user-label-title">ラベルテキスト</span>
      </div>
    </PreviewUserMessage>

    <PreviewUserMessage
      sectionId="fields"
      activeSectionId={activeSectionId}
      onSectionSelect={onSectionSelect}
    >
      <div className="ss-message__content--user-text-input-top">
        <span className="ss-message__content--user-text-input-title">フィールドタイトル</span>
      </div>
      <div className="theme-customize-preview__field-group">
        <input
          type="text"
          readOnly
          placeholder="テキスト入力（非フォーカス）"
          className="theme-customize-preview__field ss-input-value"
        />
        <input
          type="text"
          readOnly
          placeholder="テキスト入力（フォーカス）"
          className="theme-customize-preview__field ss-input-value theme-preview--field-focus"
        />
      </div>
    </PreviewUserMessage>

    <PreviewUserMessage
      sectionId="fields"
      activeSectionId={activeSectionId}
      onSectionSelect={onSectionSelect}
    >
      <div className="theme-customize-preview__field-group">
        <select className="theme-customize-preview__field ss-input-value" defaultValue="">
          <option value="" disabled>プルダウン（非フォーカス）</option>
          <option value="1">選択肢 1</option>
        </select>
        <select
          className="theme-customize-preview__field ss-input-value theme-preview--field-focus"
          defaultValue="1"
        >
          <option value="1">プルダウン（フォーカス）</option>
        </select>
      </div>
    </PreviewUserMessage>

    <PreviewUserMessage
      sectionId="checkbox"
      activeSectionId={activeSectionId}
      onSectionSelect={onSectionSelect}
    >
      <div className="theme-customize-preview__checkbox-group ss-message__content--user-checkbox-wrapper">
        <div className="ss-message__content--user-checkbox theme-customize-preview__checkbox-option">
          <input
            type="checkbox"
            readOnly
            id="theme-preview-checkbox-unchecked"
          />
          <label htmlFor="theme-preview-checkbox-unchecked">未チェック</label>
        </div>
        <div className="ss-message__content--user-checkbox ss-message__content--user-checkbox--selected theme-customize-preview__checkbox-option">
          <input
            type="checkbox"
            defaultChecked
            readOnly
            id="theme-preview-checkbox-checked"
          />
          <label htmlFor="theme-preview-checkbox-checked">チェック済み</label>
        </div>
      </div>
    </PreviewUserMessage>

    <PreviewUserMessage
      sectionId="radio"
      activeSectionId={activeSectionId}
      onSectionSelect={onSectionSelect}
    >
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

    <PreviewUserMessage
      sectionId="radio"
      activeSectionId={activeSectionId}
      onSectionSelect={onSectionSelect}
    >
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

    <PreviewUserMessage
      sectionId="buttons"
      activeSectionId={activeSectionId}
      onSectionSelect={onSectionSelect}
    >
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
  activeSectionId: PropTypes.string,
  onSectionSelect: PropTypes.func,
};

ThemeCustomizePreview.defaultProps = {
  mainColor: '#327AED',
  title: '',
  subtitle: '',
  activeSectionId: '',
  onSectionSelect: null,
};

export default ThemeCustomizePreview;
