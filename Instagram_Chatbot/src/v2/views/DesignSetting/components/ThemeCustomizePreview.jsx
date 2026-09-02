import React from 'react';
import PropTypes from 'prop-types';
import 'v2/assets/css/bot/preview-chat-bot.css';
import { normalizeMessageBorderStyle } from 'v2/views/DesignSetting/utils/designThemeUtils';
import UserMessageTailIcon from 'v2/views/BotElement/BotSetting/PreviewComponent/UserMessageTailIcon';
import ThemePreviewShell from './ThemePreviewShell';
import ThemeModalPreviewOverlay from './ThemeModalPreviewOverlay';
import PreviewRegion from './PreviewRegion';
import {
  PREVIEW_BOT_MESSAGE,
  PREVIEW_BUTTON_DISABLED,
  PREVIEW_BUTTON_NORMAL,
  PREVIEW_BUTTON_PRESSED,
  PREVIEW_CHECKBOX_CHECKED,
  PREVIEW_CHECKBOX_UNCHECKED,
  PREVIEW_FIELD_TITLE,
  PREVIEW_INPUT_BLUR_PLACEHOLDER,
  PREVIEW_INPUT_FOCUS_PLACEHOLDER,
  PREVIEW_INPUT_PLACEHOLDER,
  PREVIEW_LABEL_TEXT,
  PREVIEW_OPTION_ONE,
  PREVIEW_OPTION_VALUE,
  PREVIEW_PROCESS_PERCENT,
  PREVIEW_PULLDOWN_BLUR,
  PREVIEW_PULLDOWN_FOCUS,
  PREVIEW_RADIO_SELECTED,
  PREVIEW_RADIO_UNSELECTED,
  PREVIEW_REQUIRED_FIELD,
  PREVIEW_REQUIRED_MARK,
  PREVIEW_SAMPLE_ERROR,
  PREVIEW_USER_MESSAGE,
  PREVIEW_VALIDATION_MESSAGE,
  THEME_PREVIEW_PROCESS_LABEL,
} from '../constants/designChatbotConstants';

const PREVIEW_SCOPE_ID = 'theme-customize-preview';

const BOT_MESSAGE_TAIL_PATH = 'M0 0 C7.59 0 15.18 0 23 0 C23.18 6.32 23.34 12.63 23.44 18.95 C23.48 21.1 23.53 23.25 23.6 25.4 C23.7 28.49 23.75 31.58 23.78 34.67 C23.82 35.63 23.86 36.58 23.91 37.57 C23.91 40.27 23.83 42.43 23 45 C20.61 47.35 18.05 48.68 15 50 C13.61 50.67 13.61 50.67 12.19 51.36 C3.42 54.53 -4.81 54.39 -14 54 C-14 53.34 -14 52.68 -14 52 C-13.31 51.7 -12.63 51.39 -11.92 51.08 C-11.02 50.66 -10.12 50.24 -9.19 49.81 C-8.29 49.41 -7.4 49 -6.48 48.58 C-3.39 46.61 -2.53 45.34 -1 42 C-0.54 38.78 -0.51 35.58 -0.49 32.32 C-0.47 31.4 -0.45 30.47 -0.43 29.52 C-0.38 26.58 -0.35 23.63 -0.31 20.69 C-0.28 18.69 -0.24 16.69 -0.21 14.69 C-0.12 9.79 -0.06 4.9 0 0 Z ';

const PreviewBotMessageBubble = ({ themeSettings, children }) => {
  const botMessageBgColor = themeSettings?.botMessageBgColor || '#3CACEF';
  const showTail = normalizeMessageBorderStyle(
    themeSettings?.botMessageBorderStyle,
    'with_tail',
  ) === 'with_tail';

  return (
    <div className="theme-customize-preview__bot-bubble-wrap position-relative">
      <div className="ss-bot-message__content-wrapper theme-customize-preview__bot-bubble">
        {children}
      </div>
      {showTail ? (
        <div className="theme-customize-preview__bot-bubble-tail ss-bot-chat-text-input-bot-icon position-absolute">
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="12" height="18" viewBox="0 0 37 54">
            <path
              d={BOT_MESSAGE_TAIL_PATH}
              fill={botMessageBgColor}
              transform="translate(14,0)"
            />
          </svg>
        </div>
      ) : null}
    </div>
  );
};

PreviewBotMessageBubble.propTypes = {
  themeSettings: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

const PreviewUserMessage = ({
  children,
  sectionId,
  activeSectionId,
  onSectionSelect,
  className,
  themeSettings,
}) => {
  const userMessageBgColor = themeSettings?.userMessageBgColor || '#ffffff';
  const showTail = normalizeMessageBorderStyle(
    themeSettings?.userMessageBorderStyle,
    'no_tail',
  ) === 'with_tail';

  return (
    <div className="sp-body-user-side">
      <div className="sp-body-user-side-messages position-relative">
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
        <UserMessageTailIcon
          fillColor={userMessageBgColor}
          showTail={showTail}
          className="theme-customize-preview__user-bubble-tail"
        />
      </div>
    </div>
  );
};

PreviewUserMessage.propTypes = {
  children: PropTypes.node.isRequired,
  sectionId: PropTypes.string.isRequired,
  activeSectionId: PropTypes.string,
  onSectionSelect: PropTypes.func,
  className: PropTypes.string,
  themeSettings: PropTypes.object,
};

PreviewUserMessage.defaultProps = {
  activeSectionId: '',
  onSectionSelect: null,
  className: '',
  themeSettings: null,
};

const ThemeCustomizePreview = ({
  themeSettings,
  mainColor,
  title,
  subtitle,
  activeSectionId,
  onSectionSelect,
  showModalPreview,
}) => (
  <ThemePreviewShell
    scopeId={PREVIEW_SCOPE_ID}
    themeSettings={themeSettings}
    mainColor={mainColor}
    title={title}
    subtitle={subtitle}
    processLabel={THEME_PREVIEW_PROCESS_LABEL}
    processPercent={PREVIEW_PROCESS_PERCENT}
    errorPreviewText={PREVIEW_SAMPLE_ERROR}
    activeSectionId={activeSectionId}
    onSectionSelect={onSectionSelect}
    modalOverlay={showModalPreview ? (
      <ThemeModalPreviewOverlay
        activeSectionId={activeSectionId}
        onSectionSelect={onSectionSelect}
      />
    ) : null}
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
            <PreviewBotMessageBubble themeSettings={themeSettings}>
              {PREVIEW_BOT_MESSAGE}
            </PreviewBotMessageBubble>
          </div>
        </PreviewRegion>
      </div>
    </div>

    <PreviewUserMessage
      sectionId="messages"
      activeSectionId={activeSectionId}
      onSectionSelect={onSectionSelect}
      className="theme-preview-region--user-message"
      themeSettings={themeSettings}
    >
      {PREVIEW_USER_MESSAGE}
    </PreviewUserMessage>

    <PreviewUserMessage
      sectionId="messages"
      activeSectionId={activeSectionId}
      onSectionSelect={onSectionSelect}
      themeSettings={themeSettings}
    >
      <div className="ss-message__content--user-label-top">
        <span className="ss-message__content--user-label-title">{PREVIEW_LABEL_TEXT}</span>
      </div>
    </PreviewUserMessage>

    <PreviewUserMessage
      sectionId="fields"
      activeSectionId={activeSectionId}
      onSectionSelect={onSectionSelect}
      themeSettings={themeSettings}
    >
      <div className="ss-message__content--user-text-input-top">
        <span className="ss-message__content--user-text-input-title">{PREVIEW_FIELD_TITLE}</span>
      </div>
      <div className="theme-customize-preview__field-group">
        <input
          type="text"
          readOnly
          placeholder={PREVIEW_INPUT_BLUR_PLACEHOLDER}
          className="theme-customize-preview__field ss-input-value"
        />
        <input
          type="text"
          readOnly
          placeholder={PREVIEW_INPUT_FOCUS_PLACEHOLDER}
          className="theme-customize-preview__field ss-input-value theme-preview--field-focus"
        />
      </div>
    </PreviewUserMessage>

    <PreviewUserMessage
      sectionId="validation"
      activeSectionId={activeSectionId}
      onSectionSelect={onSectionSelect}
      themeSettings={themeSettings}
    >
      <div className="ss-message__content--user-text-input-top">
        <span className="ss-message__content--user-text-input-title">{PREVIEW_REQUIRED_FIELD}</span>
        <span className="ss-message__content--user-text-input-required">{PREVIEW_REQUIRED_MARK}</span>
      </div>
      <div className="theme-customize-preview__field-group">
        <input
          type="text"
          readOnly
          placeholder={PREVIEW_INPUT_PLACEHOLDER}
          className="theme-customize-preview__field ss-input-value"
        />
      </div>
      <div className="validation-error-message">{PREVIEW_VALIDATION_MESSAGE}</div>
    </PreviewUserMessage>

    <PreviewUserMessage
      sectionId="fields"
      activeSectionId={activeSectionId}
      onSectionSelect={onSectionSelect}
      themeSettings={themeSettings}
    >
      <div className="theme-customize-preview__field-group">
        <select className="theme-customize-preview__field ss-input-value" defaultValue="">
          <option value="" disabled>{PREVIEW_PULLDOWN_BLUR}</option>
          <option value={PREVIEW_OPTION_VALUE}>{PREVIEW_OPTION_ONE}</option>
        </select>
        <select
          className="theme-customize-preview__field ss-input-value theme-preview--field-focus"
          defaultValue={PREVIEW_OPTION_VALUE}
        >
          <option value={PREVIEW_OPTION_VALUE}>{PREVIEW_PULLDOWN_FOCUS}</option>
        </select>
      </div>
    </PreviewUserMessage>

    <PreviewUserMessage
      sectionId="checkbox"
      activeSectionId={activeSectionId}
      onSectionSelect={onSectionSelect}
      themeSettings={themeSettings}
    >
      <div className="theme-customize-preview__checkbox-group ss-message__content--user-checkbox-wrapper">
        <div className="ss-message__content--user-checkbox theme-customize-preview__checkbox-option">
          <input
            type="checkbox"
            readOnly
            id="theme-preview-checkbox-unchecked"
          />
          <label htmlFor="theme-preview-checkbox-unchecked">{PREVIEW_CHECKBOX_UNCHECKED}</label>
        </div>
        <div className="ss-message__content--user-checkbox ss-message__content--user-checkbox--selected theme-customize-preview__checkbox-option">
          <input
            type="checkbox"
            defaultChecked
            readOnly
            id="theme-preview-checkbox-checked"
          />
          <label htmlFor="theme-preview-checkbox-checked">{PREVIEW_CHECKBOX_CHECKED}</label>
        </div>
      </div>
    </PreviewUserMessage>

    <PreviewUserMessage
      sectionId="radio"
      activeSectionId={activeSectionId}
      onSectionSelect={onSectionSelect}
      themeSettings={themeSettings}
    >
      <div className="theme-customize-preview__radio-group ss-message__content--user-radio_button-wrapper">
        <div className="ss-message__content--user-radio_button theme-customize-preview__radio-default">
          <input type="radio" name="theme-preview-radio-default" id="theme-preview-radio-default-1" readOnly />
          <label htmlFor="theme-preview-radio-default-1">{PREVIEW_RADIO_UNSELECTED}</label>
        </div>
        <div className="ss-message__content--user-radio_button theme-customize-preview__radio-default theme-customize-preview__radio-default--selected ss-message__content--user-radio_button--selected">
          <input type="radio" name="theme-preview-radio-default" id="theme-preview-radio-default-2" defaultChecked readOnly />
          <label htmlFor="theme-preview-radio-default-2">{PREVIEW_RADIO_SELECTED}</label>
        </div>
      </div>
    </PreviewUserMessage>

    <PreviewUserMessage
      sectionId="radio"
      activeSectionId={activeSectionId}
      onSectionSelect={onSectionSelect}
      themeSettings={themeSettings}
    >
      <div className="theme-customize-preview__radio-group ss-message__content--user-radio_button-wrapper">
        <div className="ss-message__content--user-radio_button-img-grid">
          <div
            className="ss-message__content--user-radio_button--radio_button_img theme-customize-preview__radio-img"
          >
            <input type="radio" className="ss-radio-button-img-input--hidden" name="theme-preview-radio-img" id="theme-preview-radio-img-1" readOnly tabIndex={-1} aria-hidden="true" />
            <div className="theme-customize-preview__radio-img-placeholder" />
          </div>
          <div
            className="ss-message__content--user-radio_button--radio_button_img theme-customize-preview__radio-img theme-customize-preview__radio-img--selected ss-message__content--user-radio_button--selected"
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
      themeSettings={themeSettings}
    >
      <div className="theme-customize-preview__button-group">
        <button type="button" className="btn btn-new-bot">{PREVIEW_BUTTON_NORMAL}</button>
        <button type="button" className="btn btn-new-bot theme-preview--btn-pressed">{PREVIEW_BUTTON_PRESSED}</button>
        <button type="button" className="btn btn-new-bot" disabled>{PREVIEW_BUTTON_DISABLED}</button>
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
  showModalPreview: PropTypes.bool,
};

ThemeCustomizePreview.defaultProps = {
  mainColor: '#327AED',
  title: '',
  subtitle: '',
  activeSectionId: '',
  onSectionSelect: null,
  showModalPreview: true,
};

export default ThemeCustomizePreview;
