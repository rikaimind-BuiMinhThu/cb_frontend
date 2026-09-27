import React from 'react';
import FileReferencePopup from '../FileReferencePopup';
import ShopifyReferencePopup from '../ShopifyReferencePopup';
import ScenarioSettingsModalContainer from './modals/ScenarioSettingsModalContainer';
import ScenarioModalShell from './modals/shared/ScenarioModalShell';
import AddVariableModalContent from './modals/AddVariableModalContent';
import { useScenarioPanelDestructuring } from '../hooks/useScenarioPanelDestructuring';
import { mergeGenderIconUrl } from '../constants/genderOptionDefaults';

const BELONG_TO_USER = 'user';
const PRESET_CONFIG_FIELD = 'preset_config';
const MODAL_TITLE_ADD_VARIABLE = '変数追加';
const MODAL_TITLE_FILE_REFERENCE = 'ファイル参照';
const MODAL_TITLE_SHOPIFY = 'Shopify商品参照';
const DEFAULT_BOT_FILE_FIELD = 'content';

const ScenarioEditorModals = () => {
  const panel = useScenarioPanelDestructuring();
  const {
    indexMessageSelect,
    isOpenFileReference,
    isOpenShopifyReference,
    isOpenAddVariable,
    dataMessages,
    messageType,
    varFileReference,
    varShopifyReference,
    acceptFile,
    setIsOpenFileReference,
    setIsOpenShopifyReference,
    setIsOpenAddVariable,
    setAcceptFile,
    onChangeValueMessageContent,
    createVariable,
    setVariableName,
    setDefaultValue,
    setErrorVariable,
  } = panel;

  const closeAddVariable = () => {
    setIsOpenAddVariable(false);
    setVariableName('');
    setDefaultValue('');
    setErrorVariable('');
  };

  const applyGenderIconFileUrl = (fileUrl) => {
    const message = dataMessages[indexMessageSelect];
    const contentItem = message?.message_content?.[varFileReference.indexContent];
    const radioButton = contentItem?.[varFileReference.contentType];
    const options = radioButton?.[varFileReference.subContentType];
    const option = options?.[varFileReference.indexSubContent];
    if (!option) return;

    const nextPreset = mergeGenderIconUrl(option.preset_config, fileUrl);
    onChangeValueMessageContent(
      indexMessageSelect,
      varFileReference.indexContent,
      varFileReference.contentType,
      nextPreset,
      varFileReference.subContentType,
      varFileReference.indexSubContent,
      PRESET_CONFIG_FIELD,
    );
  };

  const handleReferFile = (fileUrl) => {
    if (varFileReference.genderIconUrl) {
      applyGenderIconFileUrl(fileUrl);
      setIsOpenFileReference(false);
      return;
    }

    if (dataMessages[indexMessageSelect].belong_to === BELONG_TO_USER) {
      if (varFileReference.indexChildSubContentType !== undefined) {
        onChangeValueMessageContent(indexMessageSelect, varFileReference.indexContent, varFileReference.contentType, fileUrl, varFileReference.subContentType, varFileReference.indexSubContentType, varFileReference.childSubContentType, varFileReference.indexChildSubContentType, varFileReference.img);
      } else if (varFileReference.childSubContentType !== undefined) {
        onChangeValueMessageContent(indexMessageSelect, varFileReference.indexContent, varFileReference.contentType, fileUrl, varFileReference.subContentType, varFileReference.childSubContentType, varFileReference.indexSubContent, varFileReference.img);
      } else {
        onChangeValueMessageContent(indexMessageSelect, varFileReference.indexContent, varFileReference.contentType, fileUrl, varFileReference.subContentType, varFileReference.indexSubContent, varFileReference.img);
      }
    } else {
      const field = varFileReference.fieldName || DEFAULT_BOT_FILE_FIELD;
      onChangeValueMessageContent(indexMessageSelect, 0, messageType, fileUrl, field);
    }
    setIsOpenFileReference(false);
  };

  return (
    <>
      <ScenarioSettingsModalContainer />

      <ScenarioModalShell
        open={isOpenAddVariable}
        onClose={closeAddVariable}
        title={MODAL_TITLE_ADD_VARIABLE}
        width={500}
      >
        <AddVariableModalContent
          onClose={closeAddVariable}
          onSave={() => createVariable()}
        />
      </ScenarioModalShell>

      <ScenarioModalShell
        open={isOpenFileReference}
        onClose={() => {
          setIsOpenFileReference(false);
          setAcceptFile();
        }}
        title={MODAL_TITLE_FILE_REFERENCE}
        width={800}
      >
        <FileReferencePopup
          onCancel={() => {
            setIsOpenFileReference(false);
            setAcceptFile();
          }}
          acceptFile={acceptFile}
          onReferFile={handleReferFile}
        />
      </ScenarioModalShell>

      <ScenarioModalShell
        open={isOpenShopifyReference}
        onClose={() => setIsOpenShopifyReference(false)}
        title={MODAL_TITLE_SHOPIFY}
        width={600}
      >
        <ShopifyReferencePopup
          onCancel={() => setIsOpenShopifyReference(false)}
          onReferProductVariant={(productVariantId, displayName) => {
            if (dataMessages[indexMessageSelect].belong_to === BELONG_TO_USER) {
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
              onChangeValueMessageContent(indexMessageSelect, 0, messageType, productVariantId, DEFAULT_BOT_FILE_FIELD);
            }
            setIsOpenShopifyReference(false);
          }}
        />
      </ScenarioModalShell>
    </>
  );
};

export default ScenarioEditorModals;
