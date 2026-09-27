import { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { MDBIcon } from 'mdbreact';
import InputCustom from './scenarioCommon/InputCustom';
import { getColor } from 'v2/views/Preview/PreviewComponent/Utils';
import { LABELS } from 'v2/views/Preview/PreviewComponent/Constants';
import {
  GENDER_COLOR_FALLBACK,
  toGenderColorPickerValue,
} from './constants/genderOptionDefaults';
import 'v2/views/ScenarioSetting/styles/option-gender-config.css';

const PREVIEW_TYPE_TEXT = 'text';
const PREVIEW_TYPE_COLOR = 'color';
const PREVIEW_TYPE_IMAGE = 'image';
const PREVIEW_UNIT_PX = 'px';
const PREVIEW_CLASS_COLOR = 'preview preview--color';
const PREVIEW_CLASS_TEXT = 'preview preview--text';
const PREVIEW_CLASS_IMAGE = 'preview preview--image';
const INPUT_TYPE_COLOR = 'color';
const INPUT_TYPE_NUMBER = 'number';
const COLOR_NORMALIZE_OPTIONS = {
  toUpperCase: true,
  trim: true,
  addHash: true,
  ignoreEmpty: true,
};

const defaultGenderConfig = {
  preset: {
    button: {
      default: '',
      hover: '',
      selected: '',
    },
    icon: {
      url: '',
      height: 0,
      width: 0,
      default: '',
      hover: '',
      selected: '',
    },
  },
};

const buildGenderConfig = (value) => ({
  ...defaultGenderConfig,
  ...value,
  preset: {
    ...defaultGenderConfig.preset,
    ...(value?.preset || {}),
    button: {
      ...defaultGenderConfig.preset.button,
      ...(value?.preset?.button || {}),
    },
    icon: {
      ...defaultGenderConfig.preset.icon,
      ...(value?.preset?.icon || {}),
    },
  },
});

const InputWithPreview = ({ preview, onColorPick, ...props }) => {
  const isColorPreview = preview.type === PREVIEW_TYPE_COLOR;
  const isImagePreview = preview.type === PREVIEW_TYPE_IMAGE;
  const isTextPreview = preview.type === PREVIEW_TYPE_TEXT;

  const getPreviewClassName = () => {
    if (isColorPreview) return PREVIEW_CLASS_COLOR;
    if (isImagePreview) return PREVIEW_CLASS_IMAGE;
    return PREVIEW_CLASS_TEXT;
  };

  const previewStyle = isColorPreview
    ? { '--preview-bg': getColor(preview.color) || GENDER_COLOR_FALLBACK }
    : undefined;
  const showTextPreview = isTextPreview && !!preview.text?.length;
  const showImagePreview = isImagePreview && !!preview.image;
  const showPreview = isColorPreview || showTextPreview || showImagePreview;

  return (
    <div className="input-with-preview">
      <InputCustom {...props} />
      {showPreview && (
        <div className={getPreviewClassName()} style={previewStyle}>
          {showTextPreview && (
            <p className="preview-text">{preview.text}</p>
          )}
          {showImagePreview && (
            <img
              className="preview-image"
              src={preview.image}
              alt={LABELS.GENDER_OPTIONS.ICON_URL}
            />
          )}
          {isColorPreview && (
            <input
              className="preview-color-input"
              type={INPUT_TYPE_COLOR}
              value={toGenderColorPickerValue(preview.color)}
              onChange={(event) => onColorPick?.(event.target.value)}
            />
          )}
        </div>
      )}
    </div>
  );
};

InputWithPreview.propTypes = {
  preview: PropTypes.shape({
    type: PropTypes.string.isRequired,
    text: PropTypes.string,
    color: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
  onColorPick: PropTypes.func,
};

InputWithPreview.defaultProps = {
  onColorPick: undefined,
};

const OptionGenderConfig = ({ value, onChange, onOpenIconFilePicker }) => {
  const [genderConfig, setGenderConfig] = useState(() => buildGenderConfig(value));

  useEffect(() => {
    setGenderConfig(buildGenderConfig(value));
  }, [value]);

  const handleChangePreset = (type, field, isColor = true) => (nextValue) => {
    if (!type || !field) return;

    const newConfig = {
      ...genderConfig,
      preset: {
        ...genderConfig.preset,
        [type]: {
          ...genderConfig.preset[type],
          [field]: isColor
            ? getColor(nextValue, COLOR_NORMALIZE_OPTIONS)
            : nextValue,
        },
      },
    };
    setGenderConfig(newConfig);
    onChange(newConfig);
  };

  const iconUrl = genderConfig.preset.icon.url;

  return (
    <div className="option-gender-config">
      <div className="icon-config-holder">
        {!!iconUrl && (
          <Fragment>
            <InputWithPreview
              placeholder={LABELS.GENDER_OPTIONS.ICON_HEIGHT}
              preview={{ type: PREVIEW_TYPE_TEXT, text: PREVIEW_UNIT_PX }}
              value={genderConfig.preset.icon.height}
              onChange={handleChangePreset('icon', 'height', false)}
              type={INPUT_TYPE_NUMBER}
            />
            <InputWithPreview
              placeholder={LABELS.GENDER_OPTIONS.ICON_WIDTH}
              preview={{ type: PREVIEW_TYPE_TEXT, text: PREVIEW_UNIT_PX }}
              value={genderConfig.preset.icon.width}
              onChange={handleChangePreset('icon', 'width', false)}
              type={INPUT_TYPE_NUMBER}
            />
          </Fragment>
        )}
        <div className="option-gender-config__icon-url-row">
          <InputWithPreview
            placeholder={LABELS.GENDER_OPTIONS.ICON_URL}
            value={iconUrl}
            onChange={handleChangePreset('icon', 'url', false)}
            preview={{ type: PREVIEW_TYPE_IMAGE, image: iconUrl }}
          />
          {!!onOpenIconFilePicker && (
            <MDBIcon
              onClick={onOpenIconFilePicker}
              fas
              icon="paperclip"
              className="option-gender-config__paperclip"
            />
          )}
        </div>
      </div>
      <div className="events-config-holder">
        <div className="preset">
          <InputWithPreview
            placeholder={LABELS.GENDER_OPTIONS.ICON_DEFAULT}
            onChange={handleChangePreset('icon', 'default')}
            onColorPick={handleChangePreset('icon', 'default')}
            value={genderConfig.preset.icon.default}
            preview={{ type: PREVIEW_TYPE_COLOR, color: genderConfig.preset.icon.default }}
          />
          <InputWithPreview
            placeholder={LABELS.GENDER_OPTIONS.ICON_HOVER}
            onChange={handleChangePreset('icon', 'hover')}
            onColorPick={handleChangePreset('icon', 'hover')}
            value={genderConfig.preset.icon.hover}
            preview={{ type: PREVIEW_TYPE_COLOR, color: genderConfig.preset.icon.hover }}
          />
          <InputWithPreview
            placeholder={LABELS.GENDER_OPTIONS.ICON_SELECTED}
            onChange={handleChangePreset('icon', 'selected')}
            onColorPick={handleChangePreset('icon', 'selected')}
            value={genderConfig.preset.icon.selected}
            preview={{ type: PREVIEW_TYPE_COLOR, color: genderConfig.preset.icon.selected }}
          />
        </div>
        <div className="preset">
          <InputWithPreview
            placeholder={LABELS.GENDER_OPTIONS.BUTTON_DEFAULT}
            onChange={handleChangePreset('button', 'default')}
            onColorPick={handleChangePreset('button', 'default')}
            value={genderConfig.preset.button.default}
            preview={{ type: PREVIEW_TYPE_COLOR, color: genderConfig.preset.button.default }}
          />
          <InputWithPreview
            placeholder={LABELS.GENDER_OPTIONS.BUTTON_HOVER}
            onChange={handleChangePreset('button', 'hover')}
            onColorPick={handleChangePreset('button', 'hover')}
            value={genderConfig.preset.button.hover}
            preview={{ type: PREVIEW_TYPE_COLOR, color: genderConfig.preset.button.hover }}
          />
          <InputWithPreview
            placeholder={LABELS.GENDER_OPTIONS.BUTTON_SELECTED}
            onChange={handleChangePreset('button', 'selected')}
            onColorPick={handleChangePreset('button', 'selected')}
            value={genderConfig.preset.button.selected}
            preview={{ type: PREVIEW_TYPE_COLOR, color: genderConfig.preset.button.selected }}
          />
        </div>
      </div>
    </div>
  );
};

OptionGenderConfig.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onOpenIconFilePicker: PropTypes.func,
};

OptionGenderConfig.defaultProps = {
  value: defaultGenderConfig,
  onOpenIconFilePicker: undefined,
};

export default OptionGenderConfig;
