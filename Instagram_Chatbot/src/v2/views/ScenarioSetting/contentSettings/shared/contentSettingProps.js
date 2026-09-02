/**
 * Common prop shape for content setting panel components.
 *
 * @typedef {Object} ContentSettingBaseProps
 * @property {number} indexMessageSelect - Selected message index in dataMessages
 * @property {number} indexContent - Index of content block within message_content
 * @property {Object} content - Full message content item ({ id, type, ... })
 * @property {Function} onChangeValueMessageContent - Handler to update nested content values
 *   Signature: (indexMessage, indexContent, contentType, value, ...pathSegments) => void
 */

/**
 * @typedef {ContentSettingBaseProps & {
 *   textInput: Object,
 *   dataMessages: Array,
 *   setDataMessages: Function,
 *   renderRootFaqOption: Function,
 *   dataInputVar: Array,
 *   setIsOpenAddVariable: Function,
 *   isUseFukushashiki: boolean,
 * }} TextInputSettingProps
 */

/**
 * @typedef {ContentSettingBaseProps & {
 *   label: Object,
 * }} LabelSettingProps
 */

/**
 * @typedef {ContentSettingBaseProps & {
 *   textarea: Object,
 *   dataMessages: Array,
 *   setDataMessages: Function,
 *   renderRootFaqOption: Function,
 *   dataInputVar: Array,
 *   setIsOpenAddVariable: Function,
 *   isUseFukushashiki: boolean,
 * }} TextareaSettingProps
 */

/**
 * @typedef {ContentSettingBaseProps & {
 *   radioButton: Object,
 *   dataMessages: Array,
 *   setDataMessages: Function,
 *   renderRootFaqOption: Function,
 *   dataInputVar: Array,
 *   setIsOpenAddVariable: Function,
 *   isUseFukushashiki: boolean,
 *   handleDragEndRadioCheckbox: Function,
 *   handleRemoveItemContent: Function,
 *   handleAddItemRadioCheckbox: Function,
 *   setIsOpenFileReference: Function,
 *   setVarFileReference: Function,
 *   setAcceptFile: Function,
 * }} RadioButtonSettingProps
 */

/**
 * @typedef {ContentSettingBaseProps & {
 *   checkbox: Object,
 *   numberMaxLength: number,
 *   dataMessages: Array,
 *   setDataMessages: Function,
 *   renderRootFaqOption: Function,
 *   dataInputVar: Array,
 *   setIsOpenAddVariable: Function,
 *   isUseFukushashiki: boolean,
 *   handleDragEndRadioCheckbox: Function,
 *   handleRemoveItemContent: Function,
 *   handleAddItemRadioCheckbox: Function,
 *   setIsOpenFileReference: Function,
 *   setVarFileReference: Function,
 *   setAcceptFile: Function,
 * }} CheckboxSettingProps
 */

/**
 * @typedef {ContentSettingBaseProps & {
 *   pullDown: Object,
 *   dataMessages: Array,
 *   setDataMessages: Function,
 *   renderRootFaqOption: Function,
 *   dataInputVar: Array,
 *   setIsOpenAddVariable: Function,
 *   isUseFukushashiki: boolean,
 *   handleDragEndPullDown: Function,
 *   handleRemoveItemCustomizePullDown: Function,
 *   handleAddItemCustomizePullDown: Function,
 *   onChangeTimePullDown: Function,
 *   dataHour: Array,
 *   dataMinutes: Array,
 *   dataEveryMinute: Array,
 *   dataYear: Array,
 *   dataMonth: Array,
 *   dataDay: Array,
 *   dataPrefectures: Array,
 *   dataCity: Array,
 *   renderLPIntegrationOptionSetting: Function,
 *   renderDetailSettingPulldownFromJs: Function,
 * }} PullDownSettingProps
 */

export {};
