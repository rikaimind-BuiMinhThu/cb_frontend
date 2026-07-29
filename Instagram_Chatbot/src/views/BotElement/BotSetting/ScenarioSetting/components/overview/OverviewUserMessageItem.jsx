import React from 'react';
import { Button } from 'reactstrap';
import { Draggable } from 'react-beautiful-dnd';

import UserContentPreviewList from './UserContentPreviewList';
import OverviewMessageActions from './OverviewMessageActions';
import OverviewAddStatementMenu from './OverviewAddStatementMenu';

// Ẩn nút khi content tự điều hướng (radio chưa chọn sẵn, carousel require, button_submit...)
const shouldShowNextButton = (message) => {
  const contents = message?.message_content ?? [];
  if (message.not_use_button || contents.length === 0) return false;
  if (contents[0]?.type === 'button_submit' || contents[0]?.type === 'contact_form') return false;
  if (contents.length > 1) return true;
  const first = contents[0];
  const isSelfNavigating =
    first.type === 'product_purchase_radio_button' ||
    (first.type === 'carousel' && first.carousel?.require) ||
    (first.type === 'radio_button' && !first.radio_button?.initial_selection);
  return !isSelfNavigating;
};

const NextButton = ({ label }) => (
  <div className="ss-user-message__action-wrapper">
    <Button className="ss-user-message__action-btn">
      {label || "次へ"}
    </Button>
  </div>
);

const OverviewUserMessageItem = ({ message, index, bindings }) => {
  const {
    handleSelectMessage, handleEditIconClick, handleCopyMessage,
    handleHiddenMessage, handleDeleteMessage, onClickCreateStatement,
  } = bindings;

  return (
    <Draggable key={message.id} draggableId={message.id?.toString()} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="ss-user-chat-wrapper ss-message-wrapper"
        >
          <div className={`ss-user-chat ss-message ss-message-${index}`}>
            <div
              className="ss-user-chat-detail ss-message__detail"
              onClick={() =>
                handleSelectMessage(index, message.belong_to, message.message_content[message.message_content.length - 1])
              }
            >
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                {message.message_name &&
                  <div
                    className="ss-sub-title-message ss-truncation-text"
                    style={{ backgroundColor: '#fff', maxWidth: '60%', marginRight: '10px' }}
                  >
                    {message.message_name}
                  </div>
                }
                <div
                  className={`ss-user-chat-detail-content ss-user-chat-detail-content-${index} ${message.hidden === true ? "ss-message-hidden-style" : ""}`}
                  style={message.message_name ? {} : { borderColor: 'red' }}
                >
                  <div className="ss-user-message__content-wrapper">
                    <UserContentPreviewList message={message} index={index} />
                  </div>
                  {shouldShowNextButton(message) && <NextButton label={message.buttonName} />}
                </div>
              </div>

              <OverviewMessageActions
                index={index}
                message={message}
                belongTo="user"
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

export default OverviewUserMessageItem;
