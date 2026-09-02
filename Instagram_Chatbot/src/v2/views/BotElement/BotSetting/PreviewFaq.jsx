import React, { useEffect, useRef, useReducer } from "react";
import "v2/assets/css/bot/preview-chat-bot.css";
import CustomButton from "./CustomButton";
import {
  UserMessage,
  BotMessage,
  CombineMessage,
  PreviewClosedLauncher,
  PreviewOpenChatFrame,
  PreviewMessagesList,
} from "./PreviewComponent";
import UserMessageTailIcon from "./PreviewComponent/UserMessageTailIcon";
import { resolveUserMessageTheme } from "v2/views/DesignSetting/utils/designThemeUtils";
import PreviewFaqReducer from "./PreviewFaq/PreviewFaqReducer";
import { EC_CHATBOT_URL } from "v2/variables/constants";
import "moment/locale/zh-cn";
import {
  CHATBOT_ACTIONS,
  PREVIEW_ACTIONS,
  RENDER_CHATBOT_CONFIG,
  CONVERSION_RESPONSE_SUBMIT_TYPE,
  MESSAGE_CONTENT_TYPES,
  NO_ERROR,
} from "./PreviewComponent/Constants";
import {
  parseDesignSettings,
  resolveMainColorContext,
} from "v2/views/DesignSetting/utils/designChatbotUtils";
import {
  isMobile,
  sleep,
  userEntryScenario,
  getElementMessageById,
  sendOpenChatbotCountRequest,
  sendCloseChatbotCountRequest,
  sendLogMessageToServer,
  sendErrorLogToServer,
  sendContactFormRequest,
} from "./PreviewComponent/Utils";
import {
  savedChatbotState,
  saveCheckpointTime,
  savePrevOpenStatus,
  getPrevOpenStatus,
} from "./PreviewComponent/SessionStorageUtils";
import {
  setConversionParamToLocalStorage, postMessageToParent, executeLpJsCode,
} from "./PreviewFukushashiki/LPUtils";
import { handleValidateField, ERROR_MESSAGES } from "./PreviewFukushashiki/ValidationUtils";
import { getBotInforFromPreviewResponse } from "./PreviewComponent/previewBotInfoUtils";
import {
  getBotHeaderIconPath,
  getOpeningBotStyle as buildOpeningBotStyle,
} from "./PreviewComponent/previewOpeningStyles";
import { mapParsedDesignToState } from "./PreviewComponent/previewDesignStateUtils";
import { createPreviewInitialState } from "./PreviewComponent/createPreviewInitialState";
import {
  usePreviewConversionOnOpen,
  usePreviewIpParams,
  usePreviewDesignSettings,
  usePreviewParentSync,
  usePreviewCustomJs,
  usePreviewThemeCss,
  usePreviewHtmlUgc,
  usePreviewScenarioBootstrap,
  usePreviewAutoScroll,
  usePreviewMessageReveal,
} from "./PreviewComponent/hooks";

savePrevOpenStatus("0");
var url = new URL(window.location.href);
let params = new URLSearchParams(url.search);
let isLoggedIn = params.get('isLoggedIn') === "true";
const previewInitialState = createPreviewInitialState("faq", { params });

const PreviewFaq = () => {
  const [state, dispatch] = useReducer(PreviewFaqReducer, previewInitialState);
  const containerRef = useRef(null);
  const hasSentCustomJs = useRef(false);
  const hasSentInitialOpenStateToParent = useRef(false);

  usePreviewConversionOnOpen({ state, dispatch });
  usePreviewIpParams({ state, dispatch });
  usePreviewDesignSettings({
    state,
    dispatch,
    params,
    refreshPolicy: "untilDisplayTypeSet",
    designSource: "parsed",
  });

  const eventHandler = async (event) => {
    if (!event.data || !event.data.actionData) return;
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
        break;
    }
  };

  usePreviewParentSync({
    state,
    eventHandler,
    hasSentInitialOpenStateToParent,
  });
  usePreviewCustomJs({ state, hasSentCustomJs });
  usePreviewThemeCss({ state });
  usePreviewHtmlUgc({ state });
  usePreviewScenarioBootstrap({
    state,
    dispatch,
    params,
    onExtractState: (res) => extractStateFromPreviewResponse(res),
  });
  usePreviewAutoScroll({ state });
  usePreviewMessageReveal({
    state,
    dispatch,
    delayMs: RENDER_CHATBOT_CONFIG.DELAY_EACH_MESSAGE_FAQ,
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

    if (prevOpenStatus === "0" && opening) {
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
    const chatbot = res.data.chatbot;
    const conversation = res.data.data?.conversation;
    const { apiColorKey, mainColorHex } = resolveMainColorContext(chatbot);
    const parsedDesign = parseDesignSettings(
      res.data.design_settings,
      mainColorHex,
      apiColorKey,
    );
    const shouldAutoOpen = Number(parsedDesign.displayType) === 1;
    let newState = {
      ...state,
      botInfor: getBotInforFromPreviewResponse(res),
      objParam: {},
      loadedStateFromSession: true,
      messagesList: conversation?.messages || [],
      isOpen: shouldAutoOpen ? true : Boolean(state.isOpen),
      ...mapParsedDesignToState(parsedDesign),
      isUsedPastMessageLoaded: !!chatbot?.is_used_message_loaded_past,
      isProcessing: false,
      useFullWidthChatbotMobile: !!chatbot?.use_fullwidth_chatbot_mobile,
      isUsedCustomCss: !!chatbot?.is_used_custom_css,
      customCssContent: chatbot?.custom_css_content,
      isUsedHtmlUgc: !!chatbot?.is_used_html_ugc,
      htmlUgcConfigContent: chatbot?.html_ugc_config_content,
    };

    const prevOpenStatus = getPrevOpenStatus();

    if (parsedDesign.displayType === 1 && prevOpenStatus === "0") {
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

    saveCheckpointTime(res.data.data.updated_at);

    dispatch({
      type: PREVIEW_ACTIONS.SET_STATE_AFTER_RETRIEVE_SCENARIO_FROM_SERVER,
      payload: {
        responseData: res.data,
        botInfor: getBotInforFromPreviewResponse(res),
        themeSettings: parsedDesign.themeSettings,
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

    return message.message_content.map((content, contentIndex) => (
      <BotMessage
        messageId={message.id}
        key={`${messageIndex}-${contentIndex}`}
        content={content}
        contentIndex={contentIndex}
        botInfor={state.botInfor}
        themeSettings={state.themeSettings}
        previewOrderContent={state.previewOrderContent}
        executeLpJsCode={(jsCode) => executeLpJsCode(jsCode, state)}
        variables={state.variables}
        onRenderCompleted={renderNextMessage}
        hidden={message.hidden}
        currentMsgIndex={state.currentMsgIndex}
        isBotOpen={state.isOpen}
        delayEachMessage={RENDER_CHATBOT_CONFIG.DELAY_EACH_MESSAGE_FAQ}
      />
    ));
  };

  const renderNextButton = (message, messageIndex) => {
    const isUpdate = messageIndex >= state.renderMessagesList.length - 1;
    const firstMsgContent = message?.message_content?.[0];
    const isDisplayBtnNext = firstMsgContent?.type !== "image" || firstMsgContent?.image?.displayButtonNext !== false;
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
          disabled={false}
          className="ss-user-message__action-btn"
          onClick={() => {
            onClickNext(messageIndex, message)
          }}
          autoClick={isAutoClick && !state.isExtractFromSession}
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

    const userMessageTheme = resolveUserMessageTheme(state.themeSettings, state.botInfor);

    return (
      <div className="sp-body-user-side slideLeft" id={getElementMessageById(message.id)}>
        <div className="sp-body-user-side-messages position-relative">
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
            onRenderCompleted={renderNextMessage}
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
            footer={renderNextButton(message, messageIndex)}
          />
          <UserMessageTailIcon
            fillColor={userMessageTheme.bgColor}
            showTail={userMessageTheme.showTail}
          />
        </div>
      </div>
    );
  };

  const renderCombineMessageContent = (message, messageIndex) => {
    if (!message || message.belong_to !== "combine") return null;
    if (!Array.isArray(message?.message_content) || message.message_content.length === 0) return null;

    const isUpdate = messageIndex >= state.renderMessagesList.length - 1;

    return (
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
          themeSettings={state.themeSettings}
          previewOrderContent={state.previewOrderContent}
          executeLpJsCode={(jsCode) => executeLpJsCode(jsCode, state)}
          isBotOpen={state.isOpen}
          cartSystem={params.get("cartSystem") ?? ""}
          isUpdate={isUpdate}
          isExtractFromSession={state.isExtractFromSession}
        />
    );
  };

  const renderMessages = () => (
    <PreviewMessagesList
      messages={state.renderMessagesList}
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

  const headerIconSrc = `${EC_CHATBOT_URL}${getBotHeaderIconPath(state.botInfor, state.isOpen)}`;

  if (state.scenarioId && state.botInfor && state.isOpen) {
    const { frameClassName, cssVars } = buildOpeningBotStyle(state);
    return (
      <PreviewOpenChatFrame
        containerRef={containerRef}
        containerClassName={`sp-container1 ${isMobile() ? "slideUpSp" : "slideUp"}`}
        frameClassName={frameClassName}
        cssVars={cssVars}
        headerIconSrc={headerIconSrc}
        subtitle={state.botInfor?.subtitle}
        titleBubble={state.botInfor?.titleBubble}
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
      isMobileView={isMobile()}
      showFallback
      spCircleUseParentOffsets
      requireClosed
      hideWhenDisplayHidden={false}
    />
  );
}

export default PreviewFaq;
