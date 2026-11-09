export const GENDER_OPTION_COUNT = 2;

const GENDER_LABEL_MALE = '男性';
const GENDER_LABEL_FEMALE = '女性';
const GENDER_VALUE_MALE = 'male';
const GENDER_VALUE_FEMALE = 'female';

const GENDER_ICON_MALE_PATH = 'M7.5 10.2c0-1 .8-1.8 1.8-1.8h5.4c1 0 1.8.8 1.8 1.8V16h-2.2v6.5h-4.6V16H7.5z';
const GENDER_ICON_FEMALE_PATH = 'M12 8.6c-2 0-3.7.9-4.7 2.2L4.2 17.5h4.1V22h7.4v-4.5h4.1l-3.1-6.7C15.7 9.5 14 8.6 12 8.6z';
export const GENDER_ICON_COLOR = '#FFFFFF';

const createGenderIconDataUri = (bodyPath) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="5" r="3.2" fill="${GENDER_ICON_COLOR}"/><path fill="${GENDER_ICON_COLOR}" d="${bodyPath}"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

export const GENDER_ICON_URL_MALE = createGenderIconDataUri(GENDER_ICON_MALE_PATH);
export const GENDER_ICON_URL_FEMALE = createGenderIconDataUri(GENDER_ICON_FEMALE_PATH);

export const GENDER_ICON_SIZE = 32;

export const GENDER_MALE_COLORS = {
  buttonDefault: '#5B9BD5',
  buttonHover: '#4A8BC4',
  buttonSelected: '#2F80ED',
};

export const GENDER_FEMALE_COLORS = {
  buttonDefault: '#8A8A8A',
  buttonHover: '#7A7A7A',
  buttonSelected: '#5A5A5A',
};

export const GENDER_DESIGN_COMMON = {
  height: 78,
  padding: 10,
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

const createGenderDesign = (backgroundDefault, backgroundSelected, imageUrl) => ({
  common: {
    ...GENDER_DESIGN_COMMON,
  },
  normal: {
    background_color: backgroundDefault,
    image: imageUrl,
  },
  selected: {
    background_color: backgroundSelected,
    image: imageUrl,
  },
  unselected: {
    background_color: backgroundDefault,
    image: imageUrl,
  },
});

export const getDefaultGenderOptions = () => ([
  {
    id: 1,
    text: GENDER_LABEL_MALE,
    value: GENDER_VALUE_MALE,
    img: GENDER_ICON_URL_MALE,
    design: createGenderDesign(
      GENDER_MALE_COLORS.buttonDefault,
      GENDER_MALE_COLORS.buttonSelected,
      GENDER_ICON_URL_MALE,
    ),
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
    img: GENDER_ICON_URL_FEMALE,
    design: createGenderDesign(
      GENDER_FEMALE_COLORS.buttonDefault,
      GENDER_FEMALE_COLORS.buttonSelected,
      GENDER_ICON_URL_FEMALE,
    ),
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
  if (!option.text && !option.value && !option.preset_config && !option.design) return true;
  return false;
};

export const isPlaceholderGenderList = (options) => {
  if (!Array.isArray(options) || options.length === 0) return true;
  return options.every(isPlaceholderGenderOption);
};
