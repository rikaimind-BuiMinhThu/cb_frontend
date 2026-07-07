import { useCallback, useEffect, useState } from 'react';
import { Modal } from 'antd';
import api from 'api/api-management';
import {
  ORDER_CONFIRM_LP_PRESET,
  buildOrderConfirmPresetConfig,
  normalizeOrderConfirmConfig,
} from '../ScenarioSetting/utils/OrderConfirmLpScriptGenerator';

export const ORDER_CONFIRM_PRESET_OPTION = {
  ECFORCE: 'preset:ecforce',
  CUSTOM: 'preset:custom',
};

export const ORDER_CONFIRM_PRESET_OPTION_PREFIX = 'preset:';

export default function useOrderConfirmMessageTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTemplates = useCallback(() => {
    setLoading(true);
    return api
      .get('/api/v1/managements/order_confirm_message_templates')
      .then((res) => {
        setTemplates(res?.data?.data || []);
        return res?.data?.data || [];
      })
      .catch((error) => {
        console.error(error);
        return [];
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const fetchTemplateConfig = useCallback(async (templateId) => {
    const res = await api.get(`/api/v1/managements/order_confirm_message_templates/${templateId}`);
    if (res?.data?.code !== 1) {
      throw new Error(res?.data?.message || 'Failed to load template');
    }
    return normalizeOrderConfirmConfig(res.data.data.config || {});
  }, []);

  const confirmAndApply = useCallback((nextConfig, onApply) => {
    Modal.confirm({
      title: 'テンプレートを適用しますか？',
      content: '現在の注文確認設定はテンプレートの内容で上書きされます。',
      okText: '適用',
      cancelText: 'キャンセル',
      onOk: () => onApply(JSON.parse(JSON.stringify(nextConfig))),
    });
  }, []);

  const applyTemplate = useCallback(async (templateId, onApply) => {
    const nextConfig = await fetchTemplateConfig(templateId);
    confirmAndApply(nextConfig, onApply);
  }, [confirmAndApply, fetchTemplateConfig]);

  const applySelection = useCallback(async (value, currentConfig, onApply) => {
    if (!value) return;

    if (value.startsWith(ORDER_CONFIRM_PRESET_OPTION_PREFIX)) {
      const preset = value === ORDER_CONFIRM_PRESET_OPTION.ECFORCE
        ? ORDER_CONFIRM_LP_PRESET.ECFORCE
        : ORDER_CONFIRM_LP_PRESET.CUSTOM;
      const nextConfig = buildOrderConfirmPresetConfig(currentConfig, preset);
      confirmAndApply(nextConfig, onApply);
      return;
    }

    await applyTemplate(value, onApply);
  }, [applyTemplate, confirmAndApply]);

  return {
    templates,
    loading,
    fetchTemplates,
    fetchTemplateConfig,
    applyTemplate,
    applySelection,
    presetOptions: ORDER_CONFIRM_PRESET_OPTION,
  };
}
