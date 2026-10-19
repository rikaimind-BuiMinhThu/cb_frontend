import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { useScenarioEditor } from '../context/ScenarioEditorContext';
import { buildScenarioSavePayload } from 'v2/views/ScenarioSetting/utils/scenarioApiUtils';
import {
  buildScenarioPreviewIframeSrc,
  isSameOriginMessage,
  postToIframe,
  SCENARIO_PREVIEW_MESSAGES,
} from '../preview/scenarioPreviewBridge';
import 'v2/views/ScenarioSetting/styles/scenario-editor-preview.css';

const PREVIEW_LOADING_TIMEOUT_MS = 20000;

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
    isUseGlobalDelay,
    globalDelayTime,
    scenarioName,
    scenarioType,
    merchandiseId,
    lpProductUrl,
    isUseOnlyRegularOrder,
    isUseFukushashiki,
    isUseCustomCss,
    customCssContent,
    isUseHtmlUgc,
    htmlUgcConfigContent,
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
    editorSelectedRadioOption,
    editorSelectedCheckboxOption,
    orderResultMode,
    lexicaCartUrl,
    lexicaUpsellProductUrl,
    lexicaUpsellSku,
    lexicaCrossSellProductUrl,
    lexicaCrossSellSku,
    lexicaOfferChat,
    lexicaOfferConfirmUpsell,
    lexicaOfferConfirmCrossSell,
    lexicaOfferThanksUpsell,
    lexicaOfferThanksCrossSell,
  } = state;
  const { handleSelectMessage } = messages;

  const iframeRef = useRef(null);
  const draftSyncRafRef = useRef(null);
  const initialSyncDoneRef = useRef(false);
  const dataMessagesRef = useRef(dataMessages);
  const handleSelectMessageRef = useRef(handleSelectMessage);
  const [isIframeReady, setIsIframeReady] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(true);

  const editorDraft = useMemo(() => buildScenarioSavePayload({
    dataMessages,
    urlThanks,
    urlCartConfirmPage,
    isUsedCartConfirmPage,
    coupon,
    isUseBtnUpdateTracking,
    isUseGlobalDelay,
    globalDelayTime,
    scenarioName,
    scenarioType,
    merchandiseId,
    lpProductUrl,
    orderResultMode,
    lexicaCartUrl,
    lexicaUpsellProductUrl,
    lexicaUpsellSku,
    lexicaCrossSellProductUrl,
    lexicaCrossSellSku,
    lexicaOfferChat,
    lexicaOfferConfirmUpsell,
    lexicaOfferConfirmCrossSell,
    lexicaOfferThanksUpsell,
    lexicaOfferThanksCrossSell,
    isUseOnlyRegularOrder,
    isUseFukushashiki,
    isUseCustomCss,
    customCssContent,
    isUseHtmlUgc,
    htmlUgcConfigContent,
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
    isUseHtmlUgc,
    htmlUgcConfigContent,
    dataMessages,
    errMsgJsCode,
    errMsgSettingMode,
    errMsgFieldSelectors,
    errMsgFormSelectors,
    launchButtonSelectors,
    headCustomJsCode,
    isClearLandingPageSession,
    isUseBtnUpdateTracking,
    isUseGlobalDelay,
    globalDelayTime,
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
    orderResultMode,
    lexicaCartUrl,
    lexicaUpsellProductUrl,
    lexicaUpsellSku,
    lexicaCrossSellProductUrl,
    lexicaCrossSellSku,
    lexicaOfferChat,
    lexicaOfferConfirmUpsell,
    lexicaOfferConfirmCrossSell,
    lexicaOfferThanksUpsell,
    lexicaOfferThanksCrossSell,
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

  const editorHtmlUgc = useMemo(() => ({
    isUseHtmlUgc,
    content: htmlUgcConfigContent?.final,
  }), [htmlUgcConfigContent?.final, isUseHtmlUgc]);

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
    postToIframe(iframeRef.current, {
      type: SCENARIO_PREVIEW_MESSAGES.EDITOR_HTML_UGC,
      payload: editorHtmlUgc,
    });
  }, [editorCustomCss, editorHtmlUgc, editorDraft, isIframeReady]);

  const syncHighlight = useCallback((messageId) => {
    if (!isIframeReady || !iframeRef.current) return;

    postToIframe(iframeRef.current, {
      type: SCENARIO_PREVIEW_MESSAGES.HIGHLIGHT_MESSAGE,
      payload: { messageId },
    });
  }, [isIframeReady]);

  const syncRadioOptionHighlight = useCallback((selection) => {
    if (!isIframeReady || !iframeRef.current) return;

    postToIframe(iframeRef.current, {
      type: SCENARIO_PREVIEW_MESSAGES.HIGHLIGHT_RADIO_OPTION,
      payload: selection,
    });
  }, [isIframeReady]);

  const syncCheckboxOptionHighlight = useCallback((selection) => {
    if (!isIframeReady || !iframeRef.current) return;

    postToIframe(iframeRef.current, {
      type: SCENARIO_PREVIEW_MESSAGES.HIGHLIGHT_CHECKBOX_OPTION,
      payload: selection,
    });
  }, [isIframeReady]);

  const getRadioOptionHighlightPayload = useCallback(() => {
    const shouldHighlight = editorSelectedRadioOption?.indexMessageSelect === indexMessageSelect;
    if (!shouldHighlight) return null;

    return {
      indexContent: editorSelectedRadioOption.indexContent,
      optionId: editorSelectedRadioOption.optionId,
    };
  }, [editorSelectedRadioOption, indexMessageSelect]);

  const getCheckboxOptionHighlightPayload = useCallback(() => {
    const shouldHighlight = editorSelectedCheckboxOption?.indexMessageSelect === indexMessageSelect;
    if (!shouldHighlight) return null;

    return {
      indexContent: editorSelectedCheckboxOption.indexContent,
      optionId: editorSelectedCheckboxOption.optionId,
    };
  }, [editorSelectedCheckboxOption, indexMessageSelect]);

  const syncPreviewWithHighlights = useCallback(() => {
    syncPreview();
    syncRadioOptionHighlight(getRadioOptionHighlightPayload());
    syncCheckboxOptionHighlight(getCheckboxOptionHighlightPayload());
  }, [
    getCheckboxOptionHighlightPayload,
    getRadioOptionHighlightPayload,
    syncCheckboxOptionHighlight,
    syncPreview,
    syncRadioOptionHighlight,
  ]);

  dataMessagesRef.current = dataMessages;
  handleSelectMessageRef.current = handleSelectMessage;

  const handleIframeLoad = useCallback(() => {
    setIsIframeReady(true);
    syncPreviewWithHighlights();
  }, [syncPreviewWithHighlights]);

  useEffect(() => {
    initialSyncDoneRef.current = false;
    setIsPreviewLoading(true);
    setIsIframeReady(false);
  }, [iframeSrc]);

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
        syncPreviewWithHighlights();
        return;
      }

      if (type === SCENARIO_PREVIEW_MESSAGES.REQUEST_EDITOR_DRAFT) {
        setIsIframeReady(true);
        syncPreviewWithHighlights();
        return;
      }

      if (type === SCENARIO_PREVIEW_MESSAGES.PREVIEW_CONTENT_READY) {
        setIsPreviewLoading(false);
        return;
      }

      if (type === SCENARIO_PREVIEW_MESSAGES.SELECT_MESSAGE) {
        const messageId = payload?.messageId;
        const currentDataMessages = dataMessagesRef.current;
        const selectMessage = handleSelectMessageRef.current;
        if (messageId == null || !currentDataMessages?.length) return;

        const index = currentDataMessages.findIndex(
          (message) => Number(message.id) === Number(messageId),
        );
        if (index < 0) return;
        if (typeof selectMessage !== 'function') return;

        const message = currentDataMessages[index];
        const lastContent = message.message_content?.[message.message_content.length - 1];
        selectMessage(index, message.belong_to, lastContent?.type);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [iframeSrc, syncPreviewWithHighlights]);

  useEffect(() => {
    if (!isIframeReady) return undefined;

    if (!initialSyncDoneRef.current) {
      syncPreviewWithHighlights();
      initialSyncDoneRef.current = true;
      return undefined;
    }

    if (draftSyncRafRef.current) {
      cancelAnimationFrame(draftSyncRafRef.current);
    }

    draftSyncRafRef.current = requestAnimationFrame(() => {
      syncPreviewWithHighlights();
      draftSyncRafRef.current = null;
    });

    return () => {
      if (draftSyncRafRef.current) {
        cancelAnimationFrame(draftSyncRafRef.current);
        draftSyncRafRef.current = null;
      }
    };
  }, [editorDraft, editorCustomCss, editorHtmlUgc, isIframeReady, syncPreviewWithHighlights]);

  useEffect(() => {
    if (!isIframeReady) return;

    const selectedMessage = dataMessages?.[indexMessageSelect];
    syncHighlight(selectedMessage?.id ?? null);
  }, [dataMessages, indexMessageSelect, isIframeReady, syncHighlight]);

  useEffect(() => {
    if (!isIframeReady) return;

    syncRadioOptionHighlight(getRadioOptionHighlightPayload());
  }, [
    editorSelectedRadioOption,
    indexMessageSelect,
    isIframeReady,
    getRadioOptionHighlightPayload,
    syncRadioOptionHighlight,
  ]);

  useEffect(() => {
    if (!isIframeReady) return;

    syncCheckboxOptionHighlight(getCheckboxOptionHighlightPayload());
  }, [
    editorSelectedCheckboxOption,
    indexMessageSelect,
    isIframeReady,
    getCheckboxOptionHighlightPayload,
    syncCheckboxOptionHighlight,
  ]);

  return (
    <div className="scenario-editor-preview-wrapper">
      <iframe
        ref={iframeRef}
        title="Scenario preview"
        className="scenario-editor-preview__iframe"
        src={iframeSrc}
        onLoad={handleIframeLoad}
      />
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
