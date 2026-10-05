import React from 'react';
import PropTypes from 'prop-types';
import ScenarioModalCheckbox from './modals/shared/ScenarioModalCheckbox';
import ScenarioInfoTooltip from './modals/shared/ScenarioInfoTooltip';
import SelectCustom from '../scenarioComon/SelectCustom';
import { dataAmazonPayDisplayMode } from '../../../../../variables/amazonPayConstants';
import { getAmazonPayDisplayModeFromConditions } from '../utils/amazonPayConfigUtils';
import {
  SCENARIO_MODAL_TOOLTIPS,
  USER_CONTENT_OPTION_LABELS,
} from './modals/shared/scenarioModalTooltips';

const labelWithTooltip = (text, tooltipKey) => (
  <>
    {text}
    <ScenarioInfoTooltip text={SCENARIO_MODAL_TOOLTIPS[tooltipKey]} />
  </>
);

const SpecialDisplayConditionsContent = ({
  selectedMessage,
  dataMessages,
  setDataMessages,
  isUseFukushashiki,
  onChangeAmazonPayDisplayMode,
}) => {
  if (!selectedMessage) return null;

  const updateMessageField = (field, value) => {
    Object.assign(selectedMessage, { [field]: value });
    setDataMessages([...dataMessages]);
  };

  const amazonPayDisplayMode = getAmazonPayDisplayModeFromConditions(selectedMessage.conditions);

  return (
    <div className="ss-special-display-conditions-content">
      <ScenarioModalCheckbox
        checked={!!selectedMessage.not_display_when_logged_in}
        onChange={(checked) => updateMessageField('not_display_when_logged_in', checked)}
        label={labelWithTooltip(
          USER_CONTENT_OPTION_LABELS.hideWhenLoggedIn,
          'hideWhenLoggedIn',
        )}
      />
      <ScenarioModalCheckbox
        checked={!!selectedMessage.not_display_when_have_error}
        onChange={(checked) => updateMessageField('not_display_when_have_error', checked)}
        label={labelWithTooltip(
          USER_CONTENT_OPTION_LABELS.hideWhenError,
          'hideWhenError',
        )}
      />
      {isUseFukushashiki && (
        <div style={{ marginTop: '16px' }}>
          <SelectCustom
            label="表示"
            allowClear={false}
            style={{ width: '100%' }}
            data={dataAmazonPayDisplayMode}
            value={amazonPayDisplayMode}
            onChange={onChangeAmazonPayDisplayMode}
          />
        </div>
      )}
    </div>
  );
};

SpecialDisplayConditionsContent.propTypes = {
  selectedMessage: PropTypes.object,
  dataMessages: PropTypes.array.isRequired,
  setDataMessages: PropTypes.func.isRequired,
  isUseFukushashiki: PropTypes.bool,
  onChangeAmazonPayDisplayMode: PropTypes.func.isRequired,
};

export default SpecialDisplayConditionsContent;
