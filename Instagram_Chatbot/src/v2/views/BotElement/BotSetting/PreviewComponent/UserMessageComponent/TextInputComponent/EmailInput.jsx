import React, { useEffect, useRef, useState } from "react";
import InputCustom from "../../../ScenarioSetting/scenarioComon/InputCustom";
import {
  buildEmailWithDomain,
  filterDomainSuggestions,
  getEmailLocalAndDomainParts,
  normalizeEmailAt,
} from "../../emailDomainDefaults";

export default function EmailInput({
  disabled,
  placeholder,
  value = "",
  onChange,
  domainSuggestion,
  className = "m-b-0",
  style,
}) {
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

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prev) =>
        prev === 0 ? suggestions.length - 1 : prev - 1
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      handleSelectDomain(suggestions[highlightedIndex].domain);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleBlur = () => {
    if (value.includes("＠")) {
      onChange(normalizeEmailAt(value));
    }
  };

  return (
    <div
      className="ss-email-domain-suggestions"
      ref={containerRef}
      style={style}
    >
      <InputCustom
        disabled={disabled}
        className={className}
        placeholder={placeholder}
        onChange={handleChange}
        value={value || ""}
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
}
