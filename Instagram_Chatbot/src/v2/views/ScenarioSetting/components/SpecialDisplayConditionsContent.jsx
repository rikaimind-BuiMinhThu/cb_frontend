import React from 'react';
import PropTypes from 'prop-types';
import ScenarioModalCheckbox from './modals/shared/ScenarioModalCheckbox';
import { AdminInfoTooltip } from 'v2/components/AdminShell';
import SelectCustom from '../scenarioCommon/SelectCustom';
import { dataAmazonPayDisplayMode } from 'v2/variables/amazonPayConstants';
import { getAmazonPayDisplayModeFromConditions } from 'v2/views/ScenarioSetting/utils/amazonPayConfigUtils';
import {
  SCENARIO_MODAL_TOOLTIPS,
  USER_CONTENT_OPTION_LABELS,
} from './modals/shared/scenarioModalTooltips';

const labelWithTooltip = (text, tooltipKey) => (
  <>
    {text}
    <AdminInfoTooltip text={SCENARIO_MODAL_TOOLTIPS[tooltipKey]} />
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
    setDataMessages(dataMessages.map((msg) => (
      msg.id === selectedMessage.id ? { ...msg, [field]: value } : msg
    )));
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
        <div className="ss-config-field--mt16">
          <SelectCustom
            label="表示"
            allowClear={false}
            className="ss-select--full"
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
