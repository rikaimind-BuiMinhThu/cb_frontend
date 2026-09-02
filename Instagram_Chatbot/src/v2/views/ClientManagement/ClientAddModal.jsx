import React from 'react';
import { Modal } from 'antd';
import { AdminActionButton } from 'v2/components/AdminShell';
import ClientFormBody from './components/ClientFormBody';
import { ADD_FORM_ID } from './constants';

function ClientAddModal({ open, onClose, form, onSubmit, loading }) {
  const { antdForm, formBodyProps, handleImageChange, handleSelectImageClick } = form;

  return (
    <Modal
      title="クライアント追加"
      open={open}
      onCancel={onClose}
      width={920}
      centered
      destroyOnClose
      bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
      footer={
        <div className="admin-form-actions">
          <AdminActionButton action="cancel" onClick={onClose} />
          <AdminActionButton action="create" label="追加" id="btnSubmit" loading={loading} onClick={onSubmit} />
        </div>
      }
    >
      <ClientFormBody
        formId={ADD_FORM_ID}
        antdForm={antdForm}
        showPasswordFields
        disableInput={false}
        avatarId="avatar_add"
        onImageChange={(e) => handleImageChange(e, true)}
        onSelectImageClick={handleSelectImageClick}
        {...formBodyProps}
      />
    </Modal>
  );
}

export default ClientAddModal;
