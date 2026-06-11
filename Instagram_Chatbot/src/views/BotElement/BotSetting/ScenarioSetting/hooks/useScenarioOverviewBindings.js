import { useScenarioEditor } from '../context/ScenarioEditorContext';

export const useScenarioOverviewBindings = () => {
  const { state, messages } = useScenarioEditor();
  const { dataMessages, botTextValue } = state;
  const {
    handleDragEndMessageOverview, handleSelectMessage, handleEditIconClick,
    handleCopyMessage, handleHiddenMessage, handleDeleteMessage, onClickCreateStatement,
  } = messages;

  return {
    dataMessages, botTextValue,
    handleDragEndMessageOverview, handleSelectMessage, handleEditIconClick,
    handleCopyMessage, handleHiddenMessage, handleDeleteMessage, onClickCreateStatement,
  };
};
