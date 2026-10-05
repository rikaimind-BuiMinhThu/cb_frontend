import React, { useRef, useEffect, useState } from 'react';
import { useScenarioEditor } from '../../context/ScenarioEditorContext';
import ScenarioModalShell from './shared/ScenarioModalShell';
import {
  SETTINGS_MODAL_VIEWS,
  SETTINGS_VIEW_TITLES,
} from './shared/scenarioModalTooltips';
import ScenarioSettingsMainView from './views/ScenarioSettingsMainView';
import ScenarioCustomCssView from './views/ScenarioCustomCssView';
import ScenarioCustomJsView from './views/ScenarioCustomJsView';
import ScenarioHtmlUgcView from './views/ScenarioHtmlUgcView';
import ScenarioTimerView from './views/ScenarioTimerView';
import ScenarioErrMsgView from './views/ScenarioErrMsgView';
import ScenarioAutoLogoutView from './views/ScenarioAutoLogoutView';
import ScenarioSettingsAmazonPayView from './views/ScenarioSettingsAmazonPayView';
import ScenarioGlobalDelayView from './views/ScenarioGlobalDelayView';

const ScenarioSettingsModalContainer = () => {
  const { state, actions } = useScenarioEditor();
  const { isOpenScenarioSettingsModal, settingsModalView } = state;
  const { closeScenarioSettingsModal, backToSettingsMainView } = actions;

  const prevViewRef = useRef(settingsModalView);
  const [transitionClass, setTransitionClass] = useState('');

  useEffect(() => {
    const prevView = prevViewRef.current;
    const currentView = settingsModalView;

    if (prevView !== currentView) {
      if (currentView === SETTINGS_MODAL_VIEWS.MAIN) {
        setTransitionClass('ss-settings-modal-view--enter-back');
      } else if (prevView === SETTINGS_MODAL_VIEWS.MAIN) {
        setTransitionClass('ss-settings-modal-view--enter-forward');
      } else {
        setTransitionClass('ss-settings-modal-view--enter-forward');
      }

      prevViewRef.current = currentView;
    }
  }, [settingsModalView]);

  const isMainView = settingsModalView === SETTINGS_MODAL_VIEWS.MAIN;
  const title = SETTINGS_VIEW_TITLES[settingsModalView] || SETTINGS_VIEW_TITLES[SETTINGS_MODAL_VIEWS.MAIN];

  const renderView = () => {
    switch (settingsModalView) {
      case SETTINGS_MODAL_VIEWS.CSS:
        return <ScenarioCustomCssView onBack={backToSettingsMainView} />;
      case SETTINGS_MODAL_VIEWS.JS:
        return <ScenarioCustomJsView onBack={backToSettingsMainView} />;
      case SETTINGS_MODAL_VIEWS.HTML_UGC:
        return <ScenarioHtmlUgcView onBack={backToSettingsMainView} />;
      case SETTINGS_MODAL_VIEWS.TIMER:
        return <ScenarioTimerView onBack={backToSettingsMainView} />;
      case SETTINGS_MODAL_VIEWS.ERR_MSG:
        return <ScenarioErrMsgView onBack={backToSettingsMainView} />;
      case SETTINGS_MODAL_VIEWS.AUTO_LOGOUT:
        return <ScenarioAutoLogoutView onBack={backToSettingsMainView} />;
      case SETTINGS_MODAL_VIEWS.AMAZON_PAY:
        return <ScenarioSettingsAmazonPayView onBack={backToSettingsMainView} />;
      case SETTINGS_MODAL_VIEWS.GLOBAL_DELAY:
        return <ScenarioGlobalDelayView onBack={backToSettingsMainView} />;
      case SETTINGS_MODAL_VIEWS.MAIN:
      default:
        return <ScenarioSettingsMainView onClose={closeScenarioSettingsModal} />;
    }
  };

  return (
    <ScenarioModalShell
      open={isOpenScenarioSettingsModal}
      onClose={isMainView ? closeScenarioSettingsModal : backToSettingsMainView}
      title={title}
      onBack={!isMainView ? backToSettingsMainView : undefined}
      className="ss-layout-settings-modal"
      width={750}
    >
      <div className="ss-settings-modal-views">
        <div
          key={settingsModalView}
          className={`ss-settings-modal-view ${transitionClass}`}
        >
          {renderView()}
        </div>
      </div>
    </ScenarioModalShell>
  );
};

export default ScenarioSettingsModalContainer;
