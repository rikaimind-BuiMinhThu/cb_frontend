import React from 'react';
import PropTypes from 'prop-types';

const HTML_CODE_PLACEHOLDER = 'HTMLコード...';
const TEXTAREA_ROWS_DEFAULT = 5;

const HtmlCodeMessage = ({
  value = '',
  onChange,
  validationError = '',
  placeholder = HTML_CODE_PLACEHOLDER,
  rows = TEXTAREA_ROWS_DEFAULT,
  className = '',
}) => {
  const handleChange = (event) => {
    if (onChange) {
      onChange(event.target.value);
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
          <div className="validation-error">
            {validationError}
          </div>
        )}
      </div>
    </div>
  );
};

HtmlCodeMessage.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  validationError: PropTypes.string,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  className: PropTypes.string,
};

export default HtmlCodeMessage;
