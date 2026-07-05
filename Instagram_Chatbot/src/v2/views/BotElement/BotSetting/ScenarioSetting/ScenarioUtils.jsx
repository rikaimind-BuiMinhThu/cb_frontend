import React from 'react';
import FukushashikiSearchRow from './contentSettings/shared/FukushashikiSearchRow';
import { FUKUSHASHIKI_VARIANTS } from './constants/scenarioSettingLabels';

export const renderFukushashikiSetting = ({
  mode,
  inputValue,
  onModeChange,
  onInputChange,
  variant = FUKUSHASHIKI_VARIANTS.DEFAULT,
  useFukushashiki = false,
  maxLength,
  rowClassName = '',
  selectId = 'title',
}) => (
  <FukushashikiSearchRow
    mode={mode}
    inputValue={inputValue}
    onModeChange={onModeChange}
    onInputChange={onInputChange}
    variant={variant}
    useFukushashiki={useFukushashiki}
    maxLength={maxLength}
    rowClassName={rowClassName}
    selectId={selectId}
  />
);
