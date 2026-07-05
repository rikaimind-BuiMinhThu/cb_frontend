import React from 'react';
import PropTypes from 'prop-types';
import ScenarioModalShell from './shared/ScenarioModalShell';
import ScenarioModalFooter from './shared/ScenarioModalFooter';
import SpecialDisplayConditionsContent from '../SpecialDisplayConditionsContent';

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
        <SpecialDisplayConditionsContent
          selectedMessage={selectedMessage}
          dataMessages={dataMessages}
          setDataMessages={setDataMessages}
          isUseFukushashiki={isUseFukushashiki}
          onChangeAmazonPayDisplayMode={onChangeAmazonPayDisplayMode}
        />
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
