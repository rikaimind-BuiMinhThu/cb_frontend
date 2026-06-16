import '../../../../assets/css/bot/scenario/scenario-editor-layout.css';
import React from 'react';
import { Col, Row, Card, CardBody } from 'reactstrap';
import ScenarioActionsBar from './components/ScenarioActionsBar';
import ScenarioOverviewPanel from './components/ScenarioOverviewPanel';
import ScenarioMessageDetailPanel from './components/ScenarioMessageDetailPanel';
import ScenarioBotSettingsPanel from './components/ScenarioBotSettingsPanel';
import ScenarioUserSettingsPanel from './components/ScenarioUserSettingsPanel';
import ScenarioEditorModals from './components/ScenarioEditorModals';
import ScenarioEditorPreviewPanel from './components/ScenarioEditorPreviewPanel';
import OverviewEmptyState from './components/overview/OverviewEmptyState';
import { useScenarioEditor } from './context/ScenarioEditorContext';

const ScenarioEditorContent = () => {
  const { state, actions } = useScenarioEditor();
  const { dataMessages } = state;
  const { onClickCreateStatement } = actions;

  return (
    <div className="content">
      <ScenarioActionsBar />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="ss-sc-setting ss-editor-layout-v2">
                <div className="ss-sc-content ss-overview ss-layout-column ss-layout-overview-column">
                  <div className="ss-layout-overview-form">
                    <ScenarioOverviewPanel />
                  </div>
                  <div className="ss-layout-overview-preview">
                    <OverviewEmptyState
                      dataMessages={dataMessages}
                      onCreateStatement={onClickCreateStatement}
                    />
                    {dataMessages && dataMessages.length > 0 && (
                      <div className="ss-layout-preview-toolbar">
                        <button
                          type="button"
                          className="ss-layout-preview-toolbar__btn"
                          onClick={() => onClickCreateStatement('bot')}
                        >
                          ボット発言
                        </button>
                        <button
                          type="button"
                          className="ss-layout-preview-toolbar__btn"
                          onClick={() => onClickCreateStatement('user')}
                        >
                          ユーザ入力
                        </button>
                      </div>
                    )}
                    <ScenarioEditorPreviewPanel />
                  </div>
                </div>
                <ScenarioMessageDetailPanel>
                  <ScenarioBotSettingsPanel />
                  <ScenarioUserSettingsPanel />
                </ScenarioMessageDetailPanel>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <ScenarioEditorModals />
    </div>
  );
};

export default ScenarioEditorContent;
