import React from 'react';

const ChatbotMessageTypeHtml = ({
  value = '',
  onChange,
  validationError = '',
  placeholder = 'HTMLコード...',
  rows = 5,
  className = ''
}) => {
  const handleChange = (e) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="ss-bot-statement-wrapper">
      <div
        id="ss-bot-statement-type-html-code"
        className="ss-bot-statement-type-html-code ss-bot-statement-type"
      >
        <textarea
          name="bot-statement-type-html-code-content"
          id="bot-statement-type-html-code-content"
          className={`ss-bot-statement-type-html-code-content ss-input-value ${className}`}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
        />
        {validationError && (
          <div style={{ color: '#FF7E00', fontSize: '12px', marginTop: '5px' }}>
            {validationError}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatbotMessageTypeHtml;
