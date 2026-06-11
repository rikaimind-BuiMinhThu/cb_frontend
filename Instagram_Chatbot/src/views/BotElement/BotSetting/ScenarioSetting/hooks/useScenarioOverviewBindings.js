import { useScenarioEditor } from '../context/ScenarioEditorContext';

export const useScenarioOverviewBindings = () => {
  const { state, actions, messages, renderers } = useScenarioEditor();
  const {
    dataMessages, botTextValue, dataHour, dataMinutes, dataYear, dataMonth, dataDay,
    dataPrefectures, dataCity,
  } = state;
  const { setIndexCarouselSlide } = actions;
  const {
    handleDragEndMessageOverview, handleSelectMessage, handleEditIconClick,
    handleCopyMessage, handleHiddenMessage, handleDeleteMessage, onClickCreateStatement,
  } = messages;
  const {
    renderZipCodeAddressTitle, renderPostCode, renderPrefecture, renderMunicipality,
    renderAddressField, renderBuildingName, renderTextInputPasswordConfirmationPreview,
    renderPreviewPulldownfromJs,
  } = renderers;

  return {
    dataMessages, botTextValue, dataHour, dataMinutes, dataYear, dataMonth, dataDay,
    dataPrefectures, dataCity,
    handleDragEndMessageOverview, handleSelectMessage, handleEditIconClick,
    handleCopyMessage, handleHiddenMessage, handleDeleteMessage, onClickCreateStatement,
    renderZipCodeAddressTitle, renderPostCode, renderPrefecture, renderMunicipality,
    renderAddressField, renderBuildingName, renderTextInputPasswordConfirmationPreview,
    renderPreviewPulldownfromJs,
    setIndexCarouselSlide,
  };
};
