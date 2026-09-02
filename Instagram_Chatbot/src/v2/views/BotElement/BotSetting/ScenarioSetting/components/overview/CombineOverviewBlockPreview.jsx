import React from 'react';
import { BOT_MESSAGE_TYPES, COMBINE_CONTENT_ROLES } from '../../../PreviewComponent/Constants';
import { DEFAULT_AMAZON_PAY_BUTTON_IMAGE_URL } from '../../../../../../variables/amazonPayConstants';
import { PREVIEW_MAP } from '../../contentPreviews';
import { getBotFileExtension } from 'v2/views/BotElement/BotSetting/ScenarioSetting/utils/getBotMessageTitle';
import { getCombineContentTypeLabel } from 'v2/views/BotElement/BotSetting/ScenarioSetting/utils/combineContentDefaults';
import { buildOrderConfirmPreviewHtml } from 'v2/views/BotElement/BotSetting/ScenarioSetting/utils/OrderConfirmLpScriptGenerator';
import { buildCartLoginStyle, normalizeCartLoginConfig } from 'v2/views/BotElement/BotSetting/ScenarioSetting/utils/cartLoginUtils';

const renderBotBlockPreview = (content, index, hidden) => {
  const fileType = getBotFileExtension(content);
  const hiddenClass = hidden ? ' ss-message-hidden-style' : '';
  const textContent = content[content.type]?.content;

  if (content.type === 'text_input' || content.type === 'getting_error_notification') {
    if (!textContent || !textContent.trim()) {
      return (
        <div className={`ss-combine-block-preview ss-combine-block-preview--bot ss-combine-block-preview--bot-empty${hiddenClass}`}>
          （テキスト未入力）
        </div>
      );
    }
    return (
      <div
        className={`ss-combine-block-preview ss-combine-block-preview--bot ss-bot-chat-overview-${index}${hiddenClass}`}
        dangerouslySetInnerHTML={{ __html: textContent }}
      />
    );
  }

  if (content.type === 'file') {
    const fileContent = content.file?.content;
    if (!fileContent) {
      return (
        <div className={`ss-combine-block-preview ss-combine-block-preview--bot ss-combine-block-preview--bot-empty${hiddenClass}`}>
          （ファイル未設定）
        </div>
      );
    }
    if (fileType === 'mp4') {
      return (
        <div className={`ss-combine-block-preview ss-combine-block-preview--bot${hiddenClass}`}>
          <video src={fileContent} controls className="ss-media--full" />
        </div>
      );
    }
    if (['jpeg', 'png', 'jpg'].includes(fileType)) {
      return (
        <img
          className={`ss-combine-block-preview ss-combine-block-preview--bot${hiddenClass}`}
          src={fileContent}
          alt=""
        />
      );
    }
    return (
      <div className={`ss-combine-block-preview ss-combine-block-preview--bot${hiddenClass}`}>
        {fileContent}
      </div>
    );
  }

  if (content.type === BOT_MESSAGE_TYPES.HTML_CODE || content.type === BOT_MESSAGE_TYPES.UGC) {
    const htmlContent = content[content.type]?.content;
    if (!htmlContent || !htmlContent.trim()) {
      return (
        <div className={`ss-combine-block-preview ss-combine-block-preview--bot ss-combine-block-preview--bot-empty${hiddenClass}`}>
          （HTML未入力）
        </div>
      );
    }
    return (
      <div className={`ss-combine-block-preview ss-combine-block-preview--bot${hiddenClass}`}>
        {htmlContent}
      </div>
    );
  }

  if (content.type === BOT_MESSAGE_TYPES.AMAZON_PAY_BUTTON) {
    return (
      <div className={`ss-combine-block-preview ss-combine-block-preview--bot${hiddenClass}`}>
        {content.amazon_pay_button?.text_above && (
          <div className="ss-pre-line-above">
            {content.amazon_pay_button.text_above}
          </div>
        )}
        <img
          src={content.amazon_pay_button?.button_image_url || DEFAULT_AMAZON_PAY_BUTTON_IMAGE_URL}
          alt="Amazon Pay"
          className="ss-amazon-pay-button-img"
          style={{ '--ss-amazon-pay-btn-width': content.amazon_pay_button?.button_image_width || '80%' }}
        />
      </div>
    );
  }

  if (content.type === BOT_MESSAGE_TYPES.ORDER_CONFIRM) {
    return (
      <div
        className={`ss-combine-block-preview ss-combine-block-preview--bot${hiddenClass}`}
        dangerouslySetInnerHTML={{
          __html: buildOrderConfirmPreviewHtml(content.order_confirm),
        }}
      />
    );
  }

  if (content.type === BOT_MESSAGE_TYPES.CART_LOGIN) {
    const cartLoginConfig = normalizeCartLoginConfig(content.cart_login);
    const cartLoginStyle = buildCartLoginStyle(cartLoginConfig);
    return (
      <div className={`ss-combine-block-preview ss-combine-block-preview--bot${hiddenClass}`}>
        {cartLoginConfig.display_type === 'link' ? (
          <span style={cartLoginStyle}>{cartLoginConfig.text}</span>
        ) : (
          <button type="button" style={cartLoginStyle}>
            {cartLoginConfig.text}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`ss-combine-block-preview ss-combine-block-preview--bot ss-combine-block-preview--bot-empty${hiddenClass}`}>
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
          {isBot ? 'ボット' : 'ユーザー'}
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
