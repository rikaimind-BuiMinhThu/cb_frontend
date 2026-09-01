import React from 'react';
import { Modal } from 'antd';

function AdminConfirmModal({
  open,
  visible,
  title = '確認',
  message,
  okText,
  cancelText = 'キャンセル',
  onOk,
  onCancel,
  danger = false,
  loading = false,
}) {
  const resolvedOkText = okText ?? (danger ? '削除' : 'はい');

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
      width={400}
    >
      <p className="admin-confirm-modal-message">{message}</p>
    </Modal>
  );
}

export default AdminConfirmModal;
