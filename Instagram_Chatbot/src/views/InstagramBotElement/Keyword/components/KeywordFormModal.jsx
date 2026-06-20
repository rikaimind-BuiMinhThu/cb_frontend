import React, { useEffect, useState } from 'react';
import { Checkbox, Form, Input, Modal, Select, message as antMessage } from 'antd';
import { fetchMessageGroup, fetchMessageGroups } from '../../Chatbot/api/messageManagementApi';
import { useKeywordSettings } from '../context/KeywordSettingsContext';
import {
  CHANNEL_OPTIONS,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  MODAL_TITLES,
} from '../constants';
import {
  displayKeywords,
  getActiveChannels,
} from '../utils/keywordFormatters';
import { validateKeywordForm } from '../utils/keywordValidation';

function KeywordFormModal() {
  const {
    formModalOpen,
    editingKeyword,
    closeFormModal,
    keywords,
    defaultReply,
  } = useKeywordSettings();
  const [form] = Form.useForm();
  const [groups, setGroups] = useState([]);
  const [bags, setBags] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingBags, setLoadingBags] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const selectedGroupId = Form.useWatch('messageGroupId', form);
  const isEdit = Boolean(editingKeyword);

  useEffect(() => {
    if (!formModalOpen) return;

    let cancelled = false;

    async function initForm() {
      setLoadingGroups(true);
      try {
        const result = await fetchMessageGroups(1);
        if (cancelled) return;
        setGroups(result.data);

        if (editingKeyword) {
          const resolvedGroupId = editingKeyword.message_group_id;

          form.setFieldsValue({
            title: editingKeyword.title,
            keywords: displayKeywords(editingKeyword.keyword),
            messageGroupId: resolvedGroupId || undefined,
            messageBagId: editingKeyword.message_bag_id || undefined,
            channels: getActiveChannels(editingKeyword),
          });

          if (resolvedGroupId) {
            setLoadingBags(true);
            const groupData = await fetchMessageGroup(resolvedGroupId);
            if (!cancelled) {
              setBags(groupData.message_bags || []);
            }
          }
        } else {
          form.resetFields();
          setBags([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) {
          setLoadingGroups(false);
          setLoadingBags(false);
        }
      }
    }

    initForm();
    return () => {
      cancelled = true;
    };
  }, [formModalOpen, editingKeyword, form]);

  const handleGroupChange = async (groupId) => {
    form.setFieldValue('messageBagId', undefined);
    if (!groupId) {
      setBags([]);
      return;
    }
    setLoadingBags(true);
    try {
      const groupData = await fetchMessageGroup(groupId);
      setBags(groupData.message_bags || []);
    } catch (error) {
      console.error(error);
      setBags([]);
    } finally {
      setLoadingBags(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const validationError = validateKeywordForm(values);
      if (validationError) {
        form.setFields([{ name: 'channels', errors: [validationError] }]);
        return;
      }

      setSubmitting(true);
      let success = false;
      if (isEdit) {
        success = await keywords.editKeyword(editingKeyword.id, values, editingKeyword);
      } else if (!defaultReply.instagramSetting?.id) {
        antMessage.error('Instagram設定を読み込めません。ページを再読み込みしてください。');
        return;
      } else {
        success = await keywords.addKeyword(values);
      }
      if (success) {
        closeFormModal();
        form.resetFields();
      }
    } catch (error) {
      if (error?.errorFields) return;
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    closeFormModal();
    form.resetFields();
    setBags([]);
  };

  return (
    <Modal
      className="keyword-form-modal"
      title={isEdit ? MODAL_TITLES.EDIT : MODAL_TITLES.ADD}
      open={formModalOpen}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText="保存"
      cancelText="キャンセル"
      confirmLoading={submitting}
      destroyOnClose
      width={560}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label={FORM_LABELS.TITLE}
          rules={[{ required: true, message: FORM_PLACEHOLDERS.TITLE }]}
        >
          <Input placeholder={FORM_PLACEHOLDERS.TITLE} />
        </Form.Item>

        <Form.Item
          name="keywords"
          label={FORM_LABELS.KEYWORDS}
          rules={[{ required: true, message: FORM_PLACEHOLDERS.KEYWORDS }]}
        >
          <Input placeholder={FORM_PLACEHOLDERS.KEYWORDS} />
        </Form.Item>

        <Form.Item
          name="messageGroupId"
          label={FORM_LABELS.MESSAGE_GROUP}
          rules={[{ required: true, message: FORM_PLACEHOLDERS.SELECT_GROUP }]}
        >
          <Select
            placeholder={FORM_PLACEHOLDERS.SELECT_GROUP}
            loading={loadingGroups}
            onChange={handleGroupChange}
            options={groups.map((group) => ({
              value: group.id,
              label: group.group_name,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="messageBagId"
          label={FORM_LABELS.MESSAGE_BAG}
          rules={[{ required: true, message: FORM_PLACEHOLDERS.SELECT_BAG }]}
        >
          <Select
            placeholder={FORM_PLACEHOLDERS.SELECT_BAG}
            loading={loadingBags}
            disabled={!selectedGroupId}
            options={bags.map((bag) => ({
              value: bag.id,
              label: bag.bag_name,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="channels"
          label={FORM_LABELS.CHANNELS}
          rules={[{ required: true, message: '適用チャンネルを1つ以上選択してください' }]}
        >
          <Checkbox.Group
            options={CHANNEL_OPTIONS.map((option) => ({
              value: option.key,
              label: option.label,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default KeywordFormModal;
