import React from 'react';
import { Button } from 'reactstrap';
import { Draggable } from 'react-beautiful-dnd';
import OverviewMessageActions from './OverviewMessageActions';
import OverviewAddStatementMenu from './OverviewAddStatementMenu';
import CombineOverviewBlockPreview from './CombineOverviewBlockPreview';
import { COMBINE_MESSAGE_DEFAULTS, NEXT_BUTTON_LABEL } from 'v2/views/Preview/PreviewComponent/Constants';

const shouldShowNextButton = (message) => {
  const contents = message?.message_content ?? [];
  if (message.not_use_button || contents.length === 0) return false;
  const hasButtonSubmit = contents.some((item) => item.type === 'button_submit' || item.type === 'contact_form');
  if (hasButtonSubmit) return false;
  return true;
};

const NextButton = ({ label }) => (
  <div className="ss-user-message__action-wrapper">
    <Button className="ss-user-message__action-btn">{label || NEXT_BUTTON_LABEL}</Button>
  </div>
);

const OverviewCombineMessageItem = ({ message, index, bindings }) => {
  const {
    handleSelectMessage, handleEditIconClick, handleCopyMessage,
    handleHiddenMessage, handleDeleteMessage, onClickCreateStatement,
  } = bindings;

  const contentGap = message.combine_message?.content_gap ?? COMBINE_MESSAGE_DEFAULTS.CONTENT_GAP;
  const lastContent = message.message_content[message.message_content.length - 1];

  return (
    <Draggable key={message.id} draggableId={message.id?.toString()} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          id={`message_${index}`}
          className="ss-combine-chat-wrapper ss-message-wrapper"
        >
          <div className={`ss-combine-chat ss-message ss-message-${index}`}>
            <div
              className="ss-combine-chat-detail ss-message__detail"
              onClick={() => handleSelectMessage(index, message.belong_to, lastContent?.type)}
            >
              <div className="ss-overview-combine-body">
                <div className="ss-overview-combine-titles">
                  <div className="ss-sub-title-message">結合メッセージ</div>
                  {message.message_name && (
                    <div
                      className="ss-sub-title-message ss-truncation-text ss-overview-message-name"
                    >
                      {message.message_name}
                    </div>
                  )}
                </div>
                <div
                  className={`ss-combine-chat-detail-content ss-combine-chat-detail-content-${index} ${message.hidden === true ? 'ss-message-hidden-style' : ''} ${message.message_name ? '' : 'ss-input--invalid'}`}
                >
                  <div className="ss-combine-message__wrapper">
                    {message.message_content.map((content, indexContent) => (
                      <div
                        key={content.id ?? indexContent}
                        className={indexContent > 0 ? 'ss-combine-overview-block--gapped' : undefined}
                        style={indexContent > 0 ? { '--ss-combine-gap': `${contentGap}px` } : undefined}
                      >
                        <CombineOverviewBlockPreview
                          content={content}
                          message={message}
                          indexMessage={index}
                          indexContent={indexContent}
                          hidden={message.hidden}
                        />
                      </div>
                    ))}
                    {shouldShowNextButton(message) && (
                      <NextButton label={message.buttonName} />
                    )}
                  </div>
                </div>
              </div>
              <OverviewMessageActions
                index={index}
                message={message}
                belongTo="combine"
                contentType={lastContent?.type}
                messageName={message.message_name}
                onEditIconClick={handleEditIconClick}
                onCopyMessage={handleCopyMessage}
                onHiddenMessage={handleHiddenMessage}
                onDeleteMessage={handleDeleteMessage}
              />
            </div>
            <OverviewAddStatementMenu index={index} onCreateStatement={onClickCreateStatement} />
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default OverviewCombineMessageItem;
