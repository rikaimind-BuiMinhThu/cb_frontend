import React from 'react';
import PropTypes from 'prop-types';

const ScenarioCodeTextarea = ({
  id,
  value,
  onChange,
  placeholder,
  language = 'javascript',
  height = 150,
  disabled = false,
  className = '',
}) => (
  <textarea
    id={id}
    className={`ss-settings-code-textarea ${className}`.trim()}
    style={{ height: `${height}px`, minHeight: `${height}px` }}
    placeholder={placeholder}
    value={value}
    disabled={disabled}
    spellCheck={false}
    autoComplete="off"
    autoCorrect="off"
    autoCapitalize="off"
    data-language={language}
    onChange={(e) => onChange(e.target.value)}
  />
);

ScenarioCodeTextarea.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  language: PropTypes.oneOf(['javascript', 'css', 'html']),
  height: PropTypes.number,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default ScenarioCodeTextarea;
