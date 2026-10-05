import React, { useCallback, useState } from 'react';
import { AdminConfirmModal, AdminPage } from '../../../components/AdminShell';
import useListUserRole from '../ListUser/hooks/useListUserRole';
import useCrmUsers from './hooks/useCrmUsers';
import useCrmMutations from './hooks/useCrmMutations';
import CrmUserTable from './components/CrmUserTable';
import CrmUserDetailModal from './components/CrmUserDetailModal';
import './styles/crm.css';

function CrmPage() {
  const isAdminDeel = useListUserRole();
  const users = useCrmUsers({ isAdminDeel });

  const [detailUserId, setDetailUserId] = useState(null);
  const [autoReplyUserId, setAutoReplyUserId] = useState(null);

  const { autoReplyLoading, switchToAutoReply } = useCrmMutations({
    onListRefresh: users.refreshList,
  });

  const handleViewDetail = useCallback((id) => {
    setDetailUserId(id);
  }, []);

  const handleAutoReply = useCallback((id) => {
    setAutoReplyUserId(id);
  }, []);

  const handleConfirmAutoReply = useCallback(async () => {
    if (!autoReplyUserId) return;
    await switchToAutoReply(autoReplyUserId);
    setAutoReplyUserId(null);
  }, [autoReplyUserId, switchToAutoReply]);

  return (
    <AdminPage title="CRM" className="crm-page">
      <div className="admin-page-card crm-section">
        <CrmUserTable
          isAdminDeel={isAdminDeel}
          onViewDetail={handleViewDetail}
          onAutoReply={handleAutoReply}
          {...users}
        />
      </div>

      <CrmUserDetailModal
        open={Boolean(detailUserId)}
        userId={detailUserId}
        isAdminDeel={isAdminDeel}
        onClose={() => setDetailUserId(null)}
      />

      <AdminConfirmModal
        open={Boolean(autoReplyUserId)}
        title="確認"
        message="自動応答に切り替えますか？"
        onOk={handleConfirmAutoReply}
        onCancel={() => setAutoReplyUserId(null)}
        loading={autoReplyLoading}
      />
    </AdminPage>
  );
}

export default CrmPage;
