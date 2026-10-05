import { USER_CHATBOTS_PATH } from './addSubUserConstants';

export const getUserChatbotsByBotPath = (botId) =>
  `${USER_CHATBOTS_PATH}?chatbot_id=${botId}`;

export const getUserChatbotItemPath = (id) => `${USER_CHATBOTS_PATH}/${id}`;

export const PAGE_DESCRIPTION =
  '利用中のプランのボットの管理者として追加されているユーザーを表示します。EC-CHATBOTのアカウントを持たないユーザーを管理者に追加したい場合は、招待ボタンからユーザーを招待してからボットの管理者を追加してください。';
export const INVITE_USER_LABEL = 'ユーザー招待';
export const EDIT_MODAL_TITLE = 'サブユーザ編集';
export const UPDATE_BUTTON_LABEL = '更新';
export const DELETE_SUCCESS_MESSAGE = '正常に削除されました！';
export const EDIT_SUCCESS_MESSAGE = '正常に編集されました！';
export const DELETE_CONFIRM_MESSAGE = '本当に削除しますか。';
export const ROLE_REQUIRED_MESSAGE = '権限を選択してください。';
export const COL_NUMBER = '番号';
export const COL_ACTIONS = 'アクション';
export const COL_ID_WIDTH = 80;
export const COL_ROLE_WIDTH = 120;
export const COL_ACTIONS_WIDTH = 160;
export const EDIT_MODAL_WIDTH = 480;
export const FORM_LABEL_COL = { flex: '0 0 140px' };
export const FORM_WRAPPER_COL = { flex: 1 };
export const LABEL_ALIGN_LEFT = 'left';
