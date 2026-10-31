const DEFAULT_TITLE_BUBBLE = '簡単90秒で注文完了';

/**
 * Maps design-setting form state into PreviewClosedLauncher preview state.
 *
 * @param {object} params
 * @param {object} params.basicInfo
 * @param {object} params.designSettings
 */
export const buildDesignSettingClosedPreviewState = ({ basicInfo = {}, designSettings = {} }) => ({
  isOpen: false,
  displayType: designSettings.displayType,
  titleBubble: designSettings.titleBubble || DEFAULT_TITLE_BUBBLE,
  positionPc: designSettings.positionPc,
  buttonTypePc: designSettings.buttonTypePc,
  rightPcTitle: designSettings.rightPcTitle,
  rightMarginPc: designSettings.rightMarginPc,
  bottomMarginPc: designSettings.bottomMarginPc,
  positionSp: designSettings.positionSp,
  buttonTypeSp: designSettings.buttonTypeSp,
  rightSpTitle: designSettings.rightSpTitle,
  rightMarginSp: designSettings.rightMarginSp,
  bottomMarginSp: designSettings.bottomMarginSp,
  useFullWidthChatbotMobile: false,
  botInfor: {
    title: basicInfo.title,
    main_color: basicInfo.mainColor,
    design_type: basicInfo.designType,
    icon: basicInfo.botImage || null,
    closing_bot_icon: basicInfo.closingBotIcon || null,
    opening_bot_icon: basicInfo.openingBotIcon || null,
  },
});
