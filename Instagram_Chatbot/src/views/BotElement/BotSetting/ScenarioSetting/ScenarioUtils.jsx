import React from 'react';
import { Tooltip } from '@mui/material';
import SelectCustom from './scenarioComon/SelectCustom';
import InputCustom from './scenarioComon/InputCustom';
import {
  FUKUSHASHIKI_SEARCH_MODE_OPTIONS,
  FUKUSHASHIKI_SEARCH_VALUE_LABELS,
} from '../../../../variables/constants';

export const renderFukushashikiSetting = ({
  mode,
  inputValue,
  onModeChange,
  onInputChange,
  variant = 'default',
  useFukushashiki = false,
  maxLength,
  rowClassName = '',
  rowStyle = {},
  selectId = 'title',
}) => {
  const inputGuideText = FUKUSHASHIKI_SEARCH_VALUE_LABELS[mode] || '';

  const selectElement = (
    <SelectCustom
      id={selectId}
      style={{ width: '100%' }}
      value={mode}
      onChange={onModeChange}
      data={FUKUSHASHIKI_SEARCH_MODE_OPTIONS}
      keyValue="key"
      placeholder="複写先要素の取得方法をお選びください"
    />
  );

  const inputElement = (
    <InputCustom
      styleLabel={{ width: '100%' }}
      style={{ width: '100%' }}
      onChange={onInputChange}
      value={inputValue}
      placeholder={inputGuideText}
      useFukushashiki={useFukushashiki}
      maxLength={maxLength}
    />
  );

  if (variant === 'textInputRow') {
    return (
      <div className={`ss-text-input-setting__fukushashiki-row ss-user-setting__item-bottom ${rowClassName}`.trim()}>
        <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
          <div className="ss-text-input-setting__fukushashiki-row__mode">
            {selectElement}
          </div>
        </Tooltip>
        <div className="ss-text-input-setting__fukushashiki-row__value">
          {inputElement}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        className={rowClassName || 'ss-user-setting__item-bottom'}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', ...rowStyle }}
      >
        <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
          <div style={{ flexBasis: '22%', maxWidth: '22%' }}>
            {selectElement}
          </div>
        </Tooltip>
        <div style={{ flexBasis: '67%', maxWidth: '67%' }}>
          {inputElement}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`ss-user-setting__item-row ${rowClassName}`.trim()}
      style={{ display: 'flex', gap: '10px', width: '100%', ...rowStyle }}
    >
      <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
        <div style={{ width: '25%' }}>
          {selectElement}
        </div>
      </Tooltip>
      <Tooltip title={inputGuideText} placement="top">
        <div style={{ flex: '75%' }}>
          {inputElement}
        </div>
      </Tooltip>
    </div>
  );
};
