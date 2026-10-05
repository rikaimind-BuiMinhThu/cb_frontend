import React from 'react';
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  FileOutlined,
  FormOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Space } from 'antd';
import {
  ACTION_LABELS,
  EMPTY_STATES,
  SECTION_TITLES,
} from '../../constants';
import { useChatbotEditor } from '../../context/ChatbotEditorContext';

function GroupOverviewPanel() {
  const { groups, modals, isAdminDeel } = useChatbotEditor();

  return (
    <div className="cb-layout-overview-panel">
      <h3 className="cb-section-title">{SECTION_TITLES.MESSAGE_GROUPS}</h3>
      <div className="cb-toolbar-row">
        <Button
          size="small"
          icon={<PlusOutlined />}
          onClick={() => modals.openModal('addGroup')}
        >
          {ACTION_LABELS.ADD_GROUP}
        </Button>
        {isAdminDeel && (
          <Button size="small" onClick={() => modals.openModal('hotTemplateSetting')}>
            {ACTION_LABELS.TEMPLATE_SETTING}
          </Button>
        )}
        {!isAdminDeel && (
          <Button size="small" onClick={() => modals.openModal('hotTemplateDetail')}>
            {ACTION_LABELS.TEMPLATE_DETAIL}
          </Button>
        )}
      </div>
      {groups.loading && <div className="cb-empty-state">{EMPTY_STATES.LOADING}</div>}
    </div>
  );
}

export function GroupListPanel() {
  const { groups, bags, selectGroup, modals } = useChatbotEditor();

  return (
    <ul className="cb-group-list">
      {groups.groups.map((group) => {
        const isActive = groups.selectedGroupId === group.id;
        return (
          <li
            key={group.id}
            className="cb-group-item"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (bags.dragBagId) {
                bags.moveBag(bags.dragBagId, group.id);
                bags.setDragBagId(null);
              }
            }}
          >
            <div className="cb-group-header">
              <button
                type="button"
                className={`cb-group-name-btn${isActive ? ' is-active' : ''}`}
                onClick={() => selectGroup(group.id)}
              >
                {group.group_name}
              </button>
              <Space size={2} className="cb-group-actions">
                <Button
                  type="text"
                  size="small"
                  icon={<FormOutlined />}
                  title="袋追加"
                  onClick={() => modals.openModal('addBag', group.id)}
                />
                <Button
                  type="text"
                  size="small"
                  icon={<CopyOutlined />}
                  title="コピー"
                  onClick={() => modals.openModal('copyGroup', group.id)}
                />
                <Button
                  type="text"
                  size="small"
                  icon={<FileOutlined />}
                  title="袋移動"
                  onClick={() => modals.openModal('moveBag', group.id)}
                />
                <Button
                  type="text"
                  size="small"
                  icon={<EditOutlined />}
                  title="名前変更"
                  onClick={() => modals.openModal('renameGroup', group.id)}
                />
                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  title="削除"
                  onClick={() => modals.openModal('deleteGroup', group.id)}
                />
              </Space>
            </div>
            {isActive && <MessageBagTree />}
          </li>
        );
      })}
    </ul>
  );
}

function MessageBagTree() {
  const { bags, selectBag, modals } = useChatbotEditor();

  if (bags.loading) {
    return <div className="cb-empty-state">{EMPTY_STATES.LOADING_BAGS}</div>;
  }

  if (!bags.bags.length) {
    return <div className="cb-empty-state">{EMPTY_STATES.NO_BAGS}</div>;
  }

  return (
    <ul className="cb-bag-list">
      {bags.bags.map((bag) => (
        <li key={bag.id} className="cb-bag-item">
          <button
            type="button"
            className={`cb-bag-name-btn${bags.selectedBagId === bag.id ? ' is-active' : ''}`}
            draggable
            onDragStart={() => bags.setDragBagId(bag.id)}
            onClick={() => selectBag(bag.id)}
          >
            {bag.bag_name}
          </button>
          <Space size={2}>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => modals.openModal('renameBag', bag.id)}
            />
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => modals.openModal('copyBag', bag.id)}
            />
            <Button
              type="text"
              size="small"
              icon={<FileOutlined />}
              title="移動"
              onClick={() => bags.setPendingMoveBagId(bag.id)}
            />
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => modals.openModal('deleteBag', bag.id)}
            />
          </Space>
        </li>
      ))}
    </ul>
  );
}

export default GroupOverviewPanel;
