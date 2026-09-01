import React, { useMemo, useState } from 'react';
import { Button, Form, Input, Select, Space, Typography } from 'antd';
import { useReleaseEditor } from '../context/ReleaseEditorContext';
import { MAX_PERSISTENT_MENUS, MAX_TITLE_LENGTH, PERSISTENT_MENU_TYPES, TOAST_MESSAGES } from '../constants';
import MessageBagPicker from './MessageBagPicker';
import SectionCard from './SectionCard';

function buildPayload({ title, menuType, bagId, url, isSupport }) {
  if (menuType === 'website') {
    return { title, url, message_bag_id: null, is_support: false };
  }
  return {
    title,
    url: '',
    message_bag_id: bagId || null,
    is_support: menuType === 'support' || isSupport,
  };
}

export default function PersistentMenuSection() {
  const { connect, settings, persistentMenus, notify, askConfirm } = useReleaseEditor();
  const [draft, setDraft] = useState({ title: '', menuType: 'message', groupId: null, bagId: null, url: '' });
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({ title: '', menuType: 'message', groupId: null, bagId: null, url: '' });
  const disabled = !connect.isConnected;
  const defaultGroupId = settings.groups[0]?.id || null;

  const handleToggle = async (checked) => {
    if (!checked) {
      askConfirm({
        title: '固定メニューをオフにしますか？',
        onOk: async () => {
          try {
            await persistentMenus.togglePublish(false);
            notify(TOAST_MESSAGES.MENU_OFF);
          } catch (error) {
            notify(error.message, 'error');
          }
        },
      });
      return;
    }

    try {
      await persistentMenus.togglePublish(true);
      notify(TOAST_MESSAGES.MENU_ON);
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  const validateDraft = (values) => {
    if (!values.title.trim()) return 'タイトルを入力してください。';
    if (values.title.length > MAX_TITLE_LENGTH) return `タイトルは${MAX_TITLE_LENGTH}文字以下にしてください。`;
    if (values.menuType === 'website') {
      if (!values.url.trim()) return 'URLを入力してください。';
      if (values.url.length > MAX_TITLE_LENGTH) return `URLは${MAX_TITLE_LENGTH}文字以下にしてください。`;
    }
    return null;
  };

  const handleAdd = async () => {
    const error = validateDraft(draft);
    if (error) {
      notify(error, 'error');
      return;
    }

    try {
      await persistentMenus.addItem(buildPayload(draft));
      setDraft({ title: '', menuType: 'message', groupId: defaultGroupId, bagId: null, url: '' });
      notify(TOAST_MESSAGES.SAVED);
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const startEdit = (item) => {
    const menuType = item.url ? 'website' : (item.is_support ? 'support' : 'message');
    setEditingId(item.id);
    setEditDraft({
      title: item.title,
      menuType,
      groupId: item.message_group_id || defaultGroupId,
      bagId: item.message_bag_id,
      url: item.url || '',
    });
  };

  const saveEdit = async (id) => {
    const error = validateDraft(editDraft);
    if (error) {
      notify(error, 'error');
      return;
    }

    try {
      await persistentMenus.editItem(id, buildPayload(editDraft));
      setEditingId(null);
      notify(TOAST_MESSAGES.SAVED);
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const handleDelete = (id) => {
    askConfirm({
      title: 'この固定メニューを削除しますか？',
      onOk: async () => {
        try {
          await persistentMenus.removeItem(id);
          notify('固定メッセージを削除しました。');
        } catch (error) {
          notify(error.message, 'error');
        }
      },
    });
  };

  const canAdd = useMemo(() => persistentMenus.items.length < MAX_PERSISTENT_MENUS, [persistentMenus.items.length]);

  return (
    <SectionCard
        title="固定メニュー"
        enabled={persistentMenus.published}
        onToggle={handleToggle}
        toggleLoading={persistentMenus.toggling}
        disabled={disabled || persistentMenus.items.length === 0}
        extra={canAdd && (
          <Button type="primary" ghost disabled={disabled} onClick={handleAdd}>
            追加
          </Button>
        )}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {persistentMenus.items.map((item) => (
            <div key={item.id} className="release-item-row">
              {editingId === item.id ? (
                <>
                  <Input
                    value={editDraft.title}
                    maxLength={MAX_TITLE_LENGTH}
                    onChange={(e) => setEditDraft((prev) => ({ ...prev, title: e.target.value }))}
                  />
                  <Select
                    value={editDraft.menuType}
                    onChange={(menuType) => setEditDraft((prev) => ({ ...prev, menuType }))}
                    options={PERSISTENT_MENU_TYPES}
                  />
                  {editDraft.menuType === 'website' ? (
                    <Input
                      value={editDraft.url}
                      placeholder="https://"
                      onChange={(e) => setEditDraft((prev) => ({ ...prev, url: e.target.value }))}
                    />
                  ) : (
                    <MessageBagPicker
                      groups={settings.groups}
                      groupId={editDraft.groupId}
                      bagId={editDraft.bagId}
                      onGroupChange={(groupId) => setEditDraft((prev) => ({ ...prev, groupId, bagId: null }))}
                      onBagChange={(bagId) => setEditDraft((prev) => ({ ...prev, bagId }))}
                    />
                  )}
                  <Space>
                    <Button type="primary" onClick={() => saveEdit(item.id)}>保存</Button>
                    <Button onClick={() => setEditingId(null)}>キャンセル</Button>
                  </Space>
                </>
              ) : (
                <>
                  <Typography.Text>{item.title}</Typography.Text>
                  <Typography.Text type="secondary">
                    {item.url || item.message_bag_name || '—'}
                  </Typography.Text>
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
              <Form.Item label="新しい固定メニュー">
                <Input
                  placeholder="タイトル"
                  value={draft.title}
                  maxLength={MAX_TITLE_LENGTH}
                  disabled={disabled}
                  onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
                />
              </Form.Item>
              <Select
                value={draft.menuType}
                disabled={disabled}
                onChange={(menuType) => setDraft((prev) => ({ ...prev, menuType }))}
                options={PERSISTENT_MENU_TYPES}
              />
              {draft.menuType === 'website' ? (
                <Input
                  placeholder="https://"
                  value={draft.url}
                  disabled={disabled}
                  onChange={(e) => setDraft((prev) => ({ ...prev, url: e.target.value }))}
                />
              ) : (
                <MessageBagPicker
                  groups={settings.groups}
                  groupId={draft.groupId || defaultGroupId}
                  bagId={draft.bagId}
                  disabled={disabled}
                  onGroupChange={(groupId) => setDraft((prev) => ({ ...prev, groupId, bagId: null }))}
                  onBagChange={(bagId) => setDraft((prev) => ({ ...prev, bagId }))}
                />
              )}
            </Form>
          )}
        </Space>
      </SectionCard>
  );
}
