import React, { useState } from 'react';
import { Pagination } from 'antd';
import { AdminPage } from '../../../components/AdminShell';
import GroupOverviewPanel, { GroupListPanel } from './components/overview/GroupOverviewPanel';
import MessageOverviewList from './components/overview/MessageOverviewList';
import MessagePreviewPanel from './components/overview/MessagePreviewPanel';
import MessageDetailPanel from './components/MessageDetailPanel';
import MessageEditorPanel from './components/MessageEditorPanel';
import ChatbotEditorModals from './components/modals/ChatbotEditorModals';
import { GROUP_PAGE_SIZE, PAGE_TITLE } from './constants';
import { useChatbotEditor } from './context/ChatbotEditorContext';
import './styles/chatbot-editor-layout.css';
import './styles/chatbot-editor-preview.css';

const ChatbotEditorContent = () => {
  const { groups } = useChatbotEditor();
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);

  return (
    <>
      <AdminPage className="admin-page--chatbot-editor" title={PAGE_TITLE}>
        <div className="chatbot-editor-page-body">
          <div
            className={`cb-editor-layout${
              isPreviewVisible
                ? ' cb-editor-layout--preview-visible'
                : ' cb-editor-layout--preview-hidden'
            }`}
          >
            <div className="cb-layout-overview-column">
              <div className="cb-layout-overview-form">
                <GroupOverviewPanel />
                <GroupListPanel />
                <Pagination
                  className="cb-pagination"
                  size="small"
                  current={groups.page}
                  total={groups.total}
                  pageSize={GROUP_PAGE_SIZE}
                  onChange={groups.handlePageChange}
                  showSizeChanger={false}
                />
              </div>
              <div className="cb-layout-overview-messages">
                <MessageOverviewList />
              </div>
            </div>
            <MessageDetailPanel>
              <MessageEditorPanel />
            </MessageDetailPanel>
            <div className="cb-layout-preview-column">
              <MessagePreviewPanel onPreviewVisibleChange={setIsPreviewVisible} />
            </div>
          </div>
        </div>
      </AdminPage>
      <ChatbotEditorModals />
    </>
  );
};

export default ChatbotEditorContent;
