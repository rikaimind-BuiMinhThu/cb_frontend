import React from 'react';
import CheckboxCustom from '../../scenarioCommon/CheckboxCustom';
import { CHECKBOX_LABELS } from '../../constants/scenarioSettingLabels';
import {
  isCheckboxImgContentChecked,
  isCheckboxOptionChecked,
} from 'v2/views/ScenarioSetting/utils/checkboxSelectionUtils';

export const InitialCheckedCheckbox = ({
  item,
  group,
  checkbox,
  toggleCheckedValue,
  toggleInitialSelectionPicture,
  isImgType = false,
}) => {
  const isChecked = isImgType
    ? isCheckboxImgContentChecked(checkbox, group, item)
    : isCheckboxOptionChecked(checkbox, item);

  const handleToggle = () => {
    if (isImgType) {
      toggleInitialSelectionPicture(group, item);
    } else {
      toggleCheckedValue(item);
    }
  };

  return (
    <div
      className="ss-checkbox-setting__initial-selection"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      role="presentation"
    >
      <CheckboxCustom
        label={CHECKBOX_LABELS.initialSelection}
        onChange={handleToggle}
        value={isChecked}
        isOnChange={false}
      />
    </div>
  );
};
