import '../../../../assets/css/bot/scenario/scenario-editor-layout.css';
import './styles/index.css';
import React, { useState } from 'react';
import { AdminPage, AdminActionButton } from '../../../../components/AdminShell';
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
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const { actions } = useScenarioEditor();
  const { onClickSaveScenario } = actions;

  return (
    <>
      <AdminPage
        className="admin-page--scenario-editor"
        title="シナリオ設定"
        toolbar={
          <AdminActionButton action="save" onClick={() => onClickSaveScenario()} />
        }
      >
        <div className="scenario-editor-page-body">
          <div className="ss-sc-setting ss-editor-layout-v2">
            <div
              className={`ss-sc-content ss-overview ss-layout-column ss-layout-overview-column${
                isPreviewVisible
                  ? ' ss-layout-overview-column--preview-visible'
                  : ' ss-layout-overview-column--preview-hidden'
              }`}
            >
              <div className="ss-layout-overview-form">
                <ScenarioOverviewPanel />
              </div>
              <ScenarioMessageOverview>
                <ScenarioMessageOverviewList />
              </ScenarioMessageOverview>
              <div className="ss-layout-overview-preview">
                <ScenarioEditorPreviewSection onPreviewVisibleChange={setIsPreviewVisible} />
              </div>
            </div>
            <ScenarioMessageDetailPanel>
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
