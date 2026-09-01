import React from 'react';
import { Modal } from 'antd';
import { AdminActionButton } from '../../components/AdminShell';
import ClientFormBody from './components/ClientFormBody';
import { DETAIL_FORM_ID } from './constants';

function ClientDetailModal({ open, onClose, title, form, onSubmit, loading }) {
  const { antdForm, formBodyProps, formMode, disableInput, handleImageChange, handleSelectImageClick } =
    form;

  return (
    <Modal
      key={form.detailData?.id}
      title={title}
      open={open}
      onCancel={onClose}
      width={920}
      centered
      destroyOnClose
      bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
      footer={
        formMode === 'edit' ? (
          <div className="admin-form-actions">
            <AdminActionButton action="cancel" onClick={onClose} />
            <AdminActionButton action="save" label="更新" id="btnUpdate" loading={loading} onClick={onSubmit} />
          </div>
        ) : null
      }
    >
      <ClientFormBody
        formId={DETAIL_FORM_ID}
        antdForm={antdForm}
        showPasswordFields={false}
        disableInput={disableInput}
        avatarId="avatar"
        onImageChange={(e) => handleImageChange(e, false)}
        onSelectImageClick={handleSelectImageClick}
        {...formBodyProps}
      />
    </Modal>
  );
}

export default ClientDetailModal;
