import React from 'react';
import {
  DEFAULT_TAG_FIRING,
  GA4_MEASUREMENT_ID_PLACEHOLDER,
  TAG_FIRING_PROVIDERS,
} from 'v2/variables/tagFiringConstants';
import {
  TAG_FIRING_LABELS,
  TAG_FIRING_TOOLTIPS,
} from '../../../constants/tagFiringLabels';
import { useScenarioEditor } from '../../../context/ScenarioEditorContext';
import InputCustom from '../../../scenarioCommon/InputCustom';
import {
  isValidGa4MeasurementId,
  normalizeGa4MeasurementId,
} from '../../../utils/tagFiringUtils';
import ScenarioFormRow from '../shared/ScenarioFormRow';
import ScenarioModalFooter from '../shared/ScenarioModalFooter';

const ScenarioSettingsTagFiringView = ({ onBack }) => {
  const { state, actions } = useScenarioEditor();
  const tagFiring = state.tagFiring || DEFAULT_TAG_FIRING;
  const { setTagFiring } = actions;
  const isGa4 = tagFiring.provider === TAG_FIRING_PROVIDERS.GA4;
  const measurementId = tagFiring.measurement_id || '';
  const measurementError = measurementId && !isValidGa4MeasurementId(measurementId)
    ? TAG_FIRING_LABELS.measurementIdError
    : '';
  const footerHelp = isGa4 ? TAG_FIRING_LABELS.helpGa4 : TAG_FIRING_LABELS.helpGtm;

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
              checked={!isGa4}
              onChange={() => patchTagFiring({ provider: TAG_FIRING_PROVIDERS.GTM })}
            />
            {TAG_FIRING_LABELS.providerGtm}
          </label>
          <label className="ss-tag-firing-view__provider">
            <input
              type="radio"
              name="ss-tag-firing-provider"
              checked={isGa4}
              onChange={() => patchTagFiring({ provider: TAG_FIRING_PROVIDERS.GA4 })}
            />
            {TAG_FIRING_LABELS.providerGa4}
          </label>
        </div>
      </ScenarioFormRow>

      {isGa4 && (
        <ScenarioFormRow
          label={TAG_FIRING_LABELS.measurementId}
          tooltip={TAG_FIRING_TOOLTIPS.measurementId}
          required
          error={measurementError}
        >
          <InputCustom
            value={measurementId}
            onChange={(value) => patchTagFiring({
              measurement_id: normalizeGa4MeasurementId(value),
            })}
            placeholder={GA4_MEASUREMENT_ID_PLACEHOLDER}
          />
          <p className="ss-settings-help-text">{TAG_FIRING_LABELS.measurementIdHelp}</p>
        </ScenarioFormRow>
      )}

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
      <p className="ss-settings-help-text">{footerHelp}</p>
      <ScenarioModalFooter
        onClose={onBack}
        showConfirm={false}
      />
    </div>
  );
};

export default ScenarioSettingsTagFiringView;
