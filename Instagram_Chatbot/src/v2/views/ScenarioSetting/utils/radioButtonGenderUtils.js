import {
  getDefaultGenderOptions,
  isPlaceholderGenderList,
} from '../constants/genderOptionDefaults';

export const RADIO_GENDER_TYPE = 'gender';

export const isGenderRadio = (radioButton) => {
  if (!radioButton) return false;
  return radioButton.type === RADIO_GENDER_TYPE || !!radioButton.use_as_gender;
};

/** Options list for settings/preview (respects legacy). */
export const getGenderOptions = (radioButton) => {
  if (!radioButton) return [];
  if (radioButton.type === RADIO_GENDER_TYPE) {
    return Array.isArray(radioButton.gender) ? radioButton.gender : [];
  }
  // legacy
  const key = radioButton.type || 'default';
  return Array.isArray(radioButton[key]) ? radioButton[key] : [];
};

/**
 * When switching TO gender: ensure gender[] has usable options.
 * Prefer existing non-placeholder gender[]; else seed staging defaults.
 * Returns next radio_button patch fields (not full object).
 */
export const ensureGenderOptions = (radioButton) => {
  const existing = Array.isArray(radioButton?.gender) ? radioButton.gender : [];
  if (!isPlaceholderGenderList(existing)) {
    return { gender: existing, use_as_gender: true };
  }
  return { gender: getDefaultGenderOptions(), use_as_gender: true };
};
