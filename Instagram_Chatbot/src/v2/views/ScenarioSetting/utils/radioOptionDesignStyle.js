import {
  buildRadioOptionDesignVars,
  resolveRadioOptionDesign,
  shouldApplyRadioOptionTwinkle,
} from './radioOptionDesign';

export const RADIO_OPTION_TWINKLE_CLASS = 'ss-message__content--user-radio_button--option-twinkle';
export const GENDER_OPTION_TWINKLE_CLASS = 'option-gender-item--option-twinkle';
export const GENDER_OPTION_DESIGN_CLASS = 'option-gender-item--design';
export const GENDER_OPTION_SELECTED_CLASS = 'option-gender-item--selected';

export const resolveOptionDesignStyle = ({
  option,
  radioButton,
  theme,
}) => {
  const resolved = resolveRadioOptionDesign({
    option,
    radioButton,
    theme,
  });
  return {
    resolved,
    style: buildRadioOptionDesignVars(resolved),
    twinkle: shouldApplyRadioOptionTwinkle(resolved),
  };
};
