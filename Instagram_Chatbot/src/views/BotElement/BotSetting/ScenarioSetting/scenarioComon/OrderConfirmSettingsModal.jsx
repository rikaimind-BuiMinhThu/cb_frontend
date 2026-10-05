import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import ScenarioModalShell from '../components/modals/shared/ScenarioModalShell';
import ScenarioModalFooter from '../components/modals/shared/ScenarioModalFooter';
import OrderConfirmSettingsModalContent from './OrderConfirmSettingsModalContent';

export default function OrderConfirmSettingsModal({
  config,
  indexMessageSelect,
  indexContent,
  messageType,
  onChangeValueMessageContent,
  dataMessages,
  setDataMessages,
  onConfigChange,
  buttonLabel = '詳細設定',
  title = '注文確認設定',
  inline = false,
}) {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);

  const content = (
    <OrderConfirmSettingsModalContent
      config={config}
      indexMessageSelect={indexMessageSelect}
      indexContent={indexContent}
      messageType={messageType}
      onChangeValueMessageContent={onChangeValueMessageContent}
      dataMessages={dataMessages}
      setDataMessages={setDataMessages}
      onConfigChange={onConfigChange}
    />
  );

  if (inline) {
    return content;
  }

  return (
    <>
      <div className="ss-address-field-settings-modal__trigger-row">
        <Button
          type="button"
          className="ss-address-field-settings-modal__trigger-btn"
          onClick={() => setOpen(true)}
        >
          {buttonLabel}
        </Button>
      </div>

      <ScenarioModalShell
        open={open}
        onClose={closeModal}
        title={title}
        width={750}
        className="ss-order-confirm-settings-modal"
        footer={(
          <ScenarioModalFooter
            onClose={closeModal}
            showConfirm={false}
          />
        )}
      >
        {content}
      </ScenarioModalShell>
    </>
  );
}

OrderConfirmSettingsModal.propTypes = {
  config: PropTypes.object.isRequired,
  indexMessageSelect: PropTypes.number,
  indexContent: PropTypes.number,
  messageType: PropTypes.string,
  onChangeValueMessageContent: PropTypes.func,
  dataMessages: PropTypes.array,
  setDataMessages: PropTypes.func,
  onConfigChange: PropTypes.func,
  buttonLabel: PropTypes.string,
  title: PropTypes.string,
  inline: PropTypes.bool,
};
