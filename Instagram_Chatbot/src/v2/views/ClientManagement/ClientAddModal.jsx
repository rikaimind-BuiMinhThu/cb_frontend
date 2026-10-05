import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { AdminActionButton } from 'v2/components/AdminShell';
import ClientFormBody from './components/ClientFormBody';
import {
  ADD_AVATAR_ID,
  ADD_CLIENT_BUTTON_LABEL,
  ADD_CLIENT_TITLE,
  ADD_FORM_ID,
  CLIENT_MODAL_WIDTH,
  MODAL_SCROLL_CLASS,
  SUBMIT_BUTTON_ID,
} from './constants';

const ClientAddModal = ({ open, onClose, form, onSubmit, loading }) => {
  const { antdForm, formBodyProps, handleImageChange, handleSelectImageClick } = form;

  return (
    <Modal
      title={ADD_CLIENT_TITLE}
      open={open}
      onCancel={onClose}
      width={CLIENT_MODAL_WIDTH}
      centered
      destroyOnClose
      className={MODAL_SCROLL_CLASS}
      footer={
        <div className="admin-form-actions">
          <AdminActionButton action="cancel" onClick={onClose} />
          <AdminActionButton
            action="create"
            label={ADD_CLIENT_BUTTON_LABEL}
            id={SUBMIT_BUTTON_ID}
            loading={loading}
            onClick={onSubmit}
          />
        </div>
      }
    >
      <ClientFormBody
        formId={ADD_FORM_ID}
        antdForm={antdForm}
        showPasswordFields
        disableInput={false}
        avatarId={ADD_AVATAR_ID}
        onImageChange={(e) => handleImageChange(e, true)}
        onSelectImageClick={handleSelectImageClick}
        {...formBodyProps}
      />
    </Modal>
  );
};

ClientAddModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  form: PropTypes.object,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
};

export default ClientAddModal;
