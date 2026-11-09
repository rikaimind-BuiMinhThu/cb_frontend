import React from 'react';
import PropTypes from 'prop-types';
import { baseUserMessageComponentPropTypes } from './userMessageComponentPropTypes';
import { EMPTY_INPUT_VALUE } from 'v2/views/Preview/PreviewComponent/Constants';
import {
  GENDER_OPTION_DESIGN_CLASS,
  GENDER_OPTION_SELECTED_CLASS,
  GENDER_OPTION_TWINKLE_CLASS,
  resolveOptionDesignStyle,
} from 'v2/views/ScenarioSetting/utils/radioOptionDesignStyle';
import {
  buildEditorRadioOptionDataAttr,
  isRadioOptionInitiallySelected,
} from 'v2/views/ScenarioSetting/utils/radioButtonSelectionUtils';

const GENDER_DISPLAY_CLASS = {
  horizontal: 'gender-display-row',
  vertical: 'gender-display-column',
};

const EMPTY_IMAGE_ALT = '';

const OptionGender = ({
  contentIndex,
  radioButton,
  onChangeValue,
  options,
  onAdvanceAfterSelect,
  theme,
}) => (
  <div className="options-gender_wrapper">
    <div
      className={`options-gender_wrapper-item ${GENDER_DISPLAY_CLASS[radioButton.gender_display_type] || EMPTY_INPUT_VALUE}`}
    >
      {options.map((item) => (
        <OptionGenderItem
          contentIndex={contentIndex}
          item={item}
          radioButton={radioButton}
          onChangeValue={onChangeValue}
          onAdvanceAfterSelect={onAdvanceAfterSelect}
          isSelected={isRadioOptionInitiallySelected(radioButton, item)}
          theme={theme}
          key={item.id}
        />
      ))}
    </div>
  </div>
);

const OptionGenderItem = ({
  contentIndex,
  item,
  radioButton,
  onChangeValue,
  onAdvanceAfterSelect,
  isSelected,
  theme,
}) => {
  const { resolved, style, twinkle } = resolveOptionDesignStyle({
    option: item,
    radioButton,
    theme,
  });
  const hasDesignVisual = Boolean(
    item?.design
    || item?.preset_config
    || resolved.background_color
    || resolved.image,
  );

  const className = [
    'option-gender-item',
    hasDesignVisual ? GENDER_OPTION_DESIGN_CLASS : '',
    isSelected ? GENDER_OPTION_SELECTED_CLASS : '',
    twinkle ? GENDER_OPTION_TWINKLE_CLASS : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={className}
      style={style}
      data-editor-radio-option={buildEditorRadioOptionDataAttr(contentIndex, item)}
      onClick={() => {
        onChangeValue(
          contentIndex,
          'radio_button',
          item.value,
          'initial_selection',
        );
        if (onAdvanceAfterSelect) onAdvanceAfterSelect();
      }}
    >
      {resolved.image ? (
        <img
          className="option-gender-item__design-image"
          src={resolved.image}
          alt={item.text || EMPTY_IMAGE_ALT}
        />
      ) : null}
      {item.text ? (
        <div className="option-gender-icon-text">{item.text}</div>
      ) : null}
    </div>
  );
};

OptionGender.propTypes = {
  ...baseUserMessageComponentPropTypes,
  onAdvanceAfterSelect: PropTypes.func,
  options: PropTypes.array,
  theme: PropTypes.object,
};

OptionGenderItem.propTypes = {
  contentIndex: PropTypes.number,
  item: PropTypes.object,
  radioButton: PropTypes.object,
  onChangeValue: PropTypes.func,
  onAdvanceAfterSelect: PropTypes.func,
  isSelected: PropTypes.bool,
  theme: PropTypes.object,
};

export default OptionGender;
