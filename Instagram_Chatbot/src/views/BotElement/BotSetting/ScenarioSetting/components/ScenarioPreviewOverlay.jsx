import React from 'react';
import Preview from '../../Preview';
import PreviewFaq from '../../PreviewFaq';
import { useScenarioPanelDestructuring } from '../hooks/useScenarioPanelDestructuring';

const ScenarioPreviewOverlay = () => {
  const panel = useScenarioPanelDestructuring();
  const {
    scenarioName, scenarioType, urlThanks, merchandiseId, lpProductUrl, coupon,
    isUseOnlyRegularOrder, isUseFukushashiki, isUseCustomCss, customCssContent,
    isUsedCartConfirmPage, urlCartConfirmPage, isOpenModalCustomCss, isUseCustomJsCode,
    headCustomJsCode, topBodyCustomJsCode, bottomBodyCustomJsCode, isOpenModalCustomJsCode,
    timerConfig, errMsgJsCode, isOpenErrMsgByJsSettingModal, isUseErrMsgByJs,
    errorScenarioName, belongTo, messageType, indexMessageSelect, dataInputVar,
    isOpenPreview, varFileReference, isOpenFileReference, indexCarouselSlide,
    varShopifyReference, isOpenShopifyReference, botTextValue, isOpenAddVariable,
    fileError, fileErrorCarousel, dataMessages, dataPrefectures, dataCity,
    botId, scenarioId, isOpenNoti, messageNoti, dataEmail, isConditionUp,
    conditions, variableName, defaultValue, acceptFile, dataHour, dataMinutes,
    dataEveryMinute, dataYear, dataMonth, dataDay, errorVariable, dataCondition,
    isUsedMessageLoadedPast, isUsedCrosssell, productIdCrossSell,
    isClearLandingPageSession, isUseBtnUpdateTracking, useFullwidthChatbotMobile,
    clientCartSystem, listProductVariants, isShopifyPaymentScenario,
    setScenarioName, setScenarioType, setUrlThanks, setMerchandiseId, setLpProductUrl,
    setCoupon, setIsUseOnlyRegularOrder, setIsUseFukushashiki, setIsUseCustomCss,
    setCustomCssContent, setIsUsedCartConfirmPage, setUrlCartConfirmPage,
    setIsOpenModalCustomCss, setIsUseCustomJsCode, setHeadCustomJsCode,
    setTopBodyCustomJsCode, setBottomBodyCustomJsCode, setIsOpenModalCustomJsCode,
    setTimerConfig, setErrMsgJsCode, setIsOpenErrMsgByJsSettingModal, setIsUseErrMsgByJs,
    setErrorScenarioName, setBelongTo, setMessageType, setIndexMessageSelect,
    setDataInputVar, setIsOpenPreview, setVarFileReference, setIsOpenFileReference,
    setIndexCarouselSlide, setVarShopifyReference, setIsOpenShopifyReference,
    setBotTextValue, setIsOpenAddVariable, setFileError, setFileErrorCarousel,
    setDataMessages, setDataPrefectures, setDataCity, setBotId, setScenarioId,
    setIsOpenNoti, setMessageNoti, setDataEmail, setIsConditionUp, setConditions,
    setVariableName, setDefaultValue, setAcceptFile, setDataHour, setDataMinutes,
    setDataEveryMinute, setDataYear, setDataMonth, setDataDay, setErrorVariable,
    setDataCondition, setIsUsedMessageLoadedPast, setIsUsedCrosssell,
    setProductIdCrossSell, setIsClearLandingPageSession, setIsUseBtnUpdateTracking,
    setUseFullwidthChatbotMobile, setClientCartSystem, setListProductVariants,
    handleGetMessage, onClickSaveScenario, onClickSavePreview, getListVariable,
    handleOpenPreview,
    onChangeValueMessageContent, onChangeTimePullDown, onChangeValueNameMessage,
    botUploadFile, carouselUploadFile, getBaseUrl, handleSelectMessage, handleHiddenMessage,
    handleSelectContentMessage, handleEditIconClick, handleChangeBotStatementType,
    handleAddItemSetting, handleCopyMessage, handleDeleteMessageContent, handleDeleteMessage,
    handleAddItemRadioCheckbox, handleAddItemCustomizePullDown, handleAddItemProductPullDown,
    handleAddItemAgreeTerm, handleDragEnd, handleDragEndMessageOverview,
    handleDragEndRadioCheckbox, handleDragEndPullDown, handleDragEndProduct,
    onChangeFixedDate, handleChangeValueRequireZipCode, handleRemoveItemContent,
    handleRemoveItemCustomizePullDown, handleRemoveItemProductPullDown,
    handleRemoveItemZipCodeAddress, createVariable, onClickCreateStatement,
    handlePannelCondition, onChangeValueCondition, onClickAddCondition,
    handleDeleteCondition, handleDownloadFile, isColor,
    renderPaymentMethodDescriptionInput, renderRootFaqOption, renderAddressField,
    renderBuildingName, renderMunicipality, renderPostCode, renderZipCodeAddressTitle,
    renderPrefecture, renderLPIntegrationOptionSetting, renderLPIntegrationOptionPreview,
    renderTextInputPasswordConfirmationPreview, renderPreviewPulldownfromJs,
    renderDetailSettingPulldownFromJs,
  } = panel;

  return (
    <>
      {isOpenPreview && (
        scenarioType === 'faq' ? (
          <PreviewFaq />
        ) : (
          <Preview isOpen={isOpenPreview} onOpenPreview={(isOpen) => handleOpenPreview(isOpen)} isFromScenario={true} />
        )
      )}
    </>
  );
};

export default ScenarioPreviewOverlay;
