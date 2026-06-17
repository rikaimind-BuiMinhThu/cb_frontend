import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@mui/material';
import SelectCustom from '../../scenarioComon/SelectCustom';
import InputCustom from '../../scenarioComon/InputCustom';
import { FUKUSHASHIKI_SEARCH_MODE_OPTIONS, FUKUSHASHIKI_SEARCH_VALUE_LABELS } from '../../../../../../variables/constants';
import { FUKUSHASHIKI_VARIANTS, SETTING_LABELS } from '../../constants/scenarioSettingLabels';

const FukushashikiSearchRow = ({
  mode,
  inputValue,
  onModeChange,
  onInputChange,
  variant = FUKUSHASHIKI_VARIANTS.DEFAULT,
  useFukushashiki = false,
  maxLength = 250,
  rowClassName = '',
  selectId = 'title',
}) => {
  const inputGuideText = FUKUSHASHIKI_SEARCH_VALUE_LABELS[mode] || '';

  const renderSelect = () => (
    <SelectCustom
      id={selectId}
      className="ss-select--full"
      value={mode}
      onChange={onModeChange}
      data={FUKUSHASHIKI_SEARCH_MODE_OPTIONS}
      keyValue="key"
      placeholder={SETTING_LABELS.fukushashikiModePlaceholder}
    />
  );

  const renderInput = () => (
    <InputCustom
      className="ss-input--full"
      labelClassName="ss-input-label--full"
      onChange={onInputChange}
      value={inputValue}
      placeholder={inputGuideText}
      useFukushashiki={useFukushashiki}
      maxLength={maxLength}
    />
  );

  switch (variant) {
    case FUKUSHASHIKI_VARIANTS.TEXT_INPUT_ROW:
      return (
        <div className={`ss-text-input-setting__fukushashiki-row ss-user-setting__item-bottom ${rowClassName}`.trim()}>
          <Tooltip title={SETTING_LABELS.fukushashikiModeTooltip} placement="top">
            <div className="ss-text-input-setting__fukushashiki-row__mode">
              {renderSelect()}
            </div>
          </Tooltip>
          <div className="ss-text-input-setting__fukushashiki-row__value">
            {renderInput()}
          </div>
        </div>
      );
    case FUKUSHASHIKI_VARIANTS.COMPACT:
      return (
        <div className={`ss-fukushashiki-row ${rowClassName}`.trim()}>
          <Tooltip title={SETTING_LABELS.fukushashikiModeTooltip} placement="top">
            <div className="ss-fukushashiki-row__mode--22">
              {renderSelect()}
            </div>
          </Tooltip>
          <div className="ss-fukushashiki-row__value--67">
            {renderInput()}
          </div>
        </div>
      );
    case FUKUSHASHIKI_VARIANTS.DEFAULT:
    default:
      return (
        <div className={`ss-fukushashiki-row--default ${rowClassName}`.trim()}>
          <Tooltip title={SETTING_LABELS.fukushashikiModeTooltip} placement="top">
            <div className="ss-fukushashiki-row__mode--25">
              {renderSelect()}
            </div>
          </Tooltip>
          <Tooltip title={inputGuideText} placement="top">
            <div className="ss-fukushashiki-row__value--flex">
              {renderInput()}
            </div>
          </Tooltip>
        </div>
      );
  }
};

FukushashikiSearchRow.propTypes = {
  mode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  inputValue: PropTypes.string,
  onModeChange: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
  variant: PropTypes.string,
  useFukushashiki: PropTypes.bool,
  maxLength: PropTypes.number,
  rowClassName: PropTypes.string,
  selectId: PropTypes.string,
};

export default FukushashikiSearchRow;
