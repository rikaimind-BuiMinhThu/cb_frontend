import { useMemo } from 'react';
import { createRenderPaymentMethodDescriptionInput } from '../renderers/scenarioPaymentRenderers';
import { createRenderRootFaqOption } from '../renderers/scenarioFaqRenderers';
import {
  createRenderAddressField,
  createRenderBuildingName,
  createRenderMunicipality,
  createRenderSinglePostCode,
  createRenderSplitPostCode,
  createRenderPostCode,
  createRenderZipCodeAddressTitle,
  createRenderPrefecture,
} from '../renderers/scenarioAddressRenderers';
import {
  createRenderLPIntegrationOptionSetting,
  createRenderLPIntegrationOptionPreview,
  createRenderTextInputPasswordConfirmationPreview,
  createRenderPreviewPulldownfromJs,
  createRenderDetailSettingPulldownFromJs,
} from '../renderers/scenarioPullDownRenderers';

export const useScenarioRenderers = ({ state, actions, messages }) => {
  const {
    scenarioType,
    dataMessages,
    indexMessageSelect,
    dataPrefectures,
  } = state;
  const { setDataMessages } = actions;
  const { onChangeValueMessageContent } = messages;

  return useMemo(() => {
    const renderSinglePostCode = createRenderSinglePostCode();
    const renderSplitPostCode = createRenderSplitPostCode();

    return {
      renderPaymentMethodDescriptionInput: createRenderPaymentMethodDescriptionInput({ setDataMessages }),
      renderRootFaqOption: createRenderRootFaqOption({
        scenarioType,
        dataMessages,
        indexMessageSelect,
        setDataMessages,
      }),
      renderAddressField: createRenderAddressField(),
      renderBuildingName: createRenderBuildingName(),
      renderMunicipality: createRenderMunicipality(),
      renderSinglePostCode,
      renderSplitPostCode,
      renderPostCode: createRenderPostCode({ renderSinglePostCode, renderSplitPostCode }),
      renderZipCodeAddressTitle: createRenderZipCodeAddressTitle(),
      renderPrefecture: createRenderPrefecture(),
      renderLPIntegrationOptionSetting: createRenderLPIntegrationOptionSetting({ onChangeValueMessageContent }),
      renderLPIntegrationOptionPreview: createRenderLPIntegrationOptionPreview({ dataPrefectures }),
      renderTextInputPasswordConfirmationPreview: createRenderTextInputPasswordConfirmationPreview(),
      renderPreviewPulldownfromJs: createRenderPreviewPulldownfromJs(),
      renderDetailSettingPulldownFromJs: createRenderDetailSettingPulldownFromJs({ onChangeValueMessageContent }),
    };
  }, [
    scenarioType,
    dataMessages,
    indexMessageSelect,
    dataPrefectures,
    setDataMessages,
    onChangeValueMessageContent,
  ]);
};

export default useScenarioRenderers;
