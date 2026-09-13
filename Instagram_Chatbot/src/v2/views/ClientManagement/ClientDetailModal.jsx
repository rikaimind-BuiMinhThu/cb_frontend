import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { AdminActionButton } from 'v2/components/AdminShell';
import ClientFormBody from './components/ClientFormBody';
import {
  CLIENT_MODAL_WIDTH,
  DETAIL_AVATAR_ID,
  DETAIL_FORM_ID,
  FORM_MODE_EDIT,
  MODAL_SCROLL_CLASS,
  UPDATE_BUTTON_ID,
  UPDATE_CLIENT_BUTTON_LABEL,
} from './constants';

const ClientDetailModal = ({ open, onClose, title, form, onSubmit, loading }) => {
  const { antdForm, formBodyProps, formMode, disableInput, handleImageChange, handleSelectImageClick } =
    form;

  return (
    <Modal
      key={form.detailData?.id}
      title={title}
      open={open}
      onCancel={onClose}
      width={CLIENT_MODAL_WIDTH}
      centered
      destroyOnClose
      className={MODAL_SCROLL_CLASS}
      footer={
        formMode === FORM_MODE_EDIT ? (
          <div className="admin-form-actions">
            <AdminActionButton action="cancel" onClick={onClose} />
            <AdminActionButton
              action="save"
              label={UPDATE_CLIENT_BUTTON_LABEL}
              id={UPDATE_BUTTON_ID}
              loading={loading}
              onClick={onSubmit}
            />
          </div>
        ) : null
      }
    >
      <ClientFormBody
        formId={DETAIL_FORM_ID}
        antdForm={antdForm}
        showPasswordFields={false}
        disableInput={disableInput}
        avatarId={DETAIL_AVATAR_ID}
        onImageChange={(e) => handleImageChange(e, false)}
        onSelectImageClick={handleSelectImageClick}
        {...formBodyProps}
      />
    </Modal>
  );
};

ClientDetailModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  form: PropTypes.object,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
};

export default ClientDetailModal;
