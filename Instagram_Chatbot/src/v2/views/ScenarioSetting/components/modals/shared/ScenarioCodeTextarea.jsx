import React from 'react';
import PropTypes from 'prop-types';
import { CODE_TEXTAREA_RESIZABLE_CLASS } from './scenarioModalTooltips';

const EMPTY_CLASS = '';

const ScenarioCodeTextarea = ({
  id,
  value,
  onChange,
  placeholder,
  language = 'javascript',
  height = 150,
  disabled = false,
  className = EMPTY_CLASS,
  resizable = false,
}) => {
  const resizableClass = resizable ? CODE_TEXTAREA_RESIZABLE_CLASS : EMPTY_CLASS;

  return (
    <textarea
      id={id}
      className={`ss-settings-code-textarea ${resizableClass} ${className}`.trim()}
      style={{ '--ss-code-textarea-height': `${height}px` }}
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
};

ScenarioCodeTextarea.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  language: PropTypes.oneOf(['javascript', 'css', 'html']),
  height: PropTypes.number,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  resizable: PropTypes.bool,
};

export default ScenarioCodeTextarea;
