import React, { useCallback, useState } from 'react';
import { Button, Modal, Spin } from 'antd';
import instaImg from '../../../Popup/instagram.jpeg';
import useCrmUserDetail from '../hooks/useCrmUserDetail';
import useCrmMutations from '../hooks/useCrmMutations';
import UserProfilePanel from './UserProfilePanel';
import LabelsSection from './LabelsSection';
import CustomDataSection from './CustomDataSection';
import MessageHistorySection from './MessageHistorySection';
import AddLabelModal from './AddLabelModal';
import AddCustomItemModal from './AddCustomItemModal';

function CrmUserDetailModal({ open, userId, isAdminDeel, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [addLabelOpen, setAddLabelOpen] = useState(false);
  const [addCustomItemOpen, setAddCustomItemOpen] = useState(false);
  const [mutationLoading, setMutationLoading] = useState(false);

  const {
    user,
    labels,
    customItems,
    messageHistories,
    loading,
    reload,
    setLabels,
    setCustomItems,
  } = useCrmUserDetail(open ? userId : null);

  const handleStatusUpdated = useCallback(async () => {
    await reload();
  }, [reload]);

  const {
    statusUpdating,
    changeStatus,
    addLabel,
    removeLabel,
    addCustomItem,
    removeCustomItem,
  } = useCrmMutations({ onStatusUpdated: handleStatusUpdated });

  const handleClose = () => {
    setIsEditing(false);
    setAddLabelOpen(false);
    setAddCustomItemOpen(false);
    onClose?.();
  };

  const handleSave = () => {
    setIsEditing(false);
    reload();
  };

  const handleAddLabel = async (name) => {
    if (!user?.id) return;
    setMutationLoading(true);
    try {
      await addLabel({ name, instagramUserId: user.id });
      setAddLabelOpen(false);
      await reload();
    } finally {
      setMutationLoading(false);
    }
  };

  const handleDeleteLabel = async (id) => {
    setMutationLoading(true);
    try {
      await removeLabel(id);
      setLabels((prev) => prev.filter((label) => label.id !== id));
    } finally {
      setMutationLoading(false);
    }
  };

  const handleAddCustomItem = async ({ title, value }) => {
    if (!user?.id) return;
    setMutationLoading(true);
    try {
      await addCustomItem({ title, value, instagramUserId: user.id });
      setAddCustomItemOpen(false);
      await reload();
    } finally {
      setMutationLoading(false);
    }
  };

  const handleDeleteCustomItem = async (id) => {
    setMutationLoading(true);
    try {
      await removeCustomItem(id);
      setCustomItems((prev) => prev.filter((item) => item.id !== id));
    } finally {
      setMutationLoading(false);
    }
  };

  return (
    <>
      <Modal
        title="ユーザー詳細"
        open={open}
        onCancel={handleClose}
        footer={null}
        width="80vw"
        centered
        destroyOnClose
        className="crm-detail-modal"
      >
        <div className="crm-detail-modal__body">
          {(loading || statusUpdating || mutationLoading) && (
            <div className="crm-detail-modal__loading">
              <Spin size="large" />
            </div>
          )}

          {user && (
            <div className="crm-detail-modal__grid">
              <div className="crm-detail-modal__column">
                <UserProfilePanel
                  user={user}
                  onStatusChange={changeStatus}
                  statusUpdating={statusUpdating}
                />
              </div>

              <div className="crm-detail-modal__column crm-detail-modal__column--center">
                <div className="crm-detail-modal__header">
                  <h3 className="crm-detail-modal__username">
                    {user.username}
                    <img src={instaImg} alt="" />
                  </h3>
                  {isAdminDeel && (
                    <div>
                      {isEditing ? (
                        <Button type="primary" onClick={handleSave}>
                          保存
                        </Button>
                      ) : (
                        <Button onClick={() => setIsEditing(true)}>編集</Button>
                      )}
                    </div>
                  )}
                </div>

                <LabelsSection
                  labels={labels}
                  isEditing={isEditing}
                  isAdminDeel={isAdminDeel}
                  onAddClick={() => setAddLabelOpen(true)}
                  onDelete={handleDeleteLabel}
                />

                <CustomDataSection
                  items={customItems}
                  isEditing={isEditing}
                  isAdminDeel={isAdminDeel}
                  onAddClick={() => setAddCustomItemOpen(true)}
                  onDelete={handleDeleteCustomItem}
                />
              </div>

              <div className="crm-detail-modal__column">
                <MessageHistorySection histories={messageHistories} />
              </div>
            </div>
          )}
        </div>
      </Modal>

      <AddLabelModal
        open={addLabelOpen}
        loading={mutationLoading}
        onCancel={() => setAddLabelOpen(false)}
        onSubmit={handleAddLabel}
      />

      <AddCustomItemModal
        open={addCustomItemOpen}
        loading={mutationLoading}
        onCancel={() => setAddCustomItemOpen(false)}
        onSubmit={handleAddCustomItem}
      />
    </>
  );
}

export default CrmUserDetailModal;
