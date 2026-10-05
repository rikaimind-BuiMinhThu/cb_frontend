import React from 'react';
import { Col, Modal, Row, Spin, Typography } from 'antd';
import { ReleaseEditorProvider, useReleaseEditor } from './context/ReleaseEditorContext';
import InstagramConnectCard from './components/InstagramConnectCard';
import FaqSection from './components/FaqSection';
import CommentReplySection from './components/CommentReplySection';
import PersistentMenuSection from './components/PersistentMenuSection';
import { COMMENT_SECTIONS } from './constants';
import './styles/release-editor.css';

function ReleaseEditorContent() {
  const { connect, settings, confirmState, clearConfirm } = useReleaseEditor();
  const isLoading = connect.loading || settings.loading;

  return (
    <div className="content release-page">
      <Typography.Title level={3}>リリース</Typography.Title>
      <Typography.Paragraph type="secondary">
        Instagramアカウントを接続し、FAQ・コメント返信・固定メニューを公開します。
      </Typography.Paragraph>

      <InstagramConnectCard />

      {isLoading ? (
        <div className="release-page__loading">
          <Spin size="large" />
        </div>
      ) : connect.isConnected ? (
        <Row gutter={[16, 16]} className="release-page__sections">
          <Col xs={24}>
            <FaqSection />
          </Col>
          <Col xs={24} lg={12}>
            <CommentReplySection sectionKey="story" sectionConfig={COMMENT_SECTIONS.story} />
          </Col>
          <Col xs={24} lg={12}>
            <CommentReplySection sectionKey="live" sectionConfig={COMMENT_SECTIONS.live} />
          </Col>
          <Col xs={24}>
            <CommentReplySection sectionKey="post" sectionConfig={COMMENT_SECTIONS.post} />
          </Col>
          <Col xs={24}>
            <PersistentMenuSection />
          </Col>
        </Row>
      ) : (
        <Typography.Paragraph className="release-page__hint">
          設定を開始するには、上記からInstagramアカウントを接続してください。
        </Typography.Paragraph>
      )}

      <Modal
        open={Boolean(confirmState)}
        title={confirmState?.title}
        onOk={async () => {
          if (confirmState?.onOk) {
            await confirmState.onOk();
          }
          clearConfirm();
        }}
        onCancel={() => {
          if (confirmState?.onCancel) {
            confirmState.onCancel();
          }
          clearConfirm();
        }}
        okText="確認"
        cancelText="キャンセル"
      />
    </div>
  );
}

export default function ReleasePage() {
  return (
    <ReleaseEditorProvider>
      <ReleaseEditorContent />
    </ReleaseEditorProvider>
  );
}
