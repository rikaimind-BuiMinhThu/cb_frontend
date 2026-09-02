import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { baseUserMessageComponentPropTypes } from './userMessageComponentPropTypes';
import { EMPTY_INPUT_VALUE } from 'v2/views/BotElement/BotSetting/PreviewComponent/Constants';

const GENDER_DISPLAY_CLASS = {
  horizontal: "gender-display-row",
  vertical: "gender-display-column",
};

const OptionGender = ({
  contentIndex,
  radioButton,
  onChangeValue,
  options,
}) => {
  return (
    <div
      className="options-gender_wrapper"
    >
      <div
        className={`options-gender_wrapper-item ${GENDER_DISPLAY_CLASS[radioButton.gender_display_type] || EMPTY_INPUT_VALUE}`}
      >
        {options.map((item) => {
          return (
            <OptionGenderItem
              contentIndex={contentIndex}
              item={item}
              onChangeValue={onChangeValue}
              isSelected={radioButton.initial_selection === item.value}
              key={item.id}
            />
          );
        })}
      </div>
    </div>
  );
};

const OptionGenderItem = ({ contentIndex, item, onChangeValue, isSelected }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const getButtonVarStyle = () => {
    if (!item.preset_config) return undefined;

    const { button } = item.preset_config.preset;
    const backgroundColor = isSelected
      ? button.selected
      : isHovered
        ? button.hover
        : button.default;

    return { "--gender-btn-bg": backgroundColor };
  };

  const getIconVarStyle = (url) => {
    if (!item.preset_config) return undefined;

    const { icon } = item.preset_config.preset;
    const colorFill = isSelected
      ? icon.selected
      : isHovered
        ? icon.hover
        : icon.default;

    if (url) {
      return {
        "--gender-icon-mask": `url(${url})`,
        "--gender-icon-color": colorFill,
        "--gender-icon-width": `${item.preset_config.preset.icon.width}px`,
        "--gender-icon-height": `${item.preset_config.preset.icon.height}px`,
      };
    }

    return {
      "--gender-icon-color": colorFill,
    };
  };

  const buttonVarStyle = getButtonVarStyle();

  return (
    <div
      className={`option-gender-item${buttonVarStyle ? " option-gender-item--preset" : ""}`}
      style={buttonVarStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        onChangeValue(
          contentIndex,
          "radio_button",
          item.value,
          "initial_selection"
        );
      }}
    >
      {item.preset_config?.preset?.icon?.url ? (
        <div
          className="ico option-gender-icon-mask"
          alt={item.text}
          style={getIconVarStyle(item.preset_config.preset.icon.url)}
        />
      ) : (
        <div className="option-gender-icon-text" style={getIconVarStyle()}>{item.text}</div>
      )}
    </div>
  );
};

OptionGender.propTypes = {
  ...baseUserMessageComponentPropTypes,
};

OptionGenderItem.propTypes = {
  contentIndex: PropTypes.number,
  item: PropTypes.object,
  onChangeValue: PropTypes.func,
  isSelected: PropTypes.bool,
};

export default OptionGender;
