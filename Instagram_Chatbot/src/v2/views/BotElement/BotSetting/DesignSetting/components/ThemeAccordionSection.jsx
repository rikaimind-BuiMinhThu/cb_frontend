import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'antd';
import ThemeColorField from './ThemeColorField';
import ThemeEffectSelectField from './ThemeEffectSelectField';
import ThemeNumberField from './ThemeNumberField';

const { Panel } = Collapse;

const ThemeAccordionSection = ({
  sectionId,
  title,
  fields,
  themeSettings,
  isActive,
  isExpanded,
  highlightedFieldKey,
  onExpand,
  onFieldChange,
  onResetSection,
  showReset,
}) => {
  const renderField = ({ key, label, isText, fieldType, fullWidth }) => {
    const isHighlighted = highlightedFieldKey === key;
    const fieldClassSuffix = isHighlighted ? ' theme-field--highlighted' : '';

    if (fieldType === 'effectSelect') {
      return (
        <div key={key} className={fieldClassSuffix}>
          <ThemeEffectSelectField
            label={label}
            value={themeSettings[key]}
            fullWidth={fullWidth ?? false}
            tooltipKey={key}
            onChange={(value) => onFieldChange(key, value)}
          />
        </div>
      );
    }

    if (fieldType === 'fontSize') {
      return (
        <div key={key} className={fieldClassSuffix}>
          <ThemeNumberField
            label={label}
            value={themeSettings[key]}
            fullWidth={fullWidth ?? false}
            tooltipKey={key}
            onChange={(value) => onFieldChange(key, value)}
          />
        </div>
      );
    }

    return (
      <div key={key} className={fieldClassSuffix}>
        <ThemeColorField
          label={label}
          value={themeSettings[key]}
          isText={isText}
          fullWidth={fullWidth ?? false}
          tooltipKey={key}
          onChange={(value) => onFieldChange(key, value)}
        />
      </div>
    );
  };

  const header = (
    <div className="theme-accordion-section__header">
      <span>{title}</span>
      {showReset && isExpanded && (
        <button
          type="button"
          className="theme-accordion-section__reset"
          onClick={(event) => {
            event.stopPropagation();
            onResetSection(sectionId);
          }}
        >
          デフォルトに戻す
        </button>
      )}
    </div>
  );

  return (
    <div
      id={`theme-section-${sectionId}`}
      className={`theme-accordion-section${isActive ? ' theme-accordion-section--active' : ''}`}
    >
      <Collapse
        bordered={false}
        activeKey={isExpanded ? sectionId : []}
        onChange={(keys) => {
          const expanded = Array.isArray(keys) ? keys.includes(sectionId) : keys === sectionId;
          onExpand(sectionId, expanded);
        }}
      >
        <Panel header={header} key={sectionId}>
          <div className="theme-section__grid">
            {fields.map(renderField)}
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

ThemeAccordionSection.propTypes = {
  sectionId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    isText: PropTypes.bool,
    fieldType: PropTypes.string,
    fullWidth: PropTypes.bool,
  })).isRequired,
  themeSettings: PropTypes.object.isRequired,
  isActive: PropTypes.bool,
  isExpanded: PropTypes.bool,
  highlightedFieldKey: PropTypes.string,
  onExpand: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onResetSection: PropTypes.func.isRequired,
  showReset: PropTypes.bool,
};

ThemeAccordionSection.defaultProps = {
  isActive: false,
  isExpanded: false,
  highlightedFieldKey: '',
  showReset: true,
};

export default ThemeAccordionSection;
