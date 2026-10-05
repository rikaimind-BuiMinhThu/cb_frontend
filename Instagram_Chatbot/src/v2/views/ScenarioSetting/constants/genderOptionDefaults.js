export const GENDER_OPTION_COUNT = 2;

const GENDER_LABEL_MALE = '男性';
const GENDER_LABEL_FEMALE = '女性';
const GENDER_VALUE_MALE = 'male';
const GENDER_VALUE_FEMALE = 'female';

const GENDER_ICON_MALE_PATH = 'M7.5 10.2c0-1 .8-1.8 1.8-1.8h5.4c1 0 1.8.8 1.8 1.8V16h-2.2v6.5h-4.6V16H7.5z';
const GENDER_ICON_FEMALE_PATH = 'M12 8.6c-2 0-3.7.9-4.7 2.2L4.2 17.5h4.1V22h7.4v-4.5h4.1l-3.1-6.7C15.7 9.5 14 8.6 12 8.6z';

const createGenderIconDataUri = (bodyPath) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="5" r="3.2" fill="#000"/><path fill="#000" d="${bodyPath}"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

export const GENDER_ICON_URL_MALE = createGenderIconDataUri(GENDER_ICON_MALE_PATH);
export const GENDER_ICON_URL_FEMALE = createGenderIconDataUri(GENDER_ICON_FEMALE_PATH);

export const GENDER_ICON_SIZE = 32;
export const GENDER_ICON_COLOR = '#FFFFFF';
export const GENDER_COLOR_FALLBACK = '#000000';

export const GENDER_MALE_COLORS = {
  buttonDefault: '#7EB6E8',
  buttonHover: '#5A9BD4',
  buttonSelected: '#3D7ABF',
};

export const GENDER_FEMALE_COLORS = {
  buttonDefault: '#F5A3B5',
  buttonHover: '#EE8FA6',
  buttonSelected: '#E56B88',
};

export const createGenderPreset = (
  buttonDefault,
  buttonHover,
  buttonSelected,
  iconUrl,
) => ({
  preset: {
    button: {
      default: buttonDefault,
      hover: buttonHover,
      selected: buttonSelected,
    },
    icon: {
      url: iconUrl,
      height: GENDER_ICON_SIZE,
      width: GENDER_ICON_SIZE,
      default: GENDER_ICON_COLOR,
      hover: GENDER_ICON_COLOR,
      selected: GENDER_ICON_COLOR,
    },
  },
});

export const getDefaultGenderOptions = () => ([
  {
    id: 1,
    text: GENDER_LABEL_MALE,
    value: GENDER_VALUE_MALE,
    preset_config: createGenderPreset(
      GENDER_MALE_COLORS.buttonDefault,
      GENDER_MALE_COLORS.buttonHover,
      GENDER_MALE_COLORS.buttonSelected,
      GENDER_ICON_URL_MALE,
    ),
  },
  {
    id: 2,
    text: GENDER_LABEL_FEMALE,
    value: GENDER_VALUE_FEMALE,
    preset_config: createGenderPreset(
      GENDER_FEMALE_COLORS.buttonDefault,
      GENDER_FEMALE_COLORS.buttonHover,
      GENDER_FEMALE_COLORS.buttonSelected,
      GENDER_ICON_URL_FEMALE,
    ),
  },
]);

const isPlaceholderGenderOption = (option) => {
  if (!option || typeof option !== 'object') return true;
  const keys = Object.keys(option);
  if (keys.length === 1 && keys[0] === 'id') return true;
  if (!option.text && !option.value && !option.preset_config) return true;
  return false;
};

export const isPlaceholderGenderList = (options) => {
  if (!Array.isArray(options) || options.length === 0) return true;
  return options.every(isPlaceholderGenderOption);
};

export const mergeGenderIconUrl = (presetConfig, fileUrl) => {
  const currentPreset = presetConfig?.preset || {};
  const currentIcon = currentPreset.icon || {};
  return {
    ...presetConfig,
    preset: {
      ...currentPreset,
      button: { ...(currentPreset.button || {}) },
      icon: {
        ...currentIcon,
        url: fileUrl,
        height: currentIcon.height || GENDER_ICON_SIZE,
        width: currentIcon.width || GENDER_ICON_SIZE,
      },
    },
  };
};

export const toGenderColorPickerValue = (value) => {
  const normalized = (value || GENDER_COLOR_FALLBACK).trim();
  if (/^#[0-9a-fA-F]{6}$/.test(normalized)) return normalized;
  return GENDER_COLOR_FALLBACK;
};
