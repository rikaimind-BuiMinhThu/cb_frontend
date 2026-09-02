import React from 'react';
import icon from 'v2/assets/img/bot-icon/man1_new.png';
import { Draggable } from 'react-beautiful-dnd';
import { BOT_MESSAGE_TYPES } from '../../../PreviewComponent/Constants';
import { DEFAULT_AMAZON_PAY_BUTTON_IMAGE_URL } from '../../../../../../variables/amazonPayConstants';
import { buildOrderConfirmPreviewHtml } from 'v2/views/BotElement/BotSetting/ScenarioSetting/utils/OrderConfirmLpScriptGenerator';
import { buildCartLoginStyle, normalizeCartLoginConfig } from 'v2/views/BotElement/BotSetting/ScenarioSetting/utils/cartLoginUtils';

import OverviewMessageActions from './OverviewMessageActions';
import OverviewAddStatementMenu from './OverviewAddStatementMenu';

const OverviewBotMessageItem = ({
  message, index, content, fileType, titleMessage, bindings,
}) => {
  const {
    botTextValue, handleSelectMessage, handleEditIconClick, handleCopyMessage,
    handleHiddenMessage, handleDeleteMessage, onClickCreateStatement,
  } = bindings;
  const type = fileType;
  const hiddenClass = message.hidden === true ? ' ss-message-hidden-style' : '';

  return (
<Draggable key={message.id} draggableId={message.id?.toString()} index={index}>
  {(provided) => (
    <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} id={`message_${index}`} key={index} className="ss-bot-chat-wrapper ss-message-wrapper">
      <div
        className={`ss-bot-chat ss-message ss-message-${index}`}
      >
        <div
          className="ss-bot-chat-detail ss-message__detail"
          onClick={() =>
            handleSelectMessage(index, message.belong_to, content?.type)
          }
        >
          <img className="ss-bot-ava" src={icon} alt="" />
          {content ?
            <React.Fragment>
              <div className="ss-overview-message-body">
                <div className="ss-overview-message-titles">
                  {content.type !== 'text_input' && <div className="ss-sub-title-message">
                    {titleMessage}
                  </div>}
                  {message.message_name && <div className="ss-sub-title-message ss-truncation-text ss-overview-message-name">{message.message_name}</div>}
                </div>
                {/* bot: type == 'text_input' */}
                {/* bot: type == 'getting_error_notification' */}
                {(content.type === 'text_input' || content.type === 'getting_error_notification') && (
                  // <textarea
                  //   className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value${hiddenClass}`}
                  //   value={content[content.type]?.content || ''}
                  //   style={message.hidden === true ? { opacity: '0.4' } : {}}
                  //   readOnly
                  // ></textarea>
                  <div
                    className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value${hiddenClass}`}
                    contentEditable={false}
                    suppressContentEditableWarning={true}
                    dangerouslySetInnerHTML={{ __html: content[content.type]?.content }}
                    onClick={(event) => {
                      if ((event.target.tagName.toLowerCase() === 'a') || (event.target.tagName.toLowerCase() === 'img')) {
                        event.preventDefault(); // Ngăn chặn hành động mặc định của trình duyệt
                        // Thực hiện hành động khác ở đây, ví dụ như mở một cửa sổ popup
                      }
                    }}
                  />
                )}
                {/* bot: type == 'file' */}
                {content.type === 'file' && (
                  content[content.type]?.content ? (
                    <React.Fragment>
                      {/* {(type === 'mp4') && */}
                      <div id='check-append-vid' className={`ss-bot-chat-detail-content ss-message__content ss-message__content--bot-file-video${type !== 'mp4' ? ' ss-display-none' : ''}`}>
                        <video
                          // id="preview-video"
                          src={content[content.type]?.content}
                          controls
                        ></video>
                      </div>
                      {/* } */}
                      {(type === 'jpeg' || type === 'png' || type === 'jpg') &&
                        <img
                          className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-overview-file-thumb${hiddenClass}`}
                          src={content[content.type]?.content}
                          alt=""
                        />
                      }
                      {(type === 'pdf') &&
                        <textarea
                          className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value${hiddenClass}`}
                          value={content[content.type]?.content}
                          readOnly
                        ></textarea>
                      }
                    </React.Fragment>
                  ) :
                    <textarea
                      className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value${hiddenClass}`}
                      value={''}
                      readOnly
                    ></textarea>
                )}

                {/* bot: type == 'email' */}
                {content.type === 'email' && (
                  <textarea
                    className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value${hiddenClass}`}
                    value={content[content.type]?.content || ''}
                    readOnly
                  ></textarea>
                )}

                {/* bot: type == 'order_confirm' */}
                {content.type === BOT_MESSAGE_TYPES.ORDER_CONFIRM && (
                  <div
                    className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value${hiddenClass}`}
                    dangerouslySetInnerHTML={{
                      __html: buildOrderConfirmPreviewHtml(content.order_confirm),
                    }}
                  />
                )}

                {/* bot: type == 'api_linkage' || 'pause' */}
                {(content.type === 'api_linkage' || content.type === 'pause') && (
                  <textarea
                    className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value${hiddenClass}`}
                    value={''}
                    readOnly
                  ></textarea>
                )}
                {/* bot: type == 'amazon_pay_button' */}
                {content.type === BOT_MESSAGE_TYPES.AMAZON_PAY_BUTTON && (
                  <div
                    className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value${hiddenClass}`}
                  >
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
                    {content.amazon_pay_button?.text_below && (
                      <div className="ss-pre-line-below">
                        {content.amazon_pay_button.text_below}
                      </div>
                    )}
                  </div>
                )}
                {/* bot: type == 'cart_login' */}
                {content.type === BOT_MESSAGE_TYPES.CART_LOGIN && (() => {
                  const cartLoginConfig = normalizeCartLoginConfig(content.cart_login);
                  const cartLoginStyle = buildCartLoginStyle(cartLoginConfig);
                  return (
                    <div
                      className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value${hiddenClass}`}
                    >
                      {cartLoginConfig.display_type === 'link' ? (
                        <span className="cart-login-interactive cart-login-interactive--link" style={cartLoginStyle}>{cartLoginConfig.text}</span>
                      ) : (
                        <button type="button" className="cart-login-interactive" style={cartLoginStyle}>
                          {cartLoginConfig.text}
                        </button>
                      )}
                    </div>
                  );
                })()}
                {/* bot: type == 'script' */}
                {(content.type === 'script' || content.type === BOT_MESSAGE_TYPES.HTML_CODE || content.type === BOT_MESSAGE_TYPES.UGC ) && (
                  <textarea
                    className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value${hiddenClass}`}
                    value={content[content.type]?.content || ''}
                    readOnly
                  ></textarea>
                )}
                {/* bot: type == 'delay' */}
                {content.type === 'delay' && (
                  <textarea
                    className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value${hiddenClass}`}
                    value={`${content[content.type]?.content || 0} 秒`}
                    readOnly
                  ></textarea>
                )}

                {/* bot: type == 'clear_variable' */}
                {content.type === 'clear_variable' && (
                  <div className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value ss-overview-bg-white${hiddenClass}`}
                  >
                    <ul>
                      {content[content.type]?.variables.length !== 0 && content[content.type]?.variables.map((item, index) => {
                        return <li key={index}>
                          {item}
                        </li>
                      })}
                    </ul>
                  </div>
                )}

                {/* bot: type == 'variable_set' */}
                {content.type === 'variable_set' && (
                  <div
                    className={`ss-bot-chat-overview-${index} ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value ss-overview-bg-white${hiddenClass}`}>
                    <ul>
                      {content[content.type]?.variables.length !== 0 && content[content.type]?.variables.map((item, index) => {
                        return <li key={index}>
                          {item.key} : {item.value}
                        </li>
                      })}
                    </ul>
                  </div>
                )}
              </div>
              <OverviewMessageActions
                index={index}
                message={message}
                belongTo="bot"
                contentType={content.type}
                onEditIconClick={handleEditIconClick}
                onCopyMessage={handleCopyMessage}
                onHiddenMessage={handleHiddenMessage}
                onDeleteMessage={handleDeleteMessage}
              />
            </React.Fragment>
            :
            <React.Fragment>
              <textarea
                className="ss-bot-chat-detail-content ss-message__content--bot-text ss-input-value"
                value={botTextValue}
                readOnly
              ></textarea>
              <OverviewMessageActions
                index={index}
                message={message}
                belongTo="bot"
                onEditIconClick={handleEditIconClick}
                onCopyMessage={handleCopyMessage}
                onHiddenMessage={handleHiddenMessage}
                onDeleteMessage={handleDeleteMessage}
                emptyContent
              />
            </React.Fragment>
          }
        </div>
        <OverviewAddStatementMenu index={index} onCreateStatement={onClickCreateStatement} />
      </div>
    </div>
  )}
</Draggable>
  );
};

export default OverviewBotMessageItem;
