import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import { generateScopedThemeCss } from '../../../../../utils/chatbotThemeCss';

const PREVIEW_SCOPE_ID = 'theme-customize-preview';

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
}) => {
  const scopedCss = useMemo(
    () => generateScopedThemeCss(themeSettings, mainColor, null, `#${PREVIEW_SCOPE_ID}`),
    [themeSettings, mainColor],
  );

  const displayTitle = title || 'サンプルタイトル';
  const displaySubtitle = subtitle || 'サンプルサブタイトル';

  return (
    <div id={PREVIEW_SCOPE_ID} className="theme-customize-preview">
      <style>{scopedCss}</style>

      <div className="sp-header theme-customize-preview__header" style={{ backgroundColor: mainColor }}>
        <div className="sp-header-left">
          <div className="sp-header-left-label">
            <div className="sp-header-left-label-sub-title">{displaySubtitle}</div>
            <div className="sp-header-left-label-title">{displayTitle}</div>
          </div>
        </div>
      </div>

      <div className="sp-process-bar">
        <div
          className="sp-process-bar-color"
          style={{ width: '33%', backgroundColor: mainColor }}
        >
          1 / 3
        </div>
      </div>

      <div className="sp-body theme-customize-preview__body">
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
          <div className="theme-customize-preview__button-group">
            <button type="button" className="btn btn-new-bot">通常</button>
            <button type="button" className="btn btn-new-bot theme-preview--btn-pressed">押下</button>
            <button type="button" className="btn btn-new-bot" disabled>無効</button>
          </div>
        </PreviewUserMessage>
      </div>
    </div>
  );
};

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
