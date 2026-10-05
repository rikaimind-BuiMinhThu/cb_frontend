import React from 'react';
import { AdminConfirmModal, AdminPage } from '../../../components/AdminShell';
import DefaultReplySection from './components/DefaultReplySection';
import KeywordFormModal from './components/KeywordFormModal';
import KeywordTable from './components/KeywordTable';
import { useKeywordSettings } from './context/KeywordSettingsContext';
import { CONFIRM_MESSAGES, PAGE_TITLE } from './constants';
import './styles/keyword-settings.css';

function KeywordSettingsContent() {
  const {
    deleteModalOpen,
    deleteLoading,
    closeDeleteModal,
    confirmDelete,
  } = useKeywordSettings();

  return (
    <>
      <AdminPage className="admin-page--keyword-settings" title={PAGE_TITLE}>
        <div className="keyword-settings-body">
          <DefaultReplySection />
          <KeywordTable />
        </div>
      </AdminPage>

      <KeywordFormModal />

      <AdminConfirmModal
        open={deleteModalOpen}
        title="確認"
        message={CONFIRM_MESSAGES.DELETE_KEYWORD}
        onOk={confirmDelete}
        onCancel={closeDeleteModal}
        loading={deleteLoading}
        danger
      />
    </>
  );
}

export default KeywordSettingsContent;
