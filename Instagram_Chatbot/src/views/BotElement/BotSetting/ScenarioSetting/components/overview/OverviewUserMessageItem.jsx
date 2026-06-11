import React from 'react';
import { Button } from 'reactstrap';
import icon from '../../../../../../assets/img/bot-icon/man1_new.png';
import { MDBIcon } from 'mdbreact';
import SelectCustom from '../../scenarioComon/SelectCustom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import moment from 'moment';
import { Carousel, Checkbox, Radio, Slider, Calendar, Select } from 'antd';
import shopifIcon from '../../../../../../assets/img/shopify-icon.png';
import locale from 'antd/es/date-picker/locale/ja_JP';
import { BOT_MESSAGE_TYPES } from '../../../PreviewComponent/Constants';
import { PREVIEW_MAP } from '../../contentPreviews';
import {
  getCalendarPreviewRelativeRangeLabel,
  isCalendarPreviewRelativeRangeEnabled,
  isCalendarPreviewDaysSplitEnabled,
  deliveryCutOffTimeSelectValue,
  handleDisableDateCalendar,
  handleDisableEndDateCalendar,
  mergePreviewRelativeCalendar,
} from '../../utils/scenarioCalendarUtils';
import { settingsCarousel } from '../scenarioCarouselSettings';

import UserContentPreviewList from './UserContentPreviewList';
import OverviewMessageActions from './OverviewMessageActions';
import OverviewAddStatementMenu from './OverviewAddStatementMenu';

const OverviewUserMessageItem = ({ message, index, bindings }) => {
  const {
    handleSelectMessage, handleEditIconClick, handleCopyMessage,
    handleHiddenMessage, handleDeleteMessage, onClickCreateStatement,
  } = bindings;

  return (
<Draggable key={message.id} draggableId={message.id?.toString()} index={index}>
  {(provided) => (
    <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} key={index} className="ss-user-chat-wrapper ss-message-wrapper">
      <div
        className={`ss-user-chat ss-message ss-message-${index}`}
      // style={message?.message_content.length === 0 ? {width: '30%'}: {}}
      >
        <div
          className="ss-user-chat-detail ss-message__detail"
          onClick={() =>
            handleSelectMessage(index, message.belong_to, message.message_content[message.message_content.length - 1])
          }
        >
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            {message.message_name && <div className="ss-sub-title-message ss-truncation-text" style={{ backgroundColor: '#fff', maxWidth: '60%', marginRight: '10px' }}>{message.message_name}</div>}
            <div className={`ss-user-chat-detail-content ss-user-chat-detail-content-${index} ${message.hidden === true ? "ss-message-hidden-style" : ""}`}
              style={message.message_name ? {} : { borderColor: 'red' }}>
              <div className="ss-user-message__content-wrapper">
      <UserContentPreviewList message={message} index={index} bindings={bindings} />
              </div>
              {!message.not_use_button && message.message_content[0]?.type !== 'button_submit'&& message?.message_content.length !== 0 &&
                ((message?.message_content.length === 1 && 
                  !(message.message_content[0].type === 'product_purchase_radio_button'
                    || (message.message_content[0].type === 'carousel' && message.message_content[0]?.[message.message_content[0].type].require)
                    || (message.message_content[0].type === 'radio_button' && !message.message_content[0][message.message_content[0].type].initial_selection))
                )
                  || message?.message_content.length > 1) &&
                <div className="ss-user-message__action-wrapper">
                  <Button className="ss-user-message__action-btn">
                    {message.buttonName || "次へ"}
                  </Button>
                </div>
              }
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
