import React from 'react';
import { Button } from 'reactstrap';
import ModalNoti from '../../../../Popup/ModalNoti';
import ModalShort from '../../../../Popup/ModalShort';
import FileReferencePopup from '../FileReferencePopup';
import ShopifyReferencePopup from '../ShopifyReferencePopup';
import ScenarioCustomCssModal from './modals/ScenarioCustomCssModal';
import ScenarioCustomJsModal from './modals/ScenarioCustomJsModal';
import ScenarioTimerModal from './modals/ScenarioTimerModal';
import ScenarioErrMsgJsModal from './modals/ScenarioErrMsgJsModal';
import ScenarioSettingsModal from './modals/ScenarioSettingsModal';
import { useScenarioPanelDestructuring } from '../hooks/useScenarioPanelDestructuring';

const ScenarioEditorModals = () => {
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
      <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
        <div style={{ width: '300px', textAlign: 'center', color: '#51cbce' }}>
          <span style={{ fontSize: '16px' }}>{messageNoti}</span>
        </div>
      </ModalNoti>
      <ScenarioCustomCssModal />
      <ScenarioCustomJsModal />
      <ScenarioTimerModal />
      <ScenarioErrMsgJsModal />
      <ScenarioSettingsModal />
      <ModalShort open={isOpenAddVariable} onClose={() => setIsOpenAddVariable(false)}>
        <div className="sl-popup-create-scenario-wrapper">
          <h4>変数追加</h4>
          <div style={{ marginBottom: '10px' }}>
            <div className="sl-popup-create-scenario-input-wrapper" style={{ marginBottom: '0px' }}>
              <span style={{ width: '100px' }}>変数名</span>
              <input
                type="text"
                name="sl-popup-create-scenario-input"
                id="sl-popup-create-scenario-input"
                onChange={(e) => {
                  setErrorVariable('');
                  setVariableName(e.target.value);
                }}
              />

            </div>
            {errorVariable &&
              <div style={{ textAlign: 'center', color: 'red' }}>{errorVariable}</div>
            }
          </div>
          <div className="sl-popup-create-scenario-input-wrapper">
            <span style={{ width: '100px' }}>デフォルト名</span>
            <input
              type="text"
              name="sl-popup-create-scenario-input"
              id="sl-popup-create-scenario-input"
              onChange={(e) => setDefaultValue(e.target.value)}
            />
          </div>
          <span id="sl-err-create-scenario" style={{ color: "red" }}></span>
          <div className="sl-popup-create-scenario-btn-wrapper">
            <Button
              className="ss-popup-add-variable-input-close-button"
              onClick={() => setIsOpenAddVariable(false)}
            >
              閉じる
            </Button>
            <Button
              style={{ backgroundColor: '#024BB9' }}
              className="ss-popup-add-variable-input-keep-button"
              onClick={() => createVariable()}
            >
              保存
            </Button>
          </div>
        </div>
      </ModalShort>
      <ModalShort open={isOpenFileReference} onClose={() => setIsOpenFileReference(false)}>
        <div className="ss-popup-file-reference-scenario">
          <FileReferencePopup
            onCancel={() => {
              setIsOpenFileReference(false)
              setAcceptFile();
            }}
            acceptFile={acceptFile}
            onReferFile={(file_url) => {
              if (dataMessages[indexMessageSelect].belong_to === 'user') {
                if (varFileReference.indexChildSubContentType !== undefined) {
                  onChangeValueMessageContent(indexMessageSelect, varFileReference.indexContent, varFileReference.contentType, file_url, varFileReference.subContentType, varFileReference.indexSubContentType, varFileReference.childSubContentType, varFileReference.indexChildSubContentType, varFileReference.img);
                } else if (varFileReference.childSubContentType !== undefined) {
                  onChangeValueMessageContent(indexMessageSelect, varFileReference.indexContent, varFileReference.contentType, file_url, varFileReference.subContentType, varFileReference.childSubContentType, varFileReference.indexSubContent, varFileReference.img);
                } else {
                  onChangeValueMessageContent(indexMessageSelect, varFileReference.indexContent, varFileReference.contentType, file_url, varFileReference.subContentType, varFileReference.indexSubContent, varFileReference.img);
                }
              } else {
                onChangeValueMessageContent(indexMessageSelect, 0, messageType, file_url, 'content')
              }
              setIsOpenFileReference(false)
            }}
          />
        </div>
      </ModalShort>
      <ModalShort open={isOpenShopifyReference} onClose={() => setIsOpenShopifyReference(false)}>
        <div className="ss-popup-shopify-reference-scenario">
          <ShopifyReferencePopup
              onCancel={() => {
                setIsOpenShopifyReference(false)
              }}
              onReferProductVariant={(productVariantId, displayName) => {
                if (dataMessages[indexMessageSelect].belong_to === 'user') {
                  if (varFileReference.indexChildSubContentType !== undefined) {
                    onChangeValueMessageContent(indexMessageSelect, varShopifyReference.indexContent, varShopifyReference.contentType, productVariantId, varShopifyReference.subContentType, varShopifyReference.indexSubContentType, varShopifyReference.childSubContentType, varShopifyReference.indexChildSubContentType, varShopifyReference.productVariantId);
                    onChangeValueMessageContent(indexMessageSelect, varShopifyReference.indexContent, varShopifyReference.contentType, displayName, varShopifyReference.subContentType, varShopifyReference.indexSubContentType, varShopifyReference.childSubContentType, varShopifyReference.indexChildSubContentType, varShopifyReference.displayName);
                  } else if (varFileReference.childSubContentType !== undefined) {
                    onChangeValueMessageContent(indexMessageSelect, varShopifyReference.indexContent, varShopifyReference.contentType, productVariantId, varShopifyReference.subContentType, varShopifyReference.childSubContentType, varShopifyReference.indexSubContent, varShopifyReference.productVariantId);
                    onChangeValueMessageContent(indexMessageSelect, varShopifyReference.indexContent, varShopifyReference.contentType, displayName, varShopifyReference.subContentType, varShopifyReference.childSubContentType, varShopifyReference.indexSubContent, varShopifyReference.displayName);
                  } else {
                    onChangeValueMessageContent(indexMessageSelect, varShopifyReference.indexContent, varShopifyReference.contentType, productVariantId, varShopifyReference.subContentType, varShopifyReference.indexSubContent, varShopifyReference.productVariantId);
                    onChangeValueMessageContent(indexMessageSelect, varShopifyReference.indexContent, varShopifyReference.contentType, displayName, varShopifyReference.subContentType, varShopifyReference.indexSubContent, varShopifyReference.displayName);
                  }
                } else {
                  onChangeValueMessageContent(indexMessageSelect, 0, messageType, productVariantId, 'content')
                }
                setIsOpenShopifyReference(false)
              }}
          />
        </div>
      </ModalShort>
    </>
  );
};

export default ScenarioEditorModals;
