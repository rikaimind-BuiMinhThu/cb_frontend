import _ from 'lodash';
import {
  isBotMessage,
  isUserMessage,
} from '../../PreviewComponent/Utils';
import {
  BOT_MESSAGE_TYPES,
  MESSAGE_CONTENT_TYPES,
  RENDER_MODES,
} from '../../PreviewComponent/Constants';

export const buildEditorDraftPreviewUpdate = (draft) => {
  const messagesList = _.cloneDeep(draft?.conversation?.messages || []);

  messagesList.filter(isBotMessage).forEach((message) => {
    message.hidden = false;
    message.message_content?.forEach((content) => {
      if (content.type === BOT_MESSAGE_TYPES.TEXT_INPUT) {
        content[content.type].originalContent = content[content.type].content;
      }
      if (content.type === BOT_MESSAGE_TYPES.DELAY && content.delay) {
        content.delay.content = 0;
      }
    });
  });

  messagesList.forEach((message) => {
    message.hidden = false;
  });

  const allMessages = messagesList;
  const currentMsgIndex = allMessages.length > 0 ? allMessages.length - 1 : 0;
  const nextStopMsgIndex = allMessages.length;

  const progressBarTargetCountMessagesList = messagesList.filter((msg) => {
    if (!isUserMessage(msg)) return false;

    const contentCount = msg?.message_content?.length;
    const firstMsgContent = msg?.message_content?.[0];
    const isDisplayBtnNext = firstMsgContent?.type !== MESSAGE_CONTENT_TYPES.IMAGE
      || firstMsgContent?.image?.displayButtonNext !== false;
    if (!isDisplayBtnNext) return false;
    if (firstMsgContent?.type === MESSAGE_CONTENT_TYPES.SUBMIT_BUTTON && contentCount === 1) {
      return false;
    }

    return true;
  });

  return {
    isEditorPreviewDraft: true,
    messagesList: allMessages,
    renderMessagesList: allMessages,
    currentMsgIndex,
    nextStopMsgIndex,
    isOpen: true,
    isProcessing: false,
    errors: {},
    submitErrorMessage: '',
    renderMode: RENDER_MODES.LAST,
    isUseBtnUpdateTracking: !!draft?.conversation?.isUseBtnUpdateTracking,
    urlThanksPage: draft?.conversation?.urlThanksPage || '',
    urlCartConfirmPage: draft?.conversation?.urlCartConfirmPage || '',
    isUsedCartConfirmPage: !!draft?.conversation?.isUsedCartConfirmPage,
    coupon: draft?.conversation?.coupon || '',
    merchandiseId: draft?.merchandise_id || '',
    isUsedCrosssell: !!draft?.is_used_crosssell,
    productIdCrossSell: draft?.product_id_cross_sell || '',
    isUsedCustomCss: !!draft?.is_used_custom_css,
    customCssContent: draft?.custom_css_content || '',
    isUsedCustomJsCode: false,
    headCustomJsCode: '',
    topBodyCustomJsCode: '',
    bottomBodyCustomJsCode: '',
    isUsedErrMsgByJs: !!draft?.is_used_err_msg_by_js,
    errMsgJsCode: draft?.err_msg_js_code || '',
    errMsgSettingMode: draft?.err_msg_setting_mode || 'js',
    errMsgFieldSelectors: draft?.err_msg_field_selectors || '',
    errMsgFormSelectors: draft?.err_msg_form_selectors || '',
    launchButtonSelectors: draft?.launch_button_selectors || '',
    progressBarMaxIndex: progressBarTargetCountMessagesList.length,
  };
};
