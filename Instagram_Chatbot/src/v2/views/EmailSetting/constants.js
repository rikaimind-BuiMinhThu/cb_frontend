export const EMAILS_PATH = '/api/v1/managements/emails';
export const PAGE_SIZE = 25;
export const EMPTY_CELL = '—';

export const CREATE_EMAIL_LABEL = 'メール作成';
export const EDIT_TITLE = 'メール編集';
export const DUPLICATE_CONFIRM = '本当に複製しますか。';
export const DELETE_CONFIRM = '本当に削除しますか。';
export const CREATE_BUTTON = '作成';
export const LABEL_TEMPLATE_NAME = 'テンプレート名';
export const LABEL_SENDER = '差出人';
export const LABEL_TO = 'TO';
export const LABEL_TO_VALIDATE = '宛先';
export const LABEL_CC = 'CC';
export const LABEL_BCC = 'BCC（同報）';
export const LABEL_REPLY_TO = 'Reply-To';
export const LABEL_SUBJECT = '件名';
export const LABEL_CONTENT = 'メール内容';
export const LABEL_ACTION = 'アクション';

export const COL_TEMPLATE_NAME = 'テンプレート名';
export const COL_SUBJECT = '件名';
export const COL_TO = '宛先';
export const EXPAND_CONTENT_HEADER = 'メール内容';

export const PLACEHOLDER_TEMPLATE_NAME = 'テンプレート名は、必ず指定してください。';
export const PLACEHOLDER_SENDER = '差出人は、必ず指定してください。';
export const PLACEHOLDER_SUBJECT = '件名は、必ず指定してください。';
export const PLACEHOLDER_CONTENT = 'メール内容は、必ず指定してください。';
export const PLACEHOLDER_TO = 'no-reply@ec-chatbot.com';
export const PLACEHOLDER_CC = 'no-reply@ec-chatbot.com';
export const PLACEHOLDER_BCC = 'no-reply@botchan.chat';
export const PLACEHOLDER_REPLY_TO = 'no-reply@ec-chatbot.com';

export const DUPLICATE_SUCCESS = '正常に複製されました！';
export const DELETE_SUCCESS = '正常に削除されました！';
export const CREATE_SUCCESS = '正常に追加されました！!';
export const UPDATE_SUCCESS = '正常に更新されました！';

export const EMAIL_FORMAT_ERROR = 'メールの正しい形式で入力してください：abc@abc.com';
export const DUPLICATE_ERROR_TITLE = 'メール複製';
export const VARIABLE_REQUIRED = 'メールの変数を指定してください';

export const requiredMessage = (fieldLabel) => `${fieldLabel}は、必ず指定してください。`;
