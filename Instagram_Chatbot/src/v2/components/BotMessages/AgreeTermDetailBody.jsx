import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CheckboxCustom from './CheckboxCustom';
import {
  AGREE_TERM_ALIGN,
  AGREE_TERM_LONG_CONTENT_LENGTH,
  AGREE_TERM_TEXTAREA_NAME,
  AGREE_TERM_TEXTAREA_ROWS,
  AGREE_TERM_TEXTAREA_ROWS_LONG,
  buildAgreeTermDesignVars,
  canEnableAgreeTermCollapse,
  resolveAgreeTermDesign,
} from './agreeTermDesign';
import { agreeTermDesignPropType } from './agreeTermPropTypes';
import './AgreeTermDetailBody.css';

const ALIGN_ROW_CLASS = {
  [AGREE_TERM_ALIGN.LEFT]: 'ss-agree-term-design__check-row ss-agree-term-design__check-row--left',
  [AGREE_TERM_ALIGN.CENTER]: 'ss-agree-term-design__check-row ss-agree-term-design__check-row--center',
  [AGREE_TERM_ALIGN.RIGHT]: 'ss-agree-term-design__check-row ss-agree-term-design__check-row--right',
};

const joinClasses = (classes) => classes.filter(Boolean).join(' ');

const AgreeTermDetailBody = ({
  title,
  titleRequire,
  requiredLabel,
  requiredClassName,
  headerClassName,
  content,
  term,
  isAgree,
  onAgreeChange,
  checkboxDisabled,
  design,
}) => {
  const hasDesign = Boolean(design);
  const resolved = resolveAgreeTermDesign(design);
  const titleText = title ?? '';
  const agreeTermForCollapse = {
    title_require: titleRequire,
    title: titleText,
  };
  const collapseActive = hasDesign
    && resolved.collapse.enabled
    && canEnableAgreeTermCollapse(agreeTermForCollapse);
  const defaultCollapsed = resolved.collapse.default_collapsed;
  const [expanded, setExpanded] = useState(!collapseActive || !defaultCollapsed);

  useEffect(() => {
    if (!collapseActive) {
      setExpanded(true);
      return undefined;
    }
    setExpanded(!defaultCollapsed);
    return undefined;
  }, [collapseActive, defaultCollapsed]);

  const contentText = content ?? '';
  const textareaRows = contentText.length > AGREE_TERM_LONG_CONTENT_LENGTH
    ? AGREE_TERM_TEXTAREA_ROWS_LONG
    : AGREE_TERM_TEXTAREA_ROWS;
  const showHeader = Boolean(titleRequire) || Boolean(requiredLabel);
  const termsClassName = joinClasses([
    'ss-agree-term-design__terms',
    expanded ? '' : 'ss-agree-term-design__terms--collapsed',
  ]);

  const titleClassName = joinClasses([
    'ss-message__content--user-agree_to_term-title',
    hasDesign ? 'ss-agree-term-design__title' : '',
    hasDesign && resolved.title.bold ? 'ss-agree-term-design__title--bold' : '',
    collapseActive ? 'ss-agree-term-design__title-button' : '',
  ]);

  const labelClassName = joinClasses([
    hasDesign ? 'ss-agree-term-design__label' : '',
    hasDesign && resolved.label.bold ? 'ss-agree-term-design__label--bold' : '',
  ]);

  const wrapperClassName = hasDesign ? 'ss-agree-term-design' : '';
  const wrapperStyle = hasDesign ? buildAgreeTermDesignVars(resolved) : undefined;
  const checkRowClassName = hasDesign
    ? ALIGN_ROW_CLASS[resolved.align]
    : '';

  const handleAgreeChange = (checked) => {
    if (!onAgreeChange) return;
    onAgreeChange(checked);
  };

  const toggleExpanded = () => {
    setExpanded((current) => !current);
  };

  const renderTitle = () => {
    if (!titleRequire) return null;
    if (!collapseActive) {
      return <span className={titleClassName}>{titleText}</span>;
    }
    return (
      <button
        type="button"
        className={titleClassName}
        aria-expanded={expanded}
        onClick={toggleExpanded}
      >
        {titleText}
      </button>
    );
  };

  const renderTermsField = () => (
    <textarea
      name={AGREE_TERM_TEXTAREA_NAME}
      rows={textareaRows}
      value={contentText}
      className="ss-input-value"
      readOnly
      tabIndex={collapseActive && !expanded ? -1 : undefined}
      aria-hidden={collapseActive && !expanded}
    />
  );

  const renderTerms = () => {
    if (!collapseActive) return renderTermsField();
    return (
      <div className={termsClassName}>
        <div className="ss-agree-term-design__terms-inner">
          {renderTermsField()}
        </div>
      </div>
    );
  };

  const renderCheckbox = () => (
    <CheckboxCustom
      disabled={checkboxDisabled}
      label={term}
      labelClassName={labelClassName}
      value={isAgree === true}
      onChange={handleAgreeChange}
    />
  );

  const renderCheckRow = () => {
    if (!hasDesign) return renderCheckbox();
    return (
      <div className={checkRowClassName}>
        {renderCheckbox()}
      </div>
    );
  };

  return (
    <div className={wrapperClassName} style={wrapperStyle}>
      {showHeader && (
        <div className={headerClassName}>
          {renderTitle()}
          {requiredLabel && (
            <span className={requiredClassName}>{requiredLabel}</span>
          )}
        </div>
      )}
      <div className="ss-message__content--user-agree_to_term-detail_content">
        {renderTerms()}
        {renderCheckRow()}
      </div>
    </div>
  );
};

AgreeTermDetailBody.propTypes = {
  title: PropTypes.string,
  titleRequire: PropTypes.bool,
  requiredLabel: PropTypes.string,
  requiredClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  content: PropTypes.string,
  term: PropTypes.string,
  isAgree: PropTypes.bool,
  onAgreeChange: PropTypes.func,
  checkboxDisabled: PropTypes.bool,
  design: agreeTermDesignPropType,
};

AgreeTermDetailBody.defaultProps = {
  title: '',
  titleRequire: false,
  requiredLabel: '',
  requiredClassName: 'ss-message__content--user-text-input-required',
  headerClassName: 'ss-message__content--user-agree_to_term-top',
  content: '',
  term: '',
  isAgree: false,
  onAgreeChange: undefined,
  checkboxDisabled: false,
  design: undefined,
};

export default AgreeTermDetailBody;
