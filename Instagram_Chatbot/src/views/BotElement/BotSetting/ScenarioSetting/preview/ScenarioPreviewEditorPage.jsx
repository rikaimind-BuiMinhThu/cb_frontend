import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import ScenarioPreviewFaq from './ScenarioPreviewFaq';
import ScenarioPreviewFukushashiki from './ScenarioPreviewFukushashiki';
import {
  isSameOriginMessage,
  postToParent,
  SCENARIO_PREVIEW_MESSAGES,
} from './scenarioPreviewBridge';
import {
  applyEditorMessageHighlight,
  setupEditorMessageClickListener,
} from './scenarioEditorPreviewInteraction';
import '../../../../../assets/css/bot/scenario/scenario-preview-editor-page.css';

const ScenarioPreviewEditorPage = () => {
  const params = new URLSearchParams(window.location.search);
  const scenarioType = params.get('scenario_type') || 'payment';
  const scenarioId = params.get('scenario_id') || Cookies.get('scenario_id');
  const botId = params.get('bot_id') || Cookies.get('bot_id');

  const [editorDraft, setEditorDraft] = useState(null);
  const [editorCustomCss, setEditorCustomCss] = useState(null);

  useEffect(() => {
    if (botId) {
      Cookies.set('bot_id', botId);
    }
    if (scenarioId) {
      Cookies.set('scenario_id', scenarioId);
    }
  }, [botId, scenarioId]);

  useEffect(() => {
    document.documentElement.classList.add('scenario-preview-editor-embedded');
    document.body.classList.add('scenario-preview-editor-embedded', 'is_mobile');
    return () => {
      document.documentElement.classList.remove('scenario-preview-editor-embedded');
      document.body.classList.remove('scenario-preview-editor-embedded', 'is_mobile');
    };
  }, []);

  useEffect(() => {
    const handleMessage = (event) => {
      if (!isSameOriginMessage(event)) return;

      const { type, payload } = event.data || {};

      if (type === SCENARIO_PREVIEW_MESSAGES.EDITOR_DRAFT) {
        setEditorDraft(payload);
      }

      if (type === SCENARIO_PREVIEW_MESSAGES.EDITOR_CUSTOM_CSS) {
        setEditorCustomCss(payload);
      }

      if (type === SCENARIO_PREVIEW_MESSAGES.HIGHLIGHT_MESSAGE) {
        applyEditorMessageHighlight(payload?.messageId ?? null);
      }
    };

    window.addEventListener('message', handleMessage);
    postToParent({ type: SCENARIO_PREVIEW_MESSAGES.PREVIEW_READY });

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    const cleanup = setupEditorMessageClickListener((messageId) => {
      postToParent({
        type: SCENARIO_PREVIEW_MESSAGES.SELECT_MESSAGE,
        payload: { messageId },
      });
    });

    return cleanup;
  }, []);

  useEffect(() => {
    if (!editorDraft) return undefined;

    const frameId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        postToParent({ type: SCENARIO_PREVIEW_MESSAGES.PREVIEW_CONTENT_READY });
      });
    });

    return () => cancelAnimationFrame(frameId);
  }, [editorDraft]);

  const sharedProps = {
    editorPreview: true,
    embedded: true,
    previewDeviceMode: 'sp',
    editorDraft,
    editorCustomCss,
  };

  if (scenarioType === 'faq') {
    return <ScenarioPreviewFaq {...sharedProps} />;
  }

  return <ScenarioPreviewFukushashiki {...sharedProps} />;
};

export default ScenarioPreviewEditorPage;
