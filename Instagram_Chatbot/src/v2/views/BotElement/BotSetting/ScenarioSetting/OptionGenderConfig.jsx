import InputCustom from "./scenarioComon/InputCustom";
import "../../../../assets/css/bot/scenario/option-gender-config.css";
import { Fragment, useState } from "react";
import { getColor } from "v2/views/BotElement/BotSetting/PreviewComponent/Utils";
import { LABELS } from "v2/views/BotElement/BotSetting/PreviewComponent/Constants";

const defaultGenderConfig = {
  preset: {
    button: {
      default: "",
      hover: "",
      selected: "",
    },
    icon: {
      url: "",
      height: 0,
      width: 0,
      default: "",
      hover: "",
      selected: "",
    },
  },
};

const OptionGenderConfig = ({ value, onChange })  => {
  const [genderConfig, setGenderConfig] = useState({
    ...defaultGenderConfig,
    ...value,
  });

  const handleChangePreset =
    (type, field, isColor = true) =>
    (value) => {
      if (!type || !field) return;

      const newConfig = {
        ...genderConfig,
        preset: {
          ...genderConfig.preset,
          [type]: {
            ...genderConfig.preset[type],
            [field]: isColor
              ? getColor(value, {
                  toUpperCase: true,
                  trim: true,
                  addHash: true,
                  ignoreEmpty: true,
                })
              : value,
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
              preview={{ type: "text", text: "px" }}
              value={genderConfig.preset.icon.height}
              onChange={handleChangePreset("icon", "height", false)}
              style={{ width: "50px" }}
              type="number"
            />
            <InputWithPreview
              placeholder={LABELS.GENDER_OPTIONS.ICON_WIDTH}
              preview={{ type: "text", text: "px" }}
              value={genderConfig.preset.icon.width}
              onChange={handleChangePreset("icon", "width", false)}
              style={{ width: "50px" }}
              type="number"
            />
          </Fragment>
        )}
        <InputCustom
          placeholder={LABELS.GENDER_OPTIONS.ICON_URL}
          value={genderConfig.preset.icon.url}
          onChange={handleChangePreset("icon", "url", false)}
        />
      </div>
      <div className="events-config-holder">
        <div className="preset">
          <InputWithPreview
            placeholder={LABELS.GENDER_OPTIONS.ICON_DEFAULT}
            onChange={handleChangePreset("icon", "default")}
            value={genderConfig.preset.icon.default}
            preview={{ type: "color", color: genderConfig.preset.icon.default }}
          />
          <InputWithPreview
            placeholder={LABELS.GENDER_OPTIONS.ICON_HOVER}
            onChange={handleChangePreset("icon", "hover")}
            value={genderConfig.preset.icon.hover}
            preview={{ type: "color", color: genderConfig.preset.icon.hover }}
          />
          <InputWithPreview
            placeholder={LABELS.GENDER_OPTIONS.ICON_SELECTED}
            onChange={handleChangePreset("icon", "selected")}
            value={genderConfig.preset.icon.selected}
            preview={{
              type: "color",
              color: genderConfig.preset.icon.selected,
            }}
          />
        </div>
        <div className="preset">
          <InputWithPreview
            placeholder={LABELS.GENDER_OPTIONS.BUTTON_DEFAULT}
            onChange={handleChangePreset("button", "default")}
            value={genderConfig.preset.button.default}
            preview={{
              type: "color",
              color: genderConfig.preset.button.default,
            }}
          />
          <InputWithPreview
            placeholder={LABELS.GENDER_OPTIONS.BUTTON_HOVER}
            onChange={handleChangePreset("button", "hover")}
            value={genderConfig.preset.button.hover}
            preview={{ type: "color", color: genderConfig.preset.button.hover }}
          />
          <InputWithPreview
            placeholder={LABELS.GENDER_OPTIONS.BUTTON_SELECTED}
            onChange={handleChangePreset("button", "selected")}
            value={genderConfig.preset.button.selected}
            preview={{
              type: "color",
              color: genderConfig.preset.button.selected,
            }}
          />
        </div>
      </div>
    </div>
  );
}

const InputWithPreview = ({ preview, ...props }) => {
  return (
    <div className="input-with-preview">
      <InputCustom {...props} />
      {!!preview[preview.type]?.length && (
        <div
          className={`preview`}
          style={{
            backgroundColor:
              preview.type === "color" ? getColor(preview.color) : "",
          }}
        >
          {preview.type === "text" && (
            <p className="preview-text">{preview.text}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default OptionGenderConfig;