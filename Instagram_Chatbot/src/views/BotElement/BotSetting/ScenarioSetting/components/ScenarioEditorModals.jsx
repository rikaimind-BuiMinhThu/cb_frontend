import React from 'react';
import ModalNoti from '../../../../Popup/ModalNoti';
import FileReferencePopup from '../FileReferencePopup';
import ShopifyReferencePopup from '../ShopifyReferencePopup';
import ScenarioSettingsModalContainer from './modals/ScenarioSettingsModalContainer';
import ScenarioModalShell from './modals/shared/ScenarioModalShell';
import AddVariableModalContent from './modals/AddVariableModalContent';
import { useScenarioPanelDestructuring } from '../hooks/useScenarioPanelDestructuring';

const ScenarioEditorModals = () => {
  const panel = useScenarioPanelDestructuring();
  const {
    indexMessageSelect,
    isOpenFileReference,
    isOpenShopifyReference,
    isOpenAddVariable,
    dataMessages,
    messageType,
    isOpenNoti,
    messageNoti,
    varFileReference,
    varShopifyReference,
    acceptFile,
    setIsOpenFileReference,
    setIsOpenShopifyReference,
    setIsOpenAddVariable,
    setIsOpenNoti,
    setAcceptFile,
    onChangeValueMessageContent,
    createVariable,
  } = panel;

  return (
    <>
      <ModalNoti open={isOpenNoti} onClose={() => setIsOpenNoti(false)}>
        <div className="ss-settings-noti">
          <span>{messageNoti}</span>
        </div>
      </ModalNoti>

      <ScenarioSettingsModalContainer />

      <ScenarioModalShell
        open={isOpenAddVariable}
        onClose={() => setIsOpenAddVariable(false)}
        title="変数追加"
        width={500}
      >
        <AddVariableModalContent
          onClose={() => setIsOpenAddVariable(false)}
          onSave={() => createVariable()}
        />
      </ScenarioModalShell>

      <ScenarioModalShell
        open={isOpenFileReference}
        onClose={() => {
          setIsOpenFileReference(false);
          setAcceptFile();
        }}
        title="ファイル参照"
        width={800}
      >
        <FileReferencePopup
          onCancel={() => {
            setIsOpenFileReference(false);
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
              onChangeValueMessageContent(indexMessageSelect, 0, messageType, file_url, 'content');
            }
            setIsOpenFileReference(false);
          }}
        />
      </ScenarioModalShell>

      <ScenarioModalShell
        open={isOpenShopifyReference}
        onClose={() => setIsOpenShopifyReference(false)}
        title="Shopify商品参照"
        width={600}
      >
        <ShopifyReferencePopup
          onCancel={() => setIsOpenShopifyReference(false)}
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
              onChangeValueMessageContent(indexMessageSelect, 0, messageType, productVariantId, 'content');
            }
            setIsOpenShopifyReference(false);
          }}
        />
      </ScenarioModalShell>
    </>
  );
};

export default ScenarioEditorModals;
