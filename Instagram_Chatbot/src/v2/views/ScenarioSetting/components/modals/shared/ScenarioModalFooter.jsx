import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

const ScenarioModalFooter = ({
  onClose,
  onConfirm,
  closeLabel = '閉じる',
  confirmLabel = '保存',
  showConfirm = true,
  confirmDisabled = false,
}) => (
  <div className="ss-settings-modal-footer">
    <Button
      type="button"
      className="ss-settings-modal-footer__btn ss-settings-modal-footer__btn--secondary"
      onClick={onClose}
    >
      {closeLabel}
    </Button>
    {showConfirm && onConfirm && (
      <Button
        type="button"
        className="ss-settings-modal-footer__btn ss-settings-modal-footer__btn--primary"
        onClick={onConfirm}
        disabled={confirmDisabled}
      >
        {confirmLabel}
      </Button>
    )}
  </div>
);

ScenarioModalFooter.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  closeLabel: PropTypes.string,
  confirmLabel: PropTypes.string,
  showConfirm: PropTypes.bool,
  confirmDisabled: PropTypes.bool,
};

export default ScenarioModalFooter;
