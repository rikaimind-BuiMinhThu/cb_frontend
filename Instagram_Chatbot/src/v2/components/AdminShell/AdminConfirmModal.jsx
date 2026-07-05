import React from 'react';
import { Modal } from 'antd';

function AdminConfirmModal({
  open,
  visible,
  title = '確認',
  message,
  okText = 'はい',
  cancelText = 'いいえ',
  onOk,
  onCancel,
  danger = false,
  loading = false,
}) {
  return (
    <Modal
      title={title}
      open={open ?? visible}
      onOk={onOk}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      okButtonProps={{ danger, loading }}
      centered
      width={400}
    >
      <p style={{ margin: 0, color: '#374151' }}>{message}</p>
    </Modal>
  );
}

export default AdminConfirmModal;
