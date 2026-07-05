import React from 'react';
import PropTypes from 'prop-types';
import InputCustom from '../../scenarioComon/InputCustom';
import SelectCustom from '../../scenarioComon/SelectCustom';
import {
  RADIO_IMG_COLUMN_OPTIONS,
  RADIO_IMG_DIRECTION_HORIZONTAL,
  RADIO_IMG_DIRECTION_OPTIONS,
  RADIO_IMG_LAYOUT_SECTION_LABELS,
  RADIO_IMG_WIDTH_MODE_CUSTOM,
  RADIO_IMG_WIDTH_MODE_OPTIONS,
} from '../../constants/radioButtonImgLayoutConstants';
import {
  buildImgLayoutPayload,
  decodeLayoutType,
  encodeLayoutType,
  getCustomWidthColumnCount,
  isCustomWidthLayout,
  normalizePxValue,
  normalizeRadioButtonImgLayout,
  sumCustomWidths,
} from '../../utils/radioButtonImgLayoutUtils';

const DEFAULT_OPTION_PADDING = '0px';
const DEFAULT_OPTION_MARGIN = '5px';

const RadioButtonImgLayoutSection = ({ radioButton, changeContent }) => {
  const layout = normalizeRadioButtonImgLayout(radioButton);
  const { direction, columns, widthMode } = decodeLayoutType(layout.type);
  const isHorizontal = direction === RADIO_IMG_DIRECTION_HORIZONTAL;
  const showCustomWidths = isHorizontal && widthMode === RADIO_IMG_WIDTH_MODE_CUSTOM;
  const customColumnCount = getCustomWidthColumnCount(layout.type);

  const updateLayout = (nextDirection, nextColumns, nextWidthMode, resetWidths = false) => {
    const nextType = encodeLayoutType({
      direction: nextDirection,
      columns: nextColumns,
      widthMode: nextWidthMode,
    });
    changeContent('img_layout')(buildImgLayoutPayload(nextType, layout.custom_widths, resetWidths));
  };

  const handleDirectionChange = (value) => {
    if (value === RADIO_IMG_DIRECTION_HORIZONTAL) {
      updateLayout(value, columns, widthMode, false);
      return;
    }
    updateLayout(value, columns, widthMode, false);
  };

  const handleColumnsChange = (value) => {
    const shouldResetWidths = widthMode === RADIO_IMG_WIDTH_MODE_CUSTOM;
    updateLayout(direction, value, widthMode, shouldResetWidths);
  };

  const handleWidthModeChange = (value) => {
    updateLayout(direction, columns, value, value === RADIO_IMG_WIDTH_MODE_CUSTOM);
  };

  const handleCustomWidthChange = (index, value) => {
    const nextWidths = [...layout.custom_widths];
    nextWidths[index] = value.replace(/[^\d.]/g, '');
    changeContent('img_layout')(buildImgLayoutPayload(layout.type, nextWidths, false));
  };

  const handleSpacingChange = (field) => (value) => {
    const fallback = field === 'option_padding' ? DEFAULT_OPTION_PADDING : DEFAULT_OPTION_MARGIN;
    changeContent(field)(normalizePxValue(value, fallback));
  };

  const widthSum = showCustomWidths
    ? sumCustomWidths(layout.custom_widths.slice(0, customColumnCount))
    : 100;

  return (
    <div className="ss-radio-button-img-layout-section">
      <div className="ss-radio-button-img-layout-section__title">
        {RADIO_IMG_LAYOUT_SECTION_LABELS.title}
      </div>

      <div className={`ss-radio-button-img-layout-section__controls-row${!isHorizontal ? ' ss-radio-button-img-layout-section__controls-row--single' : ''}`}>
        <div className="ss-radio-button-img-layout-section__control">
          <span className="ss-radio-button-img-layout-section__label">
            {RADIO_IMG_LAYOUT_SECTION_LABELS.direction}
          </span>
          <SelectCustom
            id="radio-img-layout-direction"
            className="ss-radio-button-img-layout-section__select"
            value={direction}
            data={RADIO_IMG_DIRECTION_OPTIONS}
            onChange={handleDirectionChange}
            keyValue="key"
          />
        </div>

        {isHorizontal && (
          <>
            <div className="ss-radio-button-img-layout-section__control">
              <span className="ss-radio-button-img-layout-section__label">
                {RADIO_IMG_LAYOUT_SECTION_LABELS.columns}
              </span>
              <SelectCustom
                id="radio-img-layout-columns"
                className="ss-radio-button-img-layout-section__select"
                value={columns}
                data={RADIO_IMG_COLUMN_OPTIONS}
                onChange={handleColumnsChange}
                keyValue="key"
              />
            </div>
            <div className="ss-radio-button-img-layout-section__control">
              <span className="ss-radio-button-img-layout-section__label">
                {RADIO_IMG_LAYOUT_SECTION_LABELS.widthMode}
              </span>
              <SelectCustom
                id="radio-img-layout-width-mode"
                className="ss-radio-button-img-layout-section__select"
                value={widthMode}
                data={RADIO_IMG_WIDTH_MODE_OPTIONS}
                onChange={handleWidthModeChange}
                keyValue="key"
              />
            </div>
          </>
        )}
      </div>

      {showCustomWidths && (
        <div className="ss-radio-button-img-layout-section__field">
          <span className="ss-radio-button-img-layout-section__label">
            {RADIO_IMG_LAYOUT_SECTION_LABELS.customWidths}
          </span>
          <div className="ss-radio-button-img-layout-section__custom-widths">
            {Array.from({ length: customColumnCount }).map((_, index) => (
              <div key={index} className="ss-radio-button-img-layout-section__input-group">
                <InputCustom
                  className="ss-radio-button-img-layout-section__width-input"
                  value={layout.custom_widths[index] || ''}
                  onChange={(value) => handleCustomWidthChange(index, value)}
                  placeholder={`列${index + 1}`}
                />
                <span className="ss-radio-button-img-layout-section__input-suffix">%</span>
              </div>
            ))}
          </div>
          <div className={`ss-radio-button-img-layout-section__hint${widthSum !== 100 ? ' ss-radio-button-img-layout-section__hint--warn' : ''}`}>
            {RADIO_IMG_LAYOUT_SECTION_LABELS.customWidthsHint}
            {widthSum !== 100 && ` (現在: ${widthSum}%)`}
          </div>
        </div>
      )}

      <div className="ss-radio-button-img-layout-section__spacing-row">
        <div className="ss-radio-button-img-layout-section__spacing-field">
          <span className="ss-radio-button-img-layout-section__label">
            {RADIO_IMG_LAYOUT_SECTION_LABELS.optionPadding}
          </span>
          <div className="ss-radio-button-img-layout-section__input-group">
            <InputCustom
              className="ss-radio-button-img-layout-section__spacing-input"
              value={layout.option_padding.replace(/px$/i, '')}
              onChange={handleSpacingChange('option_padding')}
              placeholder="0"
            />
            <span className="ss-radio-button-img-layout-section__input-suffix">px</span>
          </div>
        </div>
        <div className="ss-radio-button-img-layout-section__spacing-field">
          <span className="ss-radio-button-img-layout-section__label">
            {RADIO_IMG_LAYOUT_SECTION_LABELS.optionMargin}
          </span>
          <div className="ss-radio-button-img-layout-section__input-group">
            <InputCustom
              className="ss-radio-button-img-layout-section__spacing-input"
              value={layout.option_margin.replace(/px$/i, '')}
              onChange={handleSpacingChange('option_margin')}
              placeholder="5"
            />
            <span className="ss-radio-button-img-layout-section__input-suffix">px</span>
          </div>
        </div>
      </div>
    </div>
  );
};

RadioButtonImgLayoutSection.propTypes = {
  radioButton: PropTypes.object.isRequired,
  changeContent: PropTypes.func.isRequired,
};

export default RadioButtonImgLayoutSection;
