import React from 'react';
import { MESSAGE_CONTENT_TYPES } from 'v2/views/Preview/PreviewComponent/Constants';
import { baseUserMessageComponentPropTypes } from './userMessageComponentPropTypes';
import 'v2/assets/css/bot/preview-chat-bot.css';

const USER_HTML_CODE_CLASS = 'ss-message__content--user-html-code';

const HtmlCode = ({ content }) => {
  if (!content || content.type !== MESSAGE_CONTENT_TYPES.HTML_CODE) return null;

  const html = content.html_code?.content;
  if (!html) return null;

  return (
    <div
      className={USER_HTML_CODE_CLASS}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

HtmlCode.propTypes = {
  ...baseUserMessageComponentPropTypes,
};

export default HtmlCode;
