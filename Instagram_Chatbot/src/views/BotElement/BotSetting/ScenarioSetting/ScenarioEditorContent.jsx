import '../../../../assets/css/bot/scenario/scenario-editor-layout.css';
import React from 'react';
import { Col, Row, Card, CardBody } from 'reactstrap';
import ScenarioActionsBar from './components/ScenarioActionsBar';
import ScenarioOverviewPanel from './components/ScenarioOverviewPanel';
import ScenarioMessageOverview from './components/ScenarioMessageOverview';
import ScenarioMessageOverviewList from './components/ScenarioMessageOverviewList';
import ScenarioMessageDetailPanel from './components/ScenarioMessageDetailPanel';
import ScenarioBotSettingsPanel from './components/ScenarioBotSettingsPanel';
import ScenarioUserSettingsPanel from './components/ScenarioUserSettingsPanel';
import ScenarioEditorModals from './components/ScenarioEditorModals';
import ScenarioPreviewOverlay from './components/ScenarioPreviewOverlay';

const ScenarioEditorContent = () => (
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
                <ScenarioMessageOverview>
                  <ScenarioMessageOverviewList />
                </ScenarioMessageOverview>
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
    <ScenarioPreviewOverlay />
  </div>
);

export default ScenarioEditorContent;
