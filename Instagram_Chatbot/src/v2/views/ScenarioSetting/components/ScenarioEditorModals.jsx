import React from 'react';
import FileReferencePopup from '../FileReferencePopup';
import ShopifyReferencePopup from '../ShopifyReferencePopup';
import ScenarioSettingsModalContainer from './modals/ScenarioSettingsModalContainer';
import ScenarioModalShell from './modals/shared/ScenarioModalShell';
import AddVariableModalContent from './modals/AddVariableModalContent';
import { useScenarioPanelDestructuring } from '../hooks/useScenarioPanelDestructuring';
import { isUserContentFileTarget } from '../utils/isUserContentFileTarget';
import { resolveBotFileWriteTarget } from '../utils/resolveBotFileWriteTarget';
import {
  RADIO_OPTION_DESIGN_STATES,
  getRadioOptionDesignType,
  setRadioOptionDesignImage,
} from '../utils/radioOptionDesign';

const DESIGN_FIELD = 'design';
const IMG_FIELD = 'img';
const MODAL_TITLE_ADD_VARIABLE = '変数追加';
const MODAL_TITLE_FILE_REFERENCE = 'ファイル参照';
const MODAL_TITLE_SHOPIFY = 'Shopify商品参照';

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

  const applyRadioDesignImage = (fileUrl) => {
    const message = dataMessages[indexMessageSelect];
    const contentItem = message?.message_content?.[varFileReference.indexContent];
    const radioButton = contentItem?.[varFileReference.contentType];
    const options = radioButton?.[varFileReference.subContentType];
    const option = options?.[varFileReference.indexSubContent];
    if (!option) return;

    const designType = getRadioOptionDesignType(radioButton);
    const designState = varFileReference.designState || RADIO_OPTION_DESIGN_STATES.NORMAL;
    const nextDesign = setRadioOptionDesignImage(
      option.design,
      designState,
      fileUrl,
      designType,
    );

    onChangeValueMessageContent(
      indexMessageSelect,
      varFileReference.indexContent,
      varFileReference.contentType,
      nextDesign,
      varFileReference.subContentType,
      varFileReference.indexSubContent,
      DESIGN_FIELD,
    );

    if (designState === RADIO_OPTION_DESIGN_STATES.NORMAL) {
      onChangeValueMessageContent(
        indexMessageSelect,
        varFileReference.indexContent,
        varFileReference.contentType,
        fileUrl,
        varFileReference.subContentType,
        varFileReference.indexSubContent,
        IMG_FIELD,
      );
    }
  };

  const applyUserContentFileUrl = (fileUrl) => {
    if (varFileReference.indexChildSubContentType !== undefined) {
      onChangeValueMessageContent(
        indexMessageSelect,
        varFileReference.indexContent,
        varFileReference.contentType,
        fileUrl,
        varFileReference.subContentType,
        varFileReference.indexSubContentType,
        varFileReference.childSubContentType,
        varFileReference.indexChildSubContentType,
        varFileReference.img,
      );
      return;
    }
    if (varFileReference.childSubContentType !== undefined) {
      onChangeValueMessageContent(
        indexMessageSelect,
        varFileReference.indexContent,
        varFileReference.contentType,
        fileUrl,
        varFileReference.subContentType,
        varFileReference.childSubContentType,
        varFileReference.indexSubContent,
        varFileReference.img,
      );
      return;
    }
    onChangeValueMessageContent(
      indexMessageSelect,
      varFileReference.indexContent,
      varFileReference.contentType,
      fileUrl,
      varFileReference.subContentType,
      varFileReference.indexSubContent,
      varFileReference.img,
    );
  };

  const applyBotContentFileUrl = (fileUrl) => {
    const target = resolveBotFileWriteTarget(varFileReference, messageType);
    onChangeValueMessageContent(
      indexMessageSelect,
      target.indexContent,
      target.contentType,
      fileUrl,
      target.fieldName,
    );
  };

  const applyUserShopifyProductVariant = (productVariantId, displayName) => {
    if (varShopifyReference.indexChildSubContentType !== undefined) {
      onChangeValueMessageContent(
        indexMessageSelect,
        varShopifyReference.indexContent,
        varShopifyReference.contentType,
        productVariantId,
        varShopifyReference.subContentType,
        varShopifyReference.indexSubContentType,
        varShopifyReference.childSubContentType,
        varShopifyReference.indexChildSubContentType,
        varShopifyReference.productVariantId,
      );
      onChangeValueMessageContent(
        indexMessageSelect,
        varShopifyReference.indexContent,
        varShopifyReference.contentType,
        displayName,
        varShopifyReference.subContentType,
        varShopifyReference.indexSubContentType,
        varShopifyReference.childSubContentType,
        varShopifyReference.indexChildSubContentType,
        varShopifyReference.displayName,
      );
      return;
    }
    if (varShopifyReference.childSubContentType !== undefined) {
      onChangeValueMessageContent(
        indexMessageSelect,
        varShopifyReference.indexContent,
        varShopifyReference.contentType,
        productVariantId,
        varShopifyReference.subContentType,
        varShopifyReference.childSubContentType,
        varShopifyReference.indexSubContent,
        varShopifyReference.productVariantId,
      );
      onChangeValueMessageContent(
        indexMessageSelect,
        varShopifyReference.indexContent,
        varShopifyReference.contentType,
        displayName,
        varShopifyReference.subContentType,
        varShopifyReference.childSubContentType,
        varShopifyReference.indexSubContent,
        varShopifyReference.displayName,
      );
      return;
    }
    onChangeValueMessageContent(
      indexMessageSelect,
      varShopifyReference.indexContent,
      varShopifyReference.contentType,
      productVariantId,
      varShopifyReference.subContentType,
      varShopifyReference.indexSubContent,
      varShopifyReference.productVariantId,
    );
    onChangeValueMessageContent(
      indexMessageSelect,
      varShopifyReference.indexContent,
      varShopifyReference.contentType,
      displayName,
      varShopifyReference.subContentType,
      varShopifyReference.indexSubContent,
      varShopifyReference.displayName,
    );
  };

  const handleReferFile = (fileUrl) => {
    if (varFileReference.radioDesign) {
      applyRadioDesignImage(fileUrl);
      setIsOpenFileReference(false);
      return;
    }

    const selectedMessage = dataMessages[indexMessageSelect];
    if (isUserContentFileTarget(selectedMessage, varFileReference)) {
      applyUserContentFileUrl(fileUrl);
      setIsOpenFileReference(false);
      return;
    }

    applyBotContentFileUrl(fileUrl);
    setIsOpenFileReference(false);
  };

  const handleReferShopifyProductVariant = (productVariantId, displayName) => {
    const selectedMessage = dataMessages[indexMessageSelect];
    if (isUserContentFileTarget(selectedMessage, varShopifyReference)) {
      applyUserShopifyProductVariant(productVariantId, displayName);
      setIsOpenShopifyReference(false);
      return;
    }

    const target = resolveBotFileWriteTarget(varShopifyReference, messageType);
    onChangeValueMessageContent(
      indexMessageSelect,
      target.indexContent,
      target.contentType,
      productVariantId,
      target.fieldName,
    );
    setIsOpenShopifyReference(false);
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
          onReferProductVariant={handleReferShopifyProductVariant}
        />
      </ScenarioModalShell>
    </>
  );
};

export default ScenarioEditorModals;
