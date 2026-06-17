import React from 'react';
import CheckboxCustom from '../../scenarioComon/CheckboxCustom';
import { RADIO_BUTTON_LABELS } from '../../constants/scenarioSettingLabels';
import { buildRadioButtonSettingContext } from './radioButtonSettingContext';

export const InitialSelectionCheckbox = ({ itemValue, radioButton, toggleInitialSelection }) => (
  <CheckboxCustom
    label={RADIO_BUTTON_LABELS.initialSelection}
    onChange={() => toggleInitialSelection(itemValue)}
    value={radioButton.initial_selection === itemValue}
    isOnChange={false}
  />
);

export const useRadioItemContext = (props) => {
  const ctx = buildRadioButtonSettingContext(props);
  return ctx;
};
