import { useCallback, useEffect, useState } from 'react';
import api from 'v2/api/api-management';
import { AdminConfirmModal } from 'v2/components/AdminShell';
import { API_SUCCESS_CODE } from 'v2/api/constants';
import {
  ORDER_CONFIRM_LP_PRESET,
  buildOrderConfirmPresetConfig,
  normalizeOrderConfirmConfig,
} from 'v2/utils/orderConfirmLpScriptGenerator';
import {
  APPLY_OK_TEXT,
  APPLY_TEMPLATE_MESSAGE,
  APPLY_TEMPLATE_TITLE,
  LOAD_TEMPLATE_FAILED,
  TEMPLATES_API_PATH,
} from './constants';

export const ORDER_CONFIRM_PRESET_OPTION = {
  ECFORCE: 'preset:ecforce',
  CUSTOM: 'preset:custom',
};

export const ORDER_CONFIRM_PRESET_OPTION_PREFIX = 'preset:';

const useOrderConfirmMessageTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pendingApply, setPendingApply] = useState(null);

  const fetchTemplates = useCallback(() => {
    setLoading(true);
    return api
      .get(TEMPLATES_API_PATH)
      .then((res) => {
        setTemplates(res?.data?.data || []);
        return res?.data?.data || [];
      })
      .catch(() => [])
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const fetchTemplateConfig = useCallback(async (templateId) => {
    const res = await api.get(`${TEMPLATES_API_PATH}/${templateId}`);
    if (res?.data?.code !== API_SUCCESS_CODE) {
      throw new Error(res?.data?.message || LOAD_TEMPLATE_FAILED);
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
      title={APPLY_TEMPLATE_TITLE}
      message={APPLY_TEMPLATE_MESSAGE}
      okText={APPLY_OK_TEXT}
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
};

export default useOrderConfirmMessageTemplates;
