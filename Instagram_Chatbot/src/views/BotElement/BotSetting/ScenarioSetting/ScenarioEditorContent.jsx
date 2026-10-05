import '../../../../assets/css/bot/scenario/scenario-editor-layout.css';
import './styles/index.css';
import React, { useState } from 'react';
import { AdminPage, AdminActionButton, useAdminHeaderTitle } from '../../../../components/AdminShell';
import { useScenarioEditor } from './context/ScenarioEditorContext';
import ScenarioOverviewPanel from './components/ScenarioOverviewPanel';
import ScenarioMessageDetailPanel from './components/ScenarioMessageDetailPanel';
import ScenarioBotSettingsPanel from './components/ScenarioBotSettingsPanel';
import ScenarioUserSettingsPanel from './components/ScenarioUserSettingsPanel';
import ScenarioCombineSettingsPanel from './components/ScenarioCombineSettingsPanel';
import ScenarioEditorModals from './components/ScenarioEditorModals';
import ScenarioEditorPreviewSection from './components/ScenarioEditorPreviewSection';
import ScenarioMessageOverview from './components/ScenarioMessageOverview';
import ScenarioMessageOverviewList from './components/ScenarioMessageOverviewList';

const ScenarioEditorContent = () => {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const { actions, state } = useScenarioEditor();
  const { onClickSaveScenario } = actions;
  const pageTitle = state.editorMode === 'template' ? 'シナリオテンプレート設定' : 'シナリオ設定';

  useAdminHeaderTitle(pageTitle);

  return (
    <>
      <AdminPage className="admin-page--scenario-editor" card={false}>
        <div className="scenario-editor-page-body">
          <div className="ss-sc-setting ss-editor-layout-v2">
            <div
              className={`ss-sc-content ss-overview ss-layout-column ss-layout-overview-column${
                isPreviewVisible ? ' ss-layout-overview-column--full-preview' : ''
              }`}
            >
              {!isPreviewVisible && (
                <>
                  <div className="ss-layout-overview-form">
                    <ScenarioOverviewPanel onOpenPreview={() => setIsPreviewVisible(true)} />
                  </div>
                  <ScenarioMessageOverview>
                    <ScenarioMessageOverviewList />
                  </ScenarioMessageOverview>
                </>
              )}
              {isPreviewVisible && (
                <div className="ss-layout-overview-preview ss-layout-overview-preview--full">
                  <ScenarioEditorPreviewSection
                    onClosePreview={() => setIsPreviewVisible(false)}
                  />
                </div>
              )}
            </div>
            <ScenarioMessageDetailPanel
              toolbar={
                <AdminActionButton action="save" onClick={() => onClickSaveScenario()} />
              }
            >
              <ScenarioBotSettingsPanel />
              <ScenarioUserSettingsPanel />
              <ScenarioCombineSettingsPanel />
            </ScenarioMessageDetailPanel>
          </div>
        </div>
      </AdminPage>
      <ScenarioEditorModals />
    </>
  );
};

export default ScenarioEditorContent;
