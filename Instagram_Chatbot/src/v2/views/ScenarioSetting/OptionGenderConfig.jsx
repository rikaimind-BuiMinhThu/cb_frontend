import { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import InputCustom from './scenarioCommon/InputCustom';
import { getColor } from 'v2/views/Preview/PreviewComponent/Utils';
import { LABELS } from 'v2/views/Preview/PreviewComponent/Constants';
import 'v2/views/ScenarioSetting/styles/option-gender-config.css';

const PREVIEW_TYPE_TEXT = 'text';
const PREVIEW_TYPE_COLOR = 'color';
const PREVIEW_UNIT_PX = 'px';
const PREVIEW_CLASS_COLOR = 'preview preview--color';
const PREVIEW_CLASS_TEXT = 'preview preview--text';

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

const InputWithPreview = ({ preview, ...props }) => {
  const isColorPreview = preview.type === PREVIEW_TYPE_COLOR;
  const previewClassName = isColorPreview ? PREVIEW_CLASS_COLOR : PREVIEW_CLASS_TEXT;
  const previewStyle = isColorPreview
    ? { '--preview-bg': getColor(preview.color) || '#ffffff' }
    : undefined;
  const showPreview = isColorPreview || !!preview[preview.type]?.length;

  return (
    <div className="input-with-preview">
      <InputCustom {...props} />
      {showPreview && (
        <div className={previewClassName} style={previewStyle}>
          {preview.type === PREVIEW_TYPE_TEXT && (
            <p className="preview-text">{preview.text}</p>
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
  }).isRequired,
};

const OptionGenderConfig = ({ value, onChange }) => {
  const [genderConfig, setGenderConfig] = useState({
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

  const handleChangePreset = (type, field, isColor = true) => (nextValue) => {
    if (!type || !field) return;

    const newConfig = {
      ...genderConfig,
      preset: {
        ...genderConfig.preset,
        [type]: {
          ...genderConfig.preset[type],
          [field]: isColor
            ? getColor(nextValue, {
              toUpperCase: true,
              trim: true,
              addHash: true,
              ignoreEmpty: true,
            })
            : nextValue,
        },
      },
    };
    setGenderConfig(newConfig);
    onChange(newConfig);
  };

  return (
    <div className="option-gender-config">
      <div className="icon-config-holder">
        {!!genderConfig.preset.icon.url && (
          <Fragment>
            <InputWithPreview
              placeholder={LABELS.GENDER_OPTIONS.ICON_HEIGHT}
              preview={{ type: PREVIEW_TYPE_TEXT, text: PREVIEW_UNIT_PX }}
              value={genderConfig.preset.icon.height}
              onChange={handleChangePreset('icon', 'height', false)}
              type="number"
            />
            <InputWithPreview
              placeholder={LABELS.GENDER_OPTIONS.ICON_WIDTH}
              preview={{ type: PREVIEW_TYPE_TEXT, text: PREVIEW_UNIT_PX }}
              value={genderConfig.preset.icon.width}
              onChange={handleChangePreset('icon', 'width', false)}
              type="number"
            />
          </Fragment>
        )}
        <InputCustom
          placeholder={LABELS.GENDER_OPTIONS.ICON_URL}
          value={genderConfig.preset.icon.url}
          onChange={handleChangePreset('icon', 'url', false)}
        />
      </div>
      <div className="events-config-holder">
        <div className="preset">
          <InputWithPreview
            placeholder={LABELS.GENDER_OPTIONS.ICON_DEFAULT}
            onChange={handleChangePreset('icon', 'default')}
            value={genderConfig.preset.icon.default}
            preview={{ type: PREVIEW_TYPE_COLOR, color: genderConfig.preset.icon.default }}
          />
          <InputWithPreview
            placeholder={LABELS.GENDER_OPTIONS.ICON_HOVER}
            onChange={handleChangePreset('icon', 'hover')}
            value={genderConfig.preset.icon.hover}
            preview={{ type: PREVIEW_TYPE_COLOR, color: genderConfig.preset.icon.hover }}
          />
          <InputWithPreview
            placeholder={LABELS.GENDER_OPTIONS.ICON_SELECTED}
            onChange={handleChangePreset('icon', 'selected')}
            value={genderConfig.preset.icon.selected}
            preview={{ type: PREVIEW_TYPE_COLOR, color: genderConfig.preset.icon.selected }}
          />
        </div>
        <div className="preset">
          <InputWithPreview
            placeholder={LABELS.GENDER_OPTIONS.BUTTON_DEFAULT}
            onChange={handleChangePreset('button', 'default')}
            value={genderConfig.preset.button.default}
            preview={{ type: PREVIEW_TYPE_COLOR, color: genderConfig.preset.button.default }}
          />
          <InputWithPreview
            placeholder={LABELS.GENDER_OPTIONS.BUTTON_HOVER}
            onChange={handleChangePreset('button', 'hover')}
            value={genderConfig.preset.button.hover}
            preview={{ type: PREVIEW_TYPE_COLOR, color: genderConfig.preset.button.hover }}
          />
          <InputWithPreview
            placeholder={LABELS.GENDER_OPTIONS.BUTTON_SELECTED}
            onChange={handleChangePreset('button', 'selected')}
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
};

OptionGenderConfig.defaultProps = {
  value: defaultGenderConfig,
};

export default OptionGenderConfig;
