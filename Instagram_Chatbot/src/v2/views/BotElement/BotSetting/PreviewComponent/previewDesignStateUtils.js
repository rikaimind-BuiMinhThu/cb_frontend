const DEFAULT_TITLE_BUBBLE = "簡単90秒で注文完了";

const toDesignString = (value, fallback = "1") => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  return String(value);
};

/**
 * Maps parseDesignSettings() output into preview reducer design fields.
 *
 * @param {object} parsedDesign
 * @param {object} [options]
 * @param {boolean} [options.includeIsOpen] - include isOpen from currentIsOpen
 * @param {boolean} [options.currentIsOpen]
 * @param {boolean} [options.includeOpenAnimation] - Fukushashiki design-settings refresh
 */
export const mapParsedDesignToState = (parsedDesign, options = {}) => {
  const {
    includeIsOpen = false,
    currentIsOpen = false,
    includeOpenAnimation = false,
  } = options;

  const mapped = {
    activePopupCloseBot: parsedDesign.popupCloseBot,
    titleBubble: parsedDesign.titleBubble || DEFAULT_TITLE_BUBBLE,
    displayType: parsedDesign.displayType,
    widthPc: parsedDesign.widthPc,
    heightPc: parsedDesign.heightPc,
    widthSp: parsedDesign.widthSp,
    heightSp: parsedDesign.heightSp,
    positionPc: toDesignString(parsedDesign.positionPc),
    rightPcTitle: parsedDesign.rightPcTitle,
    buttonTypePc: toDesignString(parsedDesign.buttonTypePc),
    rightMarginPc: parsedDesign.rightMarginPc,
    bottomMarginPc: parsedDesign.bottomMarginPc,
    positionSp: toDesignString(parsedDesign.positionSp),
    buttonTypeSp: toDesignString(parsedDesign.buttonTypeSp),
    rightSpTitle: parsedDesign.rightSpTitle,
    rightMarginSp: parsedDesign.rightMarginSp,
    bottomMarginSp: parsedDesign.bottomMarginSp,
    themeSettings: parsedDesign.themeSettings,
  };

  if (includeIsOpen) {
    mapped.isOpen = currentIsOpen;
  }

  if (includeOpenAnimation) {
    mapped.openAnimationDurationMs = parsedDesign.openAnimationDurationMs;
    mapped.openAnimationStyle = parsedDesign.openAnimationStyle;
  }

  return mapped;
};

/**
 * Maps raw snake_case design_settings API fields (ScenarioPreview getChatBotSetting path).
 */
export const mapRawDesignSettingsToState = (result, options = {}) => {
  const {
    includeIsOpen = false,
    currentIsOpen = false,
    includeOpenAnimation = false,
  } = options;

  const mapped = {
    activePopupCloseBot: result?.popup_close_bot,
    titleBubble: result?.title_bubble || DEFAULT_TITLE_BUBBLE,
    displayType: result?.display_type,
    widthPc: result?.width_pc,
    heightPc: result?.height_pc,
    widthSp: result?.width_sp,
    heightSp: result?.height_sp,
    positionPc: toDesignString(result?.position_pc),
    rightPcTitle: result?.right_position_pc_title,
    buttonTypePc: toDesignString(result?.button_type_pc),
    rightMarginPc: result?.right_margin_pc,
    bottomMarginPc: result?.bottom_margin_pc,
    positionSp: toDesignString(result?.position_sp),
    buttonTypeSp: toDesignString(result?.button_type_sp),
    rightSpTitle: result?.right_position_sp_title,
    rightMarginSp: result?.right_margin_sp,
    bottomMarginSp: result?.bottom_margin_sp,
  };

  if (includeIsOpen) {
    mapped.isOpen = currentIsOpen;
  }

  if (includeOpenAnimation) {
    mapped.openAnimationDurationMs = result?.open_animation_duration_ms;
    mapped.openAnimationStyle = result?.open_animation_style;
  }

  return mapped;
};

/**
 * Design fields from scenario preview extractState (snake_case design_settings + theme).
 */
export const mapRawDesignSettingsFromExtract = (designSetting) => ({
  activePopupCloseBot: designSetting?.popup_close_bot,
  titleBubble: designSetting?.title_bubble || DEFAULT_TITLE_BUBBLE,
  displayType: designSetting?.display_type,
  widthPc: designSetting?.width_pc,
  heightPc: designSetting?.height_pc,
  widthSp: designSetting?.width_sp,
  heightSp: designSetting?.height_sp,
  positionPc: toDesignString(designSetting?.position_pc),
  rightPcTitle: designSetting?.right_position_pc_title,
  buttonTypePc: toDesignString(designSetting?.button_type_pc),
  rightMarginPc: designSetting?.right_margin_pc,
  bottomMarginPc: designSetting?.bottom_margin_pc,
  positionSp: toDesignString(designSetting?.position_sp),
  buttonTypeSp: toDesignString(designSetting?.button_type_sp),
  rightSpTitle: designSetting?.right_position_sp_title,
  rightMarginSp: designSetting?.right_margin_sp,
  bottomMarginSp: designSetting?.bottom_margin_sp,
  themeSettings: designSetting?.theme,
});
