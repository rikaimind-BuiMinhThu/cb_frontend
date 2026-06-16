import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { getChatBotSetting } from '../../PreviewComponent/Utils';
import ThemePreviewShell from '../../DesignSetting/components/ThemePreviewShell';
import { useScenarioEditor } from '../context/ScenarioEditorContext';
import { buildScenarioSavePayload } from '../utils/scenarioApiUtils';
import { buildScenarioPreviewHeaderMetaFromChatbotApi } from '../preview/buildScenarioPreviewHeaderMeta';
import {
  buildScenarioPreviewIframeSrc,
  isSameOriginMessage,
  postToIframe,
  SCENARIO_PREVIEW_MESSAGES,
} from '../preview/scenarioPreviewBridge';
import '../../../../../assets/css/bot/bot-setting.css';
import '../../../../../assets/css/bot/scenario/scenario-editor-preview.css';

const PREVIEW_SCOPE_ID = 'scenario-editor-preview';
const DRAFT_SYNC_DEBOUNCE_MS = 300;
const PREVIEW_LOADING_TIMEOUT_MS = 20000;

const DEFAULT_BOT_META = {
  themeSettings: null,
  title: '簡単90秒で注文完了',
  subtitle: '',
  headerIconUrl: '',
  mainColor: '#327AED',
};

const ScenarioEditorPreviewPanel = () => {
  const { state, messages } = useScenarioEditor();
  const {
    dataMessages,
    indexMessageSelect,
    urlThanks,
    urlCartConfirmPage,
    isUsedCartConfirmPage,
    coupon,
    isUseBtnUpdateTracking,
    scenarioName,
    scenarioType,
    merchandiseId,
    lpProductUrl,
    isUseOnlyRegularOrder,
    isUseFukushashiki,
    isUseCustomCss,
    customCssContent,
    isUseCustomJsCode,
    headCustomJsCode,
    topBodyCustomJsCode,
    bottomBodyCustomJsCode,
    timerConfig,
    isUseErrMsgByJs,
    errMsgJsCode,
    errMsgSettingMode,
    errMsgFieldSelectors,
    errMsgFormSelectors,
    launchButtonSelectors,
    isUsedMessageLoadedPast,
    useFullwidthChatbotMobile,
    isUsedCrosssell,
    productIdCrossSell,
    isClearLandingPageSession,
    scenarioId,
    botId,
  } = state;
  const { handleSelectMessage } = messages;

  const iframeRef = useRef(null);
  const debounceRef = useRef(null);
  const initialSyncDoneRef = useRef(false);
  const [isIframeReady, setIsIframeReady] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(true);
  const [botMeta, setBotMeta] = useState(DEFAULT_BOT_META);

  const editorDraft = useMemo(() => buildScenarioSavePayload({
    dataMessages,
    urlThanks,
    urlCartConfirmPage,
    isUsedCartConfirmPage,
    coupon,
    isUseBtnUpdateTracking,
    scenarioName,
    scenarioType,
    merchandiseId,
    lpProductUrl,
    isUseOnlyRegularOrder,
    isUseFukushashiki,
    isUseCustomCss,
    customCssContent,
    isUseCustomJsCode,
    headCustomJsCode,
    topBodyCustomJsCode,
    bottomBodyCustomJsCode,
    timerConfig,
    isUseErrMsgByJs,
    errMsgJsCode,
    errMsgSettingMode,
    errMsgFieldSelectors,
    errMsgFormSelectors,
    launchButtonSelectors,
    isUsedMessageLoadedPast,
    useFullwidthChatbotMobile,
    isUsedCrosssell,
    productIdCrossSell,
    isClearLandingPageSession,
  }), [
    coupon,
    customCssContent,
    dataMessages,
    errMsgJsCode,
    errMsgSettingMode,
    errMsgFieldSelectors,
    errMsgFormSelectors,
    launchButtonSelectors,
    headCustomJsCode,
    isClearLandingPageSession,
    isUseBtnUpdateTracking,
    isUseCustomCss,
    isUseCustomJsCode,
    isUseErrMsgByJs,
    isUseFukushashiki,
    isUseOnlyRegularOrder,
    isUsedCartConfirmPage,
    isUsedCrosssell,
    isUsedMessageLoadedPast,
    lpProductUrl,
    merchandiseId,
    productIdCrossSell,
    scenarioName,
    scenarioType,
    timerConfig,
    topBodyCustomJsCode,
    bottomBodyCustomJsCode,
    urlCartConfirmPage,
    urlThanks,
    useFullwidthChatbotMobile,
  ]);

  const editorCustomCss = useMemo(() => ({
    isUseCustomCss,
    content: customCssContent?.final,
  }), [customCssContent?.final, isUseCustomCss]);

  const iframeSrc = useMemo(
    () => buildScenarioPreviewIframeSrc({
      scenarioId: scenarioId || Cookies.get('scenario_id'),
      scenarioType,
      botId: botId || Cookies.get('bot_id'),
    }),
    [botId, scenarioId, scenarioType],
  );

  const syncPreview = useCallback(() => {
    if (!isIframeReady || !iframeRef.current) return;

    postToIframe(iframeRef.current, {
      type: SCENARIO_PREVIEW_MESSAGES.EDITOR_DRAFT,
      payload: editorDraft,
    });
    postToIframe(iframeRef.current, {
      type: SCENARIO_PREVIEW_MESSAGES.EDITOR_CUSTOM_CSS,
      payload: editorCustomCss,
    });
  }, [editorCustomCss, editorDraft, isIframeReady]);

  const syncHighlight = useCallback((messageId) => {
    if (!isIframeReady || !iframeRef.current) return;

    postToIframe(iframeRef.current, {
      type: SCENARIO_PREVIEW_MESSAGES.HIGHLIGHT_MESSAGE,
      payload: { messageId },
    });
  }, [isIframeReady]);

  useEffect(() => {
    initialSyncDoneRef.current = false;
    setIsPreviewLoading(true);
    setIsIframeReady(false);
  }, [iframeSrc]);

  useEffect(() => {
    const currentBotId = botId || Cookies.get('bot_id');
    if (!currentBotId) return;

    getChatBotSetting(currentBotId)
      .then((response) => {
        const data = response?.data?.data;
        const meta = buildScenarioPreviewHeaderMetaFromChatbotApi(data);
        if (!meta) return;

        setBotMeta(meta);
      })
      .catch(() => {
        setBotMeta(DEFAULT_BOT_META);
      });
  }, [botId]);

  useEffect(() => {
    if (!isPreviewLoading) return undefined;

    const timeoutId = setTimeout(() => {
      setIsPreviewLoading(false);
    }, PREVIEW_LOADING_TIMEOUT_MS);

    return () => clearTimeout(timeoutId);
  }, [isPreviewLoading, iframeSrc]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (!isSameOriginMessage(event)) return;

      const { type, payload } = event.data || {};

      if (type === SCENARIO_PREVIEW_MESSAGES.PREVIEW_READY) {
        setIsIframeReady(true);
        return;
      }

      if (type === SCENARIO_PREVIEW_MESSAGES.PREVIEW_CONTENT_READY) {
        setIsPreviewLoading(false);
        return;
      }

      if (type === SCENARIO_PREVIEW_MESSAGES.PREVIEW_BOT_META) {
        if (!payload) return;
        setBotMeta((prev) => ({
          ...prev,
          ...payload,
        }));
        return;
      }

      if (type === SCENARIO_PREVIEW_MESSAGES.SELECT_MESSAGE) {
        const messageId = payload?.messageId;
        if (messageId == null || !dataMessages?.length) return;

        const index = dataMessages.findIndex(
          (message) => Number(message.id) === Number(messageId),
        );
        if (index < 0) return;
        if (typeof handleSelectMessage !== 'function') return;

        const message = dataMessages[index];
        const lastContent = message.message_content?.[message.message_content.length - 1];
        handleSelectMessage(index, message.belong_to, lastContent?.type);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
      setIsIframeReady(false);
    };
  }, [dataMessages, handleSelectMessage, iframeSrc]);

  useEffect(() => {
    if (!isIframeReady) return undefined;

    if (!initialSyncDoneRef.current) {
      syncPreview();
      initialSyncDoneRef.current = true;
      return undefined;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      syncPreview();
    }, DRAFT_SYNC_DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [editorDraft, editorCustomCss, isIframeReady, syncPreview]);

  useEffect(() => {
    if (!isIframeReady) return;

    const selectedMessage = dataMessages?.[indexMessageSelect];
    syncHighlight(selectedMessage?.id ?? null);
  }, [dataMessages, indexMessageSelect, isIframeReady, syncHighlight]);

  const messageCount = useMemo(
    () => (dataMessages || []).length,
    [dataMessages],
  );

  const processLabel = messageCount > 0 ? `1 / ${messageCount}` : 'プレビュー';
  const processPercent = messageCount > 0 ? Math.round((1 / messageCount) * 100) : 33;

  return (
    <div className="scenario-editor-preview-wrapper">
      <ThemePreviewShell
        scopeId={PREVIEW_SCOPE_ID}
        themeSettings={botMeta?.themeSettings}
        mainColor={botMeta?.mainColor || DEFAULT_BOT_META.mainColor}
        title={botMeta?.title}
        subtitle={botMeta?.subtitle}
        headerIconUrl={botMeta?.headerIconUrl}
        showPlaceholderLabels={false}
        processLabel={processLabel}
        processPercent={processPercent}
        className="scenario-editor-preview is_mobile"
      >
        <iframe
          ref={iframeRef}
          title="Scenario preview"
          className="scenario-editor-preview__iframe"
          src={iframeSrc}
        />
      </ThemePreviewShell>
      {isPreviewLoading && (
        <div className="scenario-editor-preview__loading" aria-live="polite" aria-busy="true">
          <div className="scenario-editor-preview__loading-spinner" />
          <span className="scenario-editor-preview__loading-text">プレビューを読み込み中...</span>
        </div>
      )}
    </div>
  );
};

export default ScenarioEditorPreviewPanel;
