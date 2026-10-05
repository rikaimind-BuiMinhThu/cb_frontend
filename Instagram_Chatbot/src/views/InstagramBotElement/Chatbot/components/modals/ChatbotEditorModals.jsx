import React, { useState } from 'react';
import { Input, Modal, Select } from 'antd';
import { AdminConfirmModal } from '../../../../../components/AdminShell';
import { fetchInstagramPastPosts } from '../../api/messageManagementApi';
import {
  ACTION_LABELS,
  CONFIRM_MESSAGES,
  EMPTY_STATES,
  FORM_PLACEHOLDERS,
  MESSAGE_TYPES,
  MODAL_OK_TEXT,
  MODAL_TITLES,
  PROFILE_FIELDS,
} from '../../constants';
import { useChatbotEditor } from '../../context/ChatbotEditorContext';
import { validateRequiredName } from '../../utils/chatbotValidation';
import { createEmptyDraft } from '../../utils/previewBuilder';

function NameFormModal({ open, title, okText, initialValue = '', onOk, onCancel }) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (open) {
      setValue(initialValue);
      setError('');
    }
  }, [open, initialValue]);

  const handleOk = () => {
    const err = validateRequiredName(value);
    if (err) {
      setError(err);
      return;
    }
    onOk(value.trim());
  };

  return (
    <Modal open={open} title={title} okText={okText} onOk={handleOk} onCancel={onCancel}>
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      {error && <div className="cb-error-text">{error}</div>}
    </Modal>
  );
}

function HotTemplateEditorRow({ item, groups, onUpdate, onDelete }) {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [messageGroupId, setMessageGroupId] = useState(item.message_group_id);

  React.useEffect(() => {
    setTitle(item.title);
    setDescription(item.description);
    setMessageGroupId(item.message_group_id);
  }, [item]);

  return (
    <div className="cb-hot-template-row">
      <Input
        className="cb-modal-field"
        placeholder={FORM_PLACEHOLDERS.TITLE}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Select
        className="cb-field cb-modal-field"
        value={messageGroupId}
        onChange={setMessageGroupId}
        options={groups.map((g) => ({ value: g.id, label: g.group_name }))}
      />
      <Input
        className="cb-modal-field"
        placeholder={FORM_PLACEHOLDERS.DESCRIPTION}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="cb-form-row">
        <button
          type="button"
          className="cb-choice-btn"
          onClick={() => onUpdate(item.id, { title, description, messageGroupId })}
        >
          {ACTION_LABELS.UPDATE}
        </button>
        <button type="button" className="cb-choice-btn" onClick={() => onDelete(item.id)}>
          {ACTION_LABELS.DELETE}
        </button>
      </div>
    </div>
  );
}

export default function ChatbotEditorModals() {
  const { groups, bags, modals, hotTemplates, drafts } = useChatbotEditor();

  const [pastPosts, setPastPosts] = useState([]);
  const [pastPostsLoading, setPastPostsLoading] = useState(false);
  const [selectedProfileField, setSelectedProfileField] = useState(null);
  const [hotTemplateDraft, setHotTemplateDraft] = useState({
    title: '',
    description: '',
    messageGroupId: undefined,
  });

  React.useEffect(() => {
    if (!modals.modals.pastPostPicker) return;
    setPastPostsLoading(true);
    fetchInstagramPastPosts()
      .then(setPastPosts)
      .finally(() => setPastPostsLoading(false));
  }, [modals.modals.pastPostPicker]);

  const getGroupName = (id) => groups.groups.find((g) => g.id === id)?.group_name || '';
  const getBagName = (id) => bags.bags.find((b) => b.id === id)?.bag_name || '';

  return (
    <>
      <NameFormModal
        open={modals.modals.addGroup}
        title={MODAL_TITLES.ADD_GROUP}
        okText={MODAL_OK_TEXT.ADD_GROUP}
        onOk={async (name) => {
          const ok = await groups.addGroup(name);
          if (ok) modals.closeModal('addGroup');
        }}
        onCancel={() => modals.closeModal('addGroup')}
      />

      <NameFormModal
        open={modals.modals.renameGroup}
        title={MODAL_TITLES.RENAME_GROUP}
        okText={MODAL_OK_TEXT.CHANGE}
        initialValue={getGroupName(modals.modalTargetId)}
        onOk={async (name) => {
          await groups.renameGroup(modals.modalTargetId, name);
          modals.closeModal('renameGroup');
        }}
        onCancel={() => modals.closeModal('renameGroup')}
      />

      <AdminConfirmModal
        open={modals.modals.copyGroup}
        message={CONFIRM_MESSAGES.COPY_GROUP}
        onOk={async () => {
          await groups.duplicateGroup(modals.modalTargetId);
          modals.closeModal('copyGroup');
        }}
        onCancel={() => modals.closeModal('copyGroup')}
      />

      <AdminConfirmModal
        open={modals.modals.deleteGroup}
        message={CONFIRM_MESSAGES.DELETE_GROUP}
        onOk={async () => {
          await groups.removeGroup(modals.modalTargetId);
          modals.closeModal('deleteGroup');
        }}
        onCancel={() => modals.closeModal('deleteGroup')}
        danger
      />

      <NameFormModal
        open={modals.modals.addBag}
        title={MODAL_TITLES.ADD_BAG}
        okText={MODAL_OK_TEXT.ADD_BAG}
        onOk={async (name) => {
          await bags.addBag(modals.modalTargetId, name);
          modals.closeModal('addBag');
        }}
        onCancel={() => modals.closeModal('addBag')}
      />

      <NameFormModal
        open={modals.modals.renameBag}
        title={MODAL_TITLES.RENAME_BAG}
        okText={MODAL_OK_TEXT.CHANGE}
        initialValue={getBagName(modals.modalTargetId)}
        onOk={async (name) => {
          await bags.renameBag(modals.modalTargetId, name);
          modals.closeModal('renameBag');
        }}
        onCancel={() => modals.closeModal('renameBag')}
      />

      <AdminConfirmModal
        open={modals.modals.copyBag}
        message={CONFIRM_MESSAGES.COPY_BAG}
        onOk={async () => {
          await bags.duplicateBag(modals.modalTargetId);
          modals.closeModal('copyBag');
        }}
        onCancel={() => modals.closeModal('copyBag')}
      />

      <AdminConfirmModal
        open={modals.modals.deleteBag}
        message={CONFIRM_MESSAGES.DELETE_BAG}
        onOk={async () => {
          await bags.removeBag(modals.modalTargetId);
          modals.closeModal('deleteBag');
        }}
        onCancel={() => modals.closeModal('deleteBag')}
        danger
      />

      <AdminConfirmModal
        open={modals.modals.moveBag}
        message={CONFIRM_MESSAGES.MOVE_BAG}
        onOk={async () => {
          const bagId = bags.pendingMoveBagId || bags.dragBagId;
          const targetGroupId = modals.modalTargetId;
          if (bagId && targetGroupId) {
            await bags.moveBag(bagId, targetGroupId);
            bags.setPendingMoveBagId(null);
            bags.setDragBagId(null);
          }
          modals.closeModal('moveBag');
        }}
        onCancel={() => modals.closeModal('moveBag')}
      />

      <Modal
        open={modals.modals.pastPostPicker}
        title={MODAL_TITLES.PAST_POST_PICKER}
        footer={null}
        width={720}
        onCancel={() => modals.closeModal('pastPostPicker')}
      >
        {pastPostsLoading && <div className="cb-empty-state">{EMPTY_STATES.LOADING}</div>}
        <div className="cb-past-post-grid">
          {pastPosts.map((post) => (
            <div
              key={post.id}
              className="cb-past-post-item"
              onClick={() => {
                const draft = createEmptyDraft(MESSAGE_TYPES.PAST_POST);
                draft.pastPostId = post.id;
                draft.previewPastPostUrl = post.media_url;
                draft.isComplete = true;
                drafts.setDraft(draft);
                modals.closeModal('pastPostPicker');
              }}
            >
              <img src={post.media_url} alt={post.id} />
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        open={modals.modals.profileMessage}
        title={MODAL_TITLES.PROFILE_MESSAGE}
        okText={MODAL_OK_TEXT.SAVE}
        onOk={() => {
          if (!selectedProfileField) return;
          const field = PROFILE_FIELDS.find((f) => f.key === selectedProfileField);
          if (!field) return;
          const draft = createEmptyDraft(MESSAGE_TYPES.PROFILE_MSG);
          draft.profileFieldKey = field.apiKey;
          draft.messageValue = field.placeholder;
          drafts.setDraft(draft);
          setSelectedProfileField(null);
          modals.closeModal('profileMessage');
        }}
        onCancel={() => {
          setSelectedProfileField(null);
          modals.closeModal('profileMessage');
        }}
      >
        <div className="cb-profile-fields">
          {PROFILE_FIELDS.map((field) => (
            <button
              key={field.key}
              type="button"
              className={`cb-profile-field-btn${
                selectedProfileField === field.key ? ' is-selected' : ''
              }`}
              onClick={() => setSelectedProfileField(field.key)}
            >
              {field.label}
            </button>
          ))}
        </div>
      </Modal>

      <Modal
        open={modals.modals.hotTemplateSetting}
        title={MODAL_TITLES.HOT_TEMPLATE_SETTING}
        footer={null}
        width={640}
        onCancel={() => modals.closeModal('hotTemplateSetting')}
      >
        <div className="cb-modal-scroll">
          {hotTemplates.templates.map((item) => (
            <HotTemplateEditorRow
              key={item.id}
              item={item}
              groups={groups.groups}
              onUpdate={hotTemplates.editTemplate}
              onDelete={hotTemplates.removeTemplate}
            />
          ))}
        </div>
        <div className="cb-modal-section">
          <Input
            className="cb-modal-field"
            placeholder={FORM_PLACEHOLDERS.TITLE}
            value={hotTemplateDraft.title}
            onChange={(e) => setHotTemplateDraft((p) => ({ ...p, title: e.target.value }))}
          />
          <Select
            className="cb-field cb-modal-field"
            placeholder={FORM_PLACEHOLDERS.SELECT_GROUP}
            value={hotTemplateDraft.messageGroupId}
            onChange={(value) => setHotTemplateDraft((p) => ({ ...p, messageGroupId: value }))}
            options={groups.groups.map((g) => ({ value: g.id, label: g.group_name }))}
          />
          <Input
            className="cb-modal-field"
            placeholder={FORM_PLACEHOLDERS.DESCRIPTION}
            value={hotTemplateDraft.description}
            onChange={(e) => setHotTemplateDraft((p) => ({ ...p, description: e.target.value }))}
          />
          <button
            type="button"
            className="cb-choice-btn"
            onClick={async () => {
              await hotTemplates.saveTemplate(hotTemplateDraft);
              setHotTemplateDraft({ title: '', description: '', messageGroupId: undefined });
            }}
          >
            {ACTION_LABELS.ADD_TEMPLATE}
          </button>
        </div>
      </Modal>

      <Modal
        open={modals.modals.hotTemplateDetail}
        title={MODAL_TITLES.HOT_TEMPLATE_DETAIL}
        footer={null}
        width={560}
        onCancel={() => modals.closeModal('hotTemplateDetail')}
      >
        <div className="cb-modal-scroll">
          {hotTemplates.templates.map((item) => (
            <div key={item.id} className="cb-hot-template-item">
              <div>
                <div className="cb-hot-template-item__title">{item.title}</div>
                <div className="cb-hot-template-item__desc">{item.description}</div>
              </div>
              <button
                type="button"
                className="cb-choice-btn"
                onClick={async () => {
                  await hotTemplates.applyTemplate(item.message_group_id);
                  modals.closeModal('hotTemplateDetail');
                }}
              >
                {ACTION_LABELS.SELECT}
              </button>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
