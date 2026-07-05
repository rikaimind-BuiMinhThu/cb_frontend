import { useState } from "react";

const OptionGender = ({
  contentIndex,
  radioButton,
  onChangeValue,
  options,
}) => {
  const mapDisplayType = {
    horizontal: 'row',
    vertical: 'column',
  }

  return (
    <div
      className="options-gender_wrapper"
    >
      <div 
        className="options-gender_wrapper-item"
        style={{ flexDirection: mapDisplayType[radioButton.gender_display_type] }}
      >
        {options.map((item) => {
          return (
            <OptionGenderItem
              contentIndex={contentIndex}
              item={item}
              onChangeValue={onChangeValue}
              isSelected={radioButton.initial_selection === item.value}
              key={item.id}
            />
          );
        })}
      </div>
    </div>
  );
}

function OptionGenderItem({ contentIndex, item, onChangeValue, isSelected }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const getButtonStyle = () => {
    if (!item.preset_config) return {};
    
    const { button } = item.preset_config.preset;
    let backgroundColor = button.default;

    if (isSelected) {
      backgroundColor = button.selected;
    } else if (isHovered) {
      backgroundColor = button.hover;
    }
    return { backgroundColor };
  };

  const getIconStyle = (url) => {
    if (!item.preset_config) return {};

    const { icon } = item.preset_config.preset;
    let colorFill = icon.default;

    if (isSelected) {
      colorFill = icon.selected;
    } else if (isHovered) {
      colorFill = icon.hover;
    }

    if (url) {
      return {
        WebkitMaskImage: url ? `url(${url})` : undefined,
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        WebkitMaskSize: "contain",
        maskImage: url ? `url(${url})` : undefined,
        maskRepeat: "no-repeat",
        maskPosition: "center",
        maskSize: "contain",
        backgroundColor: colorFill,
        width: item.preset_config.preset.icon.width + "px",
        height: item.preset_config.preset.icon.height + "px",
      };
    }

    return {
      color: colorFill,
      fontSize: "1rem",
      fontWeight: "bold",
    };
  };

  return (
    <div
      className="option-gender-item"
      style={getButtonStyle()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        onChangeValue(
          contentIndex,
          "radio_button",
          item.value,
          "initial_selection"
        );
      }}
    >
      {item.preset_config?.preset?.icon?.url ? (
        <div
          className="ico"
          alt={item.text}
          style={getIconStyle(item.preset_config.preset.icon.url)}
        />
      ) : (
        <div style={getIconStyle()}>{item.text}</div>
      )}
    </div>
  );
}

export default OptionGender;