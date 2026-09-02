import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { getBotMessageTitle, getBotFileExtension } from 'v2/views/BotElement/BotSetting/ScenarioSetting/utils/getBotMessageTitle';
import OverviewBotMessageItem from './OverviewBotMessageItem';
import OverviewUserMessageItem from './OverviewUserMessageItem';
import OverviewCombineMessageItem from './OverviewCombineMessageItem';

const OverviewMessageList = (bindings) => {
  const { dataMessages, handleDragEndMessageOverview } = bindings;

  return (
    <DragDropContext onDragEnd={handleDragEndMessageOverview}>
      <Droppable droppableId="messages-overview">
        {(provided) => (
          <div className="" {...provided.droppableProps} ref={provided.innerRef}>
            {dataMessages && dataMessages.map((message, index) => {
              const content = message.belong_to === 'bot'
                ? message.message_content[0]
                : undefined;
              const fileType = getBotFileExtension(content);
              const titleMessage = getBotMessageTitle(content);

              return message.belong_to === 'bot' ? (
                <OverviewBotMessageItem
                  key={message.id}
                  message={message}
                  index={index}
                  content={content}
                  fileType={fileType}
                  titleMessage={titleMessage}
                  bindings={bindings}
                />
              ) : message.belong_to === 'combine' ? (
                <OverviewCombineMessageItem
                  key={message.id}
                  message={message}
                  index={index}
                  bindings={bindings}
                />
              ) : (
                <OverviewUserMessageItem
                  key={message.id}
                  message={message}
                  index={index}
                  bindings={bindings}
                />
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default OverviewMessageList;
