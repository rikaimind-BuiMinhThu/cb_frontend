import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import {
  CONFIRM_CANCEL,
  CONFIRM_DELETE,
  CONFIRM_MODAL_WIDTH,
  CONFIRM_OK,
  CONFIRM_TITLE,
} from './constants';

const AdminConfirmModal = ({
  open,
  visible,
  title = CONFIRM_TITLE,
  message,
  okText,
  cancelText = CONFIRM_CANCEL,
  onOk,
  onCancel,
  danger = false,
  loading = false,
}) => {
  const resolvedOkText = okText ?? (danger ? CONFIRM_DELETE : CONFIRM_OK);

  return (
    <Modal
      title={title}
      open={open ?? visible}
      onOk={onOk}
      onCancel={onCancel}
      okText={resolvedOkText}
      cancelText={cancelText}
      okButtonProps={{ danger, loading }}
      centered
      width={CONFIRM_MODAL_WIDTH}
    >
      <p className="admin-confirm-modal-message">{message}</p>
    </Modal>
  );
};

AdminConfirmModal.propTypes = {
  open: PropTypes.bool,
  visible: PropTypes.bool,
  title: PropTypes.string,
  message: PropTypes.node,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  danger: PropTypes.bool,
  loading: PropTypes.bool,
};

export default AdminConfirmModal;
