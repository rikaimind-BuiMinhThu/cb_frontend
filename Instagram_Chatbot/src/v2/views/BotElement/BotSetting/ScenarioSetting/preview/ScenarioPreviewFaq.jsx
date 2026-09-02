import React, { useEffect, useRef, useReducer, useCallback } from "react";
import Cookies from "js-cookie";
import CustomButton from "../../CustomButton";
import {
  UserMessage, BotMessage, CombineMessage, CombineMessageNextButton,
  PreviewClosedLauncher, PreviewOpenChatFrame, PreviewMessagesList,
} from "../../PreviewComponent";
import PreviewFaqReducer from "../../PreviewFaq/PreviewFaqReducer";
import "moment/locale/zh-cn";
import {
  CHATBOT_ACTIONS,
  PREVIEW_ACTIONS,
  RENDER_CHATBOT_CONFIG,
  CONVERSION_RESPONSE_SUBMIT_TYPE,
  BOT_MESSAGE_TYPES,
  MESSAGE_CONTENT_TYPES,
  NO_ERROR,
} from "../../PreviewComponent/Constants";
import { injectBotThemeCss } from "v2/utils/chatbotThemeCss";
import { COLOR_MAP } from "v2/views/BotElement/BotSetting/DesignSetting/constants/designChatbotConstants";
import {
  getScenarioPreviewData,
  sleep,
  userEntryScenario,
  getElementMessageById,
  sendOpenChatbotCountRequest,
  sendCloseChatbotCountRequest,
  sendLogMessageToServer,
  sendErrorLogToServer,
  sendContactFormRequest,
} from "../../PreviewComponent/Utils";
import {
  savedChatbotState,
  saveCheckpointTime,
  savePrevOpenStatus,
  getPrevOpenStatus,
} from "../../PreviewComponent/SessionStorageUtils";
import { clearChatbotState } from "../../PreviewComponent/previewSessionUtils";
import { getBotInforFromPreviewResponse } from "../../PreviewComponent/previewBotInfoUtils";
import {
  getBotHeaderIconUrl as resolveBotHeaderIconUrl,
  getOpeningBotStyle as buildOpeningBotStyle,
} from "../../PreviewComponent/previewOpeningStyles";
import {
  mapRawDesignSettingsFromExtract,
} from "../../PreviewComponent/previewDesignStateUtils";
import { createPreviewInitialState } from "../../PreviewComponent/createPreviewInitialState";
import {
  setConversionParamToLocalStorage, postMessageToParent, executeLpJsCode,
} from "../../PreviewFukushashiki/LPUtils";
import { handleValidateField, ERROR_MESSAGES } from "../../PreviewFukushashiki/ValidationUtils";
import { injectHtmlUgcConfigContent } from "../../PreviewComponent/BotMessageUtils";
import { buildEditorDraftPreviewUpdate } from "./buildPreviewStateFromDraft";
import { buildScenarioPreviewHeaderMeta } from "./buildScenarioPreviewHeaderMeta";
import {
  postToParent,
  SCENARIO_PREVIEW_MESSAGES,
} from "./scenarioPreviewBridge";
import {
  canRenderEditorPreviewBody,
  resolveEditorPreviewBotInfor,
} from "./editorPreviewUtils";
import {
  usePreviewConversionOnOpen,
  usePreviewIpParams,
  usePreviewDesignSettings,
  usePreviewParentSync,
  usePreviewCustomJs,
  usePreviewThemeCss,
  usePreviewScenarioBootstrap,
  usePreviewAutoScroll,
  usePreviewMessageReveal,
} from "../../PreviewComponent/hooks";

const isPreviewMobile = (deviceMode) => deviceMode === 'sp';

savePrevOpenStatus("0");
var url = new URL(window.location.href);
let params = new URLSearchParams(url.search);
let isLoggedIn = params.get('isLoggedIn') === "true";
const previewInitialState = createPreviewInitialState("faq", { params });

const ScenarioPreviewFaq = ({
  previewDeviceMode = 'pc',
  editorCustomCss,
  editorHtmlUgc,
  embedded = false,
  editorPreview = false,
  editorDraft = null,
}) => {
  const [state, dispatch] = useReducer(PreviewFaqReducer, previewInitialState);
  const containerRef = useRef(null);
  const hasSentCustomJs = useRef(false);
  const hasSentInitialOpenStateToParent = useRef(false);

  useEffect(() => {
    if (!editorPreview) return;
    clearChatbotState();
  }, [editorPreview]);

  useEffect(() => {
    if (!editorPreview || !editorDraft) return;

    dispatch({
      type: PREVIEW_ACTIONS.UPDATE_MULTI_STATE,
      payload: buildEditorDraftPreviewUpdate(editorDraft),
    });
  }, [editorPreview, editorDraft]);

  useEffect(() => {
    if (!editorPreview) return;

    const botInfor = resolveEditorPreviewBotInfor(state.botInfor);
    const isOpen = embedded || editorPreview || state.isOpen;
    postToParent({
      type: SCENARIO_PREVIEW_MESSAGES.PREVIEW_BOT_META,
      payload: buildScenarioPreviewHeaderMeta(botInfor, {
        isOpen,
        themeSettings: state.themeSettings,
      }),
    });
  }, [
    editorPreview,
    embedded,
    state.botInfor,
    state.isOpen,
    state.themeSettings,
  ]);

  usePreviewConversionOnOpen({ state, dispatch, enabled: !editorPreview });
  usePreviewIpParams({ state, dispatch, enabled: !editorPreview });
  usePreviewDesignSettings({
    state,
    dispatch,
    params,
    refreshPolicy: "untilDisplayTypeSet",
    designSource: "raw",
    enabled: !editorPreview,
  });

  const applyScenarioTheme = useCallback((botInfor, themeSettings) => {
    if (!botInfor) return;
    const chatbot = botInfor;
    const apiColorKey = chatbot.main_color && !String(chatbot.main_color).startsWith('#')
      ? chatbot.main_color
      : null;
    const mainColorHex = chatbot.main_color_other
      || COLOR_MAP[chatbot.main_color]
      || chatbot.main_color
      || '#327AED';
    injectBotThemeCss(themeSettings, mainColorHex, apiColorKey);
  }, []);

  const eventHandler = async (event) => {
    if (!event.data || !event.data.actionData) return;

    if (editorPreview) {
      const blockedInEditor = [
        CHATBOT_ACTIONS.GET_ERROR_MESSAGE,
        CHATBOT_ACTIONS.OPEN_PREVIEW,
      ];
      if (blockedInEditor.includes(event.data.action)) {
        return;
      }
    }

    const actionData = event.data.actionData;

    switch (event.data.action) {
      case CHATBOT_ACTIONS.GET_ERROR_MESSAGE:
        await sleep(1000);
        const error = actionData === NO_ERROR ? "" : actionData;
        return dispatch({
          type: PREVIEW_ACTIONS.UPDATE_SUBMIT_ERROR_MESSAGE,
          payload: error
        });

      case CHATBOT_ACTIONS.OPEN_PREVIEW:
        if (!state.isOpen)
          return onOpenPreview(true);
        break;
      default:
        // TODO
        break;
    }
  };

  usePreviewParentSync({
    state,
    eventHandler,
    hasSentInitialOpenStateToParent,
    enabled: !editorPreview,
  });

  useEffect(() => {
    if (embedded) return undefined;
    if (isPreviewMobile(previewDeviceMode)) {
      document.body.classList.add('is_mobile');
    } else {
      document.body.classList.remove('is_mobile');
    }
    return () => {
      document.body.classList.remove('is_mobile');
    };
  }, [previewDeviceMode, embedded]);

  usePreviewCustomJs({ state, hasSentCustomJs, enabled: !editorPreview });

  const cssEnabled = editorCustomCss?.isUseCustomCss ?? state.isUsedCustomCss;
  const cssContent = editorCustomCss?.isUseCustomCss
    ? editorCustomCss.content
    : state.customCssContent;

  useEffect(() => {
    const existing = document.getElementById('custom-css');
    if (existing) {
      existing.remove();
    }
    if (!cssEnabled || !cssContent) {
      return undefined;
    }
    const style = document.createElement('style');
    style.id = 'custom-css';
    style.innerHTML = cssContent;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, [cssEnabled, cssContent]);

  const htmlUgcEnabled = editorHtmlUgc?.isUseHtmlUgc ?? state.isUsedHtmlUgc;
  const htmlUgcContent = editorHtmlUgc?.isUseHtmlUgc
    ? editorHtmlUgc.content
    : state.htmlUgcConfigContent;

  useEffect(() => {
    if (!htmlUgcEnabled || !htmlUgcContent) return undefined;
    return injectHtmlUgcConfigContent(htmlUgcContent);
  }, [htmlUgcEnabled, htmlUgcContent]);

  usePreviewThemeCss({
    state,
    enabled: !embedded,
    applyTheme: applyScenarioTheme,
  });

  // Editor preview: hydrate bot/scenario ids then fetch scenario data
  useEffect(() => {
    if (!editorPreview) return undefined;
    if (state.loadedStateFromSession) return undefined;

    if (!state.botId) {
      const currentBotId = params.get('bot_id') || Cookies.get('bot_id');
      if (currentBotId) {
        dispatch({ type: PREVIEW_ACTIONS.SET_BOT_ID, payload: currentBotId });
      }
      return undefined;
    }

    if (!state.scenarioId) {
      const currentScenarioId = params.get('scenario_id') || Cookies.get('scenario_id');
      if (currentScenarioId) {
        dispatch({ type: PREVIEW_ACTIONS.SET_SCENARIO_ID, payload: currentScenarioId });
      }
      return undefined;
    }

    return getScenarioPreviewData(state.botId, state.scenarioId)
      .then(extractStateFromPreviewResponse);
  }, [editorPreview, state.botId, state.scenarioId, state.loadedStateFromSession]);

  usePreviewScenarioBootstrap({
    state,
    dispatch,
    params,
    enabled: !editorPreview,
    onExtractState: (res) => extractStateFromPreviewResponse(res),
  });
  usePreviewAutoScroll({ state, enabled: !editorPreview });
  usePreviewMessageReveal({
    state,
    dispatch,
    delayMs: RENDER_CHATBOT_CONFIG.DELAY_EACH_MESSAGE_FAQ,
    enabled: !editorPreview,
  });

  useEffect(() => {
    if (state.submitErrorMessage) {
      const timer = setTimeout(() => {
        dispatch({ type: PREVIEW_ACTIONS.CLEAR_SUBMIT_ERROR_MESSAGE });
      }, RENDER_CHATBOT_CONFIG.FAQ_DELAY_CLEAR_SUBMIT_ERROR_MESSAGE);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [state.submitErrorMessage]);

  const renderNextMessage = () => {
    if (editorPreview) return;
    if (state.currentMsgIndex + 1 >= state.nextStopMsgIndex) return;

    dispatch({
      type: PREVIEW_ACTIONS.UPDATE_RENDER_MESSAGES,
      payload: {
        startIndex: 0,
        endIndex: state.currentMsgIndex + 1 + 1,
        fromCallback: true,
      }
    });
  };

  const setShowPopupCloseBot = (value) => {
    dispatch({ type: PREVIEW_ACTIONS.SET_SHOW_POPUP_CLOSE_BOT, payload: value });
  };

  const onOpenPreview = (opening) => {
    const deviceReceive = state.deviceReceive || params.get("deviceReceive");
    if (!deviceReceive) return;
    const postOpenStateToParent = (nextIsOpen) => {
      postMessageToParent({ isOpen: nextIsOpen }, { ...state, isOpen: nextIsOpen });
    };

    // Send data to count open chatbot window
    const prevOpenStatus = getPrevOpenStatus();

    if (prevOpenStatus == "0" && opening) {
      savePrevOpenStatus("1");
      sendOpenChatbotCountRequest(state.scenarioId, deviceReceive);
    }
    
    if (state.alreadyOpenFirstTime) {
      if (!opening) {
        if (state.activePopupCloseBot) {
          return dispatch({ type: PREVIEW_ACTIONS.OPEN_POPUP_CLOSE_BOT_MODAL });
        }
        postOpenStateToParent(false);
        return dispatch({ type: PREVIEW_ACTIONS.CLOSE_CHATBOT });
      }

      return userEntryScenario({
        scenario_id: state.scenarioId,
        user_id: state.uuid,
      }).then(() => {
        dispatch({ type: PREVIEW_ACTIONS.OPEN_CHATBOT });
        postOpenStateToParent(true);
      });
    }

    if (opening) {
      sendOpenChatbotCountRequest(state.scenarioId, deviceReceive).then(() => {
        dispatch({ type: PREVIEW_ACTIONS.OPEN_CHATBOT });
        postOpenStateToParent(true);
      });
    } else {
      sendCloseChatbotCountRequest(state.scenarioId, deviceReceive).then(() => {
        dispatch({ type: PREVIEW_ACTIONS.CLOSE_CHATBOT });
        postOpenStateToParent(false);
      });
    }
  }

  const extractStateFromPreviewResponse = async (res) => {
    if (!res || !res.data || res.data.code !== 1) return;
    const designSetting = res.data.design_settings;
    const chatbot = res.data.chatbot;
    const conversation = res.data.data?.conversation;
    const shouldAutoOpen = Number(designSetting?.display_type) === 1;
    const resolvedDisplayType = Number(designSetting?.display_type ?? state.displayType ?? 2);
    let newState = {
      ...state,
      botInfor: getBotInforFromPreviewResponse(res),
      objParam: {},
      loadedStateFromSession: true,
      messagesList: conversation?.messages || [],
      isOpen: embedded || editorPreview ? true : (shouldAutoOpen ? true : Boolean(state.isOpen)),
      ...mapRawDesignSettingsFromExtract(designSetting),
      displayType: resolvedDisplayType,
      isUsedPastMessageLoaded: !!chatbot?.is_used_message_loaded_past,
      isProcessing: false,
      useFullWidthChatbotMobile: !!chatbot?.use_fullwidth_chatbot_mobile,
      isUsedCustomCss: !!chatbot?.is_used_custom_css,
      customCssContent: chatbot?.custom_css_content,
      isUsedHtmlUgc: !!chatbot?.is_used_html_ugc,
      htmlUgcConfigContent: chatbot?.html_ugc_config_content,
    };

    if (!editorPreview) {
      const prevOpenStatus = getPrevOpenStatus();

      if (designSetting.display_type == 1 && prevOpenStatus == "0") {
        savePrevOpenStatus("1");
        sendOpenChatbotCountRequest(state.scenarioId, state.deviceReceive);
      }

      setConversionParamToLocalStorage(
        newState.scenarioId,
        'web',
        newState.userInputId || params.get("uuid"),
        params.get("env") || "production",
        newState
      );
    }

    saveCheckpointTime(res.data.data.updated_at);

    dispatch({
      type: PREVIEW_ACTIONS.SET_STATE_AFTER_RETRIEVE_SCENARIO_FROM_SERVER,
      payload: {
        responseData: res.data,
        botInfor: getBotInforFromPreviewResponse(res),
        isEditorPreview: editorPreview,
      },
    });
  }

  const advanceAfterClickNext = (clickedMsgIndex, clickedMsg, data) => {
    const isBtnUpdateClick = clickedMsgIndex < state.renderMessagesList.length - 1;

    sendLogMessageToServer(data, isBtnUpdateClick ? CONVERSION_RESPONSE_SUBMIT_TYPE.UPDATE : CONVERSION_RESPONSE_SUBMIT_TYPE.ADD);

    if (clickedMsg.button_jscode && clickedMsg.jscode.length > 0) {
      executeLpJsCode(clickedMsg.jscode, state);
    }

    dispatch({
      type: PREVIEW_ACTIONS.UPDATE_AFTER_CLICK_NEXT_BUTTON,
      payload: { clickedMsgIndex, clickedMsg, isLoggedIn: isLoggedIn}
    });
  };

  const sendContactFormIfNeeded = (clickedMsg) => {
    const contactFormContent = (clickedMsg.message_content || []).find(
      (content) => content.type === MESSAGE_CONTENT_TYPES.CONTACT_FORM
    );
    if (!contactFormContent) return Promise.resolve();

    const contactForm = contactFormContent.contact_form || {};
    return sendContactFormRequest({
      chatbot_id: state.botId,
      scenario_id: state.scenarioId,
      form_template: contactForm.form_template,
      fields: contactForm.fields || {},
      email_settings: contactForm.email_settings || {},
    }).then((res) => {
      if (res?.data?.code !== 1) {
        return Promise.reject(new Error(res?.data?.message || "Contact form send failed"));
      }
      return res;
    });
  };

  const onClickNext = (clickedMsgIndex, clickedMsg) => {
    if (editorPreview) {
      return;
    }

    const isUpdate = clickedMsgIndex < state.renderMessagesList.length - 1;

    if (isUpdate) {
      return dispatch({
        type: PREVIEW_ACTIONS.SET_SUBMIT_ERROR_MESSAGE,
        payload: ERROR_MESSAGES.FAQ_CAN_NOT_UPDATE_USER_MESSAGE
      });
    }

    savedChatbotState(state);

    const data = {
      scenario_id: state.scenarioId,
      message: clickedMsg,
      user_id: state.uuid,
      bot_type: "web"
    };

    const validationResult = handleValidateField(clickedMsg, clickedMsgIndex);
    
    if (!validationResult.isValid) {
      dispatch({
        type: PREVIEW_ACTIONS.SET_ERRORS,
        payload: validationResult.errors
      });
      return sendErrorLogToServer(data);
    }

    const hasContactForm = (clickedMsg.message_content || []).some(
      (content) => content.type === MESSAGE_CONTENT_TYPES.CONTACT_FORM
    );

    if (!hasContactForm) {
      return advanceAfterClickNext(clickedMsgIndex, clickedMsg, data);
    }

    dispatch({ type: PREVIEW_ACTIONS.SET_PROCESSING, payload: true });
    sendContactFormIfNeeded(clickedMsg)
      .then(() => {
        advanceAfterClickNext(clickedMsgIndex, clickedMsg, data);
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: PREVIEW_ACTIONS.SET_SUBMIT_ERROR_MESSAGE,
          payload: "お問い合わせの送信に失敗しました。もう一度お試しください。"
        });
      })
      .finally(() => {
        dispatch({ type: PREVIEW_ACTIONS.SET_PROCESSING, payload: false });
      });
  };

  const onChangeValue = (
    contentIndex,
    contentType,
    value,
    field,
    subField1,
    subField2,
    message,
    messageIndex
  ) => {
    const isUpdate = messageIndex < state.renderMessagesList.length - 1;

    if (isUpdate) {
      return dispatch({
        type: PREVIEW_ACTIONS.SET_SUBMIT_ERROR_MESSAGE,
        payload: ERROR_MESSAGES.FAQ_CAN_NOT_UPDATE_USER_MESSAGE
      });
    }

    // Early returns for invalid states
    if (!state.messagesList.length) return;

    savedChatbotState(state);

    dispatch({
      type: PREVIEW_ACTIONS.UPDATE_AFTER_CHANGE_VALUE,
      payload: {
        contentIndex,
        messageIndex,
        contentType,
        value,
        field,
        subField1,
        subField2,
        message
      }
    });
  };

  const onChangeErrors = (field, value) => {
    let newErrors = { ...state.errors };
    newErrors[field] = value;
    dispatch({ type: PREVIEW_ACTIONS.SET_ERRORS, payload: { newErrors } });
  };

  const renderBotMessageContent = (message, messageIndex) => {
    if (!message || message.belong_to !== "bot" || !Array.isArray(message?.message_content)) return null;

    return message.message_content.map((content, contentIndex) => {
      if (editorPreview && content.type === BOT_MESSAGE_TYPES.DELAY) {
        return (
          <div
            key={`${messageIndex}-${contentIndex}`}
            id={getElementMessageById(message.id)}
            className={`sp-body-bot-side${editorPreview ? '' : ' slideRight'}`}
          >
            <div className="sp-body-bot-side-messages">
              <div className="ss-bot-message">
                <div className="ss-bot-message__content-wrapper">
                  {`${content.delay?.content || 0} 秒`}
                </div>
              </div>
            </div>
          </div>
        );
      }

      return (
      <BotMessage
        messageId={message.id}
        key={`${messageIndex}-${contentIndex}`}
        content={content}
        contentIndex={contentIndex}
        botInfor={state.botInfor}
        previewOrderContent={state.previewOrderContent}
        executeLpJsCode={(jsCode) => executeLpJsCode(jsCode, state)}
        variables={state.variables}
        onRenderCompleted={editorPreview ? () => {} : renderNextMessage}
        hidden={editorPreview ? false : message.hidden}
        currentMsgIndex={state.currentMsgIndex}
        isBotOpen={state.isOpen}
        delayEachMessage={editorPreview ? 0 : RENDER_CHATBOT_CONFIG.DELAY_EACH_MESSAGE_FAQ}
        skipEntryDelay={editorPreview}
      />
      );
    });
  };

  const renderNextButton = (message, messageIndex) => {
    const isUpdate = messageIndex >= state.renderMessagesList.length - 1;
    const firstMsgContent = message?.message_content?.[0];
    const isDisplayBtnNext = firstMsgContent?.type != "image" || firstMsgContent?.image?.displayButtonNext != false;
    const isAutoClick = !isDisplayBtnNext && isUpdate;

    if (!message || message.belong_to !== "user") return null;
    if (message.message_content[0]?.type === "button_submit") return null;

    let btnText = message.buttonName;
    if (!btnText) {
      btnText = isUpdate ? "次へ" : "次へ";
    }
    return (
      <div className="sp-user-message-button-action" style={{ display: isDisplayBtnNext ? "flex" : "none" }}>
        <CustomButton
          disabled={editorPreview}
          style={{
            backgroundColor: state.botInfor?.main_color || state.botInfor?.main_color_other,
          }}
          className="ss-user-message__action-btn"
          onClick={editorPreview ? undefined : () => {
            onClickNext(messageIndex, message);
          }}
          autoClick={!editorPreview && isAutoClick && !state.isExtractFromSession}
          messsagetype={message.message_content[0]?.type}
        >
          {btnText}
        </CustomButton>
      </div>
    );
  };

  const renderUserMessageContent = (message, messageIndex) => {
    if (!message || message.belong_to !== "user") return null;
    if (!Array.isArray(message?.message_content) || message.message_content.length === 0) return null;

    return (
      <div className={`sp-body-user-side${editorPreview ? '' : ' slideLeft'}`} id={getElementMessageById(message.id)}>
        <div className="sp-body-user-side-messages">
          <UserMessage
            postMessageToParent={(options) => postMessageToParent(options, state)}
            message={message}
            captcha={state.captcha}
            messageContentProps={message.message_content}
            disabled={false}
            onChangeValue={(
              contentIndex,
              contentType,
              value,
              field,
              subField1,
              subField2
            ) =>
              onChangeValue(
                contentIndex,
                contentType,
                value,
                field,
                subField1,
                subField2,
                message,
                messageIndex
              )
            }
            currentMsgIndex={state.currentMsgIndex}
            onClickNext={() => {
              onClickNext(messageIndex, message)}
            }
            onRenderCompleted={editorPreview ? () => {} : renderNextMessage}
            messageIndex={messageIndex}
            errorsProps={state.errors}
            prefecturesList={[]}
            onOpen={() => {
              // FAQ Do not use this function
            }}
            onChangeErrors={(field, value) =>
              onChangeErrors(field, value)
            }
            variables={state.variables}
            lpOptionData={state.lpOptionData}
            submitErrorMessage={''}
            botId={state.botId}
            isProcessing={!!state.isProcessing}
            cartSystem={params.get("cartSystem") ?? ""}
          />
          {renderNextButton(message, messageIndex)}
        </div>
      </div>
    );
  };

  const renderCombineMessageContent = (message, messageIndex) => {
    if (!message || message.belong_to !== "combine") return null;
    if (!Array.isArray(message?.message_content) || message.message_content.length === 0) return null;

    const isUpdate = messageIndex >= state.renderMessagesList.length - 1;

    return (
      <React.Fragment>
        <CombineMessage
          postMessageToParent={(options) => postMessageToParent(options, state)}
          message={message}
          captcha={state.captcha}
          disabled={false}
          onChangeValue={(
            contentIndex,
            contentType,
            value,
            field,
            subField1,
            subField2
          ) =>
            onChangeValue(
              contentIndex,
              contentType,
              value,
              field,
              subField1,
              subField2,
              message,
              messageIndex
            )
          }
          onClickNext={() => onClickNext(messageIndex, message)}
          messageIndex={messageIndex}
          errorsProps={state.errors}
          prefecturesList={[]}
          onOpen={() => {}}
          onChangeErrors={(field, value) => onChangeErrors(field, value)}
          variables={state.variables}
          lpOptionData={state.lpOptionData}
          submitErrorMessage=""
          botId={state.botId}
          isProcessing={!!state.isProcessing}
          botInfor={state.botInfor}
          previewOrderContent={state.previewOrderContent}
          executeLpJsCode={(jsCode) => executeLpJsCode(jsCode, state)}
          isBotOpen={state.isOpen}
          cartSystem={params.get("cartSystem") ?? ""}
        />
        <CombineMessageNextButton
          message={message}
          messageIndex={messageIndex}
          botInfor={state.botInfor}
          onClickNext={onClickNext}
          isUpdate={isUpdate}
          isExtractFromSession={state.isExtractFromSession}
        />
      </React.Fragment>
    );
  };

  const renderMessages = () => (
    <PreviewMessagesList
      messages={editorPreview
        ? (state.renderMessagesList || []).map((message) =>
            message.hidden ? { ...message, hidden: false } : message
          )
        : state.renderMessagesList}
      renderBotMessage={renderBotMessageContent}
      renderUserMessage={renderUserMessageContent}
      renderCombineMessage={renderCombineMessageContent}
    />
  );

  const renderSubmitErrorMessages = () => {
    if (!state.submitErrorMessage) return null;

    const className = "ss-bot-submit-error-message";
    const text = state.submitErrorMessage;
    const htmlText = text.replace(/¥n/g, "<br/>");
    return (
      <div className="ss-user-setting__item-text_input-top">
        <div id="error-message"
          className={`error-message-modal ${className}`}
          dangerouslySetInnerHTML={{ __html: htmlText }}
        />
      </div>
    );
  }

  const headerIconSrc = resolveBotHeaderIconUrl(state.botInfor, state.isOpen);

  const effectiveIsOpen = embedded || editorPreview || state.isOpen;
  const hasApiBotInfor = Boolean(
    state.botInfor?.title || state.botInfor?.main_color || state.botInfor?.main_color_other,
  );
  const displayBotInfor = editorPreview && !hasApiBotInfor
    ? resolveEditorPreviewBotInfor(state.botInfor)
    : state.botInfor;
  const canRenderChatBody = effectiveIsOpen && (
    canRenderEditorPreviewBody({ editorPreview, effectiveIsOpen, state })
    || ((editorPreview || state.scenarioId) && hasApiBotInfor)
  );

  if (canRenderChatBody) {
    const { frameClassName, cssVars } = buildOpeningBotStyle(state, {
      embedded,
      editorPreview,
      mobile: isPreviewMobile(previewDeviceMode),
    });
    return (
      <PreviewOpenChatFrame
        containerRef={containerRef}
        containerClassName={`sp-container1${editorPreview ? '' : (isPreviewMobile(previewDeviceMode) ? ' slideUpSp' : ' slideUp')}`}
        frameClassName={frameClassName}
        cssVars={cssVars}
        headerIconSrc={headerIconSrc}
        subtitle={displayBotInfor?.subtitle}
        titleBubble={displayBotInfor?.titleBubble}
        isOpen={state.isOpen}
        onHeaderClick={() => onOpenPreview(!state.isOpen)}
        botConfig={state}
        showPopupCloseBot={state.showPopupCloseBot}
        onClosePopup={() => setShowPopupCloseBot(false)}
        onCloseBot={() => onOpenPreview(false)}
      >
        {renderMessages()}
        {renderSubmitErrorMessages()}
      </PreviewOpenChatFrame>
    );
  }

  return (
    <PreviewClosedLauncher
      state={state}
      headerIconSrc={headerIconSrc}
      onOpen={onOpenPreview}
      isMobileView={isPreviewMobile(previewDeviceMode)}
      showFallback
      spCircleUseParentOffsets
      requireClosed
      hideWhenDisplayHidden={false}
    />
  );
}

export default ScenarioPreviewFaq;
