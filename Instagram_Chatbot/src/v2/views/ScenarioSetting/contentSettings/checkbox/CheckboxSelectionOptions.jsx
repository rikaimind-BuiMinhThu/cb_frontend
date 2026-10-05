import React from 'react';
import CheckboxCustom from '../../scenarioCommon/CheckboxCustom';
import InputNum from '../../scenarioCommon/InputNum';
import {
  CHECKBOX_LABELS,
  PULL_DOWN_LABELS,
} from '../../constants/scenarioSettingLabels';
import { buildCheckboxSettingContext } from './checkboxSettingContext';

const CheckboxSelectionOptions = (props) => {
  const { checkbox, numberMaxLength } = props;
  const { changeContent } = buildCheckboxSettingContext(props);

  const renderAllItemChecked = () => (
    <div className="ss-user-setting__item-text_input-top">
      <CheckboxCustom
        label={CHECKBOX_LABELS.allItemChecked}
        onChange={changeContent('all_item_checked')}
        value={checkbox.all_item_checked}
      />
    </div>
  );

  const renderSelectionLimit = () => (
    <div className="ss-user-setting__item-bottom-flex-start">
      <span className="ss-user-setting-label">{CHECKBOX_LABELS.selectionLimit}</span>
      <InputNum
        placeholder="0000"
        className="ss-user-setting-input-limit-character"
        max={checkbox.selection_limit_to}
        min={0}
        disabled={!checkbox.require}
        value={checkbox.selection_limit_from}
        onChange={changeContent('selection_limit_from')}
      />
      <span className="ss-range-separator">{PULL_DOWN_LABELS.rangeSeparator}</span>
      <InputNum
        placeholder="0000"
        className="ss-user-setting-input-limit-character"
        min={checkbox.selection_limit_from || 0}
        max={numberMaxLength}
        value={checkbox.selection_limit_to}
        onChange={changeContent('selection_limit_to')}
      />
    </div>
  );

  return (
    <>
      {renderAllItemChecked()}
      {renderSelectionLimit()}
    </>
  );
};

export default CheckboxSelectionOptions;
