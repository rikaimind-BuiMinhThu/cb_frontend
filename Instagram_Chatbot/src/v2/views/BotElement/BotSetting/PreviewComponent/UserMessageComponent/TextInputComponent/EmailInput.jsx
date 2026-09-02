import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import InputCustom from "v2/components/BotMessages/InputCustom";
import {
  buildEmailWithDomain,
  filterDomainSuggestions,
  getEmailLocalAndDomainParts,
  normalizeEmailAt,
} from "../../emailDomainDefaults";
import { EMPTY_INPUT_VALUE } from "v2/views/BotElement/BotSetting/PreviewComponent/Constants";

const KEY_ARROW_DOWN = "ArrowDown";
const KEY_ARROW_UP = "ArrowUp";
const KEY_ENTER = "Enter";
const KEY_ESCAPE = "Escape";
const FULLWIDTH_AT = "＠";
const EMAIL_INPUT_PROP_TYPES = {
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  domainSuggestion: PropTypes.object,
  className: PropTypes.string,
};

const EmailInput = ({
  disabled,
  placeholder,
  value = EMPTY_INPUT_VALUE,
  onChange,
  domainSuggestion,
  className = "m-b-0",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef(null);
  const suggestions = filterDomainSuggestions(value, domainSuggestion);
  const isSuggestionEnabled = Boolean(domainSuggestion?.enabled);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [value, suggestions.length]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openSuggestionsIfNeeded = (nextValue) => {
    if (!isSuggestionEnabled) {
      setIsOpen(false);
      return;
    }
    const { hasAt } = getEmailLocalAndDomainParts(nextValue);
    const nextSuggestions = filterDomainSuggestions(nextValue, domainSuggestion);
    setIsOpen(hasAt && nextSuggestions.length > 0);
  };

  const handleChange = (nextValue) => {
    onChange(nextValue);
    openSuggestionsIfNeeded(nextValue);
  };

  const handleSelectDomain = (domain) => {
    const { localPart } = getEmailLocalAndDomainParts(value);
    const nextValue = buildEmailWithDomain(localPart, domain);
    onChange(normalizeEmailAt(nextValue));
    setIsOpen(false);
  };

  const handleKeyDown = (event) => {
    if (!isOpen || suggestions.length === 0) return;

    if (event.key === KEY_ARROW_DOWN) {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (event.key === KEY_ARROW_UP) {
      event.preventDefault();
      setHighlightedIndex((prev) =>
        prev === 0 ? suggestions.length - 1 : prev - 1
      );
    } else if (event.key === KEY_ENTER) {
      event.preventDefault();
      handleSelectDomain(suggestions[highlightedIndex].domain);
    } else if (event.key === KEY_ESCAPE) {
      setIsOpen(false);
    }
  };

  const handleBlur = () => {
    if (value.includes(FULLWIDTH_AT)) {
      onChange(normalizeEmailAt(value));
    }
  };

  return (
    <div
      className="ss-email-domain-suggestions"
      ref={containerRef}
    >
      <InputCustom
        disabled={disabled}
        className={className}
        placeholder={placeholder}
        onChange={handleChange}
        value={value || EMPTY_INPUT_VALUE}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={() => openSuggestionsIfNeeded(value)}
        autoComplete="off"
      />
      {isSuggestionEnabled && isOpen && suggestions.length > 0 && (
        <ul className="ss-email-domain-suggestions__dropdown" role="listbox">
          {suggestions.map((item, index) => (
            <li
              key={item.id ?? `${item.domain}-${index}`}
              className={`ss-email-domain-suggestions__item${
                index === highlightedIndex
                  ? " ss-email-domain-suggestions__item--active"
                  : ""
              }`}
              role="option"
              aria-selected={index === highlightedIndex}
              onMouseDown={(event) => {
                event.preventDefault();
                handleSelectDomain(item.domain);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {item.domain}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

EmailInput.propTypes = EMAIL_INPUT_PROP_TYPES;

export default EmailInput;
