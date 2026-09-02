import { useCallback, useEffect, useState } from 'react';
import api from 'v2/api/api-management';
import { AdminConfirmModal } from 'v2/components/AdminShell';
import {
  ORDER_CONFIRM_LP_PRESET,
  buildOrderConfirmPresetConfig,
  normalizeOrderConfirmConfig,
} from 'v2/views/BotElement/BotSetting/ScenarioSetting/utils/OrderConfirmLpScriptGenerator';

export const ORDER_CONFIRM_PRESET_OPTION = {
  ECFORCE: 'preset:ecforce',
  CUSTOM: 'preset:custom',
};

export const ORDER_CONFIRM_PRESET_OPTION_PREFIX = 'preset:';

export default function useOrderConfirmMessageTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pendingApply, setPendingApply] = useState(null);

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
    setPendingApply({ nextConfig, onApply });
  }, []);

  const applyPending = useCallback(() => {
    if (!pendingApply) return;
    pendingApply.onApply(JSON.parse(JSON.stringify(pendingApply.nextConfig)));
    setPendingApply(null);
  }, [pendingApply]);

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

  const confirmModal = (
    <AdminConfirmModal
      open={Boolean(pendingApply)}
      title="テンプレートを適用しますか？"
      message="現在の注文確認設定はテンプレートの内容で上書きされます。"
      okText="適用"
      onOk={applyPending}
      onCancel={() => setPendingApply(null)}
    />
  );

  return {
    templates,
    loading,
    fetchTemplates,
    fetchTemplateConfig,
    applyTemplate,
    applySelection,
    presetOptions: ORDER_CONFIRM_PRESET_OPTION,
    confirmModal,
  };
}
