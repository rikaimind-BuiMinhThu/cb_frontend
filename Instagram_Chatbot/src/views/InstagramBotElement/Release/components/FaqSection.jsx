import React, { useMemo, useState } from 'react';
import { Button, Form, Input, Select, Space, Typography } from 'antd';
import { useReleaseEditor } from '../context/ReleaseEditorContext';
import { MAX_ICE_BREAKERS, MAX_TITLE_LENGTH, TOAST_MESSAGES } from '../constants';
import MessageBagPicker from './MessageBagPicker';
import SectionCard from './SectionCard';

export default function FaqSection() {
  const { connect, settings, iceBreakers, notify, askConfirm } = useReleaseEditor();
  const [draft, setDraft] = useState({ question: '', groupId: null, bagId: null });
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({ question: '', groupId: null, bagId: null });
  const disabled = !connect.isConnected;

  const defaultGroupId = settings.groups[0]?.id || null;

  const handleToggle = async (checked) => {
    if (!checked) {
      askConfirm({
        title: 'FAQ設定をオフにしますか？',
        onOk: async () => {
          try {
            await iceBreakers.togglePublish(false);
            notify(TOAST_MESSAGES.FAQ_OFF);
          } catch (error) {
            notify(error.message, 'error');
          }
        },
      });
      return;
    }

    try {
      await iceBreakers.togglePublish(true);
      notify(TOAST_MESSAGES.FAQ_ON);
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  const handleAdd = async () => {
    if (!draft.question.trim()) {
      notify('質問を入力してください。', 'error');
      return;
    }
    if (draft.question.length > MAX_TITLE_LENGTH) {
      notify(`質問は${MAX_TITLE_LENGTH}文字以下にしてください。`, 'error');
      return;
    }
    if (!draft.bagId) {
      notify('回答を選択してください。', 'error');
      return;
    }

    try {
      await iceBreakers.addItem({ question: draft.question.trim(), messageBagId: draft.bagId });
      setDraft({ question: '', groupId: defaultGroupId, bagId: null });
      notify(TOAST_MESSAGES.SAVED);
      if (iceBreakers.published) {
        await iceBreakers.togglePublish(true);
      }
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditDraft({
      question: item.question,
      groupId: item.message_group_id || defaultGroupId,
      bagId: item.message_bag_id,
    });
  };

  const saveEdit = async (id) => {
    if (!editDraft.question.trim() || !editDraft.bagId) {
      notify('質問と回答を入力してください。', 'error');
      return;
    }
    try {
      await iceBreakers.editItem(id, {
        question: editDraft.question.trim(),
        messageBagId: editDraft.bagId,
      });
      setEditingId(null);
      notify(TOAST_MESSAGES.SAVED);
      if (iceBreakers.published) {
        await iceBreakers.togglePublish(true);
      }
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  const handleDelete = (id) => {
    askConfirm({
      title: 'このFAQを削除しますか？',
      onOk: async () => {
        try {
          await iceBreakers.removeItem(id);
          notify('削除しました。');
        } catch (error) {
          notify(error.message, 'error');
        }
      },
    });
  };

  const canAdd = useMemo(() => iceBreakers.items.length < MAX_ICE_BREAKERS, [iceBreakers.items.length]);

  return (
    <SectionCard
        title="FAQ設定"
        enabled={iceBreakers.published}
        onToggle={handleToggle}
        toggleLoading={iceBreakers.toggling}
        disabled={disabled || iceBreakers.items.length === 0}
        extra={canAdd && (
          <Button type="primary" ghost disabled={disabled} onClick={handleAdd}>
            追加
          </Button>
        )}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {iceBreakers.items.map((item) => (
            <div key={item.id} className="release-item-row">
              {editingId === item.id ? (
                <>
                  <Input
                    value={editDraft.question}
                    maxLength={MAX_TITLE_LENGTH}
                    onChange={(e) => setEditDraft((prev) => ({ ...prev, question: e.target.value }))}
                  />
                  <MessageBagPicker
                    groups={settings.groups}
                    groupId={editDraft.groupId}
                    bagId={editDraft.bagId}
                    onGroupChange={(groupId) => setEditDraft((prev) => ({ ...prev, groupId, bagId: null }))}
                    onBagChange={(bagId) => setEditDraft((prev) => ({ ...prev, bagId }))}
                  />
                  <Space>
                    <Button type="primary" onClick={() => saveEdit(item.id)}>保存</Button>
                    <Button onClick={() => setEditingId(null)}>キャンセル</Button>
                  </Space>
                </>
              ) : (
                <>
                  <Typography.Text>{item.question}</Typography.Text>
                  <Typography.Text type="secondary">{item.message_bag_name}</Typography.Text>
                  <Space>
                    <Button onClick={() => startEdit(item)} disabled={disabled}>編集</Button>
                    <Button danger onClick={() => handleDelete(item.id)} disabled={disabled}>削除</Button>
                  </Space>
                </>
              )}
            </div>
          ))}

          {canAdd && (
            <Form layout="vertical" className="release-add-form">
              <Form.Item label="新しいFAQ">
                <Input
                  placeholder="質問"
                  value={draft.question}
                  maxLength={MAX_TITLE_LENGTH}
                  disabled={disabled}
                  onChange={(e) => setDraft((prev) => ({ ...prev, question: e.target.value }))}
                />
              </Form.Item>
              <MessageBagPicker
                groups={settings.groups}
                groupId={draft.groupId || defaultGroupId}
                bagId={draft.bagId}
                disabled={disabled}
                onGroupChange={(groupId) => setDraft((prev) => ({ ...prev, groupId, bagId: null }))}
                onBagChange={(bagId) => setDraft((prev) => ({ ...prev, bagId }))}
              />
            </Form>
          )}
        </Space>
      </SectionCard>
  );
}
