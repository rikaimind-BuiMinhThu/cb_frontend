import { useScenarioEditor } from '../context/ScenarioEditorContext';

/**
 * Shared props for content setting/preview registry components (context-first).
 */
export const useScenarioContentSettingProps = (indexMessageSelect, indexContent, content) => {
  const { state, actions, messages, renderers, client } = useScenarioEditor();
  const {
    dataMessages, dataInputVar, isUseFukushashiki, dataHour, dataMinutes, dataEveryMinute,
    dataYear, dataMonth, dataDay, dataPrefectures, dataCity, listProductVariants,
    clientCartSystem, isShopifyPaymentScenario, fileErrorCarousel, indexCarouselSlide,
    editorSelectedRadioOption,
    editorSelectedCheckboxOption,
    dataEmail,
  } = state;
  const {
    setDataMessages, setIsOpenAddVariable, setIsOpenFileReference, setVarFileReference,
    setAcceptFile, setIndexCarouselSlide, setEditorSelectedRadioOption,
    setEditorSelectedCheckboxOption,
  } = actions;
  const {
    onChangeValueMessageContent,
    onChangeFixedDate,
    handleChangeValueRequireZipCode,
    onChangeTimePullDown,
    handleDragEndRadioCheckbox,
    handleRemoveItemContent,
    handleAddItemRadioCheckbox,
    handleDragEndPullDown,
    handleRemoveItemCustomizePullDown,
    handleAddItemCustomizePullDown,
    handleRemoveItemZipCodeAddress,
    handleAddItemAgreeTerm,
    handleDragEndProduct,
    handleRemoveItemProductPullDown,
    handleAddItemProductPullDown,
    botUploadFile,
    carouselUploadFile,
    getBaseUrl,
    handleDownloadFile,
    isColor,
  } = messages;
  const {
    renderRootFaqOption,
    renderLPIntegrationOptionSetting,
    renderLPIntegrationOptionPreview,
    renderDetailSettingPulldownFromJs,
    renderAddressField,
    renderBuildingName,
    renderMunicipality,
    renderPostCode,
    renderZipCodeAddressTitle,
    renderPrefecture,
    renderPaymentMethodDescriptionInput,
    renderTextInputPasswordConfirmationPreview,
    renderPreviewPulldownfromJs,
  } = renderers;

  const textInput = content?.text_input;
  const label = content?.label;
  const textarea = content?.textarea;
  const radioButton = content?.radio_button;
  const checkbox = content?.checkbox;
  const pullDown = content?.pull_down;
  const zipCodeAddress = content?.zip_code_address;
  const numberMaxLength = content?.number_max_length;

  return {
    indexMessageSelect,
    indexContent,
    content,
    textInput,
    label,
    textarea,
    radioButton,
    checkbox,
    pullDown,
    zipCodeAddress,
    numberMaxLength,
    dataMessages,
    setDataMessages,
    onChangeValueMessageContent,
    onChangeFixedDate,
    handleChangeValueRequireZipCode,
    renderRootFaqOption,
    dataInputVar,
    setIsOpenAddVariable,
    isUseFukushashiki,
    handleDragEndRadioCheckbox,
    handleRemoveItemContent,
    handleAddItemRadioCheckbox,
    setIsOpenFileReference,
    setVarFileReference,
    setAcceptFile,
    handleDragEndPullDown,
    handleRemoveItemCustomizePullDown,
    handleAddItemCustomizePullDown,
    onChangeTimePullDown,
    dataHour,
    dataMinutes,
    dataEveryMinute,
    dataYear,
    dataMonth,
    dataDay,
    dataPrefectures,
    dataCity,
    renderLPIntegrationOptionSetting,
    renderLPIntegrationOptionPreview,
    renderDetailSettingPulldownFromJs,
    handleRemoveItemZipCodeAddress,
    renderAddressField,
    renderBuildingName,
    renderMunicipality,
    renderPostCode,
    renderZipCodeAddressTitle,
    renderPrefecture,
    renderPaymentMethodDescriptionInput,
    renderTextInputPasswordConfirmationPreview,
    renderPreviewPulldownfromJs,
    handleAddItemAgreeTerm,
    handleDragEndProduct,
    handleRemoveItemProductPullDown,
    handleAddItemProductPullDown,
    botUploadFile,
    carouselUploadFile,
    getBaseUrl,
    handleDownloadFile,
    isColor,
    listProductVariants,
    clientCartSystem,
    isShopifyPaymentScenario,
    client,
    setIndexCarouselSlide,
    fileErrorCarousel,
    indexCarouselSlide,
    editorSelectedRadioOption,
    setEditorSelectedRadioOption,
    editorSelectedCheckboxOption,
    setEditorSelectedCheckboxOption,
    dataEmail,
  };
};
