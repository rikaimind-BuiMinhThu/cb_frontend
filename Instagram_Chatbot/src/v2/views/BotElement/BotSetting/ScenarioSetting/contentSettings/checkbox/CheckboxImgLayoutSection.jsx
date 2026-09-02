import React from 'react';
import PropTypes from 'prop-types';
import InputCustom from '../../scenarioComon/InputCustom';
import SelectCustom from '../../scenarioComon/SelectCustom';
import {
  RADIO_IMG_COLUMN_OPTIONS,
  RADIO_IMG_DIRECTION_HORIZONTAL,
  RADIO_IMG_DIRECTION_OPTIONS,
  RADIO_IMG_LAYOUT_SECTION_LABELS,
  RADIO_IMG_SCROLL_COLUMN_OPTIONS,
  RADIO_IMG_SCROLL_ENABLED,
  RADIO_IMG_SCROLL_NONE,
  RADIO_IMG_SCROLL_OPTIONS,
  RADIO_IMG_WIDTH_MODE_CUSTOM,
  RADIO_IMG_WIDTH_MODE_EQUAL,
  RADIO_IMG_WIDTH_MODE_OPTIONS,
} from '../../constants/radioButtonImgLayoutConstants';
import {
  buildImgLayoutPayload,
  decodeLayoutType,
  encodeLayoutType,
  getCustomWidthColumnCount,
  normalizePxValue,
  normalizeCheckboxImgLayout,
  sumCustomWidths,
} from 'v2/views/BotElement/BotSetting/ScenarioSetting/utils/radioButtonImgLayoutUtils';

const DEFAULT_OPTION_PADDING = '0px';
const DEFAULT_OPTION_MARGIN = '5px';

const CheckboxImgLayoutSection = ({ checkbox, changeContent }) => {
  const layout = normalizeCheckboxImgLayout(checkbox);
  const { direction, columns, widthMode, scroll } = decodeLayoutType(layout.type);
  const isHorizontal = direction === RADIO_IMG_DIRECTION_HORIZONTAL;
  const isScrollEnabled = scroll === RADIO_IMG_SCROLL_ENABLED;
  const columnOptions = isScrollEnabled ? RADIO_IMG_SCROLL_COLUMN_OPTIONS : RADIO_IMG_COLUMN_OPTIONS;
  const showCustomWidths = isHorizontal && !isScrollEnabled && widthMode === RADIO_IMG_WIDTH_MODE_CUSTOM;
  const customColumnCount = getCustomWidthColumnCount(layout.type);

  const updateLayout = (nextDirection, nextColumns, nextWidthMode, nextScroll, resetWidths = false) => {
    const nextType = encodeLayoutType({
      direction: nextDirection,
      columns: nextColumns,
      widthMode: nextWidthMode,
      scroll: nextScroll,
    });
    changeContent('img_layout')(buildImgLayoutPayload(nextType, layout.custom_widths, resetWidths));
  };

  const handleDirectionChange = (value) => {
    if (value === RADIO_IMG_DIRECTION_HORIZONTAL) {
      updateLayout(value, columns, widthMode, scroll, false);
      return;
    }
    updateLayout(value, columns, widthMode, RADIO_IMG_SCROLL_NONE, false);
  };

  const handleScrollChange = (value) => {
    if (value === RADIO_IMG_SCROLL_ENABLED) {
      updateLayout(direction, '4', RADIO_IMG_WIDTH_MODE_EQUAL, value, false);
      return;
    }
    updateLayout(direction, '2', RADIO_IMG_WIDTH_MODE_EQUAL, value, false);
  };

  const handleColumnsChange = (value) => {
    const shouldResetWidths = !isScrollEnabled && widthMode === RADIO_IMG_WIDTH_MODE_CUSTOM;
    updateLayout(direction, value, widthMode, scroll, shouldResetWidths);
  };

  const handleWidthModeChange = (value) => {
    updateLayout(direction, columns, value, scroll, value === RADIO_IMG_WIDTH_MODE_CUSTOM);
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
    <div className="ss-checkbox-img-layout-section">
      <div className="ss-checkbox-img-layout-section__title">
        {RADIO_IMG_LAYOUT_SECTION_LABELS.title}
      </div>

      <div className={`ss-checkbox-img-layout-section__controls-row${!isHorizontal ? ' ss-checkbox-img-layout-section__controls-row--single' : ''}`}>
        <div className="ss-checkbox-img-layout-section__control">
          <span className="ss-checkbox-img-layout-section__label">
            {RADIO_IMG_LAYOUT_SECTION_LABELS.direction}
          </span>
          <SelectCustom
            id="checkbox-img-layout-direction"
            className="ss-checkbox-img-layout-section__select"
            value={direction}
            data={RADIO_IMG_DIRECTION_OPTIONS}
            onChange={handleDirectionChange}
            keyValue="key"
          />
        </div>

        {isHorizontal && (
          <>
            <div className="ss-checkbox-img-layout-section__control">
              <span className="ss-checkbox-img-layout-section__label">
                {RADIO_IMG_LAYOUT_SECTION_LABELS.scroll}
              </span>
              <SelectCustom
                id="checkbox-img-layout-scroll"
                className="ss-checkbox-img-layout-section__select"
                value={scroll}
                data={RADIO_IMG_SCROLL_OPTIONS}
                onChange={handleScrollChange}
                keyValue="key"
              />
            </div>
            <div className="ss-checkbox-img-layout-section__control">
              <span className="ss-checkbox-img-layout-section__label">
                {RADIO_IMG_LAYOUT_SECTION_LABELS.columns}
              </span>
              <SelectCustom
                id="checkbox-img-layout-columns"
                className="ss-checkbox-img-layout-section__select"
                value={columns}
                data={columnOptions}
                onChange={handleColumnsChange}
                keyValue="key"
              />
            </div>
            {!isScrollEnabled && (
              <div className="ss-checkbox-img-layout-section__control">
                <span className="ss-checkbox-img-layout-section__label">
                  {RADIO_IMG_LAYOUT_SECTION_LABELS.widthMode}
                </span>
                <SelectCustom
                  id="checkbox-img-layout-width-mode"
                  className="ss-checkbox-img-layout-section__select"
                  value={widthMode}
                  data={RADIO_IMG_WIDTH_MODE_OPTIONS}
                  onChange={handleWidthModeChange}
                  keyValue="key"
                />
              </div>
            )}
          </>
        )}
      </div>

      {showCustomWidths && (
        <div className="ss-checkbox-img-layout-section__field">
          <span className="ss-checkbox-img-layout-section__label">
            {RADIO_IMG_LAYOUT_SECTION_LABELS.customWidths}
          </span>
          <div className="ss-checkbox-img-layout-section__custom-widths">
            {Array.from({ length: customColumnCount }).map((_, index) => (
              <div key={index} className="ss-checkbox-img-layout-section__input-group">
                <InputCustom
                  className="ss-checkbox-img-layout-section__width-input"
                  value={layout.custom_widths[index] || ''}
                  onChange={(value) => handleCustomWidthChange(index, value)}
                  placeholder={`列${index + 1}`}
                />
                <span className="ss-checkbox-img-layout-section__input-suffix">%</span>
              </div>
            ))}
          </div>
          <div className={`ss-checkbox-img-layout-section__hint${widthSum !== 100 ? ' ss-checkbox-img-layout-section__hint--warn' : ''}`}>
            {RADIO_IMG_LAYOUT_SECTION_LABELS.customWidthsHint}
            {widthSum !== 100 && ` (現在: ${widthSum}%)`}
          </div>
        </div>
      )}

      <div className="ss-checkbox-img-layout-section__spacing-row">
        <div className="ss-checkbox-img-layout-section__spacing-field">
          <span className="ss-checkbox-img-layout-section__label">
            {RADIO_IMG_LAYOUT_SECTION_LABELS.optionPadding}
          </span>
          <div className="ss-checkbox-img-layout-section__input-group">
            <InputCustom
              className="ss-checkbox-img-layout-section__spacing-input"
              value={layout.option_padding.replace(/px$/i, '')}
              onChange={handleSpacingChange('option_padding')}
              placeholder="0"
            />
            <span className="ss-checkbox-img-layout-section__input-suffix">px</span>
          </div>
        </div>
        <div className="ss-checkbox-img-layout-section__spacing-field">
          <span className="ss-checkbox-img-layout-section__label">
            {RADIO_IMG_LAYOUT_SECTION_LABELS.optionMargin}
          </span>
          <div className="ss-checkbox-img-layout-section__input-group">
            <InputCustom
              className="ss-checkbox-img-layout-section__spacing-input"
              value={layout.option_margin.replace(/px$/i, '')}
              onChange={handleSpacingChange('option_margin')}
              placeholder="5"
            />
            <span className="ss-checkbox-img-layout-section__input-suffix">px</span>
          </div>
        </div>
      </div>
    </div>
  );
};

CheckboxImgLayoutSection.propTypes = {
  checkbox: PropTypes.object.isRequired,
  changeContent: PropTypes.func.isRequired,
};

export default CheckboxImgLayoutSection;
