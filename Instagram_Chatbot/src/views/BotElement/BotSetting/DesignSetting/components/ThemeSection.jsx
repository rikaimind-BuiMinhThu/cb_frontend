import React from 'react';
import PropTypes from 'prop-types';
import ThemeColorField from './ThemeColorField';
import ThemeEffectSelectField from './ThemeEffectSelectField';
import ThemeNumberField from './ThemeNumberField';

const ThemeSection = ({ title, fields, themeSettings, onFieldChange }) => (
  <section className="theme-section">
    <h5 className="theme-section__title">{title}</h5>
    <div className="theme-section__grid">
      {fields.map(({ key, label, isText, fieldType, fullWidth }) => {
        if (fieldType === 'effectSelect') {
          return (
            <ThemeEffectSelectField
              key={key}
              label={label}
              value={themeSettings[key]}
              fullWidth={fullWidth}
              onChange={(value) => onFieldChange(key, value)}
            />
          );
        }

        if (fieldType === 'fontSize') {
          return (
            <ThemeNumberField
              key={key}
              label={label}
              value={themeSettings[key]}
              fullWidth={fullWidth}
              onChange={(value) => onFieldChange(key, value)}
            />
          );
        }

        return (
          <ThemeColorField
            key={key}
            label={label}
            value={themeSettings[key]}
            isText={isText}
            fullWidth={fullWidth}
            onChange={(value) => onFieldChange(key, value)}
          />
        );
      })}
    </div>
  </section>
);

ThemeSection.propTypes = {
  title: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    isText: PropTypes.bool,
    fieldType: PropTypes.string,
    fullWidth: PropTypes.bool,
  })).isRequired,
  themeSettings: PropTypes.object.isRequired,
  onFieldChange: PropTypes.func.isRequired,
};

export default ThemeSection;
