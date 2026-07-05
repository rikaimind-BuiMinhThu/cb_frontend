import { useScenarioEditor } from '../context/ScenarioEditorContext';

/**
 * Flattens state, actions, messages, and renderers for large panel components
 * that were cut-pasted from ScenarioEditorContent.
 */
export const useScenarioEditorBindings = () => {
  const { state, actions, messages, renderers, client } = useScenarioEditor();
  return {
    ...state,
    ...actions,
    ...messages,
    ...renderers,
    client,
  };
};

export default useScenarioEditorBindings;
