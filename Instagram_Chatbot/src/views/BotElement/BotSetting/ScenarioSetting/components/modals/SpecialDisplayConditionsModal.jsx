import React from 'react';
import PropTypes from 'prop-types';
import ScenarioModalShell from './shared/ScenarioModalShell';
import ScenarioModalFooter from './shared/ScenarioModalFooter';
import ScenarioModalCheckbox from './shared/ScenarioModalCheckbox';
import ScenarioInfoTooltip from './shared/ScenarioInfoTooltip';
import SelectCustom from '../../scenarioComon/SelectCustom';
import { dataAmazonPayDisplayMode } from '../../../../../../variables/amazonPayConstants';
import { getAmazonPayDisplayModeFromConditions } from '../../utils/amazonPayConfigUtils';
import {
  SCENARIO_MODAL_TOOLTIPS,
  USER_CONTENT_OPTION_LABELS,
} from './shared/scenarioModalTooltips';

const labelWithTooltip = (text, tooltipKey) => (
  <>
    {text}
    <ScenarioInfoTooltip text={SCENARIO_MODAL_TOOLTIPS[tooltipKey]} />
  </>
);

const SpecialDisplayConditionsModal = ({
  open,
  onClose,
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
    <ScenarioModalShell
      open={open}
      onClose={onClose}
      title="特別表示条件設定"
      width={560}
      footer={(
        <ScenarioModalFooter
          onClose={onClose}
          showConfirm={false}
        />
      )}
    >
      <div className="ss-special-display-conditions-modal">
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
    </ScenarioModalShell>
  );
};

SpecialDisplayConditionsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedMessage: PropTypes.object,
  dataMessages: PropTypes.array.isRequired,
  setDataMessages: PropTypes.func.isRequired,
  isUseFukushashiki: PropTypes.bool,
  onChangeAmazonPayDisplayMode: PropTypes.func.isRequired,
};

export default SpecialDisplayConditionsModal;
