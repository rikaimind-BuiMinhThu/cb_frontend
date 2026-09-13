import React from 'react';
import { useScenarioEditor } from '../../../context/ScenarioEditorContext';
import ScenarioFormRow from '../shared/ScenarioFormRow';
import ScenarioModalFooter from '../shared/ScenarioModalFooter';
import InputCustom from '../../../scenarioCommon/InputCustom';
import { TAG_FIRING_LABELS } from '../../../constants/tagFiringLabels';
import {
  DEFAULT_TAG_FIRING,
  TAG_FIRING_PROVIDERS,
} from 'v2/variables/tagFiringConstants';

const ScenarioSettingsTagFiringView = ({ onBack }) => {
  const { state, actions } = useScenarioEditor();
  const tagFiring = state.tagFiring || DEFAULT_TAG_FIRING;
  const { setTagFiring } = actions;

  const patchTagFiring = (patch) => {
    setTagFiring({
      ...DEFAULT_TAG_FIRING,
      ...tagFiring,
      ...patch,
    });
  };

  return (
    <div className="ss-tag-firing-view">
      <ScenarioFormRow label={TAG_FIRING_LABELS.provider} alignTop>
        <div className="ss-tag-firing-view__providers">
          <label className="ss-tag-firing-view__provider">
            <input
              type="radio"
              name="ss-tag-firing-provider"
              checked={tagFiring.provider !== TAG_FIRING_PROVIDERS.GA4}
              onChange={() => patchTagFiring({ provider: TAG_FIRING_PROVIDERS.GTM })}
            />
            {TAG_FIRING_LABELS.providerGtm}
          </label>
          <label className="ss-tag-firing-view__provider">
            <input
              type="radio"
              name="ss-tag-firing-provider"
              checked={tagFiring.provider === TAG_FIRING_PROVIDERS.GA4}
              onChange={() => patchTagFiring({ provider: TAG_FIRING_PROVIDERS.GA4 })}
            />
            {TAG_FIRING_LABELS.providerGa4}
          </label>
        </div>
      </ScenarioFormRow>

      <ScenarioFormRow label={TAG_FIRING_LABELS.openEvent}>
        <InputCustom
          value={tagFiring.open_event || ''}
          onChange={(value) => patchTagFiring({ open_event: value })}
          placeholder={DEFAULT_TAG_FIRING.open_event}
        />
      </ScenarioFormRow>
      <ScenarioFormRow label={TAG_FIRING_LABELS.startEvent}>
        <InputCustom
          value={tagFiring.start_event || ''}
          onChange={(value) => patchTagFiring({ start_event: value })}
          placeholder={DEFAULT_TAG_FIRING.start_event}
        />
      </ScenarioFormRow>
      <ScenarioFormRow label={TAG_FIRING_LABELS.completeEvent}>
        <InputCustom
          value={tagFiring.complete_event || ''}
          onChange={(value) => patchTagFiring({ complete_event: value })}
          placeholder={DEFAULT_TAG_FIRING.complete_event}
        />
      </ScenarioFormRow>
      <p className="ss-settings-help-text">{TAG_FIRING_LABELS.help}</p>
      <ScenarioModalFooter
        onClose={onBack}
        showConfirm={false}
      />
    </div>
  );
};

export default ScenarioSettingsTagFiringView;
