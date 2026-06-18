import React from 'react';
import { BOT_MESSAGE_TYPES, COMBINE_CONTENT_ROLES } from '../../../PreviewComponent/Constants';
import { DEFAULT_AMAZON_PAY_BUTTON_IMAGE_URL } from '../../../../../../variables/amazonPayConstants';
import { PREVIEW_MAP } from '../../contentPreviews';
import { getBotFileExtension } from '../../utils/getBotMessageTitle';
import { getCombineContentTypeLabel } from '../../utils/combineContentDefaults';

const renderBotBlockPreview = (content, index, hidden) => {
  const fileType = getBotFileExtension(content);
  const opacityStyle = hidden ? { opacity: '0.4' } : {};
  const textContent = content[content.type]?.content;

  if (content.type === 'text_input' || content.type === 'getting_error_notification') {
    if (!textContent || !textContent.trim()) {
      return (
        <div className="ss-combine-block-preview ss-combine-block-preview--bot ss-combine-block-preview--bot-empty" style={opacityStyle}>
          （テキスト未入力）
        </div>
      );
    }
    return (
      <div
        className={`ss-combine-block-preview ss-combine-block-preview--bot ss-bot-chat-overview-${index}`}
        style={opacityStyle}
        dangerouslySetInnerHTML={{ __html: textContent }}
      />
    );
  }

  if (content.type === 'file') {
    const fileContent = content.file?.content;
    if (!fileContent) {
      return (
        <div className="ss-combine-block-preview ss-combine-block-preview--bot ss-combine-block-preview--bot-empty" style={opacityStyle}>
          （ファイル未設定）
        </div>
      );
    }
    if (fileType === 'mp4') {
      return (
        <div className="ss-combine-block-preview ss-combine-block-preview--bot" style={opacityStyle}>
          <video src={fileContent} controls style={{ width: '100%' }} />
        </div>
      );
    }
    if (['jpeg', 'png', 'jpg'].includes(fileType)) {
      return (
        <img
          className="ss-combine-block-preview ss-combine-block-preview--bot"
          src={fileContent}
          alt=""
          style={{ width: '100%', ...opacityStyle }}
        />
      );
    }
    return (
      <div className="ss-combine-block-preview ss-combine-block-preview--bot" style={opacityStyle}>
        {fileContent}
      </div>
    );
  }

  if (content.type === BOT_MESSAGE_TYPES.HTML_CODE || content.type === BOT_MESSAGE_TYPES.UGC) {
    const htmlContent = content[content.type]?.content;
    if (!htmlContent || !htmlContent.trim()) {
      return (
        <div className="ss-combine-block-preview ss-combine-block-preview--bot ss-combine-block-preview--bot-empty" style={opacityStyle}>
          （HTML未入力）
        </div>
      );
    }
    return (
      <div className="ss-combine-block-preview ss-combine-block-preview--bot" style={opacityStyle}>
        {htmlContent}
      </div>
    );
  }

  if (content.type === BOT_MESSAGE_TYPES.AMAZON_PAY_BUTTON) {
    return (
      <div className="ss-combine-block-preview ss-combine-block-preview--bot" style={opacityStyle}>
        {content.amazon_pay_button?.text_above && (
          <div style={{ whiteSpace: 'pre-line', marginBottom: '6px' }}>
            {content.amazon_pay_button.text_above}
          </div>
        )}
        <img
          src={content.amazon_pay_button?.button_image_url || DEFAULT_AMAZON_PAY_BUTTON_IMAGE_URL}
          alt="Amazon Pay"
          style={{ width: content.amazon_pay_button?.button_image_width || '80%', maxWidth: '100%' }}
        />
      </div>
    );
  }

  return (
    <div className="ss-combine-block-preview ss-combine-block-preview--bot ss-combine-block-preview--bot-empty" style={opacityStyle}>
      （コンテンツ未設定）
    </div>
  );
};

const CombineOverviewBlockPreview = ({
  content,
  message,
  indexMessage,
  indexContent,
  hidden,
}) => {
  const typeLabel = getCombineContentTypeLabel(content.role, content.type);
  const isBot = content.role === COMBINE_CONTENT_ROLES.BOT;

  return (
    <div className="ss-combine-overview-block">
      <div className="ss-combine-overview-block__header">
        <span className={`ss-combine-block-setting__role-badge ss-combine-block-setting__role-badge--${content.role}`}>
          {isBot ? 'Bot' : 'User'}
        </span>
        <span className="ss-combine-block-header__type-label">{typeLabel}</span>
      </div>
      <div className="ss-combine-overview-block__body">
        {isBot ? (
          renderBotBlockPreview(content, indexMessage, hidden)
        ) : (
          PREVIEW_MAP[content.type] ? React.createElement(PREVIEW_MAP[content.type], {
            content,
            message,
            indexMessage,
            indexContent,
          }) : null
        )}
      </div>
    </div>
  );
};

export default CombineOverviewBlockPreview;
