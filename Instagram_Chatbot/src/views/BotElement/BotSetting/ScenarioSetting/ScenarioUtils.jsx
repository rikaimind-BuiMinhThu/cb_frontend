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
  rowStyle = {},
}) => {
  const inputGuideText = FUKUSHASHIKI_SEARCH_VALUE_LABELS[mode] || '';

  return (
    <div
      className="ss-user-setting__item-row"
      style={{ display: 'flex', gap: '10px', width: '100%', ...rowStyle }}
    >
      <Tooltip title="複写先要素の取得方法をお選びください" placement="top">
        <div style={{ width: '25%' }}>
          <SelectCustom
            id="title"
            style={{ width: '100%' }}
            value={mode}
            onChange={onModeChange}
            data={FUKUSHASHIKI_SEARCH_MODE_OPTIONS}
            keyValue="key"
            placeholder="複写先要素の取得方法をお選びください"
          />
        </div>
      </Tooltip>
      <Tooltip title={inputGuideText} placement="top">
        <div style={{ flex: '75%' }}>
          <InputCustom
            styleLabel={{ width: '100%' }}
            style={{ width: '100%' }}
            onChange={onInputChange}
            value={inputValue}
            placeholder={inputGuideText}
          />
        </div>
      </Tooltip>
    </div>
  );
};
