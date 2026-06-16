import React from 'react';
import PropTypes from 'prop-types';
import { BOT_MESSAGE_TYPES } from '../../PreviewComponent/Constants';

const ScenarioThemeBotMessageContent = ({ content, fileType, hidden }) => {
  const type = fileType;
  const hiddenStyle = hidden ? { opacity: '0.4' } : {};

  if (!content) return null;

  if (content.type === 'text_input' || content.type === 'getting_error_notification') {
    return (
      <div
        className="ss-message__content--bot-text"
        style={hiddenStyle}
        dangerouslySetInnerHTML={{ __html: content[content.type]?.content || '' }}
      />
    );
  }

  if (content.type === 'file') {
    if (!content[content.type]?.content) {
      return (
        <div className="ss-message__content--bot-text" style={hiddenStyle} />
      );
    }

    return (
      <>
        {type === 'mp4' && (
          <div className="ss-message__content ss-message__content--bot-file-video" style={hiddenStyle}>
            <video src={content[content.type]?.content} controls />
          </div>
        )}
        {(type === 'jpeg' || type === 'png' || type === 'jpg') && (
          <img
            className="ss-message__content"
            src={content[content.type]?.content}
            alt=""
            style={{ width: '100%', maxWidth: '100%', height: 'auto', border: 'none', ...hiddenStyle }}
          />
        )}
        {type === 'pdf' && (
          <div className="ss-message__content--bot-text" style={hiddenStyle}>
            {content[content.type]?.content}
          </div>
        )}
      </>
    );
  }

  if (content.type === 'email') {
    return (
      <div className="ss-message__content--bot-text" style={hiddenStyle}>
        {content[content.type]?.content || ''}
      </div>
    );
  }

  if (content.type === 'api_linkage' || content.type === 'pause') {
    return <div className="ss-message__content--bot-text" style={hiddenStyle} />;
  }

  if (
    content.type === 'script'
    || content.type === BOT_MESSAGE_TYPES.HTML_CODE
    || content.type === BOT_MESSAGE_TYPES.UGC
  ) {
    return (
      <div
        className="ss-message__content--bot-text"
        style={hiddenStyle}
        dangerouslySetInnerHTML={{ __html: content[content.type]?.content || '' }}
      />
    );
  }

  if (content.type === 'delay') {
    return (
      <div className="ss-message__content--bot-text" style={hiddenStyle}>
        {`${content[content.type]?.content || 0} 秒`}
      </div>
    );
  }

  if (content.type === 'clear_variable') {
    return (
      <div className="ss-message__content--bot-text" style={hiddenStyle}>
        <ul>
          {(content[content.type]?.variables || []).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (content.type === 'variable_set') {
    return (
      <div className="ss-message__content--bot-text" style={hiddenStyle}>
        <ul>
          {(content[content.type]?.variables || []).map((item) => (
            <li key={`${item.key}-${item.value}`}>
              {item.key} : {item.value}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
};

ScenarioThemeBotMessageContent.propTypes = {
  content: PropTypes.object,
  fileType: PropTypes.string,
  hidden: PropTypes.bool,
};

ScenarioThemeBotMessageContent.defaultProps = {
  content: null,
  fileType: '',
  hidden: false,
};

export default ScenarioThemeBotMessageContent;
