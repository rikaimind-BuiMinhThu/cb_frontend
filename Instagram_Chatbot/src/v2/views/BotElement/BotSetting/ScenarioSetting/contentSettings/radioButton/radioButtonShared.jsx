import React from 'react';
import CheckboxCustom from '../../scenarioCommon/CheckboxCustom';
import { RADIO_BUTTON_LABELS } from '../../constants/scenarioSettingLabels';
import { isRadioOptionInitiallySelected } from 'v2/views/BotElement/BotSetting/ScenarioSetting/utils/radioButtonSelectionUtils';

export const InitialSelectionCheckbox = ({ item, radioButton, toggleInitialSelection }) => (
  <div
    className="ss-radio-button-setting__initial-selection"
    onClick={(e) => e.stopPropagation()}
    onKeyDown={(e) => e.stopPropagation()}
    role="presentation"
  >
    <CheckboxCustom
      label={RADIO_BUTTON_LABELS.initialSelection}
      onChange={() => toggleInitialSelection(item)}
      value={isRadioOptionInitiallySelected(radioButton, item)}
      isOnChange={false}
    />
  </div>
);
