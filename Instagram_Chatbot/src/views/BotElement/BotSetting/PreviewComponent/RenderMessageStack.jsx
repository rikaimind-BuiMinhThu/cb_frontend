import { Fragment, useEffect, useState } from "react";

const MILISECOND = 1000;

export default function RenderMessageStack({
  messages,
  renderBot,
  renderUser,
  handleExpiredDelayBotMessage,
  currentUserMsgIndex,
}) {
  const [visibleMessages, SetVisibleMessage] = useState([]);
  const [indexVisible, SetIndexVisible] = useState(-1);

  const isBotMessage = (message) => {
    return message.belong_to === "bot" && message.message_content.length > 0;
  };

  const isUserMessage = (message) => {
    return message.belong_to === "user" && message.message_content.length > 0;
  };

  const renderMsg = (message, indexMsg) => {
    if (message?.hidden || !message) return null;

    // *Refactor recommended in future!
    // For fast development, using renderBot adn renderUser of parent Components
    if (isBotMessage(message) && !!renderBot) {
      return renderBot(message, indexMsg);
    }
    if (isUserMessage(message) && !!renderUser) {
      return renderUser(message, indexMsg);
    }

    return null;
  };

  // Move visibleIndex pointer to 1 and add to list visibleMessage
  const showNextMessage = (index) => {
    const newIndex = index + 1;

    SetIndexVisible(newIndex);

    if (!messages[newIndex]) return;
    SetVisibleMessage((msg) => [...msg, messages[newIndex]]);
  };

  useEffect(() => {
    if (!Array.isArray(messages) || indexVisible >= messages.length - 1) return;

    // Start stacks
    if (indexVisible < 0 && !!messages.length) {
      showNextMessage(-1);
      return;
    }

    const messageContent = messages[indexVisible].message_content;
    const delaySec = messageContent[0]?.delay?.content || 0;

    // Only DelayMessage with hidden:FALSE will be delay using setTimtout
    if (
      !messageContent?.length ||
      messageContent[0]?.type !== "delay" ||
      !delaySec ||
      (messageContent[0]?.type === "delay" && messages[indexVisible].hidden)
    ) {
      showNextMessage(indexVisible);
      return;
    }

    const timeOutMessage = setTimeout(() => {
      if (!!handleExpiredDelayBotMessage) handleExpiredDelayBotMessage(indexVisible);

      showNextMessage(indexVisible);
    }, delaySec * MILISECOND);

    return () => {
      clearTimeout(timeOutMessage);
    };
  }, [messages, indexVisible]);

  useEffect(() => {
    if (currentUserMsgIndex >= indexVisible) return;

    // Update case purpose: listMessages Reduced -> currentUserMsgIndex decrease 
    // -> indexInvisible and visibleMessage will decrease to sync with currentUserMsgIndex
    SetIndexVisible(currentUserMsgIndex);
    SetVisibleMessage((vMsg) => vMsg.slice(0, currentUserMsgIndex + 1));
  }, [currentUserMsgIndex]);

  return (
    <>
      {visibleMessages.map((message, index) => (
        <Fragment key={"render_message_" + index + message.id}>
          {renderMsg(message, index)}
        </Fragment>
      ))}
    </>
  );
}
